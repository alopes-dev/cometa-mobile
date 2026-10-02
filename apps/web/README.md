# @kometa/web

**Status: reserved. There is no web application here yet.**

This slot exists for the future **Kometa Business** B2B portal (restaurant,
market, pharmacy and store partners managing their catalogue, orders and
payouts). It is intentionally a workspace member with no dependencies: adding
Next.js now would mean installing, upgrading and auditing a framework nobody is
using.

## Intended stack

Next.js, TypeScript, consuming `@kometa/api` over HTTP and sharing contracts via
`@kometa/types` and `@kometa/validation`.

## When this gets built

Scaffold in place with `pnpm create next-app@latest .`, then set `"name":
"@kometa/web"` in the generated `package.json` and add `dev`, `build`, `lint`
and `typecheck` scripts so Turborepo picks it up. Note that Expo and Next.js
must not end up with duplicate React Native versions in one monorepo.
