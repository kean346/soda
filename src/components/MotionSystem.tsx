'use client';

import { useEffect } from 'react';

export default function MotionSystem() {
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      const media = gsap.matchMedia();
      cleanup = () => media.revert();
      media.add({
        desktop: '(min-width: 768px)',
        mobile: '(max-width: 767px)',
        motion: '(prefers-reduced-motion: no-preference)',
      }, (context) => {
        if (!context.conditions?.motion) return;
        const mobile = Boolean(context.conditions.mobile);
        const ritual = document.querySelector<HTMLElement>('.ritual')!;
        const ctx = gsap.context(() => {
          if (window.scrollY < 80) {
            gsap.from('.hero-title-line > span', { yPercent: 108, duration: 1.15, stagger: .11, ease: 'power3.out' });
            gsap.from('.hero-description, .hero-link', { opacity: 0, y: 12, duration: .75, delay: .55, stagger: .12 });
            gsap.from('.hero-media', { scale: 1.035, duration: 1.6, ease: 'power2.out' });
          }
          gsap.to('.hero-media img', {
            yPercent: mobile ? 3 : 7, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.set('.ritual-copy--second', { autoAlpha: 0, y: 24 });
          gsap.set('.ritual-finish', { clipPath: 'inset(100% 0% 0% 0%)' });
          gsap.set('.ritual-finish-type', { y: 45, opacity: 0 });
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              id: 'citrus-ritual', trigger: ritual, start: 'top top',
              end: () => `+=${Math.round(window.innerHeight * (mobile ? 1.65 : 2.2))}`,
              pin: '.ritual-stage', pinSpacing: true, scrub: .55,
              anticipatePin: 1, invalidateOnRefresh: true,
              onUpdate(self) {
                ritual.dataset.scrollProgress = self.progress.toFixed(4);
                ritual.dispatchEvent(new CustomEvent('citrus:scroll', { detail: self.progress }));
              },
            },
            onUpdate() { ritual.dataset.visualProgress = timeline.progress().toFixed(4); },
          });
          timeline
            .fromTo('.ritual-shot--pour img', { scale: 1.18, yPercent: -3 }, { scale: 1.01, yPercent: 2, duration: 2.65 }, 0)
            .to('.ritual-copy--first', { opacity: 0, y: -35, duration: .45 }, .85)
            .to('.ritual-copy--second', { autoAlpha: 1, y: 0, duration: .45 }, 1.15)
            .to('.ritual-copy--second', { autoAlpha: 0, y: -25, duration: .35 }, 2.1)
            .to('.ritual-finish', { clipPath: 'inset(0% 0% 0% 0%)', duration: .85, ease: 'power2.inOut' }, 2.3)
            .fromTo('.ritual-finish img', { scale: 1.15 }, { scale: 1, duration: 1.3 }, 2.3)
            .to('.ritual-finish-type', { y: 0, opacity: 1, duration: .5 }, 2.95)
            .fromTo('.ritual-progress > span', { scaleX: 0 }, { scaleX: 1, duration: 3.75 }, 0);
          ritual.dataset.motionReady = 'true';
          gsap.fromTo('.product-photo img', { yPercent: -4, scale: 1.1 }, {
            yPercent: 4, scale: 1.1, ease: 'none',
            scrollTrigger: { trigger: '.product-photo', start: 'top bottom', end: 'bottom top', scrub: true },
          });
          gsap.fromTo('.lifestyle-media img', { yPercent: -5, scale: 1.12 }, {
            yPercent: 5, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: '.lifestyle', start: 'top bottom', end: 'bottom top', scrub: true },
          });
          gsap.fromTo('.sensory-line', { scaleX: 0 }, {
            scaleX: 1, ease: 'none',
            scrollTrigger: { trigger: '.sensory', start: 'top 75%', end: 'bottom 70%', scrub: true },
          });
        });
        return () => {
          ctx.revert();
          delete ritual.dataset.motionReady;
          delete ritual.dataset.scrollProgress;
          delete ritual.dataset.visualProgress;
        };
      });
      document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    }
    // All content is server rendered. A failed animation import leaves a readable page.
    setup().catch(() => { cleanup(); });
    return () => { cancelled = true; cleanup(); };
  }, []);
  return null;
}
