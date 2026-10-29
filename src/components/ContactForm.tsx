'use client';
import { useState, type FormEvent } from 'react';

export default function ContactForm() {
  const [checked, setChecked] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChecked(true);
  }
  return <form className="contact-form" onSubmit={submit} onChange={() => setChecked(false)}>
    <p className="demo-note"><span aria-hidden="true"/>Concept form · Not connected</p>
    <div className="form-row"><div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="Alex Taylor…" required maxLength={100}/></div><div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" spellCheck={false} placeholder="alex@example.com…" required maxLength={254}/></div></div>
    <div className="field"><label htmlFor="interest">What brings you here?</label><select name="interest" id="interest" defaultValue="collaboration"><option value="collaboration">A creative collaboration</option><option value="project">A project enquiry</option><option value="hello">Just saying hello</option></select></div>
    <div className="field"><label htmlFor="message">Your bright idea</label><textarea name="message" id="message" placeholder="Tell us a little about it…" required minLength={10} maxLength={3000} rows={3}/></div>
    <div className="form-submit"><button type="submit">Preview enquiry <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5"/></svg></button><p>This is a demo. Your details stay in this page and won’t be sent or saved.</p></div>
    <p className="form-status" role="status">{checked ? 'Your enquiry passes validation. Nothing was sent — a contact endpoint has not been connected.' : ''}</p>
  </form>;
}
