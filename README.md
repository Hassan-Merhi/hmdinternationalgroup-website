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

`ADMIN_USERNAME` and `ADMIN_PASSWORD` seed the first administrator. The default username is `admin` when `ADMIN_USERNAME` is omitted.

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

Before the first public deployment, set `ADMIN_PASSWORD` in Render and keep the generated `SESSION_SECRET` private. `ADMIN_USERNAME` defaults to `admin` in the Blueprint and can be changed before deployment.

## Build programme

Phases 1–3 establish the SAMWATEX foundation, premium homepage and corporate identity pages. Phases 4–6 add the group-company portfolio, reusable subsidiary profiles, the full HMD International Group profile, and the industries/product framework. Phases 7–9 add Global Reach/export-market storytelling, a filterable gallery, and the structured commercial enquiry system. Phases 10–12 add the full CMS, persistent media manager, admin/enquiry workflows, dynamic SEO controls and the premium visual/refinement pass. **Phase 13 completes the SEO, social-sharing and performance hardening layer.** Remaining phases cover security hardening, final QA and production deployment.
