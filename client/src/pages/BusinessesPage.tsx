import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function BusinessesPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  useEffect(() => { void getSiteContent().then(setContent); }, []);

  return (
    <div className="inner-page textile-what-we-do-page">
      <section className="page-hero alternate textile-page-hero">
        <p className="eyebrow light">What we do</p>
        <h1>We turn mixed used-clothing supply into wholesale-ready product.</h1>
        <p className="page-hero-copy">SAMWATEX combines physical product preparation with commercial market knowledge: receive, sort, grade, build assortments, bale and coordinate export from Lebanon.</p>
      </section>

      <section className="industry-intro section-pad">
        <div className="section-label">Operating model</div>
        <div className="editorial-copy">
          <h2>The value is in the preparation.</h2>
          <p>Used clothing is not one uniform commodity. Garment type, condition, season, destination and buyer preference all affect what a useful wholesale bale should contain. Our role is to make those distinctions before the goods reach the customer.</p>
          <p>That means the sorting floor and the commercial side stay connected: the product being prepared should make sense for the market it is being sold into.</p>
        </div>
      </section>

      <section className="business-detail-list section-pad section-dark textile-business-list">
        {content.capabilities.map((capability) => (
          <article key={capability.title}>
            <span>{capability.eyebrow}</span>
            <div><h2>{capability.title}</h2><p>{capability.description}</p></div>
          </article>
        ))}
      </section>

      <section className="business-paths section-pad section-warm textile-business-paths">
        <Link to="/products" className="business-path-card"><span>Products</span><h3>See the clothing, footwear, accessories and household textile categories we prepare.</h3><i>↗</i></Link>
        <Link to="/process" className="business-path-card dark-card"><span>Process</span><h3>Follow the work from incoming textile supply through grading, baling and export.</h3><i>↗</i></Link>
      </section>

      <section className="industry-company-link section-pad textile-buyer-brief">
        <div>
          <p className="eyebrow">Wholesale requirements</p>
          <h2>Start with the destination, category and volume.</h2>
          <p className="section-note">Tell us where the goods are going, the product families you need, your preferred season or mix and the expected order volume. Availability can then be discussed against the actual requirement.</p>
        </div>
        <Link className="button dark" to="/contact">Send an enquiry</Link>
      </section>
    </div>
  );
}
