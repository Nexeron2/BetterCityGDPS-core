import { appManifest } from "@better-city/shared";
import { dashboardLocales } from "@better-city/i18n";
import { defaultRoles } from "@better-city/permissions";
import { dashboardGroups } from "./content";
import { localeLabels, escapeHtml, navGroups, pageSections } from "./fragments";
import { baseStyles } from "./styles";
import { scriptPayload, dashboardScript, loginScript } from "./client";

function megaSaintDropdown(title: string, items: Array<{ id: string; icon: string; label: string }>): string {
  return `
    <div class="megasaint-dropdown">
      <button type="button" class="megasaint-link">${title}</button>
      <div class="megasaint-menu">
        ${items.map((item) => `<button type="button" class="megasaint-menu-item" data-page-trigger="${item.id}"><span class="megasaint-menu-icon">${item.icon}</span><span>${item.label}</span></button>`).join("")}
      </div>
    </div>
  `;
}

function megaSaintNav(): string {
  return `
    <header class="megasaint-header">
      <div class="megasaint-bar">
        <button type="button" class="megasaint-logo" data-page-trigger="home">BC</button>
        <nav class="megasaint-nav">
          <button type="button" class="megasaint-link active" data-page-trigger="home">Домой</button>
          ${megaSaintDropdown("Управление аккаунтом", [
            { id: "account-manage", icon: "◉", label: "Сменить пароль" },
            { id: "account-manage", icon: "◎", label: "Сменить никнейм" },
            { id: "account-manage", icon: "☰", label: "Ваши скрытые уровни" },
            { id: "account-manage", icon: "♫", label: "Управление песнями" },
            { id: "account-manage", icon: "◌", label: "Управление звуковыми эффектами" },
            { id: "account-manage", icon: "♥", label: "Любимые песни" },
            { id: "account-manage", icon: "≣", label: "Ваши скрытые списки уровней" }
          ])}
          ${megaSaintDropdown("Просмотр", [
            { id: "player-360", icon: "◉", label: "Аккаунты" },
            { id: "browse-levels", icon: "◈", label: "Уровни" },
            { id: "live-control", icon: "LC", label: "Live Control Center" },
            { id: "content", icon: "CH", label: "Content Hub" },
            { id: "browse-levels", icon: "▣", label: "Мап-Паки" },
            { id: "browse-levels", icon: "◍", label: "Гаунтлеты" },
            { id: "browse-levels", icon: "≣", label: "Списки уровней" },
            { id: "browse-songs", icon: "♫", label: "Песни" },
            { id: "browse-songs", icon: "◌", label: "Звуковые эффекты" },
            { id: "browse-clans", icon: "⌘", label: "Кланы" },
            { id: "player-360", icon: "P3", label: "Player 360" },
            { id: "leaderboards", icon: "LB", label: "Leaderboard IQ" }
          ])}
          ${megaSaintDropdown("Загрузка на сервер", [
            { id: "upload-songs", icon: "♫", label: "Добавить песню" },
            { id: "upload-songs", icon: "♬", label: "Добавить песню по ссылке" },
            { id: "upload-songs", icon: "◌", label: "Добавить звуковой эффект" },
            { id: "upload-songs", icon: "↓", label: "Перенести уровень" },
            { id: "upload-songs", icon: "↑", label: "Перенести уровень на другой сервер" },
            { id: "upload-songs", icon: "≡", label: "Выполнить Cron" },
            { id: "events", icon: "EV", label: "Event Studio" },
            { id: "integrations", icon: "IN", label: "Integrations" },
            { id: "themes", icon: "TH", label: "Themes" }
          ])}
          ${megaSaintDropdown("Инструменты модератора", [
            { id: "mod-tools", icon: "⚒", label: "Забанить пользователя" },
            { id: "mod-tools", icon: "☷", label: "Список заблокированных" },
            { id: "mod-tools", icon: "☰", label: "Скрытые уровни" },
            { id: "mod-tools", icon: "◔", label: "Предложенные уровни" },
            { id: "mod-tools", icon: "≣", label: "Скрытые списки уровней" },
            { id: "mod-tools", icon: "!", label: "Репорты" },
            { id: "mod-tools", icon: "+", label: "Управление Мап-Паками" },
            { id: "mod-tools", icon: "⊕", label: "Управление Гаунтлетами" },
            { id: "mod-tools", icon: "×", label: "Недоступные песни" },
            { id: "mod-tools", icon: "¤", label: "Недоступные звуковые эффекты" },
            { id: "mod-tools", icon: "+", label: "Добавить квест" },
            { id: "mod-tools", icon: "⌂", label: "Выдать модератора" },
            { id: "mod-tools", icon: "↷", label: "Поделиться Креатор Поинтами" },
            { id: "mod-tools", icon: "✎", label: "Сменить никнейм или пароль игроку" },
            { id: "mod-tools", icon: "☼", label: "Автомод" },
            { id: "mod-tools", icon: "◎", label: "Добавить код для хранилища" },
            { id: "moderation", icon: "MD", label: "Moderation Workspace" },
            { id: "security", icon: "SC", label: "Security Center" },
            { id: "files", icon: "FS", label: "Files" },
            { id: "ops", icon: "OP", label: "Ops Panel" }
          ])}
          ${megaSaintDropdown("Статистика", [
            { id: "stats-suite", icon: "⚙", label: "Ежедневные уровни" },
            { id: "stats-suite", icon: "◉", label: "Список модераторов" },
            { id: "stats-suite", icon: "☰", label: "Действия модераторов" },
            { id: "stats-suite", icon: "≣", label: "Таблица лидеров за 24 часа" }
          ])}
        </nav>
        <div class="megasaint-userbar">
          <button type="button" class="megasaint-userlink" data-page-trigger="messenger">Мессенджер</button>
          <select class="locale-select megasaint-locale" data-locale-select>
            ${dashboardLocales.map((locale) => `<option value="${locale.code}">${escapeHtml(locale.label)}</option>`).join("")}
          </select>
          <span class="megasaint-userlink" data-user-name>Nex</span>
        </div>
      </div>
    </header>
  `;
}

