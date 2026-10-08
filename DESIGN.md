# AYAZ Portfolio — Design System

This document is the visual source of truth for the portfolio. Use it whenever
adding a page, section, component, or visual asset so the site continues to feel
like one coherent experience.

The portfolio's character is **cinematic, editorial, dark, and deliberately
restrained**. It combines oversized distressed display type, fine uppercase
interface labels, deep black environments, and carefully controlled red or
amber light. New pages should extend this language rather than introduce a
second visual identity.

## Design principles

- **One visual identity across every page.** Keep the shared palette,
  typography, spacing, navigation, and interaction language consistent.
- **Editorial, not template-like.** Use clear hierarchy, generous negative
  space, concise copy, and deliberate composition rather than generic cards
  and dashboards.
- **Atmosphere with restraint.** Red and amber are accents and sources of
  light, not large fields of competing decoration.
- **Content stays legible.** Cinematic visuals support the content; they must
  not make navigation, project details, or calls to action hard to find.
- **Responsive composition.** Recompose for narrow screens instead of merely
  shrinking a desktop layout.

## Color palette

| Role | Value | Use |
| --- | --- | --- |
| Black | `#000000` | Main background, deep negative space, and the foundation of the experience. |
| Warm black | `#060505` | Subtle lift for large scene backgrounds without reading as a separate color theme. |
| Deep red | `#DE1B1C` | Primary brand accent, hero details, active states, and restrained emphasis. |
| Hot red | `#FF2A2B` | Small, high-energy highlights; use sparingly. |
| Ember | `#FF3C14` | Warm glow and cinematic light accents. |
| Paper | `#EDEDED` | Main high-contrast text on dark backgrounds. |
| Cream | `#F4E9DC` | Editorial display text and warm, softer highlights. |
| Muted gray | `#8A8A8A` | Secondary UI labels and supporting information. |
| Dim gray | `#4E4E4E` | Low-priority rules, separators, and inactive details. |
| Warm amber | `#FFA03C` | Timeline energy and scene-specific interactive highlights. |
| Warm bronze | `#B98A6A` | Quiet secondary labels in cinematic scenes. |

Use the black/red/paper palette as the site-wide base. Amber, cream, and bronze
are supporting tones for editorial or timeline contexts; they should not become
a competing global accent. Maintain readable contrast and never rely on color
alone to communicate state.

## Typography

### Font families

- **Anton** — oversized, condensed display typography and the AYAZ wordmark.
  The hero name uses clean paper-white lettering over the supplied photograph;
  red is reserved for small interface accents.
- **Oswald** — the interface and utility face: navigation, role labels,
  captions, metadata, buttons, and compact uppercase copy.
- **Bodoni Moda** — an editorial serif for selected cinematic scene headings.
  Reserve it for prominent titles, not body copy or utility UI.
- **System fallbacks** — use the existing `Arial Narrow`, `Impact`, and system
  sans-serif fallbacks where already defined; serif fallback is `Times New
  Roman`, then `serif`.

The local font files are loaded in the existing stylesheets from
`public/fonts/`. Reuse those files and family names rather than adding a new
font service or an unrelated typeface.

### Type hierarchy

1. **Display:** large, bold or condensed, used for the hero name and a small
   number of major statements.
2. **Editorial heading:** Bodoni Moda, uppercase and widely tracked, used for
   cinematic chapter titles.
3. **Section heading:** clear, compact, and strongly separated from supporting
   copy.
4. **Utility label:** Oswald, uppercase, letter-spaced, and muted.
5. **Body copy:** readable sentence case with a comfortable line length. Do not
   set long paragraphs in tiny, widely tracked uppercase text.

The current scene labels typically use `clamp()` sizing and generous tracking.
That treatment is for short labels; preserve normal tracking and comfortable
line-height for paragraphs, project summaries, and longer-form content.

## Layout and composition

