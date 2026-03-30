# Architecture Outline

## Principles

- Keep Geometry Dash endpoint behavior close to legacy expectations.
- Move dashboard, installer, security, and privileged tooling to modern TypeScript modules.
- Separate installer, schema migration, and legacy data migration into different systems.

## Apps

### core-api

Handles legacy route aliases like `getGJLevels.php` and forwards them into domain services.

### dashboard-web

Hosts the dashboard UI for players, moderators, administrators, and privileged operators.

This app also owns Theme Studio and the live preview surface for standard dashboard themes. Special themes can keep dedicated layout handling where needed.

### installer

Owns first-run setup, locale selection, superadmin bootstrap, and migration from the legacy PHP core.

## Shared packages

### shared

Static metadata, app manifests, and supported platform constants.

This package should also hold the shared theme manifest schema used by Theme Studio, installer defaults, and dashboard rendering.

### i18n

Seed locale registry for installer and dashboard bootstrap.

### permissions

Bootstrap permission definitions and default role mappings.
