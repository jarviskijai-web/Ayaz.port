// The finale's lifecycle: two portrait photographs share one pinned frame.
// Scrolling through the footer reveals the mirror portrait over the first.
const damp = (v, to, k, dt) => v + (to - v) * (1 - Math.exp(-k * dt));
const sstep = (v) => v * v * v * (v * (v * 6 - 15) + 10);

export async function initFinale() {
  const section = document.getElementById('fin');
  const stage1 = document.getElementById('finStage1');
  const frame1Img = document.getElementById('finFrame1Img');
  const dim = document.getElementById('finDim');
  const frame2 = document.getElementById('finFrame2');
  const frame2Img = document.getElementById('finFrame2Img');
  if (!section) return null;
  if (!stage1 || !frame1Img || !dim || !frame2 || !frame2Img) {
    throw new Error('The finale photo frames are missing required elements.');
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.classList.add('has-finale-js');
  const caps = [...section.querySelectorAll('.f-cap')];
  caps.forEach((el, i) => el.style.setProperty('--li', String(i)));
  section.querySelector('.fin__top')?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  let frame2Ready = false;
  let p2 = 0;
  const revealFrame2 = () => {
    frame2.hidden = false;
  };
  const reportImageError = (image, label) => {
    if (image.complete && image.naturalWidth === 0) {
      console.error(`[portfolio] finale ${label} image could not be loaded: ${image.src}`);
      return;
    }
    image.addEventListener('error', () => {
      console.error(`[portfolio] finale ${label} image could not be loaded: ${image.src}`);
    }, { once: true });
  };

  const frame1Images = [stage1.querySelector('.fin__photo-backdrop'), frame1Img];
  const frame2Images = [frame2.querySelector('.fin__photo-backdrop'), frame2Img];
  if (frame1Images.some((image) => !image) || frame2Images.some((image) => !image)) {
    throw new Error('The finale photo frames are missing responsive image layers.');
  }

  let activeLandscape = null;
  const syncImageSources = () => {
    const landscape = window.matchMedia('(min-aspect-ratio: 1.4/1)').matches;
    activeLandscape = landscape;
    section.classList.toggle('is-landscape', landscape);
    frame2Ready = false;

    const frameReady = (images) => images.every(
      (image) => image.complete && image.naturalWidth > 0,
    );
    const checkFrame2Ready = () => {
      if (activeLandscape !== landscape || !frameReady(frame2Images)) return;
      frame2Ready = true;
      revealFrame2();
    };
    frame2Images.forEach((image) => {
      image.addEventListener('load', checkFrame2Ready, { once: true });
    });

    [...frame1Images, ...frame2Images].forEach((image, index) => {
      const label = index < frame1Images.length ? 'red-wall' : 'mirror';
      reportImageError(image, label);
      const source = landscape ? image.dataset.landscapeSrc : image.dataset.portraitSrc;
      if (!source) return;
      if (image.getAttribute('src') !== source) {
        image.src = source;
      } else if (index >= frame1Images.length) {
        checkFrame2Ready();
      }
    });
    checkFrame2Ready();
  };

  let resizeId;
  function place() {
    section.classList.toggle('is-portrait',
      window.innerWidth / window.innerHeight < 0.75);
    syncImageSources();
  }
  place();
  window.addEventListener('resize', () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(place, 140);
  });

  const state = { running: false, visible: false, raf: 0, last: 0 };

  const scrollProgress = () => {
    const room = section.offsetHeight - window.innerHeight;
    return room > 4
      ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / room))
      : 0;
  };
  const revealAtProgress = (progress) => {
    if (state.visible || progress > 0.08) section.classList.add('is-caps');
    if (state.visible || reduced || progress > 0.3) section.classList.add('is-bar');
  };
  const onScroll = () => revealAtProgress(scrollProgress());
  window.addEventListener('scroll', onScroll, { passive: true });
  revealAtProgress(scrollProgress());

  const frame = (now) => {
    if (!state.running) return;
    const dt = Math.min(0.05, (now - state.last) / 1000 || 0.016);
    state.last = now;
    const r = section.getBoundingClientRect();
    const room = section.offsetHeight - window.innerHeight;
    const raw = room > 4 ? Math.min(1, Math.max(0, -r.top / room)) : 0;
    revealAtProgress(raw);

    if (frame2Ready) {
      p2 = reduced ? raw : damp(p2, raw, 6.0, dt);
      const e = sstep(Math.min(1, Math.max(0, (p2 - 0.08) / 0.78)));
      frame2.style.transform = `translate3d(${((e - 1) * 103).toFixed(3)}%, 0, 0)`;
      if (!reduced && e > 0.001 && e < 0.995) {
        frame2.style.filter =
          `blur(${((1 - e) * 6).toFixed(2)}px) brightness(${(0.72 + 0.28 * e).toFixed(3)})`;
      } else if (frame2.style.filter) {
        frame2.style.filter = '';
      }
      if (stage1) stage1.style.transform = `translate3d(${(e * 4.5).toFixed(3)}%, 0, 0)`;
      if (dim) dim.style.opacity = (e * 0.5).toFixed(3);
    }

    state.raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (state.running) return;
    revealAtProgress(scrollProgress());
    state.running = true;
    state.last = performance.now();
    state.raf = requestAnimationFrame(frame);
  };
  const stop = () => { state.running = false; cancelAnimationFrame(state.raf); };

  new IntersectionObserver((entries) => {
    for (const e of entries) {
      state.visible = e.isIntersecting;
      if (e.isIntersecting) start(); else stop();
    }
  }, { threshold: 0.30 }).observe(section);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stop();
    else if (state.visible) start();
  });

  window.__finale = { state, section, frame1Img, frame2, frame2Img };

  return { section, frame1Img, frame2, frame2Img };
}
