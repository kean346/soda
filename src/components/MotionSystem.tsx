'use client';

import { useEffect } from 'react';
import { createPourChoreography } from '@/lib/pour-choreography';

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
        const choreography = createPourChoreography(ritual);
        const liquid = { fill: 0 };
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
          gsap.set('.ritual-step--open, .ritual-step--pour, .ritual-step--finish', { autoAlpha: 0, y: 24 });
          gsap.set('.can-rig', { scale: mobile ? .82 : .88, xPercent: mobile ? 9 : 0, yPercent: 8, rotate: 0 });
          gsap.set('.glass-rig', { autoAlpha: 0, y: 80, scale: .88 });
          gsap.set('.glass-shadow', { opacity: 0, scaleX: .7 });
          gsap.set('.pour-stream', { autoAlpha: 0 });
          gsap.set('.pour-stream-path, .pour-stream-highlight', { strokeDashoffset: 1 });
          choreography.render(0, 0);
          const chapter = ritual.querySelector('.ritual-chapter')!;
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              id: 'citrus-ritual', trigger: ritual, start: 'top top',
              end: () => `+=${Math.round(window.innerHeight * (mobile ? 4.8 : 5.5))}`,
              pin: '.ritual-stage', pinSpacing: true, scrub: .42,
              anticipatePin: 1, invalidateOnRefresh: true,
              onUpdate(self) {
                ritual.dataset.scrollProgress = self.progress.toFixed(4);
                ritual.dispatchEvent(new CustomEvent('citrus:scroll', { detail: self.progress }));
              },
            },
            onUpdate() {
              ritual.dataset.visualProgress = timeline.progress().toFixed(4);
              choreography.render(liquid.fill, timeline.time());
              const time = timeline.time();
              chapter.textContent = time < 1.02 ? '01 / Anticipation' : time < 2.43 ? '02 / Open' : time < 4.78 ? '03 / Pour' : '04 / Enjoy';
            },
          });
          timeline
            .to('.can-rig', { scale: mobile ? .96 : 1.03, xPercent: mobile ? 0 : -8, yPercent: 0, duration: 1.15, ease: 'power1.inOut' }, 0)
            .to('.ritual-step--intro', { autoAlpha: 0, y: -35, duration: .34 }, .72)
            .to('.can-tab', { rotateX: -76, y: -5, duration: .24, ease: 'power2.out' }, 1.02)
            .to('.can-opening', { opacity: .9, duration: .18 }, 1.02)
            .to('.can-mist', { opacity: 1, y: -25, scale: 1.5, duration: .18, stagger: .04 }, 1.06)
            .to('.can-mist', { opacity: 0, y: -52, duration: .35 }, 1.24)
            .to('.ritual-step--open', { autoAlpha: 1, y: 0, duration: .32 }, 1.03)
            .to('.ritual-step--open', { autoAlpha: 0, y: -30, duration: .3 }, 1.72)
            .to('.glass-rig', { autoAlpha: 1, y: 0, scale: 1, duration: .62, ease: 'power2.out' }, 1.72)
            .to('.glass-shadow', { opacity: 1, scaleX: 1, duration: .62 }, 1.72)
            .to('.can-shadow', { opacity: 0, scaleX: .5, duration: .5 }, 1.76)
            .to('.can-rig', { rotate: 108, xPercent: -10, yPercent: mobile ? 18 : 15, scale: mobile ? .8 : .82, duration: .78, ease: 'power2.inOut' }, 1.78)
            .to('.pour-stream', { autoAlpha: 1, duration: .16 }, 2.43)
            .to('.pour-stream-path, .pour-stream-highlight', { strokeDashoffset: 0, duration: .25, ease: 'power2.in' }, 2.43)
            .to('.ritual-step--pour', { autoAlpha: 1, y: 0, duration: .32 }, 2.47)
            .to(liquid, { fill: .92, duration: 2.1, ease: 'power1.inOut' }, 2.65)
            .to('.ritual-step--pour', { autoAlpha: 0, y: -30, duration: .3 }, 4.36)
            .to('.pour-stream', { autoAlpha: 0, duration: .22 }, 4.7)
            .to('.can-rig', { rotate: 18, xPercent: mobile ? -12 : -28, yPercent: mobile ? -10 : -12, scale: mobile ? .72 : .76, duration: .72, ease: 'power2.inOut' }, 4.7)
            .to('.ritual-step--finish', { autoAlpha: 1, y: 0, duration: .38 }, 4.78)
            .to('.glass-rig', { scale: mobile ? 1.07 : 1.12, xPercent: mobile ? -8 : -4, duration: .85, ease: 'power1.inOut' }, 4.78)
            .fromTo('.ritual-progress > span', { scaleX: 0 }, { scaleX: 1, duration: 5.7 }, 0);
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
          choreography.dispose();
          ctx.revert();
          ritual.querySelector('.ritual-chapter')!.textContent = '01 / Anticipation';
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
