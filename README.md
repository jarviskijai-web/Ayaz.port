# GIREESH — cinematic portfolio

Two scenes so far, both WebGL, no frameworks and no build step.

**Scene 1 — the opening.** Black screen → the man walks out of the dark → the
GIREESH wordmark materialises behind him → chips, arrows and dots snap into
place → header draws itself in → the composition settles and breathes.

**Scene 2 — the creative universe.** A supplied cinematic background plate
with the existing procedural WebGL2 tool cards composited transparently above
it. Rendering pauses while the section is off screen or the browser tab is
hidden.

**Scene 3 — the time machine.** A warm black room → the timeline rail draws
itself → a giant clock resolves → six year cards arrive → the floor mechanism
turns → and then the visitor takes control: moving the cursor swings the clock
hand across 2021–2026, and whichever year it points at lights up.

## Run it

```bash
python tools/serve.py 5173
```

then open http://localhost:5173. Any static file server works in production —
there is nothing to compile.

Review helpers (dev only):

- `?t=3.2` starts the timeline at 3.2s; `?t=end` jumps to the settled hero.
- `window.__shot('name')` in the console saves the current canvas to `shots/`.
- `window.__tune('wear', 0.5)` live-adjusts letter distressing
  (`wear`, `wearGain`, `wearScale`).

## How the transparent video works (the part people ask about)

The original footage is a person on a white studio backdrop. The white is
removed **offline** by `tools/matte.py` (border-connected background modelling,
fractional-coverage estimation for hair, motion-adaptive temporal smoothing),
and the result is packed into a normal H.264/VP9 video that is **double width:
colour on the left half, alpha matte on the right half**.

At runtime the WebGL compositor samples both halves and rebuilds true
per-pixel transparency. This works in every browser — including Safari, which
supports neither WebM alpha nor Windows-encodable HEVC alpha — and it means
there is never a white rectangle, ever.

The compositor also does the integration work: film grain, vignette, a red
ember behind the type, a contact shadow cast onto the letters, red rim light
gated to the rows where the wordmark actually passes behind him, and a
dissolve at the video's loop point so the cut is never visible.

## Replacing the videos later

1. Drop the new file into `assets_src/` (e.g. `v1.mp4` — white/light backdrop,
   subject roughly centred).
2. Adjust `CLIPS` in `tools/build_media.py` if the name or length changed.
   The two spare clips from the original shoot are still listed there,
   commented out, with working matte presets in `tools/matte.py`.
3. Rebuild:

   ```bash
   python tools/build_media.py
   python tools/track.py
   ```

That regenerates `public/media/*` (packed clips, posters, `manifest.json` with
per-frame subject tracking — the site anchors the man by his *feet*, not by the
video rectangle, which is why his scale holds while he walks toward camera).

## Scene 2: cinematic plate and interactive tiles

The section uses the provided `public/media/universe-background.png` as a
full-bleed environmental image. The original `src/scene2/tools-3d.html` demo is
embedded above it in a transparent iframe. It uses Three.js r128, its original
extruded tile treatment, and the project's existing `public/tools/` logos.
Tiles sit around the background figure; hover motion affects only the tile
under the pointer, and tapping a tile opens its tool link. The surrounding
layout also removes the demo's decorative floating cubes so the figure stays
clear.

## Scene 3: how it is put together

WebGL draws the room, the reflective floor and its turning ring mechanism, the
clock, the timeline rail and the figure. The six year cards are **DOM**, unlike
scene two's tool cards — each carries real body copy that has to stay crisp,
selectable and reachable by a screen reader, and each is a real `<button>`, so
keyboard and touch support come almost free. They are positioned by JS from the
same fitted geometry the canvas draws with, so the two layers cannot drift.

**The timeline is a measured circle.** The six nodes were located by detecting
their glow in the reference, and a least-squares circle fit through them closed
to within ±3px — so it is rebuilt as a real arc rather than a spline through
eyeballed points.

**The cursor→year mapping is the section.** Raw cursor-x would be wrong: the
timeline descends across the frame, so the same x means different years
depending on how high the pointer sits. The cursor is instead projected onto the
polyline through the card centres, which yields a CONTINUOUS position along the
timeline. Verified: aiming at each card centre reads exactly 0…5; halfway
between two cards reads exactly x.5; and aiming 160px ABOVE the rail still picks
the right year, which is the case plain cursor-x gets wrong. The hand reads that
continuum (so it can sit between years and moves with inertia), while the cards
read its rounded value. The hand sweeps 113.5° from 2021 to 2026.

