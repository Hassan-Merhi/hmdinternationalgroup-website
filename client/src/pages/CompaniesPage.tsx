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
        <h1>Focused companies. One SAMWATEX direction.</h1>
        <p className="page-hero-copy">
          SAMWATEX is structured as a parent group, giving each operating company room to build expertise while sharing a long-term commercial direction.
        </p>
      </section>

      <section className="portfolio-intro section-pad">
        <div className="section-label">The portfolio</div>
        <div className="editorial-copy">
          <h2>Built to grow without losing focus.</h2>
          <p>
            Our group model is intentionally clear: SAMWATEX provides the parent identity and strategic platform, while each company develops its own market role, customer relationships and operating strengths.
          </p>
        </div>
      </section>

      <section className="company-directory section-pad section-warm">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Operating companies</p>
            <h2>{content.companiesTitle}</h2>
          </div>
          <p className="section-note">The portfolio starts with HMD International Group and is structured to accommodate future SAMWATEX companies as the group develops.</p>
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
              <div className="company-directory-link">View company <span>↗</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="portfolio-future section-pad section-dark">
        <p className="eyebrow light">A platform for growth</p>
        <h2>One identity above the group. Clear identities within it.</h2>
        <p>New operating companies can be added to the SAMWATEX portfolio without changing the public architecture or weakening the identity of existing companies.</p>
      </section>
    </div>
  );
}
