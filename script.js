const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const alphabetBoard = document.getElementById("alphabetBoard");
const activeLetter = document.getElementById("activeLetter");
const activeMessage = document.getElementById("activeMessage");
const sectionLinks = document.querySelectorAll("[data-panel-target]");
const panels = document.querySelectorAll(".panel");
const revealItems = document.querySelectorAll(".reveal");
const profileModal = document.getElementById("profileModal");
const openProfileModal = document.getElementById("openProfileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
const geAccessModal = document.getElementById("geAccessModal");
const closeGeAccessModal = document.getElementById("closeGeAccessModal");
const geAccessForm = document.getElementById("geAccessForm");
const geAccessPassword = document.getElementById("geAccessPassword");
const geAccessError = document.getElementById("geAccessError");
const geProtectedLinks = document.querySelectorAll("[data-ge-protected]");
const gePassword = "Itsab@1605";
const geAccessKey = "arpan-ge-case-access";
let geAccessDestination = "ge-healthcare.html";

const alphabetMessages = {
  A: "Analyzes every app I use, out of habit",
  B: "Builds better flows before better visuals",
  C: "Collects screenshots like design evidence",
  D: "Details matter more than decoration",
  E: "Empathy is my strongest design tool",
  F: "Finds friction before users complain",
  G: "Grounds every layout in a clear grid",
  H: "Flags hidden actions and messy hierarchy",
  I: "Interfaces should feel obvious, not impressive only",
  J: "Jumps between research notes and pixel polish",
  K: "Keeps asking why this screen exists",
  L: "Loves making long journeys feel lighter",
  M: "Maps messy requirements into meaningful flows",
  N: "Notices small usability breaks instantly",
  O: "Prioritizes onboarding and first impressions",
  P: "Pushes every product toward practical elegance",
  Q: "Questions defaults until the UX earns them",
  R: "Reworks rough edges until the path feels right",
  S: "Simplifies systems without flattening the thinking",
  T: "Turns tasks into clearer, calmer experiences",
  U: "UX first, visuals right after",
  V: "Visual hierarchy is never accidental",
  W: "Wants every workflow to feel worth it",
  X: "X-rays interfaces for hidden confusion",
  Y: "Yields cleaner spacing, one fix at a time",
  Z: "Zeroes in on avoidable friction fast"
};

const storedTheme = localStorage.getItem("arpan-wall-theme");
if (storedTheme === "dark") {
  body.dataset.theme = "dark";
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  if (nextTheme === "dark") {
    body.dataset.theme = "dark";
  } else {
    delete body.dataset.theme;
  }
  localStorage.setItem("arpan-wall-theme", nextTheme);
});

function setActiveLetter(letter) {
  activeLetter.textContent = letter;
  activeMessage.textContent = alphabetMessages[letter];

  document.querySelectorAll(".alpha-key").forEach((key) => {
    key.classList.toggle("is-active", key.dataset.letter === letter);
  });
}

Object.keys(alphabetMessages).forEach((letter) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "alpha-key";
  button.dataset.letter = letter;
  button.textContent = letter;
  button.setAttribute("aria-label", `${letter} for ${alphabetMessages[letter]}`);

  button.addEventListener("mouseenter", () => setActiveLetter(letter));
  button.addEventListener("focus", () => setActiveLetter(letter));
  button.addEventListener("click", () => setActiveLetter(letter));

  alphabetBoard.appendChild(button);
});

setActiveLetter("A");

const identityTypeText = document.getElementById("identityTypeText");
const identityPhrases = [
  "UX Designer — Enterprise Product Design",
  "5+ Years Across Healthcare, Travel & EdTech",
  "Currently Designing for GE Healthcare via TCS",
  "Open to Relocating to Germany"
];

if (identityTypeText) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    identityTypeText.textContent = identityPhrases[0];
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentPhrase = identityPhrases[phraseIndex];
      let delay = isDeleting ? 45 : 85;

      if (!isDeleting) {
        charIndex++;
        identityTypeText.textContent = currentPhrase.slice(0, charIndex);
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          delay = 1400;
        }
      } else {
        charIndex--;
        identityTypeText.textContent = currentPhrase.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % identityPhrases.length;
          delay = 300;
        }
      }

      setTimeout(tick, delay);
    };

    tick();
  }
}

