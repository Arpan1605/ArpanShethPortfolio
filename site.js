/* Arpan Sheth — shared interactions for every page.
   Needs chrome.js (header/footer markup) and, for motion, GSAP + ScrollTrigger +
   Lenis loaded before it. Everything degrades to a static page when those fail
   to load or the visitor prefers reduced motion.
   Exposes window.Site for page scripts such as home.js. */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var motion = hasGsap && !reduceMotion;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  root.classList.add("js");
  if (window.SiteChrome) window.SiteChrome.renderFooter();
  if (!motion) {
    root.classList.add("no-motion");
    root.classList.remove("is-loading");
  }

  /* ---------- Hover label roll ---------- */

  $$(".roll > span").forEach(function (span) {
    if (span.querySelector(".roll__in")) return;
    var inner = document.createElement("span");
    inner.className = "roll__in";
    inner.textContent = span.textContent;
    span.textContent = "";
    span.appendChild(inner);
  });

  /* ---------- Theme toggle (homepage keeps its light/dark switch) ---------- */

  var themeBtn = $("#themeToggle");
  function syncThemeLabel() {
    if (!themeBtn) return;
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeBtn) {
    syncThemeLabel();
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (next === "dark") root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
      try { localStorage.setItem("arpan-wall-theme", next); } catch (e) {}
      syncThemeLabel();
    });
  }

  /* ---------- Contextual cursor ---------- */

  var cursor = $(".cursor");
  var cursorText = cursor && $(".cursor__text", cursor);
  var cursorIcon = cursor && $(".cursor__icon", cursor);
  var cursorTarget = null;

  function setCursorLabel(text) {
    if (cursorText) cursorText.textContent = text;
  }

  if (cursor && finePointer) {
    root.classList.add("has-cursor");
    var moveX, moveY;
    if (motion) {
      moveX = window.gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3.out" });
      moveY = window.gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3.out" });
    }
    window.addEventListener("pointermove", function (e) {
      if (moveX) { moveX(e.clientX); moveY(e.clientY); }
      else cursor.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
    }, { passive: true });

    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest ? e.target.closest("[data-cursor]") : null;
      if (t === cursorTarget) return;
      cursorTarget = t;
      if (!t) { cursor.classList.remove("is-visible"); return; }
      setCursorLabel(t.getAttribute("data-cursor"));
      if (cursorIcon) cursorIcon.textContent = t.getAttribute("data-cursor-icon") || "";
      cursor.classList.remove("cursor--light", "cursor--accent");
      var theme = t.getAttribute("data-cursor-theme");
      if (theme) cursor.classList.add("cursor--" + theme);
      cursor.classList.add("is-visible");
    });
    document.addEventListener("pointerleave", function () {
      cursorTarget = null;
      cursor.classList.remove("is-visible");
    });
  }

  /* ---------- Copy to clipboard ---------- */

  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var text = btn.getAttribute("data-copy");
      var success = btn.getAttribute("data-cursor-success") || "Copied!";
      var done = function () {
        if (cursorTarget === btn) setCursorLabel(success);
        var label = btn.textContent;
        if (!finePointer) {
          btn.textContent = success;
          setTimeout(function () { btn.textContent = label; }, 1600);
        }
        setTimeout(function () { if (cursorTarget === btn) setCursorLabel(btn.getAttribute("data-cursor")); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      else done();
    });
  });

  /* ---------- Header state ---------- */

  var header = $(".site-header");
  var headerNav = $(".site-header__nav");
  var page = $(".page");
  var darkZones = $$("[data-nav-dark]");

  function updateHeader() {
    var y = window.scrollY || window.pageYOffset;
    var scrolled = y > 40;
    root.classList.toggle("is-scrolled", scrolled);
    if (headerNav) headerNav.classList.toggle("is-pill", scrolled);
    if (!header) return;
    var mid = header.offsetHeight / 2;
    var pageBottom = page ? page.getBoundingClientRect().bottom : Infinity;
    root.classList.toggle("footer-in-view", pageBottom < window.innerHeight * 0.8);
    var onDark = pageBottom < mid;
    for (var i = 0; !onDark && i < darkZones.length; i++) {
      var r = darkZones[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) onDark = true;
    }
    root.classList.toggle("header-on-dark", onDark);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader);
  updateHeader();

  /* ---------- Static fallback ---------- */

  if (!motion) {
    setupStaticMenu();
    window.Site = { motion: false, scrollTo: function (t) {
      var el = typeof t === "string" ? $(t) : t;
      if (el && el.scrollIntoView) el.scrollIntoView();
      else window.scrollTo(0, typeof t === "number" ? t : 0);
    } };
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */

  var lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({
      duration: 0.96,
      easing: function (t) { return 1 - Math.pow(1 - t, 4); },
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target, opts) {
    if (target === "#contact" || target === "bottom") target = document.documentElement.scrollHeight;
    if (lenis) {
      lenis.scrollTo(target, Object.assign({ offset: -(header ? header.offsetHeight + 12 : 20), duration: 1.2 }, opts || {}));
      return;
    }
    var el = typeof target === "string" ? $(target) : target;
    if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Split text into masked lines ---------- */

  function splitLines(el) {
    if (!el.dataset.original) el.dataset.original = el.textContent.replace(/\s+/g, " ").trim();
    var words = el.dataset.original.split(" ");
    el.innerHTML = words.map(function (w) {
      var span = document.createElement("span");
      span.className = "w";
      span.textContent = w;
      return span.outerHTML;
    }).join(" ");
    var lines = [];
    var lastTop = null;
    $$(".w", el).forEach(function (w) {
      var top = w.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 4) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.setAttribute("aria-label", el.dataset.original);
    el.innerHTML = "";
    lines.forEach(function (l) {
      var line = document.createElement("span");
      line.className = "line";
      line.setAttribute("aria-hidden", "true");
      var inner = document.createElement("span");
      inner.className = "line-inner";
      inner.textContent = l.join(" ");
      line.appendChild(inner);
      el.appendChild(line);
    });
    return $$(".line-inner", el);
  }

  /* ---------- Full-screen menu ---------- */

  var menu = $(".full-nav");
  var toggle = $(".nav-toggle");
  var menuLinks = $$(".full-nav__menu a");
  var menuMeta = $(".full-nav__meta");
  var menuOpen = false;
  var menuTl = null;

  function setMenu(open) {
    menuOpen = open;
    root.classList.toggle("nav-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (menuTl) menuTl.kill();
    menuTl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    if (open) {
      if (lenis) lenis.stop();
      menuTl
        .set(menu, { visibility: "visible" })
        .to(menu, { yPercent: 0, duration: 0.8 })
        .fromTo(menuLinks, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: { each: 0.05, from: "end" }, clearProps: "opacity,transform" }, "-=0.6")
        .fromTo(menuMeta, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "none" }, "-=0.3");
    } else {
      menuTl
        .to(menu, { yPercent: -100, duration: 0.8 })
        .set(menu, { visibility: "hidden" })
        .call(function () { if (lenis) lenis.start(); });
    }
  }

  if (menu && toggle) {
    gsap.set(menu, { yPercent: -100, visibility: "hidden" });
    toggle.addEventListener("click", function () { setMenu(!menuOpen); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOpen) { setMenu(false); toggle.focus(); }
    });
  }

  function setupStaticMenu() {
    var m = $(".full-nav");
    var t = $(".nav-toggle");
    if (!m || !t) return;
    var open = false;
    function set(o) {
      open = o;
      root.classList.toggle("nav-open", o);
      m.style.visibility = o ? "visible" : "hidden";
      m.style.transform = o ? "none" : "translateY(-100%)";
      m.setAttribute("aria-hidden", String(!o));
      t.setAttribute("aria-expanded", String(o));
      t.setAttribute("aria-label", o ? "Close menu" : "Open menu");
    }
    set(false);
    t.addEventListener("click", function () { set(!open); });
    $$("a", m).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { set(false); t.focus(); } });
  }

  /* ---------- In-page anchors (smooth, header-aware) ---------- */

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var href = a.getAttribute("href");
    var hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    var pagePart = href.slice(0, hashIndex);
    var here = location.pathname.split("/").pop() || "index.html";
    if (pagePart && pagePart !== here) return; // another page: let the browser navigate
    var hash = href.slice(hashIndex);
    if (hash === "#top" || hash === "#") { e.preventDefault(); closeThen(function () { scrollToTarget(0); }); return; }
    if (hash === "#main") return; // skip link: native focus jump
    if (hash !== "#contact" && !$(hash)) return;
    e.preventDefault();
    closeThen(function () { scrollToTarget(hash); });
  });

  function closeThen(fn) {
    if (menuOpen) {
      setMenu(false);
      if (lenis) lenis.start();
      setTimeout(fn, 450);
    } else fn();
  }

  /* ---------- Headings rise line by line ---------- */

  $$(".split-lines").forEach(function (h) {
    var lines = splitLines(h);
    gsap.set(lines, { yPercent: 105 });
    ScrollTrigger.create({
      trigger: h,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to($$(".line-inner", h), { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 });
      },
    });
  });

  var lastWidth = window.innerWidth;
  var resizeTimer;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      $$(".split-lines, [data-split-hero]").forEach(function (h) {
        gsap.set(splitLines(h), { yPercent: 0 });
      });
      setupFooterReveal();
      ScrollTrigger.refresh();
    }, 200);
  });

  /* ---------- Reveal on scroll ---------- */

  var hiddenState = { "slide-up": { autoAlpha: 0, y: 120 }, "fade-in": { autoAlpha: 0 } };
  var single = $$("[data-reveal]:not([data-reveal-batch])");
  var batch = $$("[data-reveal][data-reveal-batch]");

  single.concat(batch).forEach(function (el) {
    gsap.set(el, hiddenState[el.getAttribute("data-reveal")] || hiddenState["fade-in"]);
  });
  single.forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(el, { autoAlpha: 1, duration: 0.3, ease: "none", overwrite: "auto" });
        gsap.to(el, { y: 0, duration: 0.8, ease: "power2.out", overwrite: "auto" });
      },
    });
  });
  if (batch.length) {
    ScrollTrigger.batch(batch, {
      start: "top 85%",
      once: true,
      onEnter: function (els) {
        gsap.to(els, { autoAlpha: 1, duration: 0.3, ease: "none", stagger: 0.15, overwrite: "auto" });
        gsap.to(els, { y: 0, duration: 0.8, ease: "power2.out", stagger: 0.15, overwrite: "auto" });
      },
    });
  }

  /* ---------- Footer revealed from under the page ---------- */

  var footer = $(".site-footer");
  var footerInner = $(".site-footer__inner");
  var giant = $(".site-footer__giant");
  var footerTl = null;

  function setupFooterReveal() {
    if (!page || !footer) return;
    if (footerTl) { if (footerTl.scrollTrigger) footerTl.scrollTrigger.kill(); footerTl.kill(); footerTl = null; }
    gsap.set([footerInner, giant], { clearProps: "transform" });
    var desktop = window.innerWidth > 900;
    root.classList.toggle("has-footer-reveal", desktop);
    if (!desktop || footer.offsetHeight > window.innerHeight) {
      root.classList.remove("has-footer-reveal");
      page.style.marginBottom = "";
      return;
    }
    var h = footer.offsetHeight;
    page.style.marginBottom = h + "px";
    footerTl = gsap.timeline({
      scrollTrigger: { trigger: page, start: "bottom bottom", end: "+=" + h, scrub: true },
    });
    footerTl.fromTo(footerInner, { yPercent: -30 }, { yPercent: 0, ease: "none" }, 0)
      .fromTo(giant, { yPercent: 60 }, { yPercent: 0, ease: "none" }, 0);
  }
  setupFooterReveal();

  /* ---------- Arriving with a #hash from another page ---------- */

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
    if (location.hash && location.hash.length > 1) {
      var target = location.hash === "#contact" ? "#contact" : $(location.hash);
      if (target) setTimeout(function () { scrollToTarget(location.hash, { immediate: true }); }, 60);
    }
  });

  window.Site = {
    motion: true,
    gsap: gsap,
    ScrollTrigger: ScrollTrigger,
    lenis: lenis,
    scrollTo: scrollToTarget,
    splitLines: splitLines,
  };
})();
