# Rebuild validation — 29 October 2026

Validated the production static export at `/soda/` in Chromium, using the real application and delivery assets.

- `npm ci`, `npm run lint`, `npm run typecheck` and the GitHub Pages production build passed.
- `tests/browser.py` passed at 1440×1000, 1024×900, 768×1024, 390×844 and 360×740.
- Actual wheel input advances and reverses the scene; keyboard PageDown and native touch gestures also advance it. The pin releases into the following content, and resizing leaves one pin.
- All section images load; no horizontal overflow, page errors, failed requests or form POSTs were observed. Demo validation focuses the first invalid field.
- Reduced motion removes the pin and image transforms, including when preferences change at runtime. With JavaScript disabled, content stays visible and the demo submit button stays disabled.
- Captured and visually reviewed desktop, tablet and mobile section screenshots. Final captures are in the workspace's ignored `test-results/rebuild-final/` directory.
- `tests/video.py` passed for desktop, mobile and Save-Data source selection, real wheel-to-video time, reverse scrubbing, duration guard, zero playback calls, serialized seeking, idle behavior, reduced-motion cleanup and missing-media fallback.

The video test uses a temporary FFmpeg test pattern. No test clip is included in the source assets or export. This verifies the media mechanism; a continuous CITRUS movie remains necessary for moving liquid, tab opening and glass filling. See [the asset specification](DESIGN-NOTES.md).

Safari, Firefox and physical-device performance were not tested. The form is a non-submitting concept. A successful local export is separate from GitHub Pages deployment; check the Actions result before treating the site as live.
