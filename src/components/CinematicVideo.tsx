'use client';

import { useEffect, useRef } from 'react';
import { publicAsset } from '@/lib/public-asset';
import { createVideoScrubber } from '@/lib/video-scrubber';

// Public delivery URLs, compiled into the static site. No unrelated demo footage.
const desktopSource = process.env.NEXT_PUBLIC_POUR_VIDEO_1080 ?? '';
const mobileSource = process.env.NEXT_PUBLIC_POUR_VIDEO_720 ?? '';

function resolveSource(source: string) {
  if (/^https?:\/\//.test(source)) return source;
  return publicAsset(`/${source.replace(/^\//, '')}`);
}

export default function CinematicVideo() {
  const element = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = element.current!;
    const root = video.closest<HTMLElement>('.ritual')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let stop = () => {};

    function start() {
      stop();
      if (reduced.matches || (!desktopSource && !mobileSource)) return;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const small = matchMedia('(max-width: 900px)').matches || connection?.saveData;
      const source = resolveSource((small ? mobileSource : desktopSource) || desktopSource || mobileSource);
      const controller = new AbortController();
      const scrubber = createVideoScrubber(video);
      let disposed = false;
      let blobURL = '';
      const ready = () => { root.dataset.videoReady = 'true'; };
      const failure = () => { delete root.dataset.videoReady; };
      const scroll = (event: Event) => scrubber.setProgress((event as CustomEvent<number>).detail);
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      root.addEventListener('citrus:scroll', scroll);
      video.addEventListener('loadeddata', ready);
      video.addEventListener('error', failure);
      scrubber.setProgress(Number(root.dataset.scrollProgress ?? 0));

      async function load() {
        try {
          // A buffered blob avoids network range-request latency on every seek.
          const response = await fetch(source, { signal: controller.signal });
          if (!response.ok || Number(response.headers.get('content-length')) > 64 * 1024 * 1024) throw new Error('Stream directly');
          const blob = await response.blob();
          if (disposed) return;
          blobURL = URL.createObjectURL(blob);
          video.src = blobURL;
        } catch {
          // Cross-origin media may support direct video loading without fetch CORS.
          if (disposed) return;
          video.src = source;
        } finally {
          clearTimeout(timeout);
        }
        video.load();
      }
      void load();
      stop = () => {
        disposed = true;
        controller.abort();
        clearTimeout(timeout);
        scrubber.dispose();
        root.removeEventListener('citrus:scroll', scroll);
        video.removeEventListener('loadeddata', ready);
        video.removeEventListener('error', failure);
        delete root.dataset.videoReady;
        video.pause();
        video.removeAttribute('src');
        video.load();
        if (blobURL) URL.revokeObjectURL(blobURL);
      };
    }
    reduced.addEventListener('change', start);
    start();
    return () => { stop(); reduced.removeEventListener('change', start); };
  }, []);

  return <video ref={element} className="ritual-video" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} />;
}
