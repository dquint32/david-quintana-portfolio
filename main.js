/* ============================================
   INDUSTRIAL MODERNISM + CYBER MINIMALISM
   JavaScript Interactions for David Quintana Portfolio
   ============================================ */

(function() {
  'use strict';

  /* ============================================
     REDUCED MOTION DETECTION
     ============================================ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================
     SCROLL REVEAL ANIMATIONS
     ============================================ */
  function initScrollReveal() {
    // Only apply animations if user hasn't requested reduced motion
    if (prefersReducedMotion) return;

    // Select all elements to animate
    const revealElements = document.querySelectorAll(`
      .hero-left,
      .hero-right,
      .about,
      .project-card,
      .skill-detail-card,
      .service-card,
      .contact-card,
      .section-header
    `);

    // Add fade-in-up class to all elements
    revealElements.forEach(el => {
      el.classList.add('fade-in-up');
    });

    // Create IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add delay based on position for staggered effect
          const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
          
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);

          // Stop observing once visible
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements
    revealElements.forEach(el => observer.observe(el));
  }

  /* ============================================
     MAGNETIC CURSOR EFFECT
     ============================================ */
  function initMagneticCursor() {
    // Only apply if user hasn't requested reduced motion
    if (prefersReducedMotion) return;

    // Create custom cursor elements
    const cursor = document.createElement('div');
    const cursorGlow = document.createElement('div');
    
    cursor.className = 'custom-cursor';
    cursorGlow.className = 'custom-cursor-glow';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .custom-cursor,
      .custom-cursor-glow {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        border-radius: 50%;
        transition: transform 0.15s ease-out, opacity 0.15s ease-out;
      }
      
      .custom-cursor {
        width: 10px;
        height: 10px;
        background: var(--cyber-orange);
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
      }
      
      .custom-cursor-glow {
        width: 40px;
        height: 40px;
        background: var(--orange-glow);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
      
      body.cursor-active .custom-cursor {
        transform: translate(-50%, -50%) scale(1.5);
      }
      
      body.cursor-active .custom-cursor-glow {
        opacity: 1;
      }
      
      @media (hover: none) {
        .custom-cursor,
        .custom-cursor-glow {
          display: none;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(cursor);
    document.body.appendChild(cursorGlow);

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor animation
    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursorGlow.style.left = cursorX + 'px';
      cursorGlow.style.top = cursorY + 'px';

      requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Magnetic effect on interactive elements
    const magneticElements = document.querySelectorAll(`
      .btn,
      .contact-link-btn,
      .project-links a,
      .nav a,
      .hero-nav-btn
    `);

    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
      });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ============================================
     LANGUAGE TOGGLE FUNCTIONALITY
     ============================================ */
  function initLanguageToggle() {
    const toggle = document.querySelector('.floating-toggle');
    const body = document.body;

    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const currentLang = body.getAttribute('data-language');
      const newLang = currentLang === 'en' ? 'es' : 'en';

      // Update body attribute
      body.setAttribute('data-language', newLang);

      // Hide all language blocks
      document.querySelectorAll('[lang-block]').forEach(el => {
        el.removeAttribute('data-active');
      });

      // Show new language blocks
      document.querySelectorAll(`[lang-block][data-lang="${newLang}"]`).forEach(el => {
        el.setAttribute('data-active', 'true');
      });

      // Update toggle styling
      const spans = toggle.querySelectorAll('span[data-lang]');
      spans.forEach(span => {
        if (span.getAttribute('data-lang') === newLang) {
          span.classList.remove('inactive');
        } else {
          span.classList.add('inactive');
        }
      });

      // Store preference
      localStorage.setItem('preferred-language', newLang);
    });

    // Load saved preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && savedLang !== body.getAttribute('data-language')) {
      toggle.click();
    }
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignore empty or just "#" links
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      });
    });
  }

  /* ============================================
     HOVER ENHANCEMENTS FOR CARDS
     ============================================ */
  function initCardHoverEffects() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll(`
      .project-card,
      .skill-detail-card,
      .service-card
    `);

    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.25s ease-out';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.25s ease-out';
      });
    });
  }

  /* ============================================
     LAZY LOAD IMAGES
     ============================================ */
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /* ============================================
     HEADER SHADOW ON SCROLL
     ============================================ */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
      } else {
        header.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    });
  }

  /* ============================================
     DYNAMIC YEAR IN FOOTER
     ============================================ */
  function updateFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     INTERSECTION OBSERVER FOR STATISTICS/COUNTERS
     ============================================ */
  function initCounterAnimations() {
    if (prefersReducedMotion) return;

    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              entry.target.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              entry.target.textContent = target;
            }
          };

          updateCounter();
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /* ============================================
     FOCUS TRAP FOR MODALS (If needed)
     ============================================ */
  function initFocusTrap() {
    // Placeholder for modal functionality
    // Add focus trap logic here if modals are implemented
  }

  /* ============================================
     INITIALIZE ALL FEATURES
     ============================================ */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('🚀 Portfolio Interactive Systems Initialized');

    // Initialize all features
    initScrollReveal();
    initMagneticCursor();
    initLanguageToggle();
    initSmoothScroll();
    initCardHoverEffects();
    initLazyLoading();
    initHeaderScroll();
    updateFooterYear();
    initCounterAnimations();

    // Log reduced motion status
    if (prefersReducedMotion) {
      console.log('⚠️  Reduced motion mode active - animations disabled');
    }

    // Add loaded class to body
    document.body.classList.add('loaded');
  }

  // Start initialization
  init();

  /* ============================================
     EXPORT FOR DEBUGGING (Optional)
     ============================================ */
  window.portfolioDebug = {
    prefersReducedMotion,
    reinitialize: init
  };

})();
