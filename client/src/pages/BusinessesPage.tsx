import { defaultSiteContent } from "@shared/siteContent";

export function BusinessesPage() {
  return (
    <div className="inner-page">
      <section className="page-hero alternate">
        <p className="eyebrow light">Businesses</p>
        <h1>Connected operations, built to scale.</h1>
      </section>
      <section className="business-detail-list section-pad">
        {defaultSiteContent.businesses.map((business) => (
          <article key={business.title}>
            <span>{business.eyebrow}</span>
            <div><h2>{business.title}</h2><p>{business.description}</p></div>
          </article>
        ))}
      </section>
    </div>
  );
}
