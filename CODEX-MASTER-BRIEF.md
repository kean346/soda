# CITRUS 01 — Codex master creative & implementation brief

You are an award-winning creative director, product designer, motion designer and senior Next.js engineer. Build a fully working, original, strikingly beautiful, one-page concept site for a **fictional premium sparkling citrus drink**, provisionally named **CITRUS 01**. The concept is intended as an independent portfolio piece that could later be pitched to a young Australian beverage company. **It is not a client commission, and must not use Ouhh Dats Nice's name, logo, proprietary photography, real contact details, actual product claims or packaging.** Do not alter any existing paceIT website or other project.

## Source material in this folder

- `00-concept-board.jpg`: visual art-direction board.
- `01-hero.webp`: horizontal citrus-can still-life reference.
- `02-pouring.webp`: macro sparkling pour reference.
- `03-still-life.webp`: overhead citrus-can/editorial reference.

These are **original AI-generated static visuals**, not an animation sequence, actual product photography or a ready-to-animate GLB. Use them as the initial approved look and feel, and as page imagery where suitable. If producing additional frames, make the same can consistent in size, label, angle, color and lighting. Do not pretend static images constitute a working pour animation.

## Creative direction

*Luxury, sunlight, crisp editorial design, minimal but surprising.* Feel: an art-directed beverage campaign rather than a standard ecommerce template. Think warm stone, citrus peel, a small flash of botanical green, fine grain, authentic condensation, imperfect shadows, and bold but disciplined typography. No black futuristic backgrounds, purple gradients, glassmorphism, excessive floating pills/cards, or random staggered fade-ins.

**Palette**: `#F6F0DF` warm ivory, `#F2D66B` butter yellow, `#FAFAF6` almost white, `#25251F` charcoal, `#A7B88A` subtle botanical green. Accent green sparingly. Use soft ambient shadows and daylight, not glossy gradients.

**Typography**: expressive large editorial headline, e.g. Instrument Serif for one striking headline/accent and Space Grotesk (or another carefully chosen licensed sans) for body/UI. Strong typographic grid, deliberate line breaks, good mobile rhythm. Suggested hero copy: **“A bright idea. In a can.”** Product descriptor: **“Sparkling citrus, reimagined.”** Tone confident, concise, human. Any ingredients, benefits, origin or nutrition should be clearly fictional placeholder copy, not asserted real-company facts.

**Brand object**: original matte butter-yellow 250 mL can with small off-white label `CITRUS / 01 / SPARKLING CITRUS`, minimal leaf-and-citrus illustration and subtle metallic trim. Can must look like the same physical object everywhere.

## Page choreography — a single-page story, not an oversized brochure

1. **Hero, immediately arresting**: 100svh-ish editorial composition. Product is large and art directed, offset from a very large headline. Sharp asymmetry, generous breathing room, fine details and minimal navigation (`Experience`, `The drink`, `Contact`). Hero motion: subtle entrance plus small mouse/scroll-reactive change; no long loader blocking the first impression.
2. **Signature scroll moment**: as the visitor scrolls, the can rotates and tilts, the tab opens, and the liquid pours into a refined glass; glass fills; floating droplets/bubbles and restrained background/typography transition. The sequence must scrub forward **and backward** with scroll. The scene should feel physically coherent with matched framing and lighting, not unrelated photos crossfading. Prefer performant, pre-rendered image/video frames tied to GSAP ScrollTrigger for believable liquid. A real-time 3D can may animate around it if useful. Build an accessible, performant fallback if high-quality sequence assets are not yet available; **report the missing animation assets honestly** instead of claiming a fake pour is complete.
3. **Product/editorial moment**: wide full-bleed detail photography from provided assets, minimal copy and a considered reveal of texture, citrus, condensation and can materials.
4. **Lifestyle/composition**: oversized image or asymmetric editorial split featuring fruit, ice and sunlight. Short real design-purpose copy, no invented founder story, awards, testimonials, stockists or medical claims.
5. **Contact section**: compelling original composition, heading such as “Something good starts here.” Provide an integration-ready contact form with proper validation and polished controls. Since this is a concept, **don't invent brand emails or falsely claim that messages were sent**. Mark submission as a demo/not connected until a real endpoint is configured, or connect to a user-approved destination only after instruction. No shop required now; design an obvious point where Shopify/ecommerce can be integrated later without rebuilding.
6. **Footer**: restrained and beautiful. Include discreet “Independent creative concept • Not affiliated with any existing beverage brand” attribution. No Ouhh Dats Nice brand references in the public site.

