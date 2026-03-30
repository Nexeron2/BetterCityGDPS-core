import type { SupportedLocale } from "@better-city/shared";
import { dashboardLocales } from "@better-city/i18n";
import { dashboardGroups, dashboardThemes, wowFeatures, type DashboardTheme, type DashboardGroup, type WowFeature } from "./content";

export const localeLabels = new Map<SupportedLocale, string>(dashboardLocales.map((locale) => [locale.code, locale.label]));

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function wowGrid(items: WowFeature[]): string {
  return items.map((item, index) => `
    <article class="wow-card">
      <span class="wow-kicker">${escapeHtml(item.kicker)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p data-wow-description="${index}">${escapeHtml(item.description)}</p>
    </article>
  `).join("");
}

export function themeCards(items: DashboardTheme[]): string {
  return items.map((theme) => `
    <article class="theme-card theme-card-${theme.id}" data-theme-card="${theme.id}">
      <div class="theme-preview" style="background:${theme.palette.bg}; border-color:${theme.palette.border}; box-shadow: inset 0 0 0 1px ${theme.palette.border};">
        <span style="background:${theme.palette.panel}; color:${theme.palette.text}"></span>
        <span style="background:${theme.palette.accent}; color:${theme.palette.text}"></span>
        <span style="background:${theme.palette.panelAlt}; color:${theme.palette.text}"></span>
      </div>
      <div class="theme-copy">
        <div class="theme-heading">
          <h3>${escapeHtml(theme.label)}</h3>
          <span>${escapeHtml(theme.category)}</span>
        </div>
        <p>${escapeHtml(theme.description)}</p>
        <div class="theme-personality">
          <strong>${escapeHtml(theme.personality)}</strong>
          <small>${escapeHtml(theme.preview)}</small>
        </div>
        <div class="mini-stack">${theme.cues.map((cue) => `<span class="chip">${escapeHtml(cue)}</span>`).join("")}</div>
        <button type="button" class="ghost-button" data-theme-switch="${theme.id}" data-theme-apply="${theme.id}">Apply ${escapeHtml(theme.label)}</button>
      </div>
    </article>
  `).join("");
}

export function navGroups(groups: DashboardGroup[]): string {
  return groups.map((group) => `
    <section class="nav-group" data-nav-group="${escapeHtml(group.title)}">
      <p class="nav-title" data-group-title="${escapeHtml(group.title)}">${escapeHtml(group.title)}</p>
      ${group.sections.map((section) => `
        <button type="button" class="nav-link${section.id === "home" ? " active" : ""}" data-page-trigger="${section.id}">
          <span class="nav-icon">${escapeHtml(section.icon)}</span>
          <span class="nav-copy">
            <strong data-nav-label="${section.id}">${escapeHtml(section.label)}</strong>
            <small data-nav-description="${section.id}">${escapeHtml(section.description)}</small>
          </span>
          ${section.badge ? `<span class="nav-badge">${escapeHtml(section.badge)}</span>` : ""}
        </button>
      `).join("")}
    </section>
  `).join("");
}

