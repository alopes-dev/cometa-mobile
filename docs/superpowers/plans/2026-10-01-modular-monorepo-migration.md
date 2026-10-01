# Modular Monorepo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the existing single-app Cometa repository into a pnpm + Turborepo monorepo (`apps/*`, `packages/*`) with zero change to application behavior.

**Architecture:** The entire existing Expo app moves wholesale into `apps/mobile` via `git mv`, so its internal structure, its `@/*` alias and all 293 import statements stay valid without edits. A new workspace root owns only orchestration (pnpm workspace, Turborepo, shared TypeScript base, lint/format tooling). `apps/api`, `apps/web`, `infrastructure/` and the four `packages/*` are created as honest reserved slots — real workspace members with READMEs, no invented code.

**Tech Stack:** pnpm 12 workspaces, Turborepo 2.11, TypeScript 6.0, Expo SDK 57 / React Native 0.86 / React 19.2, Expo Router, Jest + jest-expo, ESLint flat config via `eslint-config-expo`, Prettier.

**Spec:** `docs/superpowers/specs/2026-10-01-modular-monorepo-migration-design.md`

## Global Constraints

- Package namespace is `@cometa/*`. Never `@nebulance/*`.
- Use `git mv` for every tracked file. Never `rm` + re-add. Never touch `.git`.
- **Zero import edits.** No file under `apps/mobile/src/` may have a changed `import` line. If a task seems to require one, stop and report — it means the move was done wrong.
- `apps/mobile/tsconfig.json` extends `expo/tsconfig.base`, not the root tsconfig.
- Do not create `metro.config.js`. Expo auto-configures Metro for monorepos on SDK 52+.
- Do not create Prisma, Fastify, server code, auth code, Zod schemas, API clients, or CI workflows.
- Do not run `prettier --write` on the repo. Add the tooling only.
- Commit `pnpm-lock.yaml`. Delete `package-lock.json` and `yarn.lock`.
- Expo SDK 57 needs Node ≥ 22.13.x; the machine has v20.19.4. Report engine failures as pre-existing, not migration-caused.
- Every verification step's actual output must be pasted into the final report. Never claim a command passed without running it.

## Review Focus

Failure modes the restructure can introduce that no existing test covers:

1. **Metro cannot resolve the app inside the monorepo** — pnpm's symlinked `node_modules` is the single biggest risk. `pnpm test` passing is not sufficient proof; Task 3 bundles with `expo export --platform ios`, and Task 2 has an explicit `nodeLinker: hoisted` fallback.
2. **Workspace packages are unresolvable from mobile** — a `@cometa/*` import may typecheck but fail at bundle time. Task 4 adds a committed test that imports all four packages, so this is caught by `pnpm test` forever.
3. **Root-anchored `.gitignore` patterns silently stop working** — `/ios` and `/android` no longer match after the move, so prebuild output would get committed. Task 2 re-anchors them to `apps/mobile/`.
4. **Jest resolves nothing after the move** — `setupFilesAfterEach` uses `<rootDir>/jest-setup.js` and the `react-native-worklets` resolver; both depend on `rootDir` becoming `apps/mobile`. Task 3 asserts all 48 test files still run, not just that the command exits 0.
5. **`app.config.js` stops resolving `MAPBOX_DOWNLOADS_TOKEN` or the EAS projectId** — the config is read relative to the app directory, so EAS would build the wrong thing. Task 3 verifies with `expo config --type public`.

---

### Task 1: Move the Expo app into `apps/mobile`

Moves every app file, tracked and untracked, in one commit. The root is left without a `package.json` at the end of this task — that is expected and Task 2 fixes it.

**Files:**
- Create: `apps/mobile/` (destination for all moves)
- Move (tracked): `app.config.js`, `babel.config.js`, `eas.json`, `index.ts`, `jest-setup.js`, `package.json`, `tsconfig.json`, `.env.example`, `src/**` (213 files), `assets/**` (6 files), `.dbg/**`
- Move (untracked, gitignored): `ios/`, `expo-env.d.ts`
- Delete (regenerable caches): `node_modules/`, `.expo/`
- Modify: `apps/mobile/package.json` (rename + 3 new scripts)
- Modify: `.gitignore` (re-anchor `/ios` and `/android` to `apps/mobile/` — **required before staging**)
- Keep at root: `.git`, `.claude/`, `.superpowers/`, `docs/`, `README.md`, `LICENSE`, `AGENTS.md`, `CLAUDE.md`, `package-lock.json`, `yarn.lock`

**Interfaces:**
- Produces: workspace member `@cometa/mobile` at `apps/mobile`, with scripts `dev`, `start`, `android`, `ios`, `web`, `test`, `lint`, `typecheck`, and all 15 existing `eas:*` scripts.

- [ ] **Step 1: Record the pre-move baseline so the move can be proven lossless**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git status --porcelain   # must be empty before starting
git ls-files | wc -l > /tmp/cometa-baseline-filecount.txt
git ls-files | grep -cE '\.test\.(ts|tsx)$' > /tmp/cometa-baseline-testcount.txt
cat /tmp/cometa-baseline-filecount.txt /tmp/cometa-baseline-testcount.txt
```

Expected: working tree clean, `243`, then `48`. If the counts differ, the
repository has moved on since the plan was written — use the numbers you just
recorded, not the ones in this plan, and note the difference in the final report.

- [ ] **Step 2: Create the destination and move the tracked app files**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
mkdir -p apps/mobile
git mv app.config.js babel.config.js eas.json index.ts jest-setup.js package.json tsconfig.json .env.example apps/mobile/
git mv src apps/mobile/src
git mv assets apps/mobile/assets
git mv .dbg apps/mobile/.dbg
```

- [ ] **Step 3: Verify git recorded renames, not deletions**

```bash
git status --porcelain | grep -c '^R' 
git status --porcelain | grep '^D' || echo "no deletions - correct"
```

Expected: a count of `228` renamed entries (the baseline total minus the 15
files that stay at the root), and `no deletions - correct`. If any `D` lines appear, the history link is broken — `git reset` and redo with `git mv`.

