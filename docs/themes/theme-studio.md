# Theme Studio

## Goal

Theme Studio defines how dashboard themes are created, stored, previewed, and applied.

The first implementation target is `modern` dashboard themes. Special themes such as `MegaSa1nt` can keep custom layout logic outside the standard builder.

## Scope

Theme Studio should support:

- creating a new theme
- editing an existing theme
- import and export of theme manifests
- live preview in the dashboard
- setting a theme as the instance default
- setting a theme as the default for new player registrations

## Recommended OSS Base

The most practical embedded editor is `JSON Editor`:

- self-hosted
- open source
- schema-driven UI
- easy to adapt to a custom theme manifest

It should be embedded as the editing surface for standard dashboard themes.

## Theme Types

### Modern themes

Use the standard theme schema and Theme Studio editor.

Examples:

- `Minimalistic`
- `Neon Core`
- `City Night`
- `Robotic Steel`
- `Lava Forge`
- `Emerald Control`
- `Solar Light`

### Special themes

May use the same schema as a base, but can require custom layout handling or extra flags.

Examples:

- `MegaSa1nt`
- `Windows`
- `CLI`
- `Geometry Pulse`

## Theme Manifest

Each theme should be stored as a JSON manifest.

Example:

```json
{
  "id": "my-theme",
  "label": "My Theme",
  "author": "Nex",
  "version": 1,
  "category": "custom",
  "mode": "modern",
  "palette": {
    "bg": "#0f1115",
    "surface": "#171a21",
    "surfaceAlt": "#1f2430",
    "text": "#f2f5f7",
    "muted": "#9aa4b2",
    "accent": "#4cc2ff",
    "danger": "#ff5d73",
    "success": "#36d399",
    "warning": "#f6c453"
  },
  "typography": {
    "body": "Inter",
    "mono": "JetBrains Mono",
    "scale": "normal"
  },
  "shape": {
    "radius": 18,
    "borderWidth": 1
  },
  "effects": {
    "shadow": "soft",
    "glow": "low",
    "blur": "medium"
  },
  "layout": {
    "navPosition": "left",
    "navStyle": "sidebar",
    "navCollapse": "expanded",
    "navWidth": 280,
    "topbarHeight": 68,
    "density": "normal",
    "cards": "modern"
  }
}
```

## Required Schema Areas

- `id`
- `label`
- `author`
- `version`
- `category`
- `mode`
- `palette`
- `typography`
- `shape`
- `effects`
- `layout`

## Layout Settings

Theme Studio must support dashboard navigation layout as part of the theme definition.

### Navigation position

Allowed values:

- `top`
- `bottom`
- `left`
- `right`

### Navigation style

Allowed values:

- `sidebar`
- `menubar`
- `dock`

### Navigation collapse

Allowed values:

- `expanded`
- `compact`
- `icons`

### Additional layout controls

- `navWidth`
- `topbarHeight`
- `density`
- `cards`

## Layout Guidance

Recommended defaults:

- `MegaSa1nt`
  - `navPosition: top`
  - `navStyle: menubar`
- `Windows`
  - `navPosition: left`
  - `navStyle: sidebar`
- `CLI`
  - `navPosition: left` or `top`
  - `navStyle: sidebar` or `menubar`
- `Geometry Pulse`
  - `navPosition: left` or `top`

For normal admin UX, `left` and `top` should be the primary supported positions.

`bottom` should be treated as experimental until it has a good desktop workflow.

## API Shape

Theme Studio should eventually use dashboard API endpoints like:

- `GET /dashboard/api/themes`
- `GET /dashboard/api/themes/:id`
- `POST /dashboard/api/themes`
- `PUT /dashboard/api/themes/:id`
- `DELETE /dashboard/api/themes/:id`
- `POST /dashboard/api/themes/:id/apply`
- `POST /dashboard/api/themes/:id/default`

## Storage

Initial storage can be file-based:

- `data/themes/*.json`

Later this can move to SQL storage:

- `dashboard_themes`

## Preview Model

Theme Studio should render:

- form editor on the left
- live dashboard preview on the right
- validation output below

The preview should apply:

- palette tokens
- typography tokens
- component tokens
- navigation position and style

## Installer Integration

The installer should support:

- choosing the default player theme
- deciding whether players can override their assigned theme

This should write:

- `projectSettings.defaultTheme`
- `projectSettings.allowUserThemeOverride`

## Documentation Follow-up

Later documentation should also be provided in:

- Russian
- Spanish
