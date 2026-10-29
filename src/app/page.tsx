import Image from 'next/image';
import PourExperience from '@/components/PourExperience';
import ContactForm from '@/components/ContactForm';
import MotionSystem from '@/components/MotionSystem';
import { Arrow, LemonBranch, Wordmark } from '@/components/Brand';
import { publicAsset } from '@/lib/public-asset';

export default function Home() {
  return <>
    <header className="site-header">
      <a href="#top" className="brand-link" aria-label="CITRUS 01 home"><Wordmark /></a>
      <nav aria-label="Main navigation">
        <a href="#experience">The experience</a>
        <a href="#the-drink">The drink</a>
        <a href="#contact" className="nav-contact">Say hello <Arrow /></a>
      </nav>
    </header>
    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-media"><Image src={publicAsset('/images/campaign-hero.webp')} alt="A chilled yellow CITRUS 01 can on sunlit travertine, surrounded by lemons and leaves" fill priority sizes="(max-width: 767px) 1000px, (max-width: 1100px) 1600px, 100vw" /></div>
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Sparkling citrus. A brighter state of mind.</p>
          <h1 id="hero-title"><span className="hero-title-line"><span>A little</span></span><span className="hero-title-line"><span>liquid</span></span><span className="hero-title-line"><span><em>sunshine.</em></span></span></h1>
          <p className="hero-description">For the unhurried afternoons.<br />And all the bright moments in between.</p>
          <a className="underlined-link hero-link" href="#experience">Discover the feeling <Arrow /></a>
        </div>
        <div className="hero-foot"><span>An independent drink concept</span><span className="scroll-cue">Scroll to unwind <Arrow direction="down" /></span><span>250 mL / Endless possibility</span></div>
      </section>
      <div className="intro-strip"><span>Sun-ripened inspiration.</span><span>Little bubbles. Big feeling.</span><span>Stay on the bright side.</span></div>
      <PourExperience />
      <section className="product section-pad" id="the-drink" aria-labelledby="product-title">
        <div className="product-heading"><span className="eyebrow">Meet CITRUS 01</span><h2 id="product-title">A bright idea.<br /><em>Beautifully simple.</em></h2><div className="product-edition"><span>01</span><p>Sparkling citrus<br />A flavour, imagined.</p></div></div>
        <div className="product-grid">
          <figure className="product-figure"><div className="product-photo"><Image src={publicAsset('/images/campaign-product.webp')} alt="CITRUS 01 resting diagonally on pale stone among fresh lemons, ice and blossoms" fill sizes="(max-width: 767px) 100vw, 48vw" /></div><figcaption><span>A study in the good things.</span><span>CITRUS 01 / Sparkling citrus</span></figcaption></figure>
          <div className="product-copy"><LemonBranch /><h3>Less ordinary.<br />A little <em>more zest.</em></h3><p>We imagined a drink with the warmth of a late afternoon and the brightness of freshly cut citrus. Easy to reach for. Worth slowing down for.</p><p>One little can. A whole new way to see the sunny side.</p><dl className="product-notes"><div><dt>The inspiration</dt><dd>Citrus, sunshine, simplicity</dd></div><div><dt>The feeling</dt><dd>Light, lively, unhurried</dd></div><div><dt>The occasion</dt><dd>Whenever the moment calls</dd></div></dl><p className="concept-note">A fictional beverage concept. Flavour descriptions express a creative direction, not verified product claims.</p></div>
        </div>
      </section>
      <section className="sensory" aria-labelledby="sensory-title">
        <div className="sensory-photo"><Image src={publicAsset('/images/campaign-citrus.webp')} alt="A sunlit lemon half with translucent pulp and a deep green leaf" fill sizes="(max-width: 767px) 100vw, 50vw" /></div>
        <div className="sensory-copy"><span className="eyebrow">Inspired by the essentials</span><h2 id="sensory-title">Nothing quite<br />like the<br /><em>bright side.</em></h2><p>The zest of citrus. The dance of little bubbles.<br className="desktop-break" /> The kind of refreshment you can almost feel.</p><div className="sensory-line" /><div className="sensory-details"><div><span>Bright</span><p>A citrus-led flavour idea.</p></div><div><span>Light</span><p>A fine, playful sparkle.</p></div><div><span>Easy</span><p>A moment to make your own.</p></div></div></div>
      </section>
      <section className="lifestyle" aria-labelledby="lifestyle-title">
        <div className="lifestyle-media"><Image src={publicAsset('/images/campaign-afternoon.webp')} alt="CITRUS 01 and a sparkling glass with ice and lemon peel on a sunny terrace" fill sizes="(max-width: 767px) 1100px, 100vw" /></div>
        <div className="lifestyle-shade" />
        <div className="lifestyle-copy"><span className="eyebrow">Nowhere else to be.</span><h2 id="lifestyle-title">Make an<br />afternoon<br /><em>of it.</em></h2><p>The ice can melt.<br />The conversation can wander.<br />The good bit is right here.</p></div>
        <span className="lifestyle-caption">Best enjoyed with a little time to spare.</span>
      </section>
      <section className="contact section-pad" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy"><span className="eyebrow">A fresh beginning</span><h2 id="contact-title">Good things<br />start with<br /><em>hello.</em></h2><p>A bright idea. A creative collaboration.<br />A conversation worth having.</p><LemonBranch /></div>
        <ContactForm />
      </section>
    </main>
    <footer className="site-footer">
      <div className="footer-top"><p>A little sunshine goes a long way.</p><a href="#top" className="back-top">Back to the bright side <Arrow /></a></div>
      <div className="footer-wordmark"><Wordmark footer /></div>
      <div className="footer-bottom"><p>Independent concept / Not affiliated with any existing beverage brand</p><span>© 2026 CITRUS 01</span><span>Made of bright ideas.</span></div>
    </footer>
    <MotionSystem />
  </>;
}
