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
  A: "Auto critiques every app I see",
  B: "Builds better flows before better visuals",
  C: "Collects screenshots like design evidence",
  D: "Details matter more than decoration",
  E: "Empathy is my strongest design tool",
  F: "Finds friction before users complain",
  G: "Grid lover with a soft spot for clarity",
  H: "Hates hidden actions and messy hierarchy",
  I: "Interfaces should feel obvious, not impressive only",
  J: "Jumps between research notes and pixel polish",
  K: "Keeps asking why this screen exists",
  L: "Loves making long journeys feel lighter",
  M: "Maps messy requirements into meaningful flows",
  N: "Notices small usability breaks instantly",
  O: "Obsesses over onboarding and first impressions",
  P: "Pushes every product toward practical elegance",
  Q: "Questions defaults until the UX earns them",
  R: "Reworks rough edges until the path feels right",
  S: "Simplifies systems without flattening the thinking",
  T: "Turns tasks into clearer, calmer experiences",
  U: "UX first, visuals right after",
  V: "Visual hierarchy is never accidental",
  W: "Wants every workflow to feel worth it",
  X: "X-rays interfaces for hidden confusion",
  Y: "Yes, I will redesign that button spacing too",
  Z: "Zero patience for avoidable friction"
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
