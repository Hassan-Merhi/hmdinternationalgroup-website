import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function CompanyProfilePage() {
  const { slug = "" } = useParams();
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void getSiteContent().then((site) => {
      setContent(site);
      setLoaded(true);
    });
  }, []);

  const company = useMemo(() => content.companies.find((item) => item.slug === slug), [content.companies, slug]);
  const relatedIndustries = useMemo(
    () => content.industries.filter((industry) => industry.companySlugs.includes(slug)),
    [content.industries, slug],
  );

  if (loaded && !company) return <Navigate to="/companies" replace />;
  if (!company) return null;

  return (
    <div className="inner-page company-profile-page">
      <section className="company-profile-hero">
        <div className="company-profile-watermark" aria-hidden="true">{company.shortName}</div>
        <div className="company-profile-hero-copy">
          <Link className="profile-back" to="/companies">← Our companies</Link>
          <p className="eyebrow light">{company.relationship}</p>
          <h1>{company.name}</h1>
          <p>{company.tagline}</p>
        </div>
        <div className="company-profile-badge">SAMWATEX · HMD</div>
      </section>

      <section className="company-overview section-pad">
        <div className="section-label">Company overview</div>
        <div className="editorial-copy">
          <h2>The market-facing trading company within SAMWATEX.</h2>
          <p>{company.overview}</p>
          <p>HMD operates under SAMWATEX while keeping a distinct commercial identity for customers, suppliers and distribution partners.</p>
        </div>
      </section>

      <section className="company-focus section-pad section-dark">
        <div className="section-heading-row">
          <div><p className="eyebrow light">Core focus</p><h2>What HMD handles.</h2></div>
          <p className="section-note light-note">The focus is practical: source the right product, coordinate supply and support the customer through the commercial process.</p>
        </div>
        <div className="focus-list">
          {company.focusAreas.map((focus, index) => (
            <article key={focus}><span>0{index + 1}</span><h3>{focus}</h3></article>
          ))}
        </div>
      </section>

      <section className="company-industries section-pad">
        <div className="section-heading-row">
          <div><p className="eyebrow">Commercial areas</p><h2>Products and activities connected to HMD.</h2></div>
          <Link className="text-link" to="/industries">Explore all industries <span>↗</span></Link>
        </div>
        <div className="industry-preview-grid">
          {relatedIndustries.map((industry) => (
            <article key={industry.slug}>
              <span>{industry.eyebrow}</span>
              <h3>{industry.title}</h3>
              <p>{industry.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="company-markets section-pad section-warm">
        <div className="section-label">Markets served</div>
        <div className="company-market-copy">
          <h2>Based in Lebanon. Working into export markets.</h2>
          <div className="company-market-tags">
            {company.markets.map((market) => <span key={market}>{market}</span>)}
          </div>
        </div>
      </section>

      <section className="contact-band company-contact-band">
        <div>
          <p className="eyebrow light">HMD enquiries</p>
          <h2>Send us the product, quantity and destination you are working with.</h2>
        </div>
        <div className="contact-band-actions">
          <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
          <Link className="button light" to="/contact?type=hmd">Contact HMD through SAMWATEX</Link>
        </div>
      </section>
    </div>
  );
}
