import { FormEvent, useState } from "react";

export function ContactPage() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    setStatus("Sending…");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      event.currentTarget.reset();
      setStatus("Thank you. Your message has been received.");
    } else {
      setStatus("We couldn't send your message. Please try again.");
    }
  }

  return (
    <div className="inner-page contact-page">
      <section className="page-hero compact">
        <p className="eyebrow light">Contact</p>
        <h1>Let’s start a conversation.</h1>
      </section>
      <section className="contact-layout section-pad">
        <div>
          <p className="eyebrow">HMD International Group</p>
          <h2>Tell us what you need.</h2>
          <p>Use this form for commercial enquiries, partnerships and general information.</p>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <label>Name<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Company<input name="company" /></label>
          <label>Message<textarea name="message" rows={6} required /></label>
          <button className="button dark" type="submit">Send enquiry</button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </section>
    </div>
  );
}
