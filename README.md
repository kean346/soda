# BLOOMSHIFT

A standalone botanical soda campaign. Vanilla HTML/CSS/JavaScript and Three.js **0.160.0**. No package installation, framework or build step.

## Run

```sh
cd /workspace/soda
python -m http.server 3000 --bind 0.0.0.0
```

Open the site through your local server. On Vercel select **Other**, no build command, and the repository root as the output directory. All application code lives in `index.html`.

Display headings use Syne; body text and product packaging retain Poppins. Atmospheric colour joins connect the chapters, and masked text reveals replay when a chapter returns to view. Packaging artwork renders at 4096 pixels on desktop and 2048 pixels on phones. Seven small condensation beads slowly slide down the can surface.

The page imports Three.js from jsDelivr, Poppins from Google Fonts (with a jsDelivr font fallback), and the supplied decorative PNGs from CloudFront. It needs Internet access for WebGL modules; if those fail, a CSS product illustration and all content remain accessible. Flowers have original inline SVG fallbacks. No models, keys or external services are needed.

## Experience

One procedural aluminium can uses a lathed body, metal rims and lid, an extruded ring pull, instanced condensation, three canvas-generated packaging textures, instanced orbit droplets, tapered tube ribbons, 3D petals and citrus slices. Scroll continuously interpolates five flight poses using cubic easing and delta-time damping. Labels crossfade using weighted transparent layers. Pointer movement influences orientation. Manual flavour selection stays active until the next scroll chapter, then returns to the story.

Mobile has a separate flight path and fewer particles. Reduced motion suppresses spins, hovering and pointer movement. The page stops WebGL rendering while hidden. Social controls explain their concept status without navigating to fake accounts. This is a fictional campaign, not an online shop.

Each cloud task is already isolated. Use this checkout directly; do not create a worktree unless explicitly requested. Browser validation evidence is in ignored `test-results/bloomshift/` in the prepared environment. `window.__bloom.snapshot()` provides read-only motion/allocation diagnostics.
