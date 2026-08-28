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
    booklet: $("booklet"), pages: $("pages"), sheets: $("sheets"),
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
  /* Saddle stitch. Every A4 sheet, printed landscape and double sided, holds
     four A5 pages: two per side. Fold the sheet down the middle, nest the
     sheets in order, staple the fold. No cutting.
     So the pages must be imposed: page 1 shares a sheet side with the last
     page, page 2 with the second last, and so on inward. */

  function div(cls) { var d = document.createElement("div"); d.className = cls; return d; }

  // returns [[left, right], ...], one entry per printed side, 1-based,
  // 0 means a blank half. Reading order is padded to a multiple of 4.
  function impose(count) {
    var total = Math.ceil(count / 4) * 4;
    var sides = [];
    for (var i = 0; i < total / 4; i++) {
      sides.push([total - 2 * i, 1 + 2 * i]);          // front of sheet i
      sides.push([2 + 2 * i, total - 1 - 2 * i]);      // back of sheet i
    }
    return sides.map(function (pair) {
      return pair.map(function (n) { return n > count ? 0 : n; });
    });
  }

  function coverLeaf() {
    var p = div("page page--cover");
    var h = document.createElement("h1");
    h.className = "page__title";
    h.textContent = document.title;
    p.appendChild(h);
    var sub = document.createElement("p");
    sub.className = "page__sub";
    sub.textContent = trail.length + " scenes";
    p.appendChild(sub);
    return p;
  }

  function sceneLeaf(t, i) {
    var p = div("page");

    var n = div("page__num");
    n.textContent = String(i + 1);
    p.appendChild(n);

    var inner = div("page__inner");

    if (t.art) {
      var im = document.createElement("img");
      im.className = "page__art";
      im.alt = "";
      im.addEventListener("error", function () { im.remove(); });
      im.src = t.art;
      inner.appendChild(im);
    }

    var body = div("page__text");
    paragraphs(body, t.text);
    inner.appendChild(body);

    t.probes.forEach(function (label) {
      var pr = document.createElement("p");
      pr.className = "page__probe";
      pr.textContent = label;
      inner.appendChild(pr);
    });

    if (t.choice) {
      var ch = document.createElement("p");
      ch.className = "page__choice";
      ch.textContent = t.choice;
      inner.appendChild(ch);
    }

    p.appendChild(inner);
    return p;
  }

  function buildBooklet() {
    var leaves = [coverLeaf()];
    trail.forEach(function (t, i) { leaves.push(sceneLeaf(t, i)); });

    // screen: one A5 page at a time, at true proportions
    el.pages.innerHTML = "";
    leaves.forEach(function (leaf) {
      var wrap = div("page-wrap");
      wrap.appendChild(leaf);
      el.pages.appendChild(wrap);
    });

    // print: imposed A4 sheets
    el.sheets.innerHTML = "";
    impose(leaves.length).forEach(function (pair, side) {
      var sheet = div("sheet" + (side % 2 ? " sheet--back" : " sheet--front"));
      var rot = div("sheet__rot");   // print.css turns this sideways on the paper
      pair.forEach(function (n, k) {
        var half = div("half half--" + (k === 0 ? "left" : "right"));
        if (n) half.appendChild(leaves[n - 1].cloneNode(true));
        rot.appendChild(half);
      });
      sheet.appendChild(rot);
      el.sheets.appendChild(sheet);
    });

    fitPreview();
    flagOverflow();
  }

  // scale the true-size A5 preview down to the column width
  function fitPreview() {
    var wrap = el.pages.querySelector(".page-wrap");
    if (!wrap) return;
    var A5_W_PX = 148.5 * (96 / 25.4);
    el.pages.style.setProperty("--preview-scale", wrap.clientWidth / A5_W_PX);
  }

  // warn while writing: a scene that will not fit on one A5 page
  function flagOverflow() {
    el.pages.querySelectorAll(".page").forEach(function (p) {
      var inner = p.querySelector(".page__inner") || p;
      p.classList.toggle("page--overflow", inner.scrollHeight > inner.clientHeight + 1);
    });
  }

  function openBooklet() {
    buildBooklet();
    el.booklet.hidden = false;
    document.body.classList.add("reading");
    el.booklet.scrollTop = 0;
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { fitPreview(); flagOverflow(); });
  }

  function closeBooklet() {
    el.booklet.hidden = true;
    document.body.classList.remove("reading");
  }

  /* ---- boot -------------------------------------------------------- */

  $("bk-print").addEventListener("click", function () { window.print(); });
  $("bk-flip").addEventListener("change", function () {
    document.body.classList.toggle("flip-long", this.checked);
  });
  window.addEventListener("resize", function () { fitPreview(); flagOverflow(); });
  $("bk-back").addEventListener("click", closeBooklet);
  $("bk-restart").addEventListener("click", restart);

  if (!load()) go(START);
})();
