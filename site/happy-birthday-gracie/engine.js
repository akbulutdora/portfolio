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
    poem: $("poem"), poemLines: $("poem-lines"), tail: $("tail"),
    audio: $("pl-audio"), toggle: $("pl-toggle"), seek: $("pl-seek"),
  };

  function val(x) { return typeof x === "function" ? x(state) : x; }

  // Art that failed to load. Setting img.src to the same URL fires no second
  // error event, so without this a re-render of the same node (a probe) would
  // drop the dashed box and show a broken image icon instead.
  var badArt = Object.create(null);
  el.img.addEventListener("error", function () {
    badArt[el.img.getAttribute("src")] = true;
    el.art.classList.add("art--missing");
  });

  // Clones lose their listeners, so catch image errors on the way down instead.
  ["pages", "sheets"].forEach(function (k) {
    el[k].addEventListener("error", function (e) {
      if (e.target && e.target.tagName === "IMG") { badArt[e.target.getAttribute("src")] = true; e.target.remove(); }
    }, true);
  });
  // A page measured before its art loads looks shorter than it prints.
  el.pages.addEventListener("load", function (e) {
    if (e.target && e.target.tagName === "IMG") flagOverflow();
  }, true);

  function fail(message) {
    el.art.hidden = true;
    el.choices.innerHTML = "";
    paragraphs(el.text, message);
    console.error(message);
  }

  function paragraphs(into, str) {
    into.innerHTML = "";
    String(str).split(/\n\s*\n/).forEach(function (chunk) {
      var t = chunk.trim();
      if (!t) return;
      var p = document.createElement("p");
      // A speaker line is the name and a colon, nothing else: "gracie:" colours,
      // "gracie has taken the cake out of the oven." does not.
      if (/^gracie\s*:/i.test(t)) p.className = "say say--g";
      else if (/^dory\s*:/i.test(t)) p.className = "say say--d";
      p.innerHTML = t;
      into.appendChild(p);
    });
  }

  /* ---- rendering --------------------------------------------------- */

  function render(id) {
    var node = STORY[id];
    var art = val(node.art);
    var text = val(node.text);

    if (art) {
      el.art.hidden = false;
      el.art.classList.toggle("art--missing", !!badArt[art]);
      if (el.img.getAttribute("src") !== art) el.img.src = art;
      el.img.alt = val(node.alt) || "";
    } else {
      el.art.hidden = true;
    }

    renderAudio(node.audio);
    var tail = val(node.tail) || "";
    el.tail.innerHTML = tail;
    el.tail.hidden = !tail;
    el.text.classList.toggle("is-heading", !!node.heading);
    el.card.classList.toggle("card--title", !!node.heading);
    el.card.classList.toggle("card--flow", !!node.flow);
    paragraphs(el.text, text);

    el.choices.innerHTML = "";
    (node.choices || []).forEach(function (c) {
      if (c.if && !c.if(state)) return;
      var label = val(c.label);
      if (!label) return;               // Dora has not written this one yet
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.appendChild(document.createTextNode(label));
      if (c.note) {
        var note = document.createElement("span");
        note.className = "choice__note";
        note.textContent = val(c.note);
        b.appendChild(note);
      }
      b.addEventListener("click", function () { b.blur(); choose(c); });
      el.choices.appendChild(b);
    });

    if (node.end && UI.bind) {
      var bb = document.createElement("button");
      bb.type = "button";
      bb.className = "choice choice--bind";
      bb.textContent = UI.bind;
      bb.addEventListener("click", openBooklet);
      el.choices.appendChild(bb);
    }

    el.card.classList.remove("is-fading");
    void el.card.offsetWidth;          // restart the fade
    el.card.classList.add("is-fading");
    if (el.body) el.body.scrollTop = 0;

    return { art: art, text: text, tail: tail };
  }

  /* ---- the poem, read aloud ----------------------------------------- */
  /* One entry per handwritten line, each with the second it begins. The line
     whose turn it is lights up. Before the first line's time nothing is lit:
     the recording opens with silence and that silence is part of the reading. */

  var poemLines = [];

  function renderAudio(spec) {
    if (!spec || !spec.src) {
      el.poem.hidden = true;
      poemLines = [];
      if (!el.audio.paused) el.audio.pause();
      return;
    }
    if (el.audio.getAttribute("src") !== spec.src) {
      el.audio.pause();
      el.audio.setAttribute("src", spec.src);
      el.seek.value = 0;
    }
    poemLines = spec.lines || [];
    el.poemLines.innerHTML = "";
    poemLines.forEach(function (ln, i) {
      var d = div("poem__line");
      d.dataset.i = String(i);
      d.innerHTML = ln.html || "";
      el.poemLines.appendChild(d);
    });
    el.poemLines.hidden = poemLines.length === 0;
    el.poem.hidden = false;
  }

  function lineAt(t) {
    var found = -1;
    for (var i = 0; i < poemLines.length; i++) {
      if (t >= poemLines[i].at) found = i; else break;
    }
    return found;
  }

  function paintLine() {
    var now = lineAt(el.audio.currentTime);
    var all = el.poemLines.children;
    for (var i = 0; i < all.length; i++) {
      all[i].classList.toggle("is-now", i === now);
    }
  }

  el.toggle.addEventListener("click", function () {
    if (el.audio.paused) el.audio.play(); else el.audio.pause();
  });
  el.audio.addEventListener("play", function () {
    el.toggle.classList.add("is-playing");
    el.toggle.setAttribute("aria-label", "pause");
  });
  el.audio.addEventListener("pause", function () {
    el.toggle.classList.remove("is-playing");
    el.toggle.setAttribute("aria-label", "play");
  });
  el.audio.addEventListener("timeupdate", function () {
    if (el.audio.duration) {
      el.seek.value = String(Math.round(el.audio.currentTime / el.audio.duration * 1000));
    }
    paintLine();
  });
  el.audio.addEventListener("ended", function () { paintLine(); });
  el.seek.addEventListener("input", function () {
    if (el.audio.duration) {
      el.audio.currentTime = el.seek.value / 1000 * el.audio.duration;
      paintLine();
    }
  });

  /* ---- moving ------------------------------------------------------ */

  function go(id) {
    if (!STORY[id]) { fail("This path leads to a node that does not exist: " + id); return; }
    current = id;
    var r = render(id);
    trail.push({ id: id, art: r.art, text: r.text, tail: r.tail, choice: null, probes: [] });
    save();
  }

  function refresh() {                 // same node, flags changed
    var r = render(current);
    var t = trail[trail.length - 1];
    t.art = r.art; t.text = r.text; t.tail = r.tail;
    save();
  }

  function choose(c) {
    if (c.set) Object.assign(state, c.set);
    if (!trail.length) trail.push({ id: current, art: null, text: "", choice: null, probes: [] });
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
      if (!Array.isArray(d.trail) || !d.trail.length) return false;
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
    if (UI.coverArt) {
      var im = document.createElement("img");
      im.className = "page__cover-art";
      im.alt = "";
      im.src = UI.coverArt;
      p.appendChild(im);
    }
    if (UI.coverTitle) {
      var h = document.createElement("h1");
      h.className = "page__title";
      h.textContent = UI.coverTitle;
      p.appendChild(h);
    }
    return p;
  }

  function sceneLeaf(t) {
    var p = div("page");
    var inner = div("page__inner");

    if (t.art && !badArt[t.art]) {
      var im = document.createElement("img");
      im.className = "page__art";
      im.alt = "";
      im.src = t.art;
      inner.appendChild(im);
    }

    var body = div("page__text");
    paragraphs(body, t.text);
    inner.appendChild(body);

    if (t.tail) {
      var tl = div("page__tail");
      tl.innerHTML = t.tail;
      inner.appendChild(tl);
    }

    if (t.choice) {
      var ch = document.createElement("p");
      ch.className = "page__choice";
      ch.textContent = t.choice;
      inner.appendChild(ch);
    }

    p.appendChild(inner);
    return p;
  }

  /* Build in three passes. The pages have to exist and be visible before the
     browser can say whether anything overflows, and the handwritten letter runs
     far past one A5 page, so it is split only after it has been measured. */

  function buildLeaves() {
    el.pages.innerHTML = "";
    el.sheets.innerHTML = "";
    var leaves = [coverLeaf()];
    trail.forEach(function (t) {
      var node = STORY[t.id];
      if (node && node.noPrint) return;     // the cover already carries it
      leaves.push(sceneLeaf(t));
    });
    leaves.forEach(function (leaf) {
      var wrap = div("page-wrap");
      wrap.appendChild(leaf);
      el.pages.appendChild(wrap);
    });
  }

  // Move trailing blocks onto a fresh page until what is left fits. The art
  // stays on the first page of a scene and the choice ends up on the last,
  // because both ride along with the blocks around them.
  function splitLongPages() {
    var wraps = [].slice.call(el.pages.children);
    var guard = 0;
    wraps.forEach(function (wrap) {
      var page = wrap.firstChild;
      var inner = page.querySelector(".page__inner");
      while (inner && inner.scrollHeight > inner.clientHeight + 1 &&
             inner.children.length > 1 && guard++ < 400) {
        var next = div("page");
        var ni = div("page__inner");
        next.appendChild(ni);
        while (inner.scrollHeight > inner.clientHeight + 1 && inner.children.length > 1) {
          ni.insertBefore(inner.lastChild, ni.firstChild);
        }
        // A single paragraph can be taller than a whole page. When that is all
        // that is left, break inside it and carry the tail words over.
        if (inner.scrollHeight > inner.clientHeight + 1 && inner.children.length === 1) {
          var block = inner.firstChild;
          var lastP = block.lastElementChild || block;
          if (lastP && lastP.childNodes.length > 1) {
            var carry = document.createElement(lastP.tagName || "p");
            carry.className = lastP.className;
            while (inner.scrollHeight > inner.clientHeight + 1 &&
                   lastP.childNodes.length > 1) {
              carry.insertBefore(lastP.lastChild, carry.firstChild);
            }
            var holder = div(block.className);
            holder.appendChild(carry);
            ni.insertBefore(holder, ni.firstChild);
          }
        }
        var nw = div("page-wrap");
        nw.appendChild(next);
        el.pages.insertBefore(nw, wrap.nextSibling);
        wrap = nw; page = next; inner = ni;
      }
    });
  }

  function numberPages() {
    var n = 0;
    [].forEach.call(el.pages.querySelectorAll(".page"), function (pg) {
      if (pg.classList.contains("page--cover")) return;
      n += 1;
      var old = pg.querySelector(".page__num");
      if (old) old.remove();
      var d = div("page__num");
      d.textContent = String(n);
      pg.insertBefore(d, pg.firstChild);
    });
  }

  // the cover alone, then two pages to a row, as the sheet folds
  function groupSpreads() {
    var pages = [].map.call(el.pages.querySelectorAll(".page"), function (p) { return p; });
    el.pages.innerHTML = "";
    var groups = [[pages[0]]];
    for (var i = 1; i < pages.length; i += 2) groups.push(pages.slice(i, i + 2));
    groups.forEach(function (group) {
      var sp = div("spread" + (group.length === 1 ? " spread--single" : ""));
      group.forEach(function (pg) {
        var wrap = div("page-wrap");
        wrap.appendChild(pg);
        sp.appendChild(wrap);
      });
      el.pages.appendChild(sp);
    });
    return pages;
  }

  function buildSheets(pages) {
    el.sheets.innerHTML = "";
    impose(pages.length).forEach(function (pair, side) {
      var sheet = div("sheet" + (side % 2 ? " sheet--back" : " sheet--front"));
      var rot = div("sheet__rot");   // print.css turns this sideways on the paper
      pair.forEach(function (n, k) {
        var half = div("half half--" + (k === 0 ? "left" : "right"));
        if (n) half.appendChild(pages[n - 1].cloneNode(true));
        rot.appendChild(half);
      });
      sheet.appendChild(rot);
      el.sheets.appendChild(sheet);
    });
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
    el.booklet.hidden = false;
    document.body.classList.add("reading");
    el.booklet.scrollTop = 0;
    window.scrollTo(0, 0);
    buildLeaves();
    // measure only once the pages are on screen and their art has settled
    requestAnimationFrame(function () {
      splitLongPages();
      numberPages();
      buildSheets(groupSpreads());
      fitPreview();
      flagOverflow();
    });
  }

  function closeBooklet() {
    el.booklet.hidden = true;
    document.body.classList.remove("reading");
  }

  /* ---- boot -------------------------------------------------------- */

  $("bk-print").addEventListener("click", function () { window.print(); });
  window.addEventListener("resize", function () { fitPreview(); flagOverflow(); });
  $("bk-restart").addEventListener("click", restart);

  // Recovery with no interface: thoughtassault.dev/happy-birthday-gracie/?flip=1
  // turns every back sheet 180 degrees, for a printer that flips the other way.
  if (/[?&]flip=1/.test(location.search)) document.body.classList.add("flip-long");

  /* ---- authoring check ---------------------------------------------- */
  /* Runs on every load and only writes to the console. Gracie never sees it. */

  function checkStory() {
    var ids = Object.keys(STORY), linked = Object.create(null), bad = [];
    linked[START] = true;
    if (!STORY[START]) bad.push('START names a node that does not exist: "' + START + '"');

    ids.forEach(function (id) {
      var n = STORY[id], cs = n.choices || [];
      if (!cs.length && !n.end) bad.push(id + ": no choices and no end:true, so the reader gets stuck here");
      if (!n.art && typeof n.text === "string" && !n.text.trim()) bad.push(id + ": no text and no art, so the card renders empty");
      cs.forEach(function (c, i) {
        var at = id + " choice " + i;
        if (!c.label) bad.push(at + ": no label");
        if (c.stay) {
          if (c.to) bad.push(at + ": has both stay and to, so to is ignored");
          if (!c.set) bad.push(at + ": stay with no set, so nothing changes and the choice never goes away");
        } else if (typeof c.to === "string") {
          if (!STORY[c.to]) bad.push(at + ': goes to a node that does not exist: "' + c.to + '"');
          linked[c.to] = true;
        } else if (typeof c.to !== "function") {
          bad.push(at + ": no to");
        }
      });
    });

    ids.forEach(function (id) { if (!linked[id]) bad.push(id + ": nothing links to it"); });

    if (typeof UI === "undefined" || !UI.bind) bad.push('UI.bind is empty, so the ending shows no button and the booklet can not be opened');
    if (typeof UI === "undefined" || !UI.coverTitle) bad.push("UI.coverTitle is empty, so the booklet cover prints blank");

    var ends = ids.filter(function (id) { return STORY[id].end; });
    if (!ends.length) bad.push("no node has end:true, so the booklet can never open");
    if (ends.length > 1) bad.push("more than one node has end:true (" + ends.join(", ") + "); the story is meant to converge");
    return bad;
  }

  /* ---- boot ---------------------------------------------------------- */

  if (typeof STORY === "undefined" || typeof START === "undefined") {
    fail("story.js did not load. Check the browser console for a syntax error in it.");
    return;
  }

  try {
    var problems = checkStory();
    if (problems.length) {
      console.warn("story check: " + problems.length + " problem(s)");
      problems.forEach(function (m) { console.warn("  " + m); });
    } else {
      console.log("story check: " + Object.keys(STORY).length + " nodes, no problems");
    }
  } catch (e) { console.warn("story check failed to run:", e); }

  if (!load()) go(START);
})();