**The clock is the reference's clock.** A shaded ball pivot with two hands
hanging from it like a set of dividers 74° apart — the beam leg carrying the
bright primary hand, and an ornate companion with a pierced screw-head ornament
partway down and a needle tip. The beam is a cone with a hot core that lands as
a red flood exactly on the active year's node (`uTarget`), so the clock reads
as PROJECTING light into the timeline rather than merely pointing at it.

**The figure is lit the reference's way** — not brightened. A warm pool on the
floor behind him (the room pass knows where he stands via `uFig`), rim light
wrapping both edges, a faint floor bounce up his legs, and the nearest ring
arcs drawn in a separate pass IN FRONT of his shoes so he stands inside the
floor mechanism, not on a printed backdrop.

**He stands in front of his journey.** On a desktop frame the figure and the
near ring arcs render on a second, transparent WebGL canvas stacked OVER the
DOM card deck — slightly left of centre, a step nearer than the ring centre,
his silhouette crossing the card edges rather than sitting buried behind them.
The layer is `pointer-events: none`, so the cards under him stay hoverable and
clickable. Portrait keeps him on the main canvas behind the single staged card
(there the card is the content), and a browser that refuses a second context
simply falls back to the same.

**Control is handed over, not switched.** During the intro the sequence owns the
hand; afterwards the pointer does. The two are blended on a `handAuthority`
ramp, so the hand never jumps at the moment the scene goes live.

**Portrait is a different composition**, not a scaled one: mapped straight onto
a tall screen the arc collapses into a 60px band with all six cards on top of
each other. On a phone the timeline stands up — the years become a vertical rail
of tap targets down the left, and one card at a time holds the stage beside it.

Cost: ~0.1 ms of CPU per frame (six fullscreen shader passes).

### Tuning scene 3

- `window.__chrono` — the live scene; set `.targetU` (0–5) to drive the hand.
- `window.__shot3('name', 9)` — render at t = 9s and save to `shots/`.
- Beats in `src/scene3/timeline3.js`; all measured geometry in `layout3.js`.

## Scene 4: how it is put together

The project universe is the supplied reference image rebuilt as living
layers, so fidelity is exact by construction rather than by imitation.
`tools/extract_s4.py` cuts the reference apart: the twelve project screens
become sprites (each cropped on its measured outline plus its own rim glow,
with the figure's occlusion inpainted and any nearer card's overlap removed,
so nothing ghosts when the deck moves), the creator becomes a matted sprite
with the reference's lighting baked in, and what remains — floor, wet
reflections, circle, overhead structure, corner slabs — becomes the
environment plate.

**The canvas lights the plate rather than painting a room** (`F4_ROOM`): a
staged blackout wakes zone by zone — overhead structure first, floor circle
ignition with a travelling spark, full exposure only once the deck has
assembled — plus live extras riding the baked pixels: breathing glints on the
floor ellipses, rim shimmer on the ring, a wet-floor grain that keeps the
reflections moving, pointer parallax and a scroll dolly.

**The cards are DOM buttons wearing the sprites**, placed through the same
`fitCover()` mapping the shader samples with, so canvas and DOM cannot
drift. The entrance is one system: depth-sorted far row first, each card
rising from below with rotation, blur→sharp and a small overshoot
(`popEase`), then an infinite dephased float. Pointer moves the whole
universe by depth — near flanks hardest, the far row least, the deck yawing
a couple of degrees, the figure countering — and hovering a card lifts it
toward the camera while its siblings ease back.

**Portrait is a recomposition** (`layout4.PORTRAIT`): the plate still
cover-fits so the floor circle and figure survive centred, and a curated
seven-card column keeps the hierarchy — hero screen up top, small row over
his shoulders, the two green closers at his feet.

### Tuning scene 4

- `window.__gallery` — the live scene; `.gallery.dolly`, `.gallery.par`.
- `window.__shot4('name', 9)` — render the environment canvas at t = 9s.
- Beats in `src/scene4/timeline4.js`; sprite boxes + depths in `layout4.js`.

## Developer Photoshoot gallery

The `#photoshoot` section follows Projects and uses an editorial black-and-red
gallery treatment. It displays nine original JPEGs from `public/photoshoot/`;
the source files are copied unchanged, and the red tint is applied with CSS.
Each photo has a matching caption. The gallery uses eight-photo pagination and
an image viewer with previous/next and keyboard arrow navigation. Gallery
content and image paths are defined in `src/scene5/photoshoot.js`.

## The finale: how it is put together

The closing section is a 240svh pinned sequence. Its first frame uses the
red-wall portrait (`public/photoshoot/photo-02.jpeg`) on portrait screens; as
the user scrolls, the mirror selfie (`public/photoshoot/photo-08.jpeg`) slides
in over it. On wide screens (aspect ratio 1.4:1 or greater), the first frame
switches to the provided 16:9 Taj Mahal image (`landscape-taj.png`) and the
second to a correctly oriented 16:9 riverside photo (`landscape-riverside.jpg`).
Portrait images stay uncropped on phones; landscape images fill wide frames.
A restrained CSS red tint, the original captions, and the footer row remain
layered above the images.

