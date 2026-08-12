import { Link } from "react-router-dom";

const values = [
  ["01", "Reliability", "We value consistent execution, clear communication and commercial relationships built to last."],
  ["02", "Agility", "International trade changes quickly. We stay practical, responsive and ready to adapt to the market."],
  ["03", "Partnership", "We approach customers, suppliers and operating companies as long-term partners rather than transactions."],
  ["04", "Perspective", "A Lebanon base gives us a connected vantage point between regional and international markets."],
] as const;

export function AboutPage() {
  return (
    <div className="inner-page about-page">
      <section className="page-hero about-hero">
        <p className="eyebrow light">About SAMWATEX</p>
        <h1>A Lebanon-based group with an international trading outlook.</h1>
        <p className="page-hero-copy">SAMWATEX brings together commercial relationships, sourcing capability and export execution under one parent group.</p>
      </section>

      <section className="editorial-grid section-pad">
        <div className="section-label">Who we are</div>
        <div className="editorial-copy">
          <h2>Built around connections that create movement.</h2>
          <p>SAMWATEX is based in Lebanon and serves customers and partners across export markets in Africa, the Middle East and beyond. Our role is to connect opportunities with practical execution—from sourcing and trade coordination to long-term market relationships.</p>
          <p>The group structure allows operating companies such as HMD International Group to develop their own expertise while benefiting from a shared SAMWATEX direction and identity.</p>
        </div>
      </section>

      <section className="about-pillars section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">What guides us</p><h2>Clear principles. Long-term thinking.</h2></div>
        </div>
        <div className="values-grid">
          {values.map(([number, title, body]) => (
            <article key={title}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="about-navigation section-pad">
        <Link to="/about/story" className="about-nav-card">
          <span>Our story</span><h3>How SAMWATEX is structured and where we are building from.</h3><i>↗</i>
        </Link>
        <Link to="/about/vision" className="about-nav-card dark-card">
          <span>Vision & mission</span><h3>The direction behind our group and the way we approach growth.</h3><i>↗</i>
        </Link>
      </section>
    </div>
  );
}