function homeSection(): string {
  return `
    <section class="page-section active" data-page="home">
      <section class="megasaint-home" data-megasaint-home>
        <div class="megasaint-hero">
          <h1 class="megasaint-title">Здравствуй, <span data-user-name>Nex</span>!</h1>
          <p class="megasaint-subtitle">Добро пожаловать на GDPS!</p>
          <h2 class="megasaint-question">Чем вы сегодня будете заниматься?</h2>
        </div>
        <div class="megasaint-columns">
          <article class="megasaint-column">
            <h3>Игра</h3>
            <button type="button" class="megasaint-card" data-page-trigger="browse-levels"><span class="megasaint-card-icon">◈</span><span><strong>Уровни</strong><small>Посмотреть список уровней</small></span></button>
            <button type="button" class="megasaint-card" data-page-trigger="browse-songs"><span class="megasaint-card-icon">♫</span><span><strong>Песни</strong><small>Посмотреть список песен</small></span></button>
            <button type="button" class="megasaint-card" data-page-trigger="browse-clans"><span class="megasaint-card-icon">◍</span><span><strong>Кланы</strong><small>Посмотреть список кланов</small></span></button>
          </article>
          <article class="megasaint-column">
            <h3>Аккаунт</h3>
            <button type="button" class="megasaint-card" data-page-trigger="profile"><span class="megasaint-card-icon">⌘</span><span><strong>Ваш профиль</strong><small>Посмотреть ваш профиль</small></span></button>
            <button type="button" class="megasaint-card" data-page-trigger="messenger"><span class="megasaint-card-icon">◔</span><span><strong>Мессенджер</strong><small>Зайти в мессенджер</small></span></button>
            <button type="button" class="megasaint-card" data-page-trigger="upload-songs"><span class="megasaint-card-icon">♪</span><span><strong>Добавить песню</strong><small>Добавить песню на сервер</small></span></button>
          </article>
        </div>
      </section>
      <div class="hero-grid">
        <article class="hero-card hero-primary">
          <span class="eyebrow" data-i18n="home.hero.eyebrow">GDPS control deck</span>
          <h1 data-i18n="home.hero.title">Dashboard for modern GDPS operations</h1>
          <p data-i18n="home.hero.copy">Live ops, moderation, events, themes, and security tools for your GDPS control stack.</p>
          <div class="hero-actions">
            <button type="button" class="solid-button" data-page-trigger="live-control" data-i18n="home.hero.liveButton">Open live center</button>
            <button type="button" class="ghost-button" data-page-trigger="themes" data-i18n="home.hero.themeButton">Browse themes</button>
          </div>
        </article>
      </div>
      <div class="metrics-grid" data-overview-metrics>
        <article class="metric-card tone-accent"><span class="metric-label" data-i18n="home.metrics.loadingLabel">Loading</span><strong class="metric-value">...</strong><span class="metric-delta" data-i18n="home.metrics.loadingDelta">Fetching overview</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="home.wow.eyebrow">Operations</span>
              <h2 data-i18n="home.wow.title">Key systems</h2>
            </div>
            <span class="chip" data-i18n="home.wow.phase">Active modules</span>
          </div>
          <div class="wow-grid">${wowGrid(wowFeatures)}</div>
        </article>
        <article class="panel-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="home.feed.eyebrow">Realtime feed</span>
              <h2 data-i18n="home.feed.title">Latest events</h2>
            </div>
            <span class="chip live" data-i18n="home.feed.status">online</span>
          </div>
          <div class="activity-stack" data-live-feed>
            <article class="activity-card tone-accent"><div><strong data-i18n="home.feed.loadingTitle">Loading live feed</strong><p data-i18n="home.feed.loadingCopy">Waiting for dashboard-api.</p></div><span class="pill tone-accent">BOOT</span></article>
          </div>
        </article>
      </div>
      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card span-2">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="home.latest.eyebrow">Latest content</span>
              <h2 data-i18n="home.latest.title">Fresh levels</h2>
            </div>
          </div>
          <div class="activity-stack" data-latest-levels>
            <article class="activity-card tone-success"><div><strong data-i18n="home.latest.loadingTitle">Loading levels</strong><p data-i18n="home.latest.loadingCopy">Waiting for dashboard-api.</p></div><span class="pill tone-success">SYNC</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="home.security.eyebrow">Security radar</span>
              <h2 data-i18n="home.security.title">Suspicious signals</h2>
            </div>
          </div>
          <div class="mini-stack" data-suspicious-signals>
            <span class="chip" data-i18n="home.security.loading">loading</span>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="settings.defaults.eyebrow">Player defaults</span>
              <h3 data-i18n="settings.defaults.title">Theme defaults</h3>
            </div>
          </div>
          <div class="settings-grid compact">
            <label class="field settings-field">
              <span class="auth-label" data-i18n="settings.defaults.themeLabel">Default player theme</span>
              <select data-settings-default-theme>
                ${dashboardThemes.map((theme) => `<option value="${theme.id}">${escapeHtml(theme.label)}</option>`).join("")}
              </select>
            </label>
            <label class="field settings-checkbox">
              <span class="auth-label" data-i18n="settings.defaults.allowLabel">Allow players to override theme</span>
              <input type="checkbox" data-settings-allow-theme-override checked />
            </label>
            <div class="settings-actions stacked">
              <button type="button" class="ghost-button" data-settings-save-defaults data-i18n="settings.defaults.save">Save player defaults</button>
              <span class="settings-status" data-settings-defaults-status data-i18n="settings.defaults.note">New registrations will receive this dashboard theme by default.</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  `;
}
function liveControlSection(): string {
  return     `
    <section class="page-section" data-page="live-control">
      <div class="section-header">
        <div>
          <span class="eyebrow">Realtime ops</span>
          <h2>Live Control Center</h2>
        </div>
        <p>Online activity, report pressure, fresh levels, and feed events from the live GDPS runtime.</p>
      </div>
      <div class="metrics-grid" data-live-control-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching live control</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Ops event stream</span>
              <h2>Live feed</h2>
            </div>
          </div>
          <div class="activity-stack" data-live-control-feed>
            <article class="activity-card tone-accent"><div><strong>Loading feed</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">BOOT</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Incoming</span>
              <h2>Latest reports</h2>
            </div>
          </div>
          <div class="activity-stack" data-live-control-reports>
            <article class="activity-card tone-warning"><div><strong>Loading reports</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">QUEUE</span></article>
          </div>
        </article>
      </div>
    </section>
  `;
}

