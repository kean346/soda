# CITRUS 01

An independent, fictional sparkling citrus campaign. This is the standalone `kean346/soda` project; paceIT and unrelated projects are outside its scope.

## Develop

Node.js 24 and npm. No credentials or services are required.

```sh
git clone https://github.com/kean346/soda.git
cd soda
npm ci
npm run dev
```

The development server uses port 3000. For a Node production preview: `npm run build && npm run start`.

## Design and motion

The rebuilt page includes a full-viewport hero, a pinned photographic scroll study, product editorial, a citrus/experience section, a cinematic lifestyle feature, a validated demo contact form and a typographic footer. Five new campaign stills follow the original supplied CITRUS 01 art direction. Fonts are self-hosted Instrument Serif and Plus Jakarta Sans.

Normal vertical scrolling drives a GSAP ScrollTrigger timeline. Scrolling up reverses it; the scene then releases naturally into the product section. There are no sliders, drag-to-rotate controls, play buttons or scroll interception. Reduced motion shows a static photograph without pinning. The content stays readable without JavaScript. Three.js has been removed.

**The delivered pour uses still photography with coordinated framing, typography and masked transitions. The liquid itself does not move.** The site also implements the paused-video scrubbing approach from the supplied freight/studio references. A continuous CITRUS pouring movie is still required to activate that path; unrelated reference footage is not included. See [design notes and exact asset requirements](docs/DESIGN-NOTES.md).

### Connect the continuous pouring clip

Place approved clips in `public/video/` and set these public build-time values, or use HTTPS delivery URLs:

```sh
NEXT_PUBLIC_POUR_VIDEO_1080=/video/citrus-pour-1080.mp4
NEXT_PUBLIC_POUR_VIDEO_720=/video/citrus-pour-720.mp4
```

The `/soda` prefix is added automatically for local asset paths. Set these values in the build environment (or `.env.local`) and rebuild. The Pages workflow also reads repository Actions variables with those names. Use a silent H.264 MP4, 24 fps, keyframes every four frames and `faststart`; keep the same framing and duration between versions. A 720p version is selected at widths ≤900px or when Save-Data is enabled.

The clip stays paused. Scroll progress sets a target `currentTime`, smoothed by 0.22 per frame; seeks are serialized and stop 1/48 second before the end. The clip is buffered as a blob when CORS permits, with direct-media fallback. It is never played, looped or faded. Reduced motion skips video loading. Missing/failed media retains the photographic sequence. The full component was tested with temporary synthetic test footage, which is not shipped and does not validate the visual quality of a future CITRUS movie.

The contact form is a non-submitting demo. It validates fields locally, reports that nothing was sent and stores no details. Its button is disabled before hydration, so a browser without JavaScript cannot accidentally submit details through a native form request. A real contact endpoint requires a separate authorized integration.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds a static export and deploys it on pushes to `main`. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**. If the workflow ran before Pages was enabled, rerun it from Actions.

Expected URL after successful deployment: `https://kean346.github.io/soda/`.

```sh
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/soda npm run build
```

Publish the contents of `out/`. Public assets and Next.js bundles include the `/soda` prefix. Images use optimized WebP source files without requiring an image server. Use an empty base path for root-domain static hosting. The page has `robots.index: false` until public indexing is intentionally enabled.

## Verify

```sh
npm run lint
npm run typecheck
npm run build
# With a running preview, Python Playwright and /usr/bin/chromium:
python tests/browser.py
# For an export served at its Pages path:
BASE_URL=http://127.0.0.1:4173/soda/ python tests/browser.py
# Native video integration, with a temporary FFmpeg fixture and isolated dev server:
python tests/video.py
```

The suite uses real wheel, keyboard and touch input. It checks forward/reverse motion, pin release, image loads, field validation, no network submission, reduced motion, no-JavaScript content, resize cleanup and horizontal overflow. It captures every section at 1440, 1024, 768, 390 and 360 px. Outputs live in ignored `test-results/rebuild-final/`. These checks exercise Chromium; they do not establish Safari compatibility or physical-phone performance.

For visual provenance, reference verification and skill availability, see [SOURCES.md](SOURCES.md). Each cloud task already has an isolated environment; use this checkout directly and create no worktree unless explicitly requested.