- [ ] **Step 4: Move the untracked native and generated files**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
[ -d ios ] && mv ios apps/mobile/ios && echo "ios moved"
[ -f expo-env.d.ts ] && mv expo-env.d.ts apps/mobile/expo-env.d.ts && echo "expo-env.d.ts moved"
rm -rf node_modules .expo
ls -a | grep -vE '^\.(git|claude|superpowers)$|^\.\.?$'
```

Expected: `ios moved`, `expo-env.d.ts moved`, and a root listing containing only `AGENTS.md CLAUDE.md LICENSE README.md apps docs package-lock.json yarn.lock .gitignore`.

`apps/mobile/ios` is stale prebuild output — its CocoaPods references point at the old `node_modules` path. It is moved rather than deleted to keep the change reversible; Task 8 records regenerating it as a manual step.

- [ ] **Step 5: Re-anchor the gitignore patterns BEFORE staging anything**

This step is load-bearing. The existing `/ios` and `/android` patterns are root-anchored, so they stopped matching the moment `ios/` moved. `git check-ignore apps/mobile/ios` confirms it is **not** ignored, and the `git add -A` two steps from now would stage **1.2 GB across 9,500 CocoaPods files**. Fix the patterns first.

Apply exactly these changes to `.gitignore`:

```diff
-# generated native folders
-/ios
-/android
+# generated native folders
+apps/mobile/ios/
+apps/mobile/android/
```

Then prove the gap is closed before going near `git add`:

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git check-ignore -q apps/mobile/ios && echo "ios IGNORED - safe to stage" || echo "STOP: still not ignored"
git status --porcelain | grep -c '^?? apps/mobile/ios' || echo "ios not listed as untracked - correct"
```

Expected: `ios IGNORED - safe to stage`, and `ios` absent from the untracked list. Do not continue to the commit until this prints correctly.

- [ ] **Step 6: Rename the mobile package and add the three missing scripts**

Edit `apps/mobile/package.json`. Change the `name` field and insert the new scripts at the top of the `scripts` object. Nothing else in the file changes — dependencies, the whole `jest` block, and all `eas:*` scripts stay byte-identical.

```json
{
  "name": "@cometa/mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit",
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "eas:build:dev": "eas build --profile development",
```

`typecheck` is `tsc --noEmit` rather than `expo lint --tsc` so Turborepo can cache it independently of lint.

