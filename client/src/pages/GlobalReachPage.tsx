import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

const exportSteps = [
  {
    number: "01",
    title: "Define the buyer brief",
    description: "Start with destination, product categories, season, preferred condition or grade and expected order volume.",
  },
  {
    number: "02",
    title: "Match the assortment",
    description: "Align available sorted product with the categories and market mix the buyer is actually looking for.",
  },
  {
    number: "03",
    title: "Prepare the shipment",
    description: "Bale, identify and stage confirmed goods for handling and container loading from Lebanon.",
  },
  {
    number: "04",
    title: "Coordinate export",
    description: "Bring the commercial order and physical movement together for the destination market.",
  },
];

export function GlobalReachPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  return (
    <div className="inner-page reach-page textile-export-page">
      <section className="page-hero reach-hero textile-page-hero">
        <p className="eyebrow light">Export markets</p>
        <h1>Wholesale textile exports from one operating base in Lebanon.</h1>
        <p className="page-hero-copy">
          SAMWATEX prepares reusable clothing and textile goods in Lebanon for wholesale customers across Africa, the Middle East and selected additional markets.
        </p>
      </section>

      <section className="reach-map-section section-pad">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">From Lebanon</p>
            <h2>The product is prepared here. The demand is wider.</h2>
          </div>
          <p className="section-note">
            The highlighted regions represent export markets and commercial relationships. SAMWATEX does not present them as overseas office locations.
          </p>
        </div>

        <div className="reach-map" aria-label="SAMWATEX wholesale textile export reach from Lebanon">
          <div className="reach-map-grid" aria-hidden="true" />
          <div className="reach-origin">
            <span>Operating base</span>
            <strong>Lebanon</strong>
            <small>Sorting · grading · export</small>
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
            <p className="eyebrow light">Export workflow</p>
            <h2>The destination influences the product before loading begins.</h2>
          </div>
          <p className="section-note light-note">
            A useful export order starts with a clear market brief, then works backward into categories, assortment, baling and shipment preparation.
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
          <Link className="text-link" to="/contact?type=export">Discuss a market <span>↗</span></Link>
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

      <section className="contact-band reach-contact-band textile-contact-band">
        <div>
          <p className="eyebrow">Export enquiries</p>
          <h2>Tell us the destination and product mix you need.</h2>
        </div>
        <Link className="button light" to="/contact?type=export">Start an export enquiry</Link>
      </section>
    </div>
  );
}
