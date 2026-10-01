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
