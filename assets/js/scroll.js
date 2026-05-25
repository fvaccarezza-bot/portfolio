// SCROLL
const HEADER_HEIGHT = 0;
const scrollInside = document.getElementById("scroll-inside");
if (scrollInside) {
  scrollInside.addEventListener("click", function (e) {
    e.preventDefault();
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const linkTopAbs = window.scrollY + rect.top;
    const targetY = linkTopAbs + el.offsetHeight - HEADER_HEIGHT + 1;
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  });
}