function player360Section(): string {
  return     `
    <section class="page-section" data-page="player-360">
      <div class="section-header">
        <div>
          <span class="eyebrow">Unified player card</span>
          <h2>Player 360</h2>
        </div>
        <p>Search by username or account id to inspect public stats, levels, comments, and account activity.</p>
      </div>
      <div class="content-grid solo">
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Access mode</span>
              <h3>Visibility surface</h3>
            </div>
          </div>
          <div class="mini-stack" data-player-360-visibility>
            <span class="chip">Public profile mode</span>
            <span class="chip">Private messages only for self or staff</span>
          </div>
        </article>
        <article class="panel-card span-2">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Lookup</span>
              <h3>Find player</h3>
            </div>
          </div>
          <div class="settings-grid">
            <div class="settings-actions">
              <label class="field settings-field grow-field">
                <span class="auth-label">Username or account id</span>
                <input type="text" data-player-search-input placeholder="CityBot or 1" />
              </label>
              <button type="button" class="solid-button" data-player-search-button>Load player</button>
            </div>
            <span class="settings-status" data-player-search-status>Ready to search.</span>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Quick picks</span>
              <h3>Player list</h3>
            </div>
          </div>
          <div class="activity-stack" data-player-list>
            <article class="activity-card tone-accent"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">LIST</span></article>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card span-2">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Player snapshot</span>
              <h2 data-player-360-title>No player selected</h2>
            </div>
          </div>
          <div class="metrics-grid metrics-grid-two" data-player-360-metrics>
            <article class="metric-card tone-accent"><span class="metric-label">Stars</span><strong class="metric-value">-</strong><span class="metric-delta">Load player</span></article>
          </div>
        </article>
        <article class="panel-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Recent levels</span>
              <h2>Level activity</h2>
            </div>
          </div>
          <div class="activity-stack" data-player-360-levels>
            <article class="activity-card tone-accent"><div><strong>No player data</strong><p>Select a player to inspect levels.</p></div><span class="pill tone-accent">IDLE</span></article>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Messages</span><h2>Inbox timeline</h2></div></div>
          <div class="activity-stack" data-player-360-messages>
            <article class="activity-card tone-accent"><div><strong>No player data</strong><p>Select a player to inspect messages.</p></div><span class="pill tone-accent">MSG</span></article>
          </div>
        </article>
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Comments</span><h2>Comment timeline</h2></div></div>
          <div class="activity-stack" data-player-360-comments>
            <article class="activity-card tone-accent"><div><strong>No player data</strong><p>Select a player to inspect comments.</p></div><span class="pill tone-accent">COM</span></article>
          </div>
        </article>
      </div>
    </section>
  `;
}
function moderationSection(): string {
  return     `
    <section class="page-section" data-page="moderation">
      <div class="section-header">
        <div>
          <span class="eyebrow">Queue actions</span>
          <h2>Moderation Workspace</h2>
        </div>
        <p>Reports queue, suggested actions, and moderation workspace.</p>
      </div>
      <div class="content-grid solo">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Queue</span><h3>Pending reports</h3></div></div>
          <div class="activity-stack" data-moderation-queue>
            <article class="activity-card tone-warning"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">QUEUE</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Summary</span><h3>Review pressure</h3></div></div>
          <div class="mini-stack" data-moderation-summary>
            <span class="chip">loading</span>
          </div>
        </article>
      </div>
    </section>
  `;
}

function eventsSection(): string {
  return     `
    <section class="page-section" data-page="events">
      <div class="section-header">
        <div>
          <span class="eyebrow">Season control</span>
          <h2>Event Studio</h2>
        </div>
        <p>Daily, Weekly, event rotations, quests, and reward codes from the current core state.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-events-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching event studio</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Active features</span><h3>Daily / weekly / event slots</h3></div></div>
          <div class="activity-stack" data-events-features>
            <article class="activity-card tone-accent"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">EVT</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Vault</span><h3>Reward codes</h3></div></div>
          <div class="activity-stack" data-events-vault>
            <article class="activity-card tone-warning"><div><strong>Loading feed</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">CODE</span></article>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Quest templates</span><h3>Quest rotation</h3></div></div>
          <div class="activity-stack" data-events-quests>
            <article class="activity-card tone-accent"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">QST</span></article>
          </div>
        </article>
      </div>
    </section>
  `;
}

