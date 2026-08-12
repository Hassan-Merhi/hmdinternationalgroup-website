import { Link } from "react-router-dom";

export function StoryPage() {
  return (
    <div className="inner-page narrative-page">
      <section className="page-hero story-hero">
        <p className="eyebrow light">Our story</p>
        <h1>One parent group, built to support distinct operating companies.</h1>
      </section>
      <section className="editorial-grid section-pad">
        <div className="section-label">The foundation</div>
        <div className="editorial-copy wide-copy">
          <h2>SAMWATEX starts in Lebanon and looks outward.</h2>
          <p>The group is being shaped around international trade, export relationships and practical commercial execution. Lebanon is SAMWATEX’s base, while Africa, the Middle East and other international markets form part of the group’s commercial reach.</p>
          <p>Rather than presenting every activity under one name, SAMWATEX provides a parent-company structure for operating businesses. HMD International Group is the first company represented within that structure, with its detailed profile, products and activities forming a distinct part of the wider group.</p>
        </div>
      </section>
      <section className="structure-section section-pad section-dark">
        <p className="eyebrow light">Group structure</p>
        <div className="structure-diagram">
          <div className="structure-parent"><span>Parent company</span><strong>SAMWATEX</strong><small>Lebanon</small></div>
          <div className="structure-line" aria-hidden="true" />
          <div className="structure-child"><span>Operating company</span><strong>HMD International Group</strong><small>A SAMWATEX Company</small></div>
          <div className="structure-future"><span>Future companies</span><strong>Built to expand</strong><small>Added as the group evolves</small></div>
        </div>
      </section>
      <section className="page-next section-pad">
        <p>Next</p><Link to="/about/vision">Vision & mission <span>↗</span></Link>
      </section>
    </div>
  );
}