- [ ] **Step 7: Confirm no import statement changed**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git diff --cached -- 'apps/mobile/src' | grep -E '^[+-].*from ' || echo "ZERO import changes - correct"
git diff --cached --stat -- 'apps/mobile/src' | tail -1
```

Expected: `ZERO import changes - correct`. The stat line should report `0 insertions(+), 0 deletions(-)` across the renamed files.

- [ ] **Step 8: Commit the move on its own**

Keeping the move in a single commit with no content edits is what makes `git log --follow` work later.

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git add -A
git commit -m "$(cat <<'MSG'
refactor: move Expo app into apps/mobile

Pure file move ahead of the pnpm workspace root. No source file
content changed: the @/* alias stays relative to the app's own
tsconfig, so all imports resolve unchanged.

Renames package to @cometa/mobile and adds dev/lint/typecheck
scripts for Turborepo to call.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

- [ ] **Step 9: Verify history survived the move**

```bash
git log --follow --oneline -- apps/mobile/src/constants/theme.ts | wc -l
```

Expected: a number greater than `1` (the file predates this commit, so `--follow` must find its earlier history).

---

### Task 2: Create the workspace root

**Files:**
- Create: `pnpm-workspace.yaml`, `package.json`, `turbo.json`, `tsconfig.json`
- Modify: `.gitignore` (adds `.turbo/` only — Task 1 Step 5 already re-anchored the native paths)
- Delete: `package-lock.json`, `yarn.lock`

**Interfaces:**
- Consumes: `@cometa/mobile` at `apps/mobile` from Task 1.
- Produces: root scripts `dev`, `build`, `lint`, `typecheck`, `test`, `format`, `format:check`, each delegating to `turbo run <task>`; a root `tsconfig.json` that `packages/*` extend.

- [ ] **Step 1: Create the pnpm workspace definition**

Write `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Starting with pnpm's default isolated node_modules. Expo supports isolated dependencies from SDK 54+. Step 7 is the documented fallback if that fails.

- [ ] **Step 2: Create the root package.json**

Write `package.json`. It carries orchestration and shared tooling only — no application dependencies.

```json
{
  "name": "cometa",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@12.6.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yaml,yml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yaml,yml}\""
  },
  "devDependencies": {
    "prettier": "^3.6.2",
    "turbo": "^2.11.6"
  }
}
```

There is deliberately no `workspaces` field — `pnpm-workspace.yaml` is the single source of truth, and the brief forbids npm/yarn workspaces.

- [ ] **Step 3: Create turbo.json**

Write `turbo.json`. Turborepo 2.x uses `tasks`, not `pipeline`.

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^typecheck"],
      "outputs": ["coverage/**"]
    }
  }
}
```

No `build` task exists in mobile: Expo apps are built by EAS, not by a local bundler step, and inventing `expo export` as "build" would make `pnpm build` slow and fragile for no gain. `turbo run build` therefore succeeds with nothing to do until a package needs compiling.

- [ ] **Step 4: Create the root tsconfig base**

Write `tsconfig.json`. This is a pure base with no `include`, so it never compiles anything itself. Only `packages/*` extend it; mobile keeps `expo/tsconfig.base` per the Global Constraints.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "noEmit": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- [ ] **Step 5: Add Turborepo to the gitignore**

The `/ios` and `/android` re-anchoring already happened in Task 1 Step 5 — it had to, or the move's commit would have staged 1.2 GB of CocoaPods output. Only the Turborepo cache dir is left. Append to `.gitignore`:

```diff
+# turborepo
+.turbo/
```

Then confirm both are in place:

```bash
cd /Users/alopes.dev/Documents/brain/cometa
grep -nE 'apps/mobile/(ios|android)/|\.turbo/' .gitignore
```

Expected: three matching lines.

- [ ] **Step 6: Drop the old lockfiles and install**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git rm -q package-lock.json yarn.lock
pnpm install 2>&1 | tail -30
```

Expected: pnpm resolves two workspace projects (`cometa`, `@cometa/mobile`) and writes `pnpm-lock.yaml`. A Node engine warning about `>=22.13` is expected on Node v20.19.4 — record it, it is pre-existing.

- [ ] **Step 7: If and only if install or a later Expo command fails on module resolution, switch to hoisted**

Do not do this pre-emptively. Only if Step 6, or Task 3, reports an unresolvable module, append to `pnpm-workspace.yaml`:

```yaml
nodeLinker: hoisted
```

Then re-install and note the switch in the final report:

```bash
rm -rf node_modules apps/mobile/node_modules && pnpm install 2>&1 | tail -20
```

Expo's monorepo guide recommends exactly this fallback when isolated dependencies cause build errors.

- [ ] **Step 8: Verify the workspace is wired up**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm ls --depth -1
pnpm --filter @cometa/mobile exec node -e "console.log(require('expo/package.json').version)"
npx turbo --version
```

Expected: both projects listed, Expo version `57.x.x` printed from inside the mobile workspace (proving pnpm linked the app's own dependencies), and a turbo version of `2.11.x`.

- [ ] **Step 9: Commit**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git add -A
git commit -m "$(cat <<'MSG'
build: add pnpm workspace root with Turborepo

Replaces the conflicting package-lock.json and yarn.lock with a
single pnpm-lock.yaml. Root owns orchestration and shared tooling
only; no application dependencies move up.

Re-anchors the /ios and /android gitignore patterns, which stopped
matching once the app moved under apps/mobile.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---

### Task 3: Prove the mobile app is unbroken

This is the task that decides whether the migration is viable. It adds no files — it runs the checks that catch Review Focus items 1, 4 and 5.

**Order matters here.** `app.config.js` sets `experiments.typedRoutes: true`, so `.expo/types/router.d.ts` is generated output that Task 1 Step 4 deleted along with the rest of `.expo/`. Typechecking before regenerating it would fail on route hrefs for a reason that has nothing to do with the move. So: config, then bundle (which regenerates the types), then typecheck, then tests.

**Files:**
- No changes. Verification only.

**Interfaces:**
- Consumes: the installed workspace from Task 2.

- [ ] **Step 1: Verify the Expo config and EAS identity still resolve**

The cheapest check, and it fails fastest if `app.config.js` is in the wrong place.

```bash
cd /Users/alopes.dev/Documents/brain/cometa/apps/mobile
pnpm exec expo config --type public 2>&1 | grep -E 'name|slug|projectId|bundleIdentifier'
```

Expected: `Cometa`, `cometa`, `638c24e1-00a3-4df2-8465-37d85d4ef4c5`, `so.sof.cometa`. Any of these missing or wrong means EAS would build the wrong app — stop and fix before continuing.

- [ ] **Step 2: Prove Metro resolves the whole app inside the monorepo**

This is the real substitute for "mobile starts": `expo start` is interactive, but a successful export runs the same resolver over every reachable module, and regenerates `.expo/types` as a side effect.

```bash
cd /Users/alopes.dev/Documents/brain/cometa/apps/mobile
pnpm exec expo export --platform ios --output-dir /tmp/cometa-export-check 2>&1 | tail -20
```

Expected: a bundle is written and the command exits 0.

If it fails with an unresolved module from `node_modules`, this is Review Focus item 1 — pnpm's isolated layout. Go to Task 2 Step 7, switch to `nodeLinker: hoisted`, reinstall, and re-run this task from Step 1. Record the switch for the final report.

- [ ] **Step 3: Confirm the typed-route types were regenerated**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
ls apps/mobile/.expo/types/
```

Expected: `router.d.ts` present. If it is absent, run `pnpm --filter @cometa/mobile dev` and quit once the bundler reports ready — that also generates it.

- [ ] **Step 4: Typecheck the app in its new location**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm --filter @cometa/mobile typecheck 2>&1 | tail -20
```

Expected: clean exit, no output. The app has never been typechecked by a script before (there was no `typecheck` script), so a pre-existing error is possible — distinguish it from a migration error by checking whether it mentions a path or module resolution. Report pre-existing type errors rather than silencing them with `any` or `@ts-expect-error`.

- [ ] **Step 5: Run the full test suite and count the suites**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm --filter @cometa/mobile test 2>&1 | tail -25
```

Expected: `Test Suites: 48 passed, 48 total`. A count below 48 means Jest's `rootDir` or `testMatch` stopped matching after the move — that is a migration regression (Review Focus item 4) and must be fixed before continuing, not reported as flaky. Use the baseline test count recorded in Task 1 Step 1 rather than the literal 48 if the repository has moved on.

- [ ] **Step 6: Clean up the throwaway export and confirm the repo is clean**

```bash
rm -rf /tmp/cometa-export-check
cd /Users/alopes.dev/Documents/brain/cometa && git status --porcelain
```

Expected: empty output. The export must not have left artifacts inside the repo; if `apps/mobile/dist/` appears, confirm `.gitignore` covers `dist/`.

There is nothing to commit in this task — it is pure verification. Do not proceed to Task 4 until Steps 1, 2, 4 and 5 have all actually been run and passed.

---
### Task 4: Create the four shared packages and prove they resolve

Per the spec's decision 3 these are thin placeholders — no code moves out of mobile. Each exports a single `PACKAGE_NAME` constant so the workspace wiring is *testable* rather than merely declared. That constant is the cheapest possible real export; it exists to be asserted on, and the first genuine shared module replaces it.

**Files:**
- Create: `packages/types/{package.json,tsconfig.json,src/index.ts}`
- Create: `packages/validation/{package.json,tsconfig.json,src/index.ts}`
- Create: `packages/config/{package.json,tsconfig.json,src/index.ts}`
- Create: `packages/utils/{package.json,tsconfig.json,src/index.ts}`
- Test: `apps/mobile/src/workspace-resolution.test.ts`
- Modify: `apps/mobile/package.json` (add four `workspace:*` devDependencies)

**Interfaces:**
- Consumes: root `tsconfig.json` from Task 2 Step 4.
- Produces: `@cometa/types`, `@cometa/validation`, `@cometa/config`, `@cometa/utils`, each exporting `PACKAGE_NAME: string` from its package root, each with a `typecheck` script.

- [ ] **Step 1: Write the failing test first**

Create `apps/mobile/src/workspace-resolution.test.ts`. This test is the permanent guard for Review Focus item 2 — it fails loudly the day pnpm, Metro or Jest stops resolving a workspace package.

```ts
import { PACKAGE_NAME as CONFIG } from '@cometa/config';
import { PACKAGE_NAME as TYPES } from '@cometa/types';
import { PACKAGE_NAME as UTILS } from '@cometa/utils';
import { PACKAGE_NAME as VALIDATION } from '@cometa/validation';

// Guards the monorepo wiring itself: pnpm must link these workspace packages,
// and the Metro/Jest resolver must load their TypeScript source directly.
describe('workspace package resolution', () => {
  it('resolves every shared package from the mobile app', () => {
    expect(TYPES).toBe('@cometa/types');
    expect(VALIDATION).toBe('@cometa/validation');
    expect(CONFIG).toBe('@cometa/config');
    expect(UTILS).toBe('@cometa/utils');
  });
});
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm --filter @cometa/mobile test workspace-resolution 2>&1 | tail -15
```

Expected: FAIL with `Cannot find module '@cometa/config' from 'src/workspace-resolution.test.ts'`. A different error means something else is wrong — diagnose before continuing.

- [ ] **Step 3: Create all four packages**

The four are identical apart from the name. Run this once; it writes twelve files.

```bash
cd /Users/alopes.dev/Documents/brain/cometa
for pkg in types validation config utils; do
  mkdir -p "packages/$pkg/src"
  cat > "packages/$pkg/package.json" <<JSON
{
  "name": "@cometa/$pkg",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "~6.0.3"
  }
}
JSON
  cat > "packages/$pkg/tsconfig.json" <<JSON
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*.ts"]
}
JSON
done
```

No build step and no `dist/`: consumers import the TypeScript source directly, which Metro and `tsc` both handle. Adding a compile step now would be an abstraction with no consumer.

- [ ] **Step 4: Write each package's entry point**

Each file states what the package is reserved for, so the next person does not have to guess the boundary. Create the four files with exactly this content:

`packages/types/src/index.ts`
```ts
/**
 * Shared contracts between apps/mobile and apps/api.
 *
 * Reserved, intentionally empty: there is no API yet, so nothing here has a
 * second consumer. Domain types currently live with their feature in
 * apps/mobile/src/features/*/types.ts and should only move here once both
 * sides genuinely need the same shape. Never export Prisma types or
 * persistence details from this package.
 */
