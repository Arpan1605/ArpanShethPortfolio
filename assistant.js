/* Arpan Sheth — "Ask" assistant.
   A small chat panel that answers questions about Arpan from the facts below.
   It runs entirely in the browser (the site is static), so every answer is
   written here by hand: edit TOPICS to change what it knows. Loaded by chrome.js
   on every page; styles live in chrome.css under "Assistant". */
(function () {
  "use strict";

  var EMAIL = "mrarpansheth@gmail.com";
  var STORE = "arpan-assistant-v1";
  var RESUME = "resume.pdf?v=20261125";

  function a(href, label, extra) {
    return '<a href="' + href + '"' + (extra || "") + ">" + label + "</a>";
  }
  var ext = ' target="_blank" rel="noopener noreferrer"';
  var mail = a("mailto:" + EMAIL, EMAIL);

  /* Each topic: words that point to it (phrases allowed), the reply, and
     follow-up suggestions. Higher `weight` wins ties for specific topics. */
  var TOPICS = [
    {
      id: "hello",
      keys: ["hi", "hello", "hey", "hola", "namaste", "yo", "good morning", "good evening"],
      reply: "Hi! I can tell you about Arpan’s projects, skills, experience and how to get in touch. What would you like to know?",
      next: ["What does Arpan do?", "Show me his projects"],
    },
    {
      id: "about",
      keys: ["who", "about", "yourself", "arpan", "introduce", "background", "summary", "what does he do", "what does arpan do", "what do you do"],
      reply:
        "Arpan is a UX/UI designer who also builds what he designs. He has 5+ years across enterprise, startup and independent work in healthcare, travel, hospitality and EdTech.<br><br>" +
        "His focus is turning tangled workflows into products people can follow without a manual. He covers research, design systems and Angular front-end, most recently for GE HealthCare platforms used by 2,000+ people in 20+ countries.",
      next: ["Show me his projects", "Is he open to new roles?"],
    },
    {
      id: "projects",
      keys: ["project", "projects", "work", "portfolio", "case study", "case studies", "examples", "best work", "show me"],
      reply:
        "Five case studies are on the site:<ul>" +
        "<li>" + a("ge-healthcare.html", "GE HealthCare") + ": lease, loan and end-of-term workflows in one platform, scaled from ~50 to 2,000+ users.</li>" +
        "<li>" + a("tastex.html", "tasteX") + ": QR room-service ordering, a kitchen dashboard and an admin panel for multi-hotel cloud kitchens.</li>" +
        "<li>" + a("pareexa-ai.html", "Pareexa.ai") + ": an AI-powered learning ecosystem for exam aspirants, 40+ screens on iOS, Android and web.</li>" +
        "<li>" + a("golfpac-travel.html", "GolfPac Travel") + ": three competing booking paths turned into one guided journey.</li>" +
        "<li>" + a("ai-workflow.html", "AI Workflow") + ": how he designs with Claude, Cursor, Figma Make and Codex.</li></ul>",
      next: ["Tell me about GE HealthCare", "How does he use AI?"],
    },
    {
      id: "ge",
      weight: 3,
      keys: ["ge", "ge healthcare", "healthcare", "health", "medical", "lease", "loan", "end of term", "enterprise", "quote", "quotes", "asset"],
      reply:
        "At GE HealthCare (via TCS, Oct 2022 to now) Arpan rebuilt lease, loan and end-of-term workflows into one centralized, role-based platform for quote generation and asset management.<br><br>" +
        "He ran research with a cross-functional team, wireframed the structure, refined it through usability testing and made it responsive. It grew from ~50 to 2,000+ users in 20+ countries, with 5,000+ quotes generated through his flows. " +
        a("ge-healthcare.html", "Read the case study →"),
      next: ["What about tasteX?", "Does he code too?"],
    },
    {
      id: "tastex",
      weight: 3,
      keys: ["tastex", "taste x", "hotel", "hotels", "restaurant", "kitchen", "qr", "room service", "food", "hospitality", "order", "ordering"],
      reply:
        "tasteX (Jan to May 2026) is three portals on one design system: a QR guest-ordering flow, a status-driven kitchen queue staff can glance at between orders, and a super-admin panel for multi-hotel cloud kitchens.<br><br>" +
        "Arpan architected the documented design system (a 12-token colour palette, a type scale, 4px-based spacing and a versioned component library) and directed an AI-orchestrated build with Figma Make, Codex and Claude Code. It went from concept to a deployed UAT build in under 5 months, against a typical ~1 year. " +
        a("tastex.html", "Read the case study →"),
      next: ["Tell me about Pareexa.ai", "How does he use AI?"],
    },
    {
      id: "pareexa",
      weight: 3,
      keys: ["pareexa", "edtech", "ed tech", "exam", "exams", "student", "students", "learning", "test prep", "study plan"],
      reply:
        "As Product Design Advisor to Pareexa.ai (Sep 2025 to Mar 2026), Arpan shaped product strategy and UX for an AI-powered learning ecosystem for exam aspirants. That covered onboarding, study planning, the study experience, mock tests and analytics, across 40+ screens on iOS, Android and web.<br><br>" +
        "A big theme was designing AI that students could trust, not just use. He also built the brand system and a scalable component library. " +
        a("pareexa-ai.html", "Read the case study →"),
      next: ["Tell me about GolfPac", "What are his skills?"],
    },
    {
      id: "golfpac",
      weight: 3,
      keys: ["golf", "golfpac", "golf pac", "teetimes", "tee times", "travel", "booking", "trip", "trips", "vacation"],
      reply:
        "For GolfPac Travel (Aug 2024 to Sep 2025) Arpan was Product Designer and Front-end Developer. The site had three competing booking paths. He turned them into one guided journey from destination to quote, backed by competitor analysis and heuristic reviews.<br><br>" +
        "He also restructured AngularJS controllers as part of a front-end modernisation and handled developer handoff. " +
        a("golfpac-travel.html", "Read the case study →"),
      next: ["Does he code too?", "Show me his projects"],
    },
    {
      id: "ai",
      weight: 2,
      keys: ["ai", "artificial intelligence", "claude", "cursor", "figma make", "codex", "copilot", "chatgpt", "llm", "workflow", "tools", "tool", "automation"],
      reply:
        "Arpan works AI into his process without skipping steps: Claude for research synthesis and making sense of messy inputs, then Figma Make, Lovable, Cursor, Codex and Copilot for exploring options, prototyping and building. On tasteX, that pipeline took a three-portal product to UAT in under 5 months.<br><br>" +
        "He’s a Claude Certified Architect (Foundations) and has won TCS’s AI Spark and AI Idea Igniter awards. " +
        a("ai-workflow.html", "See his AI workflow →"),
      next: ["What awards has he won?", "Show me his projects"],
    },
    {
      id: "skills",
      keys: ["skill", "skills", "capabilities", "strengths", "good at", "expertise", "specialise", "specialize", "research", "design system", "design systems", "ux", "ui", "wireframe", "usability", "information architecture"],
      reply:
        "What Arpan brings:<ul>" +
        "<li><b>Research</b>: stakeholder workshops, journey mapping, usability testing.</li>" +
        "<li><b>UX and flows</b>: information architecture and wireframes that turn approvals, quotes and booking into one guided path.</li>" +
        "<li><b>Design systems</b>: token architecture and component libraries precise enough for a coding agent to build the front-end from.</li>" +
        "<li><b>Front-end</b>: hands-on Angular, AngularJS and PrimeNG.</li>" +
        "<li><b>AI workflow</b>: Claude, Cursor, Figma Make, Lovable, Codex and Copilot.</li></ul>" +
        "Tools: Figma, Adobe XD, Photoshop, Miro, Confluence and Rally, plus Git/GitHub, REST APIs and Power BI on the technical side.",
      next: ["Does he code too?", "How does he use AI?"],
    },
    {
      id: "code",
      weight: 2,
      keys: ["code", "coding", "develop", "developer", "development", "frontend", "front end", "front-end", "angular", "angularjs", "primeng", "engineering", "engineer", "build", "html", "css", "javascript"],
      reply:
        "Yes. Arpan builds what he designs, mainly in Angular, AngularJS and PrimeNG. Before moving into UX full time he was a Front-end and UI Developer at TCS for GE Corporate, where he cut front-end load by around 20% through component-level optimisation.<br><br>" +
        "That background helps him close the gap between design intent and what actually ships.",
      next: ["What's his experience?", "What are his skills?"],
    },
    {
      id: "experience",
      keys: ["experience", "years", "career", "history", "jobs", "job history", "roles", "worked", "companies", "tcs", "inospire", "employer", "current", "currently"],
      reply:
        "Arpan’s path so far:<ul>" +
        "<li><b>Oct 2022 to now</b>: UX/UI Designer, TCS for GE HealthCare</li>" +
        "<li><b>Jan to May 2026</b>: Product and UX Design, tasteX</li>" +
        "<li><b>Sep 2025 to Mar 2026</b>: Product Design Advisor, Pareexa.ai</li>" +
        "<li><b>Aug 2024 to Sep 2025</b>: Product Designer and Front-end Developer, GolfPac Travel</li>" +
        "<li><b>Mar 2021 to Oct 2022</b>: Front-end and UI Developer, TCS for GE Corporate</li>" +
        "<li><b>Oct 2020 to Mar 2021</b>: Graphic Designer, Inospire Consultancy Services</li></ul>" +
        a(RESUME, "Download the full resume", ' download="Arpan-Sheth-Resume.pdf"'),
      next: ["Is he open to new roles?", "What awards has he won?"],
    },
    {
      id: "hire",
      weight: 2,
      keys: ["hire", "hiring", "available", "availability", "open to", "looking", "opportunity", "opportunities", "relocate", "relocation", "notice", "notice period", "remote", "visa", "join", "new role", "new roles", "freelance", "contract"],
      reply:
        "Yes. Arpan is open to Product Designer and Senior UX/UI roles worldwide and happy to relocate. He’s currently at GE HealthCare via TCS with a 90-day notice period (negotiable). For roles abroad he’d need relocation assistance or visa sponsorship, and he’s happy to discuss timelines.<br><br>" +
        "The best way to start a conversation is email: " + mail + ".",
      next: ["How can I contact him?", "Download his resume"],
    },
    {
      id: "contact",
      weight: 2,
      keys: ["contact", "email", "mail", "reach", "get in touch", "linkedin", "github", "message", "talk", "connect", "phone", "call"],
      reply:
        "You can reach Arpan at " + mail + ". He’s also on " +
        a("https://www.linkedin.com/in/arpan-sheth-939171171/", "LinkedIn", ext) + " and " +
        a("https://github.com/Arpan1605", "GitHub", ext) + ".",
      next: ["Download his resume", "Is he open to new roles?"],
    },
    {
      id: "resume",
      weight: 3,
      keys: ["resume", "cv", "résumé", "download"],
      reply: "Here’s Arpan’s resume: " + a(RESUME, "download the PDF", ' download="Arpan-Sheth-Resume.pdf"') + ".",
      next: ["How can I contact him?", "What's his experience?"],
    },
    {
      id: "awards",
      weight: 2,
      keys: ["award", "awards", "recognition", "certified", "certification", "certificate", "achievement", "achievements", "credly"],
      reply:
        "Recognition so far:<ul>" +
        "<li>" + a("https://www.credly.com/badges/2d6c74ce-0737-4afe-bb29-fb560450950a", "Claude Certified Architect, Foundations", ext) + " (Anthropic)</li>" +
        "<li>TCS AI Spark Award</li><li>TCS AI Idea Igniter Award</li><li>Best Team Award (TCS)</li><li>On the Spot Award (TCS)</li>" +
        "<li>Xcelerate Warrior, Conqueror and Victor delivery awards (TCS)</li>" +
        "<li>Lean Six Sigma Green Belt</li></ul>",
      next: ["How does he use AI?", "Show me his projects"],
    },
    {
      id: "education",
      weight: 2,
      keys: ["education", "degree", "college", "university", "study", "studied", "qualification", "qualifications", "engineering degree", "gtu", "cgpa", "six sigma", "lean", "green belt"],
      reply:
        "Arpan has a Bachelor of Engineering in Information Technology from GTU (2015 to 2019, CGPA 9.07/10). He’s also a Claude Certified Architect (Foundations) and holds a Lean Six Sigma Green Belt.",
      next: ["What's his experience?", "What languages does he speak?"],
    },
    {
      id: "languages",
      weight: 2,
      keys: ["language", "languages", "speak", "speaks", "english", "german", "hindi", "gujarati"],
      reply: "Arpan speaks English fluently, Hindi and Gujarati natively, and is learning German (A1).",
      next: ["Is he open to new roles?", "Where is he based?"],
    },
    {
      id: "location",
      weight: 2,
      keys: ["where", "based", "location", "live", "lives", "city", "country", "ahmedabad", "india", "timezone", "time zone"],
      reply: "Arpan is based in Ahmedabad, India, and is open to relocating for the right role.",
      next: ["Is he open to new roles?", "How can I contact him?"],
    },
    {
      id: "process",
      keys: ["process", "approach", "philosophy", "how do you work", "how does he work", "method", "principles", "values"],
      reply:
        "Arpan simplifies complexity rather than decorating it. He starts with evidence (stakeholder workshops, journey maps, usability tests), locks structure with quick wireframes, then refines through testing.<br><br>" +
        "He cares about cognitive load more than decoration: the parts no one notices are usually the parts everyone feels. And because he builds in Angular, he follows the design all the way to what ships.",
      next: ["How does he use AI?", "Tell me about GE HealthCare"],
    },
    {
      id: "paws",
      weight: 2,
      keys: ["paw", "paws", "tail", "tails", "cat", "cats", "dog", "pet", "pets", "meadow", "cherry", "blossom", "pixel", "jeeru", "jiru", "masala", "godfather", "godcats", "animals"],
      reply:
        "“Created with paws and tails” is a nod to Jeeru and Masala, Arpan’s two godcats. They belong to a friend, and Arpan is their proud godfather. Jeeru is the ginger one, Masala the tortoiseshell. " +
        "Both live in the pixel meadow at the bottom of every page: Jeeru follows your cursor, Masala ignores it entirely, and clicking the grass plants a flower. " +
        '<a href="index.html#godcats">Meet them</a>.',
      next: ["What does Arpan do?", "Show me his projects"],
    },
    {
      id: "thanks",
      keys: ["thanks", "thank you", "thx", "cool", "great", "awesome", "nice", "bye", "goodbye"],
      reply: "Glad to help! If you’d like to talk to Arpan directly, he’s at " + mail + ".",
      next: ["Show me his projects", "Download his resume"],
    },
  ];

  var FALLBACK = {
    reply:
      "I’m not sure about that one. I only know what’s on this site: Arpan’s projects, skills, experience, awards and availability. " +
      "For anything else, Arpan is happy to answer at " + mail + ".",
    next: ["What does Arpan do?", "Show me his projects", "Is he open to new roles?"],
  };

  var STARTERS = ["What does Arpan do?", "Show me his projects", "Is he open to new roles?", "How does he use AI?"];

  /* ---------- Matching ---------- */

  function normalise(s) {
    return " " + s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9é+#]+/g, " ").trim() + " ";
  }

  function answer(question) {
    var q = normalise(question);
    var best = null;
    var bestScore = 0;
    TOPICS.forEach(function (t) {
      var score = 0;
      t.keys.forEach(function (k) {
        var key = normalise(k);
        if (q.indexOf(key) !== -1) score += key.trim().split(" ").length * 2 + (key.length > 6 ? 1 : 0);
        else if (key.trim().length > 4 && q.indexOf(" " + key.trim().slice(0, -1)) !== -1) score += 1; // light plural/stem match
      });
      if (score) score += t.weight || 0;
      if (score > bestScore) {
        bestScore = score;
        best = t;
      }
    });
    return best || FALLBACK;
  }

  /* ---------- UI ---------- */

  var markSvg =
    '<svg viewBox="0 0 72 72" fill="none" aria-hidden="true"><g transform="skewX(-12) translate(14 0)">' +
    '<path d="M10 12 L50 12 L50 64 L10 64 L10 38 L50 38" /></g></svg>';

  var html =
    '<button class="ask-launch" type="button" aria-expanded="false" aria-controls="ask-panel">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5c4.7 0 8.5 3.3 8.5 7.4s-3.8 7.4-8.5 7.4c-.9 0-1.8-.1-2.6-.4L5 19.8l1.2-3.6C4.5 14.8 3.5 13 3.5 10.9c0-4.1 3.8-7.4 8.5-7.4z"/></svg>' +
    "<span>Ask</span></button>" +
    '<section class="ask-panel" id="ask-panel" role="dialog" aria-modal="false" aria-labelledby="ask-title" hidden>' +
    '<header class="ask-head">' +
    '<span class="ask-avatar">' + markSvg + "</span>" +
    '<div><h2 id="ask-title">Arpan’s assistant</h2><p>Projects, skills &amp; experience</p></div>' +
    '<button class="ask-close" type="button" aria-label="Close the assistant"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    "</header>" +
    '<div class="ask-body" role="log" aria-live="polite" aria-label="Conversation"></div>' +
    '<form class="ask-form" autocomplete="off">' +
    '<label class="sr-only" for="ask-input">Ask about Arpan</label>' +
    '<input id="ask-input" type="text" placeholder="Ask about Arpan…" maxlength="300" />' +
    '<button class="ask-send" type="submit" aria-label="Send" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg></button>' +
    "</form>" +
    '<p class="ask-note">Answers come from this portfolio. For anything else, email Arpan.</p>' +
    "</section>";

  var wrap = document.createElement("div");
  wrap.className = "ask";
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  var launch = wrap.querySelector(".ask-launch");
  var panel = wrap.querySelector(".ask-panel");
  var log = wrap.querySelector(".ask-body");
  var form = wrap.querySelector(".ask-form");
  var input = wrap.querySelector("#ask-input");
  var send = wrap.querySelector(".ask-send");
  var closeBtn = wrap.querySelector(".ask-close");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The conversation survives moving between pages within the tab.
  var history = [];
  try {
    history = JSON.parse(sessionStorage.getItem(STORE) || "[]");
  } catch (e) {}
  function save() {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(history.slice(-40)));
    } catch (e) {}
  }

  function chips(list) {
    var row = document.createElement("div");
    row.className = "ask-chips";
    list.forEach(function (text) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.addEventListener("click", function () {
        ask(text);
      });
      row.appendChild(b);
    });
    return row;
  }

  function renderEmpty() {
    log.innerHTML = "";
    var intro = document.createElement("div");
    intro.className = "ask-empty";
    intro.innerHTML = "<p class=\"ask-hello\">Get to know<br />Arpan’s work.</p>";
    intro.appendChild(chips(STARTERS));
    log.appendChild(intro);
  }

  function addMessage(role, content, next, animate) {
    var empty = log.querySelector(".ask-empty");
    if (empty) empty.remove();
    var old = log.querySelector(".ask-chips");
    if (old) old.remove();
    var m = document.createElement("div");
    m.className = "ask-msg ask-msg--" + role + (animate ? " is-new" : "");
    if (role === "user") m.textContent = content;
    else m.innerHTML = content;
    log.appendChild(m);
    if (next && next.length) log.appendChild(chips(next));
    log.scrollTop = log.scrollHeight;
  }

  function restore() {
    if (!history.length) return renderEmpty();
    log.innerHTML = "";
    history.forEach(function (h, i) {
      var t = h.role === "bot" ? topicById(h.id) : null;
      addMessage(h.role, h.role === "bot" ? t.reply : h.text, i === history.length - 1 && t ? t.next : null, false);
    });
  }

  function topicById(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return FALLBACK;
  }

  var busy = false;
  function ask(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    addMessage("user", text, null, true);
    history.push({ role: "user", text: text });
    input.value = "";
    send.disabled = true;

    var t = answer(text);
    var typing = document.createElement("div");
    typing.className = "ask-typing";
    typing.setAttribute("aria-label", "Typing");
    typing.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    setTimeout(function () {
      typing.remove();
      addMessage("bot", t.reply, t.next, true);
      history.push({ role: "bot", id: t.id || "fallback" });
      save();
      busy = false;
    }, reduced ? 150 : 550 + Math.min(t.reply.length, 900) / 3);
  }

  function open() {
    panel.hidden = false;
    launch.setAttribute("aria-expanded", "true");
    wrap.classList.add("is-open");
    restore();
    requestAnimationFrame(function () {
      panel.classList.add("is-shown");
      input.focus({ preventScroll: true });
    });
  }
  function close(returnFocus) {
    panel.classList.remove("is-shown");
    launch.setAttribute("aria-expanded", "false");
    wrap.classList.remove("is-open");
    setTimeout(function () {
      if (launch.getAttribute("aria-expanded") === "false") panel.hidden = true;
    }, reduced ? 0 : 220);
    if (returnFocus) launch.focus();
  }

  launch.addEventListener("click", function () {
    launch.getAttribute("aria-expanded") === "true" ? close(false) : open();
  });
  closeBtn.addEventListener("click", function () {
    close(true);
  });
  input.addEventListener("input", function () {
    send.disabled = !input.value.trim();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ask(input.value);
  });
  wrap.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) close(true);
  });
  // Links to a section on this page close the panel so the section is visible.
  log.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[href^='#']");
    if (link) close(false);
  });

  window.ArpanAssistant = { answer: answer, open: open };
})();
