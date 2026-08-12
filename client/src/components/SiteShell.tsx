import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";
import { SeoManager } from "@client/components/SeoManager";

const navItems = [
  ["/about", "About"],
  ["/products", "Products"],
  ["/process", "Process"],
  ["/companies/hmd-international-group", "HMD"],
  ["/export-markets", "Export"],
  ["/sustainability", "Textile reuse"],
  ["/gallery", "Gallery"],
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

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      "main .section-pad, main .contact-band, main .statement-section",
    ));
    if (!targets.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targets.forEach((target, index) => {
      target.classList.add("phase9-reveal");
      target.style.setProperty("--phase9-delay", `${Math.min(index, 5) * 35}ms`);
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("phase9-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).classList.add("phase9-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="site-shell textile-site-shell phase9-site">
      <SeoManager content={content} />
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="brand" aria-label={`${content.brandName} home`}>
          <span className="brand-mark">{content.brandName}</span>
          <span className="brand-copy">{content.brandDescriptor}</span>
        </Link>

        <nav className={`main-nav textile-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
          <Link className="mobile-nav-contact" to="/contact">Wholesale enquiry ↗</Link>
        </nav>

        <div className="header-actions">
          <Link className="header-cta" to="/contact">Wholesale enquiry</Link>
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

      <footer className="site-footer textile-footer">
        <div className="footer-brand-block">
          <div className="footer-mark">{content.brandName}</div>
          <p>Used clothing · sorting · grading · wholesale export</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/what-we-do">What we do</Link>
          <Link to="/products">Products</Link>
          <Link to="/process">Process</Link>
          <Link to="/companies/hmd-international-group">HMD</Link>
          <Link to="/export-markets">Export & logistics</Link>
          <Link to="/sustainability">Textile reuse</Link>
          <Link to="/gallery">Gallery</Link>
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
