import { Link } from "react-router-dom";

const principles = [
  ["01", "Product before slogans", "We describe the goods by category, condition and market use instead of hiding behind generic sustainability language."],
  ["02", "Market-led preparation", "Sorting and grading decisions are made with the destination and wholesale buyer requirement in mind."],
  ["03", "Clear commercial expectations", "Category, season, grade, quantity and destination should be discussed before an order is prepared."],
  ["04", "Long-term relationships", "The aim is repeatable supply and dependable buyer relationships, not one-off transactions that create confusion."],
] as const;

export function AboutPage() {
  return (
    <div className="inner-page about-page textile-about-page">
      <section className="page-hero about-hero textile-about-hero">
        <p className="eyebrow light">About SAMWATEX</p>
        <h1>A Lebanon-based used-clothing and textile export group.</h1>
        <p className="page-hero-copy">SAMWATEX brings sorting, grading, baling, wholesale trade and export coordination together around reusable clothing and textile goods.</p>
      </section>

      <section className="editorial-grid section-pad">
        <div className="section-label">Who we are</div>
        <div className="editorial-copy">
          <h2>We prepare reusable goods for their next market.</h2>
          <p>SAMWATEX operates from Lebanon and focuses on the practical work between mixed incoming textile supply and a finished wholesale shipment. Clothing, footwear, accessories and household textile goods are separated into clearer categories, assessed for condition and prepared for buyers across Africa, the Middle East and selected markets.</p>
          <p>HMD International Group operates under SAMWATEX as the market-facing commercial company, connecting product preparation with wholesale customers and export execution.</p>
        </div>
      </section>

      <section className="about-pillars section-pad section-warm textile-about-pillars">
        <div className="section-heading-row">
          <div><p className="eyebrow">How we think</p><h2>Useful product comes from clear decisions.</h2></div>
          <p className="section-note">The business is physical and commercial at the same time: what is sorted, how it is graded and where it is sold all affect one another.</p>
        </div>
        <div className="values-grid">
          {principles.map(([number, title, body]) => (
            <article key={title}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="about-navigation section-pad textile-about-navigation">
        <Link to="/process" className="about-nav-card">
          <span>Our process</span><h3>Follow the work from incoming goods through sorting, grading, baling and export.</h3><i>↗</i>
        </Link>
        <Link to="/products" className="about-nav-card dark-card">
          <span>Product catalogue</span><h3>Explore the wholesale clothing, footwear, accessories and textile categories.</h3><i>↗</i>
        </Link>
      </section>
    </div>
  );
}
