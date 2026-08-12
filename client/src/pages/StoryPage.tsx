import { Link } from "react-router-dom";

export function StoryPage() {
  return (
    <div className="inner-page narrative-page">
      <section className="page-hero story-hero">
        <p className="eyebrow light">Our story</p>
        <h1>A parent company in Lebanon with HMD at the operating level.</h1>
      </section>
      <section className="editorial-grid section-pad">
        <div className="section-label">The foundation</div>
        <div className="editorial-copy wide-copy">
          <h2>SAMWATEX starts in Lebanon and works outward.</h2>
          <p>The group is built around international trade, sourcing and export relationships. Lebanon is the operating base; Africa, the Middle East and selected international markets are where those commercial relationships extend.</p>
          <p>HMD International Group sits under SAMWATEX as the operating company responsible for market-facing trading activity, product supply and customer relationships.</p>
        </div>
      </section>
      <section className="structure-section section-pad section-dark">
        <p className="eyebrow light">Group structure</p>
        <div className="structure-diagram structure-diagram-focused">
          <div className="structure-parent"><span>Parent company</span><strong>SAMWATEX</strong><small>Lebanon</small></div>
          <div className="structure-line" aria-hidden="true" />
          <div className="structure-child"><span>Operating company</span><strong>HMD International Group</strong><small>Trading · sourcing · distribution</small></div>
        </div>
      </section>
      <section className="page-next section-pad">
        <p>Next</p><Link to="/about/vision">Vision & mission <span>↗</span></Link>
      </section>
    </div>
  );
}
