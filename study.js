/* Arpan Sheth — case study behaviour: contents highlighting, image lightbox
   and before/after sliders. Styles live in study.css. */
(function () {
  "use strict";

  /* ---------- Contents: highlight the section being read ---------- */
  var toc = document.querySelector(".study-toc");
  if (toc) {
    var details = toc.querySelector("details");
    if (details && matchMedia("(max-width: 1000px)").matches) details.open = false;

    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    var sections = links
      .map(function (a) {
        return document.getElementById(a.getAttribute("href").slice(1));
      })
      .filter(Boolean);

    var ticking = false;
    function update() {
      ticking = false;
      var line = window.innerHeight * 0.3;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top <= line) current = s;
      });
      // At the very bottom, the last section is the one being read.
      var last = sections[sections.length - 1];
      if (last && last.getBoundingClientRect().bottom <= window.innerHeight) current = last;
      links.forEach(function (a) {
        if (current && a.getAttribute("href") === "#" + current.id) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();

    links.forEach(function (a) {
      a.addEventListener("click", function () {
        if (details && matchMedia("(max-width: 1000px)").matches) details.open = false;
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var zooms = document.querySelectorAll("a.study-zoom");
  if (zooms.length && typeof HTMLDialogElement === "function") {
    var box = document.createElement("dialog");
    box.className = "study-lightbox";
    box.setAttribute("aria-label", "Enlarged project image");
    box.innerHTML = '<form method="dialog"><button type="submit" aria-label="Close enlarged image">Close ×</button></form><img alt="" /><p></p>';
    document.body.appendChild(box);
    var big = box.querySelector("img");
    var caption = box.querySelector("p");
    var opener = null;

    Array.prototype.forEach.call(zooms, function (a) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        var img = a.querySelector("img");
        opener = a;
        big.src = a.getAttribute("href");
        big.alt = img ? img.alt : "";
        caption.textContent = img ? img.alt : "";
        box.showModal();
      });
    });
    box.addEventListener("click", function (e) {
      if (e.target === box) box.close();
    });
    box.addEventListener("close", function () {
      if (opener) opener.focus();
    });
  }

  /* ---------- Before / after ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".study-compare-stage"), function (stage) {
    var range = stage.querySelector("input[type=range]");
    if (!range) return;
    function set() {
      stage.style.setProperty("--reveal", range.value + "%");
      range.setAttribute("aria-valuetext", range.value + "% before, " + (100 - range.value) + "% after");
    }
    range.addEventListener("input", set);
    set();
  });
})();
