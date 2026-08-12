import { useEffect, useState } from "react";
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
    </div>
  );
}
