# Valyra — AI Agent Orchestration

How this MVP was built with AI coding agents: which tools, why they were the
right choice, and how they were orchestrated. This is the "human + AI
collaboration history" behind the commit log.

## Tooling at a glance

| Layer | Choice | Why |
| --- | --- | --- |
| **Primary agent** | **Claude Code** (Anthropic, Claude Opus) | Terminal-native agent that edits the repo, runs the toolchain, and reads the whole codebase. Strong at TypeScript/React and at long, multi-file reasoning, which suits an App-Router codebase with a shared simulation layer. |
| **Workflow skills** | Superpowers (brainstorming → writing-plans → TDD → code-review) | Turns a vague idea into spec → plan → tested implementation with explicit review gates, instead of one-shot code dumps. |
| **Test runners driven by the agent** | Vitest (unit) + Playwright (e2e) | The agent writes and *runs* the tests, so "done" means green checks, not assertions of correctness. |
| **Agent instructions** | `CLAUDE.md` + `AGENTS.md` + `.claude/` | Conventions are pinned in-repo so every session (and every tool) starts from the same rules. |

**Why Claude Code specifically.** The work is mostly *editing an existing,
interconnected codebase* — touching `lib/` seams, wiring components, keeping the
client-only store invariant, and re-running lint/tests/build after each change.
A terminal agent that can read any file, run the real toolchain, and verify its
own output fits that loop far better than autocomplete-style assistants. Claude
Opus's long-context reasoning keeps the simulation boundary and the data-layer
seam coherent across many files.

## The orchestration loop

Each feature followed the same disciplined cycle rather than ad-hoc prompting:

```
brainstorm  →  write spec  →  write plan  →  TDD implement  →  self-review  →  verify (lint/test/build/e2e)  →  PR
```

1. **Brainstorm & spec.** Intent and edge cases are pinned down first. Design
   specs for the **representative flows** (the homeowner and investor journeys)
   are checked in under [`superpowers/specs/`](superpowers/specs/); later
   features (KYC gate, secondary market, settlement) followed the same loop but
   were specced inline rather than as standalone docs.
2. **Plan.** A step-by-step implementation plan is written before code — the
   homeowner-flow plan is in [`superpowers/plans/`](superpowers/plans/) as the
   worked example of this step.
3. **Test-driven implementation.** Logic in `src/lib/` (AVM, contract,
   eligibility, market, scenarios, settlement) was built with Vitest tests
   first — 50 unit tests today.
4. **Self-review & simplification.** A review pass checks the diff for
   correctness and reuse before merge (e.g. the shared `Modal` primitive that
   replaced three hand-rolled dialogs).
5. **Verify.** Nothing is "done" until `npm run lint`, `npm test`,
   `npm run build`, and `npm run test:e2e` are all green.
6. **Integrate.** Work lands via small, conventional commits and pull requests
   (`feat:`, `fix:`, `test:`, `docs:`), giving a readable collaboration history.

## Division of labour (single vs. specialist agents)

- **Specialist sub-agents** are dispatched for parallel, read-only fan-out
  (e.g. "find every place the store is read", broad code search) so the main
  agent keeps a clean working context.
- The **main agent** owns edits, the verification loop, and integration — one
  writer to avoid merge conflicts on a small codebase.

## Guardrails that keep the agent honest

- **In-repo conventions** (`CLAUDE.md` / `AGENTS.md`) load every session, so the
  simulation boundary, the server-component default, and the secrets rule are
  never re-litigated.
- **The verification gate** (lint + unit + build + e2e) is the objective
  definition of done — the agent must show passing output, not claim success.
- **Human review at the PR boundary.** The operator approves merges; the agent
  proposes, the human disposes.

## Reproducing the workflow

Any agent picking up this repo should read `AGENTS.md`, follow the
brainstorm → spec → plan → TDD → verify loop, and gate merges on the four green
checks. The specs and plans in `docs/superpowers/` are the worked examples.
