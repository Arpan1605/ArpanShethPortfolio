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
    var fg = $(".featured__grid");
    if (fg) fg.classList.add("is-in");
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

  // The arcade career run (runJourney, below) is switched off for now: its
  // code stays in this file, but the intro starts at the welcome card.
  // To bring it back, set ARCADE_INTRO to true.
  var ARCADE_INTRO = false;

  if (showPreloader) {
    // Load the intro fonts first so nothing flashes in a fallback face.
    // They are only fetched when the intro actually plays.
    var pixelCss = document.createElement("link");
    pixelCss.rel = "stylesheet";
    pixelCss.href = ARCADE_INTRO
      ? "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Press+Start+2P&display=swap"
      : "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap";
    var fontWait = new Promise(function (resolve) {
      pixelCss.onload = function () {
        if (!document.fonts || !document.fonts.load) { resolve(); return; }
        var loads = [document.fonts.load('700 40px Caveat')];
        if (ARCADE_INTRO) loads.push(document.fonts.load('12px "Press Start 2P"'));
        Promise.all(loads).then(resolve, resolve);
      };
      pixelCss.onerror = resolve;
    });
    document.head.appendChild(pixelCss);
    Promise.race([fontWait, new Promise(function (r) { setTimeout(r, 1200); })])
      .catch(function () {})
      .then(function () {
        // Arcade intro disabled for now; the welcome card plays straight away.
        // runJourney(function (skipped) { if (skipped) runPreloader(); else runWelcome(runPreloader); });
        if (ARCADE_INTRO) runJourney(function (skipped) { if (skipped) runPreloader(); else runWelcome(runPreloader); });
        else runWelcome(runPreloader);
      });
  } else {
    root.classList.remove("is-loading");
    var pre = $(".preloader");
    if (pre) pre.remove();
    document.fonts.ready.then(function () { setTimeout(heroIntro, 150); });
  }

  /* ---------- Journey intro: an arcade-style run through the career timeline ----------
     An original pixel-art sprite runs right, jumps to hit a block at each
     milestone (coin + new skills), clears the stage and hands over to the name. */

  // Functions (not vars) so they're hoisted: runJourney is called above this point.
  function journeyStops() {
    return [
      { year: "2020", date: "Oct 2020", skills: ["Illustration", "Typography"], role: "Graphic Designer", org: "Inospire", icon: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>' },
      { year: "2021", date: "Mar 2021", skills: ["HTML & CSS", "Angular"], role: "Front-end Developer", org: "TCS · GE Corporate", icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
      { year: "2022", date: "Oct 2022", skills: ["Auto Layout", "Wireframing"], role: "UX/UI Designer", org: "TCS · GE Healthcare", icon: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>' },
      { year: "2024", date: "Aug 2024", skills: ["User Research", "Prototyping"], role: "Product Designer", org: "GolfPac Travel", icon: '<path d="M5 22V3"/><path d="M5 4h12l-3 4 3 4H5"/><path d="M3 22h8"/>' },
      { year: "2025", date: "Sep 2025", skills: ["Design Systems", "Mobile UX"], role: "Product Design", org: "Pareexa.ai · tasteX", icon: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>' },
      { year: "2026", date: "2026", skills: ["AI Workflows", "Claude Code"], role: "Claude Certified", org: "Architect", icon: '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>' },
    ];
  }

  /* Pixel art: one character per pixel, 16 x 24 grid, composed from
     head + torso (arm pose) + legs (stride). "." is transparent. */
  function spriteFrames() {
    // Modelled on Arpan: swept-up black hair, full beard, navy quarter-zip
    // with glasses hooked on the zip, dark jeans and white sneakers.
    var PAL = {
      K: "#1f1f23", H: "#2a2320", h: "#5a4a3e", S: "#c98d62", s: "#a46d47", D: "#2a201b",
      W: "#ffffff", N: "#24304d", n: "#161e33", Z: "#9aa3b5", L: "#5b8be0",
      B: "#3b4660", b: "#2a3348",
    };
    var head = [
      ".....KKKKKKK....",
      "...KKHHHHhHHKK..",
      "..KHHHhHHHHhHHK.",
      ".KHHHHHHHHHHHHK.",
      ".KHHHHHSSSSSSHK.",
      ".KHHsSSSDDSSDDK.",
      ".KHHsSSSSKSSSKK.",
      ".KHHSSSSSSSSsSK.",
      ".KHDSSSSSSSSsSK.",
      ".KDDDSDDDDDDDDK.",
      "..KDDDDDWWWDDDK.",
      "...KKDDDDDDDKK..",
    ];
    // Torso rows: N navy top, n shading, Z zip/collar, L glasses lens, S hands.
    var torso = {
      down: ["....KNNZZNNK....", "...KNNNZNNNNK...", "...KNNnZNWNNK...", "...KNNnZLNNNK...", "...KNNNSNLNNK...", "...KNNNNNNNNK..."],
      back: ["....KNNZZNNK....", "...KNNNZNNNNK...", "..KnKNNZNWNNK...", ".KnKKNNZLNNNK...", ".KSKKNNNNLNNK...", ".KK.KNNNNNNNK..."],
      front: ["....KNNZZNNK....", "...KNNNZNNNNK...", "...KNNNZNWNnKK..", "...KNNNZLNNKnKK.", "...KNNNNNLNKKSK.", "...KNNNNNNNK.KK."],
      up: ["....KNNZZNNK.KSK", "...KNNNZNNNNKnK.", "...KNNNZNWNNnK..", "...KNNNZLNNNK...", "...KNNNNNLNNK...", "...KNNNNNNNNK..."],
    };
    var legs = {
      stand: ["....KBBBBBBK....", "....KBBKKBBK....", "....KBBKKBBK....", "....KbBKKbBK....", "...KWWWKKWWWK...", "...KKKKKKKKKK..."],
      stride: ["....KBBBBBBK....", "...KBBKKKBBK....", "..KBBK...KBBK...", ".KbBK.....KbBK..", "KWWWK.....KWWWK.", "KKKKK.....KKKKK."],
      pass: ["....KBBBBBBK....", "....KBBBBBK.....", "....KBBKbBK.....", "....KbBKWWWK....", "...KWWWKKKK.....", "...KKKKK........"],
      jump: ["....KBBBBBBK....", "...KBBKKKBBBK...", "..KBBK...KBBK...", "..KWWWK..KWWWK..", "..KKKKK..KKKKK..", "................"],
    };
    function svg(rows) {
      var out = "";
      rows.forEach(function (row, y) {
        var x = 0;
        while (x < row.length) {
          var c = row[x], n = 1;
          while (row[x + n] === c) n++;
          if (c !== ".") out += '<rect x="' + x + '" y="' + y + '" width="' + n + '" height="1" fill="' + PAL[c] + '"/>';
          x += n;
        }
      });
      return '<svg viewBox="0 0 16 24" shape-rendering="crispEdges" aria-hidden="true">' + out + "</svg>";
    }
    function f(t, l) { return svg(head.concat(torso[t], legs[l])); }
    return {
      stand: f("down", "stand"),
      run1: f("back", "stride"),
      run2: f("down", "pass"),
      run3: f("front", "stride"),
      jump: f("up", "jump"),
      wave: f("up", "stand"),
    };
  }

  function pixelSvg(rows, pal, w, h) {
    var out = "";
    rows.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) if (row[x] !== ".") out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + pal[row[x]] + '"/>';
    });
    return '<svg viewBox="0 0 ' + w + " " + h + '" shape-rendering="crispEdges" aria-hidden="true">' + out + "</svg>";
  }

  function runJourney(done) {
    var JOURNEY = journeyStops();
    var FRAMES = spriteFrames();
    var COIN = pixelSvg(["..KKKK..", ".KYYYYK.", "KYWYYyYK", "KYWYYyYK", "KYYYYyYK", "KYYYYyYK", ".KYyyyK.", "..KKKK.."],
      { K: "#1f1f23", Y: "#ffd23f", y: "#e0a810", W: "#fff6c8" }, 8, 8);
    var CLOUD = pixelSvg(["....CCCC........", "..CCCCCCCC.CCC..", ".CCCCCCCCCCCCCC.", "CCCCCCCCCCCCCCCC"], { C: "var(--grey-2)" }, 16, 4);

    var finished = false, walkTimer = null, tl = null;
    function finish(skipped) {
      if (finished) return;
      finished = true;
      skipped = !!skipped;
      stopRun();
      if (tl) tl.kill();
      document.removeEventListener("keydown", onKey);
      gsap.to(el, {
        autoAlpha: 0, duration: 0.45, ease: "power2.out",
        onComplete: function () { el.remove(); root.classList.remove("journey-on"); },
      });
      done(skipped);
    }
    function onKey(e) {
      if (e.key === "Escape") finish(true);
      else if (e.key === " " || e.key === "p" || e.key === "P") { e.preventDefault(); togglePause(); }
    }
    // Pause freezes the timeline, the progress bar and the run cycle together.
    var paused = false, wasRunning = false, progressTween = null;
    function togglePause() {
      if (finished || !tl) return;
      paused = !paused;
      var btn = el.querySelector(".journey__pause");
      btn.textContent = paused ? "Play" : "Pause";
      btn.setAttribute("aria-pressed", String(paused));
      el.classList.toggle("is-paused", paused);
      if (paused) {
        wasRunning = !!walkTimer;
        stopRun();
        tl.pause();
        if (progressTween) progressTween.pause();
      } else {
        tl.resume();
        if (progressTween) progressTween.resume();
        if (wasRunning) startRun();
      }
    }

    var el = document.createElement("div");
    el.className = "journey";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Intro animation");
    el.innerHTML =
      '<div class="journey__hud" aria-hidden="true">' +
      "<span>1UP <b>ARPAN</b></span>" +
      '<span>STAGE <b class="journey__stage">----</b></span>' +
      '<span>SKILLS <b class="journey__xp">00</b></span>' +
      "</div>" +
      '<span class="journey__bigyear" aria-hidden="true"></span>' +
      '<div class="journey__sky" aria-hidden="true">' +
      '<span class="journey__cloud" style="left:8%;top:22%">' + CLOUD + "</span>" +
      '<span class="journey__cloud" style="left:46%;top:14%">' + CLOUD + "</span>" +
      '<span class="journey__cloud" style="left:78%;top:26%">' + CLOUD + "</span>" +
      '<span class="journey__cloud" style="left:118%;top:18%">' + CLOUD + "</span>" +
      "</div>" +
      '<div class="journey__ground" aria-hidden="true">' +
      '<div class="journey__track"><div class="journey__bricks"></div>' +
      JOURNEY.map(function (s, i) {
        return '<div class="journey__stop' + (i === JOURNEY.length - 1 ? " journey__stop--last" : "") + '">' +
          '<div class="journey__block"><svg viewBox="0 0 24 24">' + s.icon + "</svg></div>" +
          '<span class="journey__coin">' + COIN + "</span>" +
          '<span class="journey__plus">' + s.skills.map(function (k) { return '<span class="journey__pt"><b>+1</b> ' + k + "</span>"; }).join("") + "</span>" +
          '<div class="journey__text"><span class="journey__year">' + s.date + "</span>" +
          '<span class="journey__role">' + s.role + '</span><span class="journey__org">' + s.org + "</span></div></div>";
      }).join("") +
      "</div>" +
      '<div class="journey__hero"><span class="journey__shadow"></span><span class="journey__sprite"></span>' +
      '<span class="journey__bubble">HI, I\'M</span></div>' +
      '<p class="journey__clear">STAGE CLEAR!</p>' +
      '<div class="journey__caption"></div>' +
      "</div>" +
      '<p class="journey__paused" aria-hidden="true">PAUSED</p>' +
      '<div class="journey__controls">' +
      '<button type="button" class="journey__skip journey__pause" aria-pressed="false">Pause</button>' +
      '<button type="button" class="journey__skip">Skip intro &gt;</button>' +
      "</div>" +
      '<span class="journey__progress" aria-hidden="true"></span>';
    document.body.appendChild(el);
    root.classList.add("journey-on");
    if (lenis) lenis.stop();
    window.scrollTo(0, 0);
    el.querySelector(".journey__skip:not(.journey__pause)").addEventListener("click", function () { finish(true); });
    el.querySelector(".journey__pause").addEventListener("click", togglePause);
    document.addEventListener("keydown", onKey);

    function q(s) { return el.querySelector(s); }
    var hero = q(".journey__hero");
    var sprite = q(".journey__sprite");
    var track = q(".journey__track");
    var bigYear = q(".journey__bigyear");
    var stageEl = q(".journey__stage");
    var xpEl = q(".journey__xp");
    gsap.set(xpEl, { display: "inline-block", transformOrigin: "50% 50%" });
    var caption = q(".journey__caption");
    var stops = Array.prototype.slice.call(el.querySelectorAll(".journey__stop"));

    function frame(name) { sprite.innerHTML = FRAMES[name]; }
    // Sprite-sheet style run cycle: hard frame swaps, no tweening.
    var runSeq = ["run1", "run2", "run3", "run2"], runIdx = 0, airborne = false;
    function startRun() {
      if (walkTimer) return;
      walkTimer = setInterval(function () {
        if (airborne) return;
        runIdx = (runIdx + 1) % runSeq.length;
        frame(runSeq[runIdx]);
        gsap.set(sprite, { y: runSeq[runIdx] === "run2" ? -pxl : 0 });
      }, 110);
    }
    function stopRun() { clearInterval(walkTimer); walkTimer = null; }

    // Layout: the hero stays put, the world scrolls under them.
    var vw = window.innerWidth;
    var mobile = vw < 768;
    var pxl = mobile ? 4 : 5; // screen px per sprite pixel
    var gap = mobile ? Math.max(200, vw * 0.58) : Math.min(Math.max(vw * 0.26, 280), 400);
    var heroX = mobile ? vw * 0.3 : vw * 0.32;
    var firstX = heroX + gap * 0.9;
    stops.forEach(function (s, i) { s.style.left = firstX + i * gap + "px"; });
    var lastX = firstX + (stops.length - 1) * gap;
    var travel = lastX - heroX; // end directly under the last block
    q(".journey__bricks").style.width = lastX + vw + "px";
    hero.style.left = heroX + "px";
    frame("stand");

    var speed = gap / (mobile ? 1.3 : 1.25); // seconds between milestones
    var start = 0.55;
    var jumpH = pxl * 11;
    var up = 0.2, down = 0.26;
    var SKILL_GAP = 0.38; // seconds between each "+1" popping out of a block
    function skillsSoFar(i) { return JOURNEY.slice(0, i + 1).reduce(function (n, s) { return n + s.skills.length; }, 0); }

    tl = gsap.timeline({ onComplete: function () { finish(false); } });
    tl.fromTo(q(".journey__hud"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "steps(3)" }, 0)
      .fromTo(hero, { y: -pxl * 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "bounce.out" }, 0.05)
      .call(startRun, null, start)
      .to(track, { x: -travel, duration: travel / speed, ease: "none" }, start)
      .to(q(".journey__sky"), { x: -travel * 0.25, duration: travel / speed, ease: "none" }, start);

    function hit(s, i, t) {
      var block = s.querySelector(".journey__block");
      var coin = s.querySelector(".journey__coin");
      var plus = s.querySelector(".journey__plus");
      var last = i === stops.length - 1;
      // jump: up, bonk, fall
      tl.call(function () { airborne = true; frame("jump"); gsap.set(sprite, { y: 0 }); }, null, t - up)
        .to(hero, { y: -jumpH, duration: up, ease: "power2.out" }, t - up)
        .to(hero, { y: 0, duration: down, ease: "power2.in" }, t)
        .call(function () { airborne = false; frame(last ? "stand" : "run1"); }, null, t + down)
        .to(q(".journey__shadow"), { scaleX: 0.55, opacity: 0.05, duration: up, yoyo: true, repeat: 1, ease: "none" }, t - up)
        // block bump + coin + XP
        .to(block, { y: -pxl * 3, duration: 0.08, ease: "steps(2)", yoyo: true, repeat: 1 }, t)
        .call(function () { block.classList.add("is-hit"); }, null, t)
        .fromTo(coin, { y: 0, autoAlpha: 1 }, { y: -pxl * 16, duration: 0.42, ease: "steps(7)", immediateRender: false }, t)
        .to(coin, { autoAlpha: 0, duration: 0.01 }, t + 0.42)
        .fromTo(plus, { y: 0, autoAlpha: 0 }, { y: -pxl * 8, autoAlpha: 1, duration: 0.3, ease: "steps(5)" }, t + 0.05)
        .to(plus, { autoAlpha: 0, duration: 0.2, ease: "steps(2)" }, t + 0.35 + JOURNEY[i].skills.length * SKILL_GAP)
        .fromTo(s.querySelector(".journey__text"), { autoAlpha: 0, y: pxl * 2 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: "steps(4)" }, t + 0.04)
        // Phones: the stop scrolls away fast, so a fixed caption mirrors it
        .call(function () { caption.innerHTML = s.querySelector(".journey__text").innerHTML; }, null, t)
        .fromTo(caption, { autoAlpha: 0, y: pxl * 2 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: "steps(4)", immediateRender: false }, t + 0.04)
        .call(function () {
          bigYear.textContent = JOURNEY[i].year;
          stageEl.textContent = JOURNEY[i].date.toUpperCase();
        }, null, t)
        .fromTo(bigYear, { autoAlpha: 0, y: pxl * 4 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "steps(4)", immediateRender: false }, t)
        ;
      // Each skill pops in on its own as "+1" and ticks the HUD counter.
      Array.prototype.forEach.call(plus.children, function (pt, k) {
        var at = t + 0.05 + k * SKILL_GAP;
        var total = skillsSoFar(i - 1) + k + 1;
        tl.fromTo(pt, { autoAlpha: 0, x: -pxl * 2 }, { autoAlpha: 1, x: 0, duration: 0.18, ease: "steps(3)" }, at)
          .call(function () { xpEl.textContent = ("00" + total).slice(-2); }, null, at)
          .fromTo(xpEl, { scale: 1.6, color: "var(--accent-ink)", backgroundColor: "var(--accent)" },
            { scale: 1, color: "var(--ink)", backgroundColor: "rgba(0,0,0,0)", duration: 0.35, ease: "steps(4)", immediateRender: false }, at);
      });
    }
    stops.forEach(function (s, i) {
      var t = start + (firstX + i * gap - heroX) / speed; // block directly overhead
      hit(s, i, t);
    });

    // Stage clear: stop, wave, say hi, then hand over to the name animation
    var end = start + travel / speed + down;
    tl.call(stopRun, null, end - down)
      .fromTo(q(".journey__clear"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "steps(4)" }, end)
      .to(q(".journey__clear"), { autoAlpha: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.09 }, end + 0.35)
      .call(function () { frame("wave"); }, null, end + 0.2)
      .call(function () { frame("stand"); }, null, end + 0.38)
      .call(function () { frame("wave"); }, null, end + 0.56)
      .call(function () { frame("stand"); }, null, end + 0.74)
      .call(function () { frame("wave"); }, null, end + 0.92)
      .fromTo(q(".journey__bubble"), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "steps(3)" }, end + 0.55)
      .to({}, { duration: 0.6 });

    progressTween = gsap.to(q(".journey__progress"), { scaleX: 1, duration: tl.duration(), ease: "steps(24)" });
  }

  /* ---------- Welcome card: plays between the arcade run and the name ----------
     The cut-out photo rises in on the accent colour, marker doodles sketch
     themselves around it and a pair of shades drops onto the face. */
  function runWelcome(done) {
    var finished = false, tl = null, idle = [];
    function finish() {
      if (finished) return;
      finished = true;
      if (tl) tl.kill();
      idle.forEach(function (t) { t.kill(); });
      document.removeEventListener("keydown", onKey);
      gsap.to(el, {
        yPercent: -100, duration: 0.8, ease: "power3.inOut",
        onComplete: function () { el.remove(); root.classList.remove("welcome-on"); },
      });
      done();
    }
    function onKey(e) {
      if (e.key === "Escape") finish();
      else if (e.key === " " || e.key === "p" || e.key === "P") { e.preventDefault(); togglePause(); }
    }
    var paused = false;
    function togglePause() {
      if (finished || !tl) return;
      paused = !paused;
      var btn = el.querySelector(".welcome__pause");
      btn.textContent = paused ? "Play" : "Pause";
      btn.setAttribute("aria-pressed", String(paused));
      tl.paused(paused);
      idle.forEach(function (t) { t.paused(paused); });
    }

    // Every doodle is a stroked path drawn on with stroke-dashoffset (pathLength="1").
    function doodle(cls, viewBox, paths) {
      return '<svg class="welcome__doodle ' + cls + '" viewBox="' + viewBox + '" aria-hidden="true">' +
        paths.map(function (d) { return '<path pathLength="1" d="' + d + '"/>'; }).join("") + "</svg>";
    }

    var el = document.createElement("div");
    el.className = "welcome";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Welcome");
    el.innerHTML =
      '<div class="welcome__scene">' +
      doodle("welcome__loop", "0 0 170 120", ["M8 104 C 20 60, 70 40, 88 66 C 104 90, 66 104, 60 78 C 54 50, 104 24, 160 30", "M144 16 L160 30 L142 42"]) +
      doodle("welcome__spark", "0 0 64 64", ["M32 2 C34 24 40 30 62 32 C40 34 34 40 32 62 C30 40 24 34 2 32 C24 30 30 24 32 2 Z"]) +
      doodle("welcome__spark welcome__spark--sm", "0 0 64 64", ["M32 2 C34 24 40 30 62 32 C40 34 34 40 32 62 C30 40 24 34 2 32 C24 30 30 24 32 2 Z"]) +
      doodle("welcome__laptop", "0 0 180 130", [
        "M26 10 H154 Q160 10 160 16 V96 H20 V16 Q20 10 26 10 Z",
        "M4 98 H176 L168 114 Q166 118 160 118 H20 Q14 118 12 114 Z",
        "M34 24 H146", "M34 38 H80 V78 H34 Z", "M34 38 L80 78", "M80 38 L34 78",
        "M94 38 H146 V60 H94 Z", "M94 38 L146 60", "M146 38 L94 60", "M94 70 H146", "M94 80 H128",
      ]) +
      doodle("welcome__pen", "0 0 200 110", [
        "M14 92 C 40 10, 150 10, 186 70", "M14 92 L54 50", "M186 70 L160 18",
        "M8 86 H20 V98 H8 Z", "M180 64 H192 V76 H180 Z", "M50 46 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0", "M160 18 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
      ]) +
      doodle("welcome__dashes", "0 0 40 50", ["M30 4 L10 16", "M34 28 L6 32"]) +
      '<div class="welcome__hello">' +
      '<span class="welcome__line">Hey there! Welcome</span>' +
      '<span class="welcome__line">to my corner of the web</span>' +
      doodle("welcome__underline", "0 0 300 24", ["M4 16 C 60 4, 120 22, 180 10 S 270 8, 296 14"]) +
      "</div>" +
      '<div class="welcome__name">' +
      '<span class="welcome__line welcome__line--name">Arpan Sheth</span>' +
      '<span class="welcome__line welcome__line--role">UX/UI Designer</span>' +
      "</div>" +
      '<div class="welcome__person">' +
      '<img class="welcome__photo" src="arpan-cutout.webp" alt="Arpan Sheth" />' +
      '<svg class="welcome__shades" viewBox="0 0 200 52" aria-hidden="true">' +
      '<defs><clipPath id="welcomeLens"><path d="M8 10 H92 L87 38 Q85 46 76 46 H24 Q14 46 12 38 Z M108 10 H192 L188 38 Q186 46 176 46 H124 Q115 46 113 38 Z"/></clipPath></defs>' +
      '<path class="welcome__lens" d="M8 10 H92 L87 38 Q85 46 76 46 H24 Q14 46 12 38 Z M108 10 H192 L188 38 Q186 46 176 46 H124 Q115 46 113 38 Z"/>' +
      '<g clip-path="url(#welcomeLens)" class="welcome__hatch">' +
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(function (i) { var x = i * 13; return '<path d="M' + x + ' 52 L' + (x + 24) + ' 0"/>'; }).join("") +
      "</g>" +
      '<path class="welcome__frame" d="M2 10 H198 M92 14 Q100 6 108 14"/>' +
      "</svg>" +
      '<svg class="welcome__impact" viewBox="0 0 260 80" aria-hidden="true"><path pathLength="1" d="M6 30 L-14 22"/><path pathLength="1" d="M8 50 L-14 56"/><path pathLength="1" d="M254 30 L274 22"/><path pathLength="1" d="M252 50 L274 56"/></svg>' +
      "</div>" +
      "</div>" +
      '<div class="welcome__controls">' +
      '<button type="button" class="welcome__skip welcome__pause" aria-pressed="false">Pause</button>' +
      '<button type="button" class="welcome__skip">Skip &gt;</button>' +
      "</div>";
    document.body.appendChild(el);
    root.classList.add("welcome-on");
    if (lenis) lenis.stop();
    window.scrollTo(0, 0);
    el.querySelector(".welcome__skip:not(.welcome__pause)").addEventListener("click", finish);
    el.querySelector(".welcome__pause").addEventListener("click", togglePause);
    document.addEventListener("keydown", onKey);

    function q(s) { return el.querySelector(s); }
    function qa(s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }
    var strokes = qa(".welcome__doodle path");
    var lines = qa(".welcome__line");
    var person = q(".welcome__person");
    var shades = q(".welcome__shades");

    gsap.set(strokes, { strokeDasharray: "1 2", strokeDashoffset: 1, opacity: 0 });
    gsap.set(lines, { clipPath: "inset(-20% 100% -20% 0)" });
    gsap.set(person, { yPercent: 105 });
    gsap.set(shades, { y: -window.innerHeight, rotation: -28, autoAlpha: 0 });
    gsap.set(".welcome__impact path", { strokeDasharray: "1 2", strokeDashoffset: 1, opacity: 0 });

    tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(el, { clipPath: "circle(0% at 50% 62%)" }, { clipPath: "circle(150% at 50% 62%)", duration: 0.75, ease: "power3.inOut" }, 0)
      .to(person, { yPercent: 0, duration: 1, ease: "power3.out" }, 0.3)
      .to(strokes, { strokeDashoffset: 0, opacity: 1, duration: 0.55, ease: "power1.inOut", stagger: 0.05 }, 0.85)
      .to(lines[0], { clipPath: "inset(-20% 0% -20% 0)", duration: 0.6, ease: "power1.inOut" }, 1.0)
      .to(lines[1], { clipPath: "inset(-20% 0% -20% 0)", duration: 0.7, ease: "power1.inOut" }, 1.5)
      .to(lines[2], { clipPath: "inset(-20% 0% -20% 0)", duration: 0.6, ease: "power1.inOut" }, 1.4)
      .to(lines[3], { clipPath: "inset(-20% 0% -20% 0)", duration: 0.5, ease: "power1.inOut" }, 1.9)
      // The shades drop in and land with a bounce, nudging the head down a touch.
      .set(shades, { autoAlpha: 1 }, 2.3)
      .to(shades, { y: 0, rotation: -4, duration: 0.75, ease: "bounce.out" }, 2.3)
      .to(person, { y: 6, duration: 0.08, ease: "power1.out", yoyo: true, repeat: 1 }, 2.62)
      .to(".welcome__impact path", { strokeDashoffset: 0, opacity: 1, duration: 0.2, ease: "power2.out", stagger: 0.03 }, 2.62)
      .to(".welcome__impact path", { opacity: 0, duration: 0.25, ease: "power2.in", stagger: 0.03 }, 2.95)
      .to({}, { duration: 2.2 });

    // Small idle wobble so the doodles feel hand-made while the card holds.
    qa(".welcome__spark").forEach(function (s, i) {
      idle.push(gsap.to(s, { rotation: i ? -18 : 18, scale: 1.12, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 + i * 0.2 }));
    });
    idle.push(gsap.to(q(".welcome__loop"), { rotation: -4, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 }));
    idle.push(gsap.to(q(".welcome__laptop"), { y: -6, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 }));
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

  // Featured projects: the papers drop into each folder as the grid arrives.
  (function featuredFolders() {
    var grid = $(".featured__grid");
    if (!grid) return;
    ScrollTrigger.create({
      trigger: grid,
      start: "top 85%",
      once: true,
      onEnter: function () {
        $$(".folder-card", grid).forEach(function (card, i) {
          $$(".folder__sheet", card).forEach(function (sh, k) { sh.style.transitionDelay = (0.25 + i * 0.09 + k * 0.06) + "s"; });
        });
        grid.classList.add("is-in");
        // Drop the stagger afterwards so hover responds instantly.
        setTimeout(function () { $$(".folder__sheet", grid).forEach(function (sh) { sh.style.transitionDelay = ""; }); }, 1800);
      },
    });
  })();

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
