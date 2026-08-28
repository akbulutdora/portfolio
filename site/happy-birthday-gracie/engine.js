/* Engine. Renders one node at a time, remembers the trail, binds the booklet.
   Plain script, no modules, so the page also runs from file://. */
(function () {
  "use strict";

  var SAVE_KEY = "hbg-save-v1";

  var state = {};   // flags written by choices
  var trail = [];   // one entry per node visited, in order
  var current = null;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    card: $("card"), art: $("art"), img: $("art-img"),
    body: document.querySelector(".body"),
    text: $("text"), choices: $("choices"),
    booklet: $("booklet"), pages: $("pages"),
  };

  function val(x) { return typeof x === "function" ? x(state) : x; }

  // no GIF drawn yet: keep the dashed box instead of a broken image icon
  el.img.addEventListener("error", function () {
    el.art.classList.add("art--missing");
  });

  function paragraphs(into, str) {
    into.innerHTML = "";
    String(str).split(/\n\s*\n/).forEach(function (chunk) {
      var p = document.createElement("p");
      p.innerHTML = chunk.trim();
      into.appendChild(p);
    });
  }

  /* ---- rendering --------------------------------------------------- */

  function render(id) {
    var node = STORY[id];
    var art = val(node.art);
    var text = val(node.text);

    if (art) { el.img.src = art; el.img.alt = val(node.alt) || ""; el.art.hidden = false; }
    else { el.art.hidden = true; }
    el.art.classList.remove("art--missing");

    paragraphs(el.text, text);

    el.choices.innerHTML = "";
    (node.choices || []).forEach(function (c) {
      if (c.if && !c.if(state)) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = val(c.label);
      b.addEventListener("click", function () { choose(c); });
      el.choices.appendChild(b);
    });

    if (node.end) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice choice--bind";
      b.textContent = "Bind this into a booklet";
      b.addEventListener("click", openBooklet);
      el.choices.appendChild(b);
    }

    el.card.classList.remove("is-fading");
    void el.card.offsetWidth;          // restart the fade
    el.card.classList.add("is-fading");
    if (el.body) el.body.scrollTop = 0;

    return { art: art, text: text };
  }

  /* ---- moving ------------------------------------------------------ */

  function go(id) {
    if (!STORY[id]) { console.error("unknown node:", id); return; }
    current = id;
    var r = render(id);
    trail.push({ id: id, art: r.art, text: r.text, choice: null, probes: [] });
    save();
  }

  function refresh() {                 // same node, flags changed
    var r = render(current);
    var t = trail[trail.length - 1];
    t.art = r.art; t.text = r.text;
    save();
  }

  function choose(c) {
    if (c.set) Object.assign(state, c.set);
    var here = trail[trail.length - 1];
    if (c.stay) { here.probes.push(val(c.label)); refresh(); return; }
    here.choice = val(c.label);
    go(val(c.to));
  }

  /* ---- save -------------------------------------------------------- */

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(
        { current: current, state: state, trail: trail }));
    } catch (e) { /* private mode: play without a save */ }
  }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
    if (!raw) return false;
    try {
      var d = JSON.parse(raw);
      if (!d || !STORY[d.current]) return false;   // story changed under the save
      state = d.state || {};
      trail = d.trail || [];
      current = d.current;
      render(current);
      return true;
    } catch (e) { return false; }
  }

  function restart() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    state = {}; trail = []; closeBooklet(); go(START);
  }

  /* ---- booklet ----------------------------------------------------- */

  function page(cls) {
    var d = document.createElement("div");
    d.className = "page" + (cls ? " " + cls : "");
    return d;
  }

  function buildBooklet() {
    el.pages.innerHTML = "";

    var cover = page("page--cover");
    var h = document.createElement("h1");
    h.className = "page__title";
    h.textContent = document.title;
    cover.appendChild(h);
    var sub = document.createElement("p");
    sub.className = "page__sub";
    sub.textContent = trail.length + " scenes";
    cover.appendChild(sub);
    el.pages.appendChild(cover);

    trail.forEach(function (t, i) {
      var p = page();

      var n = document.createElement("div");
      n.className = "page__num";
      n.textContent = String(i + 1);
      p.appendChild(n);

      if (t.art) {
        var im = document.createElement("img");
        im.className = "page__art";
        im.alt = "";
        im.addEventListener("error", function () { im.remove(); });
        im.src = t.art;
        p.appendChild(im);
      }

      var body = document.createElement("div");
      body.className = "page__text";
      paragraphs(body, t.text);
      p.appendChild(body);

      t.probes.forEach(function (label) {
        var pr = document.createElement("p");
        pr.className = "page__probe";
        pr.textContent = label;
        p.appendChild(pr);
      });

      if (t.choice) {
        var ch = document.createElement("p");
        ch.className = "page__choice";
        ch.textContent = t.choice;
        p.appendChild(ch);
      }

      el.pages.appendChild(p);
    });
  }

  function openBooklet() {
    buildBooklet();
    el.booklet.hidden = false;
    document.body.classList.add("reading");
    el.booklet.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function closeBooklet() {
    el.booklet.hidden = true;
    document.body.classList.remove("reading");
  }

  /* ---- boot -------------------------------------------------------- */

  $("bk-print").addEventListener("click", function () { window.print(); });
  $("bk-back").addEventListener("click", closeBooklet);
  $("bk-restart").addEventListener("click", restart);

  if (!load()) go(START);
})();
