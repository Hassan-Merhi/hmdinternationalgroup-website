import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

const navItems = [
  ["/about", "About"],
  ["/companies", "Companies"],
  ["/industries", "Industries"],
  ["/global-reach", "Global reach"],
  ["/gallery", "Gallery"],
  ["/contact", "Contact"],
] as const;

const pageNames: Record<string, string> = {
  "/": "International Trade & Export Group",
  "/about": "About",
  "/about/story": "Our Story",
  "/about/vision": "Vision & Mission",
  "/companies": "Our Companies",
  "/companies/hmd-international-group": "HMD International Group",
  "/industries": "Industries & Products",
  "/global-reach": "Global Reach",
  "/gallery": "Gallery",
  "/what-we-do": "What We Do",
  "/contact": "Contact",
};

function setMeta(selector: string, value: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = value;
}

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

  useEffect(() => {
    const pageName = pageNames[location.pathname] || "SAMWATEX";
    document.title = location.pathname === "/" ? content.seoTitle : `${pageName} — ${content.brandName}`;
    setMeta('meta[name="description"]', content.seoDescription);
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[property="og:description"]', content.seoDescription);
    const socialImage = content.seoSocialImageUrl || content.heroImageUrl;
    if (socialImage) setMeta('meta[property="og:image"]', new URL(socialImage, window.location.origin).toString());
  }, [content, location.pathname]);

  return (
    <div className="site-shell">
      <div className="site-grain" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="brand" aria-label={`${content.brandName} home`}>
          <span className="brand-mark">{content.brandName}</span>
          <span className="brand-copy">{content.brandDescriptor}</span>
        </Link>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
          <Link className="mobile-nav-contact" to="/contact">Start an enquiry ↗</Link>
        </nav>

        <div className="header-actions">
          <Link className="header-cta" to="/contact">Talk to us</Link>
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
          <p>Lebanon based. Internationally connected.</p>
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
