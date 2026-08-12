# SAMWATEX Website Security

This repository is a standalone public corporate website and private CMS. Phase 14 is the dedicated application-security hardening layer.

## Secret handling

- Never commit passwords, API keys, database URLs, session secrets or future storage credentials.
- `.env` and `.env.*` are ignored by Git; only `.env.example` is tracked.
- Production secrets belong only in Render/environment configuration.
- `SESSION_SECRET` must be at least 32 characters in production. Render generates it automatically from the Blueprint.
- The bootstrap `ADMIN_PASSWORD` must be a unique passphrase of at least 14 characters.
- Do not reuse an ERP, email, banking or personal password for the website CMS.

## Admin authentication and sessions

- Admin passwords are stored with Node `scrypt` plus a unique random salt; plaintext passwords are never stored.
- Login responses are intentionally generic to reduce username enumeration.
- Repeated failed logins are throttled by IP and by the IP/username pair.
- Successful login regenerates the session ID to prevent session fixation.
- Admin cookies are `HttpOnly`, `Secure` in production and `SameSite=Strict`.
- Admin sessions have a 12-hour absolute lifetime.
- Each authenticated session carries a cryptographically random CSRF token.
- Every state-changing CMS request must present the session CSRF token.
- Cross-site admin requests are rejected using Origin / Fetch Metadata checks.
- Admin accounts have a `session_version`; password changes or deactivation invalidate older sessions immediately.
- Account creation and account mutation require the bootstrap/owner role.
- An administrator cannot deactivate their own active session account.

## Request and browser hardening

The server applies:

- Content Security Policy (CSP)
- HSTS in production
- `X-Content-Type-Options: nosniff`
- clickjacking protection (`frame-ancestors 'none'` + `X-Frame-Options: DENY`)
- strict referrer policy
- restrictive Permissions Policy
- Cross-Origin-Opener-Policy
- removal of the Express `X-Powered-By` header
- no-store caching for private CMS data
- request body limits (small default JSON body, larger allowance only for authenticated media upload/replacement)

`/admin` remains excluded from indexing and receives `X-Robots-Tag: noindex, nofollow` in production.

## Media security

Supported CMS uploads are limited to:

- JPEG
- PNG
- WebP
- GIF
- PDF

Controls include:

- maximum 8 MB decoded asset size
- maximum encoded request size
- MIME allow-listing
- file magic/signature verification (the bytes must match the claimed MIME type)
- server-normalized filenames/extensions
- no SVG or HTML uploads
- `nosniff` response protection
- PDFs are delivered as downloads rather than inline active documents
- image files remain available for the public site through stable `/api/media/:id` URLs

Large supported photographs are additionally resized/compressed client-side when doing so produces a smaller WebP file.

## CMS content validation

- CMS payloads have an overall size ceiling.
- Section record counts are bounded.
- company/industry slugs are constrained to safe URL forms.
- hero, gallery and social-image URLs must be approved media URLs or safe HTTP(S) asset URLs.
- React renders CMS text as text rather than raw HTML.
- every site-content update first stores the previous JSON document in `site_content_history` for recovery.

## Public enquiry protection

The contact endpoint uses layered abuse controls:

- per-IP request throttling
- hidden honeypot field
- minimum human form-completion timing signal
- field length limits
- email validation
- minimum meaningful message length
- duplicate submission suppression for the same email/message over a short window
- bounded source paths and enquiry types

Enquiries are never exposed through a public list API.

## Admin audit trail

Security-relevant CMS actions are written to `website_admin_audit`, including:

- successful admin logins
- failed admin logins (with a one-way IP fingerprint, not a raw IP address)
- content updates
- enquiry status updates
- media upload/update/replace/reorder/delete
- admin creation and account updates

The CMS exposes the recent audit trail only to authenticated administrators.

## Recovery and backups

- Every CMS content edit creates an application-level historical snapshot in `site_content_history` before the new content is saved.
- The production PostgreSQL service remains the source of truth for site content, enquiries, media, admin users and audit history.
- Provider-level PostgreSQL backup / recovery settings must be enabled and verified during the production Render deployment phase; application code must not embed database backup credentials.
- Media is stored in PostgreSQL rather than Render's ephemeral web-service filesystem, so web-service restarts do not delete uploaded assets.

## Repository / deployment rules

- Keep the website database isolated from all ERP or other business-system databases.
- Do not add ERP credentials, routes or APIs to this website.
- Do not commit production `.env` files, database dumps containing customer/enquiry data, or uploaded private media.
- Rotate `SESSION_SECRET` and affected credentials immediately if a secret is ever exposed.
- Before launch, run the final Phase 15 build/type-check/CI/security verification against the exact commit intended for production.
