# Reference notes: yeahright.co

**Analyzed:** 24 Nov 2026, desktop viewport 1024×768, in the built-in browser.
**Method:**

1. Live DOM, computed styles, stylesheet rules and runtime globals, read in the built-in browser while scrolling through the page.
2. A REA pass added later, which is §5b:
   - `capture_browser_scenario` with Chromium 158, motion not reduced, response bodies captured. Evidence `ev_4aaa8b6a…`.
   - `export_web_scripts` on that capture.
   - The main 196 KB bundle (`Base.astro…x2228EQI.js`) was read for animation parameters. A second chunk, `index.BzC_51kD.js` (likely the Three.js scenes), was not retained, so its parameters are **unknown**.
     **Scope:** patterns, measurements and techniques only. No code, text, images, video, fonts or exact color values were copied.

Each item below is labelled **Observed** (read from the page) or **Inferred** (my reading of how it works).

---

## 1. Stack

| Item           | Status   | Finding                                                                                          |
| -------------- | -------- | ------------------------------------------------------------------------------------------------ |
| Framework      | Observed | Astro (`/_astro/` bundle, one main script per layout)                                            |
| Animation      | Observed | GSAP 3.15 (`gsapVersions`), GSAP-style inline transforms on elements                             |
| Smooth scroll  | Observed | Lenis 1.3.25 (`window.lenis`)                                                                    |
| 3D             | Observed | Three.js r181 (`__THREE__`), 5 `<canvas>` elements: a 3D pig model, a CRT/TV effect, and a badge |
| Text splitting | Observed | Every text block is split into `line` → `word` → `char--letter` / `char--space` spans            |
| Grid           | Observed | Bootstrap-like 12-column system (`col-12`). Breakpoints are 576 / 768 / 992 / 1200 px            |

**For our site:** keep Next.js + Motion. Lenis is fine (~3 KB). Skip Three.js: it's heavy, and a 3D model isn't needed to meet the PRD's 150 KB JS budget.

## 2. Page structure (top → bottom)

| #   | Section          | Height @768h | Notes                                                                                                                                                                                                 |
| --- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Loader           | 100vh        | Fullscreen "elevator" counter 00→100 with a mono status label, a clock line, sound toggle bottom-left, `[CLICK TO ENTER]` bottom-center, step counter "05/05" bottom-right                            |
| 1   | Header           | 57 px        | Wordmark left with a blinking underscore, "Bored?" link right. Fixed                                                                                                                                  |
| 2   | Hero             | ~700 px      | Giant condensed uppercase headline (2 lines), the 2nd line outlined/stroked. A bracketed mono aside. Info panel bottom-left (Role / Base / Stack / For). A rotating circular stamp badge bottom-right |
| 3   | About            | ~820 px      | Stacked big statements, each with a bracketed mono aside. An image or GIF overlaps the headline. Decorative pointing-hand illustration                                                                |
| 4   | Work             | ~1975 px     | Big statement ("The ___") with an emoji/3D mascot, then a TV-frame project viewer (see §5)                                                                                                            |
| 5   | Footer / contact | ~780 px      | Status bar, a big CTA headline, link columns, an email bar with a copy button, a small legal row, and a giant wordmark filling the full width at the bottom                                           |

Each section is roughly one viewport tall, with a lot of empty dark space.

## 3. Layout and type measurements

- **Page frame (observed):** `html` padding is `max(9.9px, 1.04vw)`, which gives a thin, even margin around everything. There's also a thin accent-colored frame line visible at the screen edges.
- **Root font size (observed):** `62.5%`, so 1 rem = 10 px.
- **Headings (observed):** a condensed ultra-black display face, all uppercase.
  - `h1`: 212 px with line-height 0.8 at 1024 wide, so about 20.7vw.
  - Project `h2`: ~71 px, also with line-height 0.8.
  - The tight 0.8 leading makes lines almost touch. That is the signature look.
- **Body and labels (observed):** a monospace face for everything else: 16 px, 1.8 line-height, letter-spacing −0.03em. Labels are uppercase mono at ~10–11 px.
- **Fit-text (observed):** `data-fit-text` scales headlines so each one fills the container width exactly.
- **Outline text (observed):** alternate headline lines use a text stroke with a transparent fill.
- **Brackets as a motif (observed):** asides and buttons are wrapped in `[ … ]`.
- **Hero grid (observed):** 3 columns, about 41% / 108 px / 41%.

## 4. Color system

