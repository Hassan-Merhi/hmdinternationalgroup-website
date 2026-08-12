import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

function phoneDisplay(phone: string) {
  return phone === "+96181333194" ? "+961 81 333 194" : phone;
}

const inquiryTypes = [
  ["general", "General enquiry"],
  ["product", "Product enquiry"],
  ["export", "Export enquiry"],
  ["supplier", "Supplier enquiry"],
  ["partnership", "Partnership enquiry"],
  ["hmd", "HMD International Group enquiry"],
] as const;

export function ContactPage() {
  const [status, setStatus] = useState("");
  const [reference, setReference] = useState("");
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const requestedType = searchParams.get("type");
  const defaultType = inquiryTypes.some(([value]) => value === requestedType) ? requestedType! : "general";
  const [inquiryType, setInquiryType] = useState(defaultType);

  useEffect(() => {
    setInquiryType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    setReference("");
    setStatus("Sending…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => ({}))) as { reference?: string; message?: string };
      if (!response.ok) {
        setStatus(body.message || "We couldn't send your enquiry. Please review the form and try again.");
        return;
      }
      formElement.reset();
      setInquiryType("general");
      setReference(body.reference || "");
      setStatus("Thank you. Your business enquiry has been received by SAMWATEX.");
    } catch {
      setStatus("We couldn't send your enquiry. Please try again or email sales@samwatex.com.");
    }
  }

  return (
    <div className="inner-page contact-page enquiry-page">
      <section className="page-hero compact contact-hero">
        <p className="eyebrow light">Contact SAMWATEX</p>
        <h1>Start the right commercial conversation.</h1>
        <p className="page-hero-copy">
          Product, export, supplier and partnership enquiries are handled from our base in Lebanon. Tell us what you need and where the opportunity is.
        </p>
      </section>

      <section className="contact-layout enquiry-layout section-pad">
        <div className="contact-details">
          <p className="eyebrow">SAMWATEX · Lebanon</p>
          <h2>Direct contact.</h2>
          <p className="contact-intro">For immediate commercial contact, reach the SAMWATEX team directly or submit the structured enquiry form.</p>
          <div className="contact-detail-row"><span>Email</span><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></div>
          <div className="contact-detail-row"><span>Phone</span><a href={`tel:${content.contactPhone}`}>{phoneDisplay(content.contactPhone)}</a></div>
          <div className="contact-detail-row address-row"><span>Address</span><p>{content.contactAddress}</p></div>
          <div className="enquiry-guide">
            <span>Useful to include</span>
            <p>Product or category · destination market · expected quantity · timing · company details</p>
          </div>
        </div>

        <form className="contact-form business-enquiry-form" onSubmit={submit}>
          <div className="form-heading">
            <p className="eyebrow">Business enquiry</p>
            <h2>Tell us what you are looking for.</h2>
          </div>

          <label className="form-span-2">Enquiry type
            <select name="inquiryType" value={inquiryType} onChange={(event) => setInquiryType(event.target.value)} required>
              {inquiryTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>

          <label>Name<input name="name" autoComplete="name" maxLength={120} required /></label>
          <label>Business email<input name="email" type="email" autoComplete="email" maxLength={180} required /></label>
          <label>Company<input name="company" autoComplete="organization" maxLength={180} /></label>
          <label>Country / market<input name="country" autoComplete="country-name" maxLength={120} required /></label>
          <label>Phone<input name="phone" type="tel" autoComplete="tel" maxLength={60} /></label>
          <label>WhatsApp<input name="whatsapp" type="tel" maxLength={60} /></label>
          <label>Company of interest
            <select name="companyInterest" defaultValue={inquiryType === "hmd" ? "HMD International Group" : "SAMWATEX"}>
              <option>SAMWATEX</option>
              <option>HMD International Group</option>
              <option>Not sure / Group enquiry</option>
            </select>
          </label>
          <label>Product / category<input name="productInterest" maxLength={180} placeholder="e.g. textiles, apparel, general merchandise" /></label>
          <label className="form-span-2">Message<textarea name="message" rows={7} maxLength={4000} required /></label>
          <input type="hidden" name="sourcePath" value="/contact" />
          <label className="website-field" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>

          <div className="form-submit-row form-span-2">
            <button className="button dark" type="submit">Send business enquiry</button>
            <p>We use these details only to respond to your enquiry.</p>
          </div>
          {status && <p className="form-status form-span-2" role="status">{status}{reference ? ` Reference: ${reference}.` : ""}</p>}
        </form>
      </section>
    </div>
  );
}
