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
        <h1>Commercial categories shaped by market demand.</h1>
        <p className="page-hero-copy">
          SAMWATEX combines product sourcing, international trade and distribution capability across selected categories through its operating companies.
        </p>
      </section>

      <section className="industry-intro section-pad">
        <div className="section-label">Our commercial focus</div>
        <div className="editorial-copy">
          <h2>{content.industriesTitle}</h2>
          <p>Our model is not limited to one product line. We focus on categories where sourcing relationships, market knowledge and dependable execution can create long-term value.</p>
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
          <div><p className="eyebrow">Product portfolio</p><h2>Structured for a catalog that can grow.</h2></div>
          <p className="section-note">Exact brands, SKUs and photography will be added as approved public content becomes available; the site structure is ready for that expansion.</p>
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
          <h2>HMD International Group brings these commercial capabilities to market.</h2>
        </div>
        <Link className="button dark" to="/companies/hmd-international-group">View HMD profile</Link>
      </section>
    </div>
  );
}