## Verified technical/code references — inspect, don't blindly clone

**Primary reference (public source code; README declares MIT):** https://github.com/Dieg0arc/3D-scrolling-practice
- Live: https://3-d-scrolling-practice.vercel.app/
- Exact scroll/3D implementation: `script.js` and `style.css` at that repository. Vanilla Three.js + GSAP ScrollTrigger, working 3D `.glb` model, scroll-synced rotation, responsiveness. Adapt the underlying timeline, 3D scene logic and responsive patterns into a new Next.js project; never copy its bottle model, stock imagery or font without checking their separate asset rights. Preserve required licence attribution if incorporating code.

**Useful sequence reference (public code, but no explicit reuse licence verified):** https://github.com/Sohamumap/3d-scroll-website
- Live: https://sohamumap.github.io/3d-scroll-website/
- `index.html` shows pinned-canvas scroll animation and a 192-frame pre-rendered sequence. Use as an educational pattern unless you verify reuse permission; implement your own logic and original assets.

**Optional Next.js-oriented technical reference (check licence before code reuse):** https://github.com/dgreenheck/nextjs-3d-scroll-animations
- Uses Next.js, React Three Fiber and GSAP. Study architecture only when reuse rights are unclear.

**Optional style/scroll reference (do not copy branding or assets):** https://github.com/adrianhajdin/gsap_cocktails
- https://gsap-cocktails.vercel.app/
- Useful for typography, ScrollTrigger and rich product-story transitions.

## Skills instructions

Before coding, enumerate **actually installed** Codex/global skills and read applicable SKILL.md files. Specifically look for prior skills mentioned in the user's workflow:
- `design-taste-frontend` — if present, invoke for art direction.
- `find-skills` — if present, use only to discover missing capabilities.
- `live-3d-web-experiences` (possibly named `live-3d-guide.pdf`) — if present, use the user's local 3D guide to inform product lighting, scroll camera beats and adaptive rendering. **Do not assume it installed merely because it was previously requested.**

Official additional skills to use **only if missing** (review source before installing):
- `frontend-design` from `anthropics/skills`: `npx skills add anthropics/skills --skill frontend-design -a codex`
- `react-best-practices` and `web-design-guidelines` from `vercel-labs/agent-skills`: `npx skills add vercel-labs/agent-skills -a codex` (select those skills).

The `skills` CLI requires Node.js 22.20+ at current release. If commands or versions differ locally, inspect current installation instructions; don't modify skills globally without a reason. Optionally inspect 21st.dev for suitable reusable components, but default to bespoke composition over generic kits.

## Engineering bar

- Create **a separate standalone project** (new folder). Use Next.js App Router, strict TypeScript, Tailwind CSS, GSAP/ScrollTrigger, responsive images, Next/font; use Three.js/R3F only where materially beneficial. No unnecessary backend or ecommerce.
- Responsive from 360 px mobile to large desktops; test 375, 390, 768, 1024 and 1440 px. Avoid horizontal overflow, clipped headlines, blocking animation and tiny touch targets.
- Keep heavy canvas logic client-side; progressive asset loading, responsive image sizes, limited memory footprint, graceful fallback on low-end phones, clear loading state only when needed; respect `prefers-reduced-motion`; support touch/keyboard.
- Scroll sequence should be pinned only as long as useful; let the user move naturally into subsequent content. Preserve backward scrubbing and avoid jumps on resize.
- Contact section should be honest about demo status; navigation, interactions and all links should function or be labelled as future integrations.
- Use semantic markup, contrast, accessible names, sensible metadata, alt text and focus states. Prefer 60 fps feel over loading huge images and shaders.
- Start by inspecting files and source references and presenting a brief design/animation plan. Then implement fully, run install/build/lint, preview desktop/mobile, fix issues, and deliver a working local preview plus deployment steps.
- At the end, explicitly report what is **working** versus still missing (particularly whether a real frame-by-frame pour animation has been sourced/generated) and never claim a convincing pour when it is only a static transition.

## Non-negotiable finish quality

Treat this as a premium agency portfolio piece. It should communicate the product in 3 seconds, use one memorable interactive moment, and feel exquisitely composed everywhere. The design should be distinctive and coherent, not bloated with features or generic AI styling. Final code and assets should be reusable for a portfolio without misrepresenting a real startup partnership.
