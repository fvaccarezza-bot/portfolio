// Table of Content
// =================
// Detect browser
// Detect mobile device
// Page transitions
// Smooth Scrollbar
// Image lazy loading
// Header tools
// Main menu (classic)
// Overlay menu
// tt-Search
// Portfolio slider (full screen slider)
// Portfolio carousel (full screen carousel)
// Portfolio hover carousel (full screen carousel)
// Content carousel
// Testimonials slider
// Isotope
// lightGallery (lightbox plugin)
// Page header
// GSAP ScrollTrigger plugin
// Portfolio list
// Portfolio interactive
// Portfolio grid
// tt-Gallery
// tt-Accordion
// tt-Tabs
// Page nav
// Sidebar
// Sliding sidebar
// Scrolling text
// Scroll between anchors
// Scroll to top
// Defer videos (Youtube, Vimeo)
// Forms
// Magic cursor
// Miscellaneous
//

(function ($) {
   'use strict';

   // ========================================
   // Detect browser and add class to </body>
   // ========================================

   let firefoxAgent = navigator.userAgent.indexOf('Firefox') > -1;
   if (firefoxAgent) { $('body').addClass('is-firefox'); }

   // ── Detect mobile device ──
   // NOTE: navigator.maxTouchPoints alone is unreliable on desktop machines —
   // many laptops/desktops (especially Macs and Windows touchpads) report
   // maxTouchPoints > 0 even though they are not touch/mobile devices.
   // We now combine it with (pointer: coarse) and viewport width so that
   // desktop trackpads/retina displays are not misclassified as mobile.
   var isMobile = false;
   const coarsePointer = !!matchMedia?.('(pointer:coarse)')?.matches;
   if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) {
      isMobile = coarsePointer && window.innerWidth <= 1024;
   } else if ('msMaxTouchPoints' in navigator && navigator.msMaxTouchPoints > 0) {
      isMobile = coarsePointer && window.innerWidth <= 1024;
   } else {
      const mQ = matchMedia?.('(pointer:coarse)');
      if (mQ?.media === '(pointer:coarse)') { isMobile = !!mQ.matches && window.innerWidth <= 1024; }
      else if ('orientation' in window) { isMobile = window.innerWidth <= 1024; }
      else { isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini|Tablet|Mobile/i.test(navigator.userAgent); }
   }
   if (isMobile) { $('body').addClass('is-mobile'); }

   // =================
   // Page transitions
   // =================

   if ($('body').hasClass('tt-transition')) {
      $(window).on('load', function () { setTimeout(function () { HideLoad(); }, 0); });

      function RevealLoad() {
         var tl_transitIn = gsap.timeline({ defaults: { duration: 1, ease: Expo.easeInOut } });
         tl_transitIn.set('#page-transition', { autoAlpha: 1 });
         tl_transitIn.to('.ptr-overlay', { scaleY: 1, transformOrigin: 'center bottom' }, 0);
         tl_transitIn.to('#content-wrap', { y: -80, autoAlpha: 0 }, 0);
         tl_transitIn.to('#tt-header', { y: -20, autoAlpha: 0 }, 0);
         tl_transitIn.to('.ptr-preloader', { autoAlpha: 1 }, 0.4);
      }

      function HideLoad() {
         var tl_transitOut = gsap.timeline();
         tl_transitOut.to('.ptr-preloader', { duration: 1, autoAlpha: 0, ease: Expo.easeInOut });
         tl_transitOut.to('.ptr-overlay', { duration: 1, scaleY: 0, transformOrigin: 'center top', ease: Expo.easeInOut }, 0.3);
         tl_transitOut.from('#tt-header', { duration: 1, y: 20, autoAlpha: 0, ease: Expo.easeInOut, clearProps: 'all' }, 0.6);
         if ($('.ph-image').length) {
            if ($('#page-header').hasClass('ph-bg-image')) {
               tl_transitOut.from('.ph-image img, .ph-video', { duration: 1.5, y: 80, autoAlpha: 0, stagger: 0.3, ease: Expo.easeOut, clearProps: 'all' }, 0.8);
            } else {
               tl_transitOut.from('.ph-image', { duration: 1.5, y: 80, autoAlpha: 0, stagger: 0.3, ease: Expo.easeOut, clearProps: 'all' }, 1.2);
            }
         }
         if ($('.ph-appear').length) { tl_transitOut.from('.ph-appear', { duration: 0.3, y: 60, autoAlpha: 0, stagger: 0.3, ease: Expo.easeOut, clearProps: 'all' }, 0.3); }
         if ($('#page-header .project-info-list').length) {
            if ($('#page-header').hasClass('ph-inline')) {
               tl_transitOut.from('#page-header .project-info-list > ul > li', { duration: 1.5, y: 80, autoAlpha: 0, stagger: 0.15, ease: Expo.easeOut, clearProps: 'all' }, 2.2);
            } else {
               tl_transitOut.from('#page-header .project-info-list > ul', { duration: 1.5, y: 80, autoAlpha: 0, ease: Expo.easeOut, clearProps: 'all' }, 2.2);
            }
         }
         if ($('.tt-psc-elem').length) {
            $('.tt-psc-elem').wrap('<div class="tt-ps-appear"></div>');
            tl_transitOut.from('.tt-ps-appear', { duration: 1.5, y: 80, autoAlpha: 0, stagger: 0.3, ease: Expo.easeOut, clearProps: 'all' }, 1.4);
         }
         if ($('.tt-pci-title').length) { tl_transitOut.from('.tt-pci-title', { duration: 1.5, x: 80, autoAlpha: 0, skewX: '-10deg', ease: Expo.easeOut, clearProps: 'all' }, 1.4); }
         if ($('.tt-pci-category').length) { tl_transitOut.from('.tt-pci-category', { duration: 1.5, x: 80, autoAlpha: 0, ease: Expo.easeOut, clearProps: 'all' }, 1.5); }
         var $portfolioHoverCarousel = $('.tt-portfolio-hover-carousel');
         var $portfolioHoverCarouselItem = $portfolioHoverCarousel.find('.swiper-slide-visible').find('.tt-phc-item');
         var $portfolioHoverCarouselCounter = $('.tt-phc-counter');
         if ($portfolioHoverCarousel.length) {
            if ($portfolioHoverCarouselItem.length) { tl_transitOut.from($portfolioHoverCarouselItem, { duration: 2, autoAlpha: 0, y: 80, stagger: 0.2, ease: Expo.easeOut, clearProps: 'all' }, 1.4); }
            if ($portfolioHoverCarouselCounter.length) { tl_transitOut.from($portfolioHoverCarouselCounter, { duration: 2, y: 20, autoAlpha: 0, ease: Expo.easeInOut, clearProps: 'all' }, 0.4); }
            setTimeout(function () { $portfolioHoverCarousel.addClass('tt-phc-ready'); }, 2000);
         }
         tl_transitOut.from('#page-content', { duration: 1.5, autoAlpha: 0, y: 80, ease: Expo.easeOut, clearProps: 'all' }, 0.8);
         tl_transitOut.set('#page-transition', { duration: 1, autoAlpha: 0, ease: Expo.easeInOut });
      }

      window.onpageshow = function (event) { if (event.persisted) { window.location.reload(); } };

      $('a').not('[target="_blank"]').not('[href^="#"]').not('[href^="mailto"]').not('[href^="tel"]').not('.lg-trigger').not('.tt-btn-disabled a').not('.no-transition').on('click', function (e) {
         e.preventDefault();
         setTimeout(function (url) { window.location = url; }, 1000, this.href);
         RevealLoad();
      });
   }

   // =======================================================================================
   // Smooth Scrollbar
   // =======================================================================================

   if ($('body').hasClass('tt-smooth-scroll')) {
      if (!isMobile) {
         var Scrollbar = window.Scrollbar;
         class AnchorPlugin extends Scrollbar.ScrollbarPlugin {
            static pluginName = 'anchor';
            onHashChange = () => { this.jumpToHash(window.location.hash); };
            onClick = (event) => {
               const { target } = event;
               if (target.tagName !== 'A') { return; }
               const hash = target.getAttribute('href');
               if (!hash || hash.charAt(0) !== '#') { return; }
               this.jumpToHash(hash);
            };
            jumpToHash = (hash) => {
               if (!hash) { return; }
               const { scrollbar } = this;
               scrollbar.containerEl.scrollTop = 0;
               const target = document.querySelector(hash);
               if (target) { scrollbar.scrollIntoView(target, { offsetTop: parseFloat(target.getAttribute('data-offset')) || 0 }); }
            };
            onInit() {
               this.jumpToHash(window.location.hash);
               window.addEventListener('hashchange', this.onHashChange);
               this.scrollbar.contentEl.addEventListener('click', this.onClick);
            }
            onDestory() {
               window.removeEventListener('hashchange', this.onHashChange);
               this.scrollbar.contentEl.removeEventListener('click', this.onClick);
            }
         }
         Scrollbar.use(AnchorPlugin);
         Scrollbar.init(document.querySelector('#scroll-container'), { damping: 0.06, renderByPixel: true, continuousScrolling: true, alwaysShowTracks: true });
         let scrollPositionX = 0, scrollPositionY = 0, bodyScrollBar = Scrollbar.init(document.getElementById('scroll-container'));
         bodyScrollBar.addListener(({ offset }) => { scrollPositionX = offset.x; scrollPositionY = offset.y; });
         bodyScrollBar.setPosition(0, 0);
         bodyScrollBar.track.xAxis.element.remove();
         ScrollTrigger.scrollerProxy('body', { scrollTop(value) { if (arguments.length) { bodyScrollBar.scrollTop = value; } return bodyScrollBar.scrollTop; } });
         bodyScrollBar.addListener(ScrollTrigger.update);

         // ── HERO STICKY FADE (solo home, solo desktop) ──
         var $pageHeader = $('#page-header');
         if ($pageHeader.length && $('body').hasClass('home')) {
            $pageHeader.prependTo($('#body-inner'));
            $pageHeader.css({ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 0 });
            $('#content-wrap').css({ position: 'relative', zIndex: 1, marginTop: ($pageHeader.outerHeight() * 1.0) + 'px' });
            bodyScrollBar.addListener(function(status) {
               var scrollY = status.offset.y;
               var heroH = $pageHeader.outerHeight();
               var progress = Math.min(scrollY / (heroH * 18), 1);
               $pageHeader[0].style.filter = 'blur(' + (progress * 28) + 'px)';
               $pageHeader[0].style.opacity = 1 - progress * 1.0;
               var heroProgress = Math.min(scrollY / (heroH * 20), 1);
               $pageHeader[0].style.transform = 'translateY(' + (heroProgress * heroH * -0.5) + 'px)';
               var contentWrap = document.getElementById('content-wrap');
               if (contentWrap) {
                  var cwProgress = Math.min(scrollY / (heroH * 18), 1);
                  contentWrap.style.transform = 'translateY(' + (cwProgress * heroH * -0.7) + 'px)';
               }
            });
         }

         if ($('#tt-header').hasClass('tt-header-fixed')) { $('#tt-header').prependTo($('#body-inner')); }
         if ($('.tt-overflow').length) {
            $.fn.ttIsScrollable = function () { return this[0].scrollWidth > this[0].clientWidth || this[0].scrollHeight > this[0].clientHeight; };
            $('.tt-overflow').each(function () { var $this = $(this); if ($this.ttIsScrollable()) { $this.on('wheel', function (e) { e.stopPropagation(); }); } });
         }
         $('input[type=number]').on('focus', function () { $(this).on('wheel', function (e) { e.stopPropagation(); }); });
      }
   }

   // ==================================================
   // Image lazy loading
   // ==================================================

   ScrollTrigger.config({ limitCallbacks: true });
   gsap.utils.toArray('.tt-lazy').forEach((image) => {
      let newSRC = image.dataset.src, newImage = document.createElement("img"),
         loadImage = () => {
            newImage.onload = () => {
               newImage.onload = null; newImage.src = image.src; image.src = newSRC;
               gsap.set(newImage, { position: "absolute", top: image.offsetTop, left: image.offsetLeft, width: image.offsetWidth, height: image.offsetHeight });
               image.parentNode.appendChild(newImage);
               gsap.to(newImage, { opacity: 0, onComplete: () => { newImage.parentNode.removeChild(newImage); image.removeAttribute("data-src"); } });
               st && st.kill();
            };
            newImage.src = newSRC;
            ScrollTrigger.refresh(true);
         },
         st = ScrollTrigger.create({ trigger: image, start: "-50% bottom", onEnter: loadImage, onEnterBack: loadImage });
   });

   // ==================================
   // Header tools
   // ==================================

   if ($('.tt-header-tools').length) {
      $('body').addClass('tt-header-tools-on');
      if ($('.tt-header-tools-dynamic').length) {
         $('body').addClass('tt-header-tools-dynamic-on');
         function headerToolsPosition() {
            if (window.matchMedia('(max-width: 768px)').matches) { $('.tt-header-tools-dynamic').prependTo('#body-inner'); }
            else { $('.tt-header-tools-dynamic').prependTo('.tt-header-tools'); }
         }
         headerToolsPosition();
         $(window).resize(function () { headerToolsPosition(); });
      }
   }

   // ==================================================
   // Main menu (classic)
   // ==================================================

   if ($(window).width() > 1200) {
      $('.tt-submenu-trigger').parent().on('mouseenter', function () {
         var menu = $('> .tt-submenu', this); var menupos = $(menu).offset();
         if (menupos.left + menu.width() > $(window).width()) { var newpos = -$(menu).width(); menu.css({ left: newpos }); }
      });
   }
   $('.tt-main-menu-list').on('mouseenter', function () { $(this).addClass('tt-mm-hover'); }).on('mouseleave', function () { $(this).removeClass('tt-mm-hover'); });
   $('.tt-submenu-wrap').on('mouseenter', function () { $(this).addClass('tt-submenu-open'); }).on('mouseleave', function () { $(this).removeClass('tt-submenu-open'); });

   $('#tt-m-menu-toggle-btn-wrap').on('click', function () {
      $('html').toggleClass('tt-no-scroll');
      $('body').toggleClass('tt-m-menu-open');
      if ($('body').hasClass('tt-m-menu-open')) {
         $('body').addClass('tt-m-menu-toggle-no-click');
         var tl_MenuIn = gsap.timeline({ onComplete: function () { $('body').removeClass('tt-m-menu-toggle-no-click'); } });
         tl_MenuIn.to('.tt-main-menu', { duration: 0.4, autoAlpha: 1 });
         tl_MenuIn.from('.tt-main-menu-content > ul > li', { duration: 0.4, y: 80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeOut, clearProps: 'all' });
         $('.tt-main-menu a, .tt-logo a').not('[target="_blank"]').not('[href="#"]').not('[href^="mailto"]').not('[href^="tel"]').on('click', function () {
            $('body').addClass('tt-m-menu-toggle-no-click');
            gsap.set('#content-wrap', { autoAlpha: 0 });
            gsap.to('.tt-main-menu-content > ul > li', { duration: 0.4, y: -80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeIn });
            gsap.set('#content-wrap, .ttgr-cat-nav', { autoAlpha: 0 });
            var tl_MenuClick = gsap.timeline({ onComplete: function () { $('.tt-submenu').slideUp(350); $('.tt-submenu-trigger').removeClass('tt-m-submenu-open'); $('html').removeClass('tt-no-scroll'); $('body').removeClass('tt-m-menu-toggle-no-click'); } });
            tl_MenuClick.to('.tt-main-menu-list > li', { duration: 0.4, y: -80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeIn });
            tl_MenuClick.to('#content-wrap, .ttgr-cat-nav', { duration: 0.4, autoAlpha: 1, clearProps: 'all' });
            tl_MenuClick.to('.tt-main-menu', { duration: 0.4, autoAlpha: 0 });
            tl_MenuClick.set('.tt-main-menu-list > li', { clearProps: 'all' });
            setTimeout(function () { $('body').removeClass('tt-m-menu-open'); }, 500);
         });
      } else {
         $('body').addClass('tt-m-menu-toggle-no-click');
         var tl_MenuOut = gsap.timeline({ onComplete: function () { $('.tt-submenu').slideUp(350); $('.tt-submenu-trigger').removeClass('tt-m-submenu-open'); $('body').removeClass('tt-m-menu-toggle-no-click'); } });
         tl_MenuOut.to('.tt-main-menu-content > ul > li', { duration: 0.4, y: -80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeIn });
         tl_MenuOut.to('.tt-main-menu', { duration: 0.4, autoAlpha: 0, clearProps: 'all' }, '+=0.2');
         tl_MenuOut.set('.tt-main-menu-content > ul > li', { clearProps: 'all' });
      }
      return false;
   });

   $('.tt-submenu-trigger > a[href="#"]').parent('.tt-submenu-trigger').append('<span class="tt-submenu-trigger-m"></span>');
   if ($('.tt-submenu-trigger > a').is('[href="#"]')) {
      $('.tt-submenu-trigger-m').on('click', function () {
         var $this = $(this).parent();
         if ($this.hasClass('tt-m-submenu-open')) { $this.removeClass('tt-m-submenu-open'); $this.next().slideUp(350); }
         else { $this.parent().parent().find('.tt-submenu').prev().removeClass('tt-m-submenu-open'); $this.parent().parent().find('.tt-submenu').slideUp(350); $this.toggleClass('tt-m-submenu-open'); $this.next().slideToggle(350); }
      });
   }
   $('.tt-submenu-trigger').append('<span class="tt-m-caret"></span>');
   $('.tt-m-caret').on('click', function () {
      var $this = $(this).parent();
      if ($this.hasClass('tt-m-submenu-open')) { $this.removeClass('tt-m-submenu-open'); $this.next().slideUp(350); }
      else { $this.parent().parent().find('.tt-submenu').prev().removeClass('tt-m-submenu-open'); $this.parent().parent().find('.tt-submenu').slideUp(350); $this.toggleClass('tt-m-submenu-open'); $this.next().slideToggle(350); }
   });

   // ==================================================
   // Overlay menu
   // ==================================================

   if ($('#tt-header').hasClass('tt-header-fixed')) { $('body').addClass('tt-header-fixed-on'); }

   var $olMenuToggleBtn = $('.tt-ol-menu-toggle-btn-text, .tt-ol-menu-toggle-btn');

   $olMenuToggleBtn.on('click', function () {
      $('html').toggleClass('tt-no-scroll');
      $('body').toggleClass('tt-ol-menu-open');

      var isMob = window.innerWidth <= 768;

      if ($('body').hasClass('tt-ol-menu-open')) {
         $('body').addClass('olm-toggle-no-click');

         var tl_olMenuIn = gsap.timeline({
            onComplete: function () { $('body').removeClass('olm-toggle-no-click'); }
         });

         if (isMob) {
            gsap.set('.tt-overlay-menu', { y: '100%', autoAlpha: 1 });
            tl_olMenuIn.to('.tt-overlay-menu', { duration: 1.0, y: '0%', ease: 'power4.out' });
            tl_olMenuIn.from('.tt-ol-menu-list > li', { duration: 0.35, y: 24, autoAlpha: 0, stagger: 0.05, ease: 'power3.out', clearProps: 'all' }, '-=0.3');
         } else {
            tl_olMenuIn.to('.tt-overlay-menu', { duration: 0.7, autoAlpha: 1, ease: 'power3.out' });
            tl_olMenuIn.from('.tt-ol-menu-list > li', { duration: 0.7, y: 80, autoAlpha: 0, stagger: 0.07, ease: 'power3.out', clearProps: 'all' }, '-=0.4');
         }

         $('.tt-overlay-menu a, .tt-logo a').not('[target="_blank"]').not('[href="#"]').not('[href^="mailto"]').not('[href^="tel"]').on('click', function () {
            $('body').addClass('olm-toggle-no-click');
            var $clickedHref = $(this).attr('href') || $(this).data('href') || null;
            var $clickedOffset = $(this).data('offset') || 0;
            gsap.set('#content-wrap, .ttgr-cat-nav', { autoAlpha: 0 });
            var tl_olMenuClick = gsap.timeline({
               onComplete: function () {
                  $('.tt-ol-submenu').hide().css('height', '');
                  $('.tt-ol-submenu-trigger').removeClass('tt-ol-submenu-open');
                  $('.tt-ol-submenu-trigger > a').css('color', '');
                  $('html').removeClass('tt-no-scroll');
                  $('body').removeClass('olm-toggle-no-click');
                  $('body').removeClass('tt-ol-menu-open');
                  if (isMob && $clickedHref && $clickedHref.charAt(0) === '#') {
                     setTimeout(function() {
                        var $target = $($clickedHref);
                        if ($target.length) {
                           var offset = parseInt($clickedOffset) || 0;
                           var topY;
                           if (offset <= -9000) { topY = document.body.scrollHeight; }
                           else if (offset >= 9000) { topY = 0; }
                           else { topY = $target.offset().top - $('body').offset().top - offset; }
                           $('html,body').animate({ scrollTop: topY }, 500);
                        }
                     }, 50);
                  }
               }
            });
            tl_olMenuClick.to('.tt-ol-menu-list > li', { duration: 0.3, y: -30, autoAlpha: 0, stagger: 0.04, ease: 'power2.in' });
            tl_olMenuClick.to('#content-wrap, .ttgr-cat-nav', { duration: 0.4, autoAlpha: 1, clearProps: 'all' });
            if (isMob) {
               tl_olMenuClick.to('.tt-overlay-menu', { duration: 0.7, y: '-100%', ease: 'power4.in', clearProps: 'all' }, '-=0.2');
            } else {
               tl_olMenuClick.to('.tt-overlay-menu', { duration: 0.6, autoAlpha: 0, ease: 'power3.in', clearProps: 'all' }, '-=0.2');
            }
            tl_olMenuClick.set('.tt-ol-menu-list > li', { clearProps: 'all' });
            if (isMob && $clickedHref && $clickedHref.charAt(0) === '#') { return false; }
         });

         if ($('.tt-sliding-sidebar-wrap').length) { gsap.to('.tt-sliding-sidebar-trigger', { duration: 1, autoAlpha: 0, ease: Expo.easeOut }); }

      } else {
         $('body').addClass('olm-toggle-no-click');

         var tl_olMenuOut = gsap.timeline({
            onComplete: function () {
               $('body').removeClass('olm-toggle-no-click');
               $('.tt-ol-submenu').hide().css('height', '');
               $('.tt-ol-submenu-trigger').removeClass('tt-ol-submenu-open');
               $('.tt-ol-submenu-trigger > a').css('color', '');
            }
         });

         if (isMob) {
            tl_olMenuOut.to('.tt-ol-menu-list > li', { duration: 0.3, y: -20, autoAlpha: 0, stagger: 0.05, ease: 'power2.in' });
            tl_olMenuOut.to('.tt-overlay-menu', { duration: 0.7, y: '-100%', ease: 'power4.in', clearProps: 'all' }, '-=0.1');
            tl_olMenuOut.set('.tt-ol-menu-list > li', { clearProps: 'all' });
         } else {
            tl_olMenuOut.to('.tt-ol-menu-list > li', { duration: 0.4, y: -60, autoAlpha: 0, stagger: 0.06, ease: 'power3.in' });
            tl_olMenuOut.to('.tt-overlay-menu', { duration: 0.6, autoAlpha: 0, ease: 'power3.in', clearProps: 'all' }, '-=0.2');
            tl_olMenuOut.set('.tt-ol-menu-list > li', { clearProps: 'all' });
         }

         if ($('.tt-sliding-sidebar-wrap').length) { gsap.to('.tt-sliding-sidebar-trigger', { duration: 1, autoAlpha: 1, ease: Expo.easeOut, clearProps: 'all' }, '-=0.3'); }
      }

      return false;
   });

   $('.tt-ol-menu-list').on('mouseenter', function () { $(this).addClass('tt-ol-menu-hover'); }).on('mouseleave', function () { $(this).removeClass('tt-ol-menu-hover'); });

   // Works submenu — naranja solo cuando está abierto, stagger igual que menú principal
   $('.tt-ol-submenu-trigger > a').on('click touchend', function (e) {
      e.stopPropagation();
      if ($(this).is('[href^="#"]')) {
         var $this = $(this).parent();
         var $link = $(this);
         var $submenu = $this.next('.tt-ol-submenu');
         var $items = $submenu.find('li');

         if ($this.hasClass('tt-ol-submenu-open')) {
            $this.removeClass('tt-ol-submenu-open');
            $link.css('color', '');
            gsap.to($items, { duration: 0.25, y: -10, autoAlpha: 0, stagger: 0.04, ease: 'power2.in',
               onComplete: function () { $submenu.slideUp(200); gsap.set($items, { clearProps: 'all' }); }
            });
         } else {
            $this.parent().parent().find('.tt-ol-submenu').prev().removeClass('tt-ol-submenu-open');
            $this.parent().parent().find('.tt-ol-submenu-trigger > a').css('color', '');
            $this.parent().parent().find('.tt-ol-submenu').each(function () {
               var $s = $(this); var $si = $s.find('li');
               gsap.to($si, { duration: 0.2, y: -10, autoAlpha: 0, stagger: 0.03, ease: 'power2.in',
                  onComplete: function () { $s.slideUp(150); gsap.set($si, { clearProps: 'all' }); }
               });
            });
            $this.toggleClass('tt-ol-submenu-open');
            $link.css('color', '#FF6600');
            gsap.set($items, { y: 16, autoAlpha: 0 });
            $submenu.slideDown(0);
            gsap.to($items, { duration: 0.5, y: 0, autoAlpha: 1, stagger: 0.06, ease: 'power3.out', clearProps: 'all' });
         }
      }
      return false;
   });

   $('.tt-ol-submenu-caret-wrap').on('click', function () {
      var $this = $(this).parent();
      if ($this.hasClass('tt-ol-submenu-open')) { $this.removeClass('tt-ol-submenu-open'); $this.next().slideUp(350); }
      else { $this.parent().parent().find('.tt-ol-submenu').prev().removeClass('tt-ol-submenu-open'); $this.parent().parent().find('.tt-ol-submenu').slideUp(350); $this.toggleClass('tt-ol-submenu-open'); $this.next().slideToggle(350); }
   });

   // ==================================
   // tt-Search
   // ==================================

   if ($('.tt-search').length) {
      $('.tt-search').appendTo('#body-inner');
      $('.tt-search-trigger').on('click', function () {
         $('body').addClass('tt-search-open');
         var tl_ttSearchIn = gsap.timeline();
         tl_ttSearchIn.to('.tt-search', { duration: 0.4, autoAlpha: 1 });
         tl_ttSearchIn.from('.tt-search-appear', { duration: 0.5, y: 80, autoAlpha: 0, stagger: 0.1, ease: Power2.easeOut, clearProps: 'all' }, '+=0.1');
      });
      $('.tt-search-close, .tt-search-close-btn').on('click', function () {
         $('body').removeClass('tt-search-open');
         var tl_ttSearchOut = gsap.timeline();
         tl_ttSearchOut.to('.tt-search-appear', { duration: 0.5, y: -80, autoAlpha: 0, stagger: 0.05, ease: Power2.easeIn });
         tl_ttSearchOut.to('.tt-search', { duration: 0.4, autoAlpha: 0, clearProps: 'all' }, '+=0.2');
         tl_ttSearchOut.to('.tt-search-appear', { clearProps: 'all' });
      });
   }

   // =======================================================================================
   // Portfolio slider
   // =======================================================================================
   if ($('.tt-portfolio-slider').length) { $('.tt-portfolio-slider').each(function () { var $ttPortfolioSlider = $(this); var $dataMousewheel = $ttPortfolioSlider.data('mousewheel'); var $dataKeyboard = $ttPortfolioSlider.data('keyboard'); var $dataSimulateTouch = $ttPortfolioSlider.data('simulate-touch'); var $dataGrabCursor = $ttPortfolioSlider.data('grab-cursor'); var $dataAutoplay = $ttPortfolioSlider.data('autoplay') ? { delay: $ttPortfolioSlider.data('autoplay') } : $ttPortfolioSlider.data('autoplay'); var $dataLoop = $ttPortfolioSlider.data('loop') ? { loopedSlides: 100 } : $ttPortfolioSlider.data('loop'); if ($ttPortfolioSlider.is('[data-speed]')) { var $dataSpeed = $ttPortfolioSlider.data('speed'); } else { var $dataSpeed = 900; } if ($ttPortfolioSlider.is('[data-pagination-type]')) { var $dataPaginationType = $ttPortfolioSlider.data('pagination-type'); } else { var $dataPaginationType = 'fraction'; } var $ttPortfolioSliderSwiper = new Swiper($ttPortfolioSlider.find('.swiper')[0], { direction: 'horizontal', effect: 'slide', speed: 600, parallax: true, resistanceRatio: 0, longSwipesRatio: 0.02, preloadImages: false, preventInteractionOnTransition: true, autoplay: $dataAutoplay, mousewheel: $dataMousewheel, keyboard: $dataKeyboard, simulateTouch: $dataSimulateTouch, grabCursor: $dataGrabCursor, loop: $dataLoop, breakpoints: { 1025: { speed: $dataSpeed } }, lazy: { loadPrevNext: true, loadOnTransitionStart: true }, navigation: { nextEl: $ttPortfolioSlider.find('.tt-ps-nav-arrow-next')[0], prevEl: $ttPortfolioSlider.find('.tt-ps-nav-arrow-prev')[0], disabledClass: 'tt-ps-nav-arrow-disabled' }, pagination: { el: $ttPortfolioSlider.find('.tt-ps-nav-pagination')[0], type: $dataPaginationType, modifierClass: 'tt-ps-nav-pagination-', dynamicBullets: true, dynamicMainBullets: 1, clickable: true }, on: { init: function () { var $this = this; var $slideActive = $($this.slides[$this.activeIndex]); $slideActive.find('video').each(function () { $(this).get(0).play(); }); if ($ttPortfolioSlider.find('.tt-ps-caption-title').find('a').length) { $ttPortfolioSlider.find('.tt-ps-caption-title a').text($slideActive.attr('data-title')); $ttPortfolioSlider.find('.tt-ps-caption-title a').attr('href', $slideActive.attr('data-url')); } else { $ttPortfolioSlider.find('.tt-ps-caption-title').text($slideActive.attr('data-title')); } $ttPortfolioSlider.find('.tt-ps-caption-category').text($slideActive.attr('data-category')); setTimeout(function () { if ($slideActive.hasClass('psi-image-is-light')) { $('body').addClass('psi-light-image-on'); } else { $('body').removeClass('psi-light-image-on'); } }, 400); }, transitionStart: function () { var $this = this; var $slideActive = $($this.slides[$this.activeIndex]); setTimeout(function () { if ($slideActive.hasClass('psi-image-is-light')) { $('body').addClass('psi-light-image-on'); } else { $('body').removeClass('psi-light-image-on'); } }, 400); $slideActive.find('video').each(function () { $(this).get(0).play(); }); gsap.fromTo($ttPortfolioSlider.find('.tt-psc-elem'), { autoAlpha: 1, y: 0 }, { duration: 0.25, autoAlpha: 0, y: -30, stagger: 0.15, ease: Power1.easeIn }); }, transitionEnd: function () { var $this = this; var $slideActive = $($this.slides[$this.activeIndex]); $slideActive.prevAll().find('video').each(function () { $(this).get(0).pause(); }); $slideActive.nextAll().find('video').each(function () { $(this).get(0).pause(); }); if ($ttPortfolioSlider.find('.tt-ps-caption-title').find('a').length) { $ttPortfolioSlider.find('.tt-ps-caption-title a').text($slideActive.attr('data-title')); $ttPortfolioSlider.find('.tt-ps-caption-title a').attr('href', $slideActive.attr('data-url')); } else { $ttPortfolioSlider.find('.tt-ps-caption-title').text($slideActive.attr('data-title')); } $ttPortfolioSlider.find('.tt-ps-caption-category').text($slideActive.attr('data-category')); gsap.fromTo($ttPortfolioSlider.find('.tt-psc-elem'), { autoAlpha: 0, y: 30 }, { duration: 0.25, autoAlpha: 1, y: 0, stagger: 0.15, ease: Power1.easeOut }); } } }); if (!isMobile) { if ($ttPortfolioSlider.data('parallax-mouse-move')) { gsap.set($ttPortfolioSlider.find('.tt-psi-image'), { scale: 1.05 }); $ttPortfolioSlider.mousemove(function (e) { parallaxIt(e, $ttPortfolioSlider.find('.tt-psi-image'), -25); parallaxIt(e, $ttPortfolioSlider.find('.tt-ps-caption-inner'), -35); }); function parallaxIt(e, target, movement) { var $this = $ttPortfolioSlider; var relX = e.pageX - $this.offset().left; var relY = e.pageY - $this.offset().top; gsap.to(target, { duration: 1, x: ((relX - $this.width() / 2) / $this.width()) * movement, y: ((relY - $this.height() / 2) / $this.height()) * movement }); } } } }); }

   // Isotope
   var $container = $('.isotope-items-wrap');
   $container.imagesLoaded(function () { $container.isotope({ itemSelector: '.isotope-item', layoutMode: 'packery', transitionDuration: '0.7s', percentPosition: true }); setTimeout(function () { $container.isotope('layout'); ScrollTrigger.refresh(true); }, 500); });
   $('.ttgr-cat-list > li > a, .ttgr-cat-classic-list > li > a').on('click', function () { var selector = $(this).attr('data-filter'); $container.isotope({ filter: selector }); setTimeout(function () { ScrollTrigger.refresh(true); }, 500); return false; });
   var filterItemActive = $('.ttgr-cat-list > li > a, .ttgr-cat-classic-list > li > a');
   filterItemActive.on('click', function () { var $this = $(this); if (!$this.hasClass('active')) { filterItemActive.removeClass('active'); $this.addClass('active'); } });

   // lightGallery
   $('.lightgallery').lightGallery({ selector: '.lg-trigger', mode: 'lg-fade', height: '100%', width: '100%', iframeMaxWidth: '100%', loop: true, speed: 600, closable: true, escKey: true, keyPress: true, hideBarsDelay: 3000, controls: true, mousewheel: true, download: false, counter: true, swipeThreshold: 50, enableDrag: true, enableTouch: true, getCaptionFromTitleOrAlt: false, thumbnail: false, showThumbByDefault: false, thumbMargin: 5, toogleThumb: true, enableThumbSwipe: true, exThumbImage: 'data-exthumbnail', autoplay: false, autoplayControls: true, pause: 6000, progressBar: true, fourceAutoplay: false, fullScreen: true, zoom: false, scale: 0.5, enableZoomAfter: 50, videoMaxWidth: '1400px', loadYoutubeThumbnail: true, youtubeThumbSize: 'default', youtubePlayerParams: { modestbranding: 0, showinfo: 1, controls: 1 }, loadVimeoThumbnail: true, vimeoThumbSize: 'thumbnail_medium', vimeoPlayerParams: { byline: 1, portrait: 1, title: 1, color: 'CCCCCC', autopause: 1 }, hash: false, hgalleryId: 1, rotate: false, share: false, facebook: true, facebookDropdownText: 'Facebook', twitter: true, twitterDropdownText: 'Twitter', googlePlus: true, googlePlusDropdownText: 'Google+', pinterest: true, pinterestDropdownText: 'Pinterest' });

   // Page header
   if ($('.ph-image').length) { $('body').addClass('ph-image-on'); if ($('#page-header').hasClass('ph-bg-image')) { $('body').addClass('ph-bg-image-on'); } }
   if ($('#page-header .project-info-list').length) { $('#page-header').addClass('project-info-list-on'); }
   if ($('.made-with-love').length) { $('body').addClass('made-with-love-on'); }
   if ($('#page-header').is('.ph-bg-image.ph-bg-image-is-light')) { $('body').addClass('ph-bg-image-light-on'); } else { $('body').removeClass('ph-bg-image-light-on'); }

   // GSAP ScrollTrigger
   if ($('#page-header').hasClass('ph-content-parallax')) {
      let tlPhParallax = gsap.timeline({ scrollTrigger: { trigger: '#page-header', start: 'top top', end: 'bottom top', scrub: true, markers: false } });
      if ($('.ph-categories').length) { $('.ph-categories').wrapInner('<div class="ph-cat-parallax"></div>'); tlPhParallax.to('.ph-cat-parallax', { y: -80 }, 0); }
      if ($('.ph-caption-title').length) { $('.ph-caption-title').wrapInner('<div class="ph-title-parallax"></div>'); tlPhParallax.to('.ph-title-parallax', { y: -40 }, 0); }
      if ($('.ph-caption-subtitle').length) { $('.ph-caption-subtitle').wrapInner('<div class="ph-subt-parallax"></div>'); tlPhParallax.to('.ph-subt-parallax', { y: -10 }, 0); }
      if ($('.ph-caption-title-ghost').length) { $('.ph-caption-title-ghost').wrapInner('<div class="ph-ghost-parallax"></div>'); tlPhParallax.to('.ph-ghost-parallax', { y: 40 }, 0); }
      if ($('.ph-image').length) { if ($('#page-header').hasClass('ph-bg-image')) { tlPhParallax.to('.ph-image-inner', { yPercent: 30, scale: 1.05 }, 0); } else { tlPhParallax.to('.ph-image-inner', { yPercent: -20 }, 0); } }
   }

   // Portfolio grid
   if ($('#portfolio-grid').hasClass('pgi-cap-inside')) { $('.portfolio-grid-item').each(function () { $(this).find('.pgi-caption').appendTo($(this).find('.pgi-image-wrap')); }); if ($('.pgi-title a').length) { $('.pgi-title a').contents().unwrap(); } }
   $('.pgi-image-wrap').on('mouseenter', function () { $(this).find('video').each(function () { $(this).get(0).play(); }); }).on('mouseleave', function () { $(this).find('video').each(function () { $(this).get(0).pause(); }); });
   $('.ttgr-cat-nav').appendTo('#body-inner');

   // tt-Accordion
   $('.tt-accordion').each(function () {
      $(this).find('.tt-accordion-item').each(function () { var $this = $(this); if ($this.find('.tt-accordion-content').hasClass('is-open')) { $this.addClass('active'); } });
      $(this).find('.tt-accordion-heading').on('click', function () { var $this = $(this); if ($this.parents('.tt-accordion-item').hasClass('active')) { $this.parents('.tt-accordion-item').removeClass('active'); $this.next('.tt-accordion-content').slideUp(350); } else { $this.parent().parent().find('.tt-accordion-item').removeClass('active'); $this.parent().parent().find('.tt-accordion-content').slideUp(350); $this.parents('.tt-accordion-item').toggleClass('active'); $this.next('.tt-accordion-content').slideToggle(350); } return false; });
   });

   // tt-Tabs
   $('.tt-tabs').each(function () { $(this).find('.tt-tab-btn').on('click', function () { var $ttTabButton = $(this); var $ttTabs = $ttTabButton.parents('.tt-tabs'); $ttTabs.find('.tt-tab-btn').removeClass('active'); $ttTabButton.addClass('active'); var $ttTabName = $ttTabButton.attr('data-content-id'); $ttTabs.find('.tt-tab-content').removeClass('active'); $ttTabs.find('.tt-tab-content-wrap #' + $ttTabName).addClass('active'); }); });

   // Scroll between anchors
   $('a[href^="#"]').not('[href$="#"]').not('[href$="#0"]').on('click', function () {
      var target = this.hash;
      if ($('#tt-header').hasClass('tt-header-fixed')) { var $offset = $('#tt-header').height(); } else { var $offset = 0; }
      if ($(this).data('offset') != undefined) $offset = $(this).data('offset');
      if (!isMobile) {
         if ($('body').hasClass('tt-smooth-scroll')) { var topY = $(target).offset().top - $('#scroll-container > .scroll-content').offset().top - $offset; var $scrollbar = Scrollbar.init(document.getElementById('scroll-container')); gsap.to($scrollbar, { duration: 2.2, scrollTo: { y: topY, autoKill: true }, ease: Expo.easeInOut }); }
         else { var topY = $(target).offset().top - $('body').offset().top - $offset; $('html,body').animate({ scrollTop: topY }, 800); }
      } else { var topY = $(target).offset().top - $('body').offset().top - $offset; $('html,body').animate({ scrollTop: topY }, 800); }
      return false;
   });

   // Scroll to top
   $('.scroll-to-top').on('click', function () {
      if (!isMobile) { if ($('body').hasClass('tt-smooth-scroll')) { var $scrollbar = Scrollbar.init(document.getElementById('scroll-container')); gsap.to($scrollbar, { duration: 1.5, scrollTo: { y: 0, autoKill: true }, ease: Expo.easeInOut }); } else { $('html,body').animate({ scrollTop: 0 }, 800); } }
      else { $('html,body').animate({ scrollTop: 0 }, 800); }
      return false;
   });

   // Defer videos
   function init() { var vidDefer = document.getElementsByTagName('iframe'); for (var i = 0; i < vidDefer.length; i++) { if (vidDefer[i].getAttribute('data-src')) { vidDefer[i].setAttribute('src', vidDefer[i].getAttribute('data-src')); } } }
   window.onload = init;

   // Forms
   $('input,textarea').focus(function () { $(this).data('placeholder', $(this).attr('placeholder')).attr('placeholder', ''); }).blur(function () { $(this).attr('placeholder', $(this).data('placeholder')); });
   $('#tt-contact-form').submit(function () { var th = $(this); $.ajax({ type: 'POST', url: 'mail.php', data: th.serialize() }).done(function () { alert('Thank you. Your message has been sent!'); setTimeout(function () { th.trigger('reset'); }, 800); }); return false; });

   // Magic cursor
   if ($('body').not('.is-mobile').hasClass('tt-magic-cursor')) {
      if ($(window).width() > 1024) {
         $('.magnetic-item').wrap('<div class="magnetic-wrap"></div>');
         if ($('a.magnetic-item').length) { $('a.magnetic-item').addClass('not-hide-cursor'); }
         var $mouse = { x: 0, y: 0 }; var $pos = { x: 0, y: 0 }; var $ratio = 0.15; var $active = false; var $ball = $('#ball');
         var $ballWidth = 10; var $ballHeight = 10; var $ballScale = 1; var $ballOpacity = 1; var $ballBorderWidth = 0;
         gsap.set($ball, { xPercent: -50, yPercent: -50, width: $ballWidth, height: $ballHeight, backgroundColor: '#ff6600', borderWidth: $ballBorderWidth, opacity: $ballOpacity });
         document.addEventListener('mousemove', mouseMove);
         function mouseMove(e) { $mouse.x = e.clientX; $mouse.y = e.clientY; }
         gsap.ticker.add(updatePosition);
         function updatePosition() { if (!$active) { $pos.x += ($mouse.x - $pos.x) * $ratio; $pos.y += ($mouse.y - $pos.y) * $ratio; gsap.set($ball, { x: $pos.x, y: $pos.y }); } }
         $('.magnetic-wrap').mousemove(function (e) { parallaxCursor(e, this, 2); callParallax(e, this); });
         function callParallax(e, parent) { parallaxIt(e, parent, parent.querySelector('.magnetic-item'), 10); }
         function parallaxIt(e, parent, target, movement) { var boundingRect = parent.getBoundingClientRect(); var relX = e.clientX - boundingRect.left; var relY = e.clientY - boundingRect.top; gsap.to(target, { duration: 0.3, x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement, y: ((relY - boundingRect.height / 2) / boundingRect.height) * movement, ease: Power2.easeOut }); }
         function parallaxCursor(e, parent, movement) { var rect = parent.getBoundingClientRect(); var relX = e.clientX - rect.left; var relY = e.clientY - rect.top; $pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement; $pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement; gsap.to($ball, { duration: 0.3, x: $pos.x, y: $pos.y }); }
         $('.magnetic-wrap').on('mouseenter', function (e) { gsap.to($ball, { duration: 0.3, scale: 2, borderWidth: 1, opacity: $ballOpacity }); $active = true; }).on('mouseleave', function (e) { gsap.to($ball, { duration: 0.3, scale: $ballScale, borderWidth: $ballBorderWidth, opacity: $ballOpacity }); gsap.to(this.querySelector('.magnetic-item'), { duration: 0.3, x: 0, y: 0, clearProps: 'all' }); $active = false; });
         $('.cursor-alter, .tt-main-menu-list > li > a, .tt-main-menu-list > li > .tt-submenu-trigger > a').not('.magnetic-item').on('mouseenter', function () { gsap.to($ball, { duration: 0.3, borderWidth: 0, opacity: 0.2, backgroundColor: 'transparent', width: '50px', height: '50px' }); }).on('mouseleave', function () { gsap.to($ball, { duration: 0.3, opacity: $ballOpacity, width: $ballWidth, height: $ballHeight, backgroundColor: '#ff6600' }); });
         $('a, button, .tt-btn, .tt-form-control, .tt-form-radio, .tt-form-check, .hide-cursor').not('.not-hide-cursor').not('.cursor-alter').not('.tt-main-menu-list > li > a').not('.tt-main-menu-list > li > .tt-submenu-trigger > a').on('mouseenter', function () { gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 }); }).on('mouseleave', function () { gsap.to($ball, { duration: 0.3, scale: $ballScale, opacity: $ballOpacity }); });
         $('a').not('[target="_blank"]').not('[href^="#"]').not('[href^="mailto"]').not('[href^="tel"]').not('.lg-trigger').not('.tt-btn-disabled a').on('click', function () { gsap.to($ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 }); });
         $(document).on('mouseleave', function () { gsap.to('#magic-cursor', { duration: 0.3, autoAlpha: 0 }); }).on('mouseenter', function () { gsap.to('#magic-cursor', { duration: 0.3, autoAlpha: 1 }); });
         $(document).mousemove(function () { gsap.to('#magic-cursor', { duration: 0.3, autoAlpha: 1 }); });
      }
   }

   // Miscellaneous
   $('.tt-btn-disabled').find('a').on('click', function () { return false; });
   $(window).on('pagehide', function () { $(window).scrollTop(0); });
   $('*').on('touchstart', function () { $(this).trigger('hover'); }).on('touchend', function () { $(this).trigger('hover'); });

})(jQuery);