export function renderDashboardPage(): string {
  const localeOptions = dashboardLocales.map((locale) => `<option value="${locale.code}">${escapeHtml(locale.label)}</option>`).join("");
  const roleNames = defaultRoles.slice(0, 4).map((role) => role.label).join(" / ");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appManifest.dashboard.name}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>${baseStyles()}</style>
    </head>
    <body>
      <div class="shell" data-dashboard-app>
        <aside class="sidebar">
          <div class="brand">
            <div class="brand-mark">BC</div>
            <div class="brand-copy">
              <small data-brand-project>GDPS Project</small>
              <strong>Dashboard</strong>
              <p data-i18n="brand.copy">Management dashboard for your GDPS project.</p>
            </div>
          </div>
          <div class="nav-scroll">${navGroups(dashboardGroups)}</div>
          <div class="identity-card">
            <div class="identity-row">
              <div class="avatar" data-user-avatar>BC</div>
              <div>
                <strong data-user-name>Nex Control</strong>
                <span data-user-roles>${escapeHtml(roleNames)}</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
              <span data-locale-label>${escapeHtml(localeLabels.get("ru") ?? "Русский")}</span>
              <button type="button" class="ghost-button" data-logout data-i18n="chrome.logout">Logout</button>
            </div>
          </div>
        </aside>
        <main class="main">
          ${megaSaintNav()}
          <header class="topbar">
            <div>
              <h1 data-topbar-title>Home</h1>
              <p data-topbar-subtitle>Main control surface for the GDPS stack.</p>
            </div>
            <div class="topbar-actions">
              <select class="locale-select" data-locale-select>${localeOptions}</select>
              <button type="button" class="ghost-button" data-i18n="chrome.localeShort">RU / EN / ES</button>
              <button type="button" class="solid-button" data-i18n="chrome.realtime">Realtime online</button>
            </div>
          </header>
          ${pageSections(dashboardGroups)}
        </main>
      </div>
      <script id="dashboard-boot" type="application/json">${scriptPayload("ru", "neon-core")}</script>
      <script>${dashboardScript()}</script>
    </body>
  </html>`;
}

export function renderLoginPage(): string {
  const localeOptions = dashboardLocales.map((locale) => `<option value="${locale.code}">${escapeHtml(locale.label)}</option>`).join("");
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login | ${appManifest.dashboard.name}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>${baseStyles()}</style>
    </head>
    <body>
      <main class="auth-shell">
        <section class="auth-card">
          <div class="login-mark">BC</div>
          <span class="auth-subtitle" data-i18n="login.subtitle">Geometry Dash account access</span>
          <h1 class="auth-title"><span data-login-project>GDPS Project</span> <span data-i18n="login.portal">account portal</span></h1>
          <p class="auth-copy" data-i18n="login.copy">Sign in with your Geometry Dash account. Registration below creates the same account for the GDPS core and the dashboard entry point.</p>
          <div class="auth-actions" style="margin-bottom:16px;">
            <button type="button" class="solid-button" data-auth-mode="login" data-i18n="login.mode.signin">Sign in</button>
            <button type="button" class="ghost-button" data-auth-mode="register" data-i18n="login.mode.register">Register</button>
          </div>
          <div class="auth-grid">
            <label class="field">
              <span class="auth-label" data-i18n="login.language">Language</span>
              <select data-login-locale>${localeOptions}</select>
            </label>
            <label class="field">
              <span class="auth-label" data-i18n="login.username">Username</span>
              <input type="text" data-login-username data-i18n-placeholder="login.placeholder.username" placeholder="Geometry Dash username" />
            </label>
            <label class="field auth-register-only" hidden>
              <span class="auth-label" data-i18n="login.email">Email</span>
              <input type="email" data-register-email data-i18n-placeholder="login.placeholder.email" placeholder="Email for your GDPS account" />
            </label>
            <label class="field">
              <span class="auth-label" data-i18n="login.password">Password</span>
              <input type="password" data-login-password data-i18n-placeholder="login.placeholder.password" placeholder="Current password" />
            </label>
            <label class="field auth-register-only" hidden>
              <span class="auth-label" data-i18n="login.confirm">Confirm password</span>
              <input type="password" data-register-confirm data-i18n-placeholder="login.placeholder.confirm" placeholder="Repeat password" />
            </label>
          </div>
          <div class="auth-actions">
            <button type="button" class="solid-button" data-login-submit data-i18n="login.submit.signin">Sign in</button>
            <button type="button" class="ghost-button" data-i18n="login.staffGuide">Staff access guide</button>
          </div>
          <p class="auth-note" data-login-error hidden></p>
          <p class="auth-note" data-i18n="login.note">Supported locales: Русский, English, Español. If dashboard access is restricted, registration still creates your GDPS account for the game.</p>
        </section>
      </main>
      <script>${loginScript()}</script>
    </body>
  </html>`;
}
