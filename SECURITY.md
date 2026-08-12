# Security notes

This public website is intentionally separate from the HMD ERP.

- Do not import ERP code, ERP credentials, ERP database URLs, or ERP API secrets into this repository.
- Keep `ADMIN_PASSWORD`, `SESSION_SECRET`, and `DATABASE_URL` in Render environment variables only.
- Never commit `.env` files.
- The admin session cookie is HTTP-only, secure in production, SameSite=Lax, and host-scoped by default.
- The `/admin` route is not linked from public navigation and is excluded from `robots.txt`.
- Direct media uploads should use persistent/object storage. Do not rely on Render's ephemeral application filesystem for durable uploads.
- Before attaching the production domain, review all placeholder content and contact details.
