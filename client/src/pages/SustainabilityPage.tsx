import { Link } from "react-router-dom";

const principles = [
  {
    number: "01",
    title: "Keep usable goods in circulation",
    body: "The first objective is practical reuse. Clothing, footwear and household textiles that still have commercial life are sorted into categories that can move back into resale markets instead of being treated as undifferentiated waste.",
  },
  {
    number: "02",
    title: "Sort before deciding",
    body: "Mixed supply is evaluated item by item and category by category. That separation creates a better chance of matching usable goods with an appropriate buyer, season and destination market.",
  },
  {
    number: "03",
    title: "Prepare for real demand",
    body: "Reuse only works when the product has a market. We build assortments around buyer requirements so recovered goods are prepared for practical resale rather than simply moved from one warehouse to another.",
  },
  {
    number: "04",
    title: "Handle material responsibly",
    body: "Quality control, baling and organized warehouse handling help protect sorted goods through storage, loading and export preparation while keeping categories identifiable and manageable.",
  },
] as const;

const cycle = [
  ["Mixed supply", "Reusable clothing and textile goods enter the operation in mixed form."],
  ["Inspection & sorting", "Items are separated by type, condition, season and market usefulness."],
  ["Wholesale assortment", "Usable goods are grouped into clear categories or buyer-specific mixes."],
  ["Baling & export", "Prepared goods are compressed, identified and staged for wholesale shipment."],
  ["Second commercial life", "The product returns to use through resale markets rather than ending its useful life prematurely."],
] as const;

export function SustainabilityPage() {
  return (
    <div className="inner-page sustainability-page">
      <section className="page-hero sustainability-hero textile-page-hero">
        <p className="eyebrow light">Textile reuse</p>
        <h1>The useful life of a garment should not end at its first owner.</h1>
        <p className="page-hero-copy">
          SAMWATEX works in the reuse economy: identify what remains usable, sort it carefully, prepare it for a real market and keep it in circulation for longer.
        </p>
      </section>

      <section className="sustainability-intro section-pad">
        <div className="section-label">Our approach</div>
        <div className="editorial-copy">
          <h2>Reuse is the business model, not a marketing layer.</h2>
          <p>
            Used clothing is not one uniform product. Condition, category, season and destination all matter. Our role is to turn mixed textile supply into identifiable wholesale assortments that can be used again in markets where there is real demand.
          </p>
          <p>
            We avoid invented environmental claims and unsupported impact numbers. The operational contribution is straightforward: extend the commercial life of usable goods through sorting, grading, preparation and redistribution.
          </p>
        </div>
      </section>

      <section className="sustainability-principles section-pad section-dark">
        <div className="section-heading-row">
          <div><p className="eyebrow light">Working principles</p><h2>Practical decisions that support textile reuse.</h2></div>
          <p className="section-note light-note">The strongest sustainability story is the work itself: inspect, separate, prepare and redistribute what can still be used.</p>
        </div>
        <div className="sustainability-principle-grid">
          {principles.map((principle) => (
            <article key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reuse-cycle section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">Reuse cycle</p><h2>From mixed supply to a second commercial life.</h2></div>
          <Link className="text-link" to="/process">See the full process <span>↗</span></Link>
        </div>
        <div className="reuse-cycle-list">
          {cycle.map(([title, body], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="sustainability-boundary section-pad">
        <div className="section-label">What we will not overclaim</div>
        <div className="editorial-copy">
          <h2>Credibility matters more than green language.</h2>
          <p>
            We do not publish recycling rates, carbon savings or waste-diversion totals unless they can be measured and supported. As the operation develops better measurement, verified performance can be added to this page through the website programme.
          </p>
        </div>
      </section>

      <section className="contact-band textile-contact-band sustainability-contact-band">
        <div><p className="eyebrow">Wholesale reuse</p><h2>Looking for reusable clothing or textile assortments for your market?</h2></div>
        <Link className="button light" to="/contact?type=product">Discuss your requirement</Link>
      </section>
    </div>
  );
}
