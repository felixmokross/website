# AGENTS.md

Guidance for coding agents and contributors working in this repository.

This repository contains the source for [fxmk.dev](https://fxmk.dev), with a
React Router frontend and a Payload CMS backend.

## Repository-wide Guidelines

- Use `pnpm` as package manager.
- Use Node.js 24, as pinned in `.nvmrc` and CI.
- Keep changes focused and minimal; avoid unrelated refactors.
- Keep docs in sync when introducing new patterns or conventions.
- Preserve user changes you did not make, especially in a dirty worktree.
- Pull request titles must follow Conventional Commits because GitHub squash
  merge uses the PR title as the commit on `main`.
  - Format: `<type>(optional-scope): <description>`
  - Example: `feat(frontend): add newsletter archive page`
  - Use descriptive commits inside the PR for review clarity; the PR title is
    the canonical squash commit message.
- When the current Codex/chat thread already has an open pull request, push any
  newly applied changes to that PR branch unless explicitly instructed
  otherwise.
- After you address a pull request review comment, resolve that conversation in
  the PR.
- Keep `@types/node` aligned with the current runtime major (Node 24). Do not
  upgrade to Node 25+ typings until the runtime migration is planned.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution guidelines.

## Repository Structure

- Frontend app: `apps/frontend`
- Payload CMS app: `apps/cms`
- Generated Payload types package: `libs/payload-types`
- Shared workspace package: `libs/shared`
- End-to-end tests: `tests/e2e`
- Release tooling: `@fxmk/releaser`

## Development Commands

```bash
pnpm install --frozen-lockfile             # Install dependencies
pnpm generate:types                        # Generate/copy Payload types
pnpm check                                 # Full local check pipeline
pnpm lint                                  # Lint frontend and CMS
pnpm check-format                          # Prettier check for frontend and CMS
pnpm typecheck                             # Generate types, then typecheck frontend
pnpm typecheck:generated                   # Typecheck frontend with existing generated types
pnpm test                                  # Run frontend Vitest tests
pnpm build                                 # Generate types, then build frontend and CMS
pnpm build:generated                       # Build with existing generated types

pnpm --filter @fxmk/frontend dev           # Start frontend dev server
pnpm --filter @fxmk/frontend build         # Build frontend
pnpm --filter @fxmk/frontend typecheck     # React Router typegen + tsc
pnpm --filter @fxmk/frontend lint          # ESLint check
pnpm --filter @fxmk/frontend check-format  # Prettier check
pnpm --filter @fxmk/frontend test          # Vitest watch mode

pnpm --filter @fxmk/cms dev                # Start Payload CMS dev server
pnpm --filter @fxmk/cms build              # Generate types, then build CMS
pnpm --filter @fxmk/cms build:generated    # Build CMS with existing generated types
pnpm --filter @fxmk/cms generate:types     # Generate Payload types
pnpm --filter @fxmk/cms lint               # CMS lint check
pnpm --filter @fxmk/cms check-format       # CMS Prettier check

pnpm --filter @fxmk/payload-types pull-payload-types # Populate libs/payload-types
pnpm --filter @fxmk/e2e e2e                         # Open Playwright UI
```

## Generated Types

Payload types are generated from the CMS and copied into `libs/payload-types`.
Those generated files are gitignored. Run `pnpm generate:types` before frontend
typechecks or builds in a fresh checkout.

## Quality Checklist

- Run `pnpm check` before finishing broad or cross-package changes.
- Run `pnpm generate:types` before checks that depend on Payload types.
- Run `pnpm lint` when touching TypeScript, React, or CMS code.
- Run `pnpm check-format` when touching formatting-sensitive files.
- Run `pnpm test` when touching tested frontend behavior.
- Run `pnpm build` when changing build configuration, shared types, or cross-app
  contracts.
- Run the relevant app-specific command for narrowly scoped changes when the
  full check pipeline is unnecessary.
- Update docs when behavior, commands, architecture, or conventions change.
