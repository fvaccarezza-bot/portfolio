(() => {
  const preloader = document.getElementById("preloader");
  const underlay = document.getElementById("preloader-under");
  if (!preloader) return;
  document.documentElement.classList.add("no-scroll");
  const percentEl = preloader.querySelector("[data-percent]");
  let displayed = 0;
  let target = 0;
  let finished = false;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const setTarget = (v) => (target = clamp(v, target, 100));
  // Hard ceiling: the loader is never allowed to hold the page longer than this,
  // no matter what is still in flight.
  const MAX_WAIT_MS = 2800;
  // Only the images that actually paint in the first viewport gate the reveal.
  // Everything else (below-the-fold, desktop-only, the lazy grid) is irrelevant here.
  const CRITICAL_SELECTOR =
    window.innerWidth <= 768
      ? ".mobile-hero img"
      : "#hero-bg-img, #page-header .name-letter";
  const bumpByState = () => {
    switch (document.readyState) {
      case "loading":     setTarget(10); break;
      case "interactive": setTarget(45); break;
      case "complete":    setTarget(90); break;
    }
  };
  document.addEventListener("readystatechange", bumpByState);
  document.addEventListener("DOMContentLoaded", () => setTarget(65));
  // window.load waits on every eager image on the page; keep it only as a
  // late safety net — MAX_WAIT_MS and the critical set normally win the race.
  window.addEventListener("load", () => setTarget(100));
  const trackImages = () => {
    const imgs = Array.from(document.images || []);
    const pending = imgs.filter((img) => !img.complete);
    if (pending.length === 0) { setTarget(Math.max(target, 80)); return; }
    const total = pending.length;
    let loaded = 0;
    const onAsset = () => {
      loaded++;
      const p = 20 + Math.round((loaded / total) * 70);
      setTarget(p);
      if (loaded >= total) setTarget(90);
    };
    pending.forEach((img) => {
      img.addEventListener("load", onAsset, { once: true });
      img.addEventListener("error", onAsset, { once: true });
    });
  };
  // Reveal as soon as the DOM is usable and the first-viewport images are decoded.
  const waitForCritical = () => {
    const imgs = Array.from(
      document.querySelectorAll(CRITICAL_SELECTOR)
    ).filter((img) => img.getAttribute("src"));
    let remaining = imgs.filter((img) => !img.complete).length;
    if (remaining === 0) { setTarget(100); return; }
    const onCritical = () => { if (--remaining <= 0) setTarget(100); };
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", onCritical, { once: true });
      img.addEventListener("error", onCritical, { once: true });
    });
  };
  const startCriticalWatch = () => {
    setTarget(65);
    waitForCritical();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startCriticalWatch, { once: true });
  } else {
    startCriticalWatch();
  }
  setTimeout(() => setTarget(100), MAX_WAIT_MS);
  const render = () => {
    displayed += (target - displayed) * 0.12;
    if (Math.abs(target - displayed) < 0.15) displayed = target;
    const p = Math.round(displayed);
    if (percentEl) percentEl.textContent = `(${p}%)`;
    if (!finished && target === 100 && p === 100) finish();
    if (!finished) requestAnimationFrame(render);
  };
  // Broadcast the moment the loader is actually gone. Consumers used to sniff this
  // with a MutationObserver looking for opacity/display/visibility on #preloader,
  // which could never fire: the exit is a transform animation followed by remove(),
  // and neither shows up as one of those computed values.
  const signalDone = () => {
    if (window.__preloaderDone) return;
    window.__preloaderDone = true;
    document.dispatchEvent(new CustomEvent("preloader:done"));
  };
  const cleanup = () => {
    preloader?.remove();
    underlay?.remove();
    document.documentElement.classList.remove("no-scroll");
    signalDone();
  };
  const finish = () => {
    finished = true;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cleanup();
      return;
    }
    preloader.classList.add("is-done");
    if (underlay) underlay.classList.add("is-done");
    if (underlay) {
      underlay.addEventListener("animationend", (e) => {
        if (e.animationName !== "underlay-out") return;
        cleanup();
      }, { once: true });
    } else {
      preloader.addEventListener("animationend", (e) => {
        if (e.animationName !== "preloader-out") return;
        cleanup();
      }, { once: true });
    }
    // underlay-out is 800ms on a 220ms delay, preloader-out is 900ms. If either
    // animationend never arrives, still tear down (cleanup is idempotent) so the
    // page is never left under the loader and preloader:done always fires.
    setTimeout(cleanup, 1400);
  };
  bumpByState();
  trackImages();
  requestAnimationFrame(render);
  window.__setLoaderProgress = (v) => setTarget(clamp(v, 0, 100));
})();
