# CITRUS 01 — COMPLETE WEBSITE REBUILD

## YOUR ROLE

Act as an award-winning creative director, senior interactive web designer, motion designer and expert Next.js engineer.

**The first version of this website was unacceptable. I want you to rebuild it to an exceptionally high standard.**

The current result feels like a basic 3D experiment. It has an unattractive animation that requires me to manually interact with the object. The visual design is nowhere near the premium, cinematic experience I requested.

Do not simply polish the existing design. Inspect what exists, preserve any genuinely useful code or assets, and replace the failed implementation.

You have permission to redesign this project completely. Do not modify my separate paceIT website or unrelated repositories.

## 1. THE EXPERIENCE I ACTUALLY WANT

Create a complete, exceptionally polished, single-page website for **CITRUS 01**, a fictional premium sparkling citrus beverage.

Think:

- Premium international beverage campaign.
- Awwwards-quality creative direction.
- Beautiful editorial typography.
- Art-directed cinematic product photography.
- Sophisticated layouts and large, beautiful compositions.
- Butter-yellow backgrounds, warm ivory and subtle botanical green.
- Smooth scroll storytelling with coordinated animations.
- Photorealistic product imagery and believable lighting.
- Responsive layouts deliberately designed for mobile.

**The website must immediately look beautiful before the user even scrolls.**

Absolutely avoid generic AI-generated-looking landing pages, excessive rounded cards, gradients everywhere, generic marketing icons, cheap CSS animations, oversized empty sections or conventional SaaS layouts.

The design should feel like a real independent creative agency built it.

## 2. CRITICAL: FIX THE SCROLL ANIMATION

My biggest complaint is that the current animation requires manual dragging or clicking.

That is NOT what I requested.

I want the animation to progress **automatically according to normal vertical page scrolling**.

When I scroll down, the sequence advances. When I scroll up, it reverses.

Use GSAP ScrollTrigger with a scrubbed timeline, proper pinning and responsive animation control.

### Intended cinematic sequence

1. The visitor encounters a beautifully rendered yellow citrus drink can in an elegant, sunlit composition.
2. As scrolling begins, the can moves forward and subtly rotates.
3. The can opens, with a carefully animated tab.
4. Continuing to scroll tilts the can.
5. Citrus-coloured liquid pours into a transparent glass containing ice.
6. The liquid level rises, accompanied by believable bubbles and subtle splashes.
7. The camera composition transitions into a beautifully designed product-information section.
8. The visitor continues naturally through the rest of the website.

Scrolling must control the animation's progress. No drag-to-rotate interaction, manual sliders, click-to-play or buttons to advance the sequence.

### Most important technical instruction

Do NOT pretend that rotating a static product image or a simple 3D cylinder constitutes a believable pouring animation.

Investigate the best feasible implementation:

**Preferred:** A professionally rendered image sequence or short animation converted into sequential frames, controlled by GSAP ScrollTrigger and rendered on Canvas.

**Alternative:** A genuinely well-authored 3D animation using Three.js / React Three Fiber with appropriate can, glass and liquid assets.

**Fallback:** A beautifully art-directed 2.5D sequence with carefully composited product layers, masked liquid fill and animated effects.

Choose the technique based on the actual available assets and tools, not whichever is easiest to code.

If you cannot produce a realistic pouring sequence, do not substitute an ugly imitation and call it finished. Build a premium alternative, explain the remaining asset limitation and identify exactly what is needed.

## 3. GITHUB REFERENCES

Study these accessible repositories:

**Scroll animation foundation:**
https://github.com/Dieg0arc/3D-scrolling-practice

Study its GSAP scroll timeline, pinned transitions and animation progress handling.

**Image-sequence reference:**
https://github.com/Sohamumap/3d-scroll-website

Study how scrolling controls animation frames.

**Design/interaction inspiration:**
https://zingy-drink.vercel.app/

The first reference is MIT-licensed. Check licence permissions for any other code before reusing it.

Do not copy these designs verbatim. Reuse appropriate technical patterns while creating an original experience.

## 4. ART DIRECTION

Use the original CITRUS 01 creative brief and product visuals supplied in the project.

Colour palette:

- Warm ivory: `#F6F0DF`
- Butter yellow: `#F2D66B`
- Soft white: `#FAFAF6`
- Deep charcoal: `#25251F`
- Botanical green: `#A7B88A`

Consider a pairing such as Instrument Serif and Plus Jakarta Sans, or a more sophisticated pairing if it improves the final outcome.

