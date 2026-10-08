const PHOTOS = [
  { title: 'Between Rides', src: 'public/photoshoot/photo-01.jpeg', featured: true },
  { title: 'A Moment in Blue', src: 'public/photoshoot/photo-02.jpeg' },
  { title: 'In the Mirror', src: 'public/photoshoot/photo-03.jpeg', focus: '50% 20%' },
  { title: 'Among the Blooms', src: 'public/photoshoot/photo-04.jpeg', focus: '50% 0%' },
  { title: 'A Different Chapter', src: 'public/photoshoot/photo-05.jpeg', focus: '50% 25%' },
  { title: 'Golden Hour', src: 'public/photoshoot/photo-06.jpeg' },
  { title: 'A Quiet Visit to the Taj', src: 'public/photoshoot/photo-07.jpeg' },
  { title: 'The Everyday Edit', src: 'public/photoshoot/photo-08.jpeg', focus: '50% 16%' },
  {
    title: 'Where the River Turns',
    src: 'public/photoshoot/landscape-riverside.jpg',
    focus: '82% 42%',
  },
];

const PAGE_SIZE = 8;

export async function initPhotoshoot() {
  const section = document.getElementById('photoshoot');
  const grid = document.getElementById('photoshootGrid');
  const count = document.getElementById('photoshootCount');
  const pagination = document.getElementById('photoshootPagination');
  const viewer = document.getElementById('photoViewer');
  const viewerArt = document.getElementById('photoViewerArt');
  const viewerNumber = document.getElementById('photoViewerNumber');
  const viewerTitle = document.getElementById('photoViewerTitle');

  if (!section || !grid || !count || !pagination || !viewer
      || !viewerArt || !viewerNumber || !viewerTitle) {
    throw new Error('The photoshoot section is missing required interface elements.');
  }

  const state = { page: 1, viewerIndex: 0 };

  const renderGrid = () => {
    const pageCount = Math.max(1, Math.ceil(PHOTOS.length / PAGE_SIZE));
    state.page = Math.min(state.page, pageCount);
    const pagePhotos = PHOTOS.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

    grid.replaceChildren();
    pagePhotos.forEach((photo, index) => {
      const photoIndex = PHOTOS.indexOf(photo);
      const number = String(photoIndex + 1).padStart(2, '0');
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'photo-card';
      if (photo.featured) card.classList.add('photo-card--featured');
      card.dataset.photoIndex = String(photoIndex);
      card.style.setProperty('--card-index', String(index));
      card.setAttribute('aria-label', `Open photo ${number}: ${photo.title}`);

      const indexLabel = document.createElement('span');
      indexLabel.className = 'photo-card__index';
      indexLabel.textContent = `PHOTO / ${number}`;

      const image = document.createElement('img');
      image.className = 'photo-card__image';
      image.src = photo.src;
      image.alt = '';
      image.style.setProperty('--photo-focus', photo.focus || '50% 50%');
      image.loading = 'lazy';
      image.decoding = 'async';

      const label = document.createElement('span');
      label.className = 'photo-card__label';
      label.textContent = `${number} — ${photo.title}`;

      card.append(image, indexLabel, label);
      grid.append(card);
    });

    count.textContent = `${PHOTOS.length} PHOTOS`;
    renderPagination(pageCount);
  };

  const renderPagination = (pageCount) => {
    pagination.replaceChildren();
    const addPageButton = (label, page, options = {}) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'photoshoot__page';
      button.textContent = label;
      button.disabled = Boolean(options.disabled);
      if (options.current) button.setAttribute('aria-current', 'page');
      if (options.label) button.setAttribute('aria-label', options.label);
      button.addEventListener('click', () => {
        state.page = page;
        renderGrid();
      });
      pagination.append(button);
    };

    addPageButton('←', Math.max(1, state.page - 1), {
      disabled: state.page === 1,
      label: 'Previous page',
    });
    for (let page = 1; page <= pageCount; page += 1) {
      addPageButton(String(page), page, {
        current: page === state.page,
        label: `Page ${page}`,
      });
    }
    addPageButton('→', Math.min(pageCount, state.page + 1), {
      disabled: state.page === pageCount,
      label: 'Next page',
    });
  };

  const updateViewer = () => {
    state.viewerIndex = (state.viewerIndex + PHOTOS.length) % PHOTOS.length;
    const photo = PHOTOS[state.viewerIndex];
    const number = String(PHOTOS.indexOf(photo) + 1).padStart(2, '0');
    const image = document.createElement('img');
    image.className = 'photo-viewer__image';
    image.src = photo.src;
    image.alt = photo.title;
    image.decoding = 'async';
    viewerArt.replaceChildren(image);
    viewerNumber.textContent = `${number} / ${String(PHOTOS.length).padStart(2, '0')}`;
    viewerTitle.textContent = photo.title;
  };

  const openViewer = (index) => {
    state.viewerIndex = index;
    updateViewer();
    if (!viewer.open) viewer.showModal();
  };

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-photo-index]');
    if (!card) return;
    openViewer(Number(card.dataset.photoIndex));
  });

  section.querySelector('[data-gallery-slideshow]')?.addEventListener('click', () => openViewer(0));
  section.querySelector('[data-viewer-close]')?.addEventListener('click', () => viewer.close());
  section.querySelector('[data-viewer-prev]')?.addEventListener('click', () => {
    state.viewerIndex -= 1;
    updateViewer();
  });
  section.querySelector('[data-viewer-next]')?.addEventListener('click', () => {
    state.viewerIndex += 1;
    updateViewer();
  });

  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      viewer.close();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      state.viewerIndex -= 1;
      updateViewer();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      state.viewerIndex += 1;
      updateViewer();
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add('is-ready');
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(section);
  } else {
    section.classList.add('is-ready');
  }

  renderGrid();
  return { section, photos: PHOTOS };
}
