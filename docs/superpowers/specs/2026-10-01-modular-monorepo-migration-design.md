# Modular Monorepo Migration — Design

**Date:** 2026-10-01
**Status:** Approved for planning
**Type:** Restructuring (no feature work, no rewrite)

## Goal

Reorganize the existing Kometa repository from a single-app Expo project into a
pnpm + Turborepo monorepo with `apps/*` and `packages/*` boundaries, while
preserving 100% of current application behavior.

## Audit of the actual repository (2026-10-01, at commit `3dba3d2`)

This section records what is *actually* in the repo, because the original brief
assumed a structure that does not exist.

### What exists

| Area | Reality |
|---|---|
| Apps | **One**: a single Expo SDK 57 app at the repo root |
| Routing | Expo Router, file-based, 14 routes under `src/app/` |
| Entry | `package.json#main = "expo-router/entry"`; vestigial `index.ts` re-imports it |
| UI | `src/components/design-system/` (ThemeProvider, 13 atoms, 2 molecules) |
| Features | `src/features/{checkout,home,notifications,rating,tracking}` |
| State | React Context providers in `src/hooks/` (Auth, Cart, CheckoutFlow, Onboarding, TabBarVisibility) |
| Styling | styled-components/native + tokens in `src/constants/theme.ts` |
| Data | **Mock data only** — `mockData.ts` in every feature |
| Tests | 48 `*.test.{ts,tsx}` files, Jest + `jest-expo` preset |
| Config | `app.config.js`, `eas.json`, `babel.config.js`, `tsconfig.json`, `jest-setup.js` |
| Native | `ios/` present locally but **gitignored** (prebuild output); no `android/` |
| Assets | `assets/*.png` — referenced by **nothing** in code or `app.config.js` |
| Package manager | Ambiguous: **both** `package-lock.json` (Aug 1) and `yarn.lock` (Aug 17) are tracked; no install marker in `node_modules` |

### What does NOT exist

- No backend of any kind: no `apps/api`, no Fastify, no Node server
- No Prisma: no `prisma/`, no `schema.prisma`, no migrations
- No database: no PostgreSQL, no Neon, no `DATABASE_URL`
- No real authentication: `src/hooks/AuthProvider.tsx` is a 14-line mock holding
  a `boolean`. No JWT, no refresh tokens, no Argon2, no SecureStore, no OAuth
- No API client and no HTTP calls to any API. The only `fetch()` calls are
  leftover debug instrumentation in `src/app/_layout.tsx`
- No lint config (no ESLint, Prettier or Biome), and no `lint`, `typecheck` or
  `build` scripts
- No CI/CD (`.github/` absent), no Docker, no `infrastructure/`
- No `packages/`, no workspace configuration

### Repository is under active development

The audit was taken twice during the same session and the index changed between
reads: `HEAD` advanced from `fa5c29a` to `3dba3d2`
("chore(home): remove unused home tab pages and clean up layout"), which deleted
17 route files under `src/app/(tabs)/(home)/`. All counts in this document are
as of `3dba3d2`: **243 tracked files, 213 under `src/`, 14 routes, 48 test
files, 293 import statements (98 via the `@/*` alias, 195 relative).**

The migration must therefore re-derive its baseline counts at execution time
rather than trusting the numbers here, and must start from a clean working tree.

### Brief vs. repository discrepancy

The original brief describes a **different product**: it names `@nebulance/*`
packages, "Nebulance Business", and backend domains `financial-accounts`,
`transactions`, `budgets`, `goals`, `runway`, `insights`, `documents` — a
personal-finance application. Kometa is a **food-delivery** app (restaurants,
cart, checkout, order tracking, ratings). Brief section 26 itself uses
`@kometa/*`.

Consequently, brief sections 9, 10, 11, 12, 13, 14, 20, 30 and 31 have nothing
to migrate. The database-safety requirements (11, 31) are satisfied trivially:
**there is no database, no Prisma schema and no migrations in this repository**,
so no destructive database operation is possible.

