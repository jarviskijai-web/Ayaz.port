import { initUniverse } from './scene2/boot2.js';
import { initChrono } from './scene3/boot3.js';
import { initGallery } from './scene4/boot4.js';
import { initFinale } from './scene6/boot6.js';
import { initPhotoshoot } from './scene5/photoshoot.js';
import { initHeroInk } from './scene/hero-ink.js';

const root = document.documentElement;
const hero = document.querySelector('.stage-wrap');
const heroImage = document.querySelector('.hero__media img');
const heroVideo = document.querySelector('.hero__video');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowData = navigator.connection?.saveData === true;
const allowHeroVideo = Boolean(heroVideo)
  && !reducedMotion
  && !lowData;
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

function syncHeroVideo(visible) {
  if (!heroVideo) return;
  if (!visible || !allowHeroVideo) {
    heroVideo.pause();
    return;
  }
  if (heroVideo.paused) {
    Promise.resolve(heroVideo.play())
      .then(() => heroVideo.classList.add('is-playing'))
      .catch(() => {});
  }
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
menu?.querySelectorAll('a').forEach((link, index) => {
  link.style.setProperty('--i', index);
});

function setMenu(open) {
  if (!burger || !menu) return;
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  root.classList.toggle('is-menu', open);
  if (open) menu.hidden = false;
  else setTimeout(() => {
    if (!root.classList.contains('is-menu')) menu.hidden = true;
  }, 500);
}

function initializeScrollTransitions() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  gallery.classList.add('has-scroll-motion');
  if (!('IntersectionObserver' in window)) {
    gallery.classList.add('is-in-view');
    return;
  }
  const observer = new IntersectionObserver(([entry]) => {
    gallery.classList.toggle('is-in-view', entry.isIntersecting);
  }, { threshold: 0.08 });
  observer.observe(gallery);
}

function initializeSnapNavigation() {
  const panels = [...document.querySelectorAll(
    '.hero-spacer, #universe, #chrono, #gallery, #photoshoot, #fin',
  )];
  let locked = false;
  let releaseTimer = 0;
  let revealTimer = 0;
  const reveal = document.createElement('div');
  reveal.className = 'scene-clock-reveal';
  reveal.setAttribute('aria-hidden', 'true');
  reveal.innerHTML = '<span class="scene-clock-reveal__rays"></span>'
    + '<span class="scene-clock-reveal__dial"></span>'
    + '<span class="scene-clock-reveal__hand"></span>'
    + '<span class="scene-clock-reveal__pin"></span>';
  document.body.append(reveal);

  const playReveal = (panel, direction) => {
    if (reducedMotion) return;
    const style = getComputedStyle(panel);
    const accent = ['--ember', '--photo-red', '--ink-hot', '--amber']
      .map((name) => style.getPropertyValue(name).trim())
      .find(Boolean) || '#ff4938';
    reveal.style.setProperty('--scene-accent', accent);
    reveal.classList.toggle('is-reverse', direction < 0);
    reveal.classList.remove('is-running');
    void reveal.offsetWidth;
    reveal.classList.add('is-running');
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(() => reveal.classList.remove('is-running'), 780);
  };

  const slideTo = (top) => {
    window.scrollTo({ top, behavior: 'instant' });
  };

  const holdInput = () => {
    locked = true;
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(() => { locked = false; }, 620);
  };

  const step = (direction, { touch = false } = {}) => {
    if ((locked && !touch) || !direction) return;
    let current = 0;
    let nearest = Infinity;
    panels.forEach((panel, index) => {
      const distance = Math.abs(panel.getBoundingClientRect().top);
      if (distance < nearest) {
        current = index;
        nearest = distance;
      }
    });

    const next = Math.max(0, Math.min(panels.length - 1, current + Math.sign(direction)));
    if (next === current) return;
    if (!touch) holdInput();
    const top = window.scrollY + panels[next].getBoundingClientRect().top;
    slideTo(top);
    playReveal(panels[next], Math.sign(direction));
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    if (locked) return;
    step(event.deltaY);
  }, { passive: false });

  let touchStart = null;
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  window.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch' || !touchStart) return;
    const deltaX = event.clientX - touchStart.x;
    const deltaY = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(deltaY) > 48 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      step(deltaY < 0 ? 1 : -1, { touch: true });
    }
  }, { passive: true });
  window.addEventListener('pointercancel', () => { touchStart = null; }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if ((event.code === 'Space' || event.key === 'ArrowDown' || event.key === 'ArrowUp')
        && event.target.closest('a, button, [role="button"]')) return;

    if (event.code === 'Space' || event.key === 'PageDown' || event.key === 'ArrowDown') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'PageUp' || event.key === 'ArrowUp') {
      event.preventDefault();
      step(-1);
    }
  });

  window.addEventListener('portfolio:section-step', (event) => {
    step(event.detail?.direction, { touch: event.detail?.input === 'touch' });
  });
}

