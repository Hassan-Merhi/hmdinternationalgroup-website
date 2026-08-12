import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function HomePage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-media" style={content.heroImageUrl ? { backgroundImage: `url(${content.heroImageUrl})` } : undefined}>
          <div className="hero-grid" aria-hidden="true" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-subtitle">{content.heroSubtitle}</p>
          <div className="hero-actions">
            <Link className="button primary" to="/businesses">Explore the group</Link>
            <Link className="button ghost" to="/contact">Contact us</Link>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">HMD / 01</div>
      </section>

      <section className="intro-section section-pad">
        <div className="section-label">Who we are</div>
        <div className="intro-copy">
          <h2>{content.aboutTitle}</h2>
          <p>{content.aboutBody}</p>
          <Link className="text-link" to="/about">Discover HMD <span>↗</span></Link>
        </div>
      </section>

      <section className="business-section section-pad">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Our businesses</p>
            <h2>{content.businessesTitle}</h2>
          </div>
          <p className="section-note">A connected operating platform designed to move goods, materials and information reliably.</p>
        </div>
        <div className="business-grid">
          {content.businesses.map((business) => (
            <article className="business-card" key={business.title}>
              <span>{business.eyebrow}</span>
              <h3>{business.title}</h3>
              <p>{business.description}</p>
              <div className="card-arrow" aria-hidden="true">↗</div>
            </article>
          ))}
        </div>
      </section>

      <section className="statement-section">
        <p className="eyebrow light">A long-term platform</p>
        <h2>Local execution.<br />International perspective.</h2>
      </section>

      <section className="locations-section section-pad">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Our footprint</p>
            <h2>{content.locationsTitle}</h2>
          </div>
        </div>
        <div className="location-list">
          {content.locations.map((location, index) => (
            <article className="location-row" key={location.city}>
              <span className="location-number">0{index + 1}</span>
              <div><h3>{location.city}</h3><p>{location.country}</p></div>
              <p>{location.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-band">
        <p className="eyebrow light">Start a conversation</p>
        <h2>Building something that needs a dependable operating partner?</h2>
        <Link className="button light" to="/contact">Contact HMD</Link>
      </section>
    </>
  );
}
