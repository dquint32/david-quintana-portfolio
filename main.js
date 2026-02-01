/* ============================================
   DAVID QUINTANA PORTFOLIO
   Enhanced JavaScript with Cyber-Minimalist Features
   ============================================ */

(function() {
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   LANGUAGE TOGGLE
   ============================================ */
function initLanguageToggle() {
  const toggle = document.querySelector('.floating-toggle');
  const body = document.body;
  
  if (!toggle) return;

  const switchLanguage = (lang) => {
    // Update body attribute
    body.setAttribute('data-language', lang);

    // Handle elements with lang-block attribute and data-lang
    const allLangBlocks = document.querySelectorAll('[lang-block]');

    allLangBlocks.forEach(el => {
      const elLang = el.getAttribute('data-lang');
      
      if (elLang === lang) {
        el.setAttribute('data-active', 'true');
      } else {
        el.setAttribute('data-active', 'false');
      }
    });

    // Update toggle button UI
    const spans = toggle.querySelectorAll('span[data-lang]');
    spans.forEach(span => {
      if (span.getAttribute('data-lang') === lang) {
        span.classList.remove('inactive');
      } else {
        span.classList.add('inactive');
      }
    });

    // Store preference
    localStorage.setItem('preferred-language', lang);
  };

  // Click event
  toggle.addEventListener('click', () => {
    const currentLang = body.getAttribute('data-language') || 'en';
    const newLang = currentLang === 'en' ? 'es' : 'en';
    switchLanguage(newLang);
  });

  // Initialize with saved preference or default to English
  const savedLang = localStorage.getItem('preferred-language') || 'en';
  switchLanguage(savedLang);
}

/* ============================================
   LIGHTBOX MODAL - Enhanced Version
   ============================================ */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const captionText = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!modal || !modalImg || !closeBtn) return;

  // Get all clickable images
  const clickableImages = document.querySelectorAll('.clickable-img');

  // Open lightbox
  function openLightbox(img) {
    modal.style.display = 'flex';
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    
    if (captionText) {
      captionText.textContent = img.alt || 'Project Screenshot';
    }
    
    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightbox() {
    modal.classList.remove('active');
    
    setTimeout(() => {
      modal.style.display = 'none';
      modalImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  // Add click listeners to all clickable images
  clickableImages.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img);
    });
  });

  // Close button
  closeBtn.addEventListener('click', closeLightbox);

  // Click outside image to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Arrow keys for navigation (if multiple images)
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    const currentImg = modalImg.src;
    const allImages = Array.from(clickableImages);
    const currentIndex = allImages.findIndex(img => img.src === currentImg);

    if (e.key === 'ArrowRight' && currentIndex < allImages.length - 1) {
      openLightbox(allImages[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      openLightbox(allImages[currentIndex - 1]);
    }
  });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll(`
    .project-card,
    .skill-detail-card,
    .service-card
  `);

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
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
   PARALLAX SCROLL EFFECT (Subtle)
   ============================================ */
function initParallaxEffect() {
  if (prefersReducedMotion) return;

  const parallaxElements = document.querySelectorAll('.project-screenshot img');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + window.pageYOffset;
      const elementHeight = rect.height;
      
      if (scrolled + window.innerHeight > elementTop && scrolled < elementTop + elementHeight) {
        const parallaxOffset = (scrolled - elementTop) * 0.1;
        el.style.transform = `translateY(${parallaxOffset}px)`;
      }
    });
  });
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
      header.style.background = 'rgba(13, 13, 13, 0.98)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'rgba(13, 13, 13, 0.95)';
    }

    lastScroll = currentScroll;
  });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }
}

/* ============================================
   CYBER CURSOR TRAIL (Subtle)
   ============================================ */
function initCyberCursor() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  const trailElements = [];
  const maxTrails = 5;

  document.addEventListener('mousemove', (e) => {
    // Create trail element
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: var(--cyber-orange);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      opacity: 0.6;
      transform: translate(-50%, -50%);
      animation: trailFade 0.5s ease-out forwards;
    `;

    document.body.appendChild(trail);
    trailElements.push(trail);

    // Remove old trails
    if (trailElements.length > maxTrails) {
      const oldTrail = trailElements.shift();
      oldTrail.remove();
    }

    // Auto-remove after animation
    setTimeout(() => {
      trail.remove();
      const index = trailElements.indexOf(trail);
      if (index > -1) {
        trailElements.splice(index, 1);
      }
    }, 500);
  });

  // Add keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes trailFade {
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
      }
    }
  `;
  document.head.appendChild(style);
}

/* ============================================
   DYNAMIC YEAR IN FOOTER
   ============================================ */
function updateFooterYear() {
  const yearElements = document.querySelectorAll('#year, [data-year]');
  yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ============================================
   INITIALIZE ALL FEATURES
   ============================================ */
function init() {
  console.log('🚀 HCIS Portfolio Interactive Systems Initialized');
  console.log('🎨 Cyber-Minimalist Design Active');

  initLanguageToggle();
  initLightbox();
  initScrollReveal();
  initSmoothScroll();
  initParallaxEffect();
  initHeaderScroll();
  initBackToTop();
  initCyberCursor();
  updateFooterYear();

  if (prefersReducedMotion) {
    console.log('⚠️ Reduced motion mode active - animations disabled');
  }

  document.body.classList.add('loaded');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose debug object
window.portfolioDebug = {
  prefersReducedMotion,
  reinitialize: init
};

})();
