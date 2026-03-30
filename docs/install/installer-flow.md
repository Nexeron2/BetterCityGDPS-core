# Installer Flow

## Goal

The installer should configure a complete working instance without requiring manual file edits.

## Planned Steps

1. Language selection
   - `Русский`
   - `English`
   - `Español`
2. Installation mode
   - fresh install
   - migrate from PHP core
3. Database selection
   - MySQL/MariaDB
   - PostgreSQL
   - SQLite
4. Project identity
   - project name
   - domain
   - timezone
5. Dashboard defaults
   - default theme for new players
   - allow or deny player theme override
   - optional default navigation layout for modern themes
6. Security bootstrap
   - first superadmin
   - privileged password
7. Web server setup
   - Apache2
   - Nginx
   - manual mode
8. Runtime services
   - systemd service generation
   - start and enable services
9. Final checks
   - health endpoints
   - dashboard API
   - dashboard static files
   - legacy route reachability

## Theme Default Requirement

The installer must let the owner choose the dashboard theme that every new player receives after registration.

This should write:

- `projectSettings.defaultTheme`
- `projectSettings.allowUserThemeOverride`

## Output

The installer should end with:

- a valid runtime config
- a created superadmin
- a configured privileged password
- a chosen default player dashboard theme
- a clear next-step summary for browser access and game testing
