# Runtime config from outputs
- Source of truth: /srv/config/track-a-outputs.md
- Renderers:
  - outputs2env /srv/config/track-a-outputs.md /srv/core/.env
  - outputs2env /srv/config/track-a-outputs.md /etc/default/eventicro.env
- Never commit real secrets; use ops/env/.env.sample as template.