- **Structure (observed):** 4 tokens: `light`, `dark`, `mid`, `muted`. Very dark teal-black background, pale mint text, a brighter mint accent, and a grey-green muted color.
- **Time-of-day palettes (observed):** 4 palettes switch by the owner's local hour:
  - "Brew" from 06:00
  - "Office" from 10:00
  - "Oven" from 18:00
  - "Night shift" from 22:00

  The hour is computed with `Intl.DateTimeFormat` in a fixed time zone. A manual override is saved in `localStorage` (in try/catch). The footer shows the current palette name with "(AUTO)", plus colored dots to pick one.

- **Transition (observed):** `palette-doors`, a full-screen overlay that wipes when the palette changes.

**For our site:** we use our own palette. The time-of-day idea fits Raihan very well, because the clock already follows Nanjing time. For example, a "Morning / Lab / Evening / Late night" palette chosen by Nanjing hour, with a manual override.

## 5. Interactions and motion

**Easing (observed):**

- `cubic-bezier(0.4, -0.01, 0, 0.99)` is used for almost everything (26 rules). It's a sharp ease-in-out with a long, soft tail.
- `cubic-bezier(0.59, 0.08, 0.385, 1)` is a secondary curve.
- `steps(1)` is used for blink effects.

**Durations (observed):**

- 0.5 s and 1 s dominate.
- 0.3 s for hover states.
- 1.6–2.4 s for large reveals.
- Long loops (4–30 s) for ambient effects such as badge spin and flicker.

| Pattern                        | Status              | How it works                                                                                                                                                                                                                                                                      |
| ------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Split-text reveal              | Observed + Inferred | Characters or lines slide in from below inside an overflow-hidden line, staggered per letter. Triggered when the section gets the `item--inview` class                                                                                                                            |
| Hover scramble                 | Inferred            | Links and labels contain a duplicate `text--split-copy` layer. On hover the letters roll vertically into the copy, which reads as a "slot machine" flip                                                                                                                           |
| Loader counter                 | Observed            | Digit slots roll 00→100 like an odometer (`loader__slot`) with bracket blink keyframes. Ends in a click-to-enter gate                                                                                                                                                             |
| Custom cursor                  | Observed            | Three layers: a 5 px dot (inner, follows exactly), a 16 px diamond rotated −45° (outer, lags behind), and a swap-in image or "visit" label when over `data-cursor-hover` targets. The native cursor is hidden with `cursor: none`. Under `(hover: none)` it is disabled           |
| Custom scrollbar               | Observed            | The native scrollbar is hidden (`scrollbar-width: none`) and a custom `.scrollbar` thumb is drawn instead                                                                                                                                                                         |
| Project viewer ("TV channels") | Observed            | A CRT-style frame with a scanline shader (`data-scanline-*`), a channel number "CH 01", prev/next arrows and numbered channel keys (looping 08 09 **01** 02 03), a poster → video per channel, a caption and a "Visit site ↗" link. Channel switches play a static/flicker effect |
| Neon flicker                   | Observed            | Several flicker keyframes (slow, fast) on accent elements                                                                                                                                                                                                                         |
| Running clock                  | Observed            | The footer status bar shows "Available for work · City, Country // HH:MM:SS TZ", ticking every second                                                                                                                                                                             |
| Copy email                     | Observed            | A bordered button with "Copy" → "Copied" state, using the same letter-roll swap                                                                                                                                                                                                   |
| Typed footer wordmark          | Observed            | The giant footer wordmark types in letter by letter (`is-typed`), with one letter rendered as an outline                                                                                                                                                                          |
| Easter eggs                    | Observed            | "Bored?" opens a Pong game (`data-pong-open`). A pizza link. A 3D pig mascot. Optional sound with a toggle                                                                                                                                                                        |
| Reduced motion                 | Observed            | There is a `prefers-reduced-motion: reduce` rule set                                                                                                                                                                                                                              |

## 5b. Measured animation parameters (REA, observed in bundle)

