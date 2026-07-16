/* ============================================================
   DAVID QUINTANA — PORTFOLIO INTERACTIVE LAYER
   Vanilla ES6+, IIFE-scoped, no dependencies.
   ------------------------------------------------------------
   Modules:
     - Theme engine (light/dark, persisted, flicker-free)
     - i18n engine (EN/ES, persisted, syncs <html lang>)
     - Accessible lightbox (focus trap + restore)
     - Scroll reveal (IntersectionObserver)
     - Consolidated, rAF-throttled scroll handling
     - Smooth in-page scroll, back-to-top, footer year
   Note: a tiny pre-paint snippet in each page's <head> applies
   the saved theme/language BEFORE first paint to avoid FOUC.
   This file then wires up the interactive behavior.
   ============================================================ */

(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LANG_KEY = 'preferred-language';
  const THEME_KEY = 'preferred-theme';

  /* ============================================================
     THEME ENGINE
     ============================================================ */
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function storeTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
  }

  function applyTheme(theme, toggleBtn) {
    root.setAttribute('data-theme', theme);
    if (toggleBtn) {
      const isLight = theme === 'light';
      toggleBtn.setAttribute('aria-pressed', String(isLight));
      toggleBtn.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
  }

  function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');

    // Resolve the initial theme: stored > OS preference > dark default.
    // (The pre-paint snippet may already have set data-theme; honor it.)
    let theme = root.getAttribute('data-theme') || getStoredTheme();
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
    }
    applyTheme(theme, toggleBtn);

    // Enable smooth color transitions only AFTER first paint,
    // so the initial theme never animates in.
    requestAnimationFrame(() => root.classList.add('theme-ready'));

    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
      const next =
        root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next, toggleBtn);
      storeTheme(next);
    });
  }

  /* ============================================================
     i18n ENGINE (EN / ES)
     ============================================================ */
  function getStoredLang() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ }
  }

  function initLanguageToggle() {
    const toggle = document.querySelector('.floating-toggle');
    if (!toggle) return;

    const langBlocks = document.querySelectorAll('[lang-block]');
    const toggleSpans = toggle.querySelectorAll('span[data-lang]');

    const switchLanguage = (lang) => {
      // 1. Reflect on <html> + <body>. Setting html[data-language] keeps the
      //    flicker-free CSS mechanism in sync; setting <html lang> is required
      //    for correct screen-reader pronunciation (WCAG 3.1.1/3.1.2).
      root.setAttribute('data-language', lang);
      root.setAttribute('lang', lang);
      body.setAttribute('data-language', lang);

      // 2. Show/hide the matching language blocks.
      langBlocks.forEach((el) => {
        el.setAttribute(
          'data-active',
          el.getAttribute('data-lang') === lang ? 'true' : 'false'
        );
      });

      // 3. Update the toggle's own visual state.
      toggleSpans.forEach((span) => {
        span.classList.toggle(
          'inactive',
          span.getAttribute('data-lang') !== lang
        );
      });

      // 4. Expose state to assistive tech + persist.
      toggle.setAttribute('aria-pressed', String(lang === 'es'));
      toggle.setAttribute(
        'aria-label',
        lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'
      );
      storeLang(lang);
    };

    toggle.addEventListener('click', () => {
      const current = body.getAttribute('data-language') || 'en';
      switchLanguage(current === 'en' ? 'es' : 'en');
    });

    // Initialize from storage (pre-paint may already have set it).
    switchLanguage(getStoredLang() || body.getAttribute('data-language') || 'en');
  }

  /* ============================================================
     ACCESSIBLE LIGHTBOX
     ============================================================ */
  function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const closeBtn = modal && modal.querySelector('.lightbox-close');
    if (!modal || !modalImg || !closeBtn) return;

    const images = Array.from(document.querySelectorAll('.clickable-img'));
    if (!images.length) return;

    let lastFocused = null;
    let currentIndex = -1;

    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image viewer');

    const show = (index) => {
      const img = images[index];
      if (!img) return;
      currentIndex = index;
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
      if (caption) caption.textContent = img.alt || 'Project screenshot';
    };

    const open = (index, trigger) => {
      lastFocused = trigger || document.activeElement;
      show(index);
      modal.style.display = 'flex';
      requestAnimationFrame(() => modal.classList.add('active'));
      body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const close = () => {
      modal.classList.remove('active');
      const finish = () => {
        modal.style.display = 'none';
        modalImg.src = '';
        body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        }
      };
      if (prefersReducedMotion) finish();
      else setTimeout(finish, 240);
    };

    images.forEach((img, i) => {
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', () => open(i, img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(i, img);
        }
      });
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // Keyboard: Esc closes, arrows navigate, Tab is trapped on the close button.
    modal.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        show(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        show(currentIndex - 1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        closeBtn.focus();
      }
    });
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.project-card, .skill-detail-card, .service-card, .content-block'
    );
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('reveal', 'is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.08 }
    );

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i * 60, 300) + 'ms';
      observer.observe(el);
    });
  }

  /* ============================================================
     SMOOTH IN-PAGE SCROLL
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      });
    });
  }

  /* ============================================================
     CONSOLIDATED SCROLL HANDLER (rAF-throttled)
     Handles header shadow + back-to-top in one listener.
     ============================================================ */
  function initScrollEffects() {
    const header = document.querySelector('.site-header');
    const backToTop = document.getElementById('back-to-top');
    if (!header && !backToTop) return;

    let ticking = false;
    const update = () => {
      const y = window.pageYOffset;
      if (header) header.classList.toggle('scrolled', y > 40);
      if (backToTop) backToTop.classList.toggle('visible', y > 320);
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      });
    }
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  function updateFooterYear() {
    document.querySelectorAll('#year, [data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initThemeToggle();
    initLanguageToggle();
    initLightbox();
    initScrollReveal();
    initSmoothScroll();
    initScrollEffects();
    updateFooterYear();
    body.classList.add('loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Minimal debug surface.
  window.portfolioDebug = { prefersReducedMotion, reinitialize: init };
})();
