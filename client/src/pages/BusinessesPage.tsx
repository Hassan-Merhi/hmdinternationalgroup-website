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
        <h1>Sourcing, trading and export coordination from Lebanon.</h1>
        <p className="page-hero-copy">We work from the commercial requirement backward: product, quantity, destination, timing and the supply needed to make it work.</p>
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
        <Link to="/companies" className="business-path-card"><span>Companies</span><h3>See how HMD International Group operates within SAMWATEX.</h3><i>↗</i></Link>
        <Link to="/industries" className="business-path-card dark-card"><span>Products & categories</span><h3>See the commercial categories we source and supply.</h3><i>↗</i></Link>
      </section>
    </div>
  );
}
