/* ══════════════════════════════════════════════════
   Hatch — GSAP Animations
   Hero entrance, scroll reveals, counters, magnetic buttons, parallax
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Helpers ── */

  function splitWords(el) {
    var text = el.innerHTML;
    var parts = text.split(/(<br\s*\/?>|<span[^>]*>.*?<\/span>)/gi);
    var result = '';

    parts.forEach(function (part) {
      if (part.match(/<br\s*\/?>/i)) {
        result += part;
      } else if (part.match(/<span/i)) {
        result += '<span class="word" style="display:inline-block">' + part + '</span> ';
      } else {
        var words = part.trim().split(/\s+/);
        words.forEach(function (word) {
          if (word) {
            result += '<span class="word" style="display:inline-block">' + word + '</span> ';
          }
        });
      }
    });

    el.innerHTML = result;
    return el.querySelectorAll('.word');
  }

  function revealOnScroll(selector, fromVars) {
    fromVars = fromVars || {};
    gsap.utils.toArray(selector).forEach(function (el) {
      gsap.from(el, Object.assign({
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }, fromVars));
    });
  }

  function staggerReveal(trigger, targets, fromVars) {
    fromVars = fromVars || {};
    gsap.from(targets, Object.assign({
      autoAlpha: 0,
      y: 50,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trigger,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }, fromVars));
  }

  /* ── Hero Entrance ── */

  function initHeroAnimations() {
    var h1 = document.querySelector('.hero-h1');
    if (!h1) return;

    var words = splitWords(h1);

    // Set initial hidden states
    gsap.set('.hero-eyebrow', { autoAlpha: 0, y: 20 });
    gsap.set('.hero-h1', { autoAlpha: 1 });
    gsap.set(words, { autoAlpha: 0, y: 40 });
    gsap.set('.hero-tagline', { autoAlpha: 0, y: 20 });
    gsap.set('.hero-sub', { autoAlpha: 0, y: 20 });
    gsap.set('.hero-actions', { autoAlpha: 0, y: 20 });
    gsap.set('.hero-visual', { autoAlpha: 0, x: 60, scale: 0.95 });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 1 });

    tl.to('.hero-eyebrow', { autoAlpha: 1, y: 0, duration: 0.6 })
      .to(words, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 }, '-=0.3')
      .add(function () {
        var accent = document.querySelector('.hero-h1 .accent');
        if (accent) accent.classList.add('drawn');
      }, '-=0.2')
      .to('.hero-tagline', { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.3')
      .to('.hero-sub', { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2')
      .to('.hero-actions', { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2')
      .to('.hero-visual', { autoAlpha: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out' }, '-=0.6');

    // Parallax on hero image — desktop only (scrub is expensive on mobile,
    // and disabled when the user prefers reduced motion).
    var skipScrub = window.matchMedia('(max-width: 768px)').matches ||
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!skipScrub) {
      gsap.to('.hero-img-wrap', {
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    }
  }

  /* ── Scroll Animations ── */

  function initScrollAnimations() {
    // How It Works
    revealOnScroll('.how-section .section-tag');
    revealOnScroll('.how-section .section-title', { delay: 0.1 });
    revealOnScroll('.how-section .section-sub', { delay: 0.2 });
    staggerReveal('.steps-grid', '.step-card', { stagger: 0.15 });

    // Value Drivers — scroll-driven parallax
    revealOnScroll('.value-section .section-tag');
    revealOnScroll('.value-section .section-title', { delay: 0.1 });
    revealOnScroll('.value-section .section-sub', { delay: 0.2 });

    // Each card scrolls from a starting y offset to 0, at its own rate.
    // On mobile (or when user prefers reduced motion), skip the per-frame
    // scrub and use a simple fade-in reveal instead — 6 scrub triggers kill
    // scroll smoothness on phones.
    var skipScrubCards = window.matchMedia('(max-width: 768px)').matches ||
                         window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (skipScrubCards) {
      revealOnScroll('.value-driver', { stagger: 0.06 });
    } else {
      gsap.utils.toArray('.value-driver').forEach(function (driver) {
        var speed = parseFloat(driver.dataset.speed) || 0.7;
        var startY = 60 * speed;
        var endY = -40 * speed;

        // Scroll-driven drift
        gsap.fromTo(driver,
          { y: startY, autoAlpha: 0 },
          {
            y: endY,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: driver,
              start: 'top 100%',
              end: 'top 20%',
              scrub: 0.6,
            },
          }
        );

        // "Pop" when card reaches centre of viewport
        ScrollTrigger.create({
          trigger: driver,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: function () { driver.classList.add('vd-active'); },
          onLeave: function () { driver.classList.remove('vd-active'); },
          onEnterBack: function () { driver.classList.add('vd-active'); },
          onLeaveBack: function () { driver.classList.remove('vd-active'); },
        });
      });
    }

    // Image break with scale
    gsap.from('.image-break-inner', {
      opacity: 0, y: 60, scale: 0.97, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: '.image-break', start: 'top 85%', toggleActions: 'play none none none' },
    });

    // Fridge diagram — scroll-scrubbed stroke draw-in + dimension fade-in
    var fridgeDiagram = document.querySelector('.fridge-diagram');
    if (fridgeDiagram && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var diagramStrokes = fridgeDiagram.querySelectorAll('.draw path, .draw line, .draw rect, .draw polyline');
      var diagramFades = fridgeDiagram.querySelectorAll('.draw-fade');

      var drawTween = gsap.to(diagramStrokes, {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'none',
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: {
          trigger: '.image-break',
          start: 'top 85%',
          end: 'bottom 35%',
          scrub: 0.6,
          onLeave: function () {
            // Force-complete in case scrub lerp lags at the end
            drawTween.progress(1);
            fridgeDiagram.classList.add('is-drawn');
          },
          onEnterBack: function () {
            fridgeDiagram.classList.remove('is-drawn');
          },
        },
      });

      gsap.to(diagramFades, {
        opacity: 1,
        ease: 'power1.out',
        duration: 0.5,
        scrollTrigger: {
          trigger: '.image-break',
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Sectors — individual pop-up on scroll
    revealOnScroll('.sectors-section .section-tag');
    revealOnScroll('.sectors-section .section-title', { delay: 0.1 });

    gsap.utils.toArray('.sector-card').forEach(function (card, i) {
      gsap.from(card, {
        autoAlpha: 0,
        y: 60,
        scale: 0.92,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.sectors-grid',
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });

    // Food — tiles start flipped (showing text back), then flip to reveal
    // images in random order as the grid scrolls into view.
    // Hover flips an individual tile back to show text, and unflip on leave.
    revealOnScroll('.food-section .section-tag');
    revealOnScroll('.food-section .section-title', { delay: 0.1 });

    var flipTiles = gsap.utils.toArray('.flip-tile');

    // Start all tiles in the flipped (text) state
    flipTiles.forEach(function (tile) { tile.classList.add('flipped'); });

    // Fade in
    gsap.from(flipTiles, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.food-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Shuffle order for random reveal
    var shuffled = flipTiles.slice().sort(function () { return Math.random() - 0.5; });

    // When grid hits viewport, flip tiles to image side in random order
    ScrollTrigger.create({
      trigger: '.food-grid',
      start: 'top 65%',
      once: true,
      onEnter: function () {
        shuffled.forEach(function (tile, i) {
          setTimeout(function () {
            tile.classList.remove('flipped');
          }, i * 180);
        });
      },
    });

    // Hover/tap: flip to text side, unhover/tap-away: flip back to image
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      flipTiles.forEach(function (tile) {
        tile.addEventListener('click', function (e) {
          e.stopPropagation();
          var wasFlipped = tile.classList.contains('flipped');
          // Unflip all first
          flipTiles.forEach(function (t) { t.classList.remove('flipped'); });
          // Toggle tapped tile
          if (!wasFlipped) tile.classList.add('flipped');
        });
      });

      // Tap outside any tile unflips all
      document.addEventListener('click', function () {
        flipTiles.forEach(function (t) { t.classList.remove('flipped'); });
      });
    } else {
      flipTiles.forEach(function (tile) {
        tile.addEventListener('mouseenter', function () {
          tile.classList.add('flipped');
        });
        tile.addEventListener('mouseleave', function () {
          tile.classList.remove('flipped');
        });
      });
    }

    // Pricing
    revealOnScroll('.pricing-section .section-tag');
    revealOnScroll('.pricing-section .section-title', { delay: 0.1 });
    gsap.utils.toArray('.price-card').forEach(function (card, i) {
      var isFeatured = card.classList.contains('featured');
      gsap.from(card, {
        autoAlpha: 0, y: isFeatured ? 60 : 50, scale: isFeatured ? 0.95 : 1,
        duration: 0.8, delay: i * 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%', toggleActions: 'play none none none' },
      });
    });

    // Sustainability
    revealOnScroll('.sustain-section .section-tag');
    revealOnScroll('.sustain-section .section-title', { delay: 0.1 });
    revealOnScroll('.sustain-section .section-sub', { delay: 0.2 });
    staggerReveal('.sustain-stats-row', '.sustain-stat', { stagger: 0.15, y: 30 });
    staggerReveal('.sustain-grid', '.sustain-card', { stagger: 0.12 });

    // FAQ
    revealOnScroll('.faq-left');
    staggerReveal('.faq-list', '.faq-item', { stagger: 0.08, y: 20 });

    // Contact
    gsap.from('.contact-left', {
      autoAlpha: 0, x: -40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.contact-inner', start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.from('.contact-form-wrap', {
      autoAlpha: 0, x: 40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.contact-inner', start: 'top 80%', toggleActions: 'play none none none' },
    });

    // Footer
    staggerReveal('.footer-grid', '.footer-grid > div', { stagger: 0.1, y: 30 });
  }

  /* ── Counter Animations ── */

  function initCounters() {
    document.querySelectorAll('[data-target]').forEach(function (el) {
      var target = parseFloat(el.dataset.target);
      var suffix = el.dataset.suffix || '';
      var prefix = el.dataset.prefix || '';
      var obj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power1.out',
            onUpdate: function () {
              el.textContent = prefix + Math.round(obj.val) + suffix;
            },
          });
        },
      });
    });
  }

  /* ── FAQ Accordion ── */

  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var ans = item.querySelector('.faq-ans');
      if (!btn || !ans) return;

      btn.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close others
        items.forEach(function (other) {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            gsap.to(other.querySelector('.faq-ans'), { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' });
          }
        });

        if (isActive) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          gsap.to(ans, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' });
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          gsap.set(ans, { height: 'auto', opacity: 1 });
          var h = ans.scrollHeight;
          gsap.set(ans, { height: 0, opacity: 0 });
          gsap.to(ans, { height: h, opacity: 1, duration: 0.4, ease: 'power2.inOut' });
        }
      });
    });
  }

  /* ── Magnetic Buttons ── */

  function initMagneticButtons() {
    if ('ontouchstart' in window) return;

    var buttons = document.querySelectorAll('.btn-primary, .nav-cta, .price-btn');

    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ── Init ── */

  function init() {
    initHeroAnimations();
    initScrollAnimations();
    initCounters();
    initFAQ();
    initMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure main.js has registered ScrollTrigger
    setTimeout(init, 50);
  }

})();
