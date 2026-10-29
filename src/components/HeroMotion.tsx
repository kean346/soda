'use client';
import { useEffect } from 'react';

export default function HeroMotion() {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
    const photo = document.querySelector<HTMLElement>('.hero-photo');
    if (!photo) return;
    const move = (e: PointerEvent) => {
      if (!media.matches) return;
      photo.style.setProperty('--image-x', `${(e.clientX / innerWidth - .5) * 8}px`);
    };
    const reset = () => photo.style.setProperty('--image-x', '0px');
    photo.addEventListener('pointermove', move);
    photo.addEventListener('pointerleave', reset);
    media.addEventListener('change', reset);
    return () => { photo.removeEventListener('pointermove', move); photo.removeEventListener('pointerleave', reset); media.removeEventListener('change', reset); };
  }, []);
  return null;
}
