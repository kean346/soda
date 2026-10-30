# Visual sources, references and skills

Verified during this project on 29 October 2026.

## Visuals and fonts

- The user supplied `CITRUS-01-Codex-Kit.zip` with a concept board and three AI-generated static product images. Original references remain in `public/images/01-hero.webp`, `02-pouring.webp`, `03-still-life.webp` and `00-concept-board.jpg`.
- Five new AI-generated campaign stills were created for the rebuild using the original images as product/art-direction references: `campaign-hero.webp`, `campaign-pour.webp`, `campaign-product.webp`, `campaign-afternoon.webp` and `campaign-citrus.webp`. Two additional transparent concept cutouts, `citrus-can-cutout.webp` and `citrus-glass-cutout.webp`, drive the layered scroll sequence. They are concept artwork, not actual product photography or rendered fluid frames. Original PNG outputs remain in the build workspace; the repository contains compressed WebP delivery assets.
- Instrument Serif and Plus Jakarta Sans are self-hosted with their licence files in `public/fonts/`.
- The botanical line drawing, site design and implementation are original. No third-party brand imagery or models are incorporated.

## Technical references

- [Dieg0arc/3D-scrolling-practice](https://github.com/Dieg0arc/3D-scrolling-practice): inspected `README.md`, `script.js` and `style.css`, including responsive GSAP timelines, pinning, scrub and cleanup. README declares MIT; root `LICENSE` returned 404. No source code or assets copied.
- [Sohamumap/3d-scroll-website](https://github.com/Sohamumap/3d-scroll-website): studied the 192-frame Canvas sequence, loading and scroll-to-frame logic. Root `LICENSE` returned 404 and reuse permission remains unverified. No source or frames copied.
- [Zingy](https://zingy-drink.vercel.app/) and [21st.dev](https://21st.dev/): requested for visual research, but the environment proxy denied access with HTTP 403. No claim is made to have reviewed them visually.
- [shadcn/ui button](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/button.tsx): reviewed focus, disabled state and semantic control conventions. The site uses its own simple semantic controls; no component code copied and no library added.
- The user supplied freight and studio scroll-video specifications as technical references and clarified that their animation approach should apply to CITRUS 01. The implementation uses paused `currentTime` seeking, serialized seeks and scroll-driven progress. Reference CloudFront media requests returned HTTP 403; the clips were not visually reviewed or incorporated. No freight/studio text or identity is used.
- Video integration tests generate a temporary FFmpeg test pattern. It verifies media seeking, not a pouring scene, and is never included in the site or deployment.
- GSAP is used under its current Standard License, not represented as MIT. Other dependencies retain their package licences.

## Skills audit

The cloud catalog supplies cloud runtime/onboarding skills. Global and local skill locations were inspected. `design-taste-frontend`, `find-skills`, `live-3d-web-experiences` and a local 3D guide were not found.

The previously reviewed official `frontend-design`, `react-best-practices` and `web-design-guidelines` instructions were available in the original build workspace and used in this rebuild. They were not installed globally or silently treated as user-authored requirements. Applied typography/layout critique, lazy animation imports, transient state outside React renders, semantic controls, focus states, responsive image sizing and reduced-motion handling. Fresh Vercel web interface guidelines were fetched for the review.

Reference snapshots and downloaded skill documents remain outside the published application. The selected approach and remaining continuous-pour asset needs are documented in `docs/DESIGN-NOTES.md`.
