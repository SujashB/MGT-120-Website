/* =========================================================
   HOAs — My Problem or Your Problem? · Team 6 · MGT 120
   Scroll reveals · progress bar · floating nav · counters
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll progress + nav ---------- */
  const progress = document.getElementById("progress");
  const nav = document.getElementById("nav");

  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (nav) nav.classList.toggle("show", h.scrollTop > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- count-up helper ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal, .reveal-up");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
    document.querySelectorAll("[data-count]").forEach((el) => {
      el.textContent = parseFloat(el.dataset.count) + (el.dataset.suffix || "");
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        entry.target.querySelectorAll?.("[data-count]").forEach(animateCount);
        if (entry.target.matches("[data-count]")) animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach((el) => io.observe(el));

  // Observe standalone counters that aren't wrapped in a .reveal
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (!el.closest(".reveal, .reveal-up")) io.observe(el);
  });
})();
