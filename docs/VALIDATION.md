# Scroll correction validation — 30 October 2026

Validated a production Next.js build at the root path used by Vercel, with the actual application and delivery assets.

- Production build, ESLint and TypeScript checks passed.
- The complete browser suite passed at 1440×1000, 1024×900, 768×1024, 390×844 and 360×740. A focused motion pass checks the final composition at the same five sizes.
- Real wheel scrolling moves the can, opens its tab, draws a visible stream, fills the glass and reverses all these changes. Stream endpoints must remain within 2px of the transformed can opening and glass lip; the stream falls downward and is at least 4px wide. The pouring can tilts past horizontal.
- Liquid tests measure the visible clip boundary, assert that it rises during pouring and returns to the same level on reverse scrolling, and require the final glass to be substantially filled. Particles retain their size as the fill rises.
- Keyboard PageDown and native touch gestures advance the sequence. The pin releases into the next section, and resizing leaves one pin. Reduced motion removes pinning/transforms and cleans up geometry listeners, including preference changes at runtime.
- All section images loaded; no horizontal overflow, page errors, failed requests or form POSTs were observed. Demo validation focuses the first invalid field. Without JavaScript, content remains visible and the non-submitting demo button stays disabled.
- Desktop, tablet and mobile compositions were visually reviewed. Actual wheel-input recordings include forward scrolling and reversal at desktop and mobile sizes. Captures and recordings are in ignored `test-results/motion-final/` and `test-results/geometry-review/`.
- The optional paused-video integration also passed: desktop/mobile/Save-Data source selection, wheel-to-media time, reverse/end seeking, zero playback calls, serialized seeks, idle behavior, reduced-motion cleanup and missing-media fallback.

The delivered sequence is a layered 2.5D animation, with an animated SVG stream and clipped liquid. A continuous CITRUS movie is still needed for photoreal fluid, moving ice, detailed tab mechanics and physical splashes. Video integration tests use temporary FFmpeg test-pattern footage; no test movie is shipped. See [the asset specification](DESIGN-NOTES.md).

Safari, Firefox and physical-device performance were not tested. Vercel deployment is triggered by a GitHub push; local validation does not establish that the live deployment has completed.
