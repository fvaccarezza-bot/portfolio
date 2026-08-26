if (window.innerWidth <= 768) {
    document.addEventListener('click', function(e) { var btn = e.target.closest('.tt-ol-menu-toggle-btn'); if (btn) e.preventDefault(); }, true);
    /* The mobile hero display toggles and revealMobileHero() moved into an inline
       bootstrap right after the hero markup, so they no longer wait for this
       script. .mobile-hero / .mobile-hero-text / .mob-about-block /
       .mobile-hero-portfolio-label / .mobile-testimonials already carry
       display: … !important in the @media (max-width:768px) block, so the
       assignments that used to live here were redundant no-ops. */
    var wordsContainer = document.querySelector('.words-container'); if (wordsContainer) wordsContainer.style.display = 'none';
    var aboutSvg = document.getElementById('mob-about-svg'), aboutTexts = document.querySelectorAll('.mob-about-text');
    if (aboutSvg) { new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('in-view'); } }); }, { threshold: 0.0 }).observe(aboutSvg); }
    aboutTexts.forEach(function(el) { new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('in-view'); } }); }, { threshold: 0.0 }).observe(el); });
    var cards = document.querySelectorAll('.gallery .card');
    var observer = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('in-view'); } }); }, { threshold: 0.15 });
    cards.forEach(function(card, i) { card.style.transitionDelay = (i * 0.06) + 's'; observer.observe(card); });
    var phraseClips = document.querySelectorAll('.mob-phrase-clip');
    if (phraseClips.length) { var phraseWordObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { var word = entry.target.querySelector('.mob-phrase-word'); if (word) word.classList.add('in-view'); phraseWordObserver.unobserve(entry.target); } }); }, { threshold: 0.0 }); phraseClips.forEach(function(clip) { phraseWordObserver.observe(clip); }); }
    var serviceItems = document.querySelectorAll('.services-grid-item');
    if (serviceItems.length) { var servicesObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { var idx = Array.from(serviceItems).indexOf(entry.target); setTimeout(function() { entry.target.classList.add('in-view'); }, idx * 80); servicesObserver.unobserve(entry.target); } }); }, { threshold: 0.1 }); serviceItems.forEach(function(item) { servicesObserver.observe(item); }); }
    var connectBtn = document.querySelector('.services-btns-connect');
    if (connectBtn) { new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('in-view'); } }); }, { threshold: 0.3 }).observe(connectBtn); }
    var someKindClips = document.querySelectorAll('.mob-somekind-phrase .mob-phrase-clip');
    if (someKindClips.length) { var someKindObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { var word = entry.target.querySelector('.mob-phrase-word'); if (word) word.classList.add('in-view'); someKindObserver.unobserve(entry.target); } }); }, { threshold: 0.0 }); someKindClips.forEach(function(clip) { someKindObserver.observe(clip); }); }
    var worksClips = document.querySelectorAll('.mob-works-phrase .mob-phrase-clip');
    if (worksClips.length) { var worksObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { var word = entry.target.querySelector('.mob-phrase-word'); if (word) word.classList.add('in-view'); worksObserver.unobserve(entry.target); } }); }, { threshold: 0.0 }); worksClips.forEach(function(clip) { worksObserver.observe(clip); }); }
    var mobPills = document.querySelectorAll('.mob-pill');
    if (mobPills.length) { var mobPillObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('in-view'); mobPillObserver.unobserve(entry.target); } }); }, { threshold: 0.3 }); mobPills.forEach(function(pill) { mobPillObserver.observe(pill); }); }
    var testiImgs = document.querySelectorAll('.mobile-testimonials img');
    if (testiImgs.length) { var testiObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { var idx = Array.from(testiImgs).indexOf(entry.target); setTimeout(function() { entry.target.classList.add('in-view'); }, idx * 100); testiObserver.unobserve(entry.target); } }); }, { threshold: 0.1 }); testiImgs.forEach(function(img) { testiObserver.observe(img); }); }
    var footerClips = document.querySelectorAll('.mob-footer-clip');
    if (footerClips.length) { var footerTriggered = false; var footerObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting && !footerTriggered) { footerTriggered = true; footerClips.forEach(function(clip, idx) { setTimeout(function() { var word = clip.querySelector('.mob-footer-word'); if (word) word.classList.add('in-view'); }, idx * 120); }); footerObserver.disconnect(); } }); }, { threshold: 0.05 }); footerClips.forEach(function(clip) { footerObserver.observe(clip); }); }
    var servicesTag = document.getElementById('mob-services-tag');
    if (servicesTag) { var servicesTagObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { servicesTag.classList.add('in-view'); servicesTagObserver.disconnect(); } }); }, { threshold: 0.3 }); servicesTagObserver.observe(servicesTag); window.addEventListener('scroll', function() { var rect = servicesTag.getBoundingClientRect(); servicesTag.style.transform = 'translateY(' + ((rect.top + rect.height / 2 - window.innerHeight / 2) * 0.06) + 'px)'; }, { passive: true }); }
    var shapeLeft = null /* hidden on mobile: no parallax */, shapeRight = null;
    if (shapeLeft || shapeRight) { window.addEventListener('scroll', function() { if (shapeLeft) { var rL = shapeLeft.getBoundingClientRect(); shapeLeft.style.transform = 'translateY(' + ((rL.top + rL.height / 2 - window.innerHeight / 2) * 0.12) + 'px)'; } if (shapeRight) { var rR = shapeRight.getBoundingClientRect(); shapeRight.style.transform = 'translateY(' + ((rR.top + rR.height / 2 - window.innerHeight / 2) * -0.12) + 'px)'; } }, { passive: true }); }
}
if (window.innerWidth > 768) {
    var desktopStyle = document.createElement('style');
    desktopStyle.textContent = ['.gallery .card { opacity:0; transform:translateY(40px); filter:blur(20px); transition:opacity 1.0s cubic-bezier(0.25,0.46,0.45,0.94), transform 1.0s cubic-bezier(0.25,0.46,0.45,0.94), filter 1.0s cubic-bezier(0.25,0.46,0.45,0.94); }', '.gallery .card.in-view { opacity:1; transform:translateY(0); filter:blur(0px); }'].join('');
    document.head.appendChild(desktopStyle);
    var desktopCards = Array.from(document.querySelectorAll('.gallery .card')), cardTriggered = new Set();
    var desktopCardObs = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (!entry.isIntersecting || cardTriggered.has(entry.target)) return; var targetTop = entry.target.offsetTop; var rowCards = desktopCards.filter(function(c) { return Math.abs(c.offsetTop - targetTop) < 10; }); rowCards.forEach(function(card, i) { if (cardTriggered.has(card)) return; cardTriggered.add(card); card.style.transitionDelay = (i * 0.1) + 's'; card.classList.add('in-view'); desktopCardObs.unobserve(card); }); }); }, { threshold: 0.08 });
    desktopCards.forEach(function(card) { desktopCardObs.observe(card); });


    function syncFaqPillOffset() {
        // Section 1: CSS Grid handles height matching automatically
        var qw1 = document.querySelector('#faq-section .faq-questions-wrap');
        if (qw1) { qw1.style.paddingTop = '0px'; qw1.style.paddingBottom = '0px'; qw1.style.height = ''; }
        // Section 2: pill is last child → offset process-wrap bottom
        var tw2 = document.querySelector('#faq-section-2 .faq-title-wrap');
        var qw2 = document.querySelector('#faq-section-2 .faq-questions-wrap');
        if (tw2 && qw2) {
            var pill2 = tw2.lastElementChild;
            if (pill2) qw2.style.paddingBottom = (pill2.getBoundingClientRect().height + 16) + 'px';
        }
    }
    window.addEventListener('load', syncFaqPillOffset);
    window.addEventListener('resize', syncFaqPillOffset);
    syncFaqPillOffset();

    // Sticker drag — stickers start at center, spread on scroll, move inside fixed bag
    (function() {
        var bolsitaWrap = document.querySelector('.stk-wrap[data-bolsita]');
        var regularWraps = Array.from(document.querySelectorAll('.stk-wrap:not([data-bolsita])'));
        var topZ = 10;

        // UW: scale animation target positions proportionally (bag 900→1500)
        if (window.innerWidth >= 2560) {
            regularWraps.forEach(function(w) {
                w.dataset.x = Math.round(parseFloat(w.dataset.x) * 1.67);
                w.dataset.y = Math.round(parseFloat(w.dataset.y) * 1.67);
            });
        }

        // All stickers start at center
        regularWraps.forEach(function(w) {
            w._baseX = 0;
            w._baseY = 0;
        });

        function setTransform(w, x, y) {
            w.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + parseFloat(w.dataset.rot) + 'deg)';
        }

        function bagBounds() {
            if (!bolsitaWrap) return { hw: 200, hh: 200, rot: 0 };
            var img = bolsitaWrap.querySelector('.stk');
            var hw = img ? img.offsetWidth / 2 : 450;
            var hh = img ? img.offsetHeight / 2 : 183;
            var rot = parseFloat(bolsitaWrap.dataset.rot || 0) * Math.PI / 180;
            return { hw: hw, hh: hh, rot: rot };
        }

        function clampInBag(px, py, maxLX, maxLY, rot) {
            var c = Math.cos(rot), s = Math.sin(rot);
            var lx = px * c + py * s;
            var ly = -px * s + py * c;
            lx = Math.max(-maxLX, Math.min(maxLX, lx));
            ly = Math.max(-maxLY, Math.min(maxLY, ly));
            return { x: lx * c - ly * s, y: lx * s + ly * c };
        }

        // ScrollTrigger: distribute stickers from center to their target positions
        var scene = document.querySelector('.stickers-scene');
        if (typeof ScrollTrigger !== 'undefined' && scene) {
            regularWraps.forEach(function(w, i) {
                var targetX = parseFloat(w.dataset.x);
                var targetY = parseFloat(w.dataset.y);
                var finalRot = parseFloat(w.dataset.rot) || 0;
                var rotDelta = Math.random() * 30 - 15;
                var obj = { x: 0, y: 0, rd: rotDelta };
                gsap.to(obj, {
                    scrollTrigger: {
                        trigger: scene,
                        start: 'top 80%',
                        once: true
                    },
                    x: targetX,
                    y: targetY,
                    rd: 0,
                    duration: 2.2,
                    delay: 0,
                    ease: 'expo.out',
                    onUpdate: function() {
                        w._baseX = obj.x;
                        w._baseY = obj.y;
                        w.style.transform = 'translate(' + obj.x + 'px,' + obj.y + 'px) rotate(' + (finalRot + obj.rd) + 'deg)';
                    },
                    onComplete: function() {
                        setTransform(w, obj.x, obj.y);
                    }
                });
            });

            // Parallax + rotation on the whole scene as you scroll past
            gsap.fromTo(scene,
                { y: 60, rotation: -3.5 },
                {
                    y: -60,
                    rotation: 3.5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: scene,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                }
            );
        }

        // Drag
        /* Consolidated from one document-level mousemove/mouseup pair PER sticker
           (14 of them) to one shared pair for all of them. Safe because a single
           mouse pointer can only have one sticker "down" at a time anyway — the
           original per-wrap `dragging` boolean was never true for more than one
           wrap simultaneously, so tracking "which wrap is currently being dragged"
           in one shared object is behaviorally identical, just fewer listeners.
           Per-wrap geometry (stkHalfW/H, drag-start deltas, velocity) that used to
           live in each wrap's own closure now lives on this shared `drag` object,
           populated fresh on every mousedown exactly as before. */
        var drag = { wrap: null, stkEl: null, stkHalfW: 0, stkHalfH: 0, startMX: 0, startMY: 0, origBX: 0, origBY: 0, vx: 0, vy: 0, lastMX: 0, lastMY: 0 };
        regularWraps.forEach(function(wrap) {
            var stkEl = wrap.querySelector('.stk');
            stkEl.addEventListener('mousedown', function(e) {
                drag.wrap = wrap; drag.stkEl = stkEl;
                drag.vx = 0; drag.vy = 0;
                drag.startMX = e.clientX; drag.startMY = e.clientY;
                drag.origBX = wrap._baseX; drag.origBY = wrap._baseY;
                drag.lastMX = e.clientX; drag.lastMY = e.clientY;
                var zf = parseFloat(getComputedStyle(stkEl).zoom) || 1;
                drag.stkHalfW = (stkEl.offsetWidth * zf) / 2;
                drag.stkHalfH = (stkEl.offsetHeight * zf) / 2;
                wrap.style.zIndex = ++topZ;
                if (bolsitaWrap) bolsitaWrap.style.zIndex = topZ + 1;
                stkEl.classList.add('is-grabbed');
                wrap.style.transition = 'none';
                e.preventDefault();
            });
        });
        document.addEventListener('mousemove', function(e) {
            if (!drag.wrap) return;
            drag.vx = e.clientX - drag.lastMX; drag.vy = e.clientY - drag.lastMY;
            drag.lastMX = e.clientX; drag.lastMY = e.clientY;
            var b = bagBounds();
            var maxX = Math.max(0, b.hw - drag.stkHalfW - 100);
            var maxY = Math.max(0, b.hh - drag.stkHalfH - 100);
            var clamped = clampInBag(drag.origBX + (e.clientX - drag.startMX), drag.origBY + (e.clientY - drag.startMY), maxX, maxY, b.rot);
            drag.wrap._baseX = clamped.x; drag.wrap._baseY = clamped.y;
            setTransform(drag.wrap, drag.wrap._baseX, drag.wrap._baseY);
        });
        document.addEventListener('mouseup', function(e) {
            if (!drag.wrap) return;
            var wrap = drag.wrap, stkEl = drag.stkEl;
            var b = bagBounds();
            var maxX = Math.max(0, b.hw - drag.stkHalfW - 100);
            var maxY = Math.max(0, b.hh - drag.stkHalfH - 100);
            var clamped = clampInBag(wrap._baseX + drag.vx * 4, wrap._baseY + drag.vy * 4, maxX, maxY, b.rot);
            var tx = clamped.x, ty = clamped.y;
            wrap._baseX = tx; wrap._baseY = ty;
            wrap.style.transition = 'transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)';
            setTransform(wrap, tx, ty);
            stkEl.classList.remove('is-grabbed');
            setTimeout(function() { wrap.style.transition = ''; }, 450);
            drag.wrap = null;
        });
    })();

    setTimeout(function() {
        var sb = window.Scrollbar && window.Scrollbar.get(document.getElementById('scroll-container'));
        if (!sb) return;

        // logo → scroll to absolute top
        document.querySelectorAll('a[href="#page-header"]').forEach(function(logo) {
            logo.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                gsap.to(sb, { duration: 2.2, scrollTo: { y: 0, autoKill: true }, ease: Expo.easeInOut });
            }, true);
        });

        // ── Hero → scroll to About: real hit-testing element, not a guess ──────
        // Previous version tried to infer "was this click over the hero" from
        // .scroll-content / #scroll-container (the smooth-scroll wrapper), because
        // #page-header itself never receives the click. Confirmed by direct
        // elementsFromPoint() testing why: theme.js prepends #page-header into
        // #body-inner as position:fixed, z-index:0 — same tied stacking level
        // (0/auto) as #scroll-container, which is theme.js's LATER sibling in that
        // same parent. For elements tied on stacking level, CSS resolves ties by
        // DOM order, later wins — so #scroll-container (and everything in it,
        // including its normally-transparent area over the hero) always sits above
        // #page-header for hit-testing, even though nothing is visibly painted
        // there. This is also why no z-index given to a CHILD of #page-header can
        // fix it either (tested empirically): a descendant's z-index only orders
        // it among #page-header's own children — #page-header's own position in
        // the OUTER (#body-inner) stacking order is unaffected by what's inside it.
        // Fix: a real, dedicated element appended as a LATER sibling of both
        // #page-header and #scroll-container inside #body-inner. No z-index needed
        // — winning is purely DOM-order, so it can never accidentally outrank
        // #logo-header (z-index:100) or #tt-header (z-index:99999), which sit
        // above everything regardless of order.
        if (window.innerWidth > 768) { // mirrors #page-header's own CSS breakpoint (max-width:768px hides it)
            var pageHeader = document.getElementById('page-header');
            var bodyInner = document.getElementById('body-inner');
            if (pageHeader && bodyInner) {
                var heroHit = document.createElement('a');
                heroHit.href = '#about';
                heroHit.id = 'hero-hit-area';
                heroHit.setAttribute('aria-hidden', 'true');
                heroHit.tabIndex = -1;
                heroHit.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:transparent;' +
                    'pointer-events:none;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;';
                bodyInner.appendChild(heroHit); // appended LAST on purpose, see comment above

                var heroNameEl = document.getElementById('hero-name-link');
                var doHeroScroll = function () {
                    var sbNow = window.Scrollbar && window.Scrollbar.get(document.getElementById('scroll-container'));
                    var about = document.getElementById('about');
                    if (!sbNow || !about) return;
                    var topY = $(about).offset().top - $('#scroll-container > .scroll-content').offset().top + 50;
                    /* Retina/high-DPI correction — see uiScaleCorrectScrollY in
                       theme.js for why this is needed (topY above is visual-space,
                       the scrollbar's own offset.y is layout-space, so this
                       undershoots the target below UW without it). No-op
                       everywhere else, including UW. Only matters for the fallback
                       path below, if the pin isn't found. */
                    if (window.__uiScaleCorrectScrollY) topY = window.__uiScaleCorrectScrollY(topY);
                    if (window.innerWidth >= 2560) topY += 50; // UW-only nudge, same as the nav-menu About scroll-to in theme.js
                    gsap.to(sbNow, { duration: 2.2, scrollTo: { y: topY, autoKill: true }, ease: Expo.easeInOut });
                };

                var syncHeroHitSize = function () { heroHit.style.height = pageHeader.offsetHeight + 'px'; };
                syncHeroHitSize();

                // heroVisible: same relationship used by the Ink Shift block's own
                // updateHeroVisible above (#content-wrap's marginTop == heroH, so
                // content-wrap's top reaches the viewport top — visually covering
                // the hero — exactly when scrollY reaches heroH). Recomputed here
                // independently rather than sharing that block's variable: this hit
                // area must keep working even if the Ink Shift prototype is deleted
                // (its own header comment says it's safe to delete standalone).
                var heroVisible = true;
                sb.addListener(function (status) {
                    syncHeroHitSize();
                    var nowVisible = status.offset.y < pageHeader.offsetHeight;
                    if (nowVisible === heroVisible) return;
                    heroVisible = nowVisible;
                    heroHit.style.pointerEvents = nowVisible ? 'auto' : 'none';
                });
                heroHit.style.pointerEvents = 'auto'; // hero is visible at load (scrollY = 0)

                var heroHitRaf = 0;
                window.addEventListener('resize', function () {
                    if (heroHitRaf) return;
                    heroHitRaf = requestAnimationFrame(function () {
                        heroHitRaf = 0;
                        var enabled = window.innerWidth > 768;
                        heroHit.style.display = enabled ? '' : 'none';
                        if (enabled) syncHeroHitSize();
                    });
                }, { passive: true });

                heroHit.addEventListener('click', function (e) {
                    e.preventDefault();
                    doHeroScroll();
                });

                // Wheel/trackpad: RE-DISPATCHED onto #scroll-container, not
                // reimplemented. Confirmed in assets/vendor/smooth-scrollbar.js that
                // its wheel listener is bound directly to containerEl
                // (#scroll-container) — not document/window — so bubbling never
                // reaches it from here (this element is a DOM sibling of
                // #scroll-container by construction, see comment above). A native
                // wheel event hit-tested against this element therefore needs
                // rerouting, same class of gap as the old Ink Shift hit-zone bug.
                // Earlier version "fixed" that by manually replicating the scroll
                // itself (sb.scrollTo(offset+deltaY, duration:0)) — but that skipped
                // the library's own deltaMode normalization AND its damping/momentum
                // entirely, so every wheel tick over the hero was an abrupt, un-eased
                // jump instead of matching the smooth feel everywhere else on the
                // page. Re-dispatching a real WheelEvent at #scroll-container instead
                // hands it to the library's own unmodified handler, so it processes
                // exactly as it would for a wheel event anywhere else — same
                // deltaMode handling, same damping, same momentum. No Smooth
                // Scrollbar code touched or reconfigured.
                heroHit.addEventListener('wheel', function (e) {
                    var sc = document.getElementById('scroll-container');
                    if (!sc) return;
                    sc.dispatchEvent(new WheelEvent('wheel', {
                        deltaX: e.deltaX, deltaY: e.deltaY, deltaZ: e.deltaZ, deltaMode: e.deltaMode,
                        clientX: e.clientX, clientY: e.clientY, bubbles: true, cancelable: true
                    }));
                    // Prevents this element's own (nonexistent) default handling —
                    // it isn't scrollable itself — as a safety net against any native
                    // fallback scroll stacking on top of the redispatch above.
                    e.preventDefault();
                }, { passive: false });

                // #hero-name-link's own :hover (scale on the letters, see CSS near
                // top of file) stops firing natively once this element sits above
                // it for hit-testing — same reason it needs to sit above
                // #scroll-container. Reproduced here via a class instead, driven
                // off this element's own mousemove, so the existing effect is
                // preserved rather than silently lost.
                if (heroNameEl) {
                    // Gated on window._heroParallaxReady — set by the name/subtitle
                    // reveal's own LAST tween finishing (see doReveal() above), which
                    // is strictly after .name-reveal-mask elements get their
                    // overflow switched back from 'hidden' to 'visible' (that happens
                    // on FEDERICO's line tween completing, earlier in the same
                    // sequence). Before that point the mask still clips at the
                    // line's original (un-scaled) box, so a hover-triggered
                    // transform:scale poking past it renders visibly cut off. Not
                    // polling DOM overflow directly on purpose: this flag already
                    // exists for exactly this "reveal is done" purpose (Ink Shift
                    // above relies on the same variable), so reusing it needs no
                    // change to the reveal script at all.
                    var nameHoverReady = false;
                    var nameHoverPoll = setInterval(function () {
                        if (!window._heroParallaxReady) return;
                        nameHoverReady = true;
                        clearInterval(nameHoverPoll);
                    }, 100);

                    heroHit.addEventListener('mousemove', function (e) {
                        if (!nameHoverReady) return;
                        var r = heroNameEl.getBoundingClientRect();
                        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
                        heroNameEl.classList.toggle('force-hover', inside);
                    });
                    heroHit.addEventListener('mouseleave', function () {
                        heroNameEl.classList.remove('force-hover');
                    });
                }
            }
        }
    }, 700);

}

