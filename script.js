const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const revealItems = document.querySelectorAll(".reveal");

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
