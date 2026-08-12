import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function IndustriesPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  return (
    <div className="inner-page industries-page">
      <section className="page-hero industries-hero">
        <p className="eyebrow light">Industries & products</p>
        <h1>Product categories selected around real customer demand.</h1>
        <p className="page-hero-copy">
          SAMWATEX and HMD International Group work across textiles, apparel, general merchandise and international trade, with sourcing shaped by specification, quantity, destination and timing.
        </p>
      </section>

      <section className="industry-intro section-pad">
        <div className="section-label">Commercial focus</div>
        <div className="editorial-copy">
          <h2>{content.industriesTitle}</h2>
          <p>We are not tied to a single product line. The focus is on categories where we can source responsibly, understand the commercial requirement and supply the destination market on workable terms.</p>
        </div>
      </section>

      <section className="industry-directory section-pad section-dark">
        <div className="industry-directory-grid">
          {content.industries.map((industry) => (
            <article className="industry-directory-card" id={industry.slug} key={industry.slug}>
              <span className="industry-number">{industry.eyebrow}</span>
              <h2>{industry.title}</h2>
              <p>{industry.description}</p>
              <div className="industry-tags">
                {industry.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="product-collections section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">Product portfolio</p><h2>Selected categories, sourced to requirement.</h2></div>
          <p className="section-note">Availability and assortments vary by supplier and destination market. Send us the specification, quantity and target destination for a commercial discussion.</p>
        </div>
        <div className="product-collection-grid">
          {content.productCollections.map((collection, index) => (
            <article key={collection.title}>
              <span>0{index + 1}</span>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
              <ul>{collection.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="industry-company-link section-pad">
        <div>
          <p className="eyebrow">Operating company</p>
          <h2>HMD International Group handles the market-facing trading activity.</h2>
        </div>
        <Link className="button dark" to="/companies/hmd-international-group">View HMD profile</Link>
      </section>
    </div>
  );
}
