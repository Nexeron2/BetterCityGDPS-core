export type DashboardTheme = {
  id: string;
  label: string;
  category: string;
  description: string;
  preview: string;
  personality: string;
  cues: string[];
  palette: {
    bg: string;
    panel: string;
    panelAlt: string;
    text: string;
    muted: string;
    accent: string;
    accentAlt: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
    glow: string;
  };
};

export type DashboardSection = {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  description: string;
};

export type DashboardGroup = {
  title: string;
  sections: DashboardSection[];
};

export type MetricCard = {
  label: string;
  value: string;
  delta: string;
  tone: "accent" | "success" | "warning" | "danger";
};

export type ActivityItem = {
  title: string;
  meta: string;
  badge: string;
  tone: "accent" | "success" | "warning" | "danger";
};

export type WowFeature = {
  title: string;
  kicker: string;
  description: string;
};

export const dashboardGroups: DashboardGroup[] = [
  {
    title: "Overview",
    sections: [
      { id: "home", icon: "HM", label: "Home", description: "Main page with core overview, activity, and quick actions." },
      { id: "live-control", icon: "LC", label: "Live Control", badge: "LIVE", description: "Online status, fresh events, API errors, and incoming live feed." }
    ]
  },
  {
    title: "Players",
    sections: [
      { id: "player-360", icon: "P360", label: "Player 360", description: "Unified player card: stats, levels, messages, and comments." },
      { id: "profile", icon: "PF", label: "Profile", description: "Your profile, account data, stats, and linked info." },
      { id: "messenger", icon: "MSG", label: "Messenger", description: "Inbox and outbox for the current account." },
      { id: "account-manage", icon: "ACC", label: "Account", description: "Password, nickname, privacy, and account controls." }
    ]
  },
  {
    title: "Content",
    sections: [
      { id: "browse-levels", icon: "LVL", label: "Levels", description: "Level catalog, recent uploads, and content overview." },
      { id: "browse-clans", icon: "CLN", label: "Clans", description: "Player communities and their content footprint." },
      { id: "content", icon: "HUB", label: "Content Hub", description: "New levels, comments, messages, and project announcements." },
      { id: "leaderboards", icon: "LB", label: "Leaderboards", description: "Trends, signals, and leaderboard overview." }
    ]
  },
  {
    title: "Music",
    sections: [
      { id: "browse-songs", icon: "SNG", label: "Songs", description: "Song catalog, authors, and music known to the core." },
      { id: "upload-songs", icon: "UP", label: "Uploads", description: "Music uploads, SFX, linked songs, and transfer tools." },
      { id: "themes", icon: "TH", label: "Themes", description: "Dashboard themes, preview, and interface styling." }
    ]
  },
  {
    title: "Moderation",
    sections: [
      { id: "moderation", icon: "MOD", label: "Workspace", badge: "QUEUE", description: "Reports queue, suggested actions, and moderation workspace." },
      { id: "mod-tools", icon: "MT", label: "Mod Tools", description: "Reports, suggested levels, automod, and staff tools." }
    ]
  },
  {
    title: "Events",
    sections: [
      { id: "events", icon: "EV", label: "Event Studio", description: "Daily, weekly, and event rotations, quests, and reward codes." },
      { id: "stats-suite", icon: "ST", label: "Statistics", description: "Daily snapshots, moderators, actions, and top players." }
    ]
  },
  {
    title: "Operations",
    sections: [
      { id: "ops", icon: "OPS", label: "Ops Panel", description: "Cron, jobs, workers, queues, and error radar." },
      { id: "security", icon: "SEC", label: "Security", description: "Security signals, logins, and privileged posture." },
      { id: "files", icon: "FS", label: "Files", badge: "ROOT", description: "Privileged file access and future Monaco editor support." },
      { id: "integrations", icon: "INT", label: "Integrations", description: "Discord, Telegram, webhooks и API tokens." }
    ]
  },
  {
    title: "Settings",
    sections: [
      { id: "settings", icon: "CFG", label: "Settings", description: "Project name, player defaults, language, and base settings." }
    ]
  }
];

