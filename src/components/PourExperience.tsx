import Image from 'next/image';
import { publicAsset } from '@/lib/public-asset';
import { Arrow } from './Brand';
import CinematicVideo from './CinematicVideo';

const bubbles = [11, 19, 27, 34, 43, 52, 61, 69, 77, 85];

/** A layered scroll scene. An approved movie can still replace it through CinematicVideo. */
export default function PourExperience() {
  return <section className="ritual" id="experience" aria-labelledby="ritual-title">
    <div className="ritual-stage">
      <div className="ritual-set" aria-hidden="true">
        <div className="ritual-sun" />
        <div className="ritual-surface" />
        <div className="can-shadow" />
        <div className="can-rig">
          <Image className="can-cutout" src={publicAsset('/images/citrus-can-cutout.webp')} alt="" fill priority sizes="(max-width: 767px) 48vw, 31vw" />
          <span className="can-opening" />
          <svg className="can-tab" viewBox="0 0 72 28"><path fill="#c4c1b8" stroke="#f2eee5" strokeWidth="1.5" fillRule="evenodd" d="M5 13C5 3 64 1 67 11C71 24 7 29 5 13ZM23 12C21 5 55 5 56 11C57 17 24 20 23 12Z" /><path d="M9 15 20 13" stroke="#7f7e77" strokeWidth="3" /></svg>
          <span className="can-mouth" />
          <span className="can-mist can-mist--one" />
          <span className="can-mist can-mist--two" />
        </div>
        <svg className="pour-stream" preserveAspectRatio="none">
          <defs><linearGradient id="citrus-liquid-light"><stop stopColor="#bc7c18" /><stop offset=".35" stopColor="#f5c747" /><stop offset=".65" stopColor="#fff0ad" /><stop offset="1" stopColor="#dfa62b" /></linearGradient></defs>
          <path className="pour-stream-path" pathLength="1" />
          <path className="pour-stream-highlight" pathLength="1" />
        </svg>
        <div className="glass-rig">
          <span className="glass-lip" />
          <div className="liquid-mask"><div className="liquid-fill">{bubbles.map((left, index) => <i className={`bubble bubble--${index + 1}`} style={{ left: `${left}%` }} key={left} />)}</div><span className="liquid-surface" /></div>
          <Image className="glass-cutout" src={publicAsset('/images/citrus-glass-cutout.webp')} alt="" fill priority sizes="(max-width: 767px) 58vw, 32vw" />
        </div>
        <div className="glass-shadow" />
      </div>
      <CinematicVideo />
      <div className="ritual-top"><span>The little ritual</span><span>Scroll to pour</span></div>
      <div className="ritual-step ritual-step--intro">
        <span className="eyebrow">First, a little anticipation.</span>
        <h2 id="ritual-title">Good things<br />take a <em>pour.</em></h2>
        <p>A little ice. A little sparkle.<br />A moment that’s entirely yours.</p>
      </div>
      <div className="ritual-step ritual-step--open" aria-hidden="true">
        <span className="eyebrow">A small click.</span>
        <p className="display-copy">Let the<br /><em>sunshine out.</em></p>
      </div>
      <div className="ritual-step ritual-step--pour" aria-hidden="true">
        <span className="eyebrow">Then the bright part.</span>
        <p className="display-copy">Ice. Citrus.<br /><em>Little bubbles.</em></p>
      </div>
      <div className="ritual-step ritual-step--finish" aria-hidden="true">
        <span className="eyebrow">And there it is.</span>
        <p className="display-copy">A glass full<br />of <em>afternoon.</em></p>
      </div>
      <div className="ritual-bottom"><span className="ritual-chapter">01 / Anticipation</span><div className="ritual-progress" aria-hidden="true"><span /></div><Arrow direction="down" /></div>
    </div>
  </section>;
}
