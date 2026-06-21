# `.claude/` — Claude Code project workspace

This directory marks the repository as a Claude Code project and holds
Claude-specific agent configuration. The **agent instructions** themselves live
in two places:

- [`../CLAUDE.md`](../CLAUDE.md) — coding conventions Claude must follow when
  editing this repo (TypeScript, React/Next.js, styling, the simulation
  boundary, secrets).
- [`../AGENTS.md`](../AGENTS.md) — the same guidance in a tool-agnostic form for
  any coding agent (Codex, Cursor, Copilot, Gemini, …).

How the agents were actually orchestrated to build the MVP — the
plan → spec → TDD → review → e2e workflow, the models used, and why — is
documented in [`../docs/agent-orchestration.md`](../docs/agent-orchestration.md).
The design specs and implementation plans produced during that process are
checked in under [`../docs/superpowers/`](../docs/superpowers/).

## Conventions for Claude in this repo

1. Read `CLAUDE.md` before editing; match the surrounding code style.
2. Keep faked chain/AVM logic behind the swappable interfaces in `src/lib/`
   (`contract.ts`, `avm.ts`, `store.ts`).
3. A change is done only when `npm run lint`, `npm test`, `npm run build`, and
   `npm run test:e2e` all pass.
4. Secrets live in `.env.local` (gitignored); never hard-code keys.
