(function () {
  const stage = document.getElementById("stage");
  const hitLeft = stage.querySelector(".hit.left");
  const hitRight = stage.querySelector(".hit.right");

  // Parámetros visuales
  const CARD_W = 540;
  const SIDE_OVERLAP = 53; // px de solape con la card activa (standard)
  const SIDE_SCALE = 0.82; // prev/next más chicos
  const SIDE_BLUR = 4; // blur alto constante
  const HOVER_SCALE = 0.88; // hover leve (siempre < 1)
  const HOVER_BLUR = SIDE_BLUR;
  const HOVER_LIFT_Y = -8; // parallax vertical
  const HIDDEN_MARGIN = 12; // cuánto fuera de escena queda el hidden

  const MOBILE_MQ = window.matchMedia("(max-width: 960px)");
  const UW_MQ = window.matchMedia("(min-width: 2560px)");
  let isMobile = MOBILE_MQ.matches;
  function uwSideScale() { return UW_MQ.matches ? 1 : SIDE_SCALE; }
  function uwHoverScale() { return UW_MQ.matches ? 1 : HOVER_SCALE; }

  MOBILE_MQ.addEventListener("change", (e) => {
    isMobile = e.matches;
    applyLayout();
    bindSideInteractions();
  });
  UW_MQ.addEventListener("change", () => {
    applyLayout();
    bindSideInteractions();
  });

  // Estado
  let items = [];
  let activeIndex = 0;
  let lastDirection = "next";

  function syncItems() {
    items = Array.from(stage.querySelectorAll(".verbatim"));
    const domActive = items.findIndex((el) => el.classList.contains("active"));
    if (domActive !== -1) activeIndex = domActive;
  }

  const mod = (n, m) => ((n % m) + m) % m;

  function rolesFor(aIdx) {
    const N = items.length;
    return {
      prev: mod(aIdx - 1, N),
      active: aIdx,
      next: mod(aIdx + 1, N),
    };
  }

  function clearRoles() {
    items.forEach((el) =>
      el.classList.remove("prev", "active", "next", "hidden", "hovering"),
    );
  }

  function setRoles(aIdx) {
    const { prev, active, next } = rolesFor(aIdx);
    clearRoles();
    items.forEach((el, i) => {
      if (i === active) el.classList.add("active");
      else if (i === prev) el.classList.add("prev");
      else if (i === next) el.classList.add("next");
      else el.classList.add("hidden");
    });
  }

  // Calcula y aplica layout (posiciones y capas); el hidden entra por detrás
  function applyLayout() {
    const N = items.length;
    if (!N) return;

    const stageW = stage.clientWidth;
    const halfStage = stageW / 2;

    // ancho real (responsive) de la card activa
    const activeEl =
      items.find((el) => el.classList.contains("active")) || items[activeIndex];
    const cardW = Math.min(
      activeEl?.getBoundingClientRect().width || CARD_W,
      stageW,
    );

    // helper: estacionar fuera de escena
    function parkOff(el, side) {
      const margin = 16;
      const x =
        side === "left"
          ? -(halfStage + cardW / 2 + margin)
          : +(halfStage + cardW / 2 + margin);

      el.style.transform = `translate(-50%, -50%) translate(${x}px, 0px) scale(1)`;
      el.style.filter = `blur(${SIDE_BLUR}px)`;
      el.style.boxShadow = "none";
      el.style.opacity = "0";
      el.style.zIndex = "0";
      el.style.pointerEvents = "none";
      el.style.cursor = "default";
    }

    // MOBILE: 1 solo visible
    if (isMobile) {
      // opcional: tap en bordes sin tapar la card (48px a cada lado)
      // hitLeft.style.width = "48px";
      // hitRight.style.width = "48px";
      hitLeft.style.width = "0px";
      hitRight.style.width = "0px";

      items.forEach((el) => {
        if (el.classList.contains("active")) {
          el.style.transform = `translate(-50%, -50%) translate(0px, 0px) scale(1)`;
          el.style.filter = "blur(0px)";
          el.style.boxShadow = "0 0 39.7px rgba(0,0,0,0.1)";
          el.style.opacity = "1";
          el.style.zIndex = "6";
          el.style.pointerEvents = "auto";
          el.style.cursor = "grab";
          el.removeAttribute("data-hidden-side");
        } else if (el.classList.contains("prev")) {
          parkOff(el, "left");
          el.setAttribute("data-hidden-side", "left");
        } else if (el.classList.contains("next")) {
          parkOff(el, "right");
          el.setAttribute("data-hidden-side", "right");
        } else {
          // hidden: mantenelo fuera del lado que corresponda (para que prepareIncoming siga funcionando)
          let side = el.getAttribute("data-hidden-side");
          if (!side) {
            const forward = (items.indexOf(el) - activeIndex + N) % N;
            const backward = (activeIndex - items.indexOf(el) + N) % N;
            side = forward <= backward ? "right" : "left";
          }
          parkOff(el, side);
          el.setAttribute("data-hidden-side", side);
        }
      });

      return; // importante
    }

    // DESKTOP: tu comportamiento actual (3 visibles)
    function placeSide(el, isLeft) {
      const hovering = el.classList.contains("hovering");
      const scale = hovering ? uwHoverScale() : uwSideScale();
      const ty = hovering ? HOVER_LIFT_Y : 0;

      const sideW = UW_MQ.matches ? CARD_W : cardW * scale;
      const shift = UW_MQ.matches
        ? Math.max(0, halfStage - sideW / 2)
        : cardW / 2 + sideW / 2 - SIDE_OVERLAP;
      const uwGap = UW_MQ.matches ? 30 : 0;
      const x = isLeft ? -(shift + uwGap) : +(shift + uwGap);

      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${ty}px) scale(${scale})`;
      el.style.filter = `blur(${HOVER_BLUR}px)`;
      el.style.boxShadow = "0 0 16px rgba(0,0,0,.06)";
      el.style.opacity = "0.95";
      el.style.zIndex = "1";
      el.style.cursor = "pointer";
      el.style.pointerEvents = "auto";

      if (isLeft) hitLeft.style.width = sideW + "px";
      else hitRight.style.width = sideW + "px";
    }

    items.forEach((el, i) => {
      if (el.classList.contains("active")) {
        const activeScale = UW_MQ.matches ? 1.2 : 1;
        const hovering = el.classList.contains("hovering");
        const liftY = hovering ? -6 : 0;
        el.style.transform = `translate(-50%, -50%) translate(0px, ${liftY}px) scale(${activeScale})`;
        el.style.filter = "blur(0px)";
        el.style.boxShadow = hovering ? "0 30px 55px rgba(0,0,0,0.18)" : "0 0 39.7px rgba(0,0,0,0.1)";
        el.style.opacity = "1";
        el.style.zIndex = "6";
        el.style.cursor = "grab";
        el.style.pointerEvents = "auto";
        el.removeAttribute("data-hidden-side");
      } else if (el.classList.contains("prev")) {
        placeSide(el, true);
        el.removeAttribute("data-hidden-side");
      } else if (el.classList.contains("next")) {
        placeSide(el, false);
        el.removeAttribute("data-hidden-side");
      } else {
        let side = el.getAttribute("data-hidden-side");
        if (!side) {
          const forward = (i - activeIndex + N) % N;
          const backward = (activeIndex - i + N) % N;
          side = forward <= backward ? "right" : "left";
        }

        const scale = uwSideScale();
        const sideW = cardW * scale;
        const x =
          side === "left"
            ? -(halfStage + sideW / 2 + HIDDEN_MARGIN)
            : halfStage + sideW / 2 + HIDDEN_MARGIN;

        el.style.transform = `translate(-50%, -50%) translate(${x}px, 0px) scale(${scale})`;
        el.style.filter = `blur(${SIDE_BLUR + 1}px)`;
        el.style.boxShadow = "none";
        el.style.opacity = "0";
        el.style.zIndex = "0";
        el.style.pointerEvents = "none";
      }
    });
  }

  // Prepara posiciones antes de cambiar roles para evitar "barridos"
  function prepareIncoming(direction) {
    const N = items.length;
    if (N < 2) return;

    const { prev, next } = rolesFor(activeIndex);

    if (direction === "next") {
      const incoming = mod(activeIndex + 2, N); // será el nuevo "next"
      items[incoming]?.setAttribute("data-hidden-side", "right"); // entra desde derecha
      items[prev]?.setAttribute("data-hidden-side", "left"); // el prev saliente se oculta a la izquierda
    } else {
      const incoming = mod(activeIndex - 2, N); // será el nuevo "prev"
      items[incoming]?.setAttribute("data-hidden-side", "left"); // entra desde izquierda
      items[next]?.setAttribute("data-hidden-side", "right"); // el next saliente se oculta a la derecha
    }

    lastDirection = direction;

    // Fijar transforms iniciales de hidden/salientes antes de animar
    applyLayout();
    // Reflow para que el siguiente cambio de clases anime desde estas posiciones
    void stage.offsetWidth;
  }

  // Grab & swipe — drag the active card, release past the threshold to advance
  const DRAG_SOFT = 110; // px antes de que empiece la resistencia
  const DRAG_LIMIT = 160; // tope donde la resistencia se pone muy dura
  const DRAG_HARD_LIMIT = 185; // tope final absoluto, con muchisima resistencia entre LIMIT y este
  const DRAG_THRESHOLD = 80; // px para soltar y cambiar de card
  const DRAG_MAX_ROTATE = 5; // grados — para que no sea un recorrido 100% recto
  const DRAG_SHADOW = "0 30px 55px rgba(0,0,0,0.18)"; // misma sombra que ya pone el hover, sin salto

  // El navegador dispara un "click" nativo después del mouseup/pointerup, incluso
  // tras un drag. Si el mouse quedó sobre un .hit o la prev/next, ese click dispara
  // goNext/goPrev otra vez y pisa lo que el drag ya resolvió. Lo comemos una sola vez.
  function suppressNextClick() {
    const killClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener("click", killClick, { capture: true, once: true });
  }

  function bindDrag(activeEl) {
    if (!activeEl) return;
    activeEl.style.cursor = "grab";

    let dragging = false;
    let dx = 0;
    let startX = 0;

    function rubberBand(raw) {
      const abs = Math.abs(raw);
      if (abs <= DRAG_SOFT) return raw;
      const overSoft = abs - DRAG_SOFT;
      const stage1Span = (DRAG_LIMIT - DRAG_SOFT) / 0.35;
      let capped;
      if (overSoft <= stage1Span) {
        capped = DRAG_SOFT + overSoft * 0.35;
      } else {
        const overHard = overSoft - stage1Span;
        capped = Math.min(DRAG_LIMIT + overHard * 0.08, DRAG_HARD_LIMIT);
      }
      return raw < 0 ? -capped : capped;
    }

    function renderDrag() {
      const baseScale = UW_MQ.matches ? 1.2 : 1;
      const rot = (dx / DRAG_LIMIT) * DRAG_MAX_ROTATE;
      // -6px fijo: es el mismo lift que ya puso el hover, así no hay salto al empezar a arrastrar
      activeEl.style.transform = `translate(-50%, -50%) translate(${dx}px, -6px) scale(${baseScale}) rotate(${rot}deg)`;
    }

    activeEl.onpointerdown = function (e) {
      if (e.button) return;
      e.preventDefault(); // evita que el navegador arranque un drag nativo si el click cae sobre la <img>
      dragging = true;
      dx = 0;
      startX = e.clientX;
      if (activeEl.setPointerCapture) activeEl.setPointerCapture(e.pointerId);
      activeEl.style.transition = "none";
      activeEl.style.cursor = "grabbing";
      activeEl.style.boxShadow = DRAG_SHADOW;
      renderDrag();
    };

    activeEl.onpointermove = function (e) {
      if (!dragging) return;
      dx = rubberBand(e.clientX - startX);
      renderDrag();
    };

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      activeEl.style.cursor = "grab";
      activeEl.style.transition = "";
      // el mouse puede soltarse arriba de un .hit (prev/next) — sin esto, el click
      // nativo que sigue al mouseup navega otra vez y pisa lo que acaba de hacer el drag
      if (Math.abs(dx) > 5) suppressNextClick();
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        dx < 0 ? goNext() : goPrev();
      } else {
        applyLayout();
      }
      dx = 0;
    }

    activeEl.onpointerup = endDrag;
    activeEl.onpointercancel = endDrag;
    activeEl.onpointerleave = function () {
      if (dragging) endDrag();
    };
  }

  function bindSideInteractions() {
    items.forEach((v) => {
      v.onclick = null;
      v.onmouseenter = null;
      v.onmouseleave = null;
      v.onpointerdown = null;
      v.onpointermove = null;
      v.onpointerup = null;
      v.onpointercancel = null;
      v.onpointerleave = null;
    });

    const prevEl = items.find((el) => el.classList.contains("prev"));
    const nextEl = items.find((el) => el.classList.contains("next"));
    const activeEl = items.find((el) => el.classList.contains("active"));

    if (prevEl) {
      prevEl.onclick = goPrev;
      prevEl.onmouseenter = () => {
        prevEl.classList.add("hovering");
        applyLayout();
      };
      prevEl.onmouseleave = () => {
        prevEl.classList.remove("hovering");
        applyLayout();
      };
    }
    if (nextEl) {
      nextEl.onclick = goNext;
      nextEl.onmouseenter = () => {
        nextEl.classList.add("hovering");
        applyLayout();
      };
      nextEl.onmouseleave = () => {
        nextEl.classList.remove("hovering");
        applyLayout();
      };
    }
    if (activeEl) {
      activeEl.onmouseenter = () => {
        activeEl.classList.add("hovering");
        applyLayout();
      };
      activeEl.onmouseleave = () => {
        activeEl.classList.remove("hovering");
        applyLayout();
      };
    }

    // Hotzones reflejan hover/click del lateral correspondiente
    hitLeft.onclick = goPrev;
    hitRight.onclick = goNext;
    hitLeft.onmouseenter = () => {
      prevEl?.classList.add("hovering");
      applyLayout();
    };
    hitLeft.onmouseleave = () => {
      prevEl?.classList.remove("hovering");
      applyLayout();
    };
    hitRight.onmouseenter = () => {
      nextEl?.classList.add("hovering");
      applyLayout();
    };
    hitRight.onmouseleave = () => {
      nextEl?.classList.remove("hovering");
      applyLayout();
    };

    bindDrag(activeEl);
  }

  function goNext() {
    syncItems();
    if (items.length < 2) return;

    // Prepara: hidden correcto a la derecha, prev saliente a la izquierda
    prepareIncoming("next");

    // Rotar índice activo y roles
    activeIndex = mod(activeIndex + 1, items.length);
    setRoles(activeIndex);

    applyLayout();
    bindSideInteractions();
  }

  function goPrev() {
    syncItems();
    if (items.length < 2) return;

    // Prepara: hidden correcto a la izquierda, next saliente a la derecha
    prepareIncoming("prev");

    activeIndex = mod(activeIndex - 1, items.length);
    setRoles(activeIndex);

    applyLayout();
    bindSideInteractions();
  }

  // Evita que el navegador arranque su drag-and-drop nativo sobre las fotos (pisaría el grab custom)
  function disableNativeImgDrag(root) {
    root.querySelectorAll("img").forEach((img) => {
      img.draggable = false;
    });
  }

  // Observa nuevos testimonios añadidos (N dinámico)
  const observer = new MutationObserver((mutations) => {
    let changed = false;
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.classList?.contains("verbatim")) {
          node.setAttribute("tabindex", "0");
          node.classList.remove("prev", "next", "active");
          node.classList.add("hidden");
          node.setAttribute("data-hidden-side", "right"); // por defecto, entra como "next"
          disableNativeImgDrag(node);
          changed = true;
        }
      });
    }
    if (changed) {
      syncItems();
      setRoles(activeIndex);
      applyLayout();
      bindSideInteractions();
    }
  });
  observer.observe(stage, { childList: true });

  // Init
  disableNativeImgDrag(stage);
  syncItems();
  setRoles(activeIndex); // normaliza el DOM inicial
  applyLayout();
  bindSideInteractions();
  window.addEventListener("resize", applyLayout, { passive: true });
})();
