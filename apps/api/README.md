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
