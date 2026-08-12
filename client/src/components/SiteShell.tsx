import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="SAMWATEX home">
          <span className="brand-mark">SAMWATEX</span>
          <span className="brand-copy">International Group</span>
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
          <div className="footer-mark">SAMWATEX</div>
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
          <a href="mailto:sales@samwatex.com">sales@samwatex.com</a>
        </div>
        <div className="footer-meta">
          <p>Beirut · Lebanon</p>
          <p>© {new Date().getFullYear()} SAMWATEX</p>
        </div>
      </footer>
    </div>
  );
}
