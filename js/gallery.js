// ============================================
// MADE WITH BEANS — Gallery page logic
// Renders artwork cards + handles detail modal
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderGalleryGrid();
  initArtModal();
});

function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!grid || typeof ARTWORKS === 'undefined') return;

  grid.innerHTML = ARTWORKS.map(art => {
    const isSold = art.availability === 'sold';
    return `
      <article class="gallery-card reveal">
        <button class="art-frame" data-art-id="${art.id}" aria-label="View details for ${art.title}">
          ${isSold ? '<span class="sold-badge">Sold Out</span>' : ''}
          <img src="${art.image}" alt="${art.title} — coffee painting, ${art.dims}" loading="lazy">
        </button>
        <div class="card-info">
          <div>
            <h3>${art.title}</h3>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // re-init reveal observer for newly added cards
  initScrollReveal();
}

function initArtModal() {
  const overlay = document.getElementById('artModalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const img = document.getElementById('modalImg');
  const title = document.getElementById('modalTitle');
  const dims = document.getElementById('modalDims');
  const availabilityEl = document.getElementById('modalAvailability');
  const desc = document.getElementById('modalDesc');
  const emailBtn = document.getElementById('modalEmailBtn');

  if (!overlay) return;

  function openModalForArt(artId) {
    const art = ARTWORKS.find(a => a.id === artId);
    if (!art) return;

    img.src = art.image;
    img.alt = `${art.title} — full view, coffee painting, ${art.dims}`;
    title.textContent = art.title;
    dims.textContent = art.dims;
    desc.textContent = art.description;

    const availInfo = AVAILABILITY_LABELS[art.availability] || AVAILABILITY_LABELS['available'];
    availabilityEl.textContent = availInfo.text;
    availabilityEl.className = 'availability-badge ' + availInfo.className;

    emailBtn.href = `mailto:coffee@madewithbeans.com?subject=${encodeURIComponent('Inquiry about "' + art.title + '"')}&body=${encodeURIComponent('Hi! I\'m interested in "' + art.title + '" (' + art.dims + '). Could you tell me more about availability?')}`;
    emailBtn.textContent = art.availability === 'sold' ? 'Ask about prints' : 'Email to inquire';

    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('[data-art-id]').forEach(el => {
    el.addEventListener('click', () => openModalForArt(el.getAttribute('data-art-id')));
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
}
