/* /assets/js/ui-scale.js
   Freeze + escala proporcional (sin zoom)
   - Respeta retina-80 (NO duplica ni rompe --retinaScale)
   - Sólo controla: --uiBaseW, --uiScale, --uiScaleInv, --uiVh
   - ON: viewportWidth > 960
   - OFF: viewportWidth <= 960 (limpia todo)
*/
(function () {
  const CFG = {
    breakpointOff: 960,
    baseWNonRetina: 1730,
    baseWRetina: 1400,
    requireFinePointer: true,
    htmlOnClass: "ui-scale-on",
    /* Set ONLY while the layout is actually being scaled down (scale < 1), i.e.
       at the in-between widths. At the target resolutions scale is exactly 1, so
       anything hanging off this class is absent there rather than applied as a
       no-op. */
    htmlFitClass: "ui-scale-fit",
    eps: 0.0005,
  };

  const html = document.documentElement;
  // Migrated to Lenis (native document scroll) — was "#scroll-container",
  // smooth-scrollbar's own scrolling div. document.documentElement is now
  // the thing that actually scrolls.
  const root = html;

  const mqRetina = window.matchMedia(
    "(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)"
  );
  const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

  let lastScale = 1;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function isRetinaDesktop() {
    if (!mqRetina.matches) return false;
    if (CFG.requireFinePointer && !mqFine.matches) return false;
    return true;
  }

  function getViewportW() {
    return html.clientWidth || window.innerWidth || 0;
  }

  function setVar(name, value) {
    html.style.setProperty(name, value);
  }

  function clearVars() {
    html.style.removeProperty("--uiBaseW");
    html.style.removeProperty("--uiScale");
    html.style.removeProperty("--uiScaleInv");
    html.style.removeProperty("--uiVh");
  }

  function disable() {
    html.classList.remove(CFG.htmlOnClass);
    html.classList.remove(CFG.htmlFitClass);
    delete html.dataset.uiScale;
    delete html.dataset.uiBasew;
    clearVars();
    lastScale = 1;
  }

  function enable(baseW, scale) {
    const inv = 1 / scale;
    const vhPx = window.innerHeight || 0;

    if (!html.classList.contains(CFG.htmlOnClass)) {
      html.classList.add(CFG.htmlOnClass);
    }

    html.classList.toggle(CFG.htmlFitClass, scale < 1 - CFG.eps);

    setVar("--uiBaseW", String(baseW));
    setVar("--uiScale", scale.toFixed(6));
    setVar("--uiScaleInv", inv.toFixed(6));
    setVar("--uiVh", vhPx ? `${vhPx}px` : "100vh");

    html.dataset.uiScale = scale.toFixed(4);
    html.dataset.uiBasew = String(baseW);

    if (Math.abs(scale - lastScale) > CFG.eps) {
      const visualY = root.scrollTop * lastScale;
      const newTop = visualY / scale;
      const maxTop = Math.max(0, root.scrollHeight - root.clientHeight);
      root.scrollTop = clamp(newTop, 0, maxTop);
    }

    lastScale = scale;
  }

  function computeAndApply() {
    const vw = getViewportW();

    if (vw <= CFG.breakpointOff) {
      disable();
      return;
    }

    const retina = isRetinaDesktop();
    const baseW = retina ? CFG.baseWRetina : CFG.baseWNonRetina;

    const scale = clamp(vw / baseW, 0, 1);

    enable(baseW, scale);
  }

  /* Scheduling only — this decides WHEN computeAndApply runs, never what it
     computes. The old version parked the pending frame id in `raf` and returned
     early on every later call; `raf` was cleared only from inside the callback,
     so a frame that never arrived left it latched forever and every later
     resize / matchMedia / ResizeObserver / pageshow event was dropped silently.
     That is how the page got stuck at an old --uiScale and never recovered when
     the window was widened again. rAF still does the coalescing; the timeout is
     purely a backstop for the frame that never comes. */
  let raf = 0;
  let safety = 0;

  function apply() {
    if (raf) cancelAnimationFrame(raf);
    if (safety) clearTimeout(safety);

    raf = 0;
    safety = 0;

    computeAndApply();
  }

  function requestUpdate() {
    if (!raf) {
      raf = requestAnimationFrame(apply);
    }

    clearTimeout(safety);
    safety = setTimeout(apply, 250);
  }

  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("orientationchange", requestUpdate, { passive: true });
  window.addEventListener("pageshow", requestUpdate, { passive: true });
  window.addEventListener("load", requestUpdate, { passive: true });
  /* Resizing while the tab is hidden is one way to get a resize event with no
     frame behind it; re-check on the way back in. */
  document.addEventListener("visibilitychange", requestUpdate);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(requestUpdate).catch(() => {});
  }

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => requestUpdate());
    ro.observe(root);
  }

  try {
    mqRetina.addEventListener("change", requestUpdate);
    mqFine.addEventListener("change", requestUpdate);
  } catch {
    mqRetina.addListener(requestUpdate);
    mqFine.addListener(requestUpdate);
  }

  requestUpdate();
})();
