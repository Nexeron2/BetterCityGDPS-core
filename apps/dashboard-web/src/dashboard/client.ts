import { dashboardLocales } from "@better-city/i18n";
import { dashboardThemes } from "./content";

export function scriptPayload(defaultLocale: string, defaultTheme: string): string {
  const locales = dashboardLocales.map((locale) => ({ code: locale.code, label: locale.label }));
  const themes = dashboardThemes.map((theme) => ({ id: theme.id, palette: theme.palette, label: theme.label, category: theme.category, description: theme.description, personality: theme.personality, cues: theme.cues }));
  return JSON.stringify({ locales, themes, defaultLocale, defaultTheme });
}

export function dashboardScript(): string {
  return `
    const boot = JSON.parse(document.getElementById("dashboard-boot").textContent || "{}");
    const root = document.documentElement;
    const pageButtons = Array.from(document.querySelectorAll("[data-page-trigger]"));
    const sections = Array.from(document.querySelectorAll("[data-page]"));
    const localeSelects = Array.from(document.querySelectorAll("[data-locale-select]"));
    const themeButtons = Array.from(document.querySelectorAll("[data-theme-switch]"));
    const themeCards = Array.from(document.querySelectorAll("[data-theme-card]"));
    const logoutButton = document.querySelector("[data-logout]");
    const settingsProjectName = document.querySelector("[data-settings-project-name]");
    const settingsProjectStatus = document.querySelector("[data-settings-project-status]");
    const settingsSaveProjectButton = document.querySelector("[data-settings-save-project]");
    const settingsThemeSelect = document.querySelector("[data-settings-theme-select]");
    const settingsThemeStatus = document.querySelector("[data-settings-theme-status]");
    const settingsApplyThemeButton = document.querySelector("[data-settings-apply-theme]");
    const settingsDefaultThemeSelect = document.querySelector("[data-settings-default-theme]");
    const settingsAllowThemeOverride = document.querySelector("[data-settings-allow-theme-override]");
    const settingsDefaultsStatus = document.querySelector("[data-settings-defaults-status]");
    const settingsSaveDefaultsButton = document.querySelector("[data-settings-save-defaults]");
    const settingsPublicStatistics = document.querySelector("[data-settings-public-statistics]");
    const settingsPublicIntegrations = document.querySelector("[data-settings-public-integrations]");
    const settingsTelegramEnabled = document.querySelector("[data-settings-telegram-enabled]");
    const settingsTelegramUsername = document.querySelector("[data-settings-telegram-username]");
    const settingsTelegramUrl = document.querySelector("[data-settings-telegram-url]");
    const settingsDiscordEnabled = document.querySelector("[data-settings-discord-enabled]");
    const settingsDiscordBotUrl = document.querySelector("[data-settings-discord-bot-url]");
    const settingsDiscordServerUrl = document.querySelector("[data-settings-discord-server-url]");
    const playerSearchInput = document.querySelector("[data-player-search-input]");
    const playerSearchButton = document.querySelector("[data-player-search-button]");
    const playerSearchStatus = document.querySelector("[data-player-search-status]");
    const uploadSongName = document.querySelector("[data-upload-song-name]");
    const uploadSongAuthor = document.querySelector("[data-upload-song-author]");
    const uploadSongUrl = document.querySelector("[data-upload-song-url]");
    const uploadCreateLocalButton = document.querySelector("[data-upload-create-local]");
    const uploadCreateLinkedButton = document.querySelector("[data-upload-create-linked]");
    const uploadActionStatus = document.querySelector("[data-upload-action-status]");
    const modReportId = document.querySelector("[data-mod-report-id]");
    const modLevelId = document.querySelector("[data-mod-level-id]");
    const modVaultCode = document.querySelector("[data-mod-vault-code]");
    const modVaultRewards = document.querySelector("[data-mod-vault-rewards]");
    const modResolveReportButton = document.querySelector("[data-mod-resolve-report]");
    const modHideLevelButton = document.querySelector("[data-mod-hide-level]");
    const modAddVaultButton = document.querySelector("[data-mod-add-vault]");
    const modActionStatus = document.querySelector("[data-mod-action-status]");
    const savedTheme = localStorage.getItem("bcgc-dashboard-theme") || boot.defaultTheme;
    const savedLocale = localStorage.getItem("bcgc-dashboard-locale") || boot.defaultLocale;
    const token = localStorage.getItem("dashboard_token");
    let currentLocale = savedLocale;
    const modernGroupLabels = {
      ru: { Overview: 'Обзор', Players: 'Игроки', Content: 'Контент', Music: 'Музыка', Moderation: 'Модерация', Events: 'События', Operations: 'Операции', Settings: 'Настройки' },
      en: { Overview: 'Overview', Players: 'Players', Content: 'Content', Music: 'Music', Moderation: 'Moderation', Events: 'Events', Operations: 'Operations', Settings: 'Settings' },
      es: { Overview: 'Resumen', Players: 'Jugadores', Content: 'Contenido', Music: 'Musica', Moderation: 'Moderacion', Events: 'Eventos', Operations: 'Operaciones', Settings: 'Ajustes' }
    };
    const modernPageAccess = {
      home: ['player','moderator','administrator','privileged-operator','owner'],
      'live-control': ['moderator','administrator','privileged-operator','owner'],
      'player-360': ['player','moderator','administrator','privileged-operator','owner'],
      profile: ['player','moderator','administrator','privileged-operator','owner'],
      messenger: ['player','moderator','administrator','privileged-operator','owner'],
      'account-manage': ['player','moderator','administrator','privileged-operator','owner'],
      'browse-levels': ['player','moderator','administrator','privileged-operator','owner'],
      'browse-clans': ['player','moderator','administrator','privileged-operator','owner'],
      content: ['player','moderator','administrator','privileged-operator','owner'],
      leaderboards: ['moderator','administrator','privileged-operator','owner'],
      'browse-songs': ['player','moderator','administrator','privileged-operator','owner'],
      'upload-songs': ['player','moderator','administrator','privileged-operator','owner'],
      themes: ['player','moderator','administrator','privileged-operator','owner'],
      moderation: ['moderator','administrator','privileged-operator','owner'],
      'mod-tools': ['moderator','administrator','privileged-operator','owner'],
      events: ['player','moderator','administrator','privileged-operator','owner'],
      'stats-suite': ['player','moderator','administrator','privileged-operator','owner'],
      ops: ['administrator','privileged-operator','owner'],
      security: ['administrator','privileged-operator','owner'],
      files: ['privileged-operator','owner'],
      integrations: ['player','moderator','administrator','privileged-operator','owner'],
      settings: ['administrator','owner']
    };

    const i18n = {
      ru: {
        pages: { home: ['Главная', 'Сводка по ядру, игрокам и операциям.'], 'live-control': ['Live Control', 'Онлайн, ошибки API, новые уровни и подозрительные события в реальном времени.'], 'player-360': ['Player 360', 'Единая карточка игрока: статистика, уровни, комментарии, активность и публичный профиль.'], moderation: ['Модерация', 'Очередь жалоб, suggested actions и рабочее пространство модерации.'], events: ['Event Studio', 'Daily, Weekly, event-ротации, награды и квесты через UI.'], content: ['Content Hub', 'Новые уровни, комментарии, сообщения и анонсы проекта.'], leaderboards: ['Leaderboard IQ', 'Тренды, всплески и сигналы по лидербордам.'], themes: ['Темы', 'Система тем, загрузка своих и переключение интерфейса Dashboard.'], ops: ['Ops Panel', 'Cron, workers, Redis, очереди, ручной rerun задач и error radar.'], security: ['Безопасность', '2FA, IP allowlist, rate limits, логины и privileged unlock sessions.'], settings: ['Настройки', 'Имя проекта, базовые параметры Dashboard, язык и оформление.'], files: ['Файлы', 'Monaco Editor и privileged file access для критичных файлов.'], integrations: ['Интеграции', 'Discord, Telegram, webhooks и API tokens.'], profile: ['Профиль', 'Ваш GDPS-аккаунт, статистика, ссылки и последние уровни.'], messenger: ['Мессенджер', 'Входящие и исходящие сообщения текущего аккаунта.'], 'browse-clans': ['Кланы', 'Сообщества игроков и их контент в ядре.'], 'account-manage': ['Аккаунт', 'Пароль, ник, privacy-параметры и контент аккаунта.'], 'browse-levels': ['Уровни', 'Каталог уровней, рейтинги, featured-подборки и новые загрузки.'], 'browse-songs': ['Песни', 'Каталог песен, авторы и загрузки, известные ядру.'], 'upload-songs': ['Загрузка', 'Загрузка песен, SFX, перенос уровней и cron-инструменты.'], 'mod-tools': ['Инструменты модератора', 'Репорты, suggested levels, automod и контроль модерации.'], 'stats-suite': ['Статистика', 'Ротации, модераторы, действия и снимки лидербордов.'] },
        text: { brandCopy: 'Панель управления для вашего GDPS-проекта.', logout: 'Выйти', realtime: 'Онлайн в реальном времени', heroEyebrow: 'Панель управления', heroTitle: 'Dashboard проекта', heroCopy: 'Управление проектом, событиями, модерацией и активностью сервера.', openLive: 'Открыть live центр', browseThemes: 'Открыть темы', loading: 'Загрузка', fetchingOverview: 'Получение сводки', wowTitle: 'Ключевые системы', latestEvents: 'Последние события', latestLevels: 'Новые уровни', suspicious: 'Подозрительные сигналы', apply: 'Применить' },
        metrics: ['Игроков онлайн', 'Очередь жалоб', 'Cloud backups', 'Объём контента', 'всего игроков', 'всего комментариев', 'аккаунтов', 'песен / списков'],
        latestWords: ['лайки', 'скачивания', 'Уровней пока нет', 'Сводка не вернула данные по уровням.'],
        noSignals: 'Нет активных сигналов',
        noLive: ['Нет live событий', 'Поток сейчас пуст.', 'ОЖИДАНИЕ'],
        settings: { title: 'Настройки проекта', copy: 'Имя проекта, базовые параметры Dashboard и визуальный пресет.', role: 'owner / admin', projectEyebrow: 'Идентичность', projectTitle: 'Имя проекта', projectLabel: 'Отображаемое имя проекта', projectSave: 'Сохранить имя проекта', idle: 'Ожидание изменений.', saving: 'Сохраняю...', saved: 'Имя проекта сохранено.', forbidden: 'Недостаточно прав для изменения имени проекта.', failed: 'Не удалось сохранить имя проекта.', visualEyebrow: 'Визуальные настройки', visualTitle: 'Предпросмотр темы', themeLabel: 'Активная тема', themeApply: 'Применить локально', themeNote: 'Тема пока сохраняется локально в браузере.', themeApplied: 'Локальная тема применена.', defaultsEyebrow: 'Настройки игроков', defaultsTitle: 'Тема по умолчанию', defaultsThemeLabel: 'Тема для новых игроков', defaultsAllowLabel: 'Разрешить игрокам менять тему', defaultsSave: 'Сохранить настройки игроков', defaultsNote: 'Новые регистрации будут получать эту тему по умолчанию.', defaultsSaved: 'Настройки игроков сохранены.' }
      },      en: {
        pages: { home: ["Home", "Main summary for the core, players, and operations."], "live-control": ["Live Control", "Online players, API errors, new levels, and suspicious events in realtime."], "player-360": ["Player 360", "Unified player card: stats, levels, reports, activity, and moderation actions."], moderation: ["Moderation", "Reports queue, sanction templates, suggested actions, and mod workspace."], events: ["Event Studio", "Daily, Weekly, seasonal events, rewards, and duration through UI."], content: ["Content Hub", "News, banners, launcher announcements, and public statuses."], leaderboards: ["Leaderboard IQ", "Trends, suspicious spikes, and anti-abuse signals for leaderboards."], themes: ["Themes", "Theme system, custom uploads, and Dashboard appearance switching."], ops: ["Ops Panel", "Cron, workers, Redis, queues, manual reruns, and error radar."], security: ["Security", "2FA, IP allowlist, rate limits, logins, and privileged unlock sessions."], settings: ["Settings", "Project name, base dashboard defaults, language, and appearance."], files: ["Files", "Monaco Editor and privileged file access for critical files."], integrations: ["Integrations", "Discord bridge, Telegram, webhooks, and API tokens."], "account-manage": ["Account", "Password, nickname, privacy, linked profiles, and account-owned content."], "browse-levels": ["Levels", "Level catalog, ratings, featured picks, and recent uploads."], "browse-songs": ["Songs", "Song catalog, authors, and uploads known to the core."], profile: ["Profile", "Your GDPS account snapshot, stats, social links, and latest levels."], messenger: ["Messenger", "Inbox and outbox activity for the current account."], "browse-clans": ["Clans", "Community groups and creator clusters in the current core data."], "upload-songs": ["Upload", "Song uploads, SFX, level transfer tools, and cron operations."], "mod-tools": ["Moderator Tools", "Reports, suggested levels, automod state, and moderation control tools."], "stats-suite": ["Statistics", "Daily rotations, moderators, actions, and leaderboard snapshots."] },
        text: { brandCopy: "Management dashboard for your GDPS project.", logout: "Logout", realtime: "Realtime online", heroEyebrow: "GDPS control deck", heroTitle: "Project dashboard", heroCopy: "Manage your project, events, moderation, and live server activity.", openLive: "Open live center", browseThemes: "Browse themes", loading: "Loading", fetchingOverview: "Fetching overview", wowTitle: "Key systems", latestEvents: "Latest events", latestLevels: "Fresh levels", suspicious: "Suspicious signals", apply: "Apply" },
        metrics: ["Players Online", "Reports Queue", "Cloud Backups", "Content Volume", "total players", "total comments", "accounts", "songs / lists"],
        latestWords: ["likes", "downloads", "No levels yet", "Overview returned no level data."],
        noSignals: "No active signals",
        noLive: ["No live events", "Feed is empty right now.", "IDLE"],
        settings: { title: "Project settings", copy: "Project name, dashboard defaults, and visual preset preview.", role: "owner / admin", projectEyebrow: "Identity", projectTitle: "Project name", projectLabel: "Displayed project name", projectSave: "Save project name", idle: "Waiting for changes.", saving: "Saving...", saved: "Project name saved.", forbidden: "You do not have permission to change the project name.", failed: "Failed to save the project name.", visualEyebrow: "Visual defaults", visualTitle: "Theme preview", themeLabel: "Active theme", themeApply: "Apply local preview", themeNote: "Theme selection is stored locally in the browser for now.", themeApplied: "Local theme applied.", defaultsEyebrow: "Player defaults", defaultsTitle: "Theme defaults", defaultsThemeLabel: "Default player theme", defaultsAllowLabel: "Allow players to override theme", defaultsSave: "Save player defaults", defaultsNote: "New registrations will receive this dashboard theme by default.", defaultsSaved: "Player defaults saved." }
      },
      es: {
        pages: { home: ["Inicio", "Resumen principal del core, jugadores y operaciones."], "live-control": ["Live Control", "Jugadores online, errores API, niveles nuevos y eventos sospechosos en tiempo real."], "player-360": ["Player 360", "Ficha unificada del jugador: estadísticas, niveles, reportes, actividad y moderación."], moderation: ["Moderación", "Cola de reportes, plantillas de sanción, suggested actions y espacio de mods."], events: ["Event Studio", "Eventos diarios, semanales y de temporada, recompensas y duración desde UI."], content: ["Content Hub", "Noticias, banners, launcher announcements y estados públicos."], leaderboards: ["Leaderboard IQ", "Tendencias, suspicious spikes y señales anti-abuse en leaderboards."], themes: ["Temas", "Sistema de temas, carga de temas propios y cambio visual del Dashboard."], ops: ["Ops Panel", "Cron, workers, Redis, colas, reruns manuales y radar de errores."], security: ["Seguridad", "2FA, allowlist IP, rate limits, logins y sesiones privilegiadas."], settings: ["Ajustes", "Nombre del proyecto, valores base del Dashboard, idioma y apariencia."], files: ["Archivos", "Monaco Editor y acceso privilegiado a archivos críticos."], integrations: ["Integraciones", "Discord bridge, Telegram, webhooks y API tokens."], profile: ["Perfil", "Tu cuenta GDPS, estadísticas, enlaces y niveles recientes."], messenger: ["Mensajería", "Mensajes entrantes y salientes de la cuenta actual."], "browse-clans": ["Clanes", "Comunidades de jugadores y su huella de contenido en el core."] },
        text: { brandCopy: "Panel de gestión para tu proyecto GDPS.", logout: "Salir", realtime: "En tiempo real", heroEyebrow: "Centro de control GDPS", heroTitle: "Dashboard del proyecto", heroCopy: "Gestiona tu proyecto, eventos, moderación y la actividad del servidor.", openLive: "Abrir centro en vivo", browseThemes: "Ver temas", loading: "Cargando", fetchingOverview: "Obteniendo resumen", wowTitle: "Sistemas clave", latestEvents: "Eventos recientes", latestLevels: "Niveles nuevos", suspicious: "Señales sospechosas", apply: "Aplicar" },
        metrics: ["Jugadores online", "Cola de reportes", "Cloud Backups", "Volumen de contenido", "jugadores totales", "comentarios totales", "cuentas", "canciones / listas"],
        latestWords: ["likes", "descargas", "Todavía no hay niveles", "El resumen no devolvió datos de niveles."],
        noSignals: "No hay señales activas",
        noLive: ["No hay eventos live", "El feed está vacío ahora mismo.", "IDLE"],
        settings: { title: "Ajustes del proyecto", copy: "Nombre del proyecto, valores base del Dashboard y vista previa del tema.", role: "owner / admin", projectEyebrow: "Identidad", projectTitle: "Nombre del proyecto", projectLabel: "Nombre visible del proyecto", projectSave: "Guardar nombre del proyecto", idle: "Esperando cambios.", saving: "Guardando...", saved: "Nombre del proyecto guardado.", forbidden: "No tienes permisos para cambiar el nombre del proyecto.", failed: "No se pudo guardar el nombre del proyecto.", visualEyebrow: "Opciones visuales", visualTitle: "Vista previa del tema", themeLabel: "Tema activo", themeApply: "Aplicar vista local", themeNote: "El tema se guarda localmente en el navegador por ahora.", themeApplied: "Tema local aplicado.", defaultsEyebrow: "Preferencias de jugadores", defaultsTitle: "Tema por defecto", defaultsThemeLabel: "Tema para jugadores nuevos", defaultsAllowLabel: "Permitir que los jugadores cambien el tema", defaultsSave: "Guardar preferencias", defaultsNote: "Los nuevos registros recibirán este tema por defecto.", defaultsSaved: "Preferencias guardadas." }
      }
    };

    const megaSaintI18n = {
      ru: {
        navHome: "\u0414\u043e\u043c\u043e\u0439", navAccount: "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u043e\u043c", navBrowse: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440", navUpload: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440", navModeration: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u043c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440\u0430", navStats: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430", messenger: "\u041c\u0435\u0441\u0441\u0435\u043d\u0434\u0436\u0435\u0440",
        greeting: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439", welcome: "\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u043d\u0430 GDPS!", question: "\u0427\u0435\u043c \u0432\u044b \u0441\u0435\u0433\u043e\u0434\u043d\u044f \u0431\u0443\u0434\u0435\u0442\u0435 \u0437\u0430\u043d\u0438\u043c\u0430\u0442\u044c\u0441\u044f?", game: "\u0418\u0433\u0440\u0430", account: "\u0410\u043a\u043a\u0430\u0443\u043d\u0442",
        levelsTitle: "\u0423\u0440\u043e\u0432\u043d\u0438", levelsCopy: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u0443\u0440\u043e\u0432\u043d\u0435\u0439", songsTitle: "\u041f\u0435\u0441\u043d\u0438", songsCopy: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u043f\u0435\u0441\u0435\u043d", clansTitle: "\u041a\u043b\u0430\u043d\u044b", clansCopy: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u043a\u043b\u0430\u043d\u043e\u0432",
        profileTitle: "\u0412\u0430\u0448 \u043f\u0440\u043e\u0444\u0438\u043b\u044c", profileCopy: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0430\u0448 \u043f\u0440\u043e\u0444\u0438\u043b\u044c", messengerTitle: "\u041c\u0435\u0441\u0441\u0435\u043d\u0434\u0436\u0435\u0440", messengerCopy: "\u0417\u0430\u0439\u0442\u0438 \u0432 \u043c\u0435\u0441\u0441\u0435\u043d\u0434\u0436\u0435\u0440", uploadTitle: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0435\u0441\u043d\u044e", uploadCopy: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0435\u0441\u043d\u044e \u043d\u0430 \u0441\u0435\u0440\u0432\u0435\u0440",
        accountItems: ["\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c", "\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0438\u043a\u043d\u0435\u0439\u043c", "\u0412\u0430\u0448\u0438 \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u0443\u0440\u043e\u0432\u043d\u0438", "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0435\u0441\u043d\u044f\u043c\u0438", "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0437\u0432\u0443\u043a\u043e\u0432\u044b\u043c\u0438 \u044d\u0444\u0444\u0435\u043a\u0442\u0430\u043c\u0438", "\u041b\u044e\u0431\u0438\u043c\u044b\u0435 \u043f\u0435\u0441\u043d\u0438", "\u0412\u0430\u0448\u0438 \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u0441\u043f\u0438\u0441\u043a\u0438 \u0443\u0440\u043e\u0432\u043d\u0435\u0439"]
      },
      en: {
        navHome: "Home", navAccount: "Account management", navBrowse: "Browse", navUpload: "Upload to server", navModeration: "Moderator tools", navStats: "Statistics", messenger: "Messenger",
        greeting: "Hello", welcome: "Welcome to GDPS!", question: "What are you working on today?", game: "Game", account: "Account",
        levelsTitle: "Levels", levelsCopy: "View the level list", songsTitle: "Songs", songsCopy: "View the song list", clansTitle: "Clans", clansCopy: "View the clan list",
        profileTitle: "Your profile", profileCopy: "View your profile", messengerTitle: "Messenger", messengerCopy: "Open messenger", uploadTitle: "Add song", uploadCopy: "Upload a song to the server",
        accountItems: ["Change password", "Change nickname", "Your hidden levels", "Manage songs", "Manage sound effects", "Favourite songs", "Your hidden level lists"]
      },
      es: {
        navHome: "Inicio", navAccount: "Gesti\u00f3n de cuenta", navBrowse: "Explorar", navUpload: "Subir al servidor", navModeration: "Herramientas de moderaci\u00f3n", navStats: "Estad\u00edsticas", messenger: "Mensajer\u00eda",
        greeting: "Hola", welcome: "Bienvenido a GDPS!", question: "\u00bfEn qu\u00e9 trabajar\u00e1s hoy?", game: "Juego", account: "Cuenta",
        levelsTitle: "Niveles", levelsCopy: "Ver la lista de niveles", songsTitle: "Canciones", songsCopy: "Ver la lista de canciones", clansTitle: "Clanes", clansCopy: "Ver la lista de clanes",
        profileTitle: "Tu perfil", profileCopy: "Ver tu perfil", messengerTitle: "Mensajer\u00eda", messengerCopy: "Entrar al mensajero", uploadTitle: "Agregar canci\u00f3n", uploadCopy: "Subir una canci\u00f3n al servidor",
        accountItems: ["Cambiar contrase\u00f1a", "Cambiar apodo", "Tus niveles ocultos", "Gestionar canciones", "Gestionar efectos de sonido", "Canciones favoritas", "Tus listas de niveles ocultas"]
      }
    };

    const modernSectionI18n = {
      ru: {
        '[data-page="live-control"] .section-header .eyebrow': 'Операции в реальном времени',
        '[data-page="live-control"] .section-header h2': 'Live Control Center',
        '[data-page="live-control"] .section-header p': 'Онлайн-активность, давление очереди репортов, новые уровни и поток событий из живого ядра GDPS.',
        '[data-page="player-360"] .section-header .eyebrow': 'Единая карточка игрока',
        '[data-page="player-360"] .section-header h2': 'Player 360',
        '[data-page="player-360"] .section-header p': 'Поиск по нику или account id, просмотр статистики, уровней, комментариев и активности аккаунта.',
        '[data-page="moderation"] .section-header .eyebrow': 'Рабочее пространство',
        '[data-page="moderation"] .section-header h2': 'Moderation Workspace',
        '[data-page="moderation"] .section-header p': 'Очередь репортов, suggested actions и рабочее пространство модерации.',
        '[data-page="events"] .section-header .eyebrow': 'Управление событиями',
        '[data-page="events"] .section-header h2': 'Event Studio',
        '[data-page="events"] .section-header p': 'Daily, Weekly, event-ротации, квесты и коды наград из текущего состояния ядра.',
        '[data-page="content"] .section-header .eyebrow': 'Контентный поток',
        '[data-page="content"] .section-header h2': 'Content Hub',
        '[data-page="content"] .section-header p': 'Новые уровни, комментарии, сообщения и анонсы проекта из текущих данных.',
        '[data-page="security"] .section-header .eyebrow': 'Контроль безопасности',
        '[data-page="security"] .section-header h2': 'Security Center',
        '[data-page="security"] .section-header p': 'Сводка по безопасности, suspicious signals, логинам и privileged-доступу.',
        '[data-page="themes"] .section-header .eyebrow': 'Визуальная система',
        '[data-page="themes"] .section-header h2': 'Система тем',
        '[data-page="themes"] .section-header p': 'Предустановленные темы, пользовательские overrides и база для конструктора тем.',
        '[data-page="account-manage"] .section-header .eyebrow': 'Управление аккаунтом',
        '[data-page="account-manage"] .section-header h2': 'Параметры аккаунта',
        '[data-page="account-manage"] .section-header p': 'Пароль, ник, privacy-параметры, связанные профили и контент владельца.',
        '[data-page="browse-levels"] .section-header .eyebrow': 'Каталог',
        '[data-page="browse-levels"] .section-header h2': 'Уровни',
        '[data-page="browse-levels"] .section-header p': 'Каталог уровней, rated/featured подборки и последние загрузки.',
        '[data-page="browse-songs"] .section-header .eyebrow': 'Каталог',
        '[data-page="browse-songs"] .section-header h2': 'Песни',
        '[data-page="browse-songs"] .section-header p': 'Каталог песен, авторы и треки, известные ядру.',
        '[data-page="profile"] .section-header .eyebrow': 'Личный профиль',
        '[data-page="profile"] .section-header h2': 'Ваш профиль',
        '[data-page="profile"] .section-header p': 'Ваш профиль GDPS-аккаунта, статистика, социальные ссылки и последние уровни.',
        '[data-page="messenger"] .section-header .eyebrow': 'Почта',
        '[data-page="messenger"] .section-header h2': 'Мессенджер',
        '[data-page="messenger"] .section-header p': 'Входящие и исходящие сообщения вашего GDPS-аккаунта.',
        '[data-page="browse-clans"] .section-header .eyebrow': 'Сообщества',
        '[data-page="browse-clans"] .section-header h2': 'Кланы',
        '[data-page="browse-clans"] .section-header p': 'Сообщества игроков и их контентная активность в текущем ядре.'
      },      en: {},
      es: {
        '[data-page="live-control"] .section-header .eyebrow': 'Operaciones en tiempo real',
        '[data-page="live-control"] .section-header h2': 'Live Control Center',
        '[data-page="live-control"] .section-header p': 'Actividad online, presión de reportes, niveles nuevos y eventos en vivo del runtime GDPS.',
        '[data-page="player-360"] .section-header .eyebrow': 'Ficha unificada del jugador',
        '[data-page="player-360"] .section-header h2': 'Player 360',
        '[data-page="player-360"] .section-header p': 'Busca por nombre o account id y revisa estadísticas, niveles, mensajes, comentarios y actividad.',
        '[data-page="moderation"] .section-header .eyebrow': 'Cola de acciones',
        '[data-page="moderation"] .section-header h2': 'Moderation Workspace',
        '[data-page="moderation"] .section-header p': 'Cola de reportes, suggested actions y espacio de moderación.',
        '[data-page="events"] .section-header .eyebrow': 'Control de eventos',
        '[data-page="events"] .section-header h2': 'Event Studio',
        '[data-page="events"] .section-header p': 'Rotaciones diarias, semanales y de eventos, misiones y códigos de recompensa desde el core.',
        '[data-page="content"] .section-header .eyebrow': 'Flujo de contenido',
        '[data-page="content"] .section-header h2': 'Content Hub',
        '[data-page="content"] .section-header p': 'Niveles recientes, comentarios, mensajes y anuncios del proyecto.',
        '[data-page="content"] .panel-head .eyebrow': 'Niveles recientes',
        '[data-page="security"] .section-header .eyebrow': 'Estado de seguridad',
        '[data-page="security"] .section-header h2': 'Security Center',
        '[data-page="security"] .section-header p': 'Resumen de seguridad, señales sospechosas, accesos y sesiones privilegiadas.',
        '[data-page="themes"] .section-header .eyebrow': 'Sistema visual',
        '[data-page="themes"] .section-header h2': 'Galería de temas',
        '[data-page="themes"] .section-header p': 'Temas preinstalados, overrides por usuario y base para temas propios.',
        '[data-page="account-manage"] .section-header .eyebrow': 'Herramientas de cuenta',
        '[data-page="account-manage"] .section-header h2': 'Gestión de cuenta',
        '[data-page="account-manage"] .section-header p': 'Contraseña, apodo, privacidad, perfiles enlazados y contenido de esta cuenta.',
        '[data-page="browse-levels"] .section-header .eyebrow': 'Explorar',
        '[data-page="browse-levels"] .section-header h2': 'Niveles',
        '[data-page="browse-levels"] .section-header p': 'Catálogo de niveles, contenido rated/featured y últimas subidas.',
        '[data-page="browse-songs"] .section-header .eyebrow': 'Explorar',
        '[data-page="browse-songs"] .section-header h2': 'Canciones',
        '[data-page="browse-songs"] .section-header p': 'Catálogo de canciones, autores y pistas ya conocidas por el core.',
        '[data-page="profile"] .section-header .eyebrow': 'Perfil del jugador',
        '[data-page="profile"] .section-header h2': 'Tu perfil',
        '[data-page="profile"] .section-header p': 'Resumen de tu cuenta GDPS, estadísticas públicas, enlaces y niveles recientes.',
        '[data-page="messenger"] .section-header .eyebrow': 'Mensajes',
        '[data-page="messenger"] .section-header h2': 'Mensajería',
        '[data-page="messenger"] .section-header p': 'Mensajes entrantes y salientes de la cuenta GDPS actual.',
        '[data-page="browse-clans"] .section-header .eyebrow': 'Explorar',
        '[data-page="browse-clans"] .section-header h2': 'Clanes',
        '[data-page="browse-clans"] .section-header p': 'Comunidades de jugadores y su huella de contenido en los datos actuales del core.',
        '[data-i18n="settings.defaults.eyebrow"]': 'Preferencias de jugadores',
        '[data-i18n="settings.defaults.title"]': 'Tema por defecto',
        '[data-page="live-control"] .panel-card.span-2 .panel-head .eyebrow': 'Flujo de eventos',
        '[data-page="live-control"] .panel-card.span-2 .panel-head h2': 'Flujo en vivo',
        '[data-page="live-control"] .panel-card.accent-card .panel-head h2': '?ltimos reportes',
        '[data-page="player-360"] .panel-card.span-2 .panel-head .eyebrow': 'Búsqueda',
        '[data-page="player-360"] .panel-card.span-2 .panel-head h3': 'Buscar jugador',
        '[data-page="player-360"] [data-player-search-button]': 'Cargar jugador',
        '[data-page="player-360"] .panel-card.accent-card .panel-head .eyebrow': 'Selecci?n r?pida',
        '[data-page="player-360"] .panel-card.accent-card .panel-head h3': 'Lista de jugadores',
        '[data-page="player-360"] .content-grid[style="margin-top:18px;"] .panel-card.span-2 .panel-head .eyebrow': 'Resumen del jugador',
        '[data-page="player-360"] .content-grid[style="margin-top:18px;"] .panel-card:nth-child(2) .panel-head .eyebrow': 'Niveles recientes',
        '[data-page="player-360"] .content-grid[style="margin-top:18px;"] .panel-card:nth-child(2) .panel-head h2': 'Actividad de niveles',
        '[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:first-child .panel-head .eyebrow': 'Mensajes',
        '[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:first-child .panel-head h2': 'Bandeja',
        '[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:last-child .panel-head .eyebrow': 'Comentarios',
        '[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:last-child .panel-head h2': 'Cronolog?a de comentarios',
        '[data-page="moderation"] .panel-card.span-2 .panel-head .eyebrow': 'Cola',
        '[data-page="moderation"] .panel-card.span-2 .panel-head h3': 'Reportes pendientes',
        '[data-page="moderation"] .panel-card.accent-card .panel-head .eyebrow': 'Resumen',
        '[data-page="moderation"] .panel-card.accent-card .panel-head h3': 'Presi?n de revisi?n',
        '[data-page="events"] .panel-card.span-2 .panel-head .eyebrow': 'Funciones activas',
        '[data-page="events"] .panel-card.span-2 .panel-head h3': 'Slots diarios / semanales / evento',
        '[data-page="events"] .panel-card.accent-card .panel-head .eyebrow': 'Vault',
        '[data-page="events"] .panel-card.accent-card .panel-head h3': 'Códigos de recompensa',
        '[data-page="events"] .content-grid[style="margin-top:18px;"] .panel-head .eyebrow': 'Plantillas de misión',
        '[data-page="events"] .content-grid[style="margin-top:18px;"] .panel-head h3': 'Rotaci?n de misiones',
        '[data-page="content"] .panel-card.span-2 .panel-head .eyebrow': 'Niveles recientes',
        '[data-page="content"] .panel-card.span-2 .panel-head h3': 'Contenido entrante',
        '[data-page="content"] .panel-card.accent-card .panel-head .eyebrow': 'Anuncios',
        '[data-page="content"] .panel-card.accent-card .panel-head h3': 'Notas del hub',
        '[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:first-child .panel-head .eyebrow': 'Comentarios',
        '[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:first-child .panel-head h3': 'Comentarios recientes',
        '[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:last-child .panel-head .eyebrow': 'Mensajes',
        '[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:last-child .panel-head h3': 'Mensajes recientes',
        '[data-page="security"] .panel-card.span-2 .panel-head .eyebrow': 'Estado de control',
        '[data-page="security"] .panel-card.span-2 .panel-head h3': 'Señales de seguridad',
        '[data-page="security"] .panel-card.accent-card .panel-head .eyebrow': 'Acceso privilegiado',
        '[data-page="security"] .panel-card.accent-card .panel-head h3': 'Estado del operador'
      }
    };

    const moduleText = {
      ru: {
        accountManage: { labels: ['Уровни','Сообщения','Песни','Избранное'], deltas: ['контент аккаунта','входящие + исходящие','загруженные треки','локально отслеживается'], privacy: ['друзья','сообщения','комментарии'], notSet: 'не задано', noLevels: ['Нет своих уровней','У этого аккаунта нет недавно обновлённых уровней.'] },
        browseLevels: { labels: ['Всего','Featured','Rated','Демоны'], deltas: ['известные уровни','кураторские подборки','уровни со звёздами','demon-уровни'], empty: ['Нет уровней','В каталоге ядра нет доступных уровней.'] },
        browseSongs: { labels: ['Всего','Локальные','Авторы'], deltas: ['известные треки','сохранены в ядре','уникальные авторы'], empty: ['Нет песен','В каталоге ядра нет доступных песен.'] },
        profile: { labels: ['Звёзды','Алмазы','Креатор поинты','Cloud saves'], deltas: ['демоны ','луны ','уровни ','сообщения '], empty: ['Нет свежих уровней','У этого профиля нет недавно обновлённых уровней.'], identity: ['аккаунт #','email ','роли '] },
        messenger: { labels: ['Входящие','Исходящие','Непрочитанные','Контакты'], deltas: ['входящих писем','исходящих писем','оценка','уникальные контакты'], inbox: ['Входящие пусты','Нет новых входящих сообщений.'], outbox: ['Исходящие пусты','Нет новых исходящих сообщений.'], from: 'от ', to: 'кому ' },
        browseClans: { labels: ['Кланы','Активные владельцы','Уровни','Средний состав'], deltas: ['известные группы','с контентом в ядре','во всех кланах','участников'], empty: ['Нет кланов','Сообщества пока не сформированы.'] }
      },      en: {},
      es: {
        accountManage: { labels: ['Niveles','Mensajes','Canciones','Favoritos'], deltas: ['de la cuenta','entrada + salida','pistas subidas','seguido localmente'], privacy: ['amigos','mensajes','comentarios'], notSet: 'sin configurar', noLevels: ['Sin niveles propios','Esta cuenta no tiene niveles actualizados recientemente.'] },
        browseLevels: { labels: ['Total','Featured','Rated','Demons'], deltas: ['niveles conocidos','selecciones curadas','niveles con estrellas','niveles demon'], empty: ['Sin niveles','No hay niveles disponibles en el catálogo.'] },
        browseSongs: { labels: ['Total','Locales','Artistas'], deltas: ['canciones conocidas','guardadas en el core','autores distintos'], empty: ['Sin canciones','No hay canciones disponibles en el catálogo.'] },
        profile: { labels: ['Estrellas','Diamantes','Creator points','Cloud saves'], deltas: ['demonios ','lunas ','niveles ','mensajes '], empty: ['Sin niveles recientes','Este perfil no tiene niveles actualizados recientemente.'], identity: ['cuenta #','email ','roles '] },
        messenger: { labels: ['Entrada','Salida','No leídos','Contactos'], deltas: ['mensajes recibidos','mensajes enviados','estimado','cuentas únicas'], inbox: ['La bandeja está vacía','No hay mensajes entrantes para esta cuenta.'], outbox: ['La salida está vacía','No hay mensajes enviados para esta cuenta.'], from: 'de ', to: 'para ' },
        browseClans: { labels: ['Total','Dueños activos','Niveles','Media de miembros'], deltas: ['clanes conocidos','con niveles publicados','entre clanes','estimado'], empty: ['Sin clanes','Todavía no hay grupos de comunidad disponibles.'] }
      }
    };
    const extendedModuleText = {
      ru: {
        live: { labels: ['Онлайн','Ошибки API','Репорты','Новые уровни'], deltas: ['активны за 30 мин','текущее окно','ждут проверки','свежий контент'], feed: ['Нет событий','Поток сейчас пуст.'], reports: ['Нет репортов','В очереди нет входящих репортов.'], levelAt: 'Уровень ' },
        player360: { lookup: 'Поиск', find: 'Найти игрока', input: 'Ник или account id', button: 'Загрузить игрока', ready: 'Готово к поиску.', quick: 'Быстрый выбор', list: 'Список игроков', snapshot: 'Снимок игрока', none: 'Игрок не выбран', recentLevels: 'Недавние уровни', levelActivity: 'Активность уровней', noLevels: ['Нет данных игрока','Выберите игрока, чтобы посмотреть уровни.'], messages: 'Сообщения', inbox: 'Лента сообщений', noMessages: ['Нет данных игрока','Выберите игрока, чтобы посмотреть сообщения.'], comments: 'Комментарии', timeline: 'Лента комментариев', noComments: ['Нет данных игрока','Выберите игрока, чтобы посмотреть комментарии.'], loaded: 'загружен' },
        moderation: { empty: ['Очередь пуста','Нет репортов, ожидающих проверки.'], pending: 'Репортов в очереди: ', mode: 'Режим: live queue' },
        security: { labels: ['События входа','Подозрительные IP','Cloud backups','Privileged unlock'], deltas: ['отслеживаемые аккаунты','текущая оценка','сохранённые аккаунты','контур оператора'], rate: 'Rate limits: ', twofa: '2FA: ', suspicious: 'Подозрительные IP: ', noPosture: ['Нет статуса','Данные о позиции безопасности отсутствуют.'], access: 'Привилегированный доступ', enabled: 'Включён с контуром оператора', disabled: 'Выключен' },
        events: { labels: ['Ротации','Квесты','Map packs','Vault codes'], deltas: ['активные слоты','шаблоны','настроены','записи наград'], noFeatures: ['Нет активных ротаций','Daily, Weekly и event-слоты не настроены.'], noQuests: ['Нет шаблонов квестов','В ядре не найдены шаблоны квестов.'], noVault: ['Нет кодов','Активные reward-коды отсутствуют.'] },
        content: { labels: ['Новые уровни','Комментарии','Сообщения','Песни'], deltas: ['недавние загрузки','недавние записи','недавний трафик','известные песни'], noLevels: ['Нет уровней','Нет недавнего контента уровней.'], noComments: ['Нет комментариев','Нет недавних комментариев.'], noMessages: ['Нет сообщений','Нет недавних сообщений.'], noNotes: ['Нет заметок','Карточки анонсов не настроены.'], from: 'от ', to: 'кому ' },
        themes: {
          megasa1nt: { category: 'Classic', description: 'Классическая тема в стиле legacy Dashboard.' },
          minimalistic: { category: 'Clean', description: 'Минималистичная и чистая тема для работы без лишнего шума.' },
          windows: { category: 'System', description: 'Тема в духе Windows 11: стекло, мягкие панели и почти системная подача.' },
          cli: { category: 'System', description: 'Текстовая тема в стиле CLI-окон и терминальных панелей.' },
          'neon-core': { category: 'Cinematic', description: 'Тёмный cyber-ops режим для главного control view.' },
          'city-night': { category: 'Cinematic', description: 'Ночная тема с тёплыми акцентами и городской атмосферой.' },
          'robotic-steel': { category: 'System', description: 'Строгая техническая тема для инженерного стиля.' },
          'lava-forge': { category: 'Cinematic', description: 'Агрессивная тема для moderation и emergency-сценариев.' },
          'emerald-control': { category: 'Cinematic', description: 'Зелёный ops/security режим с атмосферой control center.' },
          'solar-light': { category: 'Clean', description: 'Светлая рабочая тема с тёплой палитрой и высокой читаемостью.' },
          'geometry-pulse': { category: 'Game-inspired', description: 'Тема с явной отсылкой к Geometry Dash: яркая, аркадная и геометричная.' }
        },
        accountManage: { labels: ['Уровни','Сообщения','Песни','Избранное'], deltas: ['контент аккаунта','входящие + исходящие','загруженные треки','локально отслеживается'], privacy: ['друзья','сообщения','комментарии'], notSet: 'не задано', noLevels: ['Нет своих уровней','У этого аккаунта нет недавно обновлённых уровней.'] },
        browseLevels: { labels: ['Всего','Featured','Rated','Демоны'], deltas: ['известные уровни','кураторские подборки','уровни со звёздами','demon-уровни'], empty: ['Нет уровней','В каталоге ядра нет доступных уровней.'] },
        browseSongs: { labels: ['Всего','Локальные','Авторы'], deltas: ['известные треки','сохранены в ядре','уникальные авторы'], empty: ['Нет песен','В каталоге ядра нет доступных песен.'] },
        profile: { labels: ['Звёзды','Алмазы','Креатор поинты','Cloud saves'], deltas: ['демоны ','луны ','уровни ','сообщения '], empty: ['Нет свежих уровней','У этого профиля нет недавно обновлённых уровней.'], identity: ['аккаунт #','email ','роли '] },
        messenger: { labels: ['Входящие','Исходящие','Непрочитанные','Контакты'], deltas: ['входящих писем','исходящих писем','оценка','уникальные контакты'], inbox: ['Входящие пусты','Нет новых входящих сообщений.'], outbox: ['Исходящие пусты','Нет новых исходящих сообщений.'], from: 'от ', to: 'кому ' },
        browseClans: { labels: ['Кланы','Активные владельцы','Уровни','Средний состав'], deltas: ['известные группы','с контентом в ядре','во всех кланах','участников'], empty: ['Нет кланов','Сообщества пока не сформированы.'] }
      },      en: {
        live: { labels: ['Online','API errors','Reports','Fresh levels'], deltas: ['active in last 30m','current window','pending review','latest content'], feed: ['No feed events','The live control feed is empty right now.'], reports: ['No reports','No incoming reports are queued right now.'], levelAt: 'Level ' },
        player360: { lookup: 'Lookup', find: 'Find player', input: 'Username or account id', button: 'Load player', ready: 'Ready to search.', quick: 'Quick picks', list: 'Player list', snapshot: 'Player snapshot', none: 'No player selected', recentLevels: 'Recent levels', levelActivity: 'Level activity', noLevels: ['No player data','Select a player to inspect levels.'], messages: 'Messages', inbox: 'Inbox timeline', noMessages: ['No player data','Select a player to inspect messages.'], comments: 'Comments', timeline: 'Comment timeline', noComments: ['No player data','Select a player to inspect comments.'], loaded: 'loaded' },
        moderation: { empty: ['Queue is empty','No reports are waiting for moderation review.'], pending: 'Pending reports: ', mode: 'Mode: live queue' },
        security: { labels: ['Login events','Suspicious IPs','Cloud backups','Privileged unlock'], deltas: ['tracked accounts','current estimate','saved accounts','operator gate'], rate: 'Rate limits: ', twofa: '2FA: ', suspicious: 'Suspicious IPs: ', noPosture: ['No posture','No security posture is available.'], access: 'Privileged access', enabled: 'Enabled with operator gate', disabled: 'Disabled' },
        events: { labels: ['Features','Quests','Map packs','Vault codes'], deltas: ['active rotations','templates','configured','reward entries'], noFeatures: ['No active features','No daily, weekly, or event rotations are configured.'], noQuests: ['No quest templates','No quest templates were found in the game store.'], noVault: ['No vault codes','No active reward codes are available.'] },
        content: { labels: ['Latest levels','Comments','Messages','Songs'], deltas: ['recent uploads','recent entries','recent traffic','known songs'], noLevels: ['No levels','No latest level content is available.'], noComments: ['No comments','No recent comments are available.'], noMessages: ['No messages','No recent messages are available.'], noNotes: ['No notes','No announcement cards are configured.'], from: 'from ', to: 'to ' },
        themes: {
          megasa1nt: { category: 'Classic', description: 'A classic legacy-inspired dashboard theme.' },
          minimalistic: { category: 'Clean', description: 'A clean minimal theme focused on data and work without extra noise.' },
          windows: { category: 'System', description: 'A Windows 11 inspired theme with glass surfaces, soft panels, and a system feel.' },
          cli: { category: 'System', description: 'A text-first theme styled after CLI windows and terminal control panels.' },
          'neon-core': { category: 'Cinematic', description: 'A dark cyber-ops theme for the main dashboard control view.' },
          'city-night': { category: 'Cinematic', description: 'A deep night theme with warm accents and an urban control-room mood.' },
          'robotic-steel': { category: 'System', description: 'A strict technical theme for an engineering-first presentation.' },
          'lava-forge': { category: 'Cinematic', description: 'An aggressive alert theme for moderation and emergency workflows.' },
          'emerald-control': { category: 'Cinematic', description: 'A green ops/security theme with a control-center atmosphere.' },
          'solar-light': { category: 'Clean', description: 'A bright working theme with a warm palette and strong readability.' },
          'geometry-pulse': { category: 'Game-inspired', description: 'A theme with a clear Geometry Dash vibe: bright, arcade-like, and geometric.' }
        }
      },
      es: {
        live: { labels: ['Online','Errores API','Reportes','Niveles nuevos'], deltas: ['activos en 30 min','ventana actual','pendientes de revision','contenido reciente'], feed: ['Sin eventos','El feed esta vacio ahora mismo.'], reports: ['Sin reportes','No hay reportes entrantes en cola.'], levelAt: 'Nivel ' },
        player360: { lookup: 'Busqueda', find: 'Buscar jugador', input: 'Usuario o account id', button: 'Cargar jugador', ready: 'Listo para buscar.', quick: 'Seleccion rapida', list: 'Lista de jugadores', snapshot: 'Resumen del jugador', none: 'Ningun jugador seleccionado', recentLevels: 'Niveles recientes', levelActivity: 'Actividad de niveles', noLevels: ['Sin datos del jugador','Selecciona un jugador para ver niveles.'], messages: 'Mensajes', inbox: 'Bandeja', noMessages: ['Sin datos del jugador','Selecciona un jugador para ver mensajes.'], comments: 'Comentarios', timeline: 'Cronologia de comentarios', noComments: ['Sin datos del jugador','Selecciona un jugador para ver comentarios.'], loaded: 'cargado' },
        moderation: { empty: ['La cola esta vacia','No hay reportes esperando moderacion.'], pending: 'Reportes pendientes: ', mode: 'Modo: cola en vivo' },
        security: { labels: ['Eventos de acceso','IPs sospechosas','Cloud backups','Privileged unlock'], deltas: ['cuentas registradas','estimacion actual','cuentas guardadas','control de operador'], rate: 'Rate limits: ', twofa: '2FA: ', suspicious: 'IPs sospechosas: ', noPosture: ['Sin estado','No hay postura de seguridad disponible.'], access: 'Acceso privilegiado', enabled: 'Activado con control de operador', disabled: 'Desactivado' },
        events: { labels: ['Eventos','Misiones','Map packs','Vault codes'], deltas: ['rotaciones activas','plantillas','configurado','recompensas'], noFeatures: ['Sin eventos activos','No hay rotaciones diarias, semanales o de evento configuradas.'], noQuests: ['Sin plantillas','No se encontraron misiones en el core.'], noVault: ['Sin codigos','No hay codigos de recompensa activos.'] },
        content: { labels: ['Niveles nuevos','Comentarios','Mensajes','Canciones'], deltas: ['subidas recientes','entradas recientes','trafico reciente','canciones conocidas'], noLevels: ['Sin niveles','No hay contenido reciente de niveles.'], noComments: ['Sin comentarios','No hay comentarios recientes.'], noMessages: ['Sin mensajes','No hay mensajes recientes.'], noNotes: ['Sin notas','No hay tarjetas de anuncio configuradas.'], from: 'de ', to: 'para ' },
        themes: {
          megasa1nt: { category: 'Classic', description: 'Tema clásico inspirado en un dashboard legacy.' },
          minimalistic: { category: 'Clean', description: 'Tema minimalista y limpio, centrado en datos y trabajo.' },
          windows: { category: 'System', description: 'Tema inspirado en Windows 11 con cristal, paneles suaves y estilo del sistema.' },
          cli: { category: 'System', description: 'Tema textual al estilo de ventanas CLI y paneles terminales.' },
          'neon-core': { category: 'Cinematic', description: 'Tema cyber-ops oscuro para la vista principal de control.' },
          'city-night': { category: 'Cinematic', description: 'Tema nocturno profundo con acentos calidos y atmosfera urbana.' },
          'robotic-steel': { category: 'System', description: 'Tema tecnico estricto para quienes prefieren un estilo ingenieril.' },
          'lava-forge': { category: 'Cinematic', description: 'Tema agresivo para moderacion y escenarios de emergencia.' },
          'emerald-control': { category: 'Cinematic', description: 'Tema verde de operaciones y seguridad con aire de centro de control.' },
          'solar-light': { category: 'Clean', description: 'Tema claro de trabajo con paleta calida y buena legibilidad.' },
          'geometry-pulse': { category: 'Game-inspired', description: 'Tema con vinculo visual claro con Geometry Dash: brillante, arcade y geometrico.' }
        }
      }
    };

    const megaSaintMenuI18n = {
      ru: [
        ['Сменить пароль', 'Сменить никнейм', 'Ваши скрытые уровни', 'Управление песнями', 'Управление звуковыми эффектами', 'Любимые песни', 'Ваши скрытые списки уровней'],
        ['Аккаунты', 'Уровни', 'Live Control Center', 'Content Hub', 'Мап-Паки', 'Гаунтлеты', 'Списки уровней', 'Песни', 'Звуковые эффекты', 'Кланы', 'Player 360', 'Leaderboard IQ'],
        ['Добавить песню', 'Добавить песню по ссылке', 'Добавить звуковой эффект', 'Перенести уровень', 'Перенести уровень на другой сервер', 'Выполнить Cron', 'Event Studio', 'Integrations', 'Themes'],
        ['Забанить пользователя', 'Список заблокированных', 'Скрытые уровни', 'Предложенные уровни', 'Скрытые списки уровней', 'Репорты', 'Управление Мап-Паками', 'Управление Гаунтлетами', 'Недоступные песни', 'Недоступные звуковые эффекты', 'Добавить квест', 'Выдать модератора', 'Поделиться Креатор Поинтами', 'Сменить никнейм или пароль игроку', 'Автомод', 'Добавить код для хранилища', 'Moderation Workspace', 'Security Center', 'Files', 'Ops Panel'],
        ['Ежедневные уровни', 'Список модераторов', 'Действия модераторов', 'Таблица лидеров за 24 часа']
      ],      en: [
        ["Change password", "Change nickname", "Your hidden levels", "Manage songs", "Manage sound effects", "Favourite songs", "Your hidden level lists"],
        ["Accounts", "Levels", "Live Control Center", "Content Hub", "Map Packs", "Gauntlets", "Level Lists", "Songs", "Sound effects", "Clans", "Player 360", "Leaderboard IQ"],
        ["Add song", "Add song by link", "Add sound effect", "Transfer level", "Transfer level to another server", "Run Cron", "Event Studio", "Integrations", "Themes"],
        ["Ban user", "Blocked users list", "Hidden levels", "Suggested levels", "Hidden level lists", "Reports", "Manage Map Packs", "Manage Gauntlets", "Unavailable songs", "Unavailable sound effects", "Add quest", "Grant moderator", "Share Creator Points", "Change player nickname or password", "Automod", "Add vault code", "Moderation Workspace", "Security Center", "Files", "Ops Panel"],
        ["Daily levels", "Moderators list", "Moderator actions", "24 hour leaderboard"]
      ],
      es: [
        ["Cambiar contraseña", "Cambiar apodo", "Tus niveles ocultos", "Gestionar canciones", "Gestionar efectos de sonido", "Canciones favoritas", "Tus listas de niveles ocultas"],
        ["Cuentas", "Niveles", "Live Control Center", "Content Hub", "Map Packs", "Gauntlets", "Listas de niveles", "Canciones", "Efectos de sonido", "Clanes", "Player 360", "Leaderboard IQ"],
        ["Agregar canción", "Agregar canción por enlace", "Agregar efecto de sonido", "Transferir nivel", "Transferir nivel a otro servidor", "Ejecutar Cron", "Event Studio", "Integrations", "Themes"],
        ["Banear usuario", "Lista de bloqueados", "Niveles ocultos", "Niveles sugeridos", "Listas de niveles ocultas", "Reportes", "Gestionar Map Packs", "Gestionar Gauntlets", "Canciones no disponibles", "Efectos de sonido no disponibles", "Agregar misión", "Dar moderador", "Compartir Creator Points", "Cambiar apodo o contraseña del jugador", "Automod", "Agregar código del vault", "Moderation Workspace", "Security Center", "Files", "Ops Panel"],
        ["Niveles diarios", "Lista de moderadores", "Acciones de moderadores", "Tabla de líderes de 24 horas"]
      ]
    };

    function dict() { return i18n[currentLocale] || i18n.en; }
    function api(path, options) { const request = Object.assign({ headers: {} }, options || {}); request.headers = Object.assign({}, request.headers, token ? { Authorization: "Bearer " + token } : {}); return fetch(path, request).then(function(response) { return response.json().then(function(payload) { return { ok: response.ok, status: response.status, payload: payload }; }); }); }
    function setStatus(node, message, tone) { if (!node) return; node.textContent = message; node.classList.remove("is-success", "is-error"); if (tone === "success") node.classList.add("is-success"); if (tone === "error") node.classList.add("is-error"); }
    function renderActivityList(selector, items, emptyTitle, emptyCopy, badge, tone, format) { const container = document.querySelector(selector); if (!container) return; container.innerHTML = (items || []).map(function(item) { return format(item); }).join('') || '<article class="activity-card tone-' + tone + '"><div><strong>' + emptyTitle + '</strong><p>' + emptyCopy + '</p></div><span class="pill tone-' + tone + '">' + badge + '</span></article>'; }
    function applyTheme(themeId) {
      const theme = boot.themes.find(function(item) { return item.id === themeId; }) || boot.themes[0];
      if (!theme) return;
      root.setAttribute("data-theme-id", theme.id); Object.entries(theme.palette).forEach(function(entry) { root.style.setProperty("--" + entry[0], entry[1]); });
      themeCards.forEach(function(card) { card.classList.toggle("is-active", card.dataset.themeCard === theme.id); });
      document.querySelectorAll('[data-theme-apply]').forEach(function(node) { const item = boot.themes.find(function(themeEntry) { return themeEntry.id === node.dataset.themeApply; }); if (item) node.textContent = dict().text.apply + ' ' + item.label; });
      document.querySelectorAll('[data-theme-card]').forEach(function(card) { const meta = (extendedText().themes || {})[card.dataset.themeCard] || {}; const categoryNode = card.querySelector('.theme-heading span'); const descNode = card.querySelector('.theme-copy p'); if (categoryNode && meta.category) categoryNode.textContent = meta.category; if (descNode && meta.description) descNode.textContent = meta.description; });
      if (settingsThemeSelect) settingsThemeSelect.value = theme.id; const spotlightTitle = document.querySelector("[data-theme-spotlight-title]"); const spotlightCategory = document.querySelector("[data-theme-spotlight-category]"); const spotlightDescription = document.querySelector("[data-theme-spotlight-description]"); const spotlightCues = document.querySelector("[data-theme-spotlight-cues]"); const themeMeta = (extendedText().themes || {})[theme.id] || {}; if (spotlightTitle) spotlightTitle.textContent = theme.label; if (spotlightCategory) spotlightCategory.textContent = themeMeta.category || theme.category; if (spotlightDescription) spotlightDescription.textContent = themeMeta.description || theme.description; if (spotlightCues) spotlightCues.innerHTML = (theme.cues || []).map(function(cue) { return '<span class="chip">' + cue + '</span>'; }).join('');
      localStorage.setItem("bcgc-dashboard-theme", theme.id);
    }
    function isModernPageAllowed(pageId, user) {
      const roles = new Set(((user && user.roleIds) || ['player']).map(function(role) { return String(role); }));
      const allowed = modernPageAccess[pageId];
      if (!allowed) return true;
      if (roles.size === 1 && roles.has('player')) {
        if (pageId === 'stats-suite' && window.__bcgcPublicFeatures && window.__bcgcPublicFeatures.statistics === false) return false;
        if (pageId === 'integrations' && window.__bcgcPublicFeatures && window.__bcgcPublicFeatures.integrations === false) return false;
      }
      return allowed.some(function(role) { return roles.has(role); });
    }
    function applyModernAccess(user) {
      const modern = root.getAttribute('data-theme-id') !== 'megasa1nt';
      document.querySelectorAll('.sidebar [data-page-trigger]').forEach(function(node) {
        const pageId = node.dataset.pageTrigger;
        const allowed = modern ? isModernPageAllowed(pageId, user) : true;
        node.hidden = !allowed;
      });
      document.querySelectorAll('.sidebar [data-nav-group]').forEach(function(group) {
        const visibleItems = Array.from(group.querySelectorAll('[data-page-trigger]')).filter(function(node) { return !node.hidden; });
        group.hidden = visibleItems.length === 0;
      });
    }
    function openPage(pageId) {
      const me = window.__bcgcUser || null;
      const exists = sections.some(function(section) { return section.dataset.page === pageId; });
      const allowed = isModernPageAllowed(pageId, me);
      const resolvedPageId = exists && allowed ? pageId : 'home';
      sections.forEach(function(section) { section.classList.toggle('active', section.dataset.page === resolvedPageId); });
      pageButtons.forEach(function(button) {
        const isSidebarButton = !!button.closest('.sidebar');
        if (isSidebarButton && button.hidden) {
          button.classList.remove('active');
          return;
        }
        button.classList.toggle('active', button.dataset.pageTrigger === resolvedPageId);
      });
      const topTitle = document.querySelector('[data-topbar-title]');
      const topSub = document.querySelector('[data-topbar-subtitle]');
      const page = dict().pages[resolvedPageId];
      if (page && topTitle && topSub) { topTitle.textContent = page[0]; topSub.textContent = page[1]; }
    }
    function modernText() { return moduleText[currentLocale] || moduleText.en || {}; }
    function extendedText() { return extendedModuleText[currentLocale] || extendedModuleText.en || {}; }
    function applyModernSectionLocale() {
      const map = modernSectionI18n[currentLocale] || modernSectionI18n.en || {};
      const set = function(selector, value) {
        const node = document.querySelector(selector);
        if (node && typeof value === "string") node.textContent = value;
      };
      Object.keys(map).forEach(function(selector) {
        const node = document.querySelector(selector);
        if (node) node.textContent = map[selector];
      });
      const locale = currentLocale;
      const live = locale === "ru"
        ? { feedEyebrow: "Лента событий", feedTitle: "Поток в реальном времени", reportsTitle: "Последние репорты" }
        : locale === "es"
          ? { feedEyebrow: "Flujo de eventos", feedTitle: "Flujo en vivo", reportsTitle: "?ltimos reportes" }
          : { feedEyebrow: "Ops event stream", feedTitle: "Live feed", reportsTitle: "Latest reports" };
      set('[data-page="live-control"] .panel-card.span-2 .panel-head .eyebrow', live.feedEyebrow);
      set('[data-page="live-control"] .panel-card.span-2 .panel-head h2', live.feedTitle);
      set('[data-page="live-control"] .panel-card.accent-card .panel-head h2', live.reportsTitle);
      const p = extendedText().player360 || {};
      set('[data-page="player-360"] .panel-card.span-2 .panel-head .eyebrow', p.lookup || 'Lookup');
      set('[data-page="player-360"] .panel-card.span-2 .panel-head h3', p.find || 'Find player');
      set('[data-page="player-360"] [data-player-search-button]', p.button || 'Load player');
      const playerInput = document.querySelector('[data-player-search-input]');
      if (playerInput) playerInput.setAttribute('placeholder', p.input || 'Username or account id');
      set('[data-page="player-360"] .panel-card.accent-card .panel-head .eyebrow', p.quick || 'Quick picks');
      set('[data-page="player-360"] .panel-card.accent-card .panel-head h3', p.list || 'Player list');
      set('[data-page="player-360"] .content-grid[style="margin-top:18px;"] .panel-card.span-2 .panel-head .eyebrow', p.snapshot || 'Player snapshot');
      set('[data-page="player-360"] .content-grid[style="margin-top:18px;"] .panel-card:nth-child(2) .panel-head .eyebrow', p.recentLevels || 'Recent levels');
      set('[data-page="player-360"] .content-grid[style="margin-top:18px;"] .panel-card:nth-child(2) .panel-head h2', p.levelActivity || 'Level activity');
      set('[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:first-child .panel-head .eyebrow', p.messages || 'Messages');
      set('[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:first-child .panel-head h2', p.inbox || 'Inbox timeline');
      set('[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:last-child .panel-head .eyebrow', p.comments || 'Comments');
      set('[data-page="player-360"] .content-grid[style="margin-top:18px;"] + .content-grid .panel-card:last-child .panel-head h2', p.timeline || 'Comment timeline');
      const moderation = locale === "ru"
        ? { queueEyebrow: "Очередь", queueTitle: "Репорты в ожидании", summaryEyebrow: "Сводка", summaryTitle: "Нагрузка на проверку" }
        : locale === "es"
          ? { queueEyebrow: "Cola", queueTitle: "Reportes pendientes", summaryEyebrow: "Resumen", summaryTitle: "Presi?n de revisi?n" }
          : { queueEyebrow: "Queue", queueTitle: "Pending reports", summaryEyebrow: "Summary", summaryTitle: "Review pressure" };
      set('[data-page="moderation"] .panel-card.span-2 .panel-head .eyebrow', moderation.queueEyebrow);
      set('[data-page="moderation"] .panel-card.span-2 .panel-head h3', moderation.queueTitle);
      set('[data-page="moderation"] .panel-card.accent-card .panel-head .eyebrow', moderation.summaryEyebrow);
      set('[data-page="moderation"] .panel-card.accent-card .panel-head h3', moderation.summaryTitle);
      const events = locale === "ru"
        ? { featuresEyebrow: "Активные функции", featuresTitle: "Daily / weekly / event слоты", vaultEyebrow: "Хранилище", vaultTitle: "Коды наград", questsEyebrow: "Шаблоны квестов", questsTitle: "Ротация квестов" }
        : locale === "es"
          ? { featuresEyebrow: "Funciones activas", featuresTitle: "Slots diarios / semanales / evento", vaultEyebrow: "Vault", vaultTitle: "Códigos de recompensa", questsEyebrow: "Plantillas de misión", questsTitle: "Rotaci?n de misiones" }
          : { featuresEyebrow: "Active features", featuresTitle: "Daily / weekly / event slots", vaultEyebrow: "Vault", vaultTitle: "Reward codes", questsEyebrow: "Quest templates", questsTitle: "Quest rotation" };
      set('[data-page="events"] .panel-card.span-2 .panel-head .eyebrow', events.featuresEyebrow);
      set('[data-page="events"] .panel-card.span-2 .panel-head h3', events.featuresTitle);
      set('[data-page="events"] .panel-card.accent-card .panel-head .eyebrow', events.vaultEyebrow);
      set('[data-page="events"] .panel-card.accent-card .panel-head h3', events.vaultTitle);
      set('[data-page="events"] .content-grid[style="margin-top:18px;"] .panel-head .eyebrow', events.questsEyebrow);
      set('[data-page="events"] .content-grid[style="margin-top:18px;"] .panel-head h3', events.questsTitle);
      const content = locale === "ru"
        ? { levelsEyebrow: "Новые уровни", levelsTitle: "Входящий контент", notesEyebrow: "Анонсы", notesTitle: "Лента проекта", commentsEyebrow: "Комментарии", commentsTitle: "Недавние комментарии", messagesEyebrow: "Сообщения", messagesTitle: "Недавние сообщения" }
        : locale === "es"
          ? { levelsEyebrow: "Niveles recientes", levelsTitle: "Contenido entrante", notesEyebrow: "Anuncios", notesTitle: "Notas del hub", commentsEyebrow: "Comentarios", commentsTitle: "Comentarios recientes", messagesEyebrow: "Mensajes", messagesTitle: "Mensajes recientes" }
          : { levelsEyebrow: "Latest levels", levelsTitle: "Incoming content", notesEyebrow: "Announcements", notesTitle: "Hub notes", commentsEyebrow: "Comments", commentsTitle: "Recent comments", messagesEyebrow: "Messages", messagesTitle: "Recent messages" };
      set('[data-page="content"] .panel-card.span-2 .panel-head .eyebrow', content.levelsEyebrow);
      set('[data-page="content"] .panel-card.span-2 .panel-head h3', content.levelsTitle);
      set('[data-page="content"] .panel-card.accent-card .panel-head .eyebrow', content.notesEyebrow);
      set('[data-page="content"] .panel-card.accent-card .panel-head h3', content.notesTitle);
      set('[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:first-child .panel-head .eyebrow', content.commentsEyebrow);
      set('[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:first-child .panel-head h3', content.commentsTitle);
      set('[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:last-child .panel-head .eyebrow', content.messagesEyebrow);
      set('[data-page="content"] .content-grid[style="margin-top:18px;"] .panel-card:last-child .panel-head h3', content.messagesTitle);
      const security = locale === "ru"
        ? { signalsEyebrow: "Состояние контроля", signalsTitle: "Сигналы безопасности", postureEyebrow: "Привилегированный доступ", postureTitle: "Статус оператора" }
        : locale === "es"
          ? { signalsEyebrow: "Estado de control", signalsTitle: "Señales de seguridad", postureEyebrow: "Acceso privilegiado", postureTitle: "Estado del operador" }
          : { signalsEyebrow: "Control state", signalsTitle: "Security signals", postureEyebrow: "Privileged access", postureTitle: "Operator posture" };
      set('[data-page="security"] .panel-card.span-2 .panel-head .eyebrow', security.signalsEyebrow);
      set('[data-page="security"] .panel-card.span-2 .panel-head h3', security.signalsTitle);
      set('[data-page="security"] .panel-card.accent-card .panel-head .eyebrow', security.postureEyebrow);
      set('[data-page="security"] .panel-card.accent-card .panel-head h3', security.postureTitle);
    }
    function applyMegaSaintLocale(localeData) {
      const headerButtons = Array.from(document.querySelectorAll('.megasaint-nav > .megasaint-link'));
      const dropdownButtons = Array.from(document.querySelectorAll('.megasaint-dropdown > .megasaint-link'));
      const cards = Array.from(document.querySelectorAll('.megasaint-card'));
      const menus = Array.from(document.querySelectorAll('.megasaint-menu'));
      const setText = function(selector, text) { const node = document.querySelector(selector); if (node) node.textContent = text; };
      if (headerButtons[0]) headerButtons[0].textContent = localeData.navHome;
      if (dropdownButtons[0]) dropdownButtons[0].textContent = localeData.navAccount;
      if (dropdownButtons[1]) dropdownButtons[1].textContent = localeData.navBrowse;
      if (dropdownButtons[2]) dropdownButtons[2].textContent = localeData.navUpload;
      if (dropdownButtons[3]) dropdownButtons[3].textContent = localeData.navModeration;
      if (dropdownButtons[4]) dropdownButtons[4].textContent = localeData.navStats;
      setText('.megasaint-userbar .megasaint-userlink', localeData.messenger);
      const title = document.querySelector('.megasaint-title');
      const userNode = title ? title.querySelector('[data-user-name]') : null;
      if (title) title.innerHTML = localeData.greeting + ', <span data-user-name>' + (userNode ? userNode.textContent : '') + '</span>!';
      setText('.megasaint-subtitle', localeData.welcome);
      setText('.megasaint-question', localeData.question);
      const columns = Array.from(document.querySelectorAll('.megasaint-column > h3'));
      if (columns[0]) columns[0].textContent = localeData.game;
      if (columns[1]) columns[1].textContent = localeData.account;
      const cardsMap = [[localeData.levelsTitle, localeData.levelsCopy],[localeData.songsTitle, localeData.songsCopy],[localeData.clansTitle, localeData.clansCopy],[localeData.profileTitle, localeData.profileCopy],[localeData.messengerTitle, localeData.messengerCopy],[localeData.uploadTitle, localeData.uploadCopy]];
      cards.forEach(function(card, index) { const strong = card.querySelector('strong'); const small = card.querySelector('small'); const item = cardsMap[index]; if (item) { if (strong) strong.textContent = item[0]; if (small) small.textContent = item[1]; } });
      const menuGroups = megaSaintMenuI18n[currentLocale] || megaSaintMenuI18n.en;
      menus.forEach(function(menu, menuIndex) {
        const labels = menuGroups[menuIndex] || [];
        Array.from(menu.querySelectorAll('span:last-child')).forEach(function(node, index) { if (labels[index]) node.textContent = labels[index]; });
      });
    }
    function applyLocale(locale) {
      currentLocale = locale;
      localStorage.setItem("bcgc-dashboard-locale", locale);
      const d = dict();
      document.querySelectorAll("[data-locale-label]").forEach(function(node) { const match = boot.locales.find(function(item) { return item.code === locale; }); node.textContent = match ? match.label : locale; });
      const set = function(sel, text) { const node = document.querySelector(sel); if (node) node.textContent = text; };
      set('[data-i18n="brand.copy"]', d.text.brandCopy);
      set('[data-i18n="chrome.logout"]', d.text.logout);
      set('[data-i18n="chrome.realtime"]', d.text.realtime);
      set('[data-i18n="home.hero.eyebrow"]', d.text.heroEyebrow);
      set('[data-i18n="home.hero.title"]', d.text.heroTitle);
      set('[data-i18n="home.hero.copy"]', d.text.heroCopy);
      set('[data-i18n="home.hero.liveButton"]', d.text.openLive);
      set('[data-i18n="home.hero.themeButton"]', d.text.browseThemes);
      set('[data-i18n="home.metrics.loadingLabel"]', d.text.loading);
      set('[data-i18n="home.metrics.loadingDelta"]', d.text.fetchingOverview);
      set('[data-i18n="home.wow.title"]', d.text.wowTitle);
      set('[data-i18n="home.feed.title"]', d.text.latestEvents);
      set('[data-i18n="home.latest.title"]', d.text.latestLevels);
      set('[data-i18n="home.security.title"]', d.text.suspicious);
      set('[data-i18n="settings.eyebrow"]', d.settings.projectEyebrow);
      set('[data-i18n="settings.title"]', d.settings.title);
      set('[data-i18n="settings.copy"]', d.settings.copy);
      set('[data-i18n="settings.project.eyebrow"]', d.settings.projectEyebrow);
      set('[data-i18n="settings.project.title"]', d.settings.projectTitle);
      set('[data-i18n="settings.project.label"]', d.settings.projectLabel);
      set('[data-i18n="settings.project.save"]', d.settings.projectSave);
      set('[data-i18n="settings.project.statusIdle"]', d.settings.idle);
      set('[data-settings-role]', d.settings.role);
      set('[data-i18n="settings.visual.eyebrow"]', d.settings.visualEyebrow);
      set('[data-i18n="settings.visual.title"]', d.settings.visualTitle);
      set('[data-i18n="settings.visual.themeLabel"]', d.settings.themeLabel);
      set('[data-i18n="settings.visual.apply"]', d.settings.themeApply);
      set('[data-i18n="settings.visual.note"]', d.settings.themeNote);
      set('[data-i18n="settings.defaults.eyebrow"]', d.settings.defaultsEyebrow);
      set('[data-i18n="settings.defaults.title"]', d.settings.defaultsTitle);
      set('[data-i18n="settings.defaults.themeLabel"]', d.settings.defaultsThemeLabel);
      set('[data-i18n="settings.defaults.allowLabel"]', d.settings.defaultsAllowLabel);
      set('[data-i18n="settings.defaults.save"]', d.settings.defaultsSave);
      set('[data-i18n="settings.defaults.note"]', d.settings.defaultsNote);
      document.querySelectorAll('[data-group-title]').forEach(function(node) { const labels = modernGroupLabels[locale] || modernGroupLabels.en; node.textContent = labels[node.dataset.groupTitle] || node.dataset.groupTitle; });
      document.querySelectorAll('[data-nav-label]').forEach(function(node) { const page = d.pages[node.dataset.navLabel]; if (page) node.textContent = page[0]; });
      document.querySelectorAll('[data-nav-description]').forEach(function(node) { const page = d.pages[node.dataset.navDescription]; if (page) node.textContent = page[1]; });
      document.querySelectorAll('[data-generic-title]').forEach(function(node) { const page = d.pages[node.dataset.genericTitle]; if (page) node.textContent = page[0]; });
      document.querySelectorAll('[data-generic-description]').forEach(function(node) { const page = d.pages[node.dataset.genericDescription]; if (page) node.textContent = page[1]; });
      applyMegaSaintLocale(megaSaintI18n[currentLocale] || megaSaintI18n.en);
      applyModernSectionLocale();
      localeSelects.forEach(function(node) { node.value = locale; });
      if (playerSearchStatus) setStatus(playerSearchStatus, (locale === "ru" ? "Готово к поиску." : (locale === "es" ? "Listo para buscar." : "Ready to search.")), "");
      const activeButton = pageButtons.find(function(button) { return button.classList.contains('active'); });
      openPage(activeButton ? activeButton.dataset.pageTrigger : 'home');
      applyTheme(localStorage.getItem('bcgc-dashboard-theme') || boot.defaultTheme);
    }
    function setUser(user) { window.__bcgcUser = user; document.querySelectorAll("[data-user-name]").forEach(function(node) { node.textContent = user.userName; }); document.querySelectorAll("[data-user-roles]").forEach(function(node) { node.textContent = (user.roles || []).map(function(role) { return role.label; }).join(" / ") || user.roleIds.join(" / "); }); document.querySelectorAll("[data-user-avatar]").forEach(function(node) { node.textContent = user.userName.slice(0, 2).toUpperCase(); }); applyModernAccess(user); }
    function renderMetrics(summary) { const container = document.querySelector("[data-overview-metrics]"); if (!container) return; const m = dict().metrics; const cards = [{ label: m[0], value: String(summary.playersOnline), delta: String(summary.totalPlayers) + ' ' + m[4], tone: 'success' }, { label: m[1], value: String(summary.reportsInQueue), delta: String(summary.totalComments) + ' ' + m[5], tone: 'warning' }, { label: m[2], value: String(summary.cloudBackups), delta: String(summary.totalAccounts) + ' ' + m[6], tone: 'accent' }, { label: m[3], value: String(summary.totalLevels), delta: String(summary.totalSongs) + ' / ' + String(summary.levelLists) + ' ' + m[7], tone: 'danger' }]; container.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join(''); }
    function renderLatestLevels(levels) { const l = dict().latestWords; renderActivityList("[data-latest-levels]", levels, l[2], l[3], "EMPTY", "accent", function(level) { return '<article class="activity-card tone-success"><div><strong>' + level.name + '</strong><p>' + level.userName + ' · ' + l[0] + ' ' + level.likes + ' · ' + l[1] + ' ' + level.downloads + '</p></div><span class="pill tone-success">L' + level.levelId + '</span></article>'; }); }
    function renderSignals(signals) { const container = document.querySelector("[data-suspicious-signals]"); if (!container) return; container.innerHTML = (signals || []).map(function(signal) { return '<span class="chip">' + signal.label + ': ' + signal.value + '</span>'; }).join('') || '<span class="chip">' + dict().noSignals + '</span>'; }
    function renderFeed(items) { renderActivityList("[data-live-feed]", items, dict().noLive[0], dict().noLive[1], dict().noLive[2], "accent", function(item) { return '<article class="activity-card tone-' + item.tone + '"><div><strong>' + item.title + '</strong><p>' + item.meta + '</p></div><span class="pill tone-' + item.tone + '">' + item.type.toUpperCase() + '</span></article>'; }); }
    function renderLiveControl(payload) {
      const t = extendedText().live || {};
      const metrics = document.querySelector("[data-live-control-metrics]");
      if (metrics) {
        const labels = t.labels || ['Online','API errors','Reports','Fresh levels'];
        const deltas = t.deltas || ['active in last 30m','current window','pending review','latest content'];
        const cards = [
          { label: labels[0], value: payload.summary.online, delta: deltas[0], tone: 'success' },
          { label: labels[1], value: payload.summary.apiErrors, delta: deltas[1], tone: 'accent' },
          { label: labels[2], value: payload.summary.pendingReports, delta: deltas[2], tone: 'warning' },
          { label: labels[3], value: payload.summary.freshLevels, delta: deltas[3], tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      const titleLevel = currentLocale === 'ru' ? 'Уровень обновлён: ' : (currentLocale === 'es' ? 'Nivel actualizado: ' : 'Level updated: ');
      const titleComment = currentLocale === 'ru' ? 'Комментарий от ' : (currentLocale === 'es' ? 'Comentario de ' : 'Comment by ');
      const likesWord = currentLocale === 'ru' ? 'лайки ' : (currentLocale === 'es' ? 'likes ' : 'likes ');
      const downloadsWord = currentLocale === 'ru' ? 'скачивания ' : (currentLocale === 'es' ? 'descargas ' : 'downloads ');
      const queuedAt = currentLocale === 'ru' ? 'В очереди с ' : (currentLocale === 'es' ? 'En cola desde ' : 'Queued at ');
      const feedEmpty = t.feed || ['No feed events','The live control feed is empty right now.'];
      renderActivityList("[data-live-control-feed]", payload.feed, feedEmpty[0], feedEmpty[1], 'IDLE', 'accent', function(item) {
        const title = String(item.title || '').replace(/^Level updated: /, titleLevel).replace(/^Comment by /, titleComment);
        const meta = String(item.meta || '').replace(/�/g, '|').replace(/likes /g, likesWord).replace(/downloads /g, downloadsWord);
        return '<article class="activity-card tone-' + item.tone + '"><div><strong>' + title + '</strong><p>' + meta + '</p></div><span class="pill tone-' + item.tone + '">' + item.type.toUpperCase() + '</span></article>';
      });
      const reportEmpty = t.reports || ['No reports','No incoming reports are queued right now.'];
      renderActivityList("[data-live-control-reports]", payload.latestReports, reportEmpty[0], reportEmpty[1], 'QUEUE', 'warning', function(item) {
        return '<article class="activity-card tone-warning"><div><strong>' + (t.levelAt || 'Level ') + item.levelId + '</strong><p>' + queuedAt + new Date(item.timestamp * 1000).toLocaleString() + '</p></div><span class="pill tone-warning">R' + item.reportId + '</span></article>';
      });
    }

    function renderPlayer360(payload) {
      const t = extendedText().player360 || {};
      const player = payload.player;
      const mode = payload.mode || 'public';
      const title = document.querySelector("[data-player-360-title]");
      const visibility = document.querySelector("[data-player-360-visibility]");
      const accountWord = currentLocale === 'ru' ? 'аккаунт ' : currentLocale === 'es' ? 'cuenta ' : 'account ';
      if (title) title.textContent = player.userName + ' · ' + accountWord + player.accountId;
      if (visibility) {
        const visibilityLabels = currentLocale === 'ru'
          ? { public: 'Публичный режим', self: 'Личный режим', staff: 'Staff режим', private: 'Личные сообщения только для себя или staff', publicView: 'Публичная статистика и уровни доступны всем' }
          : currentLocale === 'es'
            ? { public: 'Modo público', self: 'Modo personal', staff: 'Modo staff', private: 'Mensajes privados solo para el dueño o staff', publicView: 'Estadísticas p?blicas y niveles visibles para todos' }
            : { public: 'Public mode', self: 'Personal mode', staff: 'Staff mode', private: 'Private messages only for self or staff', publicView: 'Public stats and levels visible to everyone' };
        const modeLabel = mode === 'staff' ? visibilityLabels.staff : mode === 'self' ? visibilityLabels.self : visibilityLabels.public;
        visibility.innerHTML = '<span class="chip">' + modeLabel + '</span><span class="chip">' + visibilityLabels.publicView + '</span><span class="chip">' + visibilityLabels.private + '</span>';
      }
      const metrics = document.querySelector("[data-player-360-metrics]");
      if (metrics) {
        const labels = currentLocale === 'ru'
          ? ['Звёзды','Алмазы','Креатор поинты', mode === 'public' ? 'Комментарии' : 'Cloud saves']
          : currentLocale === 'es'
            ? ['Estrellas','Diamantes','Creator points', mode === 'public' ? 'Comentarios' : 'Cloud saves']
            : ['Stars','Diamonds','Creator points', mode === 'public' ? 'Comments' : 'Cloud saves'];
        const demons = currentLocale === 'ru' ? 'демоны ' : currentLocale === 'es' ? 'demonios ' : 'demons ';
        const moons = currentLocale === 'ru' ? 'луны ' : currentLocale === 'es' ? 'lunas ' : 'moons ';
        const levels = currentLocale === 'ru' ? 'уровни ' : currentLocale === 'es' ? 'niveles ' : 'levels ';
        const messages = currentLocale === 'ru' ? 'сообщения ' : currentLocale === 'es' ? 'mensajes ' : 'messages ';
        const comments = currentLocale === 'ru' ? 'комментарии ' : currentLocale === 'es' ? 'comentarios ' : 'comments ';
        const fourthValue = mode === 'public' ? (player.activity.commentCount ?? 0) : (player.activity.saveCount ?? 0);
        const fourthDelta = mode === 'public' ? comments + (player.activity.commentCount ?? 0) : messages + (player.activity.messageCount ?? 0);
        const cards = [
          { label: labels[0], value: player.stats.stars, delta: demons + player.stats.demons, tone: 'success' },
          { label: labels[1], value: player.stats.diamonds, delta: moons + player.stats.moons, tone: 'accent' },
          { label: labels[2], value: player.stats.creatorPoints, delta: levels + player.activity.levelCount, tone: 'warning' },
          { label: labels[3], value: fourthValue, delta: fourthDelta, tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      const noLevels = t.noLevels || ['No player data','Select a player to inspect levels.'];
      const noMessages = mode === 'public'
        ? (currentLocale === 'ru'
            ? ['Личные сообщения скрыты','Обычные игроки не видят чужие приватные сообщения.']
            : currentLocale === 'es'
              ? ['Mensajes privados ocultos','Los jugadores normales no ven mensajes privados ajenos.']
              : ['Private messages hidden','Regular players cannot view private messages of other players.'])
        : (t.noMessages || ['No player data','Select a player to inspect messages.']);
      const noComments = t.noComments || ['No player data','Select a player to inspect comments.'];
      const likesWord = currentLocale === 'ru' ? 'лайки ' : currentLocale === 'es' ? 'likes ' : 'likes ';
      const downloadsWord = currentLocale === 'ru' ? 'скачивания ' : currentLocale === 'es' ? 'descargas ' : 'downloads ';
      const starsWord = currentLocale === 'ru' ? 'звёзды ' : currentLocale === 'es' ? 'estrellas ' : 'stars ';
      const fromWord = currentLocale === 'ru' ? 'от ' : (extendedText().content?.from || 'from ');
      const toWord = currentLocale === 'ru' ? 'кому ' : (extendedText().content?.to || 'to ');
      renderActivityList("[data-player-360-levels]", player.levels, noLevels[0], noLevels[1], 'IDLE', 'accent', function(level) {
        return '<article class="activity-card tone-success"><div><strong>' + level.name + '</strong><p>' + likesWord + level.likes + ' | ' + downloadsWord + level.downloads + ' | ' + starsWord + level.stars + '</p></div><span class="pill tone-success">L' + level.levelId + '</span></article>';
      });
      renderActivityList("[data-player-360-messages]", player.messages, noMessages[0], noMessages[1], 'MSG', 'accent', function(message) {
        return '<article class="activity-card tone-accent"><div><strong>' + message.subject + '</strong><p>' + fromWord + message.fromAccountId + ' | ' + toWord + message.toAccountId + '</p></div><span class="pill tone-accent">M' + message.messageId + '</span></article>';
      });
      renderActivityList("[data-player-360-comments]", player.comments, noComments[0], noComments[1], 'COM', 'accent', function(comment) {
        return '<article class="activity-card tone-accent"><div><strong>' + comment.userName + '</strong><p>' + comment.comment + '</p></div><span class="pill tone-accent">C' + comment.commentId + '</span></article>';
      });
    }
    function renderModeration(payload) {
      const t = extendedText().moderation || {};
      const empty = t.empty || ['Queue is empty','No reports are waiting for moderation review.'];
      const actionWord = currentLocale === 'ru' ? 'действие ' : currentLocale === 'es' ? 'acción ' : 'action ';
      renderActivityList("[data-moderation-queue]", payload.items, empty[0], empty[1], 'CLEAR', 'success', function(item) {
        return '<article class="activity-card tone-warning"><div><strong>' + item.levelName + '</strong><p>' + item.userName + ' | ' + actionWord + item.suggestedAction + '</p></div><span class="pill tone-warning">R' + item.reportId + '</span></article>';
      });
      const summary = document.querySelector("[data-moderation-summary]");
      if (summary) summary.innerHTML = '<span class="chip">' + (t.pending || 'Pending reports: ') + payload.total + '</span><span class="chip">' + (t.mode || 'Mode: live queue') + '</span>';
    }

    function renderSecurity(payload) {
      const t = extendedText().security || {};
      const metrics = document.querySelector("[data-security-metrics]");
      if (metrics) {
        const labels = t.labels || ['Login events','Suspicious IPs','Cloud backups','Privileged unlock'];
        const deltas = t.deltas || ['tracked accounts','current estimate','saved accounts','operator gate'];
        const onText = currentLocale === 'ru' ? '\u0412\u041a\u041b' : currentLocale === 'es' ? 'ACTIVO' : 'ON';
        const offText = currentLocale === 'ru' ? '\u0412\u042b\u041a\u041b' : currentLocale === 'es' ? 'APAGADO' : 'OFF';
        const cards = [
          { label: labels[0], value: payload.summary.loginEvents, delta: deltas[0], tone: 'accent' },
          { label: labels[1], value: payload.summary.suspiciousIps, delta: deltas[1], tone: 'warning' },
          { label: labels[2], value: payload.summary.cloudBackups, delta: deltas[2], tone: 'success' },
          { label: labels[3], value: payload.summary.privilegedUnlock ? onText : offText, delta: deltas[3], tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      const signals = document.querySelector("[data-security-signals]");
      if (signals) signals.innerHTML = '<span class="chip">' + (t.rate || 'Rate limits: ') + payload.summary.rateLimits + '</span><span class="chip">' + (t.twofa || '2FA: ') + payload.summary.twoFactor + '</span><span class="chip">' + (t.suspicious || 'Suspicious IPs: ') + payload.summary.suspiciousIps + '</span>';
      const noPosture = t.noPosture || ['No posture','No security posture is available.'];
      renderActivityList("[data-security-posture]", [{ title: t.access || 'Privileged access', meta: payload.summary.privilegedUnlock ? (t.enabled || 'Enabled with operator gate') : (t.disabled || 'Disabled'), tone: payload.summary.privilegedUnlock ? 'warning' : 'success', type: 'sec' }], noPosture[0], noPosture[1], 'SEC', 'accent', function(item) {
        return '<article class="activity-card tone-' + item.tone + '"><div><strong>' + item.title + '</strong><p>' + item.meta + '</p></div><span class="pill tone-' + item.tone + '">SEC</span></article>';
      });
    }

    function renderEvents(payload) {
      const t = extendedText().events || {};
      const metrics = document.querySelector("[data-events-metrics]");
      if (metrics) {
        const labels = t.labels || ['Features','Quests','Map packs','Vault codes'];
        const deltas = t.deltas || ['active rotations','templates','configured','reward entries'];
        const cards = [
          { label: labels[0], value: payload.summary.activeFeatures, delta: deltas[0], tone: 'accent' },
          { label: labels[1], value: payload.summary.quests, delta: deltas[1], tone: 'success' },
          { label: labels[2], value: payload.summary.mapPacks, delta: deltas[2], tone: 'warning' },
          { label: labels[3], value: payload.summary.vaultCodes, delta: deltas[3], tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      const noFeatures = t.noFeatures || ['No active features','No daily, weekly, or event rotations are configured.'];
      const noQuests = t.noQuests || ['No quest templates','No quest templates were found in the game store.'];
      const noVault = t.noVault || ['No vault codes','No active reward codes are available.'];
      const rewardsWord = currentLocale === 'ru' ? 'награды ' : currentLocale === 'es' ? 'recompensas ' : 'rewards ';
      const typeWord = currentLocale === 'ru' ? 'тип ' : currentLocale === 'es' ? 'tipo ' : 'type ';
      const amountWord = currentLocale === 'ru' ? 'количество ' : currentLocale === 'es' ? 'cantidad ' : 'amount ';
      const rewardWord = currentLocale === 'ru' ? 'награда ' : currentLocale === 'es' ? 'recompensa ' : 'reward ';
      const usesWord = currentLocale === 'ru' ? 'использований ' : currentLocale === 'es' ? 'usos ' : 'uses ';
      const rewardTitle = currentLocale === 'ru' ? 'Награда ' : currentLocale === 'es' ? 'Recompensa ' : 'Reward ';
      renderActivityList("[data-events-features]", payload.features, noFeatures[0], noFeatures[1], 'EVT', 'accent', function(item) {
        return '<article class="activity-card tone-accent"><div><strong>' + item.kind.toUpperCase() + ' | ' + item.levelName + '</strong><p>' + item.userName + ' | ' + rewardsWord + item.rewards + '</p></div><span class="pill tone-accent">L' + item.levelId + '</span></article>';
      });
      renderActivityList("[data-events-quests]", payload.quests, noQuests[0], noQuests[1], 'QST', 'accent', function(item) {
        return '<article class="activity-card tone-success"><div><strong>' + item.name + '</strong><p>' + typeWord + item.type + ' | ' + amountWord + item.amount + ' | ' + rewardWord + item.reward + '</p></div><span class="pill tone-success">Q' + item.questTemplateId + '</span></article>';
      });
      renderActivityList("[data-events-vault]", payload.vaultCodes, noVault[0], noVault[1], 'CODE', 'warning', function(item) {
        return '<article class="activity-card tone-warning"><div><strong>' + rewardTitle + item.rewardId + '</strong><p>' + rewardsWord + item.rewards + ' | ' + usesWord + item.uses + '</p></div><span class="pill tone-warning">VC</span></article>';
      });
    }

    function renderContentHub(payload) {
      const t = extendedText().content || {};
      const metrics = document.querySelector("[data-content-metrics]");
      if (metrics) {
        const labels = t.labels || ['Latest levels','Comments','Messages','Songs'];
        const deltas = t.deltas || ['recent uploads','recent entries','recent traffic','known songs'];
        const cards = [
          { label: labels[0], value: payload.summary.latestLevels, delta: deltas[0], tone: 'success' },
          { label: labels[1], value: payload.summary.comments, delta: deltas[1], tone: 'accent' },
          { label: labels[2], value: payload.summary.messages, delta: deltas[2], tone: 'warning' },
          { label: labels[3], value: payload.summary.songs, delta: deltas[3], tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      const noLevels = t.noLevels || ['No levels','No latest level content is available.'];
      const noComments = t.noComments || ['No comments','No recent comments are available.'];
      const noMessages = t.noMessages || ['No messages','No recent messages are available.'];
      const noNotes = t.noNotes || ['No notes','No announcement cards are configured.'];
      const likesWord = currentLocale === 'ru' ? 'лайки ' : currentLocale === 'es' ? 'likes ' : 'likes ';
      const downloadsWord = currentLocale === 'ru' ? 'скачивания ' : currentLocale === 'es' ? 'descargas ' : 'downloads ';
      renderActivityList("[data-content-levels]", payload.latestLevels, noLevels[0], noLevels[1], 'LVL', 'success', function(item) {
        return '<article class="activity-card tone-success"><div><strong>' + item.name + '</strong><p>' + item.userName + ' | ' + likesWord + item.likes + ' | ' + downloadsWord + item.downloads + '</p></div><span class="pill tone-success">L' + item.levelId + '</span></article>';
      });
      renderActivityList("[data-content-comments]", payload.latestComments, noComments[0], noComments[1], 'COM', 'accent', function(item) {
        return '<article class="activity-card tone-accent"><div><strong>' + item.userName + '</strong><p>' + item.comment + '</p></div><span class="pill tone-accent">C' + item.commentId + '</span></article>';
      });
      renderActivityList("[data-content-messages]", payload.latestMessages, noMessages[0], noMessages[1], 'MSG', 'accent', function(item) {
        return '<article class="activity-card tone-accent"><div><strong>' + item.subject + '</strong><p>' + (t.from || 'from ') + item.fromAccountId + ' | ' + (t.to || 'to ') + item.toAccountId + '</p></div><span class="pill tone-accent">M' + item.messageId + '</span></article>';
      });
      const noteTitle1 = currentLocale === 'ru' ? 'Поток управления проектом' : currentLocale === 'es' ? 'Flujo de control del proyecto' : 'Project control feed';
      const noteBody1 = currentLocale === 'ru' ? 'Используйте Content Hub для будущих анонсов, баннеров и публичных статусов для лаунчера.' : currentLocale === 'es' ? 'Usa Content Hub para futuros anuncios, banners y mensajes de estado del launcher.' : 'Use Content Hub for future dashboard-managed announcements, banners, and launcher-facing status messages.';
      const noteTitle2 = currentLocale === 'ru' ? 'Развитие контентного потока' : currentLocale === 'es' ? 'Evolución del flujo de contenido' : 'Content rollout';
      const noteBody2 = currentLocale === 'ru' ? 'Этот раздел будет принимать новые контентные сценарии по мере роста продукта.' : currentLocale === 'es' ? 'Esta sección absorberá más flujos de contenido gestionados desde el dashboard a medida que crezca el producto.' : 'This section will absorb more dashboard-managed content flows as the product expands.';
      renderActivityList("[data-content-announcements]", payload.announcements.map(function(item) {
        if (item.title === 'Project control feed') item = Object.assign({}, item, { title: noteTitle1, body: noteBody1 });
        if (item.title === 'Content rollout') item = Object.assign({}, item, { title: noteTitle2, body: noteBody2 });
        return item;
      }), noNotes[0], noNotes[1], 'NOTE', 'warning', function(item) {
        return '<article class="activity-card tone-' + item.tone + '"><div><strong>' + item.title + '</strong><p>' + item.body + '</p></div><span class="pill tone-' + item.tone + '">NOTE</span></article>';
      });
    }

    function renderUploadHub(payload) {
      const metrics = document.querySelector("[data-upload-metrics]");
      if (metrics) {
        const labels = currentLocale === 'ru' ? ['\u041c\u043e\u0438 \u043f\u0435\u0441\u043d\u0438','\u041f\u0435\u0441\u043d\u0438 \u043f\u043e \u0441\u0441\u044b\u043b\u043a\u0435','SFX','\u041f\u0435\u0440\u0435\u043d\u043e\u0441 / cron'] : currentLocale === 'es' ? ['Canciones propias','Canciones remotas','SFX','Transferencias / cron'] : ['Own songs','Linked songs','SFX','Transfers / cron'];
        const deltas = currentLocale === 'ru' ? ['\u0442\u0440\u0435\u043a\u0438 \u0438\u0433\u0440\u043e\u043a\u0430','\u0432\u043d\u0435\u0448\u043d\u0438\u0435 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438','\u0430\u0443\u0434\u0438\u043e-\u0441\u043b\u043e\u0442\u044b','\u043e\u043f\u0435\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0435 \u0437\u0430\u0434\u0430\u0447\u0438'] : currentLocale === 'es' ? ['pistas del jugador','fuentes remotas','ranuras de audio','tareas operativas'] : ['player tracks','remote sources','audio slots','operational tasks'];
        const cards = [
          { label: labels[0], value: payload.summary.ownSongs, delta: deltas[0], tone: 'accent' },
          { label: labels[1], value: payload.summary.linkedSongs, delta: deltas[1], tone: 'warning' },
          { label: labels[2], value: payload.summary.sfx, delta: deltas[2], tone: 'success' },
          { label: labels[3], value: String(payload.summary.transfers) + ' / ' + String(payload.summary.cronTasks), delta: deltas[3], tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      renderActivityList('[data-upload-actions]', payload.actions, currentLocale === 'ru' ? '\u041d\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439' : currentLocale === 'es' ? 'Sin acciones' : 'No actions', currentLocale === 'ru' ? '\u041f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0445 upload-\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439.' : currentLocale === 'es' ? 'No hay acciones de subida disponibles.' : 'No upload actions are available yet.', 'UP', 'accent', function(item) {
        return '<article class="activity-card tone-' + item.tone + '"><div><strong>' + item.title + '</strong><p>' + item.meta + '</p></div><span class="pill tone-' + item.tone + '">UP</span></article>';
      });
      renderActivityList('[data-upload-linked]', payload.linkedSongs, currentLocale === 'ru' ? '\u041d\u0435\u0442 \u0432\u043d\u0435\u0448\u043d\u0438\u0445 \u043f\u0435\u0441\u0435\u043d' : currentLocale === 'es' ? 'Sin canciones remotas' : 'No linked songs', currentLocale === 'ru' ? '\u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u0438\u043c\u043f\u043e\u0440\u0442\u044b \u0435\u0449\u0451 \u043d\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u044b.' : currentLocale === 'es' ? 'Todav?a no hay importaciones remotas registradas.' : 'No remote imports are registered yet.', 'URL', 'warning', function(item) {
        return '<article class="activity-card tone-warning"><div><strong>' + item.name + '</strong><p>' + item.authorName + ' | song ' + item.songId + '</p></div><span class="pill tone-warning">URL</span></article>';
      });
      renderActivityList('[data-upload-transfers]', payload.transfers, currentLocale === 'ru' ? '\u041d\u0435\u0442 \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u043e\u0432' : currentLocale === 'es' ? 'Sin transferencias' : 'No transfers', currentLocale === 'ru' ? '\u0423 \u044d\u0442\u043e\u0433\u043e \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 \u043d\u0435\u0442 \u0443\u0440\u043e\u0432\u043d\u0435\u0439 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u0430.' : currentLocale === 'es' ? 'Esta cuenta no tiene niveles para transferir.' : 'This account has no levels ready for transfer.', 'MOV', 'success', function(item) {
        return '<article class="activity-card tone-success"><div><strong>' + item.name + '</strong><p>' + item.userName + ' | level ' + item.levelId + '</p></div><span class="pill tone-success">MOV</span></article>';
      });
      renderActivityList('[data-upload-cron]', payload.cronTasks, currentLocale === 'ru' ? '\u041d\u0435\u0442 cron \u0437\u0430\u0434\u0430\u0447' : currentLocale === 'es' ? 'Sin tareas cron' : 'No cron tasks', currentLocale === 'ru' ? '\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0435\u0449\u0451 \u043d\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u044b.' : currentLocale === 'es' ? 'Las tareas automáticas aún no están configuradas.' : 'Automatic tasks are not configured yet.', 'JOB', 'accent', function(item) {
        return '<article class="activity-card tone-' + item.tone + '"><div><strong>' + item.title + '</strong><p>' + item.meta + '</p></div><span class="pill tone-' + item.tone + '">JOB</span></article>';
      });
    }

    function renderModTools(payload) {
      const metrics = document.querySelector("[data-mod-tools-metrics]");
      if (metrics) {
        const labels = currentLocale === 'ru' ? ['\u0420\u0435\u043f\u043e\u0440\u0442\u044b','Suggested','\u0421\u043a\u0440\u044b\u0442\u043e\u0435','Automod / vault'] : currentLocale === 'es' ? ['Reportes','Sugeridos','Ocultos','Automod / vault'] : ['Reports','Suggested','Hidden','Automod / vault'];
        const deltas = currentLocale === 'ru' ? ['\u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u0438','\u0443\u0440\u043e\u0432\u043d\u0438 \u0431\u0435\u0437 \u0440\u0435\u0439\u0442\u0430','\u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u0443\u0440\u043e\u0432\u043d\u0438','\u0441\u0438\u0441\u0442\u0435\u043c\u043d\u044b\u0435 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u0438'] : currentLocale === 'es' ? ['en cola','niveles sin rate','niveles ocultos','controles del sistema'] : ['in queue','unrated levels','hidden levels','system controls'];
        const cards = [
          { label: labels[0], value: payload.summary.reports, delta: deltas[0], tone: 'warning' },
          { label: labels[1], value: payload.summary.suggested, delta: deltas[1], tone: 'accent' },
          { label: labels[2], value: payload.summary.hiddenLevels, delta: deltas[2], tone: 'success' },
          { label: labels[3], value: String(payload.summary.bans || 0) + ' / ' + String(payload.summary.vaultCodes), delta: deltas[3], tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      renderActivityList('[data-mod-tools-reports]', payload.reports, currentLocale === 'ru' ? '\u041d\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439' : currentLocale === 'es' ? 'Sin reportes' : 'No reports', currentLocale === 'ru' ? '\u0412 \u043e\u0447\u0435\u0440\u0435\u0434\u0438 \u043d\u0435\u0442 \u0432\u0445\u043e\u0434\u044f\u0449\u0438\u0445 \u0440\u0435\u043f\u043e\u0440\u0442\u043e\u0432.' : currentLocale === 'es' ? 'No hay reportes entrantes en cola.' : 'No incoming reports are queued right now.', 'RPT', 'warning', function(item) {
        return '<article class="activity-card tone-warning"><div><strong>' + item.levelName + '</strong><p>' + item.userName + ' | ' + item.suggestedAction + '</p></div><span class="pill tone-warning">R' + item.reportId + '</span></article>';
      });
      renderActivityList('[data-mod-tools-suggested]', payload.suggested, currentLocale === 'ru' ? '\u041d\u0435\u0442 suggested \u0443\u0440\u043e\u0432\u043d\u0435\u0439' : currentLocale === 'es' ? 'Sin niveles sugeridos' : 'No suggested levels', currentLocale === 'ru' ? '\u041d\u0435\u0442 \u0443\u0440\u043e\u0432\u043d\u0435\u0439 \u0431\u0435\u0437 \u0440\u0435\u0439\u0442\u0430 \u0434\u043b\u044f \u0431\u044b\u0441\u0442\u0440\u043e\u0439 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438.' : currentLocale === 'es' ? 'No hay niveles sin rate para revisi?n r?pida.' : 'No unrated levels are waiting for fast review.', 'SUG', 'accent', function(item) {
        return '<article class="activity-card tone-accent"><div><strong>' + item.name + '</strong><p>' + item.userName + ' | stars ' + item.stars + '</p></div><span class="pill tone-accent">L' + item.levelId + '</span></article>';
      });
      const system = document.querySelector("[data-mod-tools-system]");
      if (system) system.innerHTML = payload.system.map(function(item) { return '<span class="chip">' + item.label + ': ' + item.value + '</span>'; }).join('');
    }

    function renderIntegrations(payload) {
      const telegram = document.querySelector('[data-integrations-telegram]');
      const discord = document.querySelector('[data-integrations-discord]');
      const visibility = document.querySelector('[data-integrations-visibility]');
      const noData = currentLocale === 'ru' ? ['Не опубликовано','Публичные интеграции отключены.'] : currentLocale === 'es' ? ['No publicado','Las integraciones públicas están desactivadas.'] : ['Not published','Public integrations are disabled.'];
      if (telegram) {
        const item = payload.telegram && payload.telegram.enabled ? payload.telegram : null;
        telegram.innerHTML = item
          ? '<article class="activity-card tone-success"><div><strong>@' + item.botUsername + '</strong><p>' + item.botUrl + '</p></div><span class="pill tone-success">TG</span></article>'
          : '<article class="activity-card tone-warning"><div><strong>' + noData[0] + '</strong><p>' + noData[1] + '</p></div><span class="pill tone-warning">TG</span></article>';
      }
      if (discord) {
        const item = payload.discord && payload.discord.enabled ? payload.discord : null;
        discord.innerHTML = item
          ? '<article class="activity-card tone-accent"><div><strong>Discord</strong><p>' + (item.serverUrl || item.botUrl) + '</p></div><span class="pill tone-accent">DC</span></article>'
          : '<article class="activity-card tone-warning"><div><strong>' + noData[0] + '</strong><p>' + noData[1] + '</p></div><span class="pill tone-warning">DC</span></article>';
      }
      if (visibility) {
        const chips = [];
        chips.push('<span class="chip">mode: ' + payload.mode + '</span>');
        chips.push('<span class="chip">telegram: ' + ((payload.telegram && payload.telegram.enabled) ? 'visible' : 'hidden') + '</span>');
        chips.push('<span class="chip">discord: ' + ((payload.discord && payload.discord.enabled) ? 'visible' : 'hidden') + '</span>');
        if (payload.controls) payload.controls.forEach(function(item) { chips.push('<span class="chip">' + item.label + ': ' + item.value + '</span>'); });
        visibility.innerHTML = chips.join('');
      }
    }

    function renderStatsSuite(payload) {
      const metrics = document.querySelector("[data-stats-suite-metrics]");
      if (metrics) {
        const labels = currentLocale === 'ru' ? ['\u0420\u043e\u0442\u0430\u0446\u0438\u0438','\u041c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440\u044b','\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f','\u041b\u0438\u0434\u0435\u0440\u044b'] : currentLocale === 'es' ? ['Rotaciones','Moderadores','Acciones','Leaderboard'] : ['Rotations','Moderators','Actions','Leaderboard'];
        const deltas = currentLocale === 'ru' ? ['daily/weekly/event','staff-\u0441\u043e\u0441\u0442\u0430\u0432','mod actions','\u0442\u043e\u043f \u0438\u0433\u0440\u043e\u043a\u043e\u0432'] : currentLocale === 'es' ? ['daily/weekly/event','roster staff','acciones mod','top jugadores'] : ['daily/weekly/event','staff roster','mod actions','top players'];
        const cards = [
          { label: labels[0], value: payload.summary.dailyFeatures, delta: deltas[0], tone: 'success' },
          { label: labels[1], value: payload.summary.moderators, delta: deltas[1], tone: 'accent' },
          { label: labels[2], value: payload.summary.modActions, delta: deltas[2], tone: 'warning' },
          { label: labels[3], value: payload.summary.leaderboardRows, delta: deltas[3], tone: 'danger' }
        ];
        metrics.innerHTML = cards.map(function(card) { return '<article class="metric-card tone-' + card.tone + '"><span class="metric-label">' + card.label + '</span><strong class="metric-value">' + card.value + '</strong><span class="metric-delta">' + card.delta + '</span></article>'; }).join('');
      }
      renderActivityList('[data-stats-suite-daily]', payload.dailyFeatures, currentLocale === 'ru' ? '\u041d\u0435\u0442 \u0440\u043e\u0442\u0430\u0446\u0438\u0439' : currentLocale === 'es' ? 'Sin rotaciones' : 'No rotations', currentLocale === 'ru' ? 'Daily/weekly \u0441\u043b\u043e\u0442\u044b \u0435\u0449\u0451 \u043d\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u044b.' : currentLocale === 'es' ? 'Los slots daily/weekly aún no están configurados.' : 'Daily/weekly slots are not configured yet.', 'DAY', 'success', function(item) {
        return '<article class="activity-card tone-success"><div><strong>' + item.kind.toUpperCase() + ' | ' + item.levelName + '</strong><p>' + item.userName + ' | level ' + item.levelId + '</p></div><span class="pill tone-success">DAY</span></article>';
      });
      renderActivityList('[data-stats-suite-mods]', payload.moderators, currentLocale === 'ru' ? '\u041d\u0435\u0442 \u043c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440\u043e\u0432' : currentLocale === 'es' ? 'Sin moderadores' : 'No moderators', currentLocale === 'ru' ? '\u0412 store \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d staff-\u0441\u043e\u0441\u0442\u0430\u0432.' : currentLocale === 'es' ? 'No se encontr? roster de staff en el store.' : 'No staff roster was found in the store.', 'MOD', 'accent', function(item) {
        return '<article class="activity-card tone-accent"><div><strong>' + item.userName + '</strong><p>' + item.roles.join(' / ') + '</p></div><span class="pill tone-accent">M' + item.accountId + '</span></article>';
      });
      renderActivityList('[data-stats-suite-leaderboard]', payload.leaderboard, currentLocale === 'ru' ? '\u041d\u0435\u0442 \u0440\u043e\u0442\u0430\u0446\u0438\u0439' : currentLocale === 'es' ? 'Sin jugadores' : 'No players', currentLocale === 'ru' ? '\u041b\u0438\u0434\u0435\u0440\u0431\u043e\u0440\u0434 \u0441\u0435\u0439\u0447\u0430\u0441 \u043f\u0443\u0441\u0442.' : currentLocale === 'es' ? 'El leaderboard está vacío.' : 'The leaderboard is empty right now.', 'TOP', 'warning', function(item) {
        return '<article class="activity-card tone-warning"><div><strong>' + item.userName + '</strong><p>stars ' + item.stars + ' | cp ' + item.creatorPoints + '</p></div><span class="pill tone-warning">U' + item.userId + '</span></article>';
      });
      const actions = document.querySelector("[data-stats-suite-actions]");
      if (actions) actions.innerHTML = payload.actions.map(function(item) { return '<span class="chip">' + item.label + ': ' + item.value + '</span>'; }).join('');
    }

    async function loadInfo() { const response = await fetch("/dashboard/api/info"); const payload = await response.json(); if (payload && payload.name) { document.querySelectorAll("[data-brand-project]").forEach(function(node) { node.textContent = payload.name; }); document.title = payload.name + " Dashboard"; } if (payload && payload.publicFeatures) { window.__bcgcPublicFeatures = payload.publicFeatures; } if (payload && payload.dashboardDefaults) { if (!localStorage.getItem("bcgc-dashboard-theme")) { applyTheme(payload.dashboardDefaults.defaultTheme || boot.defaultTheme); } if (settingsDefaultThemeSelect) settingsDefaultThemeSelect.value = payload.dashboardDefaults.defaultTheme || boot.defaultTheme; if (settingsAllowThemeOverride) settingsAllowThemeOverride.checked = payload.dashboardDefaults.allowUserThemeOverride !== false; } }
    async function loadProjectSettings() {
      if (!settingsProjectName || !settingsProjectStatus) return;
      const result = await api("/dashboard/api/settings/project");
      if (!result.ok || !result.payload.success) { setStatus(settingsProjectStatus, dict().settings.failed, "error"); return; }
      settingsProjectName.value = result.payload.projectName || "";
      if (settingsDefaultThemeSelect) settingsDefaultThemeSelect.value = result.payload.defaultTheme || boot.defaultTheme;
      if (settingsAllowThemeOverride) settingsAllowThemeOverride.checked = result.payload.allowUserThemeOverride !== false;
      if (settingsPublicStatistics) settingsPublicStatistics.checked = result.payload.publicStatisticsEnabled !== false;
      if (settingsPublicIntegrations) settingsPublicIntegrations.checked = result.payload.publicIntegrationsEnabled !== false;
      if (settingsTelegramEnabled) settingsTelegramEnabled.checked = result.payload.integrations?.telegram?.enabled !== false;
      if (settingsTelegramUsername) settingsTelegramUsername.value = result.payload.integrations?.telegram?.botUsername || '';
      if (settingsTelegramUrl) settingsTelegramUrl.value = result.payload.integrations?.telegram?.botUrl || '';
      if (settingsDiscordEnabled) settingsDiscordEnabled.checked = result.payload.integrations?.discord?.enabled !== false;
      if (settingsDiscordBotUrl) settingsDiscordBotUrl.value = result.payload.integrations?.discord?.botUrl || '';
      if (settingsDiscordServerUrl) settingsDiscordServerUrl.value = result.payload.integrations?.discord?.serverUrl || '';
      window.__bcgcPublicFeatures = { statistics: result.payload.publicStatisticsEnabled !== false, integrations: result.payload.publicIntegrationsEnabled !== false };
      setStatus(settingsProjectStatus, dict().settings.idle, "");
      if (settingsDefaultsStatus) setStatus(settingsDefaultsStatus, dict().settings.defaultsNote, "");
    }
    async function saveProjectSettings() {
      if (!settingsProjectName || !settingsProjectStatus || !settingsSaveProjectButton) return;
      setStatus(settingsProjectStatus, dict().settings.saving, "");
      settingsSaveProjectButton.disabled = true;
      try {
        const result = await api("/dashboard/api/settings/project", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ projectName: settingsProjectName.value.trim(), defaultTheme: settingsDefaultThemeSelect ? settingsDefaultThemeSelect.value : boot.defaultTheme, allowUserThemeOverride: settingsAllowThemeOverride ? settingsAllowThemeOverride.checked : true, publicStatisticsEnabled: settingsPublicStatistics ? settingsPublicStatistics.checked : true, publicIntegrationsEnabled: settingsPublicIntegrations ? settingsPublicIntegrations.checked : true, telegramEnabled: settingsTelegramEnabled ? settingsTelegramEnabled.checked : true, telegramBotUsername: settingsTelegramUsername ? settingsTelegramUsername.value.trim() : "", telegramBotUrl: settingsTelegramUrl ? settingsTelegramUrl.value.trim() : "", discordEnabled: settingsDiscordEnabled ? settingsDiscordEnabled.checked : true, discordBotUrl: settingsDiscordBotUrl ? settingsDiscordBotUrl.value.trim() : "", discordServerUrl: settingsDiscordServerUrl ? settingsDiscordServerUrl.value.trim() : "" }) });
        if (!result.ok || !result.payload.success) {
          if (result.status === 403) { setStatus(settingsProjectStatus, dict().settings.forbidden, "error"); return; }
          setStatus(settingsProjectStatus, result.payload.error || dict().settings.failed, "error"); return;
        }
        document.querySelectorAll("[data-brand-project]").forEach(function(node) { node.textContent = result.payload.projectName; });
        document.title = result.payload.projectName + " Dashboard";
        setStatus(settingsProjectStatus, dict().settings.saved, "success");
        if (settingsDefaultsStatus) setStatus(settingsDefaultsStatus, dict().settings.defaultsSaved, "success");
      } finally {
        settingsSaveProjectButton.disabled = false;
      }
    }
    async function createSong(linked) {
      const name = (uploadSongName && uploadSongName.value ? uploadSongName.value : "").trim();
      const authorName = (uploadSongAuthor && uploadSongAuthor.value ? uploadSongAuthor.value : "").trim();
      const sourceUrl = (uploadSongUrl && uploadSongUrl.value ? uploadSongUrl.value : "").trim();
      const failText = currentLocale === "ru" ? "Не удалось создать песню." : (currentLocale === "es" ? "No se pudo crear la canción." : "Failed to create song.");
      const okText = currentLocale === "ru" ? "Песня создана." : (currentLocale === "es" ? "Canción creada." : "Song created.");
      if (!name) { setStatus(uploadActionStatus, currentLocale === "ru" ? "Введите название песни." : (currentLocale === "es" ? "Introduce el nombre de la canción." : "Enter song name."), "error"); return; }
      if (linked && !sourceUrl) { setStatus(uploadActionStatus, currentLocale === "ru" ? "Для linked song нужен URL." : (currentLocale === "es" ? "Para canción enlazada se requiere URL." : "Linked song requires URL."), "error"); return; }
      setStatus(uploadActionStatus, currentLocale === "ru" ? "Сохраняю..." : (currentLocale === "es" ? "Guardando..." : "Saving..."), "");
      const endpoint = linked ? "/dashboard/api/upload/song-link" : "/dashboard/api/upload/song";
      const result = await api(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: name, authorName: authorName || undefined, sourceUrl: sourceUrl || undefined }) });
      if (!result.ok || !result.payload.success) { setStatus(uploadActionStatus, result.payload.error || failText, "error"); return; }
      setStatus(uploadActionStatus, okText, "success");
      if (uploadSongName) uploadSongName.value = "";
      if (uploadSongUrl) uploadSongUrl.value = "";
      await hydrate();
    }

    async function resolveReportAction() {
      const reportId = Number(modReportId && modReportId.value ? modReportId.value : "0");
      if (!reportId) { setStatus(modActionStatus, currentLocale === "ru" ? "Введите Report ID." : (currentLocale === "es" ? "Introduce Report ID." : "Enter report ID."), "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Обновляю..." : (currentLocale === "es" ? "Actualizando..." : "Updating..."), "");
      const result = await api("/dashboard/api/mod-tools/report/resolve", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reportId: reportId }) });
      if (!result.ok || !result.payload.success) { setStatus(modActionStatus, result.payload.error || "Failed", "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Репорт закрыт." : (currentLocale === "es" ? "Reporte resuelto." : "Report resolved."), "success");
      await hydrate();
    }

    async function hideLevelAction() {
      const levelId = Number(modLevelId && modLevelId.value ? modLevelId.value : "0");
      if (!levelId) { setStatus(modActionStatus, currentLocale === "ru" ? "Введите Level ID." : (currentLocale === "es" ? "Introduce Level ID." : "Enter level ID."), "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Обновляю..." : (currentLocale === "es" ? "Actualizando..." : "Updating..."), "");
      const result = await api("/dashboard/api/mod-tools/level/hide", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ levelId: levelId, hidden: true }) });
      if (!result.ok || !result.payload.success) { setStatus(modActionStatus, result.payload.error || "Failed", "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Уровень скрыт." : (currentLocale === "es" ? "Nivel ocultado." : "Level hidden."), "success");
      await hydrate();
    }

    async function addVaultAction() {
      const code = (modVaultCode && modVaultCode.value ? modVaultCode.value : "").trim();
      const rewards = (modVaultRewards && modVaultRewards.value ? modVaultRewards.value : "").trim();
      if (!code || !rewards) { setStatus(modActionStatus, currentLocale === "ru" ? "Введите code и rewards." : (currentLocale === "es" ? "Introduce code y rewards." : "Enter code and rewards."), "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Обновляю..." : (currentLocale === "es" ? "Actualizando..." : "Updating..."), "");
      const result = await api("/dashboard/api/mod-tools/vault/add", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: code, rewards: rewards }) });
      if (!result.ok || !result.payload.success) { setStatus(modActionStatus, result.payload.error || "Failed", "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Код добавлен." : (currentLocale === "es" ? "Código añadido." : "Code added."), "success");
      if (modVaultCode) modVaultCode.value = "";
      if (modVaultRewards) modVaultRewards.value = "";
      await hydrate();
    }


    async function banAccountAction() {
      const accountId = Number(modAccountId && modAccountId.value ? modAccountId.value : "0");
      const reason = (modBanReason && modBanReason.value ? modBanReason.value : "").trim();
      if (!accountId) { setStatus(modActionStatus, currentLocale === "ru" ? "Введите Account ID." : (currentLocale === "es" ? "Introduce Account ID." : "Enter account ID."), "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Обновляю..." : (currentLocale === "es" ? "Actualizando..." : "Updating..."), "");
      const result = await api("/dashboard/api/mod-tools/account/ban", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ accountId: accountId, reason: reason || undefined, banned: true }) });
      if (!result.ok || !result.payload.success) { setStatus(modActionStatus, result.payload.error || "Failed", "error"); return; }
      setStatus(modActionStatus, currentLocale === "ru" ? "Аккаунт забанен." : (currentLocale === "es" ? "Cuenta baneada." : "Account banned."), "success");
      if (modAccountId) modAccountId.value = "";
      if (modBanReason) modBanReason.value = "";
      await hydrate();
    }    async function loadPlayerList() { const result = await api("/dashboard/api/players?limit=5"); if (result.ok && result.payload.success) renderPlayerList(result.payload.players); }
    async function loadPlayer360(query) { if (!playerSearchStatus) return; setStatus(playerSearchStatus, (currentLocale === "ru" ? "Загружаю игрока..." : (currentLocale === "es" ? "Cargando jugador..." : "Loading player...")), ""); const lookup = String(query || "").trim(); const listResult = await api("/dashboard/api/players?search=" + encodeURIComponent(lookup) + "&limit=1"); if (!listResult.ok || !listResult.payload.success || !(listResult.payload.players || []).length) { setStatus(playerSearchStatus, (currentLocale === "ru" ? "Игрок не найден или данные недоступны." : (currentLocale === "es" ? "Jugador no encontrado o no disponible." : "Player not found or unavailable.")), "error"); return; } const player = listResult.payload.players[0]; const detailResult = await api("/dashboard/api/player-360?accountId=" + encodeURIComponent(player.accountId)); if (!detailResult.ok || !detailResult.payload.success) { setStatus(playerSearchStatus, (currentLocale === "ru" ? "Игрок не найден или данные недоступны." : (currentLocale === "es" ? "Jugador no encontrado o no disponible." : "Player not found or unavailable.")), "error"); return; } renderPlayer360(detailResult.payload); const p = (extendedText().player360 || {}); setStatus(playerSearchStatus, player.userName + ' ' + (p.loaded || 'loaded') + '.', "success"); }
    async function hydrate() {
      if (!token) { window.location.href = "./login.html"; return; }
      const meResult = await api("/dashboard/api/me");
      if (!meResult.ok || !meResult.payload.success) { localStorage.removeItem("dashboard_token"); window.location.href = "./login.html"; return; }
      setUser(meResult.payload.user);
      const overviewResult = await api("/dashboard/api/overview");
      if (overviewResult.ok && overviewResult.payload.success) { renderMetrics(overviewResult.payload.summary); renderLatestLevels(overviewResult.payload.highlights.latestLevels); renderSignals(overviewResult.payload.highlights.suspiciousSignals); }
      const liveResult = await api("/dashboard/api/live-feed");
      if (liveResult.ok && liveResult.payload.success) renderFeed(liveResult.payload.items);
      const liveControlResult = await api("/dashboard/api/live-control");
      if (liveControlResult.ok && liveControlResult.payload.success) renderLiveControl(liveControlResult.payload);
      const moderationResult = await api("/dashboard/api/moderation/queue");
      if (moderationResult.ok && moderationResult.payload.success) renderModeration(moderationResult.payload);
      const securityResult = await api("/dashboard/api/security/summary");
      if (securityResult.ok && securityResult.payload.success) renderSecurity(securityResult.payload);
      const eventsResult = await api("/dashboard/api/events/studio");
      if (eventsResult.ok && eventsResult.payload.success) renderEvents(eventsResult.payload);
      const contentResult = await api("/dashboard/api/content/hub");
      if (contentResult.ok && contentResult.payload.success) renderContentHub(contentResult.payload);
      const accountManageResult = await api("/dashboard/api/account/manage");
      if (accountManageResult.ok && accountManageResult.payload.success) renderAccountManage(accountManageResult.payload);
      const browseLevelsResult = await api("/dashboard/api/browse/levels?limit=12");
      if (browseLevelsResult.ok && browseLevelsResult.payload.success) renderBrowseLevels(browseLevelsResult.payload);
      const browseSongsResult = await api("/dashboard/api/browse/songs?limit=12");
      if (browseSongsResult.ok && browseSongsResult.payload.success) renderBrowseSongs(browseSongsResult.payload);
      const uploadHubResult = await api("/dashboard/api/upload/hub");
      if (uploadHubResult.ok && uploadHubResult.payload.success) renderUploadHub(uploadHubResult.payload);
      const modToolsResult = await api("/dashboard/api/mod-tools");
      if (modToolsResult.ok && modToolsResult.payload.success) renderModTools(modToolsResult.payload);
      const statsSuiteResult = await api("/dashboard/api/statistics/suite");
      if (statsSuiteResult.ok && statsSuiteResult.payload.success) renderStatsSuite(statsSuiteResult.payload);
      const integrationsResult = await api("/dashboard/api/integrations");
      if (integrationsResult.ok && integrationsResult.payload.success) renderIntegrations(integrationsResult.payload);
      await loadProjectSettings();
      await loadPlayerList();
    }
    pageButtons.forEach(function(button) { button.addEventListener("click", function() { openPage(button.dataset.pageTrigger); }); });
    themeButtons.forEach(function(button) { button.addEventListener("click", function() { applyTheme(button.dataset.themeSwitch); if (settingsThemeStatus) setStatus(settingsThemeStatus, dict().settings.themeApplied, "success"); }); });
    if (settingsApplyThemeButton) settingsApplyThemeButton.addEventListener("click", function() { applyTheme(settingsThemeSelect ? settingsThemeSelect.value : savedTheme); if (settingsThemeStatus) setStatus(settingsThemeStatus, dict().settings.themeApplied, "success"); });
    if (settingsSaveProjectButton) settingsSaveProjectButton.addEventListener("click", saveProjectSettings);
    if (settingsSaveDefaultsButton) settingsSaveDefaultsButton.addEventListener("click", saveProjectSettings);
    if (playerSearchButton) playerSearchButton.addEventListener("click", function() { if (playerSearchInput) loadPlayer360(playerSearchInput.value); });
    if (playerSearchInput) playerSearchInput.addEventListener("keydown", function(event) { if (event.key === "Enter") loadPlayer360(playerSearchInput.value); });
    if (uploadCreateLocalButton) uploadCreateLocalButton.addEventListener("click", function() { createSong(false); });
    if (uploadCreateLinkedButton) uploadCreateLinkedButton.addEventListener("click", function() { createSong(true); });
    if (modResolveReportButton) modResolveReportButton.addEventListener("click", resolveReportAction);
    if (modHideLevelButton) modHideLevelButton.addEventListener("click", hideLevelAction);
    if (modAddVaultButton) modAddVaultButton.addEventListener("click", addVaultAction);
    if (modBanAccountButton) modBanAccountButton.addEventListener("click", banAccountAction);
    localeSelects.forEach(function(node) { node.addEventListener("change", function(event) { applyLocale(event.target.value); hydrate(); }); });
    if (logoutButton) logoutButton.addEventListener("click", function() { localStorage.removeItem("dashboard_token"); localStorage.removeItem("dashboard_user"); window.location.href = "./login.html"; });
    loadInfo();
    applyTheme(savedTheme);
    applyLocale(savedLocale);
    openPage("home");
    hydrate();
  `;
}
export function loginScript(): string {
  return `
    const localeSelect = document.querySelector("[data-login-locale]");
    const submitButton = document.querySelector("[data-login-submit]");
    const errorBox = document.querySelector("[data-login-error]");
    const infoName = document.querySelector("[data-login-project]");
    const modeButtons = Array.from(document.querySelectorAll("[data-auth-mode]"));
    const registerOnly = Array.from(document.querySelectorAll(".auth-register-only"));
    const userNameInput = document.querySelector("[data-login-username]");
    const emailInput = document.querySelector("[data-register-email]");
    const passwordInput = document.querySelector("[data-login-password]");
    const confirmInput = document.querySelector("[data-register-confirm]");
    const savedLocale = localStorage.getItem("bcgc-dashboard-locale") || "ru";
    let mode = "login";
    let currentLocale = savedLocale;
    const i18n = {
      ru: { t: ['Доступ через аккаунт Geometry Dash', 'аккаунт-портал', 'Вход выполняется через ваш аккаунт Geometry Dash. Регистрация ниже создаёт тот же аккаунт для GDPS core и для входа в Dashboard.', 'Войти', 'Регистрация', 'Язык', 'Имя пользователя', 'Email', 'Пароль', 'Подтверждение пароля', 'Создать GDPS аккаунт', 'Гайд по staff-доступу', 'Поддерживаемые языки: Русский, English, Español. Если доступ в Dashboard ограничен, регистрация всё равно создаст ваш GDPS-аккаунт для игры.', 'Имя пользователя Geometry Dash', 'Email для вашего GDPS-аккаунта', 'Текущий пароль', 'Повторите пароль'], e: ['Заполните все обязательные поля.', 'Регистрация не удалась.', 'Вход не удался.', 'Dashboard API недоступен.', 'GDPS-аккаунт создан. Доступ в Dashboard для этого аккаунта пока недоступен.'] },      en: { t: ["Geometry Dash account access", "account portal", "Sign in with your Geometry Dash account. Registration below creates the same account for the GDPS core and the dashboard entry point.", "Sign in", "Register", "Language", "Username", "Email", "Password", "Confirm password", "Create GDPS account", "Staff access guide", "Supported locales: Русский, English, Español. If dashboard access is restricted, registration still creates your GDPS account for the game.", "Geometry Dash username", "Email for your GDPS account", "Current password", "Repeat password"], e: ["Fill in all required fields.", "Registration failed.", "Login failed.", "Dashboard API is unavailable.", "GDPS account created. Dashboard access is not available for this account yet."] },
      es: { t: ["Acceso con cuenta de Geometry Dash", "portal de cuenta", "Inicia sesión con tu cuenta de Geometry Dash. El registro de abajo crea la misma cuenta para el GDPS core y el acceso al Dashboard.", "Entrar", "Registrar", "Idioma", "Usuario", "Email", "Contraseña", "Confirmar contraseña", "Crear cuenta GDPS", "Guía de staff", "Idiomas soportados: Русский, English, Español. Si el acceso al Dashboard está restringido, el registro aún creará tu cuenta GDPS para el juego.", "Usuario de Geometry Dash", "Email para tu cuenta GDPS", "Contraseña actual", "Repite la contraseña"], e: ["Completa todos los campos obligatorios.", "El registro falló.", "El inicio de sesión falló.", "Dashboard API no está disponible.", "Cuenta GDPS creada. El acceso al Dashboard aún no está disponible para esta cuenta."] }
    };
    function dict() { return i18n[currentLocale] || i18n.en; }
    function setError(message) { if (!errorBox) return; errorBox.textContent = message; errorBox.hidden = !message; }
    function applyLocale(locale) { currentLocale = locale; localStorage.setItem("bcgc-dashboard-locale", locale); if (localeSelect) localeSelect.value = locale; const t = dict().t; document.querySelector('[data-i18n="login.subtitle"]').textContent = t[0]; document.querySelector('[data-i18n="login.portal"]').textContent = t[1]; document.querySelector('[data-i18n="login.copy"]').textContent = t[2]; document.querySelector('[data-auth-mode="login"]').textContent = t[3]; document.querySelector('[data-auth-mode="register"]').textContent = t[4]; document.querySelector('[data-i18n="login.language"]').textContent = t[5]; document.querySelector('[data-i18n="login.username"]').textContent = t[6]; document.querySelector('[data-i18n="login.email"]').textContent = t[7]; document.querySelector('[data-i18n="login.password"]').textContent = t[8]; document.querySelector('[data-i18n="login.confirm"]').textContent = t[9]; document.querySelector('[data-i18n="login.staffGuide"]').textContent = t[11]; document.querySelector('[data-i18n="login.note"]').textContent = t[12]; userNameInput.setAttribute('placeholder', t[13]); if (emailInput) emailInput.setAttribute('placeholder', t[14]); passwordInput.setAttribute('placeholder', t[15]); if (confirmInput) confirmInput.setAttribute('placeholder', t[16]); if (submitButton) submitButton.textContent = mode === 'register' ? t[10] : t[3]; }
    function setMode(nextMode) { mode = nextMode; registerOnly.forEach(function(node) { const shouldShow = nextMode === "register"; node.hidden = !shouldShow; node.style.display = shouldShow ? "grid" : "none"; }); modeButtons.forEach(function(button) { const active = button.dataset.authMode === nextMode; button.classList.toggle("solid-button", active); button.classList.toggle("ghost-button", !active); }); const t = dict().t; if (submitButton) submitButton.textContent = nextMode === "register" ? t[10] : t[3]; setError(""); }
    async function loadInfo() { const response = await fetch("/dashboard/api/info"); const payload = await response.json(); if (payload && payload.name && infoName) infoName.textContent = payload.name; }
    async function submit() { const userName = userNameInput.value.trim(); const password = passwordInput.value; const email = emailInput ? emailInput.value.trim() : ""; const confirmPassword = confirmInput ? confirmInput.value : ""; const e = dict().e; if (!userName || !password || (mode === "register" && (!email || !confirmPassword))) { setError(e[0]); return; } submitButton.disabled = true; setError(""); try { const endpoint = mode === "register" ? "/dashboard/api/register" : "/dashboard/api/login"; const body = mode === "register" ? { userName: userName, email: email, password: password, confirmPassword: confirmPassword } : { userName: userName, password: password }; const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const payload = await response.json(); if (!response.ok || !payload.success) { setError(payload.error || (mode === "register" ? e[1] : e[2])); return; } if (payload.token && payload.user) { localStorage.setItem("dashboard_token", payload.token); localStorage.setItem("dashboard_user", JSON.stringify(payload.user)); window.location.href = "./index.html"; return; } if (payload.accountCreated) { setError(payload.message || e[4]); return; } } catch (error) { setError(e[3]); } finally { submitButton.disabled = false; } }
    if (localeSelect) localeSelect.addEventListener("change", function(event) { applyLocale(event.target.value); }); modeButtons.forEach(function(button) { button.addEventListener("click", function() { setMode(button.dataset.authMode); }); }); if (submitButton) submitButton.addEventListener("click", submit); document.addEventListener("keydown", function(event) { if (event.key === "Enter") submit(); }); applyLocale(savedLocale); setMode("login"); loadInfo();
  `;
}


















































