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
    title: "Confirm the order",
    description: "Agree the commercial scope before product is committed to final baling and shipment preparation.",
  },
  {
    number: "04",
    title: "Bale & identify",
    description: "Prepare confirmed goods for efficient handling with clear category or assortment identification.",
  },
  {
    number: "05",
    title: "Stage & load",
    description: "Organize finished bales for warehouse movement and container loading from the Lebanon operation.",
  },
  {
    number: "06",
    title: "Coordinate export",
    description: "Keep the commercial order connected to shipment preparation and the agreed destination-market requirements.",
  },
] as const;

const logisticsNotes = [
  ["Packing", "Baled goods are prepared for efficient warehouse handling and container loading."],
  ["Identification", "Categories and assortments are kept clear so the shipment matches the confirmed buyer brief."],
  ["Loading", "Finished orders are staged for container movement from the Lebanon operating base."],
  ["Coordination", "HMD and SAMWATEX keep buyer, product and shipment information aligned through export preparation."],
] as const;

export function GlobalReachPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  return (
    <div className="inner-page reach-page textile-export-page">
      <section className="page-hero reach-hero textile-page-hero">
        <p className="eyebrow light">Export & logistics</p>
        <h1>Wholesale textile exports prepared from one operating base in Lebanon.</h1>
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
            <small>Sorting · grading · baling · export</small>
          </div>
          <div className="reach-route route-one" aria-hidden="true" />
          <div className="reach-route route-two" aria-hidden="true" />
          <div className="reach-route route-three" aria-hidden="true" />
          {content.markets.map((market, index) => (
            <div className={`reach-destination destination-${index + 1}`} key={market.region}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{market.region}</strong>
              <small>{market.description}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="reach-principles section-pad section-dark export-workflow-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow light">Export workflow</p>
            <h2>The destination influences the product before loading begins.</h2>
          </div>
          <p className="section-note light-note">
            A useful export order starts with a clear market brief, then works backward into categories, assortment, baling and shipment preparation.
          </p>
        </div>
        <div className="reach-step-grid export-step-grid">
          {exportSteps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="logistics-detail section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">Shipment preparation</p><h2>Commercially simple. Operationally disciplined.</h2></div>
          <p className="section-note">SAMWATEX prepares the goods and coordinates the export process. Carrier services, sailing schedules and destination clearance depend on the shipment and the parties appointed for that movement.</p>
        </div>
        <div className="logistics-detail-grid">
          {logisticsNotes.map(([title, body], index) => (
            <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>
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
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{market.region}</h3><p>{market.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="export-enquiry-brief section-pad section-dark">
        <div className="section-heading-row">
          <div><p className="eyebrow light">For a useful quote</p><h2>Send the information that changes the order.</h2></div>
          <p className="section-note light-note">Destination, category, season, preferred condition or grade, expected volume and any packing requirement give HMD enough context to start a real commercial discussion.</p>
        </div>
        <Link className="button primary" to="/contact?type=export">Start an export enquiry</Link>
      </section>
    </div>
  );
}
