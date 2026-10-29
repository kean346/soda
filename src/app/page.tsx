import Image from 'next/image';
import PourExperience from '@/components/PourExperience';
import ContactForm from '@/components/ContactForm';
import HeroMotion from '@/components/HeroMotion';
import { publicAsset } from '@/lib/public-asset';

function CitrusMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 5v70M5 40h70M15 15l50 50M15 65l50-50" stroke="currentColor" strokeWidth="1.3"/><circle cx="40" cy="40" r="31" stroke="currentColor" strokeWidth="1.3"/><circle cx="40" cy="40" r="4" fill="currentColor"/></svg>;
}

export default function Home() {
  return <>
    <header className="header">
      <a href="#" className="wordmark" aria-label="Citrus 01 home" translate="no">CITRUS<span>01</span><span className="brand-dot" /></a>
      <nav aria-label="Main navigation"><a href="#experience">Experience</a><a href="#the-drink">The drink</a><a className="nav-contact" href="#contact">Let’s talk <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5"/></svg></a></nav>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-topline"><span>A little sunshine. A little sparkle.</span><span className="hero-edition">An independent drink concept</span></div>
        <div className="hero-heading"><h1 id="hero-title">A bright idea.<br/><span>In a can.</span></h1><div className="hero-side"><CitrusMark/><p>Sparkling citrus,<br/>reimagined.</p></div></div>
        <div className="hero-photo" id="hero-photo"><Image src={publicAsset("/images/01-hero.webp")} alt="A butter-yellow CITRUS 01 can with fresh lemons and leaves in warm afternoon sunlight" fill priority quality={90} sizes="(max-width: 700px) 1500px, 100vw"/><a href="#experience" className="round-link" aria-label="Explore the scroll-driven pouring experience"><span aria-hidden="true">↓</span></a><span className="photo-caption">Sunshine, served chilled.</span></div>
        <div className="hero-bottom"><span>Made for the bright side.</span><a href="#experience">Scroll to get a taste <span aria-hidden="true">↓</span></a><span>250 mL of possibility</span></div>
        <HeroMotion/>
      </section>
      <PourExperience/>
      <section className="drink-section" id="the-drink" aria-labelledby="drink-title">
        <div className="drink-intro"><span className="small-label">The drink, imagined.</span><h2 id="drink-title">Less ordinary.<br/>More <em>zest.</em></h2><p>A bright citrus note. A fine, lively sparkle. A little invitation to slow down and savour the good bit.</p></div>
        <div className="drink-grid"><figure className="pour-photo"><Image src={publicAsset("/images/02-pouring.webp")} alt="Close-up concept image of sparkling golden citrus pouring into a ribbed glass" fill sizes="(max-width: 700px) 100vw, 60vw"/><figcaption>A moment worth pouring.</figcaption></figure><div className="drink-note"><CitrusMark/><h3>Good things.<br/>Nothing extra.</h3><p>One considered can. A citrus-inspired palette. An easy afternoon state of mind.</p><dl><div><dt>The mood</dt><dd>Sunlit & unhurried</dd></div><div><dt>The inspiration</dt><dd>Fresh citrus & fine bubbles</dd></div><div><dt>The format</dt><dd>A 250 mL concept can</dd></div></dl><p className="fineprint">A fictional drink concept. Flavour and product details are creative proposals, not verified ingredient or nutrition claims.</p></div></div>
      </section>
      <section className="lifestyle" aria-labelledby="lifestyle-title"><div className="lifestyle-copy"><span className="small-label">An afternoon, well spent.</span><h2 id="lifestyle-title">Leave a little<br/>room for<br/><em>the good bit.</em></h2><p>Long shadows. Ice in the glass.<br/>Nowhere else you need to be.</p><a className="text-link" href="#contact">Let’s make something bright <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5"/></svg></a></div><figure><Image src={publicAsset("/images/03-still-life.webp")} alt="CITRUS 01 can resting among lemons, melting ice, green leaves and citrus blossoms" fill sizes="(max-width: 700px) 100vw, 55vw"/><figcaption>A study in sunshine.</figcaption></figure></section>
      <section className="contact" id="contact" aria-labelledby="contact-title"><div className="contact-heading"><span className="small-label">A fresh beginning.</span><h2 id="contact-title">Something good<br/>starts <em>here.</em></h2><p>Have a bright idea of your own?<br/>There’s always room at the table.</p><CitrusMark/></div><ContactForm/></section>
    </main>
    <footer><a href="#" className="footer-brand" translate="no">CITRUS 01<svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5"/></svg></a><div className="footer-bottom"><p>Independent creative concept • Not affiliated with any existing beverage brand</p><a href="#main">Back to the sunshine ↑</a><span>© 2026 CITRUS 01</span></div></footer>
  </>;
}