function contentSection(): string {
  return     `
    <section class="page-section" data-page="content">
      <div class="section-header">
        <div>
          <span class="eyebrow">Content flow</span>
          <h2>Content Hub</h2>
        </div>
        <p>Latest levels, comments, messages, and project announcements from current data.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-content-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching content hub</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Latest levels</span><h3>Incoming content</h3></div></div>
          <div class="activity-stack" data-content-levels>
            <article class="activity-card tone-success"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-success">LVL</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Announcements</span><h3>Hub notes</h3></div></div>
          <div class="activity-stack" data-content-announcements>
            <article class="activity-card tone-warning"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">NOTE</span></article>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Comments</span><h3>Recent comments</h3></div></div>
          <div class="activity-stack" data-content-comments>
            <article class="activity-card tone-accent"><div><strong>Loading comments</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">COM</span></article>
          </div>
        </article>
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Messages</span><h3>Recent messages</h3></div></div>
          <div class="activity-stack" data-content-messages>
            <article class="activity-card tone-accent"><div><strong>Loading messages</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">MSG</span></article>
          </div>
        </article>
      </div>
    </section>
  `;
}

function securitySection(): string {
  return `
    <section class="page-section" data-page="security">
      <div class="section-header">
        <div>
          <span class="eyebrow">Security posture</span>
          <h2>Security Center</h2>
        </div>
        <p>Current safety summary for rate limits, suspicious signals, login volume, backups, and privileged access posture.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-security-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching security summary</span></article>
      </div>
      <div class="content-grid solo">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Control state</span><h3>Security signals</h3></div></div>
          <div class="mini-stack" data-security-signals>
            <span class="chip">loading</span>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Privileged access</span><h3>Operator posture</h3></div></div>
          <div class="activity-stack" data-security-posture>
            <article class="activity-card tone-accent"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">SEC</span></article>
          </div>
        </article>
      </div>
    </section>
  `;
}

function themesSection(): string {
  return `
    <section class="page-section" data-page="themes">
      <div class="section-header">
        <div>
          <span class="eyebrow" data-i18n="themes.eyebrow">Visual system</span>
          <h2 data-i18n="themes.title">Theme gallery</h2>
        </div>
        <p data-i18n="themes.copy">Preset themes, per-user overrides, and the base for custom uploaded theme packs.</p>
      </div>
      <div class="content-grid" style="margin-bottom:18px;">
        <article class="panel-card span-2 theme-spotlight" data-theme-spotlight>
          <div class="panel-head">
            <div>
              <span class="eyebrow">Theme profile</span>
              <h2 data-theme-spotlight-title>Classic</h2>
            </div>
            <span class="chip" data-theme-spotlight-category>Classic</span>
          </div>
          <p data-theme-spotlight-description>A classic legacy-inspired dashboard theme.</p>
          <div class="theme-spotlight-cues" data-theme-spotlight-cues></div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow">Style guide</span>
              <h3>Design references</h3>
            </div>
          </div>
          <ul class="detail-list compact">
            <li>Classic: A classic legacy-inspired dashboard theme.</li>
            <li>Windows: Windows 11 glass and system feel.</li>
            <li>CLI: text-window terminal style.</li>
            <li>Geometry Pulse: Geometry Dash-inspired energy.</li>
          </ul>
        </article>
      </div>
      <div class="theme-grid">${themeCards(dashboardThemes)}</div>
    </section>
  `;
}

function integrationsSection(): string {
  return     `
    <section class="page-section" data-page="integrations">
      <div class="section-header">
        <div>
          <span class="eyebrow">External links</span>
          <h2>Integrations</h2>
        </div>
        <p>Public integration info for players, with a deeper staff view for connected services and operator controls.</p>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Telegram</span><h3>Bot profile</h3></div></div>
          <div class="activity-stack" data-integrations-telegram>
            <article class="activity-card tone-accent"><div><strong>Loading Telegram</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">TG</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Discord</span><h3>Bot links</h3></div></div>
          <div class="activity-stack" data-integrations-discord>
            <article class="activity-card tone-accent"><div><strong>Loading Discord</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">DC</span></article>
          </div>
        </article>
      </div>
      <div class="content-grid solo" style="margin-top:18px;">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Visibility</span><h3>Public integration surface</h3></div></div>
          <div class="mini-stack" data-integrations-visibility><span class="chip">loading</span></div>
        </article>
      </div>
    </section>
  `;
}

