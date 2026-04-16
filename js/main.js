/* ══════════════════════════════════════════════════
   Hatch — Main Initialisation
   Lenis smooth scroll, Nav, Page loader, Custom cursor
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Page Loader ── */
  function initLoader() {
    var loader = document.querySelector('.loader');
    if (!loader) return;

    document.body.style.overflow = 'hidden';

    // CSS animations handle the visual. JS just cleans up after.
    loader.addEventListener('animationend', function (e) {
      if (e.animationName === 'loaderExit') {
        loader.classList.add('done');
        document.body.style.overflow = '';
      }
    });

    // Safety fallback — if animations don't fire, remove after 1.2s
    setTimeout(function () {
      if (!loader.classList.contains('done')) {
        loader.classList.add('done');
        document.body.style.overflow = '';
      }
    }, 1200);
  }

  /* ── Lenis Smooth Scroll ── */
  var lenis;

  function closeMobileMenu() {
    var ham = document.querySelector('.hamburger');
    var nl = document.querySelector('.nav-links');
    if (ham && ham.classList.contains('open')) {
      ham.classList.remove('open');
      nl.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  function bindAnchorsNative() {
    // Native smooth-scroll fallback for touch devices (no Lenis)
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        closeMobileMenu();
        var target = document.querySelector(href);
        if (!target) return;
        var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  function initSmoothScroll() {
    // Refresh ScrollTrigger on orientation change / resize (both paths)
    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 250);
    });

    // On touch devices, skip Lenis entirely — native momentum scroll feels
    // snappier and synthetic smoothing causes a "floaty/behind" sensation.
    var isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    if (isTouch || typeof Lenis === 'undefined') {
      bindAnchorsNative();
      return;
    }

    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on('scroll', function () {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor clicks (Lenis path)
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        closeMobileMenu();
        if (lenis.isStopped) lenis.start();
        var target = document.querySelector(href);
        if (target) lenis.scrollTo(target, { offset: -70 });
      });
    });
  }

  /* ── Navigation ── */
  function initNav() {
    var nav = document.getElementById('nav');
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    var links = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    if (!nav) return;

    // Scroll shrink — edge-triggered only, avoids per-frame classList writes
    ScrollTrigger.create({
      start: 80,
      end: 'max',
      onEnter: function () { nav.classList.add('nav--scrolled'); },
      onLeaveBack: function () { nav.classList.remove('nav--scrolled'); },
    });

    // Active link tracking
    document.querySelectorAll('section[id]').forEach(function (section) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: function (self) {
          if (self.isActive) {
            links.forEach(function (l) { l.classList.remove('active'); });
            var active = document.querySelector('.nav-links a[href="#' + section.id + '"]');
            if (active) active.classList.add('active');
          }
        },
      });
    });

    // Hamburger
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        var isOpen = hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // Pause/resume Lenis
        if (lenis) {
          isOpen ? lenis.stop() : lenis.start();
        }
      });

      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('open');
          navLinks.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          if (lenis) lenis.start();
        });
      });
    }
  }

  /* ── Custom Cursor (desktop only) ── */
  function initCursor() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    if (window.matchMedia('(hover: none)').matches) return;

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var circle = document.createElement('div');
    circle.className = 'cursor-circle';
    document.body.appendChild(dot);
    document.body.appendChild(circle);

    var mouseX = -100, mouseY = -100;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX - 3, y: mouseY - 3 });
    });

    // Smooth follow for circle
    gsap.ticker.add(function () {
      gsap.to(circle, {
        x: mouseX - 20,
        y: mouseY - 20,
        duration: 0.15,
        ease: 'power2.out',
      });
    });

    // Enlarge on interactive elements
    var interactives = 'a, button, .btn-primary, .nav-cta, .price-btn, .food-card, .sector-card, .btile, input, select, textarea';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactives)) {
        circle.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactives)) {
        circle.classList.remove('hovering');
      }
    });
  }

  /* ── Init All ── */
  function init() {
    gsap.registerPlugin(ScrollTrigger);
    initLoader();
    initSmoothScroll();
    initNav();
    initCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
