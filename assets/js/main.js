/* ==========================================================================
   Renovation Blue - main script
   Vanilla JS, no jQuery, no Swiper. Replaces the Elementor / WordPress
   front-end bundles.

   Modules
   -------
   1. Sticky header      - transparent over the hero, white once scrolled
   2. Mobile menu        - full-screen overlay (was an Elementor popup)
   3. Hero slider        - cross-fade, autoplay, arrows, keyboard, swipe
   4. Scroll reveal      - entrance animations via IntersectionObserver
   5. Footer year        - keeps the copyright line current
   ========================================================================== */

(function () {
  'use strict';

  // Flags that CSS uses to decide whether it may hide content before reveal.
  document.documentElement.classList.add('js');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* 1. Sticky header
     ---------------------------------------------------------------------- */
  function initHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var THRESHOLD = 60;
    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.pageYOffset > THRESHOLD);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }


  /* 2. Mobile menu
     ---------------------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    var closeBtn = menu.querySelector('.mobile-menu__close');

    function open() {
      menu.hidden = false;
      // Next frame, so the opacity transition has a starting value to animate from.
      window.requestAnimationFrame(function () { menu.classList.add('is-open'); });
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-menu-open');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-menu-open');
      window.setTimeout(function () { menu.hidden = true; }, 300);
      toggle.focus();
    }

    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Following a link closes the overlay too (matters for in-page anchors).
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) close();
    });
  }


  /* 3. Hero slider
     ---------------------------------------------------------------------- */
  function initHeroSlider() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
    if (slides.length < 2) return;

    var prevBtn = hero.querySelector('.hero__arrow--prev');
    var nextBtn = hero.querySelector('.hero__arrow--next');

    var AUTOPLAY_MS = 5000;
    var index = 0;
    var timer = null;
    var stopped = false;   // set once the visitor interacts, matching "pause on interaction"

    function show(next) {
      index = (next + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle('is-active', active);
        if (active) {
          slide.removeAttribute('aria-hidden');
        } else {
          slide.setAttribute('aria-hidden', 'true');
        }
        // Keep off-screen buttons out of the tab order.
        var link = slide.querySelector('a');
        if (link) link.tabIndex = active ? 0 : -1;
      });
    }

    function start() {
      if (stopped || prefersReducedMotion) return;
      stop();
      timer = window.setInterval(function () { show(index + 1); }, AUTOPLAY_MS);
    }

    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    function goTo(next) {
      stopped = true;   // visitor took over - stop rotating
      stop();
      show(next);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

    // Pause on hover
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    // Pause while the tab is in the background
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    // Keyboard
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });

    // Touch swipe
    var touchStartX = null;
    hero.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) goTo(delta < 0 ? index + 1 : index - 1);
      touchStartX = null;
    }, { passive: true });

    show(0);
    start();
  }


  /* 4. Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }


  /* 5. Footer year
     ---------------------------------------------------------------------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }


  /* Boot
     ---------------------------------------------------------------------- */
  function init() {
    initHeader();
    initMobileMenu();
    initHeroSlider();
    initReveal();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
