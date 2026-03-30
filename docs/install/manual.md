# Manual Installation

## Scope

This guide covers manual deployment of Better City GDPS Core without the installer wizard.

## Requirements

- Node.js 18+
- npm 9+
- One supported database target:
  - MySQL or MariaDB
  - PostgreSQL
  - SQLite
- A web server:
  - Apache2
  - Nginx
  - or a custom reverse proxy

## Workspace Setup

1. Clone or upload the repository to the target server.
2. Create the runtime environment file from `.env.example`.
3. Install dependencies:

```bash
npm install
```

4. Build the workspace:

```bash
npm run build
```

## Core Services

Start the game core:

```bash
npm run start --workspace @better-city/core-api
```

Start the dashboard API:

```bash
npm run start --workspace @better-city/dashboard-api
```

Generate static dashboard files:

```bash
npm run build --workspace @better-city/dashboard-web
```

## Dashboard Defaults

The system supports a dashboard theme default for new player registrations.

Recommended initial settings:

- `projectName`: your GDPS name
- `defaultTheme`: the theme new players receive after registration
- `allowUserThemeOverride`: whether players can switch themes later

Suggested first-run default:

- `defaultTheme=neon-core`
- `allowUserThemeOverride=true`

If you want a legacy-style first impression, use:

- `defaultTheme=megasa1nt`

## Web Server Routing

Recommended public layout:

- `80` for HTTP
- `443` for HTTPS
- internal Node services on private ports only

Suggested routing:

- `/` or GDPS game routes -> `core-api`
- `/dashboard/` -> static dashboard files
- `/dashboard/api/` -> `dashboard-api`

Do not expose internal Node ports directly in the final production setup.

## systemd

For Linux deployments, create separate services for:

- `core-api`
- `dashboard-api`
- optional workers later

Each service should use:

- `WorkingDirectory`
- `EnvironmentFile`
- `Restart=on-failure`

## First Admin

Manual installation must also bootstrap:

- the first superadmin account
- the privileged password for dangerous tools
- the project name
- the dashboard default theme

## Migration From PHP Core

If you are migrating from the provided PHP core, do not overwrite the old database directly.

Preferred flow:

1. Create the new runtime environment.
2. Start the new core on a separate path or domain.
3. Run the future migration/import tool against the legacy database.
4. Verify accounts, levels, songs, stats, and dashboard access.
5. Switch traffic only after validation.

## Troubleshooting

- If dashboard login works but UI pages do not load, check `/dashboard/api/info`.
- If GDPS endpoints respond but account actions fail, verify account URL routing and reverse proxy rules.
- If the dashboard uses the wrong theme for new users, check stored `projectSettings.defaultTheme`.
- If players cannot change themes, check `projectSettings.allowUserThemeOverride`.