function settingsSection(): string {
  return `
    <section class="page-section" data-page="settings">
      <div class="section-header">
        <div>
          <span class="eyebrow" data-i18n="settings.eyebrow">Project settings</span>
          <h2 data-i18n="settings.title">Project settings</h2>
        </div>
        <p data-i18n="settings.copy">Project identity, dashboard defaults, and owner-facing control over the visible project name.</p>
      </div>
      <div class="content-grid solo">
        <article class="panel-card span-2">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="settings.project.eyebrow">Identity</span>
              <h3 data-i18n="settings.project.title">Project name</h3>
            </div>
            <span class="chip" data-settings-role>owner / admin</span>
          </div>
          <div class="settings-grid">
            <label class="field settings-field">
              <span class="auth-label" data-i18n="settings.project.label">Displayed project name</span>
              <input type="text" data-settings-project-name maxlength="64" placeholder="GDPS Project" />
            </label>
            <div class="settings-actions">
              <button type="button" class="solid-button" data-settings-save-project data-i18n="settings.project.save">Save project name</button>
              <span class="settings-status" data-settings-project-status data-i18n="settings.project.statusIdle">Waiting for changes.</span>
            </div>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="settings.visual.eyebrow">Visual defaults</span>
              <h3 data-i18n="settings.visual.title">Theme preview</h3>
            </div>
          </div>
          <div class="settings-grid compact">
            <label class="field settings-field">
              <span class="auth-label" data-i18n="settings.visual.themeLabel">Active theme</span>
              <select data-settings-theme-select>
                ${dashboardThemes.map((theme) => `<option value="${theme.id}">${escapeHtml(theme.label)}</option>`).join("")}
              </select>
            </label>
            <div class="settings-actions stacked">
              <button type="button" class="ghost-button" data-settings-apply-theme data-i18n="settings.visual.apply">Apply local preview</button>
              <span class="settings-status" data-settings-theme-status data-i18n="settings.visual.note">Theme selection is saved locally for now.</span>
            </div>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="settings.defaults.eyebrow">Player defaults</span>
              <h3 data-i18n="settings.defaults.title">Theme defaults</h3>
            </div>
          </div>
          <div class="settings-grid compact">
            <label class="field settings-field">
              <span class="auth-label" data-i18n="settings.defaults.themeLabel">Default player theme</span>
              <select data-settings-default-theme>
                ${dashboardThemes.map((theme) => `<option value="${theme.id}">${escapeHtml(theme.label)}</option>`).join("")}
              </select>
            </label>
            <label class="field settings-checkbox">
              <span class="auth-label" data-i18n="settings.defaults.allowLabel">Allow players to override theme</span>
              <input type="checkbox" data-settings-allow-theme-override checked />
            </label>
            <div class="settings-actions stacked">
              <button type="button" class="ghost-button" data-settings-save-defaults data-i18n="settings.defaults.save">Save player defaults</button>
              <span class="settings-status" data-settings-defaults-status data-i18n="settings.defaults.note">New registrations will receive this dashboard theme by default.</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  `;
}

function accountManageSection(): string {
  return     `
    <section class="page-section" data-page="account-manage">
      <div class="section-header">
        <div>
          <span class="eyebrow">Account tools</span>
          <h2>Account management</h2>
        </div>
        <p>Password, nickname, privacy states, linked profiles, and your account-owned dashboard content.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-account-manage-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching account tools</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Privacy</span><h3>Account state</h3></div></div>
          <div class="mini-stack" data-account-manage-privacy><span class="chip">loading</span></div>
          <div class="activity-stack" data-account-manage-levels style="margin-top:18px;">
            <article class="activity-card tone-accent"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">LVL</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Links</span><h3>Connected profiles</h3></div></div>
          <div class="mini-stack" data-account-manage-social><span class="chip">loading</span></div>
        </article>
      </div>
    </section>
  `;
}

function browseLevelsSection(): string {
  return     `
    <section class="page-section" data-page="browse-levels">
      <div class="section-header">
        <div>
          <span class="eyebrow">Browse</span>
          <h2>Levels</h2>
        </div>
        <p>Latest uploaded levels, rated content, featured picks, and a quick runtime overview of the level catalog.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-browse-levels-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching levels</span></article>
      </div>
      <div class="content-grid solo">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Catalog</span><h3>Recent levels</h3></div></div>
          <div class="activity-stack" data-browse-levels-list>
            <article class="activity-card tone-success"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-success">LVL</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Slices</span><h3>Catalog split</h3></div></div>
          <div class="mini-stack" data-browse-levels-slices><span class="chip">loading</span></div>
        </article>
      </div>
    </section>
  `;
}

