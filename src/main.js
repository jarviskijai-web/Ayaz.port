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
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

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
      hero.classList.toggle('is-offstage', offstage);
      hero.inert = offstage;
      if (heroVideo && !reducedMotion) {
        if (offstage) heroVideo.pause();
        else if (heroVideo.paused) {
          Promise.resolve(heroVideo.play())
            .then(() => heroVideo.classList.add('is-playing'))
            .catch(() => {});
        }
      }
    };
    window.addEventListener('scroll', updateHeroHandoff, { passive: true });
    window.addEventListener('resize', updateHeroHandoff, { passive: true });
    updateHeroHandoff();
  }
}

function initializeSections() {
  initHeroInk();
  initializeScrollTransitions();
  initUniverse().catch((error) =>
    console.warn('[portfolio] universe unavailable:', error.message));
  initChrono().catch((error) =>
    console.warn('[portfolio] timeline unavailable:', error.message));
  initGallery().catch((error) =>
    console.warn('[portfolio] projects unavailable:', error.message));
  initPhotoshoot().catch((error) =>
    console.warn('[portfolio] photoshoot unavailable:', error.message));
  initFinale().catch((error) =>
    console.warn('[portfolio] finale unavailable:', error.message));
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
  if (document.fonts) await document.fonts.ready;

  root.classList.remove('is-booting');
  root.classList.add('is-header', 'is-hero-ready');
  if (heroVideo && !reducedMotion) {
    Promise.resolve(heroVideo.play())
      .then(() => heroVideo.classList.add('is-playing'))
      .catch(() => {});
  }
  initializeSections();
}

main().catch((error) => {
  console.error('[portfolio] initialization failed:', error);
  root.classList.remove('is-booting');
  root.classList.add('is-header', 'is-hero-ready', 'is-hero-error');
  initializeSections();
});
