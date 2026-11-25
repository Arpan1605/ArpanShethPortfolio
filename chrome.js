/* Arpan Sheth — shared page chrome (header + footer) for every page.
   Edit navigation, contact details and footer copy here once; every page picks
   them up. Load this synchronously as the first element inside <body>.
   Styles live in chrome.css; the pixel meadow in the footer is drawn by pixels.js. */
(function () {
  "use strict";

  var body = document.body;
  var isHome = body.getAttribute("data-page") === "home";
  var base = isHome ? "" : "index.html";

  var EMAIL = "mrarpansheth@gmail.com";
  var LINKEDIN = "https://www.linkedin.com/in/arpan-sheth-939171171/";
  var GITHUB = "https://github.com/Arpan1605";
  var RESUME = "resume.pdf?v=20261125";

  var links = isHome
    ? [
        { label: "Work", href: "#work" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
        { label: "Resume", href: RESUME, download: true },
      ]
    : [
        { label: "Back to home", href: "index.html" },
        { label: "Work", href: "index.html#work" },
        { label: "Contact", href: "#contact" },
        { label: "Resume", href: RESUME, download: true },
      ];

  // The switch is offered where the page's styles support both themes.
  var themeSwitch = body.hasAttribute("data-theme-toggle")
    ? '<button id="theme-toggle" class="theme-switch" type="button" role="switch" aria-checked="false">' +
      '<span class="theme-track" aria-hidden="true"><span class="theme-knob"></span>' +
      '<svg class="theme-icon sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>' +
      '<svg class="theme-icon moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '</span><span class="sr-only">Dark theme</span></button>'
    : "";

  // Case pages lead with the small "a" mark, which links home and redraws on hover.
  var home = isHome
    ? ""
    : '<a class="topnav__mark" href="index.html" aria-label="Arpan Sheth, home">' +
      '<svg viewBox="0 0 72 72" fill="none" aria-hidden="true"><g transform="skewX(-12) translate(14 0)">' +
      '<path pathLength="1" d="M10 12 L50 12 L50 64 L10 64 L10 38 L50 38" /></g></svg></a>';

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<header class="topnav' + (isHome ? " topnav--home" : " topnav--bar") + '">' +
    (isHome ? "" : '<div class="topnav__inner">') +
    home +
    '<nav class="topnav__links" aria-label="Main navigation">' +
    links.map(function (l) {
      return '<a href="' + l.href + '"' + (l.download ? ' download="Arpan-Sheth-Resume.pdf"' : "") + ">" + l.label + "</a>";
    }).join("") +
    themeSwitch +
    "</nav>" + (isHome ? "" : "</div>") + "</header>";

  body.insertAdjacentHTML("afterbegin", header);

  /* Theme switch: a circle reveal grows out of the switch. The choice is stored
     and applied before first paint by the small script in each page's <head>. */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function syncTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    if (toggle) toggle.setAttribute("aria-checked", String(dark));
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#181818" : "#fafafa");
  }
  function applyTheme(dark) {
    if (dark) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try { localStorage.setItem("arpan-wall-theme", dark ? "dark" : "light"); } catch (e) {}
    syncTheme();
  }
  syncTheme();
  if (toggle) {
    toggle.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") !== "dark";
      if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        applyTheme(dark);
        return;
      }
      var r = toggle.getBoundingClientRect();
      var x = r.left + r.width / 2;
      var y = r.top + r.height / 2;
      var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(function () { applyTheme(dark); }).ready.then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
          { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    });
  }

  function wave(label, href, extra) {
    return '<a href="' + href + '"' + (extra || "") + ">" + label + '<span class="wave-underline" aria-hidden="true"></span></a>';
  }

  var year = new Date().getFullYear();
  var footer =
    '<footer id="contact" class="foot">' +
    '<div class="foot__inner">' +
    '<p class="foot__label">Open to Product Designer &amp; Senior UX/UI roles · happy to relocate</p>' +
    "<h2>Let’s design<br />what’s next.</h2>" +
    '<div class="foot__links">' +
    wave(EMAIL, "mailto:" + EMAIL) +
    wave("linkedin/arpan-sheth", LINKEDIN, ' target="_blank" rel="noopener noreferrer"') +
    wave("github/Arpan1605", GITHUB, ' target="_blank" rel="noopener noreferrer"') +
    wave("resume.pdf", RESUME, ' download="Arpan-Sheth-Resume.pdf"') +
    "</div></div>" +
    '<div class="foot__bottom">' +
    '<span class="foot__made" title="Jeeru &amp; Masala, Arpan’s godcats">Created with paws and tails' +
    '<svg class="foot__paw" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16.5" rx="5" ry="4.2"/><ellipse cx="5.5" cy="10.5" rx="2.1" ry="2.7"/><ellipse cx="9.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="14.5" cy="6.5" rx="2.1" ry="2.8"/><ellipse cx="18.5" cy="10.5" rx="2.1" ry="2.7"/></svg>' +
    "</span>" +
    "<span>© " + year + " Arpan Sheth</span>" +
    '<a href="#top">Back to top ↑</a>' +
    "</div>" +
    '<button class="meadow" type="button" aria-label="Make Jeeru hop and plant a flower in the pixel meadow, where Jeeru and Masala live"><canvas id="meadow-canvas" aria-hidden="true"></canvas></button>' +
    "</footer>";

  // The footer goes after the page wrapper (.page) once the document has parsed.
  var footerDone = false;
  function renderFooter() {
    if (footerDone) return;
    var page = document.querySelector(".page");
    if (!page) return;
    footerDone = true;
    page.insertAdjacentHTML("afterend", footer);
    document.dispatchEvent(new CustomEvent("chrome:footer"));
  }

  window.SiteChrome = { renderFooter: renderFooter };
  document.addEventListener("DOMContentLoaded", renderFooter);

  // The "Ask" assistant (assistant.js) floats over every page.
  var ask = document.createElement("script");
  ask.src = "assistant.js?v=20261125f";
  ask.defer = true;
  document.head.appendChild(ask);
})();
