import { Link } from "react-router-dom";

const values = [
  ["01", "Clear commitments", "We keep expectations, timing and commercial responsibilities clear from the start."],
  ["02", "Commercial judgment", "We stay close to product availability, pricing, timing and the practical realities of each market."],
  ["03", "Long-term relationships", "We prefer repeat business and dependable supplier and customer relationships over one-off transactions."],
  ["04", "Market awareness", "Operating from Lebanon keeps us connected to regional trade while serving customers further afield."],
] as const;

export function AboutPage() {
  return (
    <div className="inner-page about-page">
      <section className="page-hero about-hero">
        <p className="eyebrow light">About SAMWATEX</p>
        <h1>A Lebanon-based commercial group working across international markets.</h1>
        <p className="page-hero-copy">SAMWATEX brings sourcing, trading and export coordination together under one parent company.</p>
      </section>

      <section className="editorial-grid section-pad">
        <div className="section-label">Who we are</div>
        <div className="editorial-copy">
          <h2>Close to the supply side. Close to the market.</h2>
          <p>SAMWATEX operates from Lebanon and works with suppliers, customers and distributors across Africa, the Middle East and selected international markets. The group focuses on practical commercial work: sourcing products, coordinating supply and supporting export relationships.</p>
          <p>HMD International Group operates under SAMWATEX as the market-facing trading company, with its own customer relationships and commercial focus.</p>
        </div>
      </section>

      <section className="about-pillars section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">How we work</p><h2>Simple principles applied consistently.</h2></div>
        </div>
        <div className="values-grid">
          {values.map(([number, title, body]) => (
            <article key={title}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="about-navigation section-pad">
        <Link to="/about/story" className="about-nav-card">
          <span>Our story</span><h3>How SAMWATEX and HMD International Group fit together.</h3><i>↗</i>
        </Link>
        <Link to="/about/vision" className="about-nav-card dark-card">
          <span>Vision & mission</span><h3>The commercial direction we are building toward.</h3><i>↗</i>
        </Link>
      </section>
    </div>
  );
}
