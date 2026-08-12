import { Link } from "react-router-dom";

const stages = [
  {
    number: "01",
    title: "Receive & prepare",
    short: "Incoming textile supply enters a controlled workflow.",
    detail: "Used clothing, footwear and reusable textile goods are received and prepared for sorting. Packaging is opened, material is staged and the next decisions are made from the actual goods in front of the team.",
    output: "Prepared incoming supply",
  },
  {
    number: "02",
    title: "Sort by category",
    short: "Garments are separated into useful product families.",
    detail: "Items are separated by garment type, wearer, season and practical resale category. Men's, women's, children's, footwear, accessories and household textile lines are kept distinct where the goods and buyer requirement call for it.",
    output: "Clear product categories",
  },
  {
    number: "03",
    title: "Grade & inspect",
    short: "Condition and quality determine where an item belongs.",
    detail: "The sorting team evaluates usability, visible condition and overall quality so different levels of product are not treated as one undifferentiated mix. Quality control supports more consistent wholesale expectations.",
    output: "Condition-led grades",
  },
  {
    number: "04",
    title: "Build the market mix",
    short: "The destination changes the assortment.",
    detail: "Categories are assembled around buyer requirements, season and destination-market demand. The goal is not to force one standard mix everywhere, but to prepare goods that make commercial sense for the customer receiving them.",
    output: "Buyer-ready assortments",
  },
  {
    number: "05",
    title: "Bale & identify",
    short: "Finished assortments are prepared for handling and shipment.",
    detail: "Approved product is compressed into export-ready bales, identified by the agreed category or mix and organized for warehouse handling. Clear preparation helps reduce confusion between sorting and final loading.",
    output: "Export-ready bales",
  },
  {
    number: "06",
    title: "Load & export",
    short: "Commercial preparation becomes physical movement.",
    detail: "Orders are staged for container loading and export coordination from Lebanon. HMD International Group supports the market-facing commercial relationship while SAMWATEX connects the wider operating process.",
    output: "Wholesale shipment",
  },
] as const;

const controls = [
  ["Category", "What type of product is being prepared?"],
  ["Condition", "What quality level belongs in the assortment?"],
  ["Season", "Is the destination buying summer, winter or mixed goods?"],
  ["Destination", "Which market is the finished bale intended for?"],
  ["Volume", "What quantity makes the order commercially workable?"],
] as const;

export function ProcessPage() {
  return (
    <div className="inner-page textile-process-page">
      <section className="page-hero textile-process-hero">
        <p className="eyebrow light">Our process</p>
        <h1>From incoming used clothing to an export-ready bale.</h1>
        <p className="page-hero-copy">Sorting is not a single step. It is a sequence of decisions that turns mixed textile supply into categories, grades and assortments a wholesale buyer can understand.</p>
      </section>

      <section className="industry-intro section-pad textile-process-intro">
        <div className="section-label">Why the process matters</div>
        <div className="editorial-copy">
          <h2>Preparation is what makes the product commercially useful.</h2>
          <p>A bale becomes more useful when its category, condition and destination logic are clear. Our process keeps the physical work of sorting connected to the buyer requirement that the finished goods are meant to serve.</p>
        </div>
      </section>

      <section className="textile-process-timeline section-pad section-dark">
        <div className="process-timeline-list">
          {stages.map((stage) => (
            <article className="process-stage" key={stage.number}>
              <div className="process-stage-number">{stage.number}</div>
              <div className="process-stage-heading">
                <p>{stage.short}</p>
                <h2>{stage.title}</h2>
              </div>
              <div className="process-stage-detail">
                <p>{stage.detail}</p>
                <span>Output · {stage.output}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="textile-process-controls section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">Five questions</p><h2>The buyer brief shapes the finished assortment.</h2></div>
          <p className="section-note">Product preparation works best when the commercial requirement is clear before the goods are packed.</p>
        </div>
        <div className="process-control-grid">
          {controls.map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="textile-process-close section-pad">
        <div>
          <p className="eyebrow">Ready to discuss an order?</p>
          <h2>Start with the product and destination.</h2>
          <p>Tell us the category, market, approximate quantity and any grade or seasonal preference. We can then discuss what is practical against available supply.</p>
        </div>
        <div className="textile-process-close-actions">
          <Link className="button dark" to="/contact">Send a wholesale enquiry</Link>
          <Link className="text-link" to="/products">Browse products <span>↗</span></Link>
        </div>
      </section>
    </div>
  );
}