function browseSongsSection(): string {
  return     `
    <section class="page-section" data-page="browse-songs">
      <div class="section-header">
        <div>
          <span class="eyebrow">Browse</span>
          <h2>Songs</h2>
        </div>
        <p>Uploaded songs, author distribution, and a simple browser for the song catalog already known to the core.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-browse-songs-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching songs</span></article>
      </div>
      <div class="content-grid solo">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Catalog</span><h3>Known songs</h3></div></div>
          <div class="activity-stack" data-browse-songs-list>
            <article class="activity-card tone-accent"><div><strong>Loading songs</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">SG</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Artists</span><h3>Song summary</h3></div></div>
          <div class="mini-stack" data-browse-songs-slices><span class="chip">loading</span></div>
        </article>
      </div>
    </section>
  `;
}
function profileSection(): string {
  return     `
    <section class="page-section" data-page="profile">
      <div class="section-header">
        <div>
          <span class="eyebrow">Player profile</span>
          <h2>Your profile</h2>
        </div>
        <p>Your GDPS account snapshot, public stats, social links, and recently updated content.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-profile-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching profile</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Identity</span><h3>Account profile</h3></div></div>
          <div class="mini-stack" data-profile-identity><span class="chip">loading</span></div>
          <div class="activity-stack" data-profile-levels style="margin-top:18px;">
            <article class="activity-card tone-accent"><div><strong>Loading players</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">LVL</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Social</span><h3>Connected links</h3></div></div>
          <div class="mini-stack" data-profile-social><span class="chip">loading</span></div>
        </article>
      </div>
    </section>
  `;
}

function messengerSection(): string {
  return     `
    <section class="page-section" data-page="messenger">
      <div class="section-header">
        <div>
          <span class="eyebrow">Messages</span>
          <h2>Messenger</h2>
        </div>
        <p>Inbox and outbox activity for the current GDPS account, ready for later compose and moderation actions.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-messenger-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching messages</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Inbox</span><h3>Incoming messages</h3></div></div>
          <div class="activity-stack" data-messenger-inbox>
            <article class="activity-card tone-accent"><div><strong>Loading inbox</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">IN</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Outbox</span><h3>Sent messages</h3></div></div>
          <div class="activity-stack" data-messenger-outbox>
            <article class="activity-card tone-warning"><div><strong>Loading outbox</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">OUT</span></article>
          </div>
        </article>
      </div>
    </section>
  `;
}

function browseClansSection(): string {
  return     `
    <section class="page-section" data-page="browse-clans">
      <div class="section-header">
        <div>
          <span class="eyebrow">Browse</span>
          <h2>Clans</h2>
        </div>
        <p>Community grouping overview built from active creators and their content footprint in the current core data.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-browse-clans-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching clans</span></article>
      </div>
      <div class="content-grid solo">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Catalog</span><h3>Known clans</h3></div></div>
          <div class="activity-stack" data-browse-clans-list>
            <article class="activity-card tone-accent"><div><strong>Loading clans</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">CL</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Summary</span><h3>Community split</h3></div></div>
          <div class="mini-stack" data-browse-clans-slices><span class="chip">loading</span></div>
        </article>
      </div>
    </section>
  `;
}

function uploadSongsSection(): string {
  return `
    <section class="page-section" data-page="upload-songs">
      <div class="section-header">
        <div>
          <span class="eyebrow">Upload hub</span>
          <h2>Song Upload</h2>
        </div>
        <p>Song uploads, linked imports, SFX handling, level transfers, and cron tools for server-side media workflows.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-upload-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching upload hub</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Upload lanes</span><h3>Song and SFX actions</h3></div></div>
          <div class="activity-stack" data-upload-actions>
            <article class="activity-card tone-accent"><div><strong>Loading actions</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">UP</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Linked songs</span><h3>Remote imports</h3></div></div>
          <div class="activity-stack" data-upload-linked>
            <article class="activity-card tone-warning"><div><strong>Loading linked songs</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">URL</span></article>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Quick actions</span><h3>Create songs</h3></div></div>
          <div class="settings-grid" style="margin-top: 8px;">
            <label class="field settings-field"><span>Song name</span><input data-upload-song-name type="text" placeholder="My track" /></label>
            <label class="field settings-field"><span>Author</span><input data-upload-song-author type="text" placeholder="Artist name" /></label>
            <label class="field settings-field"><span>Source URL (optional)</span><input data-upload-song-url type="text" placeholder="https://example.com/song" /></label>
            <div class="settings-actions">
              <button type="button" class="solid-button" data-upload-create-local>Create local song</button>
              <button type="button" class="ghost-button" data-upload-create-linked>Create linked song</button>
            </div>
            <p class="status-line" data-upload-action-status>Ready.</p>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Transfers</span><h3>Level move tools</h3></div></div>
          <div class="activity-stack" data-upload-transfers>
            <article class="activity-card tone-success"><div><strong>Loading transfers</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-success">MOV</span></article>
          </div>
        </article>
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Cron</span><h3>Automation tasks</h3></div></div>
          <div class="activity-stack" data-upload-cron>
            <article class="activity-card tone-accent"><div><strong>Loading cron tasks</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">JOB</span></article>
          </div>
        </article>
      </div>
    </section>
  `;
}

