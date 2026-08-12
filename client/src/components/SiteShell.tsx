import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";
import { SeoManager } from "@client/components/SeoManager";

const navItems = [
  ["/about", "About"],
  ["/companies", "Companies"],
  ["/industries", "Industries"],
  ["/global-reach", "Global reach"],
  ["/gallery", "Gallery"],
  ["/contact", "Contact"],
] as const;

export function SiteShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const location = useLocation();

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 42);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-shell">
      <SeoManager content={content} />
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="brand" aria-label={`${content.brandName} home`}>
          <span className="brand-mark">{content.brandName}</span>
          <span className="brand-copy">{content.brandDescriptor}</span>
        </Link>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
          <Link className="mobile-nav-contact" to="/contact">Business enquiry ↗</Link>
        </nav>

        <div className="header-actions">
          <Link className="header-cta" to="/contact">Enquire</Link>
          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span />
          </button>
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="footer-brand-block">
          <div className="footer-mark">{content.brandName}</div>
          <p>Trade and export from Lebanon.</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/industries">Industries</Link>
          <Link to="/global-reach">Global reach</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/what-we-do">What we do</Link>
          <Link to="/contact">Contact</Link>
          <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
        </div>
        <div className="footer-meta">
          <p>Beirut · Lebanon</p>
          <p>© {new Date().getFullYear()} {content.brandName}</p>
        </div>
      </footer>
    </div>
  );
}
