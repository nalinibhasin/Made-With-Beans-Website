// ============================================
// MADE WITH BEANS — Shared site behavior
// Burger menu, scroll reveals
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initFeaturedCarousel();
  initCommissionConveyor();
  initBurgerMenu();
  initScrollReveal();
});

function initBurgerMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const menuPanel = document.querySelector('.menu-panel');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.menu-close');

  if (!burgerBtn || !menuPanel || !menuOverlay) return;

  function openMenu() {
    menuPanel.classList.add('is-open');
    menuOverlay.classList.add('is-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    // focus first link for keyboard users
    const firstLink = menuPanel.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    menuPanel.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    burgerBtn.focus();
  }

  burgerBtn.addEventListener('click', () => {
    const isOpen = menuPanel.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  if (menuClose) menuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuPanel.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Mark active page link (mobile menu + desktop nav)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-list a, .desktop-nav a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('is-active');
    }
  });
}


function initFeaturedCarousel() {
  if (typeof ARTWORKS === "undefined") return;

  const image = document.getElementById("featuredImage");
  if (!image) return;

  let current = 0;

  function showArtwork(index) {
    const art = ARTWORKS[index];
    const preload = new Image();
    preload.src = art.image;

    preload.onload = () => {
      image.style.opacity = 0;
      setTimeout(() => {
        image.src = art.image;
        image.alt = art.title;
        image.style.opacity = 1;
      }, 500);
    };
  }

  setInterval(() => {
    current = (current + 1) % ARTWORKS.length;
    showArtwork(current);
  }, 5000);
}

function initCommissionConveyor() {
  if (typeof COMMISSION_IMAGES === "undefined") return;

  const track = document.getElementById("conveyorTrack");
  if (!track) return;

  const slides = COMMISSION_IMAGES.map(image =>
    `<img src="${image}" alt="Commission artwork">`
  ).join("");

  track.innerHTML = slides + slides;
}


function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}
