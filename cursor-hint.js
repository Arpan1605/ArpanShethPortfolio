(function () {
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) return;

  var hint = document.createElement("div");
  hint.className = "cursor-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.innerHTML =
    '<span class="cursor-hint__scroll">' +
      '<svg viewBox="0 0 100 100" class="cursor-hint__scroll-ring">' +
        '<defs><path id="cursorHintCirclePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" /></defs>' +
        '<text><textPath href="#cursorHintCirclePath">&bull; SCROLL &bull; SCROLL &bull; SCROLL &bull; SCROLL </textPath></text>' +
      "</svg>" +
    "</span>" +
    '<span class="cursor-hint__label">View Project</span>';
  document.body.appendChild(hint);

  var raf = null;
  var lastX = 0;
  var lastY = 0;

  function onMove(e) {
    lastX = e.clientX;
    lastY = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      hint.style.transform = "translate3d(" + lastX + "px," + lastY + "px,0)";
      raf = null;
    });
  }

  document.addEventListener("mousemove", onMove, { passive: true });

  function activate(mode) {
    hint.classList.add("is-active");
    hint.classList.toggle("is-scroll", mode === "scroll");
    hint.classList.toggle("is-project", mode === "project");
  }

  function deactivate() {
    hint.classList.remove("is-active", "is-scroll", "is-project");
  }

  document.querySelectorAll('[data-cursor-hint="scroll"]').forEach(function (zone) {
    zone.addEventListener("mouseenter", function () {
      activate("scroll");
    });
    zone.addEventListener("mouseleave", deactivate);
  });

  document.querySelectorAll(".home-work-card").forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      activate("project");
    });
    card.addEventListener("mouseleave", deactivate);
  });
})();
