export async function initUniverse() {
  const section = document.getElementById('universe');
  const background = document.getElementById('uniBackground');
  const demo = document.getElementById('uniDemo');
  if (!section || !background || !demo) {
    throw new Error('Scene 2 is missing its background, 3D demo, or section.');
  }

  if (!background.complete) {
    await new Promise((resolve) => {
      background.addEventListener('load', resolve, { once: true });
      background.addEventListener('error', resolve, { once: true });
    });
  }
  if (!background.naturalWidth) {
    throw new Error('Scene 2 background could not be loaded.');
  }

  if (demo.contentDocument?.readyState !== 'complete') {
    await new Promise((resolve, reject) => {
      demo.addEventListener('load', resolve, { once: true });
      demo.addEventListener('error', () => reject(
        new Error('Scene 2 3D demo could not be loaded.'),
      ), { once: true });
    });
  }
  if (!demo.contentWindow?.THREE || !demo.contentDocument?.querySelector('canvas')) {
    throw new Error('Scene 2 Three.js tiles did not initialize.');
  }

  section.classList.add('is-motion-ready');
  const updateProgress = () => {
    const rect = section.getBoundingClientRect();
    const distance = window.innerHeight + section.offsetHeight;
    const progress = Math.min(1, Math.max(0,
      (window.innerHeight - rect.top) / Math.max(distance, 1)));
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    section.classList.toggle('is-on', visible);
    demo.contentWindow?.postMessage({
      type: 'portfolio:universe-progress', progress, visible,
    }, location.origin);
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('message', (event) => {
    if (event.source !== demo.contentWindow
        || event.origin !== location.origin
        || event.data?.type !== 'portfolio:section-step') return;
    window.dispatchEvent(new CustomEvent('portfolio:section-step', {
      detail: event.data,
    }));
  });
  updateProgress();
  return { section, background, demo };
}