function setActivePanel(target) {
  panels.forEach((panel) => {
    panel.classList.toggle("panel--active", panel.dataset.panel === target);
  });

  sectionLinks.forEach((link) => {
    if (link.matches("button")) {
      link.classList.toggle("is-active", link.dataset.panelTarget === target);
    }
    if (link.classList.contains("profile-tab")) {
      link.classList.toggle("profile-tab--active", link.dataset.panelTarget === target);
    }
  });
}

function showProfileModal() {
  profileModal?.classList.add("is-open");
  profileModal?.setAttribute("aria-hidden", "false");
}

function hideProfileModal() {
  profileModal?.classList.remove("is-open");
  profileModal?.setAttribute("aria-hidden", "true");
}

function showGeAccessModal(destination) {
  geAccessDestination = destination || "ge-healthcare.html";
  geAccessModal?.classList.add("is-open");
  geAccessModal?.setAttribute("aria-hidden", "false");
  if (geAccessError) {
    geAccessError.hidden = true;
  }
  geAccessPassword?.focus();
}

function hideGeAccessModal() {
  geAccessModal?.classList.remove("is-open");
  geAccessModal?.setAttribute("aria-hidden", "true");
  geAccessForm?.reset();
  if (geAccessError) {
    geAccessError.hidden = true;
  }
}

sectionLinks.forEach((link) => {
  if (!link.matches("button")) {
    return;
  }

  link.addEventListener("click", () => {
    const target = link.dataset.panelTarget;
    if (!target) {
      return;
    }
    setActivePanel(target);
  });
});

openProfileModal?.addEventListener("click", showProfileModal);
closeProfileModal?.addEventListener("click", hideProfileModal);
profileModal?.addEventListener("click", (event) => {
  if (event.target === profileModal) {
    hideProfileModal();
  }
});

geProtectedLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (sessionStorage.getItem(geAccessKey) === "granted") {
      return;
    }

    event.preventDefault();
    showGeAccessModal(link.getAttribute("href"));
  });
});

closeGeAccessModal?.addEventListener("click", hideGeAccessModal);
geAccessModal?.addEventListener("click", (event) => {
  if (event.target === geAccessModal) {
    hideGeAccessModal();
  }
});

geAccessForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (geAccessPassword?.value === gePassword) {
    sessionStorage.setItem(geAccessKey, "granted");
    window.location.href = geAccessDestination;
    return;
  }

  if (geAccessError) {
    geAccessError.hidden = false;
  }
  geAccessPassword?.select();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const hamburgerToggle = document.getElementById("hamburgerToggle");
const topbarMenu = document.getElementById("topbarMenu");

function closeTopbarMenu() {
  topbarMenu?.classList.remove("is-open");
  hamburgerToggle?.classList.remove("is-active");
  hamburgerToggle?.setAttribute("aria-expanded", "false");
}

hamburgerToggle?.addEventListener("click", () => {
  const isOpen = topbarMenu?.classList.toggle("is-open");
  hamburgerToggle.classList.toggle("is-active", isOpen);
  hamburgerToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

topbarMenu?.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", closeTopbarMenu);
});

const profileRailToggle = document.getElementById("profileRailToggle");
const profileRailDetails = document.getElementById("profileRailDetails");
const profileRailToggleText = profileRailToggle?.querySelector(".profile-rail__toggle-text");

function setProfileDetailsExpanded(isExpanded) {
  profileRailDetails?.classList.toggle("is-collapsed", !isExpanded);
  profileRailToggle?.setAttribute("aria-expanded", String(isExpanded));
  if (profileRailToggleText) {
    profileRailToggleText.textContent = isExpanded ? "Hide details" : "Show details";
  }
}

function toggleProfileDetails() {
  const isExpanded = profileRailToggle?.getAttribute("aria-expanded") === "true";
  setProfileDetailsExpanded(!isExpanded);
}

profileRailToggle?.addEventListener("click", toggleProfileDetails);

const sidebarToggle = document.getElementById("sidebarToggle");
const layoutEl = document.querySelector(".layout");

sidebarToggle?.addEventListener("click", () => {
  const isCollapsed = layoutEl?.classList.toggle("sidebar-collapsed");
  sidebarToggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  sidebarToggle.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
});