function modToolsSection(): string {
  return `
    <section class="page-section" data-page="mod-tools">
      <div class="section-header">
        <div>
          <span class="eyebrow">Moderator toolbox</span>
          <h2>Moderator Tools</h2>
        </div>
        <p>Reports, suggested levels, vault code operations, automod signals, and moderation-side server control surfaces.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-mod-tools-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching mod tools</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Reports</span><h3>Incoming moderation queue</h3></div></div>
          <div class="activity-stack" data-mod-tools-reports>
            <article class="activity-card tone-warning"><div><strong>Loading reports</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">RPT</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Suggested</span><h3>Suggested levels</h3></div></div>
          <div class="activity-stack" data-mod-tools-suggested>
            <article class="activity-card tone-accent"><div><strong>Loading suggestions</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">SUG</span></article>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Systems</span><h3>Automod and moderation controls</h3></div></div>
          <div class="mini-stack" data-mod-tools-system><span class="chip">loading</span></div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Quick actions</span><h3>Resolve and control</h3></div></div>
          <div class="settings-grid" style="margin-top: 8px;">
            <label class="field settings-field"><span>Report ID</span><input data-mod-report-id type="number" min="1" placeholder="1" /></label>
            <label class="field settings-field"><span>Level ID</span><input data-mod-level-id type="number" min="1" placeholder="1" /></label>
            <label class="field settings-field"><span>Account ID</span><input data-mod-account-id type="number" min="1" placeholder="2" /></label>
            <label class="field settings-field"><span>Ban reason</span><input data-mod-ban-reason type="text" placeholder="Abuse / spam" /></label>
            <label class="field settings-field"><span>Vault code</span><input data-mod-vault-code type="text" placeholder="CITYCODE" /></label>
            <label class="field settings-field"><span>Rewards payload</span><input data-mod-vault-rewards type="text" placeholder="orbs,250,diamonds,10" /></label>
            <div class="settings-actions">
              <button type="button" class="solid-button" data-mod-resolve-report>Resolve report</button>
              <button type="button" class="ghost-button" data-mod-hide-level>Hide level</button>
              <button type="button" class="ghost-button" data-mod-add-vault>Add vault code</button>
              <button type="button" class="ghost-button" data-mod-ban-account>Ban account</button>
            </div>
            <p class="status-line" data-mod-action-status>Ready.</p>
          </div>
        </article>
      </div>
    </section>
  `;
}

function statsSuiteSection(): string {
  return `
    <section class="page-section" data-page="stats-suite">
      <div class="section-header">
        <div>
          <span class="eyebrow">Stats suite</span>
          <h2>Statistics</h2>
        </div>
        <p>Daily rotations, moderator roster, moderation actions, and leaderboard snapshots from the active core state.</p>
      </div>
      <div class="metrics-grid metrics-grid-two" data-stats-suite-metrics>
        <article class="metric-card tone-accent"><span class="metric-label">Loading</span><strong class="metric-value">...</strong><span class="metric-delta">Fetching statistics</span></article>
      </div>
      <div class="content-grid">
        <article class="panel-card">
          <div class="panel-head"><div><span class="eyebrow">Daily stream</span><h3>Daily and weekly levels</h3></div></div>
          <div class="activity-stack" data-stats-suite-daily>
            <article class="activity-card tone-success"><div><strong>Loading daily rotation</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-success">DAY</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Moderators</span><h3>Active roster</h3></div></div>
          <div class="activity-stack" data-stats-suite-mods>
            <article class="activity-card tone-accent"><div><strong>Loading moderators</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-accent">MOD</span></article>
          </div>
        </article>
      </div>

      <div class="content-grid" style="margin-top:18px;">
        <article class="panel-card span-2">
          <div class="panel-head"><div><span class="eyebrow">Leaderboards</span><h3>Top players snapshot</h3></div></div>
          <div class="activity-stack" data-stats-suite-leaderboard>
            <article class="activity-card tone-warning"><div><strong>Loading leaderboard</strong><p>Waiting for dashboard-api.</p></div><span class="pill tone-warning">TOP</span></article>
          </div>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head"><div><span class="eyebrow">Actions</span><h3>Moderator actions</h3></div></div>
          <div class="mini-stack" data-stats-suite-actions><span class="chip">loading</span></div>
        </article>
      </div>
    </section>
  `;
}

