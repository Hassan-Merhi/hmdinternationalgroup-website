import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function HomePage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => { void getSiteContent().then(setContent); }, []);

  return (
    <>
      <section className="hero samwatex-hero">
        <div className={`hero-media ${content.heroImageUrl ? "has-image" : ""}`}>
          {content.heroImageUrl && <img className="hero-image" src={content.heroImageUrl} alt="" fetchPriority="high" decoding="async" />}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-subtitle">{content.heroSubtitle}</p>
          <div className="hero-actions">
            <Link className="button primary" to="/about">About SAMWATEX</Link>
            <Link className="button ghost" to="/contact">Business enquiry</Link>
          </div>
        </div>
        <div className="hero-side-note">
          <span>Operating base</span>
          <strong>Beirut, Lebanon</strong>
          <i />
          <span>Trade · sourcing · export</span>
        </div>
      </section>

      <section className="intro-section section-pad">
        <div className="section-label">SAMWATEX</div>
        <div className="intro-copy">
          <h2>{content.aboutTitle}</h2>
          <p>{content.aboutBody}</p>
          <Link className="text-link" to="/about">Read about the group <span>↗</span></Link>
        </div>
      </section>

      <section className="capability-section section-pad section-dark">
        <div className="section-heading-row">
          <div><p className="eyebrow light">What we do</p><h2>{content.capabilitiesTitle}</h2></div>
          <p className="section-note light-note">From a product requirement to supplier coordination and export supply, the work stays commercially focused.</p>
        </div>
        <div className="capability-grid">
          {content.capabilities.map((capability) => (
            <article className="capability-card" key={capability.title}>
              <span>{capability.eyebrow}</span>
              <div><h3>{capability.title}</h3><p>{capability.description}</p></div>
            </article>
          ))}
        </div>
        <Link className="text-link light-link" to="/what-we-do">See how we work <span>↗</span></Link>
      </section>

      <section className="companies-preview section-pad" id="companies">
        <div className="section-heading-row">
          <div><p className="eyebrow">Group companies</p><h2>{content.companiesTitle}</h2></div>
          <p className="section-note">SAMWATEX is the parent company. HMD International Group operates within the group with its own commercial role and market relationships.</p>
        </div>
        <div className="company-showcase">
          {content.companies.map((company, index) => (
            <article className="company-panel" key={company.name}>
              <div className="company-sequence">0{index + 1}</div>
              <div><p className="eyebrow">{company.relationship}</p><h3>{company.name}</h3><p>{company.description}</p></div>
              <Link className="company-coming company-profile-link" to={`/companies/${company.slug}`}>Company profile ↗</Link>
            </article>
          ))}
        </div>
        <Link className="text-link companies-all-link" to="/companies">Group structure <span>↗</span></Link>
      </section>

      <section className="homepage-industries section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">Commercial categories</p><h2>{content.industriesTitle}</h2></div>
          <Link className="text-link" to="/industries">View categories <span>↗</span></Link>
        </div>
        <div className="homepage-industry-grid">
          {content.industries.slice(0, 4).map((industry) => (
            <Link to={`/industries#${industry.slug}`} key={industry.slug}>
              <span>{industry.eyebrow}</span><h3>{industry.title}</h3><p>{industry.description}</p><i>↗</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="statement-section">
        <h2>Lebanon is the base.<br />The market is wider.</h2>
        <p>Our team operates from Lebanon while building supplier and customer relationships across the markets we serve.</p>
      </section>

      <section className="markets-section section-pad">
        <div className="section-heading-row">
          <div><p className="eyebrow">Markets</p><h2>{content.marketsTitle}</h2></div>
          <div className="section-heading-actions">
            <p className="section-note">We do not present overseas offices we do not have. These are export markets and commercial relationships served from Lebanon.</p>
            <Link className="text-link" to="/global-reach">Market reach <span>↗</span></Link>
          </div>
        </div>
        <div className="market-grid">
          {content.markets.map((market, index) => (
            <article className="market-card" key={market.region}><span>0{index + 1}</span><h3>{market.region}</h3><p>{market.description}</p></article>
          ))}
        </div>
      </section>

      <section className="home-stats section-pad">
        <div className="home-stats-heading"><h2>{content.statsTitle}</h2></div>
        <div className="home-stats-grid">
          {content.stats.map((stat, index) => (
            <article key={`${stat.label}-${index}`}><span>0{index + 1}</span><strong>{stat.value}</strong><p>{stat.label}</p></article>
          ))}
        </div>
      </section>

      <section className="home-gallery-preview section-pad section-dark">
        <div className="section-heading-row">
          <div><p className="eyebrow light">Selected view</p><h2>{content.galleryTitle}</h2></div>
          <Link className="text-link light-link" to="/gallery">Open gallery <span>↗</span></Link>
        </div>
        <div className="home-gallery-grid">
          {content.galleryItems.slice(0, 3).map((item, index) => (
            <Link className={`home-gallery-card home-gallery-card-${index + 1}`} to="/gallery" key={item.id}>
              <div className="home-gallery-visual">
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />}
                <span>{item.category}</span>
              </div>
              <p>{item.company}</p><h3>{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="contact-band">
        <div><p className="eyebrow light">Business enquiries</p><h2>Tell us what you need, where it is going and when.</h2></div>
        <div className="contact-band-actions">
          <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
          <Link className="button light" to="/contact">Contact SAMWATEX</Link>
        </div>
      </section>
    </>
  );
}
