/* Arpan Sheth — pixel landscapes that frame the page.
   Sky    (#sky-canvas, homepage top): a cherry-blossom branch that sheds petals
          on the breeze, plus clouds and birds by day, stars and a moon by night.
          Click to shake the branch; petals swirl away from the pointer.
   Meadow (#meadow-canvas, footer): grass that bends away from the pointer and
          Arpan's two godcats: Jeeru (ginger) follows the pointer, Masala
          (tortoiseshell) ignores it. Click a cat to make it hop or pounce;
          click the grass to plant a flower. Fireflies at night.
   Both draw onto a low-resolution canvas that CSS scales up with
   image-rendering: pixelated, so one canvas pixel is one "cell". */
(function () {
  "use strict";

  var CELL = 4;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  function isDark() {
    return root.getAttribute("data-theme") === "dark";
  }
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }
  function pick(list) {
    return list[(Math.random() * list.length) | 0];
  }
  // Seeded random, so the branch keeps the same shape across resizes.
  function seeded(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Shared plumbing: sizing, pointer mapping and an on-screen-only loop. */
  function Scene(canvas, hooks) {
    var ctx = canvas.getContext("2d");
    var host = canvas.parentElement;
    var state = { w: 0, h: 0, t: 0, px: -999, py: -999, inside: false, ctx: ctx };
    var running = false;
    var visible = false;

    function resize() {
      var w = Math.max(1, Math.ceil(host.clientWidth / CELL));
      var h = Math.max(1, Math.ceil(host.clientHeight / CELL));
      if (w === state.w && h === state.h) return;
      state.w = canvas.width = w;
      state.h = canvas.height = h;
      ctx.imageSmoothingEnabled = false;
      hooks.resize(state);
      if (!running) draw();
    }
    function draw() {
      ctx.clearRect(0, 0, state.w, state.h);
      hooks.draw(state);
    }
    function frame() {
      if (!visible) { running = false; return; }
      state.t += 1 / 60;
      hooks.step(state);
      draw();
      requestAnimationFrame(frame);
    }
    function start() {
      if (reduce || running) return;
      running = true;
      requestAnimationFrame(frame);
    }
    function toCell(e) {
      var r = canvas.getBoundingClientRect();
      state.px = ((e.clientX - r.left) / r.width) * state.w;
      state.py = ((e.clientY - r.top) / r.height) * state.h;
    }

    host.addEventListener("pointermove", function (e) { toCell(e); state.inside = true; }, { passive: true });
    host.addEventListener("pointerleave", function () { state.inside = false; });
    host.addEventListener("click", function (e) {
      if (e.detail === 0) { state.px = -1; state.py = -1; state.keyboard = true; }
      else { toCell(e); state.keyboard = false; }
      hooks.click(state);
      if (!running) draw();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }).observe(host);
    } else {
      visible = true;
    }
    window.addEventListener("resize", resize);
    new MutationObserver(function () { if (!running) draw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    resize();
    draw();
    start();
    return state;
  }

  /* ================= Sky ================= */

  function makeCloud() {
    var cw = rand(16, 30) | 0;
    var ch = rand(6, 9) | 0;
    var puffs = [];
    var n = 3 + ((Math.random() * 3) | 0);
    for (var i = 0; i < n; i++) {
      puffs.push({ x: rand(3, cw - 3), y: rand(ch * 0.45, ch * 0.75), r: rand(2.2, ch * 0.62) });
    }
    var cells = [];
    for (var y = 0; y < ch - 1; y++) {
      for (var x = 0; x < cw; x++) {
        for (var p = 0; p < puffs.length; p++) {
          var dx = x - puffs[p].x, dy = (y - puffs[p].y) * 1.25;
          if (dx * dx + dy * dy <= puffs[p].r * puffs[p].r) { cells.push([x, y]); break; }
        }
      }
    }
    var top = {}, bottom = {};
    cells.forEach(function (c) {
      if (top[c[0]] === undefined || c[1] < top[c[0]]) top[c[0]] = c[1];
      if (bottom[c[0]] === undefined || c[1] > bottom[c[0]]) bottom[c[0]] = c[1];
    });
    cells.forEach(function (c) {
      c[2] = c[1] === bottom[c[0]] ? 1 : c[1] === top[c[0]] ? 2 : 0;
    });
    return { cells: cells, w: cw };
  }

  // Grows a cherry branch in from the left edge: a tapering limb with a few
  // forks, dotted with separate five-petal blossoms and the odd bud.
  function makeBranch(w, h) {
    var r = seeded(1605);
    var wood = {};
    var flowers = [];

    function plot(x, y, rad, shade) {
      for (var dy = -rad; dy <= rad; dy++) {
        for (var dx = -rad; dx <= rad; dx++) {
          if (dx * dx + dy * dy > rad * rad) continue;
          var key = Math.round(x + dx) + "," + Math.round(y + dy);
          var sh = dy > 0 || shade ? 1 : 0;
          if (wood[key] === undefined || sh < wood[key]) wood[key] = sh;
        }
      }
    }
    // tone: 0 pale petal, 1 petal, 2 deep petal, 3 centre
    function blossom(x, y) {
      x = Math.round(x); y = Math.round(y);
      var deep = r() < 0.35;
      [[0, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(function (o, i) {
        flowers.push([x + o[0], y + o[1], deep ? 2 : i % 2 ? 0 : 1, x / w]);
      });
      flowers.push([x, y, 3, x / w]);
    }
    function bud(x, y) {
      flowers.push([Math.round(x), Math.round(y), 2, x / w]);
    }
    function dress(x, y, i, every, chance) {
      if (i > 3 && i % every === 0 && r() < chance) {
        var off = r() < 0.5 ? -2 : 2;
        if (r() < 0.8) blossom(x + (r() - 0.5) * 2, y + off);
        else bud(x, y + (off > 0 ? 1 : -1));
      }
    }
    // A short twig that curls gently; may sprout one tiny side twig.
    function twig(x, y, angle, len, depth) {
      var curl = (r() - 0.5) * 0.05;
      for (var i = 0; i < len; i++) {
        x += Math.cos(angle);
        y += Math.sin(angle);
        angle += curl + (r() - 0.5) * 0.12;
        if (y < 2 || y > h - 4) break;
        plot(x, y, 0, false);
        dress(x, y, i, 4, 0.75);
        if (depth === 1 && i === ((len / 2) | 0) && r() < 0.6) {
          twig(x, y, angle + (r() < 0.5 ? -0.7 : 0.7), 5 + r() * 6, 2);
        }
      }
      blossom(x + Math.cos(angle) * 2, y + Math.sin(angle) * 2);
      if (r() < 0.5) bud(x + 3, y - 2);
    }

    // The limb follows a soft S-curve across the sky and tapers as it goes.
    var len = Math.min(w * 0.62, 190);
    var y0 = h * 0.38;
    var forks = 8;
    var nextFork = len / forks * (0.5 + r() * 0.4);
    var side = -1;
    for (var x = -3; x < len; x++) {
      var f = (x + 3) / len;
      var y = y0 - f * h * 0.12 + Math.sin(x * 0.04 + 0.6) * h * 0.08 + Math.sin(x * 0.11) * 1.2;
      var t = 2.8 - f * 1.9;
      plot(x, y, t > 1.5 ? 1 : 0, false);
      if (t > 2.2) plot(x, y + 1, 1, true);
      if (f > 0.2) dress(x, y, x, 5, 0.55);
      if (x >= nextFork && x < len - 8) {
        twig(x, y, side * (0.5 + r() * 0.45), 12 + r() * 18, 1);
        side = r() < 0.7 ? -side : side;
        nextFork += len / forks * (0.7 + r() * 0.6);
      }
    }
    blossom(len + 1, y0 - h * 0.12 + Math.sin(len * 0.04 + 0.6) * h * 0.08);
    var woodCells = Object.keys(wood).map(function (k) {
      var p = k.split(",");
      return [+p[0], +p[1], wood[k], +p[0] / w];
    });
    return { wood: woodCells, flowers: flowers, reach: len };
  }

  var BIRD_UP = [[0, 0], [1, 1], [2, 1], [3, 1], [4, 0]];
  var BIRD_DOWN = [[0, 2], [1, 1], [2, 1], [3, 1], [4, 2]];

  function initSky(canvas) {
    var clouds = [];
    var birds = [];
    var stars = [];
    var trails = [];
    var petals = [];
    var branch = { wood: [], flowers: [], reach: 0 };
    var shake = 0;
    var nextBird = 4;
    var nextPetal = 0;

    function spawnBird(x, y, burst) {
      birds.push({
        x: x, y: y,
        vx: burst ? rand(0.35, 0.8) : rand(0.18, 0.3),
        vy: burst ? rand(-0.32, -0.06) : rand(-0.02, 0.02),
        phase: rand(0, 6),
        flap: burst ? rand(14, 18) : rand(7, 10),
      });
    }
    function spawnPetal(x, y, burst) {
      if (petals.length > 140) petals.shift();
      var a = rand(0, Math.PI * 2);
      petals.push({
        x: x, y: y,
        vx: burst ? Math.cos(a) * rand(0.3, 0.9) : rand(0.08, 0.22),
        vy: burst ? Math.sin(a) * rand(0.2, 0.6) - 0.2 : rand(0.04, 0.1),
        p: rand(0, 6),
        tone: (Math.random() * 3) | 0,
      });
    }
    function fromBranch(burst) {
      if (!branch.flowers.length) return;
      var f = pick(branch.flowers);
      spawnPetal(f[0], f[1], burst);
    }

    var sky = Scene(canvas, {
      resize: function (s) {
        branch = makeBranch(s.w, s.h);
        clouds = [];
        var count = Math.max(2, Math.round(s.w / 90));
        for (var i = 0; i < count; i++) {
          var c = makeCloud();
          c.x = rand(-c.w, s.w);
          c.y = rand(2, Math.max(3, s.h - 14));
          c.v = rand(0.012, 0.03);
          clouds.push(c);
        }
        stars = [];
        var n = Math.round((s.w * s.h) / 80);
        for (var j = 0; j < n; j++) {
          stars.push({ x: (Math.random() * s.w) | 0, y: (Math.random() * s.h) | 0, p: rand(0, 6), sp: rand(0.6, 2.2), b: Math.random() < 0.12 });
        }
        // A few petals already in the air on first paint.
        if (!petals.length) for (var k = 0; k < 14; k++) {
          spawnPetal(rand(0, branch.reach + 20), rand(0, s.h), false);
        }
      },
      step: function (s) {
        clouds.forEach(function (c) {
          c.x += c.v;
          if (c.x > s.w + 2) { c.x = -c.w - rand(0, 30); c.y = rand(2, Math.max(3, s.h - 14)); }
        });
        birds.forEach(function (b) {
          b.x += b.vx;
          b.y += b.vy + Math.sin(s.t * 2 + b.phase) * 0.03;
          b.vy *= 0.995;
        });
        birds = birds.filter(function (b) { return b.x < s.w + 6 && b.y > -6; });
        trails.forEach(function (tr) { tr.x += tr.vx; tr.y += tr.vy; tr.life -= 1; });
        trails = trails.filter(function (tr) { return tr.life > 0; });

        // Petals: a light breeze, a little flutter, and a swirl around the pointer.
        nextPetal -= 1 / 60;
        if (nextPetal <= 0) { fromBranch(false); nextPetal = rand(0.25, 0.6); }
        petals.forEach(function (p) {
          p.vx += (0.14 - p.vx) * 0.02;
          p.vy += (0.08 - p.vy) * 0.03;
          if (s.inside) {
            var dx = p.x - s.px, dy = p.y - s.py;
            var d2 = dx * dx + dy * dy;
            if (d2 < 140 && d2 > 0.01) {
              var f = (140 - d2) / 140 * 0.09;
              var d = Math.sqrt(d2);
              p.vx += (dx / d) * f - (dy / d) * f * 0.6;
              p.vy += (dy / d) * f + (dx / d) * f * 0.6;
            }
          }
          p.x += p.vx + Math.sin(s.t * 3 + p.p) * 0.06;
          p.y += p.vy;
        });
        petals = petals.filter(function (p) { return p.y < s.h + 2 && p.x < s.w + 2 && p.x > -4 && p.y > -6; });
        shake *= 0.94;

        if (!isDark()) {
          nextBird -= 1 / 60;
          if (nextBird <= 0) {
            var y = rand(4, s.h * 0.6);
            var n = 1 + ((Math.random() * 3) | 0);
            for (var i = 0; i < n; i++) spawnBird(-6 - i * rand(5, 9), y + rand(-3, 3), false);
            nextBird = rand(8, 16);
          }
        }
      },
      draw: function (s) {
        var ctx = s.ctx;
        var dark = isDark();
        if (dark) {
          stars.forEach(function (st) {
            var a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.t * st.sp + st.p));
            ctx.globalAlpha = reduce ? 0.7 : a;
            ctx.fillStyle = "#e5e5e5";
            ctx.fillRect(st.x, st.y, 1, 1);
            if (st.b && a > 0.85) {
              ctx.globalAlpha = 0.35;
              ctx.fillRect(st.x - 1, st.y, 1, 1);
              ctx.fillRect(st.x + 1, st.y, 1, 1);
              ctx.fillRect(st.x, st.y - 1, 1, 1);
              ctx.fillRect(st.x, st.y + 1, 1, 1);
            }
          });
          ctx.globalAlpha = 1;
          var mx = Math.round(s.w * 0.8), my = 12, mr = 6;
          ctx.fillStyle = "#e9e4cf";
          for (var y = -mr; y <= mr; y++) {
            for (var x = -mr; x <= mr; x++) {
              var inMoon = x * x + y * y <= mr * mr;
              var bite = (x - 3) * (x - 3) + (y + 2) * (y + 2) <= mr * mr * 0.8;
              if (inMoon && !bite) ctx.fillRect(mx + x, my + y, 1, 1);
            }
          }
          trails.forEach(function (tr) {
            for (var k = 0; k < 8; k++) {
              ctx.globalAlpha = (tr.life / 40) * (1 - k / 8);
              ctx.fillStyle = "#f4f0dc";
              ctx.fillRect(Math.round(tr.x - tr.vx * k), Math.round(tr.y - tr.vy * k), 1, 1);
            }
          });
          ctx.globalAlpha = 1;
        }

        var body = dark ? "#2b2d32" : "#e6e9ee";
        var shade = dark ? "#232428" : "#d9dde4";
        var light = dark ? "#33363c" : "#f2f4f7";
        clouds.forEach(function (c) {
          var ox = Math.round(c.x), oy = Math.round(c.y);
          c.cells.forEach(function (cell) {
            ctx.fillStyle = cell[2] === 1 ? shade : cell[2] === 2 ? light : body;
            ctx.fillRect(ox + cell[0], oy + cell[1], 1, 1);
          });
        });

        // Branch: the outer twigs sway more than the limb, and more when shaken.
        var sway = reduce ? 0 : Math.sin(s.t * 0.9) * 0.6 + Math.sin(s.t * 22) * shake;
        var woodTones = dark ? ["#4a3a33", "#3a2d28"] : ["#7a5646", "#5e4136"];
        branch.wood.forEach(function (c) {
          ctx.fillStyle = woodTones[c[2]];
          ctx.fillRect(c[0] + Math.round(sway * c[3] * c[3]), c[1], 1, 1);
        });
        var bloom = dark ? ["#efc8d3", "#d99aac", "#b8748a", "#f0d27a"] : ["#fbd3de", "#f4aec2", "#e48aa5", "#d9a03f"];
        branch.flowers.forEach(function (c) {
          ctx.fillStyle = bloom[c[2]];
          ctx.fillRect(c[0] + Math.round(sway * c[3] * c[3]), c[1], 1, 1);
        });

        var petalTones = dark ? ["#e0aebd", "#c98a9c", "#f0c9d4"] : ["#f7c1cf", "#ee9fb4", "#fbd6df"];
        petals.forEach(function (p) {
          ctx.fillStyle = petalTones[p.tone];
          var px = Math.round(p.x), py = Math.round(p.y);
          ctx.fillRect(px, py, 1, 1);
          // Petals tumble: wide, then edge-on.
          if (Math.sin(s.t * 4 + p.p) > -0.2) ctx.fillRect(px + 1, py, 1, 1);
        });

        ctx.fillStyle = dark ? "#9aa0aa" : "#7b808a";
        birds.forEach(function (b) {
          var shape = Math.sin(s.t * b.flap + b.phase) > 0 ? BIRD_UP : BIRD_DOWN;
          var bx = Math.round(b.x), by = Math.round(b.y);
          shape.forEach(function (c) { ctx.fillRect(bx + c[0], by + c[1], 1, 1); });
        });
      },
      click: function (s) {
        shake = 1.6;
        var x = s.keyboard ? branch.reach * 0.6 : s.px;
        var y = s.keyboard ? s.h * 0.3 : s.py;
        for (var i = 0; i < 16; i++) spawnPetal(x + rand(-3, 3), y + rand(-2, 2), true);
        for (var j = 0; j < 10; j++) fromBranch(true);
      },
    });

    window.PixelSky = {
      flock: function () {
        shake = 1.2;
        for (var j = 0; j < 12; j++) fromBranch(true);
        var x = sky.w * 0.25, y = sky.h * 0.7;
        if (isDark()) trails.push({ x: sky.w * 0.2, y: 4, vx: 1.3, vy: 0.5, life: 40 });
        else for (var i = 0; i < 7; i++) spawnBird(x + rand(-6, 6), y + rand(-3, 3), true);
      },
    };
  }

  /* ================= Pets ================= */

  // Two cats, Masala and Jeeru. Sprites face right. "#" base coat, "d" darker
  // stripe or patch, "o" orange patch, "w" white, "e" eye. Colour "p" (if set)
  // paints the bottom row of the legs, for white paws.
  var CAT_LEGS = ["..#.#...#.#...", ".#...#.#...#.."];
  var CAT_TAIL = [[[1, 4], [0, 3], [0, 2], [0, 1], [1, 0]], [[1, 4], [0, 3], [0, 2], [-1, 1], [-1, 0]]];
  var CAT_SIT_TAIL = [[[1, 7], [0, 7], [-1, 7]], [[1, 7], [0, 7], [-1, 6]]];

  // Jeeru: ginger tabby with a white chest and paws. He follows the pointer.
  var JEERU = [
    "..........#..#",
    "..........####",
    "..........##e#",
    "..........##ww",
    "..#d#d#d###...",
    "..########w...",
  ];
  var JEERU_SIT = [
    "....#..#",
    "....####",
    "....##e#",
    "....##ww",
    "...#d#w.",
    "..#d##w.",
    "..#d###.",
    "..##w#w.",
  ];

  // Masala: tortoiseshell, dark with orange and caramel patches. She ignores it.
  var MASALA = [
    "..........#..#",
    "..........#o##",
    "..........##e#",
    "..........o###",
    "..#o##d#oo#...",
    "..o##d##o##...",
  ];
  var MASALA_SIT = [
    "....#..#",
    "....#o##",
    "....##e#",
    "....o###",
    "...#o#d.",
    "..#o##o.",
    "..#d#o#.",
    "..o##d#.",
  ];

  function drawSprite(ctx, rows, legs, tail, colors, x, bottom, dir) {
    var all = legs ? rows.concat([legs, legs]) : rows;
    var H = all.length, W = all[0].length;
    var top = bottom - H + 1;
    function put(cx, cy, color) {
      ctx.fillStyle = color;
      ctx.fillRect(dir > 0 ? x + cx : x + (W - 1 - cx), top + cy, 1, 1);
    }
    for (var r = 0; r < H; r++) {
      for (var c = 0; c < W; c++) {
        var ch = all[r][c];
        if (ch === ".") continue;
        if (legs && r === H - 1 && colors.p) put(c, r, colors.p);
        else put(c, r, colors[ch] || colors["#"]);
      }
    }
    if (tail) tail.forEach(function (t) { put(t[0], t[1], colors["#"]); });
  }

  /* ================= Meadow ================= */

  var PETALS = ["#f2a7b8", "#f6cf5a", "#9db4f2", "#ffffff", "#e98f6e", "#c9a7f0"];

  function initMeadow(canvas) {
    var heights = [];
    var shades = [];
    var bend = [];
    var vel = [];
    var flowers = [];
    var flies = [];
    var GROUND = 3;
    var jeeru = null; // follows the pointer
    var masala = null; // keeps to her own schedule of naps

    function addFlower(x, grown) {
      flowers.push({
        x: Math.round(x),
        stem: rand(12, 24) | 0,
        grow: grown || reduce ? 1 : 0,
        speed: rand(0.012, 0.02),
        color: pick(PETALS),
      });
      if (flowers.length > 48) flowers.shift();
    }

    function petHit(p, w, h, s) {
      return s.px >= p.x - 2 && s.px <= p.x + w + 2 && s.py >= s.h - GROUND - h - 4 + p.y && s.py <= s.h;
    }

    function stepJeeru(s) {
      var d = jeeru;
      d.frame += 1;
      if (d.y < 0 || d.vy < 0) {
        d.vy += 0.12;
        d.y += d.vy;
        d.x += d.vx;
        if (d.y >= 0) { d.y = 0; d.vy = 0; d.vx = 0; }
        return;
      }
      var mid = d.x + 7;
      // Jeeru is curious: he trots after the pointer and sits down beside it.
      if (s.inside && Math.abs(s.px - mid) > 5) {
        d.dir = s.px > mid ? 1 : -1;
        d.state = "run";
      } else if (s.inside) {
        d.state = "happy";
      } else {
        d.timer -= 1 / 60;
        if (d.timer <= 0) {
          d.state = d.state === "walk" ? "idle" : "walk";
          d.timer = d.state === "walk" ? rand(3, 7) : rand(1.5, 3.5);
          if (Math.random() < 0.4) d.dir *= -1;
        }
      }
      var speed = d.state === "run" ? 0.42 : d.state === "walk" ? 0.18 : 0;
      d.x += speed * d.dir;
      if (d.x < 2) { d.x = 2; d.dir = 1; }
      if (d.x > s.w - 18) { d.x = s.w - 18; d.dir = -1; }
      d.moving = speed > 0;
    }

    function stepMasala(s) {
      var c = masala;
      c.frame += 1;
      if (c.y < 0 || c.vy < 0) {
        c.vy += 0.1;
        c.y += c.vy;
        c.x += c.vx;
        if (c.y >= 0) { c.y = 0; c.vy = 0; c.vx = 0; c.state = "sit"; c.timer = rand(2, 4); }
        return;
      }
      c.timer -= 1 / 60;
      if (c.timer <= 0) {
        c.state = c.state === "walk" ? "sit" : "walk";
        c.timer = c.state === "walk" ? rand(4, 8) : rand(3, 6);
        if (c.state === "walk" && Math.random() < 0.5) c.dir *= -1;
      }
      var speed = c.state === "walk" ? 0.12 : 0;
      c.x += speed * c.dir;
      if (c.x < 2) { c.x = 2; c.dir = 1; }
      if (c.x > s.w - 16) { c.x = s.w - 16; c.dir = -1; }
    }

    Scene(canvas, {
      resize: function (s) {
        var a = rand(0, 6), b = rand(0, 6);
        heights = []; shades = []; bend = []; vel = [];
        for (var x = 0; x < s.w; x++) {
          var n = 0.5 + 0.3 * Math.sin(x * 0.07 + a) + 0.2 * Math.sin(x * 0.19 + b);
          var h = 4 + n * 9 + rand(-2, 3);
          if (Math.random() < 0.06) h += rand(3, 7);
          heights.push(Math.max(3, Math.round(h)));
          shades.push(Math.random());
          bend.push(0);
          vel.push(0);
        }
        flowers = flowers.filter(function (f) { return f.x < s.w; });
        if (!flowers.length) {
          var seed = Math.max(5, Math.round(s.w / 40));
          for (var i = 0; i < seed; i++) addFlower(rand(4, s.w - 4), true);
        }
        flies = [];
        var fn = Math.max(8, Math.round(s.w / 28));
        for (var j = 0; j < fn; j++) {
          flies.push({ x: rand(0, s.w), y: rand(s.h * 0.2, s.h - 10), vx: 0, vy: 0, p: rand(0, 6) });
        }
        if (!jeeru) jeeru = { x: s.w * 0.3, y: 0, vx: 0, vy: 0, dir: 1, state: "walk", timer: 4, frame: 0, moving: true };
        if (!masala) masala = { x: s.w * 0.62, y: 0, vx: 0, vy: 0, dir: -1, state: "sit", timer: 3, frame: 0 };
        jeeru.x = Math.min(jeeru.x, s.w - 18);
        masala.x = Math.min(masala.x, s.w - 16);
      },
      step: function (s) {
        var base = s.h - GROUND;
        for (var x = 0; x < s.w; x++) {
          var target = Math.sin(s.t * 1.3 + x * 0.08) * 1.1 + Math.sin(s.t * 0.45 + x * 0.021) * 1.6;
          if (s.inside) {
            var d = x - s.px;
            var reach = 16;
            if (Math.abs(d) < reach && s.py > base - heights[x] - 14) {
              target += (d >= 0 ? 1 : -1) * ((reach - Math.abs(d)) / reach) * 7;
            }
          }
          // Pets brush the grass aside as they pass.
          [jeeru, masala].forEach(function (p) {
            var dd = x - (p.x + 7);
            if (Math.abs(dd) < 8) target += (dd >= 0 ? 1 : -1) * (8 - Math.abs(dd)) * 0.35;
          });
          vel[x] += (target - bend[x]) * 0.07;
          vel[x] *= 0.84;
          bend[x] += vel[x];
        }
        flowers.forEach(function (f) { if (f.grow < 1) f.grow = Math.min(1, f.grow + f.speed); });
        flies.forEach(function (f) {
          f.vx += rand(-0.02, 0.02);
          f.vy += rand(-0.02, 0.02);
          f.vx *= 0.97; f.vy *= 0.97;
          f.x += f.vx; f.y += f.vy;
          if (f.x < 0) f.x += s.w;
          if (f.x > s.w) f.x -= s.w;
          if (f.y < s.h * 0.15 || f.y > s.h - 8) f.vy *= -1;
        });
        stepJeeru(s);
        stepMasala(s);
      },
      draw: function (s) {
        var ctx = s.ctx;
        var dark = isDark();
        var base = s.h - GROUND;
        var tones = dark ? ["#24402a", "#32573a", "#45734b"] : ["#5f8f4e", "#7fae63", "#a6cd84"];

        for (var x = 0; x < s.w; x++) {
          var h = heights[x];
          var lean = bend[x] * (0.7 + shades[x] * 0.6);
          for (var k = 0; k < h; k++) {
            var f = k / h;
            ctx.fillStyle = f > 0.78 ? tones[2] : f > 0.38 ? tones[1] : tones[0];
            if (shades[x] < 0.18 && f > 0.4) ctx.fillStyle = tones[0];
            ctx.fillRect(x + Math.round(lean * f * f), base - k, 1, 1);
          }
        }

        flowers.forEach(function (fl) {
          var stemH = Math.max(1, Math.round(fl.stem * fl.grow));
          var b = (bend[fl.x] || 0) * 0.6;
          ctx.fillStyle = dark ? "#3c6a42" : "#4d7d3f";
          var tipX = fl.x, tipY = base - stemH;
          for (var k = 0; k < stemH; k++) {
            var f = k / fl.stem;
            tipX = fl.x + Math.round(b * f * f);
            tipY = base - k;
            ctx.fillRect(tipX, tipY, 1, 1);
          }
          if (fl.grow > 0.55 && fl.grow < 1) {
            ctx.fillStyle = dark ? "#52804f" : "#8cbc6e";
            ctx.fillRect(tipX, tipY - 1, 1, 1);
          }
          if (fl.grow >= 1) {
            ctx.fillStyle = dark && fl.color === "#ffffff" ? "#d8d8e8" : fl.color;
            ctx.fillRect(tipX - 1, tipY - 2, 3, 1);
            ctx.fillRect(tipX, tipY - 3, 1, 3);
            ctx.fillRect(tipX - 2, tipY - 2, 1, 1);
            ctx.fillRect(tipX + 2, tipY - 2, 1, 1);
            ctx.fillRect(tipX, tipY - 4, 1, 1);
            ctx.fillStyle = fl.color === "#f6cf5a" ? "#a8642a" : "#f6cf5a";
            ctx.fillRect(tipX, tipY - 2, 1, 1);
          }
        });

        // Masala and Jeeru
        var jeeruCol = dark
          ? { "#": "#c47a36", d: "#9a5a24", w: "#d9cfbd", e: "#1a120a", p: "#d9cfbd" }
          : { "#": "#d98a3d", d: "#b4672a", w: "#f4ead8", e: "#2b1d10", p: "#f4ead8" };
        var masalaCol = dark
          ? { "#": "#6b5546", o: "#c98a4e", d: "#4a3c33", e: "#f6cf5a" }
          : { "#": "#3a2c24", o: "#c47a3a", d: "#1f1915", e: "#e8c55a" };

        // Jeeru sits once caught up with the pointer, or when resting.
        var m = jeeru;
        var mFlick = ((m.frame / (m.state === "happy" ? 6 : 30)) | 0) % 2;
        if (!m.moving && m.y === 0) {
          drawSprite(ctx, JEERU_SIT, null, CAT_SIT_TAIL[mFlick], jeeruCol, Math.round(m.x) + 3, base - 1, m.dir);
        } else {
          var mStep = m.moving ? ((m.frame / (m.state === "run" ? 5 : 10)) | 0) % 2 : 0;
          drawSprite(ctx, JEERU, CAT_LEGS[mStep], CAT_TAIL[mFlick], jeeruCol, Math.round(m.x), base - 1 + Math.round(m.y), m.dir);
        }

        var j = masala;
        var flick = ((j.frame / 40) | 0) % 3 === 0 ? 1 : 0;
        if (j.state === "sit" && j.y === 0) {
          drawSprite(ctx, MASALA_SIT, null, CAT_SIT_TAIL[flick], masalaCol, Math.round(j.x) + 3, base - 1, j.dir);
        } else {
          var jStep = j.state === "walk" ? ((j.frame / 11) | 0) % 2 : 0;
          drawSprite(ctx, MASALA, CAT_LEGS[jStep], CAT_TAIL[flick], masalaCol, Math.round(j.x), base - 1 + Math.round(j.y), j.dir);
        }

        // Ground strip in front of the paws.
        ctx.fillStyle = dark ? "#1f3624" : "#557f45";
        ctx.fillRect(0, base, s.w, GROUND);
        ctx.fillStyle = dark ? "#2a4a30" : "#6b9a57";
        for (var g = 0; g < s.w; g += 3) ctx.fillRect(g + ((g * 7) % 2), base + 1 + ((g * 13) % 2), 1, 1);

        if (dark) {
          flies.forEach(function (f) {
            var a = reduce ? 0.8 : 0.5 + 0.5 * Math.sin(s.t * 2.4 + f.p);
            if (a < 0.15) return;
            var fx = Math.round(f.x), fy = Math.round(f.y);
            ctx.fillStyle = "#f3e38a";
            ctx.globalAlpha = a * 0.25;
            ctx.fillRect(fx - 1, fy, 3, 1);
            ctx.fillRect(fx, fy - 1, 1, 3);
            ctx.globalAlpha = a;
            ctx.fillRect(fx, fy, 1, 1);
          });
          ctx.globalAlpha = 1;
        }
      },
      click: function (s) {
        if (s.keyboard) {
          // Keyboard: Jeeru hops and a flower appears nearby.
          jeeru.vy = -1.6; jeeru.y = -0.01;
          addFlower(Math.min(s.w - 3, jeeru.x + 20), false);
          return;
        }
        if (petHit(jeeru, 14, 9, s)) {
          jeeru.vy = -1.7; jeeru.y = -0.01; jeeru.vx = jeeru.dir * 0.25;
          return;
        }
        if (petHit(masala, 14, 8, s)) {
          masala.state = "pounce";
          masala.vy = -1.4; masala.y = -0.01; masala.vx = masala.dir * 0.7;
          return;
        }
        addFlower(Math.max(2, Math.min(s.w - 3, s.px)), false);
      },
    });
  }

  function boot() {
    var sky = document.getElementById("sky-canvas");
    if (sky && !sky.dataset.ready) { sky.dataset.ready = "1"; initSky(sky); }
    var meadow = document.getElementById("meadow-canvas");
    if (meadow && !meadow.dataset.ready) { meadow.dataset.ready = "1"; initMeadow(meadow); }
  }

  document.addEventListener("chrome:footer", boot);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