export const PACKAGE_NAME = '@cometa/types';
```

`packages/validation/src/index.ts`
```ts
/**
 * Zod schemas shared between apps/mobile and apps/api.
 *
 * Reserved, intentionally empty. A schema belongs here only when client and
 * server need the identical input contract; backend authorization and
 * business-rule validation stay in the API.
 */
export const PACKAGE_NAME = '@cometa/validation';
```

`packages/config/src/index.ts`
```ts
/**
 * Configuration shared across workspaces.
 *
 * Reserved, intentionally empty. Client-safe values (EXPO_PUBLIC_*) and server
 * values must stay in separate entry points when this is filled in. Never
 * export DATABASE_URL, JWT secrets, or any API secret from this package — it
 * is reachable from the mobile bundle.
 */
export const PACKAGE_NAME = '@cometa/config';
```

`packages/utils/src/index.ts`
```ts
/**
 * Generic, pure utilities with no domain knowledge.
 *
 * Reserved, intentionally empty. Formatting and parsing helpers may move here
 * when a second workspace needs them; feature logic such as cart pricing or
 * modifier selection stays in apps/mobile/src/features.
 */
export const PACKAGE_NAME = '@cometa/utils';
```

- [ ] **Step 5: Declare the packages as mobile devDependencies**

They are devDependencies, not dependencies, because only the test imports them today. Add to `apps/mobile/package.json`:

```json
  "devDependencies": {
    "@cometa/config": "workspace:*",
    "@cometa/types": "workspace:*",
    "@cometa/utils": "workspace:*",
    "@cometa/validation": "workspace:*",
    "@react-native/jest-preset": "^0.86.0",
```

- [ ] **Step 6: Link the new packages**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm install 2>&1 | tail -15
ls -la apps/mobile/node_modules/@cometa/
```

Expected: six workspace projects resolved, and four symlinks in `apps/mobile/node_modules/@cometa/` pointing at `../../../../packages/*`.

- [ ] **Step 7: Run the test and watch it pass**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm --filter @cometa/mobile test workspace-resolution 2>&1 | tail -15
```

Expected: `Tests: 1 passed`.

If it instead fails with a syntax error on the `export const` line, Jest is treating the symlinked package as untransformed `node_modules`. The fix is one addition to the existing `transformIgnorePatterns` in `apps/mobile/package.json` — insert `@cometa/.*|` after the opening `(?!` group — and nothing else.

- [ ] **Step 8: Typecheck the packages and the app together**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm typecheck 2>&1 | tail -20
```

Expected: five `typecheck` tasks run (four packages + mobile), all succeeding. This is the first exercise of Turborepo's `^typecheck` dependency ordering.

- [ ] **Step 9: Commit**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git add -A
git commit -m "$(cat <<'MSG'
feat: add @cometa/{types,validation,config,utils} packages

Thin placeholders establishing the shared-contract boundary. No code
moves out of mobile — each package documents what it is reserved for
and exports only its own name.

That constant is not decoration: apps/mobile/src/workspace-resolution.test.ts
asserts all four load, so pnpm linking and Metro/Jest resolution of
workspace TypeScript source are covered by the test suite rather than
assumed.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---

### Task 5: Reserve `apps/api`, `apps/web` and `infrastructure/`

Each is a real workspace member with a README that says what it is for and why it is empty. The brief asks for these boundaries (sections 9, 21, 22) while also warning against empty architectural layers (section 27); a documented single-file reservation satisfies the first without pretending to satisfy the second.

**Files:**
- Create: `apps/api/{package.json,README.md}`
- Create: `apps/web/{package.json,README.md}`
- Create: `infrastructure/README.md`

**Interfaces:**
- Produces: workspace members `@cometa/api` and `@cometa/web` with no dependencies and no scripts, so `turbo run` skips them cleanly.

- [ ] **Step 1: Create the API reservation**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
mkdir -p apps/api
cat > apps/api/package.json <<'JSON'
{
  "name": "@cometa/api",
  "version": "0.0.0",
  "private": true
}
JSON
cat > apps/api/README.md <<'MD'
# @cometa/api

**Status: reserved. There is no backend code here yet.**

This directory is a workspace slot, not an application. As of the monorepo
migration (2026-10-01) Cometa had no backend of any kind: no Fastify server, no
Prisma schema, no migrations, no database, and no real authentication. The
mobile app runs entirely on mock data in `apps/mobile/src/features/*/mockData.ts`,
and `apps/mobile/src/hooks/AuthProvider.tsx` is a local boolean.

Nothing was invented here, because scaffolding a server nobody designed is worse
than an honest empty slot.

## Intended stack

Node.js, TypeScript, Fastify, Prisma, PostgreSQL (Neon), Zod, JWT with refresh
tokens, Argon2 for password hashing, Redis (Upstash), Cloudflare R2, deployed on
Railway.

## Intended shape

A **modular monolith** — not microservices:

```
apps/api/
├── prisma/            # schema.prisma + migrations live here, nowhere else
└── src/
    ├── modules/       # one directory per domain, each with routes/service/repository/schema
    ├── shared/        # errors, database client, auth primitives, http helpers
    ├── config/
    ├── plugins/
    ├── app.ts
    └── server.ts
```

Modules communicate through each other's public service exports, never by
reaching into a neighbour's internal files.

## Before writing code here

Write a spec first. The domains, the auth flows and the data model are product
decisions that have not been made yet. See
`docs/superpowers/specs/2026-10-01-modular-monorepo-migration-design.md` for the
audit that led to this slot being reserved rather than filled.

Shared request/response contracts belong in `packages/types`, and input schemas
both sides validate belong in `packages/validation`. Server secrets must never
reach `packages/config`'s client-safe surface.
MD
```

- [ ] **Step 2: Create the web reservation**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
mkdir -p apps/web
cat > apps/web/package.json <<'JSON'
{
  "name": "@cometa/web",
  "version": "0.0.0",
  "private": true
}
JSON
cat > apps/web/README.md <<'MD'
# @cometa/web

**Status: reserved. There is no web application here yet.**

This slot exists for the future **Cometa Business** B2B portal (restaurant,
market, pharmacy and store partners managing their catalogue, orders and
payouts). It is intentionally a workspace member with no dependencies: adding
Next.js now would mean installing, upgrading and auditing a framework nobody is
using.

## Intended stack

Next.js, TypeScript, consuming `@cometa/api` over HTTP and sharing contracts via
`@cometa/types` and `@cometa/validation`.

## When this gets built

Scaffold in place with `pnpm create next-app@latest .`, then set `"name":
"@cometa/web"` in the generated `package.json` and add `dev`, `build`, `lint`
and `typecheck` scripts so Turborepo picks it up. Note that Expo and Next.js
must not end up with duplicate React Native versions in one monorepo.
MD
```

- [ ] **Step 3: Create the infrastructure reservation**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
mkdir -p infrastructure
cat > infrastructure/README.md <<'MD'
# Infrastructure

**Status: reserved. Nothing to put here yet.**

At the time of the monorepo migration the repository had no Docker files, no
deployment scripts and no CI/CD configuration, so there was nothing to move in.
Empty `docker/`, `scripts/` and `deployment/` directories were deliberately not
created.

## What belongs here

Repository-level infrastructure only — things that are not owned by a single
app:

- `docker/` — local development services (Postgres, Redis) via docker-compose
- `scripts/` — repo-wide maintenance and release scripts
- `deployment/` — shared deployment configuration

## What does not belong here

- The API's own `Dockerfile`, if Railway needs one. Keep it in `apps/api/` so
  Railway's build context stays simple.
- Mobile build configuration. That is `apps/mobile/eas.json`.
- CI workflows. Those belong in `.github/workflows/` at the repository root.
MD
```

- [ ] **Step 4: Verify the workspace sees eight projects and turbo skips the empty ones**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm install 2>&1 | tail -5
pnpm ls --depth -1
pnpm build 2>&1 | tail -10
```

Expected: eight projects listed (`cometa`, `@cometa/mobile`, `@cometa/api`, `@cometa/web`, and the four packages). `pnpm build` must exit 0 reporting no tasks to run — `apps/api` and `apps/web` have no scripts, so Turborepo skips them without error.

- [ ] **Step 5: Commit**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git add -A
git commit -m "$(cat <<'MSG'
chore: reserve apps/api, apps/web and infrastructure slots

Workspace members with a README each, no code. Documents the intended
stack and, more usefully, why the slot is empty: Cometa has no backend
and no B2B portal yet, and scaffolding either one undesigned would be
worse than an honest reservation.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---

### Task 6: Add lint and format tooling

The repo has no ESLint, Prettier or Biome configuration today, yet the brief requires `pnpm lint` and `pnpm format` to work. ESLint is set up through Expo's own generator so the config matches SDK 57.

**Files:**
- Create: `apps/mobile/eslint.config.js` (generated), `.prettierrc`, `.prettierignore`
- Modify: `apps/mobile/package.json` (ESLint devDependencies added by the generator)

**Interfaces:**
- Consumes: root `prettier` devDependency and `format` scripts from Task 2 Step 2.
- Produces: a working `pnpm lint` at the root.

- [ ] **Step 1: Let Expo generate the ESLint setup**

```bash
cd /Users/alopes.dev/Documents/brain/cometa/apps/mobile
pnpm exec expo lint 2>&1 | tail -30
```

This installs `eslint` and `eslint-config-expo` into `apps/mobile` and writes `eslint.config.js` in flat-config format (the default from SDK 53 onward). It then runs the linter.

- [ ] **Step 2: Confirm the generated config, and only fix it if the generator was skipped**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
cat apps/mobile/eslint.config.js
```

Expected content — if the file is missing, write exactly this:

```js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
```

- [ ] **Step 3: Record the lint baseline honestly**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm lint 2>&1 | tail -40
```

ESLint has never run on this codebase, so pre-existing warnings or errors are likely. Do **not** mass-fix them — that would be the unrequested rewrite the brief forbids. Count them, record the exact numbers for the final report, and fix only errors that are themselves caused by the move (an unresolvable import path, for example). If `pnpm lint` exits non-zero purely on pre-existing findings, say so plainly in the report rather than editing source to force a green result.

- [ ] **Step 4: Add the Prettier configuration**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
cat > .prettierrc <<'JSON'
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
JSON
cat > .prettierignore <<'IGNORE'
node_modules/
.turbo/
.expo/
dist/
coverage/
apps/mobile/ios/
apps/mobile/android/
pnpm-lock.yaml
IGNORE
```

- [ ] **Step 5: Check formatting without changing anything**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm format:check 2>&1 | tail -10
```

This will report many files as unformatted — the existing code mixes single and double quotes (`src/app/_layout.tsx` uses double, `src/hooks/AuthProvider.tsx` uses single), so no config matches it. **Do not run `pnpm format`.** Reformatting ~240 files would bury the migration in noise and contradicts the brief's preserve-don't-rewrite principle. Record the count; Task 8 lists the one-off format run as a decision for the owner.

- [ ] **Step 6: Commit**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git add -A
git commit -m "$(cat <<'MSG'
build: add ESLint and Prettier tooling

ESLint set up via `expo lint` so the flat config matches SDK 57.
Prettier is configured but deliberately not run: formatting 260 files
would bury the migration diff, so the one-off run is left as the
owner's decision.

Pre-existing lint findings are recorded in the migration report, not
silently fixed.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---
### Task 7: Rewrite the documentation for the new architecture

The existing root `README.md` is a mobile-engineering document written in Portuguese, and parts of it are already stale (it claims the app "renders only a minimal screen" and points at `src/app/index.tsx`, but there are now 28 routes). It moves to `apps/mobile/README.md` via `git mv` so its history follows it, and the root gets a new monorepo README.

The project's documentation voice is Portuguese (pt-AO), so both READMEs stay in Portuguese. The section order follows brief section 25.

**Files:**
- Move: `README.md` → `apps/mobile/README.md`
- Create: `README.md` (new root)

**Interfaces:**
- None. Documentation only.

- [ ] **Step 1: Move the existing README to the app it describes**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git mv README.md apps/mobile/README.md
git status --porcelain
```

Expected: a single `R` line. Its stale "Estado atual" and project-structure sections are corrected in Step 3.

- [ ] **Step 2: Write the new root README**

````bash
cd /Users/alopes.dev/Documents/brain/cometa
cat > README.md <<'MD'
# 🪐 Cometa

> O Super App Inteligente de Delivery de Angola.

Monorepo do **Cometa Delivery**. O produto conecta clientes, restaurantes,
mercados, farmácias, lojas e entregadores em Angola, e serve de base para o
futuro Cometa Super App (Ride, Pay, Express, Market, Pharma, Business).

As diretrizes de produto, negócio e design vivem em [`CLAUDE.md`](CLAUDE.md) e
em [`docs/`](docs/). Este README cobre a engenharia: como o repositório está
organizado e como trabalhar nele.

## Arquitetura

Dois princípios, e só dois:

- **Monorepo** — aplicações em `apps/`, contratos compartilhados em `packages/`,
  orquestrados por pnpm workspaces + Turborepo.
- **Monólito modular** — o backend, quando existir, é uma única aplicação com
  módulos de domínio bem delimitados. Não há microsserviços, nem brokers de
  mensagens, nem Kubernetes.

O mobile comunica com a API exclusivamente por HTTP. Ele nunca importa Prisma,
código de base de dados, repositórios ou serviços do backend.

```
                    COMETA
                       │
             ┌─────────┴─────────┐
           MOBILE               API
          Expo / RN        Fastify / Node
             │             (monólito modular)
             └──────── HTTP API ────────┘
                       │
                Contratos partilhados
                       │
          ┌────────────┼────────────┐
        types      validation     utils
```

## Estrutura do repositório

```
cometa/
├── apps/
│   ├── mobile/        # App Expo + React Native (a aplicação real hoje)
│   ├── api/           # RESERVADO — ainda sem código. Ver apps/api/README.md
│   └── web/           # RESERVADO — futuro portal B2B. Ver apps/web/README.md
├── packages/
│   ├── types/         # Contratos partilhados (reservado)
│   ├── validation/    # Schemas Zod partilhados (reservado)
│   ├── config/        # Configuração partilhada (reservado)
│   └── utils/         # Utilitários genéricos (reservado)
├── infrastructure/    # RESERVADO — docker, scripts, deployment
├── docs/              # Especificações, planos e design system
├── package.json       # Raiz do workspace: apenas orquestração
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json      # Base de TypeScript para packages/
```

**Importante:** `apps/api`, `apps/web`, `infrastructure/` e os quatro `packages/*`
estão **reservados e vazios**. Cada um tem um README a explicar o que lá vai e
porque ainda não existe. Não há backend, não há Prisma, não há base de dados — a
app mobile funciona sobre dados mock.

## Aplicações

### Mobile — `@cometa/mobile`

A aplicação real. Expo SDK 57, React Native 0.86, React 19, Expo Router
(file-based, 14 rotas), styled-components, design system próprio e 48 ficheiros
de teste. Detalhes em [`apps/mobile/README.md`](apps/mobile/README.md).

### API — `@cometa/api`

Reservado. Stack prevista: Fastify, Prisma, PostgreSQL (Neon), Zod, JWT com
refresh tokens, Argon2. Ver [`apps/api/README.md`](apps/api/README.md).

### Web — `@cometa/web`

Reservado para o Cometa Business (portal B2B em Next.js). Ver
[`apps/web/README.md`](apps/web/README.md).

## Packages partilhados

| Package | Para que serve | Estado |
|---|---|---|
| `@cometa/types` | Contratos entre mobile e API | Reservado |
| `@cometa/validation` | Schemas Zod que ambos os lados validam | Reservado |
| `@cometa/config` | Configuração partilhada (cliente e servidor separados) | Reservado |
| `@cometa/utils` | Funções puras genéricas | Reservado |

Regras: `types` expõe contratos, nunca tipos do Prisma nem detalhes de
persistência. `config` nunca expõe segredos do servidor — é alcançável pelo
bundle mobile. `utils` é genérico; lógica de domínio (preços do carrinho,
modificadores) fica em `apps/mobile/src/features`.

## Desenvolvimento

### Requisitos

- **Node.js ≥ 22.13** (exigido pelo Expo SDK 57)
- **pnpm 12** — `npm install -g pnpm`
- Para builds nativos: Xcode 26.4+ (iOS 16.4+) ou Android SDK 36

### Instalação

```bash
pnpm install
```

### Variáveis de ambiente

Cada aplicação tem o seu próprio `.env` — nunca um `.env` partilhado na raiz, e
segredos de servidor nunca chegam ao mobile.

**Mobile** (`apps/mobile/.env`, a partir de `apps/mobile/.env.example`):

| Variável | Para quê |
|---|---|
| `EXPO_PUBLIC_MAPBOX_TOKEN` | Token **público** (`pk.…`), usado em runtime para renderizar o mapa |
| `MAPBOX_DOWNLOADS_TOKEN` | Token **secreto** de build, só para descarregar o SDK nativo do Mapbox. Em EAS, usar `eas secret:create` |

Só variáveis `EXPO_PUBLIC_*` são seguras no bundle. Nenhum ficheiro `.env` real
é versionado.

### Comandos na raiz

```bash
pnpm dev          # turbo run dev
pnpm build        # turbo run build
pnpm lint         # turbo run lint
pnpm typecheck    # turbo run typecheck
pnpm test         # turbo run test
pnpm format:check # Prettier em modo verificação
```

### Comandos por aplicação

```bash
pnpm --filter @cometa/mobile dev        # expo start
pnpm --filter @cometa/mobile test
pnpm --filter @cometa/mobile typecheck
pnpm --filter @cometa/mobile lint
```

## Testes

```bash
pnpm test
```

Jest com o preset `jest-expo`, a correr dentro de `apps/mobile`. Inclui
`apps/mobile/src/workspace-resolution.test.ts`, que verifica que os packages do
workspace continuam a resolver — se o monorepo se desconfigurar, esse teste
falha primeiro.

## Build

O mobile não tem passo de build local: aplicações Expo são compiladas pelo EAS.

```bash
pnpm --filter @cometa/mobile eas:build:dev
pnpm --filter @cometa/mobile eas:build:preview
pnpm --filter @cometa/mobile eas:build:prod
pnpm --filter @cometa/mobile eas:update        # OTA
```

Perfis em [`apps/mobile/eas.json`](apps/mobile/eas.json).

## Base de dados

**Não existe.** Não há Prisma, nem migrações, nem PostgreSQL neste repositório.
Quando a API for construída, o Prisma vive em `apps/api/prisma/` e em nenhum
outro lugar:

```bash
pnpm --filter @cometa/api prisma generate
pnpm --filter @cometa/api prisma migrate dev
```

## Deployment

| Alvo | Como |
|---|---|
| Mobile | EAS Build + EAS Update (`apps/mobile/eas.json`) |
| API | Railway (quando existir) |
| Web | A definir (quando existir) |

Não há CI/CD configurado neste repositório.
MD
````

- [ ] **Step 3: Correct the two stale sections in the mobile README**

The moved README has a "Estado atual" section claiming the app is in "fundação do Design System" and renders only `src/app/index.tsx`, plus a project-structure block showing `app.json` and a two-file `src/`. Both are now wrong (there are 14 routes and a full design system). Replace the "Estado atual" body with the real state, and replace the structure block with:

```
apps/mobile/
├── app.config.js          # Configuração do Expo
├── eas.json               # Perfis de build/submit do EAS
├── src/
│   ├── app/               # Rotas (Expo Router) — 14 telas
│   ├── components/
│   │   └── design-system/ # ThemeProvider, atoms, molecules
│   ├── features/          # checkout, home, notifications, rating, tracking
│   ├── hooks/             # Providers de estado (Auth, Cart, CheckoutFlow, …)
│   └── constants/theme.ts # Design tokens
└── assets/
```

Also fix the reference to `app.json` (the project uses `app.config.js`) and note that the app currently runs on mock data with a local-only auth stub. Do not rewrite the rest of the file — the stack table, design-system notes and Mapbox instructions are accurate.

- [ ] **Step 4: Verify every documented command and path is real**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
for p in apps/mobile/README.md apps/api/README.md apps/web/README.md apps/mobile/eas.json CLAUDE.md docs; do
  [ -e "$p" ] && echo "OK   $p" || echo "DEAD $p"
done
grep -o 'pnpm --filter @cometa/[a-z]* [a-z:]*' README.md | sort -u
```

Expected: every path `OK`, and every documented `--filter` command naming a script that exists in that workspace's `package.json`. Fix any `DEAD` link rather than leaving it.

- [ ] **Step 5: Commit**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git add -A
git commit -m "$(cat <<'MSG'
docs: document the monorepo architecture

Root README now describes the workspace; the previous mobile-focused
README moves to apps/mobile/ with its history and has its two stale
sections corrected (it still claimed the app rendered a single screen).

States plainly that apps/api, apps/web, infrastructure and packages/*
are reserved and empty, and that there is no database.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---

### Task 8: Full validation and migration report

Nothing here is optional and nothing here may be summarized from memory. Every command is run, and its real output is pasted into the report.

**Files:**
- Create: `docs/superpowers/plans/2026-10-01-modular-monorepo-migration-report.md`

**Interfaces:**
- Consumes: the completed workspace from Tasks 1–7.

- [ ] **Step 1: Clean-room install**

Proves a fresh clone works, not just this machine's incremental state.

```bash
cd /Users/alopes.dev/Documents/brain/cometa
rm -rf node_modules apps/*/node_modules packages/*/node_modules .turbo
pnpm install 2>&1 | tail -20
```

Expected: eight projects resolved, `pnpm-lock.yaml` unchanged (`git status` must stay clean on it — a changed lockfile here means the install is not reproducible).

- [ ] **Step 2: Run the five required root commands and capture exact output**

Run each one separately and keep the real output. Do not chain them with `&&` — a failure must not hide the commands after it.

```bash
cd /Users/alopes.dev/Documents/brain/cometa
pnpm typecheck 2>&1 | tail -25
pnpm lint 2>&1 | tail -25
pnpm test 2>&1 | tail -25
pnpm build 2>&1 | tail -15
pnpm format:check 2>&1 | tail -5
```

Expected: `typecheck` passes for all five workspaces; `test` reports `Test Suites: 49 passed, 49 total` (48 original + the workspace-resolution test); `build` exits 0 with no tasks. `lint` and `format:check` may report pre-existing findings — record the numbers, do not mass-fix.

- [ ] **Step 3: Re-verify the Expo app end to end**

```bash
cd /Users/alopes.dev/Documents/brain/cometa/apps/mobile
pnpm exec expo config --type public 2>&1 | grep -E 'name|slug|projectId|bundleIdentifier'
pnpm exec expo export --platform ios --output-dir /tmp/cometa-final-check 2>&1 | tail -10
rm -rf /tmp/cometa-final-check
```

Expected: config values match Task 3 Step 1 exactly, and the bundle succeeds.

- [ ] **Step 4: Verify the three safety invariants**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
MIGRATION_BASE=<the base commit recorded in the SDD ledger>
echo "--- no file lost (expect 0 deletions from app source) ---"
git log --oneline --diff-filter=D "$MIGRATION_BASE..HEAD" -- 'apps/mobile/src' | wc -l
echo "--- no import changed ---"
git diff "$MIGRATION_BASE..HEAD" -- 'apps/mobile/src/app' 'apps/mobile/src/features' 'apps/mobile/src/components' 'apps/mobile/src/hooks' | grep -E '^[+-].*from ' || echo "ZERO import changes"
echo "--- no secret committed ---"
git ls-files | grep -E '(^|/)\.env$' || echo "no .env tracked"
git grep -nE 'pk\.ey|sk\.ey|DATABASE_URL=.+|JWT_SECRET=.+' -- ':!*.example' ':!docs/*' || echo "no secrets found"
echo "--- git history intact ---"
git log --oneline | wc -l
git log --follow --oneline -- apps/mobile/src/constants/theme.ts | wc -l
```

Expected: `0` deletions from the app source, `ZERO import changes`, `no .env tracked`, `no secrets found`, a commit count greater than the 5 pre-migration commits, and `--follow` finding history older than the move.

Set `MIGRATION_BASE` to the base commit recorded on the `Base commit:` line of the SDD ledger (`.superpowers/sdd/2026-10-01-modular-monorepo-migration/progress.md`). Use that, never a `HEAD~N` offset — an offset breaks silently if the task count changes, under-reporting exactly the deletions and import changes this step exists to catch.

- [ ] **Step 5: Write the migration report**

Create `docs/superpowers/plans/2026-10-01-modular-monorepo-migration-report.md` with these sections, filled from real output — not from this plan's expectations:

1. Previous architecture (from the spec's audit)
2. New architecture
3. Files and directories moved, with the `git mv` rename count
4. Packages created
5. Dependencies added and removed (`turbo`, `prettier`, `eslint`, `eslint-config-expo` added; `package-lock.json` and `yarn.lock` deleted)
6. Import changes — expected to be **none**; state it with the verifying command
7. TypeScript changes (root base added; mobile unchanged and still on `expo/tsconfig.base`)
8. Expo changes (package renamed, three scripts added, no `metro.config.js`, gitignore re-anchored)
9. Backend changes — **none**, with the reason
10. Prisma changes — **none**
11. Database safety verification — no database, no schema, no migrations existed; no destructive operation was possible
12. Environment variable changes (`.env.example` moved to `apps/mobile/`; no new variables)
13. CI/CD changes — none existed, none invented
14. Commands executed, verbatim
15. Results of install, typecheck, lint, test, build — **paste actual output**, including any failure
16. Remaining manual steps
17. Risks and technical debt discovered

- [ ] **Step 6: List the remaining manual steps in the report**

These are known and deliberately not done:

- **Upgrade Node to ≥ 22.13** (machine has v20.19.4). Pre-existing; Expo SDK 57 requires it.
- **Regenerate the iOS native project**: `apps/mobile/ios` is stale prebuild output whose CocoaPods paths point at the old `node_modules`. Run `cd apps/mobile && npx expo prebuild --clean` with `MAPBOX_DOWNLOADS_TOKEN` set and `~/.netrc` configured, then `pod install`.
- **Decide on the one-off `pnpm format` run.** It reformats ~240 files; worth doing as its own isolated commit, never mixed with feature work.
- **Triage the pre-existing lint findings** recorded in section 15.
- **Remove the debug instrumentation** in `apps/mobile/src/app/_layout.tsx`, which POSTs to a hardcoded LAN address (`192.168.1.146:7778`) on module load and will fail silently off that network.
- **Configure app icons** — `apps/mobile/assets/*.png` is referenced by nothing in `app.config.js`.
- **Fill in `eas.json` submit placeholders** (`REPLACE_WITH_APPLE_ID_EMAIL` and the two others) before the first store submission.
- **Set up CI** if wanted. Nothing existed, so nothing was invented.

- [ ] **Step 7: List the discovered technical debt in the report**

- The four `packages/*` are placeholders with one trivial export each. They are honest but unproven as boundaries until a real shared module lands.
- `AuthProvider` is a local boolean with no persistence, no tokens and no server. Every screen behind it is effectively unauthenticated.
- Every feature reads from `mockData.ts`. There is no data layer and no error or loading states to speak of.
- Prettier is configured but the codebase is unformatted, so `format:check` fails by design until the one-off run happens.
- `pnpm-lock.yaml` is the only lockfile now; anyone still running `npm install` or `yarn` in this repo will produce a broken tree.

- [ ] **Step 8: Commit the report**

```bash
cd /Users/alopes.dev/Documents/brain/cometa
git add -A
git commit -m "$(cat <<'MSG'
docs: add monorepo migration report

Records the validation output verbatim, including pre-existing lint
and formatting findings that were deliberately not fixed, and the
remaining manual steps.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

- [ ] **Step 9: Final acceptance check**

Walk the brief's section 33 checklist against reality and state each item as met, not met, or not applicable with a reason. Items 11–14 of the brief's checklist (database intact, migrations intact, no destructive database operation) are **not applicable**: no database, schema or migrations exist in this repository. Say that explicitly rather than ticking boxes that were never at risk.
