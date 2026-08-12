# SAMWATEX — Corporate Website

Premium branded corporate website for **SAMWATEX**, a Lebanon-based parent group with international trade and export activity. HMD International Group is represented as an operating company under SAMWATEX.

> The GitHub repository currently retains its original starter-repo name. The public product, code, content and deployment configuration are SAMWATEX-first.

## Current scope

- Responsive React + TypeScript + Vite public frontend
- Express + TypeScript backend
- PostgreSQL persistence for editable site content and enquiries
- Password-protected `/admin` content editor foundation
- SAMWATEX parent-company content model with subsidiaries
- Premium responsive homepage for phone, tablet, laptop and desktop
- About, Story, Vision & Mission, Companies, HMD company profile, Industries & Products, What We Do and Contact pages
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
- `/what-we-do` — International trade, sourcing and distribution capabilities
- `/contact` — Commercial enquiry and Beirut contact details
- `/admin` — Private content editor

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

Before the first public deployment, set `ADMIN_PASSWORD` in Render and use a strong generated `SESSION_SECRET`.

## Build programme

Phases 1–3 establish the SAMWATEX foundation, premium homepage and corporate identity pages. Phases 4–6 add the group-company portfolio, reusable subsidiary profiles, the full HMD International Group profile, and the industries/product framework. Subsequent phases expand global-reach storytelling, gallery/media, enquiries, CMS capability, visual refinement and final launch hardening.