function genericSection(section: DashboardGroup["sections"][number]): string {
  return `
    <section class="page-section" data-page="${section.id}">
      <div class="section-header">
        <div>
          <span class="eyebrow">${escapeHtml(section.icon)}</span>
          <h2 data-generic-title="${section.id}">${escapeHtml(section.label)}</h2>
        </div>
        <p data-generic-description="${section.id}">${escapeHtml(section.description)}</p>
      </div>
      <div class="content-grid solo">
        <article class="panel-card span-2 blueprint-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="generic.blueprint.eyebrow">Screen blueprint</span>
              <h3 data-generic-workspace="${section.id}">${escapeHtml(section.label)} workspace</h3>
            </div>
            ${section.badge ? `<span class="chip">${escapeHtml(section.badge)}</span>` : ""}
          </div>
          <ul class="detail-list">
            <li data-i18n="generic.blueprint.item1">Ready for real dashboard-api data without changing the screen structure.</li>
            <li data-i18n="generic.blueprint.item2">Built for filters, bulk actions, RBAC-aware navigation, and audit trails.</li>
            <li data-i18n="generic.blueprint.item3">Realtime widgets and privileged actions will be layered in per module.</li>
          </ul>
        </article>
        <article class="panel-card accent-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow" data-i18n="generic.modules.eyebrow">Planned modules</span>
              <h3 data-generic-components="${section.id}">${escapeHtml(section.label)} components</h3>
            </div>
          </div>
          <div class="mini-stack">
            <span class="chip" data-i18n="generic.modules.tables">tables</span>
            <span class="chip" data-i18n="generic.modules.filters">filters</span>
            <span class="chip" data-i18n="generic.modules.audit">audit</span>
            <span class="chip" data-i18n="generic.modules.rbac">RBAC</span>
            <span class="chip" data-i18n="generic.modules.live">live widgets</span>
            <span class="chip" data-i18n="generic.modules.timeline">timeline</span>
          </div>
        </article>
      </div>
    </section>
  `;
}

const megaSaintSections: DashboardGroup["sections"] = [
  { id: "account-manage", icon: "AC", label: "Account Management", description: "Password, nickname, hidden levels, songs, SFX, favourites, and hidden lists." },
  { id: "browse-levels", icon: "LV", label: "Levels", description: "Browse levels, lists, and related gameplay content." },
  { id: "browse-songs", icon: "SG", label: "Songs", description: "Browse uploaded songs and audio content." },
  { id: "browse-clans", icon: "CL", label: "Clans", description: "Browse clans and community groups." },
  { id: "profile", icon: "PR", label: "Your Profile", description: "Open your personal profile overview." },
  { id: "messenger", icon: "MS", label: "Messenger", description: "Open messages and direct conversations." },
  { id: "upload-songs", icon: "UP", label: "Song Upload", description: "Upload songs, linked songs, SFX, and transfer tools." },
  { id: "mod-tools", icon: "MT", label: "Moderator Tools", description: "Moderation utilities, reports, automod, and creator tools." },
  { id: "stats-suite", icon: "ST", label: "Statistics", description: "Daily stats, moderators, actions, and top leaderboards." }
];
export function pageSections(groups: DashboardGroup[]): string {
  const sections = groups.flatMap((group) => group.sections).concat(megaSaintSections);
  return sections.map((section) => {
    if (section.id === "home") return homeSection();
    if (section.id === "live-control") return liveControlSection();
    if (section.id === "player-360") return player360Section();
    if (section.id === "moderation") return moderationSection();
    if (section.id === "events") return eventsSection();
    if (section.id === "content") return contentSection();
    if (section.id === "security") return securitySection();
    if (section.id === "themes") return themesSection();
    if (section.id === "settings") return settingsSection();
    return genericSection(section);
  }).join("");
}






