## Decisions

Confirmed with the project owner on 2026-10-01:

1. **`apps/api`: reserve the slot, build nothing.** Create it as a workspace
   member with a README documenting the intended Fastify/Prisma/Postgres stack
   and why it is empty. No server code is invented. The backend becomes its own
   future project with its own spec.
2. **Namespace: `@kometa/*`** — matches the repo, product, app slug (`kometa`)
   and bundle id (`so.sof.kometa`). Not `@nebulance/*`.
3. **Shared packages: all four, as thin placeholders.** `packages/{types,
   validation,config,utils}` are scaffolded with real `package.json`,
   `tsconfig.json` and an `index.ts`, but **no code is moved out of mobile**.
   Boundaries exist on paper until a second consumer exists. This deliberately
   accepts the brief's section 27 warning in exchange for zero risk to current
   behavior.

## Target structure

```
kometa/
├── apps/
│   ├── mobile/          # the existing Expo app, moved wholesale
│   ├── api/             # README only — reserved, no code
│   └── web/             # README + minimal package.json — reserved, no Next.js
├── packages/
│   ├── types/           # thin placeholder
│   ├── validation/      # thin placeholder
│   ├── config/          # thin placeholder
│   └── utils/           # thin placeholder
├── infrastructure/
│   └── README.md        # reserved; nothing to move yet
├── docs/
├── package.json         # workspace root: turbo + shared tooling only
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json        # base for packages (mobile keeps expo/tsconfig.base)
├── .gitignore
└── README.md
```

## Constraints

- **Preserve git history**: use `git mv` for tracked files. Never delete `.git`.
- **No import rewrites required**: mobile's `@/*` alias stays `./src/*` relative
  to `apps/mobile/tsconfig.json`, so all 98 alias imports and all 195 relative
  imports survive the move unchanged. Any import change is a red flag.
- **Mobile keeps Expo's TypeScript base**: `apps/mobile/tsconfig.json` extends
  `expo/tsconfig.base`, NOT the root tsconfig. Brief section 17 requires this.
- **No `metro.config.js`**: Expo configures Metro for monorepos automatically
  from SDK 52+, and this project has no metro config today. Do not add one.
- **pnpm only**: delete `package-lock.json` and `yarn.lock`; commit
  `pnpm-lock.yaml`. No npm/yarn workspaces, no `workspaces` field.
- **No feature work**: no new screens, no auth implementation, no Zod schemas
  wired into forms, no API client, no Prisma.
- **Do not run `prettier --write` across the repo** — it would reformat ~240
  files and bury the migration diff. Add the tooling; leave the run to the owner.

## Environment facts that affect execution

- Expo SDK 57 requires **Node ≥ 22.13.x**. The machine has **v20.19.4**. This is
  pre-existing and may break install or `expo` commands during verification.
- Expo supports pnpm **isolated** dependencies from SDK 54+, but its monorepo
  guide recommends `nodeLinker: hoisted` if native/build errors appear. Plan:
  attempt isolated first, fall back to hoisted with evidence.
- Turborepo 2.11.6: task key is `tasks` (not `pipeline`); schema is
  `https://turborepo.dev/schema.json`.
- `ios/` is gitignored prebuild output whose CocoaPods references point at the
  old `node_modules` location. It must be regenerated after the move; it is
  moved rather than deleted so the change stays reversible.

## Out of scope

- Building the backend (its own project)
- Creating CI/CD — none exists, and the brief forbids inventing a new system
- Replacing mock data with real data
- Fixing the pre-existing debug instrumentation in `src/app/_layout.tsx`
- Configuring app icons (currently `assets/` is referenced by nothing)

## Acceptance

- `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all
  run from the root
- All 48 existing test files still pass, with the same assertions
- `expo config` resolves and `expo export --platform ios` bundles successfully
  (non-interactive proof that Metro resolves the app inside the monorepo)
- `git log --follow` works on moved files
- No file under `apps/mobile/src/` has a changed import statement
