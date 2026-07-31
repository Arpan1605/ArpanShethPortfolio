const tocLinks = document.querySelectorAll(".case-toc a");

if (tocLinks.length) {
  const linkByHash = new Map();
  tocLinks.forEach((link) => linkByHash.set(link.getAttribute("href").slice(1), link));

  const sections = Array.from(linkByHash.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = linkByHash.get(entry.target.id);
        if (!link) return;
        tocLinks.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}
