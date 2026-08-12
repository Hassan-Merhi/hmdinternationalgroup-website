import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  ["/", "Home"],
  ["/about", "About"],
  ["/businesses", "Businesses"],
  ["/contact", "Contact"],
] as const;

export function SiteShell() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="HMD International Group home">
          <span className="brand-mark">HMD</span>
          <span className="brand-copy">International Group</span>
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link className="header-cta" to="/contact">
          Talk to us
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div>
          <div className="footer-mark">HMD</div>
          <p>International Group</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/businesses">Businesses</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p className="footer-meta">© {new Date().getFullYear()} HMD International Group</p>
      </footer>
    </div>
  );
}
