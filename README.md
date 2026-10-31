# BLOOMSHIFT

A static botanical drinks campaign, built with vanilla HTML/CSS/JavaScript and Three.js **0.160.0**. No framework, package installation or build step.

## Run

```sh
cd /workspace/soda
python -m http.server 3000 --bind 0.0.0.0
```

Vercel: use **Other**, no build command and the repository root as the output directory (`vercel.json` provides these settings).

## Design and implementation

- `index.html`: five semantic chapters, accessible navigation and flavour controls.
- `site.css`: one stylesheet with Instrument Serif display typography, Poppins body text, cream/plum/blush palettes and a separate stacked composition below 900px.
- `app.js`: chapter reveals, continuous palette transitions, manual flavour state, photographic-stage compositing and independent loading/fallback handling.
- `scene.js`: the actual procedural Three.js can, reflection studio, three canvas-generated packaging textures, instanced condensation, seven sliding water beads, restrained liquid geometry, pointer response and damped scroll flight.

The product remains a live 3D model throughout. Generated photographic backgrounds in `assets/stage-*.png` provide an underwater lavender setting, a warm citrus studio and a coral hibiscus studio. They were art-directed from the supplied beverage references; the reference brands and their packaging are not used. The photographed environments and can labels crossfade using the same flavour weights. Fonts and photographic artwork are hosted locally. Three.js modules load from jsDelivr.

The large decorative chapter-number layer has been removed. Chapter indices are small inline text, including under reduced motion. This avoids the previous reduced-motion opacity override that made oversized numerals obscure headings. The layout keeps the resting product and copy in separate regions; on phones and portrait tablets the copy sits above the product. Incoming mobile copy reveals at the chapter’s reading position so it does not scroll across the fixed product.

Manual flavour selection overrides the current chapter until a new chapter becomes active. Reduced motion greatly reduces product motion and shows text without reveals. Hidden pages pause WebGL rendering. The loader is removed after the first frame or a maximum 2500 ms. Module/WebGL failure retains a CSS product preview, readable copy, working anchors and a flavour selector. Missing stage images are hidden, revealing the stage colour. Social controls identify their concept status without navigating to fake accounts.

## Validation

Chromium checks and screenshots are retained in ignored `test-results/redesign/` in the prepared environment. Checks cover all five chapters, scroll transitions, real product motion, pointer response, label/photo crossfades, condensation movement, manual selection and chapter reset, stable geometry allocation, navigation and loading failures. The actual projected can bounds were checked against copy at 1440, 783, 390 and 360 pixels. Reduced-motion checks include the original problem width. Browser timing under software rendering is not a physical-device performance benchmark.

`window.__bloom.snapshot()` exposes read-only animation diagnostics. Use the existing checkout directly; each cloud task is isolated, so do not create a worktree unless explicitly requested.
