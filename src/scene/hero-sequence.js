const FRAME_COUNT = 240;
const CACHE_RADIUS = 30;
const RECENTER_DISTANCE = 8;

export function initHeroSequence(canvas) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => { };
  }

  const context = canvas.getContext('2d');
  if (!context) {
    console.error('[portfolio] hero sequence canvas is unavailable.');
    return () => { };
  }

  const frames = new Map();
  const pendingFrames = new Map();
  let activeIndex = 0;
  let windowCenter = -Infinity;
  let lastIndex = 0;
  let lastDrawnIndex = -1;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let pixelRatio = 0;

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(bounds.width * ratio);
    const height = Math.round(bounds.height * ratio);
    if (width === canvasWidth && height === canvasHeight && ratio === pixelRatio) return;

    canvasWidth = width;
    canvasHeight = height;
    pixelRatio = ratio;
    canvas.width = width;
    canvas.height = height;
    lastDrawnIndex = -1;
  }

  function drawFrame(index, image) {
    resizeCanvas();
    if (!canvasWidth || !canvasHeight) return;

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;

    if (imageRatio > canvasRatio) {
      sourceWidth = image.naturalHeight * canvasRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / canvasRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvasWidth,
      canvasHeight,
    );
    lastDrawnIndex = index;
    canvas.classList.add('is-ready');
  }

  function drawClosestFrame() {
    if (frames.has(activeIndex)) {
      drawFrame(activeIndex, frames.get(activeIndex));
      return;
    }

    let closestIndex = -1;
    let closestDistance = CACHE_RADIUS + 1;
    for (const [index, image] of frames) {
      const distance = Math.abs(index - activeIndex);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    }
    if (closestIndex >= 0 && closestIndex !== lastDrawnIndex) {
      drawFrame(closestIndex, frames.get(closestIndex));
    }
  }

  function requestFrame(index) {
    if (frames.has(index) || pendingFrames.has(index)) return;

    const image = new Image();
    pendingFrames.set(index, image);
    image.decoding = 'async';
    image.onload = () => {
      pendingFrames.delete(index);
      if (Math.abs(index - activeIndex) <= CACHE_RADIUS * 2) {
        frames.set(index, image);
      }
      drawClosestFrame();
    };
    image.onerror = () => {
      pendingFrames.delete(index);
      console.warn(`[portfolio] hero frame ${index + 1} could not be loaded.`);
    };
    image.src = `/hero-sequence/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;
  }

  function updateWindow(direction) {
    if (Math.abs(activeIndex - windowCenter) < RECENTER_DISTANCE) return;
    windowCenter = activeIndex;

    for (const index of frames.keys()) {
      if (Math.abs(index - windowCenter) > CACHE_RADIUS * 2) frames.delete(index);
    }

    requestFrame(activeIndex);
    for (let distance = 1; distance <= CACHE_RADIUS; distance += 1) {
      const preferred = activeIndex + distance * direction;
      const other = activeIndex - distance * direction;
      if (preferred >= 0 && preferred < FRAME_COUNT) requestFrame(preferred);
      if (other >= 0 && other < FRAME_COUNT) requestFrame(other);
    }
  }

  // Seed the first neighborhood through the same cache used during scroll.
  // This prevents the initial frames from being downloaded twice when the
  // first scroll update fills the active window.
  for (let i = 0; i <= CACHE_RADIUS; i += 1) requestFrame(i);

  return (progress) => {
    activeIndex = Math.round((1 - progress) * (FRAME_COUNT - 1));
    const direction = activeIndex >= lastIndex ? 1 : -1;
    lastIndex = activeIndex;
    updateWindow(direction);
    drawClosestFrame();
  };
}
