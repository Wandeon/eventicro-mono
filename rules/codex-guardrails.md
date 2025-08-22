# Codex / AI Contributor Guardrails

## Golden rules
1) **Do not edit** the following without explicit intent and human review:
   - `/ops/**`, `/infra/**`, `/scripts/**`
   - `/apps/ui/src/lib/server/**`
   - `/apps/ui/src/routes/**/_server.*`, `/apps/ui/src/routes/**/+page.server.*`

2) If you must change any of the above, include **[allow-sensitive]** in the PR title
   and explain why in the PR description. PR will require CODEOWNERS review.

3) Keep production build settings intact (SSR host/port, adapter-node entrypoint).
4) Do not commit secrets. Use env files and GitHub Secrets.

## Commit message conventions
- `feat(ui): ...`, `fix(api): ...`, `chore(ops): ...`
- If touching sensitive paths, append `[allow-sensitive]` to the PR **title**.

## Testing
- For UI: `pnpm -C apps/ui install && pnpm -C apps/ui build && pnpm -C apps/ui test || true`
