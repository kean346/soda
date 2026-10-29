import Image from 'next/image';
import { publicAsset } from '@/lib/public-asset';
import { Arrow } from './Brand';
import CinematicVideo from './CinematicVideo';

/** A photographic motion study. The artwork is not a fluid animation sequence. */
export default function PourExperience() {
  return <section className="ritual" id="experience" aria-labelledby="ritual-title">
    <div className="ritual-stage">
      <div className="ritual-shot ritual-shot--pour">
        <Image src={publicAsset('/images/campaign-pour.webp')} alt="Sunlight catches a golden citrus pour flowing from the CITRUS 01 can into a ribbed glass with ice" fill sizes="(max-width: 767px) 1250px, (max-width: 1100px) 1600px, 100vw" />
      </div>
      <CinematicVideo />
      <div className="ritual-shade" />
      <div className="ritual-top"><span>The little ritual</span><span>A study in sunshine</span></div>
      <div className="ritual-copy ritual-copy--first">
        <span className="eyebrow">Take a breath.</span>
        <h2 id="ritual-title">Good things<br />take a <em>pour.</em></h2>
        <p>A little ice. A little sparkle.<br />A moment that’s entirely yours.</p>
      </div>
      <div className="ritual-copy ritual-copy--second" aria-hidden="true">
        <span className="eyebrow">Let the afternoon happen.</span>
        <p className="display-copy">Less hurry.<br /><em>More happy.</em></p>
      </div>
      <div className="ritual-finish" aria-hidden="true">
        <Image src={publicAsset('/images/campaign-citrus.webp')} alt="" fill sizes="(max-width: 767px) 900px, 100vw" />
        <div className="ritual-finish-shade" />
        <p className="ritual-finish-type">All the <em>bright</em><br />little things.</p>
      </div>
      <div className="ritual-bottom"><span>Stay in the moment</span><div className="ritual-progress" aria-hidden="true"><span /></div><Arrow direction="down" /></div>
    </div>
  </section>;
}
