/** Attach the drawn stream to the actual transformed artwork, including after resize. */
export function createPourChoreography(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('.ritual-stage')!;
  const mouth = root.querySelector<HTMLElement>('.can-mouth')!;
  const lip = root.querySelector<HTMLElement>('.glass-lip')!;
  const svg = root.querySelector<SVGSVGElement>('.pour-stream')!;
  const paths = [...svg.querySelectorAll<SVGPathElement>('path')];
  const liquid = root.querySelector<HTMLElement>('.liquid-fill')!;
  const mask = root.querySelector<HTMLElement>('.liquid-mask')!;
  const surface = root.querySelector<HTMLElement>('.liquid-surface')!;
  const bubbles = [...root.querySelectorAll<HTMLElement>('.bubble')];
  let fill = 0;
  let time = 0;
  let liquidHeight = mask.clientHeight;

  function drawStream() {
    const bounds = stage.getBoundingClientRect();
    const from = mouth.getBoundingClientRect();
    const to = lip.getBoundingClientRect();
    const x1 = from.x - bounds.x, y1 = from.y - bounds.y;
    const x2 = to.x - bounds.x, y2 = to.y - bounds.y;
    const drop = y2 - y1;
    const ripple = Math.sin(time * 23) * .9;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const d = `M${x1},${y1} C${x1 + (x2 - x1) * .3 + ripple},${y1 + drop * .18} ${x2 + ripple},${y1 + drop * .7} ${x2},${y2}`;
    paths.forEach(path => path.setAttribute('d', d));
  }

  function render(nextFill: number, nextTime: number) {
    fill = nextFill;
    time = nextTime;
    const top = (100 - fill * 100).toFixed(3);
    liquid.style.clipPath = `inset(${top}% 0 0 0)`;
    mask.style.setProperty('--fill-top', `${top}%`);
    surface.style.opacity = fill > .012 ? '1' : '0';
    if (time >= 2.4 && time < 4.95) drawStream();
    // Particles stay a constant size while the revealed liquid level changes.
    bubbles.forEach((bubble, index) => {
      const phase = ((time - 2.65) * .8 + index * .137 + 10) % 1;
      bubble.style.transform = `translateY(${-phase * liquidHeight * .97}px)`;
      bubble.style.opacity = time > 2.65 && phase < fill
        ? String(Math.sin(phase * Math.PI) * .85) : '0';
    });
  }

  const observer = new ResizeObserver(() => {
    liquidHeight = mask.clientHeight;
    render(fill, time);
  });
  observer.observe(stage);
  return {
    render,
    dispose() {
      observer.disconnect();
      liquid.style.removeProperty('clip-path');
      mask.style.removeProperty('--fill-top');
      surface.style.removeProperty('opacity');
      bubbles.forEach(bubble => { bubble.style.removeProperty('transform'); bubble.style.removeProperty('opacity'); });
      paths.forEach(path => path.removeAttribute('d'));
    },
  };
}
