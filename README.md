# HMD International Group — Public Website

Public corporate website for HMD International Group. This repository is intentionally separate from the ERP application and contains no ERP source code, routes, database access, or credentials.

## Architecture

- React + Vite frontend
- Express API/backend
- PostgreSQL-backed editable site content
- Admin login/content editor foundation
- Render Blueprint (`render.yaml`) for web service + Postgres
- GitHub Actions build/type-check CI

## Planned production domains

- `hmdinternationalgroup.com` — public website
- `www.hmdinternationalgroup.com` — redirect/canonical public website
- `erp.hmdinternationalgroup.com` — separate existing ERP deployment

## Local development

1. Copy `.env.example` to `.env` and fill the values.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.

The frontend is served by Vite in development. The Express API runs in the same Node process and exposes public content/contact endpoints plus authenticated admin endpoints.

## Admin foundation

The initial `/admin` page supports login and editing the core public site content. The first version uses environment-configured administrator credentials. Before production launch, expand the media area with persistent object storage (for example Cloudinary, S3-compatible storage, or Render-compatible external storage) rather than storing uploaded images on the web service filesystem.

## Required environment variables

- `DATABASE_URL`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `NODE_ENV=production`

See `.env.example` and `render.yaml`.

## Deployment

The repository includes a Render Blueprint. Deploy it as its own Render project/service; do not attach the public-domain root to the ERP service.

Before moving the production domain:

1. Deploy and test the website on its temporary Render hostname.
2. Upload final branding/photos and verify public content.
3. Move the ERP custom domain to `erp.hmdinternationalgroup.com` and verify login/API/passkey configuration.
4. Point `hmdinternationalgroup.com` and `www.hmdinternationalgroup.com` at this website.
5. Disable any obsolete ERP public hostnames where appropriate.

## Security

- Do not commit secrets.
- Keep the website database separate from the ERP database.
- Use a long random `SESSION_SECRET` and strong administrator credentials.
- Protect the admin route with rate limiting/MFA before production launch.
- Store uploaded media in persistent external/object storage.

See `SECURITY.md` for the intended separation model.