export const dashboardThemes: DashboardTheme[] = [
  {
    id: "megasa1nt",
    label: "Classic",
    category: "Classic",
    description: "A classic legacy-inspired dashboard theme.",
    preview: "Core homage",
    personality: "Classic legacy",
    cues: ["classic proportions", "signature layout", "muted glow", "dashboard homage"],
    palette: { bg: "#090b10", panel: "#11141d", panelAlt: "#171b26", text: "#edf2ff", muted: "#7383a7", accent: "#7c3aed", accentAlt: "#22d3ee", success: "#22c55e", warning: "#f59e0b", danger: "#ef4444", border: "#1b2230", glow: "rgba(124,58,237,0.24)" }
  },
  {
    id: "minimalistic",
    label: "Minimalistic",
    category: "Clean",
    description: "A clean minimal theme focused on data and work without extra noise.",
    preview: "Clean focus",
    personality: "Quiet workspace",
    cues: ["flat surfaces", "more white space", "soft borders", "reduced decoration"],
    palette: { bg: "#f4f5f7", panel: "#ffffff", panelAlt: "#eef1f5", text: "#171a21", muted: "#657084", accent: "#2563eb", accentAlt: "#0ea5e9", success: "#15803d", warning: "#b45309", danger: "#dc2626", border: "#d8dee8", glow: "rgba(37,99,235,0.12)" }
  },
  {
    id: "windows",
    label: "Windows",
    category: "System",
    description: "A Windows 11 inspired theme with glass surfaces, soft panels, and system-style clarity.",
    preview: "Glass panels",
    personality: "Windows 11",
    cues: ["acrylic glass", "soft shadows", "system blue", "rounded shell"],
    palette: { bg: "#e8edf5", panel: "rgba(255,255,255,0.72)", panelAlt: "rgba(248,250,253,0.88)", text: "#18212f", muted: "#5a667a", accent: "#2563eb", accentAlt: "#06b6d4", success: "#16a34a", warning: "#d97706", danger: "#dc2626", border: "rgba(255,255,255,0.65)", glow: "rgba(37,99,235,0.16)" }
  },
  {
    id: "cli",
    label: "CLI",
    category: "System",
    description: "A text-first theme styled after CLI windows and terminal control panels.",
    preview: "Terminal mode",
    personality: "Text console",
    cues: ["monospace UI", "terminal frames", "scanline mood", "operator density"],
    palette: { bg: "#07110b", panel: "#0a160e", panelAlt: "#0f1f14", text: "#b7ffca", muted: "#58a66d", accent: "#5df28c", accentAlt: "#1fb9a1", success: "#5df28c", warning: "#eab308", danger: "#f87171", border: "#183120", glow: "rgba(93,242,140,0.18)" }
  },
  {
    id: "neon-core",
    label: "Neon Core",
    category: "Cinematic",
    description: "A dark cyber-ops theme for the main dashboard control view.",
    preview: "Cyber ops",
    personality: "Cyber control",
    cues: ["neon glow", "deep contrast", "accent cards", "futuristic chrome"],
    palette: { bg: "#090914", panel: "#111120", panelAlt: "#191930", text: "#f4f7ff", muted: "#7b84a7", accent: "#8b5cf6", accentAlt: "#22d3ee", success: "#22c55e", warning: "#facc15", danger: "#fb7185", border: "#20253a", glow: "rgba(139,92,246,0.22)" }
  },
  {
    id: "city-night",
    label: "City Night",
    category: "Cinematic",
    description: "A deep night theme with warm accents and an urban control-room mood.",
    preview: "Ops at midnight",
    personality: "Night dispatch",
    cues: ["navy surfaces", "amber accents", "city lights", "control room"],
    palette: { bg: "#08111d", panel: "#0f1b2b", panelAlt: "#132236", text: "#edf5ff", muted: "#7b91aa", accent: "#f59e0b", accentAlt: "#38bdf8", success: "#22c55e", warning: "#f97316", danger: "#f43f5e", border: "#1e324c", glow: "rgba(245,158,11,0.18)" }
  },
  {
    id: "robotic-steel",
    label: "Robotic Steel",
    category: "System",
    description: "A strict technical theme for an engineering-first presentation.",
    preview: "Cold precision",
    personality: "Industrial system",
    cues: ["steel layers", "cold edges", "precise geometry", "machine room"],
    palette: { bg: "#0d1116", panel: "#151c24", panelAlt: "#1d2631", text: "#e9eef5", muted: "#7c8898", accent: "#60a5fa", accentAlt: "#94a3b8", success: "#34d399", warning: "#fbbf24", danger: "#f87171", border: "#263140", glow: "rgba(96,165,250,0.16)" }
  },
  {
    id: "lava-forge",
    label: "Lava Forge",
    category: "Cinematic",
    description: "An aggressive alert theme for moderation and emergency workflows.",
    preview: "High alert",
    personality: "Emergency mode",
    cues: ["ember glow", "hot highlights", "danger chrome", "combat UI"],
    palette: { bg: "#140c08", panel: "#22130e", panelAlt: "#2f1a14", text: "#fff1e8", muted: "#c0957a", accent: "#f97316", accentAlt: "#ef4444", success: "#22c55e", warning: "#fb923c", danger: "#ef4444", border: "#47271c", glow: "rgba(249,115,22,0.2)" }
  },
  {
    id: "emerald-control",
    label: "Emerald Control",
    category: "Cinematic",
    description: "A green ops/security theme with a control-center atmosphere.",
    preview: "Security console",
    personality: "Security console",
    cues: ["green radar", "dark terminals", "ops readouts", "status glow"],
    palette: { bg: "#07100d", panel: "#0d1814", panelAlt: "#13241c", text: "#eafaf1", muted: "#78a38f", accent: "#22c55e", accentAlt: "#14b8a6", success: "#22c55e", warning: "#facc15", danger: "#f87171", border: "#1b3428", glow: "rgba(34,197,94,0.18)" }
  },
  {
    id: "solar-light",
    label: "Solar Light",
    category: "Clean",
    description: "A bright working theme with a warm palette and strong readability.",
    preview: "Bright office",
    personality: "Day office",
    cues: ["warm light", "soft panels", "calm reading", "daytime dashboard"],
    palette: { bg: "#fff8ef", panel: "#ffffff", panelAlt: "#fff3dd", text: "#2b2115", muted: "#8a6b4d", accent: "#ea580c", accentAlt: "#0284c7", success: "#16a34a", warning: "#ca8a04", danger: "#dc2626", border: "#eed7b9", glow: "rgba(234,88,12,0.12)" }
  },
  {
    id: "geometry-pulse",
    label: "Geometry Pulse",
    category: "Game-inspired",
    description: "A theme with a clear Geometry Dash vibe: bright, arcade-like, and geometric.",
    preview: "Arcade mode",
    personality: "Geometry Dash vibe",
    cues: ["hard edges", "arcade colors", "game HUD", "blocky energy"],
    palette: { bg: "#0f1022", panel: "#171933", panelAlt: "#1f2240", text: "#fbfdff", muted: "#97a1d3", accent: "#f43f5e", accentAlt: "#22d3ee", success: "#84cc16", warning: "#facc15", danger: "#ef4444", border: "#2d3260", glow: "rgba(244,63,94,0.18)" }
  }
];

