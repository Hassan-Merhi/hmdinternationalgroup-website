# SAMWATEX Website Security

This repository is a standalone public corporate website and CMS foundation.

## Rules

- Never commit passwords, API keys, database URLs, session secrets or storage credentials.
- Store production secrets only in the hosting environment.
- Use a long random `SESSION_SECRET` and a strong `ADMIN_PASSWORD`.
- Keep `/admin` excluded from search indexing.
- Use persistent external/object storage for future media uploads rather than the web-service filesystem.
- Add login rate limiting, CSRF hardening, upload validation and stronger admin controls in the dedicated security phase before public launch.
- Keep public content and enquiry data in the SAMWATEX website database only.

## Current administration

The `/admin` route uses a server-side session and an environment-configured password. It is a foundation for later CMS/security phases and should not be treated as the final hardened production administration model until those phases are completed.
