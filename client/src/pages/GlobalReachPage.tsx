import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

const exportSteps = [
  {
    number: "01",
    title: "Understand the requirement",
    description: "Start with the product, destination, quantity, timing and commercial objective behind the enquiry.",
  },
  {
    number: "02",
    title: "Align supply",
    description: "Coordinate sourcing and product availability around the needs of the customer and target market.",
  },
  {
    number: "03",
    title: "Coordinate export",
    description: "Bring the commercial and movement details together from SAMWATEX's base in Lebanon.",
  },
  {
    number: "04",
    title: "Support market fulfilment",
    description: "Work with operating companies and partners to keep execution practical, visible and dependable.",
  },
];

export function GlobalReachPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  return (
    <div className="inner-page reach-page">
      <section className="page-hero reach-hero">
        <p className="eyebrow light">Global reach</p>
        <h1>One base. Commercial reach that extends further.</h1>
        <p className="page-hero-copy">
          SAMWATEX is based in Lebanon. From there, the group develops sourcing, trade and export relationships across Africa, the Middle East and selected international markets.
        </p>
      </section>

      <section className="reach-map-section section-pad">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">From Lebanon</p>
            <h2>Our base is fixed. Our market view is international.</h2>
          </div>
          <p className="section-note">
            The highlighted regions are export markets and commercial relationships—not SAMWATEX office locations.
          </p>
        </div>

        <div className="reach-map" aria-label="SAMWATEX export reach from Lebanon to international markets">
          <div className="reach-map-grid" aria-hidden="true" />
          <div className="reach-origin">
            <span>Based in</span>
            <strong>Lebanon</strong>
            <small>Commercial & export base</small>
          </div>
          <div className="reach-route route-one" aria-hidden="true" />
          <div className="reach-route route-two" aria-hidden="true" />
          <div className="reach-route route-three" aria-hidden="true" />
          {content.markets.map((market, index) => (
            <div className={`reach-destination destination-${index + 1}`} key={market.region}>
              <span>0{index + 1}</span>
              <strong>{market.region}</strong>
              <small>{market.description}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="reach-principles section-pad section-dark">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow light">How we work</p>
            <h2>A practical path from opportunity to market.</h2>
          </div>
          <p className="section-note light-note">
            Every market is different. The operating model stays disciplined while the commercial approach adapts to the requirement.
          </p>
        </div>
        <div className="reach-step-grid">
          {exportSteps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="market-detail-section section-pad">
        <div className="section-heading-row">
          <div><p className="eyebrow">Markets served</p><h2>{content.marketsTitle}</h2></div>
          <Link className="text-link" to="/contact">Discuss a market <span>↗</span></Link>
        </div>
        <div className="market-detail-grid">
          {content.markets.map((market, index) => (
            <article key={market.region}>
              <span>0{index + 1}</span>
              <div><h3>{market.region}</h3><p>{market.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-band reach-contact-band">
        <div>
          <p className="eyebrow light">Export enquiries</p>
          <h2>Have a product requirement or market opportunity?</h2>
        </div>
        <Link className="button light" to="/contact?type=export">Start an export enquiry</Link>
      </section>
    </div>
  );
}