export const metrics: MetricCard[] = [
  { label: "Players Online", value: "1,284", delta: "+14.8% vs 1h", tone: "success" },
  { label: "Reports Queue", value: "39", delta: "7 require review", tone: "warning" },
  { label: "API Error Rate", value: "0.12%", delta: "within threshold", tone: "accent" },
  { label: "Automod Flags", value: "87", delta: "12 high-risk", tone: "danger" }
];

export const liveActivity: ActivityItem[] = [
  { title: "Impossible stats spike blocked", meta: "Account 1842 hit anti-abuse rule after moon jump anomaly.", badge: "BLOCKED", tone: "danger" },
  { title: "New mythic suggestion entered queue", meta: "Level 99123 moved into moderator vote with 4 endorsements.", badge: "REVIEW", tone: "warning" },
  { title: "Weekly queue rotated", meta: "Level 44210 became active weekly with 3.8k projected completions.", badge: "LIVE", tone: "success" },
  { title: "Discord bridge delivered ops alert", meta: "API latency warning pushed to #ops-control in 320ms.", badge: "SYNC", tone: "accent" }
];

export const wowFeatures: WowFeature[] = [
  { title: "Live Control Center", kicker: "Realtime ops", description: "Online players, API errors, new events, and suspicious signals for operational control." },
  { title: "Player 360", kicker: "Unified player card", description: "Full player history in one place: stats, messages, bans, activity, and levels." },
  { title: "Moderation Workspace", kicker: "Actionable queue", description: "Reports queue with suggested actions, bulk tools, and fast moderator flows." },
  { title: "Event Studio", kicker: "Season control", description: "Manage daily, weekly, and seasonal events with rewards, timers, and visual setup." },
  { title: "Config Timeline", kicker: "Audit & rollback", description: "Track who changed config, what changed, compare diffs, and roll back quickly." },
  { title: "Ops Panel", kicker: "Infra visibility", description: "Cron, jobs, queue, Redis, and error radar in one place." }
];









