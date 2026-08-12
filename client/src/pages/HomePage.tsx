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
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true"><span /></div>
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light">{content.heroEyebrow}</p><h1>{content.heroTitle}</h1><p className="hero-subtitle">{content.heroSubtitle}</p>
          <div className="hero-actions"><Link className="button primary" to="/about">Discover SAMWATEX</Link><Link className="button ghost" to="/contact">Start an enquiry</Link></div>
        </div>
        <div className="hero-side-note" aria-hidden="true"><span>Based in</span><strong>Lebanon</strong><i /><span>Exporting internationally</span></div>
        <div className="hero-index" aria-hidden="true">SWX / 01</div>
      </section>

      <section className="intro-section section-pad"><div className="section-label">Who we are</div><div className="intro-copy"><h2>{content.aboutTitle}</h2><p>{content.aboutBody}</p><Link className="text-link" to="/about">Our story <span>↗</span></Link></div></section>
      <section className="capability-section section-pad section-dark"><div className="section-heading-row"><div><p className="eyebrow light">What we do</p><h2>{content.capabilitiesTitle}</h2></div><p className="section-note light-note">A commercial platform built in Lebanon and shaped for international markets.</p></div><div className="capability-grid">{content.capabilities.map((capability) => <article className="capability-card" key={capability.title}><span>{capability.eyebrow}</span><div><h3>{capability.title}</h3><p>{capability.description}</p></div></article>)}</div><Link className="text-link light-link" to="/what-we-do">Explore our capabilities <span>↗</span></Link></section>
      <section className="companies-preview section-pad" id="companies"><div className="section-heading-row"><div><p className="eyebrow">Our companies</p><h2>{content.companiesTitle}</h2></div><p className="section-note">SAMWATEX is the parent group. Each operating company has its own role, expertise and identity within the portfolio.</p></div><div className="company-showcase">{content.companies.map((company, index) => <article className="company-panel" key={company.name}><div className="company-sequence">0{index + 1}</div><div><p className="eyebrow">{company.relationship}</p><h3>{company.name}</h3><p>{company.description}</p></div><Link className="company-coming company-profile-link" to={`/companies/${company.slug}`}>View profile ↗</Link></article>)}</div><Link className="text-link companies-all-link" to="/companies">View all companies <span>↗</span></Link></section>
      <section className="homepage-industries section-pad section-warm"><div className="section-heading-row"><div><p className="eyebrow">Industries & products</p><h2>{content.industriesTitle}</h2></div><Link className="text-link" to="/industries">Explore industries <span>↗</span></Link></div><div className="homepage-industry-grid">{content.industries.slice(0, 4).map((industry) => <Link to={`/industries#${industry.slug}`} key={industry.slug}><span>{industry.eyebrow}</span><h3>{industry.title}</h3><p>{industry.description}</p><i>↗</i></Link>)}</div></section>
      <section className="statement-section"><p className="eyebrow light">Our perspective</p><h2>Rooted in Lebanon.<br />Built to reach further.</h2><p>Our location is our base—not the limit of our market.</p></section>
      <section className="markets-section section-pad"><div className="section-heading-row"><div><p className="eyebrow">Global reach</p><h2>{content.marketsTitle}</h2></div><div className="section-heading-actions"><p className="section-note">Our presence is in Lebanon. Our export relationships extend into the markets we serve.</p><Link className="text-link" to="/global-reach">Explore our reach <span>↗</span></Link></div></div><div className="market-grid">{content.markets.map((market, index) => <article className="market-card" key={market.region}><span>0{index + 1}</span><h3>{market.region}</h3><p>{market.description}</p></article>)}</div></section>
      <section className="home-stats section-pad"><div className="home-stats-heading"><p className="eyebrow light">SAMWATEX at a glance</p><h2>{content.statsTitle}</h2></div><div className="home-stats-grid">{content.stats.map((stat, index) => <article key={`${stat.label}-${index}`}><span>0{index + 1}</span><strong>{stat.value}</strong><p>{stat.label}</p></article>)}</div></section>
      <section className="home-gallery-preview section-pad section-dark"><div className="section-heading-row"><div><p className="eyebrow light">Gallery</p><h2>{content.galleryTitle}</h2></div><Link className="text-link light-link" to="/gallery">View gallery <span>↗</span></Link></div><div className="home-gallery-grid">{content.galleryItems.slice(0, 3).map((item, index) => <Link className={`home-gallery-card home-gallery-card-${index + 1}`} to="/gallery" key={item.id}><div className="home-gallery-visual">{item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />}<span>SWX / 0{index + 1}</span></div><p>{item.category}</p><h3>{item.title}</h3></Link>)}</div></section>
      <section className="contact-band"><div><p className="eyebrow light">Start a conversation</p><h2>Looking for a dependable trade or export partner?</h2></div><div className="contact-band-actions"><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a><Link className="button light" to="/contact">Contact SAMWATEX</Link></div></section>
    </>
  );
}
