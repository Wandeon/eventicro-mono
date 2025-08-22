# Codex Guardrails — EventiCRO

Codex must respect these rules when editing the repo:

## 1. Untouchable files (NEVER edit)
- /srv/config/track-a-outputs.md
- /srv/config/runtime-config-from-outputs.md
- /srv/config/project-baseline-index.md
- /srv/config/infra-vps-runbook.md
- /srv/config/tailscale-networking.md
- /srv/config/track-a-blueprint.md
- /srv/config/track-a-handover.md
- /srv/config/Step 2 progress.md

These are **authoritative runtime specs and outputs**. They can be read but never modified.

## 2. Allowed areas
- `apps/ui/` → UI and design changes only
- `apps/api/` → API logic changes, but **do not edit health check or CORS middleware without explicit instruction**
- `apps/workers/` → background jobs, can be edited if scoped

## 3. Safety rules
- Do not touch Dockerfiles or systemd unit files unless asked.
- Do not change domain names, ports, secrets, or env references.
- If a value is missing, Codex must return `Missing inputs` instead of inventing one.
- Always run `pnpm run lint && pnpm run build` before proposing a commit.

## 4. Workflow
- Plan → Patch → Prove
- Plan: state what will change
- Patch: show full diffs
- Prove: run lint/build/tests and report

