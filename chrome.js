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

  var footer =
    '<footer class="site-footer" id="contact">' +
    '<div class="site-footer__inner container">' +
    '<div class="site-footer__top">' +
    '<div class="site-footer__cta">' +
    '<h2 class="site-footer__title">Let’s design<br />what’s next</h2>' +
    '<a class="btn btn--accent roll" href="mailto:' + EMAIL + '" data-cursor="Write to me" data-cursor-theme="light">' + roll("Let's talk") + '<i class="tri" aria-hidden="true"></i></a>' +
    "</div>" +
    '<div class="site-footer__contact">' +
    '<p class="mono label">Get in touch</p>' +
    '<div class="email-field">' +
    '<button type="button" class="email-field__value" data-copy="' + EMAIL + '" data-cursor="Copy" data-cursor-success="Copied!" data-cursor-theme="accent" aria-label="Copy email address ' + EMAIL + '">' + EMAIL + "</button>" +
    '<a class="pill pill--grey mono email-field__copy" href="mailto:' + EMAIL + '">Email</a>' +
    "</div>" +
    '<p class="site-footer__small">Based in Ahmedabad, India. Open to Product Designer and Senior UX/UI Designer roles, and open to relocating. 90-day notice period.</p>' +
    '<div class="site-footer__social">' +
    '<a class="pill pill--dark mono" href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a>' +
    '<a class="pill pill--dark mono" href="' + GITHUB + '" target="_blank" rel="noopener">GitHub</a>' +
    '<a class="pill pill--dark mono" href="' + RESUME + '" download="Arpan-Sheth-Resume.pdf">Resume</a>' +
    "</div></div></div>" +
    '<div class="site-footer__bottom"><div class="site-footer__legal mono">' +
    '<a href="ai-workflow.html">AI Workflow</a>' +
    '<a href="' + RESUME + '" download="Arpan-Sheth-Resume.pdf">Resume</a>' +
    "<span>©Arpan Sheth 2020—2026. All rights reserved.</span>" +
    "</div></div>" +
    '<div class="site-footer__giant" aria-hidden="true">ARPAN SHETH</div>' +
    "</div></footer>";

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
