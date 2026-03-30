# Better City GDPS Core

TypeScript-first GDPS core with legacy `.php` endpoint compatibility, a modern dashboard, installer, and migration tooling for the provided PHP core.

## Workspace layout

- `apps/core-api` - legacy-compatible GDPS API surface
- `apps/dashboard-web` - dashboard frontend
- `apps/installer` - first-run installer and legacy migration wizard
- `packages/shared` - shared constants and app metadata
- `packages/i18n` - bootstrap localization resources
- `packages/permissions` - permission model seeds
- `php-core-src` - extracted legacy PHP reference core

## Current status

This repository currently contains the initial monorepo scaffold and a runnable `core-api` foundation with healthchecks, legacy route mapping, and placeholder GDPS endpoint responses.

## Core API quick start

1. Install dependencies:
   - `npm install`
2. Build the project:
   - `npm run build`
3. Start the core API:
   - `npm run start --workspace @better-city/core-api`

## Default runtime endpoints

- `/healthz` - service health JSON
- `/__legacy-routes` - route coverage summary JSON
- legacy `.php` routes such as `/getGJLevels.php` - currently return `-1` with diagnostic headers

## Environment

Copy `.env.example` and adjust if needed:

- `CORE_API_HOST`
- `CORE_API_PORT`
- `CORE_API_PROJECT_NAME`
- `CORE_API_LOG_LEGACY_REQUESTS`
- `NODE_ENV`

## Installation Docs

- Manual install: [docs/install/manual.md](/F:/City%20GDPS%20Core/docs/install/manual.md)
- Installer flow: [docs/install/installer-flow.md](/F:/City%20GDPS%20Core/docs/install/installer-flow.md)
- Theme Studio: [docs/themes/theme-studio.md](/F:/City%20GDPS%20Core/docs/themes/theme-studio.md)