The product should look like a professionally photographed premium beverage can, with condensation, elegant highlights, citrus imagery and realistic shadows.

Use composition, typography, lighting, whitespace and visual hierarchy to create impact. Avoid relying on colourful effects or excessive movement.

The entire experience should feel cohesive and intentionally designed.

## 5. COMPLETE WEBSITE STRUCTURE

This is one page, but it must feel like a complete premium product website.

**Section 01 — Hero**

Full-viewport, immediately beautiful. Product imagery, bold editorial headline, subtle supporting text and an elegant scroll cue. Use thoughtful initial entrance animations.

**Section 02 — The Pour**

The signature scroll-controlled cinematic sequence described above. This should be the visual highlight of the website.

**Section 03 — Product Introduction**

Introduce the fictional sparkling citrus beverage using exceptional typography, carefully placed product photography and a beautiful asymmetric layout.

**Section 04 — Ingredients / Experience**

Citrus, freshness and refreshment as a visual story. Use compelling editorial images, restrained motion, tasteful text and layered compositions.

Do not invent health claims, certifications or nutritional information.

**Section 05 — Lifestyle Feature**

A large cinematic product scene with beautiful imagery, subtle parallax and a confident typographic statement.

**Section 06 — Contact**

A beautifully designed contact section with a form-ready visual layout.

Do not invent real company contact details. Any form without a configured backend must clearly be a non-submitting demo, not pretend to send emails.

**Footer**

Minimal, attractive and refined. Include a small "Independent concept / Not affiliated with any existing beverage brand" note.

No ecommerce functionality is required. Leave the structure ready for future Shopify integration.

## 6. SKILLS AND COMPONENT SOURCING

Inspect my installed/global/local Codex skills before beginning.

Look specifically for:

- `design-taste-frontend`
- `frontend-design`
- `find-skills`
- `live-3d-web-experiences`
- `react-best-practices`
- `web-design-guidelines`

Use relevant installed skills. If any are missing, inspect trusted sources and tell me which would actually improve the build. Do not assume they are installed.

Study appropriate components and animation patterns from 21st.dev, shadcn/ui and high-quality open-source examples, but avoid adding components merely to fill space.

## 7. TECHNICAL QUALITY

Use Next.js App Router, TypeScript, Tailwind CSS and GSAP. Add Three.js/React Three Fiber only if the selected animation genuinely requires it.

Requirements:

- Fully responsive desktop, tablet and mobile.
- Natural scroll-wheel, trackpad and touch behaviour.
- Reversible scroll-controlled animation.
- No unnecessary manual interaction.
- Optimised image assets and animation loading.
- No broken layout or horizontal overflow.
- No console errors.
- Appropriate accessibility and reduced-motion fallbacks.
- Avoid excessive JavaScript and unnecessary dependencies.
- Keep the actual content accessible if animation fails.

Respect the user's normal scrolling. Avoid gratuitous scroll-jacking.

## 8. VISUAL QUALITY CONTROL — MANDATORY

Do not finish after successfully compiling.

1. Inspect the existing code and identify what caused the poor result.
2. Establish a coherent visual direction before rebuilding.
3. Create the page and motion system.
4. Run the application.
5. Use browser screenshots or available browser-testing tools to inspect it.
6. Test at approximately 1440px desktop, 768px tablet and 390px mobile.
7. Actually scroll through the entire page and verify animation progress, reversibility and transitions.
8. Assess typography, image quality, composition, spacing and mobile presentation.
9. Fix awkward sections, amateur animations, clipping, missing content and inconsistent spacing.
10. Run production build and relevant checks.

If browser inspection is unavailable, state that limitation rather than claiming the visual testing was completed.

Do not declare success merely because the page renders.

## 9. DEFINITION OF DONE

The completed website should:

- Look like a premium, real beverage-brand campaign.
- Have multiple beautifully designed sections.
- Make an exceptional visual first impression.
- Feature an actual scroll-controlled cinematic experience.
- Work naturally without dragging or clicking to progress the animation.
- Feel intentionally designed on both mobile and desktop.
- Be polished enough for me to show a prospective Australian beverage startup.

**IMPORTANT: I would rather have a genuinely beautiful, sophisticated scroll experience than a technically complicated but ugly 3D animation.**

Prioritise outstanding art direction and execution over unnecessary complexity.

Take ownership of the entire rebuild. Work directly in the current project, inspect the available assets and skills, implement the improvements, test them, and report the final outcome and any genuinely missing animation assets.
