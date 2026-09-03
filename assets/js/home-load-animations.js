window.addEventListener('load', () => {
    setTimeout(function() { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }, 1000);
    // ── Late-loading images (services-big, trusted-logos, footer, etc.) can still shift the
    //    page height after the 1s refresh above fires, leaving scrub-linked ScrollTriggers
    //    below that point calculated against a stale layout. Refresh again once every image
    //    on the page has actually finished loading, whenever that really happens. ──
    if (window.jQuery && typeof jQuery.fn.imagesLoaded === 'function') {
        jQuery(document).imagesLoaded(function() {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });
    }

    // ── "Works" nav links: stop 50px above the "A Few of Them" pill instead of the top of
    //    #works, computed live off the pill's own position so it stays correct even if the
    //    page layout above it changes. ──
    try {
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) return;
            var link = e.target.closest('a[href="#works"]');
            if (!link) return;
            var pill = document.getElementById('work-them');
            if (!pill) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            var lenis = window.__lenis;
            if (lenis && typeof jQuery !== 'undefined') {
                var topY = jQuery(pill).offset().top - 50;
                lenis.scrollTo(topY, { duration: 2.2, easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); } });
            } else {
                var y = pill.getBoundingClientRect().top + window.pageYOffset - 50;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, true);
    } catch (e) { console.error('[nav] works pill scroll override failed:', e); }

    // ── Hero meta clock — Tigre, Bs.As. (GMT-3), live date + time ──
    (function() {
        var dateEl = document.getElementById('hero-meta-date');
        var timeEl = document.getElementById('hero-meta-time');
        if (!dateEl && !timeEl) return;
        var tz = 'America/Argentina/Buenos_Aires';
        var dateFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric', year: 'numeric' });
        var timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true });
        function update() {
            var now = new Date();
            if (dateEl) dateEl.textContent = dateFmt.format(now).toUpperCase();
            if (timeEl) {
                var parts = timeFmt.formatToParts(now);
                var hour = parts.find(function(p) { return p.type === 'hour'; }).value;
                var minute = parts.find(function(p) { return p.type === 'minute'; }).value;
                var period = parts.find(function(p) { return p.type === 'dayPeriod'; }).value.toUpperCase();
                timeEl.textContent = hour + ':' + minute + period + ' (GMT-3)';
            }
        }
        update();
        setInterval(update, 1000);
    })();

    // ── UW SVG swap — load larger versions at 2560px+ ──
    function swapHeroSVGs() {
        if (window.innerWidth <= 768) return; // mobile: these targets are display:none, do not request desktop assets
        var fedImg = document.querySelector('#line-federico img');
        var vacImg = document.querySelector('#line-vaccarezza img');
        if (!fedImg || !vacImg) return;
        var isRetinaHero = window.matchMedia('(min-resolution: 2dppx)').matches;
        if (window.innerWidth >= 2560) {
            fedImg.src = './assets/svg/desk-federico-uw.svg';
            vacImg.src = './assets/svg/desk-vaccarezza-uw.svg';
        } else if (isRetinaHero) {
            fedImg.src = './assets/svg/desk-federico-retina.svg';
            vacImg.src = './assets/svg/desk-vaccarezza-retina.svg';
        } else {
            fedImg.src = './assets/svg/desk-federico.svg';
            vacImg.src = './assets/svg/desk-vaccarezza.svg';
        }
    }
    swapHeroSVGs();
    window.addEventListener('resize', swapHeroSVGs);

    // ── UW SVG swap — desk-extra ──
    function swapExtraSVG() {
        if (window.innerWidth <= 768) return; // mobile: these targets are display:none, do not request desktop assets
        var extraImg = document.getElementById('desk-extra');
        if (!extraImg) return;
        extraImg.src = window.innerWidth >= 2560
            ? './assets/svg/desk-extra-uw.svg'
            : './assets/svg/desk-extra.svg';
    }
    swapExtraSVG();
    window.addEventListener('resize', swapExtraSVG);

    // ── UW SVG swap — testi phrase + testi tag ──
    function swapTestiSVG() {
        if (window.innerWidth <= 768) return; // mobile: these targets are display:none, do not request desktop assets
        var isUWTesti = window.innerWidth >= 2560;
        var testiImg = document.getElementById('testi-phrase-img');
        if (testiImg) {
            testiImg.src = isUWTesti ? './assets/svg/they-uw.svg' : './assets/svg/desk-they.svg';
        }
        var testiTagImg = document.getElementById('testi-tag-img');
        if (testiTagImg) {
            testiTagImg.src = isUWTesti ? './assets/svg/pill-somekind-uw.svg' : './assets/svg/pill-somekind.svg';
        }
    }
    swapTestiSVG();
    window.addEventListener('resize', swapTestiSVG);

    // ── UW SVG swap — FAQ titles ──
    function swapFaqSVGs() {
        if (window.innerWidth <= 768) return; // mobile: these targets are display:none, do not request desktop assets
        var isUW = window.innerWidth >= 2560;
        var map = [
            { id: null, sel: '#faq-section .faq-title-img', srcs: ['./assets/svg/desk-things.svg','./assets/svg/desk-iget.svg','./assets/svg/desk-asked.svg'], uwSrcs: ['./assets/svg/desk-things-uw.svg','./assets/svg/desk-iget-uw.svg','./assets/svg/desk-asked-uw.svg'] },
            { id: null, sel: '#faq-section-2 .faq-title-img', srcs: ['./assets/svg/desk-how.svg','./assets/svg/desk-things.svg','./assets/svg/desk-flow.svg'], uwSrcs: ['./assets/svg/desk-how-uw.svg','./assets/svg/desk-things-uw.svg','./assets/svg/desk-flow-uw.svg'] },
        ];
        map.forEach(function(group) {
            var imgs = document.querySelectorAll(group.sel);
            imgs.forEach(function(img, i) {
                img.src = isUW ? group.uwSrcs[i] : group.srcs[i];
            });
        });
    }
    swapFaqSVGs();
    window.addEventListener('resize', swapFaqSVGs);
    function swapTrustedLogosSVG() {
        if (window.innerWidth <= 768) return; // mobile: these targets are display:none, do not request desktop assets
        var img = document.getElementById('trusted-logos-img');
        if (!img) return;
        var isUW = window.innerWidth >= 2560;
        var isRetina = window.matchMedia('(min-resolution: 2dppx)').matches;
        img.src = isUW
            ? './assets/svg/desk-logos-trusted-uw.svg'
            : (isRetina ? './assets/svg/desk-logos-trusted-rt.svg' : './assets/svg/desk-logos-trusted.svg');
    }
    swapTrustedLogosSVG();
    window.addEventListener('resize', swapTrustedLogosSVG);
    function swapFooterOrangeSVG() {
        if (window.innerWidth <= 768) return; // mobile: these targets are display:none, do not request desktop assets
        var img = document.getElementById('footer-orange-img');
        if (!img) return;
        img.src = './assets/images/home/desk-footer-orange-main.png';
    }
    swapFooterOrangeSVG();
    window.addEventListener('resize', swapFooterOrangeSVG);
    var stickerRtMissing = []; // sticker12rt.png uploaded
    function swapStickerImages() {
        if (window.innerWidth <= 768) return; // mobile: these targets are display:none, do not request desktop assets
        var isUW = window.innerWidth >= 2560;
        document.querySelectorAll('.stk-wrap:not([data-bolsita]) .stk').forEach(function(img) {
            var src = img.getAttribute('src');
            if (!src) return; // not hydrated (mobile) — nothing to swap
            if (isUW) {
                img.setAttribute('src', src.replace(/sticker(\d+)(rt)?\.png/, 'sticker$1uw.png'));
                img.removeAttribute('srcset');
            } else {
                var base = src.replace(/sticker(\d+)uw\.png/, 'sticker$1.png');
                img.setAttribute('src', base);
                var m = base.match(/sticker(\d+)\.png/);
                if (m && stickerRtMissing.indexOf(parseInt(m[1], 10)) === -1) {
                    img.setAttribute('srcset', base + ' 1x, ' + base.replace(/sticker(\d+)\.png/, 'sticker$1rt.png') + ' 3x');
                } else {
                    img.removeAttribute('srcset');
                }
            }
        });
    }
    swapStickerImages();
    window.addEventListener('resize', swapStickerImages);

    // footer gap handled in theme.js

    // ── Fix: neutralize content-wrap upward shift that leaves a gap at the bottom ──
    if (window.innerWidth > 768) {
        setTimeout(function() {
            const contentWrap = document.getElementById('content-wrap');
            if (window.__lenisListen && contentWrap) {
                window.__lenisListen(function() {
                    contentWrap.style.transform = 'translateY(0px)';
                });
            }
        }, 550);
    }

    if (window.innerWidth > 768) {
        setTimeout(function() {
            if (!window.__lenisListen) return;
            const heroLabel = document.getElementById('hero-portfolio-label');
            const lineFedEl = document.getElementById('line-federico');
            const lineVacEl = document.getElementById('line-vaccarezza');
            const heroSub   = document.querySelector('.hero-subtitle');
            const hero      = document.getElementById('page-header');
            const hoverFv   = document.querySelector('.hover-fv');
            const aboutShadow = document.getElementById('about-enter-shadow');
            const heroMetaRowScroll = document.getElementById('hero-meta-row');
            window.__lenisListen(function({ offset }) {
                if (!window._heroParallaxReady) return;
                const heroH = hero ? hero.offsetHeight : window.innerHeight;
                const p = Math.min(offset.y / (heroH * 1.2), 1);
                if (heroLabel) heroLabel.style.transform = 'translateY(' + (p * -110) + 'px)';
                if (lineFedEl) lineFedEl.style.transform = 'translateY(' + (p * -110) + 'px)';
                if (lineVacEl) lineVacEl.style.transform = 'translateY(' + (p * -140) + 'px)';
                if (heroSub)   heroSub.style.transform   = 'translateY(' + (p * -140) + 'px)';
                if (hoverFv) { hoverFv.style.filter = 'blur(' + (p * 24) + 'px)'; hoverFv.style.opacity = 1 - p; }
                if (heroMetaRowScroll) { heroMetaRowScroll.style.filter = 'blur(' + (p * 24) + 'px)'; heroMetaRowScroll.style.opacity = 1 - p; }
                if (aboutShadow) aboutShadow.style.opacity = p;
            });
        }, 600);
    }

    function matchLbHeight() {
        const lb1 = document.getElementById('lb-line1'), lb2 = document.getElementById('lb-line2');
        if (lb1 && lb2) { const h = lb2.getBoundingClientRect().height; lb1.style.height = h + 'px'; lb1.style.width = 'auto'; }
    }
    matchLbHeight();
    window.addEventListener('resize', matchLbHeight);

    if (typeof gsap !== 'undefined') {
        const minTitlesReveal = document.querySelectorAll('.ph-caption .min-titles');
        const lineFed = document.querySelector('#line-federico');
        const lineVac = document.querySelector('#line-vaccarezza');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroMetaRow = document.getElementById('hero-meta-row');
        const heroBgImg = document.getElementById('hero-bg-img');
        const heroBgImg2 = document.getElementById('hero-bg-img-2');
        window._heroParallaxReady = false;
        document.querySelectorAll('.name-reveal-mask').forEach(m => m.style.overflow = 'hidden');
        document.querySelectorAll('.ph-caption .min-titles').forEach(m => { if (m.parentNode) m.parentNode.style.overflow = 'hidden'; });
        gsap.set(minTitlesReveal, { y: '100%' });
        gsap.set(lineFed, { y: '100%' });
        gsap.set(lineVac, { y: '100%' });
        gsap.set(heroSubtitle, { y: '100%' });
        if (heroMetaRow) gsap.set(heroMetaRow.children, { opacity: 0, y: 16 });
        if (heroBgImg) gsap.set(heroBgImg, { yPercent: 100 });
        if (heroBgImg2) gsap.set(heroBgImg2, { yPercent: -100 });
        const doReveal = () => {
            var introLogoEl = document.querySelector('.tt-logo.mob-no');
            if (introLogoEl) { introLogoEl.classList.add('intro-hover'); setTimeout(() => { introLogoEl.classList.remove('intro-hover'); }, 1400); }
            gsap.to(minTitlesReveal, { y: 0, duration: 1.4, ease: 'power3.out', delay: 0 });
            gsap.to(lineFed, { y: 0, duration: 1.6, ease: 'power3.out', delay: 0.15, onComplete: () => { document.querySelectorAll('.name-reveal-mask').forEach(m => m.style.overflow = 'visible'); document.querySelectorAll('.ph-caption .min-titles').forEach(m => { if (m.parentNode) m.parentNode.style.overflow = 'visible'; }); } });
            gsap.to(lineVac, { y: 0, duration: 1.6, ease: 'power3.out', delay: 0.45 });
            if (heroMetaRow) gsap.to(heroMetaRow.children, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.55, stagger: 0.12 });
            // Flips 0.5s ahead of heroSubtitle's own onComplete below (which fires at
            // delay 0.4 + duration 1.4 = 1.8s) so the hero-craft fade-in (index.html,
            // gated on this flag) starts half a second earlier, without moving the
            // hero reveal tweens themselves or anything else in that onComplete body.
            gsap.delayedCall(1.3, () => { window._heroParallaxReady = true; });
            gsap.to(heroSubtitle, { y: 0, duration: 1.4, ease: 'power3.out', delay: 0.4, onComplete: () => {
                const masks = document.querySelectorAll('.name-reveal-mask');
                const heroPortLabel = document.getElementById('hero-portfolio-label');
                const heroPortLabelWrap = heroPortLabel ? heroPortLabel.parentNode : null;
                const heroSubWrap = heroSubtitle ? heroSubtitle.parentNode : null;
                if (masks[0] && masks[1]) {
                    var breatheProxy = { val: 0 };
                    gsap.to(breatheProxy, {
                        val: 10, duration: 4.6, ease: 'sine.inOut', repeat: 1, yoyo: true,
                        onUpdate: function() {
                            var up = -breatheProxy.val, dn = breatheProxy.val;
                            // grupo 1: portfolio label + FEDERICO se mueven juntos, en bloque
                            if (heroPortLabelWrap) heroPortLabelWrap.style.transform = 'translateY(' + up + 'px)';
                            if (masks[0]) masks[0].style.transform = 'translateY(' + up + 'px)';
                            // grupo 2: VACCAREZZA + subtítulo se mueven juntos, en bloque, para el otro lado
                            if (masks[1]) masks[1].style.transform = 'translateY(' + dn + 'px)';
                            if (heroSubWrap) heroSubWrap.style.transform = 'translateY(' + dn + 'px)';
                        }
                    });
                }
            } });
        };
        let revealed = false;
        const safeReveal = () => { if (!revealed) { revealed = true; doReveal(); } };
        const preloaderEl = document.getElementById('preloader');
        if (preloaderEl) {
            const obsReveal = new MutationObserver(() => { const s = window.getComputedStyle(preloaderEl); if (s.opacity === '0' || s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.1) { safeReveal(); obsReveal.disconnect(); } });
            obsReveal.observe(preloaderEl, { attributes: true, attributeFilter: ['style', 'class'] });
            setTimeout(safeReveal, 2000);
        } else { setTimeout(safeReveal, 300); }

        // ── Hero background: starts its entrance earlier, while the preloader is still fading out ──
        let heroBgRevealed = false;
        const heroBgReveal = () => {
            if (heroBgRevealed || !heroBgImg) return;
            heroBgRevealed = true;
            gsap.to(heroBgImg, { yPercent: 0, duration: 1.9, ease: 'power3.out', delay: 0.35, onComplete: function() {
                var heroBgExit = heroBgImg.offsetHeight || window.innerHeight;
                gsap.to(heroBgImg, { y: heroBgExit, duration: 20, ease: 'none' });
                if (heroBgImg2) {
                    var isUWHero = window.innerWidth >= 2560;
                    gsap.to(heroBgImg2, { yPercent: -55, duration: isUWHero ? 30 : 20, ease: 'none', delay: 0.15 });
                }
            } });
        };
        if (preloaderEl) {
            const obsHeroBg = new MutationObserver(() => { const s = window.getComputedStyle(preloaderEl); if (parseFloat(s.opacity) < 0.9) { heroBgReveal(); obsHeroBg.disconnect(); } });
            obsHeroBg.observe(preloaderEl, { attributes: true, attributeFilter: ['style', 'class'] });
            setTimeout(heroBgReveal, 1500);
        } else { setTimeout(heroBgReveal, 150); }

        if (window.innerWidth <= 768) {
            var lastScrollY = 0, menuBtn = document.getElementById('tt-ol-menu-toggle-btn-wrap'), logoHeader = document.getElementById('logo-header'), ticking = false;
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(function() {
                        var currentScrollY = window.scrollY, diff = currentScrollY - lastScrollY;
                        if (diff > 4) { if (menuBtn) { menuBtn.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)'; menuBtn.style.transform = 'translateY(-120px)'; } if (logoHeader) { logoHeader.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)'; logoHeader.style.transform = 'translateY(-120px)'; } }
                        else if (diff < -4) { if (menuBtn) { menuBtn.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)'; menuBtn.style.transform = 'translateY(0)'; } if (logoHeader) { logoHeader.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)'; logoHeader.style.transform = 'translateY(0)'; } }
                        lastScrollY = currentScrollY; ticking = false;
                    }); ticking = true;
                }
            }, { passive: true });
        }

        const viewCursor = document.createElement('div');
        viewCursor.id = 'view-cursor';
        viewCursor.style.cssText = 'position:fixed;pointer-events:none;z-index:999998;opacity:1;display:flex;align-items:center;justify-content:center;width:10px;height:10px;border-radius:50%;background:#FF6600;mix-blend-mode:multiply;overflow:hidden;will-change:left,top;transition:width 0.5s cubic-bezier(0.34,1.2,0.64,1), height 0.5s cubic-bezier(0.34,1.2,0.64,1), opacity 0.3s ease;';
        viewCursor.innerHTML = '<span style="position:relative;isolation:isolate;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;letter-spacing:0.2em;text-align:center;text-transform:uppercase;font-family:&quot;PP Telegraf&quot;,sans-serif;font-size:0px;font-weight:400;color:white;transition:font-size 0.3s ease;"><span style="margin-left:0.2em;">VIEW</span><span style="margin-left:0.2em;">MORE</span></span>';
    if (window.innerWidth > 768) document.body.appendChild(viewCursor);
        const viewCursorText = viewCursor.querySelector('span');

        // ── Menu reveal on logo hover ──
        if (window.innerWidth > 768) {
            const logoEl = document.querySelector('.tt-logo.mob-no');
            const navEl = document.querySelector('nav.tt-main-menu');
            if (logoEl && navEl) {
                let hideTimeout;
                const show = () => { clearTimeout(hideTimeout); navEl.classList.add('menu-revealed'); };
                const hide = () => { hideTimeout = setTimeout(() => navEl.classList.remove('menu-revealed'), 80); };
                const keepOpen = () => { if (navEl.classList.contains('menu-revealed')) clearTimeout(hideTimeout); };
                logoEl.addEventListener('mouseenter', show);
                logoEl.addEventListener('mouseleave', hide);
                navEl.addEventListener('mouseenter', keepOpen);
                navEl.addEventListener('mouseleave', hide);
            }
        }

        let vcX = -300, vcY = -300, vcTargetX = -300, vcTargetY = -300;
        let vcRafRunning = false, vcLastLeft = null, vcLastTop = null;
        function vcTick() {
            vcX += (vcTargetX - vcX) * 0.08; vcY += (vcTargetY - vcY) * 0.08;
            var leftStr = vcX + 'px', topStr = vcY + 'px';
            /* Same convergence check as the About-photo tick() below: if the
               rounded output stopped changing, another frame would paint
               nothing different, so stop requesting frames until the next
               real mousemove wakes it back up (see wake-on-move below). */
            if (leftStr === vcLastLeft && topStr === vcLastTop) { vcRafRunning = false; return; }
            viewCursor.style.left = leftStr; viewCursor.style.top = topStr; viewCursor.style.transform = 'translate(-50%, -50%)';
            vcLastLeft = leftStr; vcLastTop = topStr;
            requestAnimationFrame(vcTick);
        }
        function vcWake() { if (!vcRafRunning) { vcRafRunning = true; requestAnimationFrame(vcTick); } }
        document.addEventListener('mousemove', (e) => { vcTargetX = e.clientX; vcTargetY = e.clientY; vcWake(); });
        vcWake();
        const fxCursor = document.querySelector('.fx-cursor');
        if (fxCursor) fxCursor.style.display = 'none';
        document.querySelectorAll('.card').forEach(card => {
            const mediaLink = card.querySelector('a.media');
            if (window.innerWidth <= 768) return;
            card.addEventListener('mouseenter', (e) => { if (e.target.closest('.stamp')) return; viewCursor.style.width = '70px'; viewCursor.style.height = '70px'; viewCursorText.style.fontSize = '12px'; if (fxCursor) { fxCursor.style.filter='blur(4px)'; fxCursor.style.opacity='0'; } });
            card.addEventListener('mouseover', (e) => { if (e.target.closest('.stamp')) { viewCursor.style.width = '10px'; viewCursor.style.height = '10px'; viewCursorText.style.fontSize = '0px'; viewCursor.style.opacity = '0'; if (fxCursor) { fxCursor.style.filter='blur(0px)'; fxCursor.style.opacity='1'; } } else if (e.target.closest('a.media')) { viewCursor.style.width = '70px'; viewCursor.style.height = '70px'; viewCursorText.style.fontSize = '12px'; viewCursor.style.opacity = '1'; if (fxCursor) { fxCursor.style.filter='blur(4px)'; fxCursor.style.opacity='0'; } } });
            card.addEventListener('mouseleave', () => { viewCursor.style.width = '10px'; viewCursor.style.height = '10px'; viewCursorText.style.fontSize = '0px'; viewCursor.style.opacity = '1'; if (fxCursor) { fxCursor.style.filter='blur(0px)'; fxCursor.style.opacity='1'; } if (mediaLink) { mediaLink.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'; mediaLink.style.transition = 'transform 0.6s cubic-bezier(0.34,1.5,0.9,1)'; } });
            /* rAF-batched, same math/values as before — was reading mediaLink's rect
               and writing its transform on every raw mousemove event; now it stores
               the latest cursor position and does the read+write at most once per
               animation frame, mirroring the gallery-repel handler's own fix above. */
            let tiltMx = 0, tiltMy = 0, tiltTicking = false;
            function applyTilt() {
                tiltTicking = false;
                if (!mediaLink) return;
                const rect = mediaLink.getBoundingClientRect();
                const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2, dx = (tiltMx - cx) / (rect.width / 2), dy = (tiltMy - cy) / (rect.height / 2);
                mediaLink.style.transform = 'perspective(1200px) rotateX(' + (-dy * 1.5) + 'deg) rotateY(' + (dx * 1.5) + 'deg)';
                mediaLink.style.transition = 'transform 0.15s ease';
            }
            card.addEventListener('mousemove', (e) => {
                if (!mediaLink) return;
                tiltMx = e.clientX; tiltMy = e.clientY;
                if (!tiltTicking) { tiltTicking = true; requestAnimationFrame(applyTilt); }
            });
        });
        document.querySelectorAll('.services-btns-row a, .services-btns-connect').forEach(btn => {
            btn.addEventListener('mousemove', (e) => { const rect = btn.getBoundingClientRect(); const dx = (e.clientX - (rect.left + rect.width/2)) / (rect.width/2), dy = (e.clientY - (rect.top + rect.height/2)) / (rect.height/2); btn.style.transform = 'perspective(400px) rotateX(' + (-dy*4) + 'deg) rotateY(' + (dx*4) + 'deg) translate(' + (dx*8) + 'px,' + (dy*8) + 'px)'; btn.style.transition = 'transform 0.15s ease'; });
            btn.addEventListener('mouseleave', () => { btn.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) translate(0px,0px)'; btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.5,0.9,1)'; });
        });
        if (window.innerWidth > 768) {
            document.querySelectorAll('.tt-ol-menu-list > li.common-li > a, .tt-ol-submenu-list > li > a, .tt-main-menu-list > li > a').forEach(a => { const text = a.textContent.trim(); a.classList.add('ol-roll-wrap'); a.innerHTML = '<span class="ol-brace ol-brace-l">[</span><span class="ol-roll-text"><span>' + text + '</span><span>' + text + '</span></span><span class="ol-brace ol-brace-r">]</span>'; });
        }
        document.querySelectorAll('.footer-contact-socials a').forEach(a => {
            a.addEventListener('mousemove', (e) => { const rect = a.getBoundingClientRect(); const dx = (e.clientX - (rect.left + rect.width/2)) / (rect.width/2), dy = (e.clientY - (rect.top + rect.height/2)) / (rect.height/2); a.style.transform = 'translateY(-4px) scale(1.15) translate(' + (dx*4) + 'px,' + (dy*4) + 'px)'; a.style.transition = 'transform 0.15s ease'; });
            a.addEventListener('mouseleave', () => { a.style.transform = ''; a.style.transition = 'transform 0.4s cubic-bezier(0.34,1.5,0.9,1)'; });
        });


        (function() {
            const holaInner = document.querySelector('#title-hola');
            if (holaInner) {
                gsap.set(holaInner, { y: '110%', filter: 'blur(20px)' });
                gsap.to(holaInner, { y: 0, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'center center', scrub: 1.2 } });
                gsap.to(holaInner, { filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top bottom', toggleActions: 'play none none none' } });
            }
            // #works's reveal tweens (pill, desc, featured/projects clips) used to
            // each carry their own scrollTrigger:{trigger:'#works', start:'top 85%'}.
            // Once #stats-pin above it holds a real GSAP pin, ScrollTrigger's cached
            // start value for any string/percent trigger positioned AFTER a pinned
            // section comes out wrong (verified directly: computed start ignored the
            // pin's whole reserved scroll distance, firing thousands of px too early
            // — reproduces with a bare pin:true, independent of pinType/pinSpacing/
            // nesting, so it's not something tunable away). Building these as paused
            // tweens and firing them off a manual, live getBoundingClientRect check
            // sidesteps that cached-position bug entirely.
            var worksRevealTweens = [];
            const workThem = document.getElementById('work-them');
            if (workThem) { gsap.set(workThem, { opacity:0, y:20, filter:'blur(20px)', force3D:false }); worksRevealTweens.push(gsap.to(workThem, { opacity:1, y:0, filter:'blur(0px)', ease:'power3.out', duration:1.2, delay:0, force3D:false, paused:true })); }
            const worksAfewDesc = document.getElementById('works-afew-desc');
            if (worksAfewDesc) { worksRevealTweens.push(gsap.to(worksAfewDesc, { opacity:1, y:0, filter:'blur(0px)', ease:'power3.out', duration:1.2, delay:0.35, paused:true })); }
            const deskFeatured = document.getElementById('desk-featured'), deskWork = document.getElementById('desk-work');
            const isRetina = window.matchMedia('(min-resolution: 2dppx)').matches;
            if (deskFeatured) { gsap.set(deskFeatured, { y: '160%', filter: 'blur(20px)' }); worksRevealTweens.push(gsap.to(deskFeatured, { y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.4, paused:true })); }
            if (deskWork) { gsap.set(deskWork, { y: '160%', filter: 'blur(20px)' }); worksRevealTweens.push(gsap.to(deskWork, { y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.4, delay: 0.15, paused:true })); }
            if (worksRevealTweens.length) {
                var worksEl = document.getElementById('works');
                var worksRevealFired = false;
                var checkWorksReveal = function () {
                    if (worksRevealFired || !worksEl) return;
                    if (worksEl.getBoundingClientRect().top <= window.innerHeight * 0.85) {
                        worksRevealFired = true;
                        worksRevealTweens.forEach(function (tw) { tw.play(); });
                        gsap.ticker.remove(checkWorksReveal);
                    }
                };
                // ScrollTrigger's global 'update' event isn't reliably available
                // here (only individual triggers' own onUpdate is guaranteed) —
                // gsap.ticker runs every animation frame regardless, so it's a
                // reliable place to poll a plain getBoundingClientRect.
                gsap.ticker.add(checkWorksReveal);
                checkWorksReveal();
            }
            if (window.innerWidth <= 768) {
                var mobStickersImg = document.getElementById('mob-stickers-img');
                if (mobStickersImg) {
                    gsap.fromTo(mobStickersImg, { y: -12, rotation: -2 }, { y: 12, rotation: 2, ease: 'none', scrollTrigger: { trigger: mobStickersImg, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
                }
            }
            if (isRetina) {
                var extraSec = document.getElementById('extra-section');
                if (extraSec) { extraSec.style.setProperty('padding-top', '0px', 'important'); extraSec.style.setProperty('margin-top', '-75px', 'important'); }
            }
        })();

        (function() { window.__registerTitleParallax = function() {}; })();

        (function() {
            const line1 = document.getElementById('lb-line1'), line2 = document.getElementById('lb-line2');
            if (!line1 || !line2) return;
            gsap.to(line1, { y: 0, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top 95%', end: 'top 25%', scrub: 1.4 } });
            gsap.to(line1, { filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 95%', toggleActions: 'play none none none' } });
            gsap.to(line2, { y: 0, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top 65%', end: 'top 15%', scrub: 1.4 } });
            gsap.to(line2, { filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 65%', toggleActions: 'play none none none' } });
        })();

        (function() {
            const testiPhrase = document.getElementById('testi-phrase-img');
            if (!testiPhrase) return;
            const isRetinaTesti = window.matchMedia('(min-resolution: 2dppx)').matches;
            gsap.to(testiPhrase, { y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.4, delay: 0.15, scrollTrigger: { trigger: '.desktop-testi-wrap', start: 'top 85%', toggleActions: 'play none none none' } });

            const testiAfewDesc = document.getElementById('testi-afew-desc');
            if (testiAfewDesc) { gsap.to(testiAfewDesc, { opacity:1, y:0, filter:'blur(0px)', ease:'power3.out', duration:1.2, delay:0.35, scrollTrigger: { trigger:'.desktop-testi-wrap', start:'top 85%', toggleActions:'play none none none' } }); }
        })();

        (function() {
            const stage = document.getElementById('stage');
            const testiSection = document.getElementById('testimonials-section');
            if (!stage || !testiSection) return;
            const roleDelay = { active: 0, prev: 0.3, next: 0.3 };
            const cards = Array.from(stage.querySelectorAll('.verbatim.active, .verbatim.prev, .verbatim.next'));
            if (!cards.length) return;
            const activeCard = cards.find(function(el) { return el.classList.contains('active'); });
            const centerTransform = activeCard ? activeCard.style.transform : null;
            const targets = cards.map(function(el) {
                var isActive = el.classList.contains('active');
                var role = isActive ? 'active' : (el.classList.contains('prev') ? 'prev' : 'next');
                return { el: el, transform: el.style.transform, opacity: el.style.opacity, isActive: isActive, delay: roleDelay[role] };
            });
            targets.forEach(function(t) {
                t.el.style.transition = 'none';
                t.el.style.opacity = '0';
                t.el.style.filter = 'blur(22px)';
                t.el.style.transform = (t.isActive || !centerTransform) ? (t.transform + ' translateY(40px)') : centerTransform;
            });
            void stage.offsetWidth;
            const reveal = function() {
                targets.forEach(function(t) {
                    requestAnimationFrame(function() {
                        t.el.style.transition = 'transform 1.2s cubic-bezier(0.22,1,0.36,1) ' + t.delay + 's, filter 1.2s cubic-bezier(0.22,1,0.36,1) ' + t.delay + 's, opacity 1.2s cubic-bezier(0.22,1,0.36,1) ' + t.delay + 's';
                        t.el.style.transform = t.transform;
                        t.el.style.filter = 'blur(0px)';
                        t.el.style.opacity = t.opacity;
                        setTimeout(function() { t.el.style.transition = ''; }, (t.delay + 1.3) * 1000);
                    });
                });
            };
            const obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) { if (entry.isIntersecting) { reveal(); obs.disconnect(); } });
            }, { threshold: 0.6 });
            obs.observe(testiSection);
        })();

        const workAfew = document.querySelector('.desk-works-afew');
        if (workAfew) {
            ['#work-them'].forEach(function(sel) { const el = workAfew.querySelector(sel); if (!el) return; gsap.set(el, { clearProps:'transform,will-change' }); });
        }

        // ── ABOUT breathe parallax ──
        try {
        if (window.innerWidth > 768) {
            var fedeAboutMe = document.getElementById('desk-about-me');
            var fedePhoto = document.getElementById('fede-photo-wrap');
            var fedeText = document.getElementById('fede-text-wrap');
            var aboutPill = document.getElementById('about-pill');
            if (aboutPill) {
                gsap.to(aboutPill, { opacity:1, y:0, filter:'blur(0px)', duration:1.2, ease:'power3.out', scrollTrigger: { trigger:'#hola-foto', start:'top 85%', toggleActions:'play none none none' } });
            }
            if (fedeAboutMe) {
                gsap.set(fedeAboutMe, { y: '160%', filter: 'blur(20px)' });
                gsap.to(fedeAboutMe, { y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.4, scrollTrigger: { trigger: '#hola-foto', start: 'top 85%', toggleActions: 'play none none none' } });
            }
            if (fedePhoto) {
                gsap.set(fedePhoto, { opacity:0, y:40, filter:'blur(20px)' });
                gsap.to(fedePhoto, { opacity:1, y:0, filter:'blur(0px)', duration:1.2, ease:'power3.out', scrollTrigger: { trigger:'#hola-foto', start:'top 85%', toggleActions:'play none none none' } });
            }
            if (fedeText) {
                gsap.set(fedeText, { opacity:0, y:40, filter:'blur(20px)' });
                gsap.to(fedeText, { opacity:1, y:0, filter:'blur(0px)', duration:1.2, ease:'power3.out', scrollTrigger: { trigger:'#hola-foto', start:'top 85%', toggleActions:'play none none none' } });
            }

            // fede-blur zoom + fede-solo scale down anchored to bottom
            setTimeout(function() {
                if (!window.__lenisListen) return;
                const fedeBlur = document.getElementById('fede-blur-img');
                const fedeSolo = document.getElementById('fede-solo-img');
                const fedeWrap = document.getElementById('fede-photo-wrap');
                if (!fedeBlur || !fedeWrap) return;

                /* fede-solo: subtle mouse-parallax, layered on top of the existing
                   scroll-driven scale rather than replacing it — both write to the
                   same transform, combined into one string in tick() below instead
                   of one clobbering the other each scroll/mousemove tick.
                   SOLO_SLACK_SCALE (1.05) exists purely to give the translate room:
                   fedeSolo is object-fit:cover inside overflow:hidden with zero
                   slack at rest (scale 1 exactly fills the box), so any translate
                   without extra size would expose a gap at one edge. 5% headroom
                   comfortably covers the small ±7px max offset below. Baked in as a
                   multiplier (not an added constant) so the existing "shrinks 10%
                   over the scroll range" trajectory is preserved, just uniformly
                   larger — invisible in itself since the crop already hides it,
                   only the intentional translate makes use of the extra room.

                   PERF: this used to be two independent, unconditional
                   requestAnimationFrame loops that ran forever, plus a
                   document-level mousemove listener calling getBoundingClientRect()
                   on every single pointer move anywhere on the page — a permanent,
                   site-wide cost (including while hovering Project cards, far from
                   here) that a profiling pass traced as the source of a broader
                   FPS regression. Rebuilt below as ONE controlled loop (tick/wake)
                   that only requests another frame while something is still
                   actually converging, and mousemove now reads a CACHED rect
                   instead of measuring live. Every numeric constant, lerp factor,
                   and the resulting transform strings are unchanged — this is a
                   scheduling change only, not a visual one. */
                var photoHovering = false;
                var SOLO_SLACK_SCALE = 1.05;
                var SOLO_MAX_PX = 1.2; // kept tiny on purpose — "mega sutil"
                var soloScrollScale = 1;
                var soloHoverCur = 1; // eased toward 1.03 while hovering, 1 at rest
                var soloTargetX = 0, soloTargetY = 0;
                var soloCurX = 0, soloCurY = 0;
                var blurScrollScale = 1;
                var blurHoverCur = 1;
                if (fedeSolo) { fedeSolo.style.transformOrigin = 'center bottom'; }

                // Cached bounds for mousemove — refreshed by the scroll listener
                // below (which already measures this rect every scroll frame for
                // its own progress calc, so caching it here adds no extra
                // measurement), on resize, and on entering the "active" zone.
                // Never measured from mousemove itself.
                var wrapRect = fedeWrap.getBoundingClientRect();

                // "Active" = the photo is anywhere near the viewport (generous
                // margin so tracking is already warm by the time it's visible,
                // same spirit as the scroll progress window below). While
                // inactive, mousemove is a single boolean check — no DOM reads,
                // no target updates, no frames requested.
                var aboutActive = false;
                var aboutActiveObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        aboutActive = entry.isIntersecting;
                        if (aboutActive) { wrapRect = fedeWrap.getBoundingClientRect(); wake(); }
                    });
                }, { rootMargin: '100% 0px 100% 0px' });
                aboutActiveObserver.observe(fedeWrap);

                window.addEventListener('resize', function () {
                    if (aboutActive) { wrapRect = fedeWrap.getBoundingClientRect(); }
                }, { passive: true });

                fedeWrap.addEventListener('mouseenter', function () { photoHovering = true; wake(); });
                fedeWrap.addEventListener('mouseleave', function () { photoHovering = false; wake(); });

                document.addEventListener('mousemove', function (e) {
                    if (!aboutActive || !fedeSolo) return;
                    var nx = (e.clientX - (wrapRect.left + wrapRect.width / 2)) / (wrapRect.width / 2);
                    var ny = (e.clientY - (wrapRect.top + wrapRect.height / 2)) / (wrapRect.height / 2);
                    soloTargetX = Math.max(-1, Math.min(1, nx)) * SOLO_MAX_PX;
                    soloTargetY = Math.max(-1, Math.min(1, ny)) * SOLO_MAX_PX;
                    wake();
                }, { passive: true });

                var rafRunning = false;
                var lastSoloStr = null, lastBlurStr = null;
                function tick() {
                    // Gentle chase (0.035) is the whole "mega sutil" feel — the
                    // photo drifts toward the cursor rather than tracking it.
                    soloCurX += (soloTargetX - soloCurX) * 0.035;
                    soloCurY += (soloTargetY - soloCurY) * 0.035;
                    soloHoverCur += ((photoHovering ? 1.03 : 1) - soloHoverCur) * 0.05;
                    blurHoverCur += ((photoHovering ? 0.97 : 1) - blurHoverCur) * 0.05;

                    var changed = false;
                    if (fedeSolo) {
                        var soloStr = 'translate(' + soloCurX.toFixed(2) + 'px, ' + soloCurY.toFixed(2) + 'px) scale(' + (SOLO_SLACK_SCALE * soloScrollScale * soloHoverCur).toFixed(4) + ')';
                        if (soloStr !== lastSoloStr) { fedeSolo.style.transform = soloStr; lastSoloStr = soloStr; changed = true; }
                    }
                    var blurStr = 'scale(' + (blurScrollScale * blurHoverCur).toFixed(4) + ')';
                    if (blurStr !== lastBlurStr) { fedeBlur.style.transform = blurStr; lastBlurStr = blurStr; changed = true; }

                    // Converged: the rounded output (same precision as what's
                    // actually written to the DOM) stopped changing, so another
                    // frame would paint nothing different. Stop requesting frames
                    // until wake() is called again by real input.
                    if (!changed) { rafRunning = false; return; }
                    requestAnimationFrame(tick);
                }
                function wake() {
                    if (rafRunning) return;
                    rafRunning = true;
                    requestAnimationFrame(tick);
                }
                wake(); // apply the initial at-rest transform once

                window.__lenisListen(function({ offset }) {
                    wrapRect = fedeWrap.getBoundingClientRect();
                    const vh = window.innerHeight;
                    const progress = Math.max(0, Math.min(1, (vh - wrapRect.top) / (vh + fedeWrap.offsetHeight)));
                    fedeBlur.style.filter = 'blur(' + (progress * 6) + 'px)';
                    blurScrollScale = 1 + progress * 0.15;
                    if (fedeSolo) {
                        soloScrollScale = 1 - progress * 0.1;
                    }
                    wake();
                });
            }, 800);
        }
        } catch (e) { console.error('[anim] breathe parallax failed:', e); }

        try {
        if (window.innerWidth > 768) {
            // ── Home: pinned stats cycler (50+ Projects / 16+ Years / 20+ Brands) ──
            // Three stacked, independently-tweened items (not a shared textContent
            // swap via .call()) so the crossfade is fully reversible: a .call()-based
            // text swap only fires correctly going forward, and scrubbing backward
            // (or any micro reverse from real scroll/trackpad jitter) left the
            // outgoing stat's text stuck on screen across the wrong segment.
            var statsPinSection = document.getElementById('stats-pin');
            var statsPinItems = statsPinSection ? statsPinSection.querySelectorAll('.stats-pin-item') : null;
            var statsPinCounterCurrent = statsPinSection ? statsPinSection.querySelector('#stats-pin-counter-current') : null;
            var statsPinCounterTotal = statsPinSection ? statsPinSection.querySelector('#stats-pin-counter-total') : null;
            if (statsPinSection && statsPinItems && statsPinItems.length > 1 && statsPinCounterCurrent && statsPinCounterTotal) {
                var padStatsPinCount = function (n) { return n < 10 ? '0' + n : '' + n; };
                statsPinCounterTotal.textContent = padStatsPinCount(statsPinItems.length);
                var setStatsPinCounter = function (i) {
                    statsPinCounterCurrent.textContent = padStatsPinCount(i + 1);
                };

                // ── Approach reveal: the mirror image of how a stat LEAVES during
                // the pin (see the crossfade loop below: outgoing goes
                // { opacity:0, y:-24, filter:'blur(14px)' } with ease power2.in).
                // Reversed for the entrance — starts at that same offset/blur and
                // settles down into place (y:-24 -> 0) as it fades/unblurs in, ease
                // power2.out (the same out-easing the pin's own incoming stat
                // uses). Same y distance and blur amount as the exit, just run
                // backward, so the approach reads as one consistent motion
                // language with the rest of the section instead of a separate,
                // invented style. .stats-pin-bar and the 01/05 counter get the
                // same treatment for consistency.
                // MUST be scroll-scrubbed, not a fixed-duration tween on a toggle:
                // progress is tied directly to scroll position and guaranteed to
                // finish (everything settled) exactly at 'top top' — the same
                // instant the pin timeline below starts controlling
                // .stats-pin-item's own opacity/filter for the stat-to-stat
                // crossfade. A real-time tween firing at that same instant can
                // still be mid-flight on a fast scroll, fighting the pin timeline
                // for the same property and leaving stat 0 visibly stuck on top of
                // stat 1 — scrub rules that out entirely.
                var statsPinBarEl = statsPinSection.querySelector('.stats-pin-bar');
                var statsPinCounterEl = statsPinCounterCurrent ? (statsPinCounterCurrent.closest('.stats-pin-counter') || statsPinCounterCurrent) : null;
                var statsPinApproachTargets = [statsPinItems[0]];
                if (statsPinBarEl) statsPinApproachTargets.push(statsPinBarEl);
                if (statsPinCounterEl) statsPinApproachTargets.push(statsPinCounterEl);
                gsap.set(statsPinApproachTargets, { opacity: 0, y: -24, filter: 'blur(14px)' });
                gsap.to(statsPinApproachTargets, {
                    opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out',
                    // start: 'center bottom' — #stats-pin is a full 100vh section
                    // with its content centered inside, so 'top 80%' was starting
                    // the reveal while the actual visible number/label were still
                    // well below the viewport; by the time they scrolled into view
                    // the tween was already well underway (already visibly
                    // unblurred/opaque). Keying off the section's own vertical
                    // CENTER — where the content actually sits — hitting the
                    // viewport bottom means it starts fully hidden right as it
                    // first appears on screen.
                    scrollTrigger: { trigger: statsPinSection, start: 'center bottom', end: 'top top', scrub: 0.3 }
                });

                var PIN_HOLD = 0.6, PIN_FADE = 0.7, PIN_LAST_HOLD = 1.0;
                var statsPinBoundaries = [];

                // Precompute each item's fully-settled (opacity:1, no blur) time
                // center so scroll can snap to them — otherwise stopping mid-scroll
                // mid-fade leaves a stat frozen half-revealed, with no way forward
                // or back short of scrolling again. PIN_LAST_HOLD pads the timeline
                // AFTER the final stat settles (mirrored in the tween loop below) so
                // that stat's snap point lands before scrollProgress:1 instead of
                // exactly at it — leaving real scroll room where the last stat just
                // sits there, fully visible, before the pin releases into the outro
                // fade (see the separate ScrollTrigger keyed off cycleST.end further
                // down). Without this, the outro started the instant the last stat's
                // fade-in finished.
                var statsPinStableCenters = [PIN_HOLD / 2];
                var precomputeCursor = PIN_HOLD;
                for (var sci = 1; sci < statsPinItems.length; sci++) {
                    precomputeCursor += PIN_FADE + PIN_FADE;
                    if (sci < statsPinItems.length - 1) {
                        statsPinStableCenters.push(precomputeCursor + PIN_HOLD / 2);
                        precomputeCursor += PIN_HOLD;
                    } else {
                        statsPinStableCenters.push(precomputeCursor);
                        precomputeCursor += PIN_LAST_HOLD;
                    }
                }
                var statsPinSnapPoints = statsPinStableCenters.map(function (t) { return t / precomputeCursor; });

                var statsPinTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: statsPinSection,
                        start: 'top top',
                        end: '+=' + (Math.round(90 * statsPinItems.length) + 40) + '%',
                        pin: true,
                        pinType: 'transform',
                        scrub: 0.9,
                        anticipatePin: 1,
                        snap: { snapTo: statsPinSnapPoints, duration: { min: 0.15, max: 0.4 }, delay: 0.05, ease: 'power2.inOut' }
                    },
                    onUpdate: function () {
                        var t = this.time(), active = 0;
                        for (var b = 0; b < statsPinBoundaries.length; b++) { if (t >= statsPinBoundaries[b]) active = b + 1; }
                        setStatsPinCounter(active);
                    }
                });
                var statsPinCursor = PIN_HOLD;
                for (var pi = 1; pi < statsPinItems.length; pi++) {
                    statsPinBoundaries.push(statsPinCursor);
                    var outNum = statsPinItems[pi - 1].querySelector('.stats-pin-num');
                    var outLabel = statsPinItems[pi - 1].querySelector('.stats-pin-label');
                    var inNum = statsPinItems[pi].querySelector('.stats-pin-num');
                    var inLabel = statsPinItems[pi].querySelector('.stats-pin-label');
                    // Opacity/blur stay on the whole item (shared fade), but y moves on
                    // the number and label separately, at different distances — the
                    // number travels further/faster than the label, so they drift out
                    // of sync instead of sliding as one rigid block.
                    // Num rests at y:12 (matches the static translateY(12px) nudge in
                    // fede.css's .stats-pin-num — GSAP writes an inline transform once
                    // it touches this element, which would otherwise silently override
                    // and lose that CSS offset).
                    statsPinTl.to(statsPinItems[pi - 1], { opacity: 0, filter: 'blur(14px)', duration: PIN_FADE, ease: 'power2.in' }, statsPinCursor);
                    if (outNum) statsPinTl.to(outNum, { y: -24, duration: PIN_FADE, ease: 'power2.in' }, statsPinCursor);
                    if (outLabel) statsPinTl.to(outLabel, { y: -14, duration: PIN_FADE, ease: 'power2.in' }, statsPinCursor);
                    statsPinCursor += PIN_FADE;
                    statsPinTl.fromTo(statsPinItems[pi], { opacity: 0, filter: 'blur(14px)' }, { opacity: 1, filter: 'blur(0px)', duration: PIN_FADE, ease: 'power2.out', immediateRender: false }, statsPinCursor);
                    if (inNum) statsPinTl.fromTo(inNum, { y: 48 }, { y: 12, duration: PIN_FADE, ease: 'power2.out', immediateRender: false }, statsPinCursor);
                    if (inLabel) statsPinTl.fromTo(inLabel, { y: 14 }, { y: 0, duration: PIN_FADE, ease: 'power2.out', immediateRender: false }, statsPinCursor);
                    statsPinCursor += PIN_FADE;
                    if (pi < statsPinItems.length - 1) {
                        statsPinCursor += PIN_HOLD;
                    } else {
                        // Empty tween: no property changes, just padding so the
                        // timeline (and therefore the pin) keeps holding on the
                        // final, fully-settled stat for a bit before releasing.
                        statsPinTl.to({}, { duration: PIN_LAST_HOLD }, statsPinCursor);
                        statsPinCursor += PIN_LAST_HOLD;
                    }
                }

                // ── Outro: once the last stat is showing, keep it pinned WITHOUT
                // reserving space (pinSpacing:false) so #works scrolls up and
                // covers it, blurring/fading it out the same way the hero does
                // (filter+opacity driven directly by scroll progress). Pins
                // .stats-pin-inner (the CHILD), not #stats-pin itself — GSAP
                // keeps one pin-spacer per element, so pinning the same node
                // #stats-pin twice (once for the cycle, once for the outro)
                // stomps the first spacer and collapses the whole section's
                // reserved height. The child already fills 100% of the parent,
                // so pinning it with pinSpacing:false reserves exactly the
                // parent's own natural height — no extra space, no layout jump
                // — while #stats-pin itself scrolls away underneath it and
                // #works (its next sibling) paints over it as it does. ──
                var cycleST = statsPinTl.scrollTrigger;
                var statsPinInnerEl = statsPinSection.querySelector('.stats-pin-inner');
                var statsPinContentEl = statsPinSection.querySelector('.stats-pin-content');
                var statsPinOutroDist = Math.round(window.innerHeight * 1.2);
                if (statsPinInnerEl && statsPinContentEl) {
                    ScrollTrigger.create({
                        trigger: statsPinInnerEl,
                        start: function () { return cycleST.end; },
                        end: function () { return cycleST.end + statsPinOutroDist; },
                        pin: true,
                        pinType: 'transform',
                        pinSpacing: false,
                        scrub: true,
                        onUpdate: function (self) {
                            // Styled on .stats-pin-content (a child), not the pinned
                            // .stats-pin-inner itself — GSAP's pinType:'transform'
                            // continuously writes .stats-pin-inner's own transform to
                            // hold it in place, so setting transform there too would
                            // fight that on every tick. Same blur+opacity+upward-drift
                            // combo the hero's own scroll-out uses (theme.js's
                            // HERO STICKY FADE), just written directly since this
                            // section isn't driven by that same listener.
                            statsPinContentEl.style.filter = 'blur(' + (self.progress * 28) + 'px)';
                            statsPinContentEl.style.opacity = 1 - self.progress;
                            statsPinContentEl.style.transform = 'translateY(' + (self.progress * -140) + 'px)';
                        }
                    });
                }
            }
        }
        } catch (e) { console.error('[anim] stats pin cycler failed:', e); }

        try {
        if (window.innerWidth > 768) {
            var extraTitle = document.getElementById('desk-extra'), extraText = document.getElementById('extra-text'), extraImg = document.getElementById('deck-guidelines');
            if (extraTitle) { gsap.to(extraTitle, { y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.4, scrollTrigger: { trigger: '#deck-guidelines-frame', start: 'top 85%', toggleActions: 'play none none none' } }); }
            if (extraText) { gsap.set(extraText, { opacity:0, y:16, filter:'blur(20px)' }); gsap.to(extraText, { opacity:1, y:0, filter:'blur(0px)', duration:2.0, ease:'power3.out', delay:0.3, scrollTrigger: { trigger:'#deck-guidelines-frame', start:'top 70%', toggleActions:'play none none none' } }); }
            var figmaLogo = document.getElementById('figma-logo');
            if (figmaLogo) {
                gsap.set(figmaLogo, { filter:'blur(20px)' });
                gsap.to(figmaLogo, { opacity:1, ease:'none', scrollTrigger: { trigger:'#deck-guidelines-frame', start:'top 80%', end:'top 30%', scrub:1.2 } });
                gsap.to(figmaLogo, { filter:'blur(0px)', duration:1.2, ease:'power3.out', scrollTrigger: { trigger:'#deck-guidelines-frame', start:'top 80%', toggleActions:'play none none none' } });
            }
            if (extraImg) {
                gsap.set(extraImg, { opacity:0, filter:'blur(20px)' });
                gsap.to(extraImg, { opacity:1, filter:'blur(0px)', duration:1.0, ease:'power2.out', delay:0, scrollTrigger: { trigger:'#deck-guidelines-frame', start:'top 95%', toggleActions:'play none none none' } });
                gsap.fromTo(extraImg, { y:'-7%' }, { y:'7%', ease:'none', scrollTrigger: { trigger:'#deck-guidelines-frame', start:'top bottom', end:'bottom top', scrub:true } });
            }

            // ── Services grid items: staggered reveal ──
            var serviceItems = document.querySelectorAll('.services-grid-item');
            var serviceItemsTween = null;
            if (serviceItems.length) {
                gsap.set(serviceItems, { opacity: 0, y: 30, filter: 'blur(20px)' });
                serviceItemsTween = gsap.to(serviceItems, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.services-grid', start: 'top 82%', toggleActions: 'play none none none' } });
            }

            // ── Services connect button: reveal ──
            var servicesBtns = document.querySelector('.services-btns');
            var servicesBtnsTween = null;
            if (servicesBtns) {
                gsap.set(servicesBtns, { opacity: 0, y: 24, filter: 'blur(20px)' });
                servicesBtnsTween = gsap.to(servicesBtns, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.services-btns', start: 'top 88%', toggleActions: 'play none none none' } });
            }

            // Nav "Services" scroll-to (theme.js) lands directly on the section before
            // these two ever cross their own reveal thresholds, so they'd still be
            // sitting hidden/blurred when the scroll arrives. Exposed so that handler
            // can force both straight to their finished state before/at the jump.
            window.__playServicesReveal = function() {
                if (serviceItemsTween) serviceItemsTween.progress(1);
                if (servicesBtnsTween) servicesBtnsTween.progress(1);
            };

            // ── Trusted by logos: reveal (matches project-page image reveal) ──
            var trustedImg = document.getElementById('trusted-logos-img');
            if (trustedImg) {
                gsap.set(trustedImg, { opacity: 0, y: 40, filter: 'blur(20px)' });
                gsap.to(trustedImg, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out', scrollTrigger: { trigger: '#trusted-by-section', start: 'top 85%', toggleActions: 'play none none none' } });
            }


            // ── Extra photo: orange mask fade on hover ──
            var extraMask = document.getElementById('extra-orange-mask');
            var extraFrame = document.getElementById('deck-guidelines-frame');
            if (extraMask && extraFrame) {
                var vcSpans = viewCursorText ? viewCursorText.querySelectorAll('span') : null;
                extraFrame.addEventListener('mouseenter', () => {
                    extraMask.style.transition = 'opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94)'; extraMask.style.opacity = '0';
                    if (vcSpans && vcSpans.length >= 2) { vcSpans[0].textContent = 'OPEN'; vcSpans[1].textContent = 'FIGMA'; }
                    viewCursor.style.width = '70px'; viewCursor.style.height = '70px'; viewCursorText.style.fontSize = '12px';
                });
                extraFrame.addEventListener('mouseleave', () => {
                    extraMask.style.transition = 'opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94)'; extraMask.style.opacity = '1';
                    viewCursor.style.width = '10px'; viewCursor.style.height = '10px'; viewCursorText.style.fontSize = '0px';
                    if (vcSpans && vcSpans.length >= 2) { setTimeout(() => { vcSpans[0].textContent = 'VIEW'; vcSpans[1].textContent = 'MORE'; }, 300); }
                });
            }
            // Layered mouse-follow tilt: image, text and sticker each rotate by a
            // different amount off the SAME cursor position, so they read as three
            // separate floating objects instead of one rigid card. Text also gets the
            // exact scale(1.015) "premium hover" the hero name uses on its own hover —
            // same value, folded into its share of the tilt instead of a separate
            // trigger, since it's now driven continuously rather than on/off.
            // - image: frame itself gets the smallest rotation (0.8). #deck-guidelines
            //   is left untouched — it already has GSAP driving its own transform for
            //   the scroll parallax (y: -7% to 7%) further down, so tilting it too
            //   would fight that every frame. Nested transforms compose, so tilting the
            //   frame a little is enough to read as "the image" moving least.
            // - text (#desk-extra + #extra-text): medium rotation (2.5) + scale(1.015).
            // - sticker (#figma-logo): largest rotation (4), most "floating" of the
            //   three. Retina gives it its own static transform (scale(0.8)
            //   translateX(-20px), see @media (min-resolution:2dppx) above) that a
            //   plain inline overwrite would silently drop on retina screens — prepended
            //   here so hovering there doesn't snap the sticker back to its non-retina
            //   position and size.
            if (extraFrame) {
                var extraTextGroup = [document.getElementById('desk-extra'), document.getElementById('extra-text')];
                var extraSticker = document.getElementById('figma-logo');
                var stickerBase = window.matchMedia('(min-resolution: 2dppx)').matches ? 'scale(0.8) translateX(-20px) ' : '';
                extraFrame.addEventListener('mousemove', (e) => {
                    const rect = extraFrame.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
                    const dx = (e.clientX - cx) / (rect.width / 2), dy = (e.clientY - cy) / (rect.height / 2);
                    extraFrame.style.transform = 'perspective(1200px) rotateX(' + (-dy * 0.8) + 'deg) rotateY(' + (dx * 0.8) + 'deg)';
                    extraFrame.style.transition = 'transform 0.15s ease';
                    extraTextGroup.forEach(el => { if (!el) return; el.style.transform = 'scale(1.015) perspective(1200px) rotateX(' + (-dy * 2.5) + 'deg) rotateY(' + (dx * 2.5) + 'deg)'; el.style.transition = 'transform 0.15s ease'; });
                    if (extraSticker) { extraSticker.style.transform = stickerBase + 'perspective(1200px) rotateX(' + (-dy * 4) + 'deg) rotateY(' + (dx * 4) + 'deg)'; extraSticker.style.transition = 'transform 0.15s ease'; }
                });
                extraFrame.addEventListener('mouseleave', () => {
                    extraFrame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
                    extraFrame.style.transition = 'transform 0.6s cubic-bezier(0.34,1.5,0.9,1)';
                    extraTextGroup.forEach(el => { if (!el) return; el.style.transform = 'scale(1) perspective(1200px) rotateX(0deg) rotateY(0deg)'; el.style.transition = 'transform 0.6s cubic-bezier(0.34,1.5,0.9,1)'; });
                    if (extraSticker) { extraSticker.style.transform = stickerBase + 'perspective(1200px) rotateX(0deg) rotateY(0deg)'; extraSticker.style.transition = 'transform 0.6s cubic-bezier(0.34,1.5,0.9,1)'; }
                });
            }
        }
        } catch (e) { console.error('[anim] deck-guidelines / services-grid / trusted-logos failed:', e); }

        try {
        if (window.innerWidth > 768) {
            var footerOrangeBg = document.getElementById('footer-bg-orange');
            if (footerOrangeBg) {
                gsap.set(footerOrangeBg, { y: 120, filter: 'blur(20px)' });
                gsap.to(footerOrangeBg, { y: 0, ease:'none', scrollTrigger: { trigger:'#contact', start:'top bottom', end:'bottom bottom', scrub:1.2 } });
                gsap.to(footerOrangeBg, { filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger:'#contact', start:'top bottom', toggleActions:'play none none none' } });
            }
        }
        } catch (e) { console.error('[anim] footer orange bg failed:', e); }

        try {
        if (window.innerWidth > 768) {
            const servicesBig = document.querySelector('.services-big');
            if (servicesBig) {
                [['.sb-line1',-180,0.8],['.sb-line2',-120,0.8],['.sb-line3',-70,0.8],['.sb-tag1',-40,0.8],['.sb-tag2',-20,0.8],['.sb-tag3',-8,0.8]].forEach(([sel,y,scrub]) => {
                    const el = servicesBig.querySelector(sel); if (!el) return;
                    gsap.set(el, { filter: 'blur(20px)' });
                    gsap.to(el, { y, ease:'none', scrollTrigger: { trigger:servicesBig, start:'top bottom', end:'bottom top', scrub } });
                    gsap.to(el, { filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger:servicesBig, start:'top bottom', toggleActions:'play none none none' } });
                });
                /* with.svg: very subtle upward drift as the section passes. Gated to
                   match its CSS rules: desktop width (769–2559, retina or not) uses
                   with.svg, UW (>=2560) uses with-uw.svg at any DPI.
                   ADJUST HERE: the y value. The phrase lines move -180/-120/-70, so
                   anything well under -70 reads as slower than the text behind it. */
                const withEl = servicesBig.querySelector('#services-with');
                const isUWWith = window.innerWidth >= 2560;
                const isRetinaWith = !isUWWith && window.matchMedia && window.matchMedia('(min-resolution: 2dppx)').matches;
                const withOnNormalDesktop = window.innerWidth <= 2559;
                if (withEl && isUWWith) withEl.src = withEl.getAttribute('data-src-uw') || withEl.src;
                else if (withEl && isRetinaWith) withEl.src = withEl.getAttribute('data-src-rt') || withEl.src;
                if (withEl && (withOnNormalDesktop || isUWWith)) {
                    /* On UW, .services-big is transform:scale(1.5), which would blow the
                       image up with it. Cancel that here so with-uw.svg renders at exactly
                       its intrinsic size — the file is the single source of truth for how
                       big it is. Has to go through GSAP, not CSS: GSAP rewrites the whole
                       transform on this element and would overwrite a CSS scale. */
                    const withScale = isUWWith ? 1 / 1.5 : 1;
                    // No blur and no opacity work here: it just sits at the CSS resting 0.8.
                    gsap.set(withEl, { xPercent: -50, yPercent: -50, scale: withScale });
                    /* Scrubbed across the whole pass — from the section entering the viewport
                       to it leaving — drifting up and shedding 10% of its size.
                       The end scale is relative to withScale, not a literal 0.9: on UW the base
                       is already 0.6667 (cancelling the container's 1.5x), so a hardcoded 0.9
                       would scale it UP instead of down.
                       ADJUST HERE: the y value and the 0.9 factor. */
                    gsap.to(withEl, { y: -150, scale: withScale * 0.9, ease: 'none',
                        scrollTrigger: { trigger: servicesBig, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
                }
                const sbTagWrap = servicesBig.querySelector('.sb-tag');
                if (sbTagWrap) {
                    gsap.set(sbTagWrap, { scale: 0.85, transformOrigin: 'bottom right', filter: 'blur(20px)' });
                    gsap.to(sbTagWrap, { y: -50, ease:'none', scrollTrigger: { trigger:servicesBig, start:'top bottom', end:'bottom top', scrub:0.8 } });
                    gsap.to(sbTagWrap, { filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger:servicesBig, start:'top bottom', toggleActions:'play none none none' } });
                }
            }
        }
        } catch (e) { console.error('[anim] services-big parallax failed:', e); }

        try {
            /* About UW-only asset swap: same pattern as swapHeroSVGs() above,
               just for the pill + Core artwork. desk-about-me keeps its
               existing id/alt ("story") — only its src changes. */
            if (window.innerWidth >= 2560) {
                var aboutPillEl = document.getElementById('about-pill');
                var aboutStoryEl = document.getElementById('desk-about-me');
                if (aboutPillEl) aboutPillEl.src = './assets/svg/pill-aboutme-uw.svg';
                if (aboutStoryEl) aboutStoryEl.src = './assets/svg/core-uw.svg';
            }
        } catch (e) { console.error('[anim] About UW asset swap failed:', e); }

        try {
            /* Projects UW-only asset swap: same pattern as swapHeroSVGs()/the
               About swap above. #work-them/#desk-work keep their existing
               ids/alt text — only their src changes. */
            if (window.innerWidth >= 2560) {
                var worksPillEl = document.getElementById('work-them');
                var worksTitleEl = document.getElementById('desk-work');
                if (worksPillEl) worksPillEl.src = './assets/svg/pill-afew-uw.svg';
                if (worksTitleEl) worksTitleEl.src = './assets/svg/projects-uw.svg';
            }
        } catch (e) { console.error('[anim] Projects UW asset swap failed:', e); }

        try {
            /* About photo (UW only): width tracks #about-text-col's own
               rendered height so #fede-photo-wrap ends up a perfect square.
               Height already matches via #hola-foto's existing
               align-items:stretch (untouched) — this only supplies the
               matching width, which flexbox has no way to derive on its own
               from a stretched cross-size. ResizeObserver (not a one-time
               read) because the column's real height only settles once the
               pill/title/text images finish loading their real intrinsic
               size, and re-fires again on any later resize. */
            var aboutTextColEl = document.getElementById('about-text-col');
            var aboutPhotoWrapEl = document.getElementById('fede-photo-wrap');
            if (aboutTextColEl && aboutPhotoWrapEl && window.ResizeObserver) {
                var syncAboutPhotoWidth = function () {
                    if (window.innerWidth < 2560) { aboutPhotoWrapEl.style.removeProperty('width'); return; }
                    var h = aboutTextColEl.getBoundingClientRect().height;
                    if (h > 0) aboutPhotoWrapEl.style.setProperty('width', h + 'px', 'important');
                };
                new ResizeObserver(syncAboutPhotoWidth).observe(aboutTextColEl);
                window.addEventListener('resize', syncAboutPhotoWidth, { passive: true });
                syncAboutPhotoWidth();
            }
        } catch (e) { console.error('[anim] About photo width-sync failed:', e); }

        try {
        if (window.innerWidth > 768) {
            /* Mouse-driven sway for the three services-big phrase lines, ported from the
               hero name's own velocity-driven sway (#line-federico/#line-vaccarezza — see
               the hero-craft "Ink Shift" block: nameLines/NAME_RATIO/driveLoop). Same
               constants, same velocity -> clamp -> dual-rate-ease -> average pipeline;
               only the trigger differs (.services-big's own rect, not #hero-craft's —
               Services has no craft artwork/echo trail, so there's nothing to key off of
               there, and the user asked to port only the name-sway piece, not the ghost
               echoes or the counter-motion). If the hero's numbers ever change, update
               both here and there — not centralized, same reasoning as the scale-hover
               comment above.
               DEV NOTE (do not change without updating both): VELOCITY_GAIN, MAX_X,
               Y_INFLUENCE, MAX_Y, ratio, decay, ease rates, and idle amplitudes below are
               a byte-for-byte copy of the hero's own VELOCITY_GAIN/MAX_X/Y_INFLUENCE/
               MAX_Y/NAME_RATIO and driveLoop math. */
            const swayEls = Array.prototype.slice.call(document.querySelectorAll('.services-big .sb-line-sway'));
            const servicesBigEl = document.querySelector('.services-big');
            if (swayEls.length && servicesBigEl) {
                const VELOCITY_GAIN = 26, MAX_X = 11, Y_INFLUENCE = 0.6, MAX_Y = MAX_X * Y_INFLUENCE;
                const RATIO = 0.07;
                function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
                let velX = 0, velY = 0;
                let lastMoveX = null, lastMoveY = null, lastMoveT = 0;
                let curAx = 0, curAy = 0, curBx = 0, curBy = 0;
                let hovering = false, raf = 0;

                function onEnter(x, y) {
                    hovering = true;
                    lastMoveX = x; lastMoveY = y; lastMoveT = performance.now();
                    velX = 0; velY = 0;
                    gsap.killTweensOf(swayEls);
                    if (!raf) raf = requestAnimationFrame(driveLoop);
                }
                function onMove(x, y) {
                    const now = performance.now();
                    const dt = Math.max(now - lastMoveT, 1);
                    velX = (x - lastMoveX) / dt;
                    velY = (y - lastMoveY) / dt;
                    lastMoveX = x; lastMoveY = y; lastMoveT = now;
                }
                function onLeave() {
                    hovering = false;
                    velX = 0; velY = 0;
                    gsap.killTweensOf(swayEls);
                    gsap.to(swayEls, { x: 0, y: 0, duration: 0.4, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' });
                    curAx = curAy = curBx = curBy = 0;
                }
                function driveLoop(ts) {
                    if (!hovering) { raf = 0; return; }
                    velX *= 0.82; velY *= 0.82;

                    const idlePhase = ts * 0.0011;
                    const idleX = Math.sin(idlePhase) * 0.35;
                    const idleY = Math.cos(idlePhase * 0.7) * 0.15;

                    const targetAx = clamp(velX * VELOCITY_GAIN, -MAX_X, MAX_X) + idleX;
                    const targetAy = clamp(velY * VELOCITY_GAIN * Y_INFLUENCE, -MAX_Y, MAX_Y) + idleY;
                    const targetBx = clamp(velX * VELOCITY_GAIN * 1.2, -MAX_X * 1.2, MAX_X * 1.2) + idleX * 1.3;
                    const targetBy = clamp(velY * VELOCITY_GAIN * Y_INFLUENCE * 1.2, -MAX_Y * 1.2, MAX_Y * 1.2) + idleY * 1.3;

                    curAx += (targetAx - curAx) * 0.16;
                    curAy += (targetAy - curAy) * 0.16;
                    curBx += (targetBx - curBx) * 0.10;
                    curBy += (targetBy - curBy) * 0.10;

                    const ghostX = (curAx + curBx) * 0.5;
                    const ghostY = (curAy + curBy) * 0.5;
                    gsap.set(swayEls, { x: (ghostX * RATIO).toFixed(2) + 'px', y: (ghostY * RATIO).toFixed(2) + 'px' });

                    raf = requestAnimationFrame(driveLoop);
                }

                document.addEventListener('mousemove', function (e) {
                    const r = servicesBigEl.getBoundingClientRect();
                    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
                    if (inside && !hovering) onEnter(e.clientX, e.clientY);
                    else if (inside && hovering) onMove(e.clientX, e.clientY);
                    else if (!inside && hovering) onLeave();
                }, { passive: true });
            }
        }
        } catch (e) { console.error('[anim] services-big name sway failed:', e); }

        try {
        const testiTag = document.querySelector('.desktop-testi-tag');
        if (testiTag) {
            const testiWrap = document.querySelector('.desktop-testi-wrap');
            const pillImg = testiTag.querySelector('img');
            if (pillImg) {
                gsap.set(pillImg, { y: 20, x: 0, opacity: 0, filter: 'blur(20px)', force3D:false });
                gsap.to(pillImg, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 1.2, delay: 0, force3D:false, scrollTrigger: { trigger: testiWrap, start: 'top 85%', toggleActions: 'play none none none' } });
            }
        }
        } catch (e) { console.error('[anim] testi tag pill failed:', e); }

        // ── FAQ title: one-time parallax reveal, then staggered questions ──
        try {
        if (window.innerWidth > 768) {
            const faqLines = document.querySelectorAll('.faq-title-line');
            const faqQuestions = document.querySelectorAll('#faq-section .faq-question');
            const faqPill1 = document.getElementById('faq-pill-1');
            if (faqPill1) { gsap.set(faqPill1, { x: '-110%', filter: 'blur(20px)' }); gsap.to(faqPill1, { x: 0, filter: 'blur(0px)', duration: 2.6, ease: 'power3.out', delay: 0, scrollTrigger: { trigger: '#faq-section', start: 'top 78%', toggleActions: 'play none none none' } }); }
            faqLines.forEach((el, i) => {
                const img = el.parentElement ? el.parentElement.querySelector('.faq-title-img') : null;
                const targets = img ? [el, img] : el;
                gsap.set(targets, { filter: 'blur(20px)' });
                gsap.to(targets, {
                    x: 0, filter: 'blur(0px)', duration: 1.7, ease: 'power3.out', delay: i * 0.15,
                    scrollTrigger: { trigger: '#faq-section', start: 'top 78%', toggleActions: 'play none none none' }
                });
            });
            // ── FAQ section: questions staggered reveal ──
            faqQuestions.forEach(function(q, j) {
                gsap.to(q, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out', delay: 0.4 + j * 0.22, scrollTrigger: { trigger: '#faq-section', start: 'top 78%', toggleActions: 'play none none none' } });
            });

            const faqLines2 = document.querySelectorAll('.faq-title-line-2');
            const processSteps = document.querySelectorAll('.process-step');
            const processLine = document.getElementById('process-line');
            const processDots = document.querySelectorAll('.process-dot');
            const faqPill2 = document.getElementById('faq-pill-2');
            if (faqPill2) { gsap.set(faqPill2, { x: '110%', filter: 'blur(20px)' }); gsap.to(faqPill2, { x: 0, filter: 'blur(0px)', duration: 2.6, ease: 'power3.out', delay: 0, scrollTrigger: { trigger: '#faq-section-2', start: 'top 78%', toggleActions: 'play none none none' } }); }
            faqLines2.forEach((el, i) => {
                const img = el.parentElement ? el.parentElement.querySelector('.faq-title-img') : null;
                const targets2 = img ? [el, img] : el;
                gsap.set(targets2, { filter: 'blur(20px)' });
                gsap.to(targets2, {
                    x: 0, filter: 'blur(0px)', duration: 1.7, ease: 'power3.out', delay: i * 0.15,
                    scrollTrigger: { trigger: '#faq-section-2', start: 'top 78%', toggleActions: 'play none none none' }
                });
            });
            let positionProcessLine = null;
            if (processLine && processDots.length > 1) {
                const wrap = processLine.parentElement;
                positionProcessLine = () => {
                    const wrapRect = wrap.getBoundingClientRect();
                    const firstRect = processDots[0].getBoundingClientRect();
                    const lastRect = processDots[processDots.length - 1].getBoundingClientRect();
                    processLine.style.left = (firstRect.left + firstRect.width / 2 - wrapRect.left - processLine.offsetWidth / 2) + 'px';
                    processLine.style.top = (firstRect.top + firstRect.height / 2 - wrapRect.top) + 'px';
                    processLine.style.height = ((lastRect.top + lastRect.height / 2) - (firstRect.top + firstRect.height / 2)) + 'px';
                };
                positionProcessLine();
                window.addEventListener('resize', positionProcessLine);
                if (window.ResizeObserver) new ResizeObserver(positionProcessLine).observe(wrap);
                gsap.set(processLine, { filter: 'blur(20px)' });
                gsap.to(processLine, { scaleY: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.inOut', delay: 0.6, scrollTrigger: { trigger: '#faq-section-2', start: 'top 78%', toggleActions: 'play none none none' } });
            }
            processSteps.forEach((step, j) => {
                gsap.to(step, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out', delay: 0.5 + j * 0.2, scrollTrigger: { trigger: '#faq-section-2', start: 'top 78%', toggleActions: 'play none none none' }, onUpdate: () => { if (positionProcessLine) positionProcessLine(); } });
            });
        }
        } catch (e) { console.error('[anim] FAQ / process steps failed:', e); }
    }

    try {
        // Mobile-only project card parallax — EXACT same structure as the
        // mobile testimonials photo drift below, not just the same numbers:
        // one shared trigger (.gallery) for every card, not a separate
        // trigger per card. A per-card trigger meant each card only ever
        // animated during ITS OWN scroll entry — at any moment only one or
        // two cards near the viewport edge were moving while the rest sat
        // static, which read as individual cards floating rather than the
        // whole stack fanning out together like testimonials does. Doesn't
        // touch opacity: the existing one-time reveal (.gallery .card.in-view,
        // CSS-driven) still owns the fade-in; this only adds a continuous
        // translateY on top of whatever that leaves the card at.
        if (window.innerWidth <= 768) {
            const accordionCards = Array.from(document.querySelectorAll('.gallery .card'));
            const CARD_DRIFT_PX = [-45, -22, 0, 22, 45];
            accordionCards.forEach((card, i) => {
                gsap.fromTo(card,
                    { y: -CARD_DRIFT_PX[i % CARD_DRIFT_PX.length] },
                    {
                        y: CARD_DRIFT_PX[i % CARD_DRIFT_PX.length],
                        ease: 'sine.inOut',
                        scrollTrigger: {
                            trigger: '.gallery',
                            start: 'top 95%',
                            end: 'bottom 25%',
                            scrub: 0.4 + i * 0.5,
                        },
                    }
                );
            });
        }
    } catch (e) { console.error('[anim] mobile project card parallax failed:', e); }

    try {
        // Mobile-only testimonial photo parallax: straight (no tilt — the
        // rotated version didn't land, this is just the scroll-linked drift
        // kept and pushed further), each photo traveling a different
        // distance so the stack fans apart more noticeably as you scroll
        // past instead of every photo moving in lockstep.
        if (window.innerWidth <= 768) {
            // Midpoint between the first (±24) and second (±70) pass, and
            // sine.inOut instead of linear ('none') — on a scrubbed tween the
            // ease reshapes how scroll PROGRESS maps to position instead of
            // time, so this eases the drift in and out smoothly (slow start,
            // fast middle, slow finish) instead of moving at a constant rate
            // the whole way — reads as a gliding slide rather than a
            // scroll-locked drag.
            const testiImgsForTilt = Array.from(document.querySelectorAll('.mobile-testimonials img'));
            const DRIFT_PX = [-45, -22, 0, 22, 45];
            testiImgsForTilt.forEach((img, i) => {
                gsap.fromTo(img,
                    { y: -DRIFT_PX[i % DRIFT_PX.length] },
                    {
                        y: DRIFT_PX[i % DRIFT_PX.length],
                        ease: 'sine.inOut',
                        scrollTrigger: {
                            trigger: '.mobile-testimonials',
                            start: 'top 95%',
                            end: 'bottom 25%',
                            // scrub:true (no lag) had every photo tracking scroll
                            // at the exact same rate — different travel distance
                            // but identical timing reads as "moving together".
                            // A per-photo scrub NUMBER staggers them in time
                            // too, not just in distance.
                            scrub: 0.4 + i * 0.5,
                        },
                    }
                );
            });
        }
    } catch (e) { console.error('[anim] mobile testimonials photo pile failed:', e); }
});
