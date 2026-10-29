# Rebuild direction and animation status

The first implementation paired an editorial photo layout with a primitive real-time can/glass renderer. The renderer's flat materials, thin stream, packaging and framing did not meet the photographic direction. Its visible slider also made the page read as a manual interaction demo. Both the renderer and slider have been removed.

The rebuilt direction is a sunlit beverage campaign: full-viewport product photography integrated with the headline; warm limestone, original citrus packaging and natural shadows; Instrument Serif with self-hosted Plus Jakarta Sans; asymmetrical product editorial, a citrus detail spread, an afternoon still life, an understated green contact section and a butter-yellow typographic footer. The supplied palette and original visual references guide all five new campaign stills.

## Motion technique and limits

GSAP ScrollTrigger pins the scene and scrubs a timeline from normal vertical scrolling. It coordinates focal movement, type transitions, a citrus reveal and a progress hairline. Every transition reverses on upward scrolling. There is no range control, object dragging, play button, artificial scroll container, wheel handler or touch interception.

The user's freight and studio specifications are applied as animation references for CITRUS, not separate websites. A native paused-video path is implemented: ScrollTrigger progress drives target media time, 0.22 smoothing controls the approach, seeking is serialized, `seeked` schedules the next pending update and a 1/48-second guard avoids the duration boundary. The video is never played, looped or faded. It buffers the clip when possible, chooses 720p for small screens/Save-Data, cleans up blob URLs/listeners and respects reduced motion. The same typography overlays the clip. Without configured CITRUS footage, the photographic choreography remains visible.

The photographs depict a pour; the fluid inside them is not animated. This is not a continuous can-opening, tilting and filling simulation or a rendered frame sequence. This distinction is deliberate: the previous low-fidelity procedural imitation was rejected. New independent stills cannot reliably become a temporally coherent liquid simulation.

The current environment has Blender and FFmpeg, but the project contains no authored can/ice/glass scene, baked fluid simulation, movie or rendered animation frames. A renderer alone does not supply an approved photoreal liquid sequence. Image generation was used for high-quality campaign stills, not misrepresented as video generation.

## Exact assets needed for the intended physical pour

Supply one approved, temporally coherent render or shoot covering:

1. The same CITRUS 01 can at rest, then a subtle camera push/rotation.
2. A working tab opening at the proper hinge.
3. The can tilting and a continuous liquid stream entering the glass.
4. Ice displacement, rising liquid, bubbles and restrained splash.
5. A stable final glass/can composition.

Preferred delivery for the implemented video path: one silent H.264 MP4, approximately 5–8 seconds at 24 fps, with keyframes every four frames, `faststart`, and identical lighting, can label, camera framing and glass geometry throughout. Supply 1920 × 1080 and 1280 × 720 versions with the same timeline, plus a first-frame poster and commercial reuse permission. Compose the can/glass inside a centre-safe area so mobile cover cropping preserves them, and leave room for the text. A dedicated portrait render (1080 × 1440) would improve mobile composition but needs its own source selection. Configure `NEXT_PUBLIC_POUR_VIDEO_1080` and `NEXT_PUBLIC_POUR_VIDEO_720`; local `public/` assets and HTTPS URLs are supported.

Alternatively, deliver 120–192 coherent WebP frames and timing for a future Canvas adapter. A 3D alternative requires the authored scene and a baked fluid mesh/cache, plus textures and lighting rights. Neither adapter is claimed to exist. The current native-video integration is verified with temporary FFmpeg test-pattern footage, never presented as CITRUS content. End-to-end checks cover actual wheel-driven media time, reverse/end seeking, zero playback calls, no overlapping seeks, desktop/mobile/Save-Data source selection, failed-asset fallback and reduced-motion teardown.

## Accessibility and engineering

Static content and artwork are server rendered. Motion is progressive enhancement. Reduced motion removes pinning, image movement and animated text. The contact demo is disabled until hydration, preventing a no-JavaScript form from submitting personal details in a URL. Client validation never sends or stores a note. The site retains GitHub Pages static export and `/soda/` asset prefix support.

## Skill/reference audit

Used the previously reviewed local frontend-design, react-best-practices and web-design-guidelines instructions. The named design-taste-frontend, find-skills and live-3d-web-experiences skills remain absent; none was invented or assumed. The available official skills cover this rebuild; another generic component library would not provide the missing fluid assets.

Studied the primary repository's responsive GSAP pin/scrub timeline and the secondary repository's 192-frame requestAnimationFrame/Canvas pattern. No code or assets were copied from them. Also inspected shadcn/ui's button component for interaction/focus conventions; custom semantic controls were more appropriate here, so no component library was added. Zingy and 21st.dev returned proxy 403 responses and could not be visually reviewed. Official web interface guidelines were fetched for the current review.
