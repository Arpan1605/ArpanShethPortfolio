/* Arpan Sheth — homepage-only motion: preloader, hero showreel and
   scroll-scaling hero, logo marquee, sticky about card.
   Runs after site.js and uses window.Site. */
(function () {
  "use strict";

  var root = document.documentElement;
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  var Site = window.Site || { motion: false };

  // Hero showreel: cross-fade through project images.
  (function heroSlides() {
    var slides = $$(".hero__slide");
    var label = $(".hero__media-label");
    if (slides.length < 2) return;
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
      if (label) label.textContent = slides[i].getAttribute("data-label");
    }, 3200);
  })();

  if (!Site.motion) {
    var m = $(".hero__media-inner");
    if (m) m.style.transform = "none";
    var p = $(".preloader");
    if (p) p.remove();
    return;
  }

  var gsap = Site.gsap;
  var ScrollTrigger = Site.ScrollTrigger;
  var lenis = Site.lenis;

  /* ---------- Preloader + hero intro ---------- */

  var heroTitle = $(".hero__title");
  var heroLines = heroTitle ? Site.splitLines(heroTitle) : [];
  var heroMedia = $(".hero__media-inner");
  var heroScroll = $(".hero__scroll");

  function heroIntro() {
    var tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    if (heroMedia) {
      tl.fromTo(heroMedia,
        { clipPath: "inset(50% round 20px)" },
        { clipPath: "inset(0% round 20px)", duration: 0.8, onComplete: function () { gsap.set(heroMedia, { clipPath: "none" }); } }, 0);
    }
    tl.fromTo(heroLines, { yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.2 }, 0.1);
    if (heroScroll) tl.fromTo(heroScroll, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "none" }, "-=0.4");
    return tl;
  }

  var showPreloader = !root.classList.contains("skip-preloader") && !!$(".preloader");
  gsap.set(heroLines, { yPercent: 105 });
  if (heroMedia) gsap.set(heroMedia, { clipPath: "inset(50% round 20px)" });
  if (heroScroll) gsap.set(heroScroll, { autoAlpha: 0 });

  if (showPreloader) {
    runPreloader();
  } else {
    root.classList.remove("is-loading");
    var pre = $(".preloader");
    if (pre) pre.remove();
    document.fonts.ready.then(function () { setTimeout(heroIntro, 150); });
  }

  function runPreloader() {
    var pre = $(".preloader");
    var preBg = $(".preloader__bg");
    var dot = $(".preloader__dot");
    var logo = $(".site-header__logo");
    var toggle = $(".nav-toggle");
    var letters = $$(".wordmark > span:not(.wordmark__gap)", logo);
    var navItems = $$(".site-header__menu li").concat([$(".site-header__cta"), $(".theme-toggle")]).filter(Boolean);
    var toggleDots = $$(".nav-toggle__dot");

    if (lenis) lenis.stop();
    window.scrollTo(0, 0);

    document.fonts.ready.then(function () {
      var r = logo.getBoundingClientRect();
      gsap.set(logo, { y: (window.innerHeight - r.height) / 2 - r.top });
      gsap.set(letters, { scaleX: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(dot, { opacity: 0, xPercent: 160 });
      gsap.set(navItems, { autoAlpha: 0, xPercent: -40 });
      gsap.set(toggleDots, { opacity: 0 });
      root.classList.remove("is-loading");

      var t = toggle.getBoundingClientRect();
      var d = dot.getBoundingClientRect();
      var dx = t.left + t.width / 2 - (d.left + d.width / 2);
      var dy = t.top + t.height / 2 - (d.top + d.height / 2);

      var tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: function () {
          try { sessionStorage.setItem("preloaderShown", "true"); } catch (e) {}
          if (pre) pre.remove();
          gsap.set(logo, { clearProps: "transform" });
          if (lenis) lenis.start();
          ScrollTrigger.refresh();
        },
      });

      tl.to(letters, { scaleX: 1, opacity: 1, duration: 0.32, ease: "power2.out", stagger: 0.06 }, 0.2)
        .to(dot, { opacity: 1, xPercent: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
        .addLabel("moveUp", "+=0.25")
        .to(logo, { y: 0, duration: 1 }, "moveUp")
        .to(dot, { x: dx, y: dy, duration: 1 }, "moveUp")
        .to(preBg, { scaleY: 0, transformOrigin: "50% 0%", duration: 1 }, "moveUp")
        .to(dot, { scale: 0.18, duration: 0.45, ease: "power3.in" }, "moveUp+=0.7")
        .to(toggleDots, { opacity: 1, duration: 0.2, ease: "none", stagger: 0.04 }, "moveUp+=1")
        .set(dot, { opacity: 0 }, "moveUp+=1.15")
        .to(navItems, { autoAlpha: 1, xPercent: 0, duration: 0.6, ease: "power2.out", stagger: { amount: 0.5, from: "end" } }, "moveUp+=0.6")
        .add(heroIntro(), "moveUp+=0.55");
    });
  }

  /* ---------- Hero: pinned scale-up on scroll (desktop) ---------- */

  var mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", function () {
    if (!heroMedia) return;
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=130%",
        scrub: 0.4,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 1,
      },
    });
    tl.fromTo(heroMedia, { scale: 0.35 }, { scale: 1, ease: "none", duration: 0.8 }, 0)
      .to(".hero__content", { autoAlpha: 0, ease: "none", duration: 0.56 }, 0)
      .to({}, { duration: 0.2 });
    ScrollTrigger.refresh();
    return function () { gsap.set(heroMedia, { clearProps: "scale,transform" }); };
  });
  mm.add("(max-width: 767px)", function () {
    if (heroMedia) gsap.set(heroMedia, { scale: 1 });
  });

  /* ---------- About: sticky mini card follows the active quote ---------- */

  var miniCards = $$(".mini-card");
  $$(".quote[data-index]").forEach(function (q) {
    var idx = q.getAttribute("data-index");
    ScrollTrigger.create({
      trigger: q,
      start: "top 60%",
      end: "bottom 60%",
      onToggle: function (self) {
        if (!self.isActive) return;
        miniCards.forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-for") === idx); });
      },
    });
  });

  /* ---------- Logo marquee, nudged by scroll velocity ---------- */

  (function marquee() {
    var track = $(".marquee__track");
    var group = $(".marquee__group");
    if (!track || !group) return;
    var loop = gsap.to(track, { x: function () { return -group.offsetWidth; }, duration: 38, ease: "none", repeat: -1 });
    var settle = null;
    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      onUpdate: function (self) {
        var speed = Math.min(1 + Math.abs(self.getVelocity()) / 300, 6);
        if (settle) settle.kill();
        loop.timeScale(speed);
        settle = gsap.to(loop, { timeScale: 1, duration: 0.9, ease: "power1.out" });
      },
    });
  })();
})();
