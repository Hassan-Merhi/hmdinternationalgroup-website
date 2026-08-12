import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="inner-page not-found-page">
      <section className="page-hero compact not-found-hero">
        <p className="eyebrow light">404 / Page not found</p>
        <h1>This route doesn’t exist.</h1>
        <p className="page-hero-copy">The page may have moved, or the address may be incomplete. Continue from the SAMWATEX homepage or contact our team.</p>
        <div className="hero-actions">
          <Link className="button primary" to="/">Back to homepage</Link>
          <Link className="button ghost" to="/contact">Contact SAMWATEX</Link>
        </div>
      </section>
    </div>
  );
}
