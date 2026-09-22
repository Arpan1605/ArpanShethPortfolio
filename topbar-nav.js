const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
  window.addEventListener(
    "scroll",
    () => {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 480);
    },
    { passive: true }
  );

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const floatingNav = document.querySelector(".floating-nav");
const navDarkSections = document.querySelectorAll("[data-nav-dark]");

if (floatingNav && navDarkSections.length) {
  const checkNavContrast = () => {
    const navRect = floatingNav.getBoundingClientRect();
    const navMidY = navRect.top + navRect.height / 2;
    let onDark = false;
    navDarkSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (navMidY >= rect.top && navMidY <= rect.bottom) {
        onDark = true;
      }
    });
    floatingNav.classList.toggle("is-on-dark", onDark);
  };

  window.addEventListener("scroll", checkNavContrast, { passive: true });
  window.addEventListener("resize", checkNavContrast);
  checkNavContrast();
}
