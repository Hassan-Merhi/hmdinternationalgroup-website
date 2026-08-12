import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function BusinessesPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  useEffect(() => { void getSiteContent().then(setContent); }, []);

  return (
    <div className="inner-page">
      <section className="page-hero alternate">
        <p className="eyebrow light">What we do</p>
        <h1>Trade capability shaped around real market movement.</h1>
        <p className="page-hero-copy">SAMWATEX operates from Lebanon with an outward-facing commercial model focused on sourcing, export and enduring distribution relationships.</p>
      </section>
      <section className="business-detail-list section-pad">
        {content.capabilities.map((capability) => (
          <article key={capability.title}>
            <span>{capability.eyebrow}</span>
            <div><h2>{capability.title}</h2><p>{capability.description}</p></div>
          </article>
        ))}
      </section>
      <section className="business-paths section-pad section-warm">
        <Link to="/companies" className="business-path-card"><span>Companies</span><h3>Meet the operating companies behind the group.</h3><i>↗</i></Link>
        <Link to="/industries" className="business-path-card dark-card"><span>Industries & products</span><h3>Explore the commercial categories SAMWATEX is building around.</h3><i>↗</i></Link>
      </section>
    </div>
  );
}