| Item                       | Value                                                                                                                                        | Note                                                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lenis smooth scroll        | `lerp 0.1`, `duration 1.2`, smooth wheel on (off on touch), `syncTouch false`, driven by GSAP's ticker (`autoRaf false`)                     | Native touch scrolling on mobile                                                                                                                        |
| Split-text stagger         | **0.05 s per character**, the default of the split helper. Each letter gets a `--char-delay` CSS variable = index × 0.05                     | The reveal itself is a CSS transition using that delay, so the curve comes from the CSS (§5: `cubic-bezier(0.4,-0.01,0,0.99)`)                          |
| Cursor: inner dot          | Tweens to the pointer in **0.01 s**, effectively instant                                                                                     | Positions are applied through GSAP `quickSetter` on every tick                                                                                          |
| Cursor: outer shape        | Tweens to the pointer in **0.33 s, `expo.out`**                                                                                              | Its velocity (target − current) drives **rotation (angle of travel)** and **skewX (speed)**, so the shape leans and stretches when the mouse moves fast |
| Section reveal trigger     | ScrollTrigger `start: "top 75%"`; toggles the `item--inview` class, reverses on scroll back                                                  | Our equivalent: Motion `whileInView` with `viewport={{ amount: 0.25 }}`                                                                                 |
| Hero exit                  | Timeline scrubbed from `top top` over **0.6 × viewport height**                                                                              | Hero content moves or fades as you scroll away                                                                                                          |
| Project viewer             | Scrubbed (`scrub: 1`) from `top bottom` to `bottom bottom`; auto-advances channel every **7 s**                                              | Pauses while out of view                                                                                                                                |
| Hero fit-text              | Binary search on font size until the line fits container width − 2 px; result stored in `--hero-size`                                        | Re-runs on resize                                                                                                                                       |
| Palette auto-check         | Re-resolves the time-of-day palette every **60 s** unless the user picked one                                                                |                                                                                                                                                         |
| Clocks                     | `setInterval` 1 s                                                                                                                            |                                                                                                                                                         |
| GSAP eases used (by count) | `none` 8, `power2.out` 6, `power2.in` 5, `power3.out`/`power3.inOut`/`expo.out`/`sine.inOut` 3 each, `back.out(2)` 2, `steps(1)` for flicker |                                                                                                                                                         |
| GSAP durations (by count)  | 0.3 / 0.5 / 0.6 s (4 each), 0.35 / 0.55 / 0.7 s (3 each), 0.9–1.4 s for larger moves, 2.4–3 s ambient                                        | Light flicker: `steps(1)`, 0.07 s per keyframe                                                                                                          |

**Unknown:**

- The Three.js scene parameters (pig model, CRT shader, badge), because their chunk wasn't captured.
- The exact math of the velocity→rotation/skew mapping. The helper functions are minified and were not traced further.

## 6. Mapping to Raihan's site (per PRD v1.1)

| Reference pattern                                         | Our version                                                                                                                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loader + click-to-enter                                   | **Dropped**, per PRD. Content shows immediately. At most a ≤600 ms first-paint line reveal                                                                    |
| Giant condensed headline + outline 2nd line               | **Take as technique.** Use a free condensed display font, e.g. _Anton_, _Bebas Neue_, _Big Shoulders Display_ or _Archivo Black_. Our own font, our own words |
| Mono body + `[bracket]` asides                            | **Take as motif.** Mono font, e.g. _JetBrains Mono_, _IBM Plex Mono_ or _Space Mono_. Our own copy                                                            |
| Info panel Role/Base/Stack/For                            | **Take** → Role / Base / Stack / Focus                                                                                                                        |
| Fit-text headlines                                        | **Take** (client-side measure, or CSS `clamp()` + `vw`)                                                                                                       |
| Split-text line/char reveal, letter-roll hover            | **Take**, built with Motion. Re-time to our own easing (a similar long-tail curve is fine)                                                                    |
| 3-layer custom cursor (dot + lagging shape + hover label) | **Take**, desktop only, lazy-loaded. Use our own shape, e.g. a small square + crosshair, which fits the "data" theme                                          |
| Time-of-day palettes with override                        | **Take as idea**, based on Nanjing hour. Our own colors                                                                                                       |
| TV/CRT project carousel with video                        | **Replaced** by project cards + `/work` archive (PRD). The channel-number styling could be echoed in card numbering ("P 01") without the video/WebGL          |
| Footer clock line                                         | **Take**, extended with the visitor's time + difference (PRD 5.1)                                                                                             |
| Copy-email button with state flip                         | **Take**                                                                                                                                                      |
| Giant footer wordmark that types in                       | **Take**, with "RAIHAN" or initials                                                                                                                           |
| Pong easter egg, 3D mascot, sound                         | **One** easter egg only (e.g. the `sql` panel). No 3D, no sound by default                                                                                    |
| Custom scrollbar                                          | Optional. Low priority; keep the native scrollbar for accessibility                                                                                           |

## 7. Open questions for the owner

1. Is the "loud" giant-condensed typographic style what you want, or something calmer? The PRD says "calm", but the reference is very loud.
2. Time-of-day palettes: yes or no?
3. Which single easter egg: the `sql` panel, a mini game, or something else?
