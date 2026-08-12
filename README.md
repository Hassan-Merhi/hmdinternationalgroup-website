# SAMWATEX — Corporate Website

Premium branded corporate website for **SAMWATEX**, a Lebanon-based parent group with international trade and export activity. HMD International Group is represented as an operating company under SAMWATEX.

> The GitHub repository currently retains its original starter-repo name. The public product, code, content and deployment configuration are SAMWATEX-first.

## Current scope

- Responsive React + TypeScript + Vite public frontend
- Express + TypeScript backend
- PostgreSQL persistence for editable site content, business enquiries, media, admin users and audit history
- Full private `/admin` CMS
- SAMWATEX parent-company content model with subsidiaries
- Persistent photo/PDF media library with upload, replace, edit, delete and reorder controls
- Premium responsive experience for phone, tablet, laptop and desktop
- Dynamic route-level SEO, OpenGraph/Twitter metadata and JSON-LD structured data
- CMS-driven sitemap generation including future subsidiaries
- Route-level code splitting, shared content-request deduplication, response compression and production cache strategy
- High-priority hero image delivery plus lazy-loaded gallery media
- Hardened admin authentication, CSRF protection, rate limiting, upload signature checks and browser security headers
- About, Story, Vision & Mission, Companies, HMD company profile, Industries & Products, Global Reach, Gallery, What We Do and Contact pages
- Render Blueprint for a standalone web service + PostgreSQL database

## Brand structure

- **SAMWATEX** — parent company, based in Lebanon
- **HMD International Group** — operating company under SAMWATEX
- Export markets include Africa, the Middle East and other international markets
- The website does not claim physical SAMWATEX offices outside Lebanon

## Public routes

- `/` — SAMWATEX homepage
- `/about` — Who We Are + values
- `/about/story` — Group story + structure
- `/about/vision` — Vision + mission
- `/companies` — SAMWATEX operating-company portfolio
- `/companies/hmd-international-group` — full HMD International Group profile
- `/industries` — industries, product collections and commercial categories
- `/global-reach` — Lebanon base, export markets and commercial reach
- `/gallery` — filterable group/company/product visual storytelling
- `/what-we-do` — International trade, sourcing and distribution capabilities
- `/contact` — structured commercial, product, export, supplier and partnership enquiries
- `/admin` — private SAMWATEX CMS

Unknown public routes render a branded 404 and receive an HTTP 404 response in production rather than redirecting to the homepage.

## SEO, social and performance

Phase 13 includes:

- Route-specific titles and descriptions
- Canonical URLs
- OpenGraph and Twitter sharing cards
- CMS-controlled social image
- Organization, WebSite, WebPage and operating-company JSON-LD
- Breadcrumb structured data
- `noindex` handling for unknown routes and the private admin surface
- Dynamic `sitemap.xml` generated from current CMS companies
- Static sitemap fallback and crawler rules
- React route-level lazy loading/code splitting
- Deduplicated `/api/site-content` loading across pages
- Brotli/gzip-capable Express response compression middleware
- Immutable one-year caching for hashed Vite assets
- Extended media caching with ETags
- High-priority homepage hero image delivery
- Native lazy loading and async decoding for gallery imagery
- Browser `content-visibility` optimizations for deep off-screen sections
- Reduced-data and reduced-motion handling

## Security hardening

Phase 14 includes:

- production fail-fast for short/missing session secrets
- password hashing with `scrypt` and unique salts
- minimum 14-character password policy for bootstrap/new/reset admin credentials
- generic login failure messages and dummy password verification to reduce username enumeration signals
- per-IP login throttling plus failed IP/username lockout
- session-ID regeneration after successful login
- `HttpOnly`, production `Secure`, `SameSite=Strict` admin cookies
- 12-hour absolute admin sessions
- cryptographically random per-session CSRF tokens
- CSRF enforcement on all state-changing CMS requests
- Origin / Fetch Metadata protection for the admin API
- admin session-version revocation after password/account changes
- owner-only administrator creation/account mutation
- CSP, HSTS, clickjacking, `nosniff`, referrer and permissions security headers
- Express fingerprint removal
- private CMS `no-store` response handling
- default 256 KB JSON body ceiling, with the larger request allowance isolated to authenticated media upload/replacement routes
- JPEG/PNG/WebP/GIF/PDF allow-listing plus file magic-byte validation
- normalized media filenames and forced PDF download delivery
- bounded CMS payloads, record counts, slugs and asset URLs
- public enquiry throttling, honeypot, timing signal, duplicate suppression and input bounds
- hashed-IP failed-login audit records
- immediate audit trail for content, enquiries, media and admin operations
- automatic `site_content_history` snapshots before CMS content updates

See `SECURITY.md` for the complete security model and production rules.

## CMS

The `/admin` workspace includes:

- Dashboard with company, industry, media and new-enquiry metrics
- Homepage, hero, About and capability editing
- Company/subsidiary add/edit/reorder/remove controls
- Industry and product-collection management
- Export-market and homepage-statistic management
- Gallery composition and media assignment
- Media library upload, replacement, metadata editing, deletion and reordering
- Enquiry inbox with `new`, `read`, `replied` and `archived` status handling
- SEO title, description and social-image settings
- Contact/footer settings
- Administrator creation/activation controls
- Admin audit history

`ADMIN_USERNAME` and `ADMIN_PASSWORD` seed the first administrator. The default username is `admin` when `ADMIN_USERNAME` is omitted. Production bootstrap passwords must be unique passphrases of at least 14 characters.

## Media storage

Media assets are stored persistently in the SAMWATEX PostgreSQL database and served through `/api/media/:id`. Supported uploads are JPEG, PNG, WebP, GIF and PDF up to 8 MB each.

When the media library grows significantly, the storage layer can later be moved to object storage/CDN without changing the public content model because the CMS already stores media by stable URL.

## Enquiry system

The public enquiry form captures enquiry type, contact details, country/market, company of interest, product/category and message. Enquiries are stored in PostgreSQL with a status lifecycle (`new`, `read`, `replied`, `archived`) and a generated SAMWATEX reference number. The CMS includes the business-enquiry inbox and status workflow.

## Contact details

- Email: `sales@samwatex.com`
- Phone: `+961 81 333 194`
- Address: Beirut Port Free Zone, Ezzeldine Building, Floor (-1), Hadath San Therez, Baabda, Lebanon

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:3001`

## Render deployment

The included `render.yaml` provisions a standalone SAMWATEX web service and PostgreSQL database. The intended production domain is:

- `samwatex.com`
- `www.samwatex.com`

Before the first public deployment, set a strong `ADMIN_PASSWORD` in Render and keep the generated `SESSION_SECRET` private. `ADMIN_USERNAME` defaults to `admin` in the Blueprint and can be changed before deployment. Provider-level PostgreSQL backup/recovery settings are verified during the deployment phase.

## Build programme

Phases 1–3 establish the SAMWATEX foundation, premium homepage and corporate identity pages. Phases 4–6 add the group-company portfolio, reusable subsidiary profiles, the full HMD International Group profile, and the industries/product framework. Phases 7–9 add Global Reach/export-market storytelling, a filterable gallery, and the structured commercial enquiry system. Phases 10–12 add the full CMS, persistent media manager, admin/enquiry workflows, dynamic SEO controls and the premium visual/refinement pass. Phase 13 completes SEO, social-sharing and performance hardening. **Phase 14 completes application-security hardening.** Remaining phases are final QA/verification and production deployment.
