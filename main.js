// ==========================================
// 1. Language Toggle System
// ==========================================
const body = document.body;
const floatingToggle = document.querySelector(".floating-toggle");

function setLanguage(lang) {
  body.setAttribute("data-language", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[lang-block]").forEach((el) => {
    if (el.dataset.lang === lang) {
      el.dataset.active = "true";
    } else {
      el.dataset.active = "false";
    }
  });

  if (floatingToggle) {
    const enSpan = floatingToggle.querySelector('[data-lang="en"]');
    const esSpan = floatingToggle.querySelector('[data-lang="es"]');
    
    if (lang === "en") {
      if (enSpan) enSpan.classList.remove("inactive");
      if (esSpan) esSpan.classList.add("inactive");
    } else {
      if (esSpan) esSpan.classList.remove("inactive");
      if (enSpan) enSpan.classList.add("inactive");
    }
  }

  localStorage.setItem("preferred-lang", lang);
}

if (floatingToggle) {
  const toggleSpans = floatingToggle.querySelectorAll('span[data-lang]');
  toggleSpans.forEach(span => {
    span.addEventListener("click", (e) => {
      e.stopPropagation();
      setLanguage(span.dataset.lang);
    });
  });

  floatingToggle.addEventListener("click", () => {
    const currentLang = body.getAttribute("data-language") || "en";
    setLanguage(currentLang === "en" ? "es" : "en");
  });
}

const savedLang = localStorage.getItem("preferred-lang") || "en";
setLanguage(savedLang);

// ==========================================
// 2. Image Modal / Lightbox Logic
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage'); 
    const clickableImages = document.querySelectorAll('.clickable-img');
    const closeButton = document.querySelector('.modal-close');

    if (modal && modalImg) {
        clickableImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                modal.classList.add('modal-active');
                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');
                modalImg.src = this.src;
                modalImg.alt = this.alt;
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    modal.style.opacity = '1';
                }, 10);
            });
        });

        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.classList.remove('modal-active');
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }, 300);
        };

        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal();
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-content-wrapper')) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
                closeModal();
            }
        });
    }
});

// ==========================================
// 3. Footer Year Auto-Update
// ==========================================
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}