- Use near-black full-bleed sections as the visual canvas.
- The home hero uses a thin inset frame around a cinematic photograph, a live
  editorial text column, restrained location/scroll labels, and the shared
  navigation. Keep the desktop and phone photographs as separate art-directed
  sources; put all headings, links, and controls in accessible HTML rather
  than flattening interface text into an image.
- Store approved visual references in the root `inspiration/` folder. Keep
  those reference originals separate from the optimized assets served by the
  site, and use descriptive names that identify their intended placement.
- Align content to a consistent responsive page edge. Existing interface
  geometry uses a fluid edge, approximately `clamp(14px, 1.55vw, 26px)` in the
  hero and wider editorial insets for cinematic scene labels.
- Give each page a clear focal point, a readable content column, and deliberate
  negative space. Avoid filling every area with text or decoration.
- Keep navigation and page identity consistent across future pages. The
  current cinematic home may retain its fixed hero and pinned scroll scenes;
  ordinary pages should not inherit full-screen pinned behavior unless their
  content genuinely needs it.
- A page should work as a distinct destination while still visibly belonging
  to the same portfolio through its typography, palette, shared header/footer,
  labels, and motion.
- On mobile, reorganize content and controls into a purposeful composition.
  Prevent clipped labels, horizontal overflow, and controls that are too small
  to use.

## Graphic language

Use the established visual motifs selectively:

- distressed red display type where already used, fine grain, and clean
  paper-white hero lettering;
- thin rules, small red punctuation, and restrained HUD-like labels;
- subtle red or amber rim light, bloom, and shadow;
- photographic artwork with dark, cinematic grading;
- asymmetry balanced by a clear typographic hierarchy.

Do not add gratuitous neon, gradients, glassmorphism, emoji, generic icon
decoration, or unrelated card styles. New imagery should be chosen or created
for its intended composition and approved before replacing existing assets.

## Motion and interaction

- Motion should feel choreographed and weighted: reveal, settle, then only a
  quiet amount of ongoing movement.
- Reuse the existing easing vocabulary, especially
  `cubic-bezier(.16, 1, .3, 1)` for ease-out and
  `cubic-bezier(.76, 0, .24, 1)` for in-out transitions.
- Prefer short opacity/position transitions for ordinary page UI. Reserve
  large-scale movement, parallax, pinned scenes, and continuous animation for
  the cinematic home experience.
- Interactive controls need visible hover and keyboard-focus states.
- Respect `prefers-reduced-motion`; essential content and navigation must not
  depend on animation to appear or function.

## Shared components for future pages

New pages should reuse or establish shared versions of:

- the AYAZ wordmark and primary navigation;
- the dark page background, responsive content edges, and typography tokens;
- section labels, headings, links, buttons, separators, and active states;
- a practical footer with real, user-approved contact and profile links.

Keep new page-specific layouts local to those pages, but draw their styles from
this shared system. Do not create multiple competing definitions of the same
brand colors, fonts, or core controls.

## Content and accessibility

- Keep writing specific, concise, and honest about project status and experience.
- Do not invent clients, results, awards, public links, or credentials.
- Preserve semantic heading order, meaningful link names, keyboard operation,
  and useful alternative text for informative images.
- Mark purely decorative artwork as decorative for assistive technology.
- Keep body text comfortably readable; small tracked uppercase labels are
  supplemental, not a substitute for essential information.

## Implementation notes

The current shared CSS variables are declared in `src/styles/app.css`:

```css
--ink: #de1b1c;
--ink-hot: #ff2a2b;
--paper: #ededed;
--black: #000;
--dim: #8a8a8a;
--dimmer: #4e4e4e;
--ui: 'Oswald', 'Arial Narrow', system-ui, sans-serif;
--disp: 'Anton', 'Arial Narrow', Impact, sans-serif;
```

Scene-specific styles may add local colors, such as the timeline's amber,
ember, and cream. Keep those scoped to the scene unless there is a deliberate
design-system decision to promote them globally.
