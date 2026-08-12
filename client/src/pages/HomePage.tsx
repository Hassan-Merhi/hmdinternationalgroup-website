import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

const processPreview = [
  ["01", "Receive", "Incoming reusable clothing and textile goods are prepared for controlled sorting."],
  ["02", "Sort", "Items are separated by category, season and garment type."],
  ["03", "Grade", "Condition and quality are assessed against wholesale requirements."],
  ["04", "Build", "Assortments are assembled around destination-market demand."],
  ["05", "Bale", "Finished goods are compressed, identified and prepared for movement."],
  ["06", "Export", "Orders are coordinated for container loading and international shipment."],
] as const;

export function HomePage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => { void getSiteContent().then(setContent); }, []);

  return (
    <>
      <section className="hero samwatex-hero textile-hero">
        <div className={`hero-media textile-hero-media ${content.heroImageUrl ? "has-image" : ""}`}>
          {content.heroImageUrl && <img className="hero-image" src={content.heroImageUrl} alt="" fetchPriority="high" decoding="async" />}
          <div className="textile-hero-grid" aria-hidden="true" />
        </div>
        <div className="hero-overlay textile-hero-overlay" />
        <div className="hero-content textile-hero-content">
          <p className="eyebrow light">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-subtitle">{content.heroSubtitle}</p>
          <div className="hero-actions">
            <Link className="button primary" to="/products">Explore products</Link>
            <Link className="button ghost" to="/contact">Wholesale enquiry</Link>
          </div>
        </div>
        <div className="hero-side-note textile-side-note">
          <span>Operating base</span>
          <strong>Lebanon</strong>
          <i />
          <span>Sort · grade · bale · export</span>
        </div>
      </section>

      <section className="intro-section section-pad textile-intro">
        <div className="section-label">What SAMWATEX does</div>
        <div className="intro-copy">
          <h2>{content.aboutTitle}</h2>
          <p>{content.aboutBody}</p>
          <div className="textile-inline-links">
            <Link className="text-link" to="/what-we-do">How we work <span>↗</span></Link>
            <Link className="text-link" to="/about">About SAMWATEX <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="capability-section section-pad section-dark textile-capabilities">
        <div className="section-heading-row">
          <div><p className="eyebrow light">From intake to shipment</p><h2>{content.capabilitiesTitle}</h2></div>
          <p className="section-note light-note">The commercial value is created in the decisions between the incoming mix and the finished bale: what is separated, how it is graded and which market it is prepared for.</p>
        </div>
        <div className="capability-grid textile-capability-grid">
          {content.capabilities.map((capability) => (
            <article className="capability-card" key={capability.title}>
              <span>{capability.eyebrow}</span>
              <div><h3>{capability.title}</h3><p>{capability.description}</p></div>
            </article>
          ))}
        </div>
        <Link className="text-link light-link" to="/process">See the full process <span>↗</span></Link>
      </section>

      <section className="textile-products-home section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">Wholesale categories</p><h2>{content.industriesTitle}</h2></div>
          <div className="section-heading-actions">
            <p className="section-note">Categories and exact mixes depend on available supply, grade, season, destination and buyer specification.</p>
            <Link className="text-link" to="/products">View product catalogue <span>↗</span></Link>
          </div>
        </div>
        <div className="textile-category-grid">
          {content.industries.slice(0, 6).map((industry) => (
            <Link className="textile-category-card" to={`/products#${industry.slug}`} key={industry.slug}>
              <span>{industry.eyebrow}</span>
              <div>
                <h3>{industry.title}</h3>
                <p>{industry.description}</p>
              </div>
              <i>↗</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="textile-process-home section-pad">
        <div className="section-heading-row">
          <div><p className="eyebrow">The process</p><h2>Every bale starts with a sorting decision.</h2></div>
          <p className="section-note">A clear process makes the finished product easier to understand, repeat and specify with a wholesale buyer.</p>
        </div>
        <div className="process-preview-grid">
          {processPreview.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <Link className="text-link process-home-link" to="/process">Walk through the process <span>↗</span></Link>
      </section>

      <section className="textile-hmd-band section-pad section-dark">
        <div className="textile-hmd-layout">
          <div>
            <p className="eyebrow light">A SAMWATEX company</p>
            <h2>HMD International Group</h2>
          </div>
          <div>
            <p>HMD is the market-facing operating company within SAMWATEX, connecting product preparation with wholesale buyers, commercial relationships and export execution.</p>
            <Link className="text-link light-link" to="/companies/hmd-international-group">View HMD profile <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="statement-section textile-statement">
        <p className="eyebrow light">Market preparation</p>
        <h2>Not every market needs the same mix.</h2>
        <p>We prepare categories and assortments around buyer requirements, season, condition and destination rather than treating used clothing as one undifferentiated product.</p>
      </section>

      <section className="markets-section section-pad textile-markets">
        <div className="section-heading-row">
          <div><p className="eyebrow">Export markets</p><h2>{content.marketsTitle}</h2></div>
          <div className="section-heading-actions">
            <p className="section-note">SAMWATEX is based in Lebanon. These are markets served through wholesale export relationships, not overseas offices.</p>
            <Link className="text-link" to="/export-markets">Export reach <span>↗</span></Link>
          </div>
        </div>
        <div className="market-grid">
          {content.markets.map((market, index) => (
            <article className="market-card" key={market.region}><span>0{index + 1}</span><h3>{market.region}</h3><p>{market.description}</p></article>
          ))}
        </div>
      </section>

      <section className="home-stats section-pad textile-stats">
        <div className="home-stats-heading"><p className="eyebrow">Operating chain</p><h2>{content.statsTitle}</h2></div>
        <div className="home-stats-grid">
          {content.stats.map((stat, index) => (
            <article key={`${stat.label}-${index}`}><span>0{index + 1}</span><strong>{stat.value}</strong><p>{stat.label}</p></article>
          ))}
        </div>
      </section>

      <section className="home-gallery-preview section-pad section-dark textile-gallery-preview">
        <div className="section-heading-row">
          <div><p className="eyebrow light">Operations</p><h2>{content.galleryTitle}</h2></div>
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

      <section className="contact-band textile-contact-band">
        <div><p className="eyebrow">Wholesale enquiries</p><h2>Tell us the category, destination and volume you are looking for.</h2></div>
        <div className="contact-band-actions">
          <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
          <Link className="button light" to="/contact">Contact SAMWATEX</Link>
        </div>
      </section>
    </>
  );
}
