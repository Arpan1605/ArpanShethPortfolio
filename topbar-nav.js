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
