import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function CompaniesPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  return (
    <div className="inner-page companies-page">
      <section className="page-hero companies-hero">
        <p className="eyebrow light">Our companies</p>
        <h1>SAMWATEX is the parent company. HMD is the operating business.</h1>
        <p className="page-hero-copy">
          The group structure keeps ownership and direction clear while HMD International Group stays close to customers, suppliers and day-to-day trading activity.
        </p>
      </section>

      <section className="portfolio-intro section-pad">
        <div className="section-label">Group structure</div>
        <div className="editorial-copy">
          <h2>One parent company. A clear operating role.</h2>
          <p>
            SAMWATEX provides the group identity and long-term direction. HMD International Group operates within it as the commercial company focused on sourcing, trading, distribution and market supply.
          </p>
        </div>
      </section>

      <section className="company-directory section-pad section-warm">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Operating company</p>
            <h2>{content.companiesTitle}</h2>
          </div>
          <p className="section-note">HMD International Group is currently the operating company represented under SAMWATEX.</p>
        </div>

        <div className="company-directory-grid">
          {content.companies.map((company, index) => (
            <Link className="company-directory-card" to={`/companies/${company.slug}`} key={company.slug}>
              <div className="company-directory-number">0{index + 1}</div>
              <div className="company-monogram" aria-hidden="true">{company.shortName}</div>
              <div className="company-directory-copy">
                <p className="eyebrow">{company.relationship}</p>
                <h3>{company.name}</h3>
                <p>{company.description}</p>
              </div>
              <div className="company-directory-link">Company profile <span>↗</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="portfolio-future section-pad section-dark">
        <p className="eyebrow light">The relationship</p>
        <h2>SAMWATEX sets the direction. HMD carries the commercial work into the market.</h2>
        <p>The names are distinct by design: one identifies the group, the other the operating company customers and partners work with.</p>
      </section>
    </div>
  );
}