### Tuning the finale

- `window.__finale` — the live section and its two image frames.
- Scroll timing and caption timing are managed in `src/scene6/boot6.js` and
  `src/scene6/timeline6.js`.

## Layout truth

Every position in `src/scene/layout.js` was **measured off the supplied
reference art**, not eyeballed: word ink box 3.31%→96.75% × cap 27.0%→80.2%,
chip and dot positions likewise. The wordmark is rendered live (self-hosted
Anton, horizontally solved to the reference's 3.121 width:cap ratio) into a
glyph atlas, surfaced with a seamless distress tile synthesised from the
supplied artwork's own scratches (`public/tex/grunge.png`).

## Map

```
index.html                 markup: header, furniture, boot veil
src/main.js                boot gate, clock, cues, pointer, reduced-motion
src/scene/timeline.js      every beat of the opening, in seconds
src/scene/layout.js        reference-measured geometry, responsive fitting
src/scene/type.js          glyph atlas + per-letter metrics
src/scene/furniture.js     DOM layer wiring (welcome, chips, arrows, dots, rule)
src/gl/stage.js            draw order + composition parameters
src/gl/shaders.js          plate / letters / figure / shadow / post GLSL
src/lib/clip.js            packed-video element, loop-seam dissolve
src/scene2/boot2.js        scene-2 lifecycle: visibility, resize, render loop
src/scene2/universe.js     transparent WebGL2 tool-card layer
src/scene2/cards.js        measured card layout + per-frame pose
src/scene2/ribbon.js       the red energy curve, split around the figure
src/scene2/particles.js    embers and floating debris
src/scene2/timeline2.js    every beat of the universe sequence
src/gl/shaders2.js         environment / ring / card / ribbon / ember GLSL
src/lib/mat4.js            perspective + model matrices
tools/matte.py             background removal (offline)
tools/build_media.py       media pipeline: mattes, textures, manifest
tools/track.py             per-frame subject boxes into the manifest
src/scene6/boot6.js        finale lifecycle, captions, parallax
src/scene6/finale.js       finale canvases: staged plate + matted man + veil
tools/extract_fin.py       cuts the footer reference into plate + man
src/scene6/timeline6.js    every beat of the closing shot
src/scene4/boot4.js        scene-4 lifecycle, entrance, parallax, hover
src/scene4/gallery.js      scene-4 canvas: plate lighting + post
src/scene4/layout4.js      sprite boxes, depths, portrait recomposition
src/scene4/timeline4.js    every beat of the project-universe sequence
src/scene3/boot3.js        scene-3 lifecycle, cursor->year mapping, card DOM
src/scene3/chrono.js       draw order and composition parameters
src/scene3/layout3.js      measured arc, card placement, timeAt() mapping
src/scene3/timeline3.js    every beat of the time-machine sequence
src/gl/shaders3.js         room / clock / rail / figure GLSL
tools/extract_logos.py     lifts the 12 tool logos out of the section-2 art
tools/extract_figure.py    lifts the central figure's silhouette
tools/extract_s3.py        lifts the 6 year photos + figure from the section-3 art
tools/extract_s4.py        cuts the section-4 reference into plate + sprites
tools/extract_s5.py        cuts the section-5 reference (section removed; kept to regenerate)
tools/encode_cert.py       mattes + packs the walking man (section removed; kept to regenerate)
tools/serve.py             dev server (no-store + screenshot endpoint)
assets_src/                originals, untouched
```

Re-extract scene-2 artwork with:

```bash
python tools/extract_logos.py
python tools/extract_figure.py
python tools/extract_s3.py
```

## Two hard-won environment notes

`overflow-x: hidden` on body promotes it to a scroll container, which silently
breaks every `position: sticky` pin in the scenes — the canvas scrolls away and
leaves bare background. It is `overflow-x: clip` for exactly that reason; do not
"simplify" it back.

## A note on the GLSL

The shaders live inside JS template literals, so a stray backtick in a comment
silently ends the string and takes the whole module graph down. If the page goes
blank after a shader edit, syntax-check first:

```bash
for f in src/**/*.js; do cp "$f" /tmp/c.mjs && node --check /tmp/c.mjs || echo "$f"; done
```

Further sections continue below the universe: add them inside `main.flow` with
a solid background and normal document flow takes over from there. The hero is a
fixed full-viewport layer behind `.flow`, and its video decoding is stopped
automatically once it scrolls out of view.
