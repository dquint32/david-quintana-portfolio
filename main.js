/* David Quintana — portfolio behaviour (no dependencies).
   Language and theme are applied before first paint by the inline script in
   each page's <head>; this file wires up the controls and keeps them in sync. */
(function () {
  'use strict';

  var root = document.documentElement;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage blocked: still works for this page */ }
  }

  /* Language ------------------------------------------------------------ */
  function setLanguage(lang) {
    root.setAttribute('data-language', lang);
    root.setAttribute('lang', lang);
    document.querySelectorAll('.lang-switch').forEach(function (btn) {
      btn.setAttribute('aria-label', lang === 'en' ? 'Cambiar a español' : 'Switch to English');
    });
    store('preferred-language', lang);
  }

  /* Theme --------------------------------------------------------------- */
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'light'));
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
    store('preferred-theme', theme);
  }

  /* Mobile navigation ---------------------------------------------------- */
  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;
    function close() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.matchMedia('(min-width: 921px)').addEventListener('change', close);
  }

  /* Lightbox for screenshots (native <dialog>: focus trap + Esc for free) - */
  function initLightbox() {
    var images = Array.prototype.slice.call(document.querySelectorAll('img.zoomable'));
    if (!images.length || typeof HTMLDialogElement !== 'function') return;

    var dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button><img alt=""><p></p>';
    document.body.appendChild(dialog);
    var big = dialog.querySelector('img');
    var caption = dialog.querySelector('p');
    var current = -1;

    function visible() { return images.filter(function (img) { return img.offsetParent !== null; }); }
    function show(img) {
      var list = visible();
      current = list.indexOf(img);
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      var fig = img.closest('figure');
      var cap = fig && Array.prototype.find.call(fig.querySelectorAll('figcaption'), function (c) { return c.offsetParent !== null; });
      caption.textContent = cap ? cap.textContent : img.alt;
      if (!dialog.open) dialog.showModal();
    }

    images.forEach(function (img) {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', function () { show(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(img); }
      });
    });
    dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      var list = visible();
      if (e.key === 'ArrowRight' && current < list.length - 1) show(list[current + 1]);
      if (e.key === 'ArrowLeft' && current > 0) show(list[current - 1]);
    });
  }

  /* Back to top ---------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('visible', window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
  }

  function init() {
    setLanguage(root.getAttribute('data-language') === 'es' ? 'es' : 'en');
    setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    document.querySelectorAll('.lang-switch').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLanguage(root.getAttribute('data-language') === 'en' ? 'es' : 'en');
      });
    });
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
      });
    });

    initMenu();
    initLightbox();
    initBackToTop();
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
