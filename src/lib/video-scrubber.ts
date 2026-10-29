/** Seek-only video motion. The media is never played, looped, or faded. */
export function createVideoScrubber(video: HTMLVideoElement) {
  const SEEK_THRESHOLD = 1 / 60;
  const END_GUARD = 1 / 48;
  let progress = 0;
  let current = 0;
  let raf = 0;
  let disposed = false;

  function lastTime() {
    return Number.isFinite(video.duration) ? Math.max(0, video.duration - END_GUARD) : 0;
  }
  function requestFrame() {
    if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function frame() {
    raf = 0;
    if (disposed) return;
    const target = progress * lastTime();
    const gap = target - current;
    current = Math.abs(gap) < .0008 ? target : current + gap * .22;
    // Serialize seeks: issuing another while decoding can make scrubbing stall.
    if (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - current) > SEEK_THRESHOLD) {
      video.currentTime = current;
    }
    if (Math.abs(target - current) >= .0008) requestFrame();
  }
  function metadata() {
    video.pause();
    current = progress * lastTime();
    requestFrame();
  }
  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else requestFrame();
  }
  video.addEventListener('loadedmetadata', metadata);
  video.addEventListener('loadeddata', requestFrame);
  video.addEventListener('seeked', requestFrame);
  document.addEventListener('visibilitychange', visibility);
  if (video.readyState >= 1) metadata();
  return {
    setProgress(value: number) {
      progress = Math.min(1, Math.max(0, value));
      requestFrame();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', metadata);
      video.removeEventListener('loadeddata', requestFrame);
      video.removeEventListener('seeked', requestFrame);
      document.removeEventListener('visibilitychange', visibility);
    },
  };
}
