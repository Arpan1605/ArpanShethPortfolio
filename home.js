/* Arpan Sheth — homepage interactions: project hover previews,
   signature replay, the "love" word and gentle scroll reveals.
   The theme switch lives in chrome.js; the pixel sky and meadow are drawn by pixels.js. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var announce = document.getElementById("announce");

  function say(text) {
    if (!announce) return;
    announce.textContent = "";
    setTimeout(function () { announce.textContent = text; }, 30);
  }

  /* ---------- Project previews ---------- */

  var canPreview = window.matchMedia("(min-width: 1101px) and (hover: hover)");
  var loaded = false;

  // Screens are large, so they load once the visitor is near the work list.
  function loadScreens() {
    if (loaded) return;
    loaded = true;
    document.querySelectorAll(".screen[data-src]").forEach(function (img) {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }

  var work = document.getElementById("work");
  if (work && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting && canPreview.matches) { loadScreens(); obs.disconnect(); }
    }, { rootMargin: "300px" }).observe(work);
  }

  var clearTimer = 0;
  document.querySelectorAll(".project").forEach(function (card) {
    var key = card.getAttribute("data-project");
    function on() {
      if (!canPreview.matches) return;
      loadScreens();
      clearTimeout(clearTimer);
      root.setAttribute("data-preview", key);
    }
    function off() {
      clearTimeout(clearTimer);
      clearTimer = setTimeout(function () { root.removeAttribute("data-preview"); }, 60);
    }
    card.addEventListener("pointerenter", on);
    card.addEventListener("pointerleave", off);
    card.addEventListener("focusin", on);
    card.addEventListener("focusout", off);
  });
  window.addEventListener("pageshow", function () { root.removeAttribute("data-preview"); });

  /* ---------- Signature replay ---------- */

  var mark = document.getElementById("mark");
  if (mark) {
    // Swapping between two identical keyframe names restarts the drawing.
    // Hover redraws too, at most once per drawing.
    var drawing = true;
    setTimeout(function () { drawing = false; }, 1700);
    function redraw() {
      if (drawing) return;
      drawing = true;
      setTimeout(function () { drawing = false; }, 1700);
      mark.querySelectorAll(".mark__stroke").forEach(function (p) {
        p.style.animationName = p.style.animationName === "draw-again" ? "draw" : "draw-again";
      });
    }
    mark.addEventListener("click", redraw);
    mark.addEventListener("pointerenter", redraw);
  }

  /* ---------- "love" sends the birds ---------- */

  var love = document.querySelector(".love-word");
  if (love) {
    love.addEventListener("click", function () {
      love.classList.add("is-waving");
      setTimeout(function () { love.classList.remove("is-waving"); }, 1800);
      if (window.PixelSky) window.PixelSky.flock();
      if (!reduce && window.scrollY > 200) window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Gentle scroll reveals ---------- */

  // Arriving with a #hash (e.g. "Contact" from a case page): the footer is
  // injected after the browser's first jump, so jump again once it exists.
  if (location.hash.length > 1) {
    window.addEventListener("load", function () {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    });
  }

  // Items below the fold fade up as they scroll into view. A plain scroll
  // check (no observers) so nothing can be left hidden.
  if (!reduce && !location.hash) {
    var pending = [];
    document.querySelectorAll(".work .project, .block > .label, .about, .stats, .clients, .text-link, .numbered li, .xp li, .awards li").forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add("reveal");
      pending.push(el);
    });
    var ticking = false;
    function check() {
      ticking = false;
      var limit = innerHeight * 0.94;
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top > limit) return true;
        el.classList.add("is-in");
        return false;
      });
      if (!pending.length) {
        removeEventListener("scroll", onScroll);
        removeEventListener("resize", onScroll);
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    }
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
  }
})();
