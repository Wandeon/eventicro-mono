# Frontend Contract

- API: use /api/openapi.json. GET /api/events supports q, cat, when, page, per_page; returns { items, total?, next_cursor? }.
- Networking: same-origin '/api'; no direct external URLs. Only Caddy exposes 80/443.
- Security: respect CSP; no inline scripts; allowlisted tiles/API.
- Structure: src/lib/ui for components; src/lib/api for typed client; SSR in +page.server.ts; pages are presentational.
- QA: Playwright smoke for homepage; Schemathesis for API (already set up).
