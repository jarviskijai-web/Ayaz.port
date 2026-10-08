const TRAIL_MS = 620;
const MAX_POINTS = 26;
const SAMPLE_GAP = 18;

export function initHeroInk() {
  const heading = document.getElementById('heroTitle');
  if (!heading || !heading.querySelector('.hero__name-reveal')) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const points = [];
  let last = null;
  let frame = 0;
  let reducedTimer = 0;

  const clearTrail = () => {
    points.length = 0;
    last = null;
    heading.classList.remove('has-ink-trail');
    heading.style.removeProperty('--hero-ink-mask');
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const setMask = (now) => {
    const rect = heading.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    for (let i = points.length - 1; i >= 0; i--) {
      if (now - points[i].born >= TRAIL_MS) points.splice(i, 1);
    }

    if (!points.length) {
      clearTrail();
      return;
    }

    const masks = points.map((point) => {
      const age = Math.min(1, (now - point.born) / TRAIL_MS);
      const opacity = (1 - age) ** 1.5;
      const radius = 58 + (1 - age) * Math.min(38, rect.height * 0.3);
      const x = `${(point.x * 100).toFixed(2)}%`;
      const y = `${(point.y * 100).toFixed(2)}%`;
      return `radial-gradient(circle ${radius.toFixed(1)}px at ${x} ${y}, rgba(255,255,255,${opacity.toFixed(3)}) 0%, rgba(255,255,255,${(opacity * 0.72).toFixed(3)}) 42%, transparent 100%)`;
    });

    heading.style.setProperty('--hero-ink-mask', masks.join(', '));
    heading.classList.add('has-ink-trail');
  };

  const animate = (now) => {
    setMask(now);
    if (points.length) frame = requestAnimationFrame(animate);
    else frame = 0;
  };

  const addPoint = (event) => {
    const rect = heading.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const current = {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    };
    const now = performance.now();

    if (reduced) {
      points.length = 0;
      points.push({ ...current, born: now });
      setMask(now);
      clearTimeout(reducedTimer);
      reducedTimer = window.setTimeout(clearTrail, 260);
      last = current;
      return;
    }

    if (last) {
      const distance = Math.hypot((current.x - last.x) * rect.width, (current.y - last.y) * rect.height);
      if (distance < 2.5) return;
      const steps = Math.min(12, Math.max(1, Math.ceil(distance / SAMPLE_GAP)));
      for (let step = 1; step <= steps; step++) {
        const mix = step / steps;
        points.push({
          x: last.x + (current.x - last.x) * mix,
          y: last.y + (current.y - last.y) * mix,
          born: now - (steps - step) * 5,
        });
      }
    } else {
      points.push({ ...current, born: now });
    }

    if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);
    last = current;
    setMask(now);
    if (!frame) frame = requestAnimationFrame(animate);
  };

  heading.addEventListener('pointerenter', addPoint, { passive: true });
  heading.addEventListener('pointermove', addPoint, { passive: true });
  heading.addEventListener('pointerdown', addPoint, { passive: true });
  heading.addEventListener('pointerleave', () => { last = null; }, { passive: true });
  heading.addEventListener('pointercancel', () => { last = null; }, { passive: true });
  window.addEventListener('resize', clearTrail, { passive: true });
}