'use client';

import { useState, useSyncExternalStore, type FormEvent } from 'react';
import { Arrow } from './Brand';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [complete, setComplete] = useState(false);
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverReady);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Please enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter an email address, such as alex@example.com.';
    if (message.length < 10) next.message = 'Tell us a little more (at least 10 characters).';
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      setComplete(false);
      (form.elements.namedItem(first) as HTMLElement)?.focus();
      return;
    }
    setComplete(true);
  }

  return <form className="contact-form" onSubmit={submit} noValidate onChange={() => setComplete(false)}>
    <div className="form-heading"><span>Let’s talk bright ideas.</span><span className="demo-label">Concept form</span></div>
    <p className="form-disclosure" id="form-disclosure">A little preview of a future conversation. This demo doesn’t send or store your details.</p>
    <div className="form-row">
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="Alex Taylor…" required maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name ? <p className="field-error" id="name-error">{errors.name}</p> : null}</div>
      <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder="alex@example.com…" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email ? <p className="field-error" id="email-error">{errors.email}</p> : null}</div>
    </div>
    <div className="field"><label htmlFor="interest">What brings you here?</label><select name="interest" id="interest" defaultValue="collaboration"><option value="collaboration">A creative collaboration</option><option value="project">A project enquiry</option><option value="hello">Just saying hello</option></select></div>
    <div className="field"><label htmlFor="message">Your bright idea</label><textarea name="message" id="message" placeholder="Tell us what you’re thinking…" required minLength={10} maxLength={3000} rows={3} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message ? <p className="field-error" id="message-error">{errors.message}</p> : null}</div>
    <div className="form-bottom"><button type="submit" disabled={!hydrated} aria-describedby="form-disclosure">Preview your note <Arrow /></button><span>Good ideas welcome.</span></div>
    <noscript><p className="form-disclosure">Enable JavaScript to preview this demo form. Nothing has been sent.</p></noscript>
    <p className="form-status" role="status">{complete ? 'Your note is ready. Nothing was sent — this concept form isn’t connected yet.' : ''}</p>
  </form>;
}
