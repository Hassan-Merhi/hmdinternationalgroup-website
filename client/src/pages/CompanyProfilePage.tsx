import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

const operatingFlow = [
  ["Buyer brief", "Destination, category, season, preferred condition or grade and expected volume."],
  ["Assortment", "Available sorted product is matched to the buyer's commercial requirement."],
  ["Order preparation", "Confirmed categories are organized for baling, identification and staging."],
  ["Export execution", "Commercial coordination stays connected to loading and shipment preparation from Lebanon."],
] as const;

const buyerNeeds = [
  "Men's, women's and children's used clothing",
  "Shoes, bags, accessories and household textiles",
  "Summer, winter and category-specific assortments",
  "Market-specific mixed bales where supply allows",
] as const;

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

  if (loaded && !company) return <Navigate to="/" replace />;
  if (!company) return null;

  return (
    <div className="inner-page company-profile-page hmd-profile-page">
      <section className="company-profile-hero hmd-profile-hero">
        <div className="company-profile-watermark" aria-hidden="true">{company.shortName}</div>
        <div className="company-profile-hero-copy">
          <Link className="profile-back" to="/">← SAMWATEX</Link>
          <p className="eyebrow light">{company.relationship}</p>
          <h1>{company.name}</h1>
          <p>{company.tagline}</p>
        </div>
        <div className="company-profile-badge">SAMWATEX · OPERATING COMPANY</div>
      </section>

      <section className="company-overview section-pad">
        <div className="section-label">Company role</div>
        <div className="editorial-copy">
          <h2>The commercial link between prepared product and the wholesale buyer.</h2>
          <p>{company.overview}</p>
          <p>
            SAMWATEX is the parent company and operating framework. HMD International Group is the market-facing company responsible for buyer relationships, commercial discussions, wholesale assortment and export execution connected to the group's textile activity.
          </p>
        </div>
      </section>

      <section className="hmd-role-band section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">How HMD works</p><h2>Commercial work that stays connected to the sorting floor.</h2></div>
          <p className="section-note">The buyer brief matters before the bale is built. HMD keeps destination-market requirements connected to product preparation instead of treating sales and operations as separate conversations.</p>
        </div>
        <div className="hmd-flow-grid">
          {operatingFlow.map(([title, body], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="company-focus section-pad section-dark">
        <div className="section-heading-row">
          <div><p className="eyebrow light">Core responsibilities</p><h2>What HMD handles.</h2></div>
          <p className="section-note light-note">HMD is not positioned as a separate unrelated group. It operates under SAMWATEX and focuses on the commercial side of the same textile-reuse and export operation.</p>
        </div>
        <div className="focus-list">
          {company.focusAreas.map((focus, index) => (
            <article key={focus}><span>{String(index + 1).padStart(2, "0")}</span><h3>{focus}</h3></article>
          ))}
        </div>
      </section>

      <section className="hmd-buyer-section section-pad">
        <div className="section-heading-row">
          <div><p className="eyebrow">Wholesale supply</p><h2>Built for buyers who know their market.</h2></div>
          <Link className="text-link" to="/products">Explore products <span>↗</span></Link>
        </div>
        <div className="hmd-buyer-grid">
          <div className="hmd-buyer-copy">
            <p>Orders can be discussed around destination, season, category, preferred condition or grade and expected volume. Availability changes with incoming supply, so the commercial conversation starts with what the buyer actually needs.</p>
            <Link className="button dark" to="/contact?type=hmd">Send an HMD enquiry</Link>
          </div>
          <ul>{buyerNeeds.map((need) => <li key={need}>{need}</li>)}</ul>
        </div>
      </section>

      <section className="company-industries section-pad section-warm">
        <div className="section-heading-row">
          <div><p className="eyebrow">Product categories</p><h2>Wholesale categories connected to HMD.</h2></div>
          <Link className="text-link" to="/products">View full catalogue <span>↗</span></Link>
        </div>
        <div className="industry-preview-grid hmd-category-grid">
          {relatedIndustries.map((industry) => (
            <article key={industry.slug}>
              <span>{industry.eyebrow}</span>
              <h3>{industry.title}</h3>
              <p>{industry.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="company-markets section-pad">
        <div className="section-label">Markets served</div>
        <div className="company-market-copy">
          <h2>Based in Lebanon. Supplying export markets through SAMWATEX.</h2>
          <div className="company-market-tags">
            {company.markets.map((market) => <span key={market}>{market}</span>)}
          </div>
          <Link className="text-link" to="/export-markets">Export & logistics <span>↗</span></Link>
        </div>
      </section>

      <section className="contact-band company-contact-band textile-contact-band">
        <div>
          <p className="eyebrow">HMD enquiries</p>
          <h2>Send the destination, categories and volume you are looking for.</h2>
        </div>
        <div className="contact-band-actions">
          <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
          <Link className="button light" to="/contact?type=hmd">Contact HMD through SAMWATEX</Link>
        </div>
      </section>
    </div>
  );
}
