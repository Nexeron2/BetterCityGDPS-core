# Dashboard Legacy Gap List

## Implemented (parity or replacement)
- Geometry Dash account login/register for dashboard
- Core legacy-like navigation groups and pages
- Player profile/messenger/account blocks
- Levels/Songs/Clans browse views
- Live Control / Moderation queue / Event Studio / Content Hub
- Moderator tools:
  - resolve report
  - hide level
  - add vault code
  - ban account (new)
- Statistics suite (public + staff modes)
- Integrations visibility (public/staff split)
- Theme system and locale switch

## Partially implemented
- Moderator toolset is still narrower than legacy panel
  - has core actions, but not full old control surface
- Upload hub supports song + linked song
  - SFX and transfer operations are still stubs/placeholder actions
- Files/DB admin are represented in UX but not enabled as privileged runtime tools

## Missing vs legacy dashboard (high priority)
- Moderator actions parity:
  - unban account
  - grant/remove moderator role with priority
  - forced rename/password reset for player account
  - creator points share action
- Content operations parity:
  - map-pack create/manage/edit
  - gauntlet create/manage/edit
  - level list moderation actions
  - disabled songs/SFX moderation views and toggles
- Song/SFX parity:
  - SFX upload/manage endpoints
  - rename/delete/manage song actions parity
- Automation parity:
  - automod rule CRUD (real rules, not summary only)
  - cron control actions parity
- Stats parity:
  - full mod actions history
  - top24h and extra legacy leaderboard snapshots

## Security-sensitive features intentionally gated (not MVP default)
- dashboard file editor runtime writes
- DB admin runtime launch
- core auto-update pipeline
- plugin runtime system

## Next execution order
1. Mod action parity: unban + role grant/remove + force account change
2. Content parity: map packs + gauntlets management actions
3. Song/SFX parity endpoints and UI actions
4. Automod CRUD and cron control actions
5. Extended statistics parity
