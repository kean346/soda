# CITRUS 01

A standalone portfolio concept for a fictional sparkling citrus drink. This is the standalone CITRUS 01 project, published in `kean346/soda`. It does not use or modify paceIT.

## Run

Node.js 22.20+ (tested with 24.19), npm, no credentials or external services required.

```sh
git clone https://github.com/kean346/soda.git
cd soda
npm ci
npm run dev
```

The development server uses port 3000. For a Node.js production deployment: `npm run build && npm run start`. To deploy, import this folder into a Next.js-compatible host such as Vercel, or run those production commands on a Node server. No API keys are needed. Replace `robots.index: false` in `src/app/layout.tsx` only when the concept is intended for indexing.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the static site on every push to `main`. In the repository **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. If the first workflow ran before Pages was enabled, rerun it from the Actions tab.

The expected site URL after a successful deployment is `https://kean346.github.io/soda/`. The export prefixes public images and Next.js bundles with `/soda`, and disables the image optimization server because Pages serves static files only. The 3D animation and demo form work entirely in the browser; no backend is required.

To build the same static output locally:

```sh
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/soda npm run build
```

Deploy the contents of `out/`, not the source folder. `NEXT_PUBLIC_BASE_PATH` must match the hosting subdirectory at build time; use an empty value for a root-domain static deployment. A custom domain or a renamed repository needs a matching workflow change.

## What the animation actually does

`src/lib/pour-scene.ts` builds original Three.js geometry: a lathed aluminium can, original canvas-drawn lemon label, opening tab, ribbed glass, golden liquid volume and surface, curved liquid stream, splash droplets and bubbles. A single normalized scroll progress determines every pose. GSAP ScrollTrigger drives progress through a CSS sticky section. Reverse scrolling reverses the animation, including the glass fill. The accessible slider supports pointer and keyboard operation.

This is an actual, stylized real-time 3D animation, not a photo sequence or crossfade. The stream is procedural geometry, not a fluid dynamics simulation. The supplied AI stills are used in the photographic sections; the 3D packaging is an original approximation of their visual direction, not an exact 3D reconstruction.

The 3D module loads only near its section. Rendering happens on scroll, control input and resize, with no idle animation loop. Device pixel ratio is capped. Reduced motion removes sticky scroll choreography and presents a filled-glass pose with manual exploration. If WebGL fails, the supplied still appears with an explicit notice.

### Assets for a photoreal replacement

No extra assets are required to run the current 3D pour. To match the photographic stills with realistic liquid, supply either:

- An approved, consistent can model and label artwork, glass model/materials, HDRI lighting and a baked liquid simulation; or
- A licensed original render sequence (about 120–192 WebP frames, identical camera/can/glass/lighting across frames) covering upright can → tab open → tilt → stream → glass fill → finish. Supply desktop and portrait framing, a poster image and frame timing.

Do not use unrelated AI images as animation frames. The uploaded pouring still is not enough to produce a photoreal fluid simulation. Any replacement sequence needs explicit asset rights.

## Site behavior

- Responsive Next.js App Router / strict TypeScript / Tailwind CSS.
- Self-hosted Instrument Serif and Space Grotesk via `next/font/local`; font licences are in `public/fonts`.
- Responsive optimized images, keyboard focus, skip link, semantic sections, motion preference changes and WebGL fallback.
- Contact form validates name, email and message locally. It sends no request, stores no details and never reports a sent message. Connect a real, authorized server endpoint with validation, rate limiting and a privacy notice before changing that behavior.
- No shop, invented testimonials or actual-company product claims. A future store can be added as an independent route/navigation entry.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
# With npm run start active, Python Playwright and system Chromium installed:
python tests/browser.py
# Or test the static export served at its project subdirectory:
BASE_URL=http://127.0.0.1:4173/soda/ python tests/browser.py
```

The browser suite checks 375, 390, 768, 1024 and 1440 px, layout overflow, actual changing WebGL pixels, reversible scroll (same pose produces identical pixels), liquid fill, keyboard seeking, native form validation, reduced motion and unavailable WebGL. Artifacts are written to ignored `test-results/`. Software WebGL validates rendering and behavior, not physical-device frame rate or Safari compatibility.

## Reference verification and skills

See [SOURCES.md](SOURCES.md). Official design instructions were reviewed in the original build workspace; no global skills were changed. Downloaded third-party reference code and skill documents are not bundled in this repository. Each cloud task already has an isolated environment: use this project directly; do not create a Git worktree unless explicitly requested.