function initializeDeferredScenes() {
  const scenes = [
    ['chrono', initChrono, 'timeline'],
    ['gallery', initGallery, 'projects'],
    ['fin', initFinale, 'finale'],
  ].map(([id, initialize, label]) => ({
    element: document.getElementById(id),
    initialize,
    label,
  })).filter((scene) => scene.element);

  const start = ({ initialize, label }) => {
    Promise.resolve().then(initialize).catch((error) =>
      console.warn(`[portfolio] ${label} unavailable:`, error.message));
  };

  if (!('IntersectionObserver' in window)) {
    scenes.forEach(start);
    return;
  }

  const pending = new Map(scenes.map((scene) => [scene.element, scene]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const scene = pending.get(entry.target);
      pending.delete(entry.target);
      if (scene) start(scene);
    });
  }, { rootMargin: `${Math.max(window.innerHeight, 640)}px 0px` });

  scenes.forEach(({ element }) => observer.observe(element));
}

burger?.addEventListener('click', () =>
  setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && root.classList.contains('is-menu')) setMenu(false);
});

if (hero && 'IntersectionObserver' in window) {
  const spacer = document.querySelector('.hero-spacer');
  if (spacer) {
    const updateHeroHandoff = () => {
      const progress = Math.min(1, Math.max(0,
        spacer.getBoundingClientRect().bottom / Math.max(window.innerHeight, 1)));
      const offstage = progress <= 0.001;
      hero.style.setProperty('--hero-scroll-opacity', progress.toFixed(3));
      hero.style.setProperty('--hero-scroll-tilt', `${((1 - progress) * 5).toFixed(2)}deg`);
      hero.style.setProperty('--hero-scroll-scale', (1 + (1 - progress) * 0.035).toFixed(4));
      hero.classList.toggle('is-offstage', offstage);
      hero.inert = offstage;
      syncHeroVideo(!offstage);
    };
    let handoffFrame = 0;
    const scheduleHeroHandoff = () => {
      if (handoffFrame) return;
      handoffFrame = requestAnimationFrame(() => {
        handoffFrame = 0;
        updateHeroHandoff();
      });
    };
    window.addEventListener('scroll', scheduleHeroHandoff, { passive: true });
    window.addEventListener('resize', scheduleHeroHandoff, { passive: true });
    updateHeroHandoff();
  }
}

function initializeSections() {
  initHeroInk();
  initializeScrollTransitions();
  initializeSnapNavigation();
  initUniverse().catch((error) =>
    console.warn('[portfolio] universe unavailable:', error.message));
  initPhotoshoot().catch((error) =>
    console.warn('[portfolio] photoshoot unavailable:', error.message));
  initializeDeferredScenes();
}

async function main() {
  if (!hero || !heroImage) {
    throw new Error('The hero section or its image is missing.');
  }

  if (!heroImage.complete) {
    await new Promise((resolve) => {
      heroImage.addEventListener('load', resolve, { once: true });
      heroImage.addEventListener('error', resolve, { once: true });
    });
  }
  if (!heroImage.naturalWidth) {
    console.error('[portfolio] hero image could not be loaded.');
    root.classList.add('is-hero-error');
  }
  syncHeroVideo(true);
  if (document.fonts) await document.fonts.ready;

  root.classList.remove('is-booting');
  root.classList.add('is-header', 'is-hero-ready');
  syncHeroVideo(true);
  initializeSections();
}

main().catch((error) => {
  console.error('[portfolio] initialization failed:', error);
  root.classList.remove('is-booting');
  root.classList.add('is-header', 'is-hero-ready', 'is-hero-error');
  initializeSections();
});
