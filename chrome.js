/* Arpan Sheth — shared page chrome (header, full-screen menu, footer, cursor).
   Edit navigation, contact details and footer copy here once; every page picks
   them up. Load this synchronously as the first element inside <body> so the
   header is in place before the first paint. */
(function () {
  "use strict";

  var body = document.body;
  var isHome = body.getAttribute("data-page") === "home";
  var base = isHome ? "" : "index.html";
  var path = location.pathname.split("/").pop() || "index.html";

  var EMAIL = "mrarpansheth@gmail.com";
  var LINKEDIN = "https://www.linkedin.com/in/arpan-sheth-939171171/";
  var GITHUB = "https://github.com/Arpan1605";
  var RESUME = "resume.pdf";

  function current(href) {
    return href === path ? ' aria-current="page"' : "";
  }

  function roll(label) {
    return '<span data-text="' + label + '">' + label + "</span>";
  }

  var headerLinks = [
    { label: "Work", href: base + "#work" },
    { label: "About", href: base + "#about" },
    { label: "Experience", href: base + "#experience" },
    { label: "AI Workflow", href: "ai-workflow.html" },
  ];

  var menuLinks = [
    { label: "Work", href: base + "#work" },
    { label: "About", href: base + "#about" },
    { label: "Capabilities", href: base + "#capabilities" },
    { label: "Experience", href: base + "#experience" },
    { label: "Recognition", href: base + "#recognition" },
    { label: "AI Workflow", href: "ai-workflow.html" },
  ];

  var themeToggle = body.hasAttribute("data-theme-toggle")
    ? '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark theme">' +
      '<svg class="theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>' +
      '<svg class="theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' +
      "</button>"
    : "";

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<header class="site-header">' +
    '<a class="site-header__logo" href="' + (isHome ? "#top" : "index.html") + '" aria-label="Arpan Sheth — home">' +
    '<span class="wordmark" aria-hidden="true"><span>A</span><span>R</span><span>P</span><span>A</span><span>N</span><span class="wordmark__gap"></span><span>S</span><span>H</span><span>E</span><span>T</span><span>H</span></span>' +
    "</a>" +
    '<nav class="site-header__nav" aria-label="Primary navigation">' +
    '<ul class="site-header__menu">' +
    headerLinks.map(function (l) {
      return '<li><a class="roll" href="' + l.href + '"' + current(l.href) + ">" + roll(l.label) + "</a></li>";
    }).join("") +
    '<li><a class="roll" href="' + RESUME + '" download="Arpan-Sheth-Resume.pdf">' + roll("Resume") + "</a></li>" +
    "</ul>" +
    '<a class="btn btn--dark site-header__cta roll" href="#contact">' + roll("Contact") + "</a>" +
    themeToggle +
    '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="full-nav" aria-label="Open menu">' +
    '<span class="nav-toggle__dot"></span><span class="nav-toggle__dot"></span><span class="nav-toggle__dot"></span><span class="nav-toggle__dot"></span>' +
    "</button>" +
    "</nav>" +
    "</header>" +
    '<div class="full-nav" id="full-nav" aria-hidden="true" data-lenis-prevent>' +
    '<div class="full-nav__inner">' +
    '<ul class="full-nav__menu">' +
    menuLinks.map(function (l, i) {
      // Each letter is its own span so the hover roll can stagger them;
      // screen readers get the plain label instead.
      var chars = l.label.split("").map(function (c, j) {
        return '<span class="full-nav__char" style="--i:' + j + '">' + (c === " " ? "&nbsp;" : c) + "</span>";
      }).join("");
      return '<li><a href="' + l.href + '"' + current(l.href) + '><span class="mono full-nav__num">0' + (i + 1) + "</span>" +
        '<span class="full-nav__label"><span class="sr-only">' + l.label + '</span><span class="full-nav__chars" aria-hidden="true">' + chars + "</span></span>" +
        '<span class="full-nav__arrow" aria-hidden="true">→</span></a></li>';
    }).join("") +
    "</ul>" +
    '<div class="full-nav__meta">' +
    '<div><p class="mono label">Say hello</p><a href="mailto:' + EMAIL + '">' + EMAIL + "</a></div>" +
    '<div><p class="mono label">Based in</p><p>Ahmedabad, India — open to relocating</p></div>' +
    '<div class="full-nav__social">' +
    '<a class="pill pill--light" href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a>' +
    '<a class="pill pill--light" href="' + GITHUB + '" target="_blank" rel="noopener">GitHub</a>' +
    '<a class="pill pill--light" href="' + RESUME + '" download="Arpan-Sheth-Resume.pdf">Resume</a>' +
    "</div></div></div></div>";

  body.insertAdjacentHTML("afterbegin", header);

  /* ---------- Footer crowd ----------
     Smiling Open Peeps (CC0, openpeeps.com) packed into one atlas image,
     [x, width] per person at a 280px-tall source. Each one walks across on
     their own lane with a little bob; Arpan stands still in the middle. */
  var PEEPS = [[0,203],[207,190],[401,200],[605,195],[804,239],[1047,187],[1238,197],[1439,193],[1636,197],[1837,202],[2043,184],[2231,197],[2432,177],[2613,195],[2812,184],[3000,173],[3177,191],[3372,194],[3570,217],[3791,190],[3985,184],[4173,189],[4366,173],[4543,198],[4745,191],[4940,191],[5135,179],[5318,187],[5509,195],[5708,233],[5945,190],[6139,189],[6332,195],[6531,183],[6718,185],[6907,186],[7097,190],[7291,174],[7469,193],[7666,239],[7909,201],[8114,191],[8309,191],[8504,177],[8685,194],[8883,229],[9116,187],[9307,188],[9499,178],[9681,197],[9882,195]];
  var ATLAS_W = 10081, ATLAS_H = 280;
  function crowdRow(row, count, first, dur) {
    var out = "";
    for (var i = 0; i < count; i++) {
      var p = PEEPS[(first + i * 2) % PEEPS.length];
      var r = function (n) { return (n / ATLAS_H).toFixed(4); };
      // Spread walkers evenly along the loop, with a little jitter so gaps vary.
      var delay = -(i / count) * dur - ((i * 37) % 10) / 10;
      out += '<span class="peep-lane peep-lane--' + row + '" style="--d:' + delay.toFixed(2) + "s;--x:" + ((i / count) * 100).toFixed(1) + '%">' +
        '<span class="peep" style="--w:' + r(p[1]) + ";--ox:" + r(p[0]) + ";--b:" + (((i * 53) % 7) / 10 + 0.55).toFixed(2) + 's"></span></span>';
    }
    return out;
  }

  var ARROW_UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  var ARROW_OUT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  var footer =
    '<footer class="site-footer" id="contact">' +
    '<div class="site-footer__inner container">' +
    '<div class="site-footer__cols">' +
    '<div class="site-footer__brand">' +
    '<p class="site-footer__logo">Arpan Sheth.</p>' +
    '<p class="site-footer__role">UX/UI Designer &amp;<br />front-end developer.</p>' +
    '<p class="site-footer__small">Based in Ahmedabad, India. Open to Product Designer and Senior UX/UI Designer roles, and open to relocating. 90-day notice period.</p>' +
    "</div>" +
    '<nav class="site-footer__explore" aria-label="Footer">' +
    '<p class="site-footer__label">Explore</p><ul>' +
    menuLinks.map(function (l) { return '<li><a href="' + l.href + '">' + l.label + "</a></li>"; }).join("") +
    '<li><a href="' + RESUME + '" download="Arpan-Sheth-Resume.pdf">Resume</a></li>' +
    "</ul></nav>" +
    '<div class="site-footer__contact">' +
    '<p class="site-footer__label">Get in touch</p>' +
    '<div class="email-field">' +
    '<button type="button" class="email-field__value" data-copy="' + EMAIL + '" data-cursor="Copy" data-cursor-success="Copied!" data-cursor-theme="accent" aria-label="Copy email address ' + EMAIL + '">' + EMAIL + "</button>" +
    '<a class="pill pill--grey mono email-field__copy" href="mailto:' + EMAIL + '">Email</a>' +
    "</div>" +
    '<div class="site-footer__social">' +
    '<a href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn ' + ARROW_OUT + "</a>" +
    '<a href="' + GITHUB + '" target="_blank" rel="noopener">GitHub ' + ARROW_OUT + "</a>" +
    "</div>" +
    '<p class="site-footer__copy">© 2020–2026 Arpan Sheth</p>' +
    "</div></div>" +
    '<div class="site-footer__sign">' +
    '<h2 class="site-footer__title">Let’s design what’s next.</h2>' +
    '<a class="site-footer__totop" href="#top">Back to top ' + ARROW_UP + "</a>" +
    "</div></div>" +
    '<div class="site-footer__stage" aria-hidden="true">' +
    '<div class="site-footer__giant">ARPAN SHETH</div>' +
    '<div class="crowd crowd--back">' + crowdRow("back", 16, 0, 46) + "</div>" +
    '<div class="crowd__me"><img src="arpan-ink.webp" alt="" loading="lazy" /><span class="crowd__tag">That’s me</span></div>' +
    '<div class="crowd crowd--front">' + crowdRow("front", 10, 1, 38) + "</div>" +
    "</div>" +
    '<p class="site-footer__strip container">You scrolled all the way down, so everyone came out to say hi.</p>' +
    "</footer>";

  var cursor =
    '<div class="cursor" aria-hidden="true"><div class="cursor__content"><span class="cursor__icon"></span><span class="cursor__text"></span></div></div>';

  // The footer goes after the page wrapper; called by site.js (which runs at the
  // end of <body>), with a DOMContentLoaded fallback.
  var footerDone = false;
  function renderFooter() {
    if (footerDone) return;
    var page = document.querySelector(".page");
    if (!page) return;
    footerDone = true;
    page.insertAdjacentHTML("afterend", footer + cursor);
  }

  window.SiteChrome = { renderFooter: renderFooter };
  document.addEventListener("DOMContentLoaded", renderFooter);
})();
