import { FormEvent, useState } from "react";
import { defaultSiteContent } from "@shared/siteContent";

function phoneDisplay(phone: string) {
  return phone === "+96181333194" ? "+961 81 333 194" : phone;
}

export function ContactPage() {
  const [status, setStatus] = useState("");
  const content = defaultSiteContent;

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
      <section className="page-hero compact contact-hero">
        <p className="eyebrow light">Contact SAMWATEX</p>
        <h1>Start a conversation from anywhere.</h1>
        <p className="page-hero-copy">For commercial enquiries, sourcing, exports and partnership opportunities, connect with our team in Lebanon.</p>
      </section>
      <section className="contact-layout section-pad">
        <div className="contact-details">
          <p className="eyebrow">SAMWATEX · Lebanon</p>
          <h2>Let’s talk business.</h2>
          <div className="contact-detail-row"><span>Email</span><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></div>
          <div className="contact-detail-row"><span>Phone</span><a href={`tel:${content.contactPhone}`}>{phoneDisplay(content.contactPhone)}</a></div>
          <div className="contact-detail-row address-row"><span>Address</span><p>{content.contactAddress}</p></div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <label>Name<input name="name" autoComplete="name" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Company<input name="company" autoComplete="organization" /></label>
          <label>Message<textarea name="message" rows={6} required /></label>
          <button className="button dark" type="submit">Send enquiry</button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </section>
    </div>
  );
}
