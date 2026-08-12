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
    <div className="inner-page industries-page textile-products-page">
      <section className="page-hero industries-hero textile-products-hero">
        <p className="eyebrow light">Wholesale products</p>
        <h1>Used clothing and textile categories prepared for resale markets.</h1>
        <p className="page-hero-copy">
          SAMWATEX prepares reusable clothing, footwear, accessories and household textile goods for wholesale buyers. Exact availability, grade and mix vary with incoming supply and the destination-market requirement.
        </p>
      </section>

      <section className="industry-intro section-pad textile-product-intro">
        <div className="section-label">Product approach</div>
        <div className="editorial-copy">
          <h2>{content.industriesTitle}</h2>
          <p>We separate products into useful commercial categories instead of presenting every incoming item as the same stock. Buyers can discuss category-led assortments, seasonal mixes and market-specific combinations based on available supply.</p>
        </div>
      </section>

      <section className="industry-directory section-pad section-dark textile-product-directory">
        <div className="industry-directory-grid textile-product-directory-grid">
          {content.industries.map((industry) => (
            <article className="industry-directory-card textile-product-category" id={industry.slug} key={industry.slug}>
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

      <section className="product-collections section-pad section-warm textile-assortments">
        <div className="section-heading-row">
          <div><p className="eyebrow">Assortment examples</p><h2>Categories can be narrowed to the way your market buys.</h2></div>
          <p className="section-note">This catalogue describes product families, not guaranteed live stock. Final assortments are confirmed against available supply, requested grade, destination, season and volume.</p>
        </div>
        <div className="product-collection-grid textile-collection-grid">
          {content.productCollections.map((collection, index) => (
            <article key={collection.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
              <ul>{collection.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="textile-product-note section-pad">
        <div className="textile-product-note-copy">
          <p className="eyebrow">Need a specific mix?</p>
          <h2>Send the market brief before the order.</h2>
          <p>Tell us the destination, categories, season, preferred condition or grade and approximate volume. That gives the commercial team a useful starting point for availability and packing discussions.</p>
        </div>
        <div className="textile-product-note-actions">
          <Link className="button dark" to="/contact">Ask about availability</Link>
          <Link className="text-link" to="/process">See how we prepare goods <span>↗</span></Link>
        </div>
      </section>
    </div>
  );
}
