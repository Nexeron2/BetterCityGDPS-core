import { createServer, type IncomingMessage } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { dashboardLocales } from "@better-city/i18n";
import { defaultRoles } from "@better-city/permissions";
import { getDashboardApiConfig } from "./config";
import { sendJson } from "./http/response";
import { issueDashboardToken, verifyDashboardToken } from "./utils/token";

type AccountRecord = { accountId: number; userName: string; passwordHash: string; gjp2?: string; email: string; registerDate: number; isActive?: boolean; bannedAt?: number; bannedBy?: number; banReason?: string; friendsState?: number; messagesState?: number; commentsState?: number; youtubeUrl?: string; twitter?: string; twitch?: string; instagram?: string; tiktok?: string; discord?: string; custom?: string };
type UserRecord = { userId: number; extId: number; userName: string; stars: number; demons: number; diamonds: number; moons: number; creatorPoints: number; lastPlayed: number; coins?: number; userCoins?: number; color1?: number; color2?: number; color3?: number; accIcon?: number; accShip?: number; accBall?: number; accBird?: number; accDart?: number; accRobot?: number; accGlow?: number; accSpider?: number; accExplosion?: number; accSwing?: number; accJetpack?: number; dinfo?: string; sinfo?: string; pinfo?: string; chest1Time?: number; chest1Count?: number; chest2Time?: number; chest2Count?: number };
type LevelRecord = { levelId: number; name: string; description?: string; userName: string; extId: number; stars: number; featured: number; likes: number; downloads: number; uploadDate: number; updateDate: number; difficulty?: number; demon?: number; demonDiff?: number; isHidden?: boolean };
type CommentRecord = { commentId: number; levelId: number; userName: string; comment: string; timestamp: number };
type MessageRecord = { messageId: number; fromAccountId: number; toAccountId: number; subject: string; timestamp: number };
type ReportRecord = { reportId: number; levelId: number; timestamp: number };
type SaveRecord = { accountId: number; updatedAt: number };
type SongRecord = { songId: number; name: string; authorName: string; ownerAccountId?: number; sourceUrl?: string; status?: "approved" | "pending" };
type DailyFeatureRecord = { featureId: number; type: 0 | 1 | 2; levelId: number; timestamp: number; duration: number; rewards: string };
type QuestRecord = { questTemplateId: number; type: number; amount: number; reward: number; name: string };
type VaultCodeRecord = { rewardId: number; code: string; rewards: string; duration: number; uses: number; timestamp: number };

type CoreData = {
  nextAccountId?: number;
  nextUserId?: number;
  accounts?: AccountRecord[];
  users?: UserRecord[];
  levels?: LevelRecord[];
  comments?: CommentRecord[];
  messages?: MessageRecord[];
  levelReports?: ReportRecord[];
  saves?: SaveRecord[];
  songs?: SongRecord[];
  dailyFeatures?: DailyFeatureRecord[];
  quests?: QuestRecord[];
  vaultCodes?: VaultCodeRecord[];
  mapPacks?: unknown[];
  gauntlets?: unknown[];
  levelLists?: unknown[];
  projectSettings?: { projectName?: string; defaultTheme?: string; allowUserThemeOverride?: boolean; publicStatisticsEnabled?: boolean; publicIntegrationsEnabled?: boolean; telegramEnabled?: boolean; telegramBotUsername?: string; telegramBotUrl?: string; discordEnabled?: boolean; discordBotUrl?: string; discordServerUrl?: string };
};

type DashboardRoleId = "player" | "moderator" | "administrator" | "privileged-operator" | "owner";

type DashboardUser = {
  accountId: number;
  userId: number | null;
  userName: string;
  email: string;
  roleIds: DashboardRoleId[];
};

const config = getDashboardApiConfig();

function readData(): CoreData {
  return JSON.parse(readFileSync(config.dataFilePath, "utf8")) as CoreData;
}

function writeData(data: CoreData): void {
  writeFileSync(config.dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

function gjp2FromPassword(password: string): string {
  return createHash("sha1").update(`${password}mI29fmAnxgTs`).digest("hex");
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, encoded: string): boolean {
  const [salt, storedHash] = encoded.split(":");
  if (!salt || !storedHash) return false;
  const candidate = scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, "hex");
  return stored.length === candidate.length && timingSafeEqual(stored, candidate);
}

function resolveRoleIds(accountId: number): DashboardRoleId[] {
  if (accountId === 1) return ["owner", "administrator", "privileged-operator"];
  if (accountId === 2 || accountId === 5) return ["moderator"];
  return ["player"];
}

function buildDashboardUser(data: CoreData, accountId: number): DashboardUser | null {
  const account = data.accounts?.find((item) => item.accountId === accountId);
  if (!account) return null;
  const user = data.users?.find((item) => item.extId === accountId) ?? null;
  return {
    accountId,
    userId: user?.userId ?? null,
    userName: account.userName,
    email: account.email,
    roleIds: resolveRoleIds(accountId)
  };
}

function toPublicUser(user: DashboardUser) {
  return {
    accountId: user.accountId,
    userId: user.userId,
    userName: user.userName,
    roleIds: user.roleIds,
    roles: defaultRoles.filter((role) => user.roleIds.includes(role.id as DashboardRoleId))
  };
}

function requireAuth(request: IncomingMessage, data: CoreData): DashboardUser | null {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const payload = verifyDashboardToken(authHeader.slice(7), config.tokenSecret);
  if (!payload) return null;
  return buildDashboardUser(data, payload.accountId);
}

function isDashboardAllowed(user: DashboardUser): boolean {
  return config.allowPlayerDashboard || user.roleIds.some((role) => role !== "player");
}

function getProjectDisplayName(data: CoreData): string {
  const configuredName = String(data.projectSettings?.projectName ?? "").trim();
  return configuredName || "GDPS Project";
}

function getDefaultTheme(data: CoreData): string {
  const configuredTheme = String(data.projectSettings?.defaultTheme ?? "").trim();
  const allowedThemes = new Set(["megasa1nt", "minimalistic", "windows", "cli", "neon-core", "city-night", "robotic-steel", "lava-forge", "emerald-control", "solar-light", "geometry-pulse"]);
  return allowedThemes.has(configuredTheme) ? configuredTheme : "neon-core";
}

function getAllowUserThemeOverride(data: CoreData): boolean {
  return data.projectSettings?.allowUserThemeOverride !== false;
}

function canManageProjectSettings(user: DashboardUser): boolean {
  return user.roleIds.includes("owner") || user.roleIds.includes("administrator");
}

function isStaffUser(user: DashboardUser): boolean {
  return user.roleIds.some((role) => role !== "player");
}

function canUseModeratorTools(user: DashboardUser): boolean {
  return user.roleIds.some((role) => role === "moderator" || role === "administrator" || role === "privileged-operator" || role === "owner");
}

function getPublicStatisticsEnabled(data: CoreData): boolean {
  return data.projectSettings?.publicStatisticsEnabled !== false;
}

function getPublicIntegrationsEnabled(data: CoreData): boolean {
  return data.projectSettings?.publicIntegrationsEnabled !== false;
}

function getIntegrationPublicProfile(data: CoreData) {
  return {
    telegram: {
      enabled: data.projectSettings?.telegramEnabled !== false,
      botUsername: String(data.projectSettings?.telegramBotUsername ?? "citygdps_bot").trim() || "citygdps_bot",
      botUrl: String(data.projectSettings?.telegramBotUrl ?? "https://t.me/citygdps_bot").trim() || "https://t.me/citygdps_bot"
    },
    discord: {
      enabled: data.projectSettings?.discordEnabled !== false,
      botUrl: String(data.projectSettings?.discordBotUrl ?? "https://discord.com/oauth2/authorize?client_id=000000000000000000&scope=bot%20applications.commands").trim() || "https://discord.com/oauth2/authorize?client_id=000000000000000000&scope=bot%20applications.commands",
      serverUrl: String(data.projectSettings?.discordServerUrl ?? "https://discord.gg/citygdps").trim() || "https://discord.gg/citygdps"
    }
  };
}

function issueDashboardAuth(user: DashboardUser) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const token = issueDashboardToken({
    accountId: user.accountId,
    roleIds: user.roleIds,
    issuedAt,
    expiresAt: issuedAt + config.tokenTtlSeconds
  }, config.tokenSecret);
  return { token, user: toPublicUser(user) };
}

function normalizeData(data: CoreData): Required<Pick<CoreData, "accounts" | "users">> & CoreData {
  return {
    ...data,
    accounts: data.accounts ?? [],
    users: data.users ?? []
  };
}

function createAccountInData(data: CoreData, userName: string, email: string, password: string): DashboardUser {
  const normalized = normalizeData(data);
  const now = Math.floor(Date.now() / 1000);
  const accountId = Math.max(normalized.nextAccountId ?? 1, ...normalized.accounts.map((account) => account.accountId + 1), 1);
  const userId = Math.max(normalized.nextUserId ?? 1, ...normalized.users.map((user) => user.userId + 1), 1);

  normalized.nextAccountId = accountId + 1;
  normalized.nextUserId = userId + 1;

  normalized.accounts.push({
    accountId,
    userName,
    passwordHash: hashPassword(password),
    gjp2: gjp2FromPassword(password),
    email,
    registerDate: now,
    isActive: true,
    friendsState: 0,
    messagesState: 0,
    commentsState: 0,
    youtubeUrl: "",
    twitter: "",
    twitch: "",
    instagram: "",
    tiktok: "",
    discord: "",
    custom: ""
  });

  normalized.users.push({
    userId,
    extId: accountId,
    userName,
    stars: 0,
    demons: 0,
    diamonds: 0,
    moons: 0,
    creatorPoints: 0,
    lastPlayed: now,
    coins: 0,
    userCoins: 0,
    color1: 0,
    color2: 3,
    color3: 0,
    accIcon: 0,
    accShip: 0,
    accBall: 0,
    accBird: 0,
    accDart: 0,
    accRobot: 0,
    accGlow: 0,
    accSpider: 0,
    accExplosion: 0,
    accSwing: 0,
    accJetpack: 0,
    dinfo: "",
    sinfo: "",
    pinfo: "",
    chest1Time: 0,
    chest1Count: 0,
    chest2Time: 0,
    chest2Count: 0
  });

  writeData(normalized);
  return buildDashboardUser(normalized, accountId) as DashboardUser;
}

function latestActivity(data: CoreData) {
  const levelItems = (data.levels ?? []).slice().sort((a, b) => b.updateDate - a.updateDate).slice(0, 4).map((level) => ({ type: "level", title: `Level updated: ${level.name}`, meta: `${level.userName} | likes ${level.likes} | downloads ${level.downloads}`, timestamp: level.updateDate, tone: level.featured > 0 ? "accent" : "success" }));
  const reportItems = (data.levelReports ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 3).map((report) => ({ type: "report", title: `Report on level ${report.levelId}`, meta: "Queued for moderation review", timestamp: report.timestamp, tone: "warning" }));
  const commentItems = (data.comments ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 3).map((comment) => ({ type: "comment", title: `Comment by ${comment.userName}`, meta: comment.comment.slice(0, 72), timestamp: comment.timestamp, tone: "success" }));
  return [...levelItems, ...reportItems, ...commentItems].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
}

function overviewPayload(data: CoreData) {
  const levels = data.levels ?? [];
  const users = data.users ?? [];
  const reports = data.levelReports ?? [];
  const comments = data.comments ?? [];
  const messages = data.messages ?? [];
  const saves = data.saves ?? [];
  const now = Math.floor(Date.now() / 1000);
  const online = users.filter((user) => now - (user.lastPlayed ?? 0) < 60 * 30).length;
  return {
    success: true,
    summary: {
      playersOnline: online,
      totalAccounts: data.accounts?.length ?? 0,
      totalPlayers: users.length,
      totalLevels: levels.length,
      reportsInQueue: reports.length,
      totalComments: comments.length,
      totalMessages: messages.length,
      totalSongs: data.songs?.length ?? 0,
      cloudBackups: saves.length,
      mapPacks: data.mapPacks?.length ?? 0,
      gauntlets: data.gauntlets?.length ?? 0,
      levelLists: data.levelLists?.length ?? 0
    },
    highlights: {
      latestLevels: levels.slice().sort((a, b) => b.updateDate - a.updateDate).slice(0, 6),
      topCreators: users.slice().sort((a, b) => b.creatorPoints - a.creatorPoints || b.stars - a.stars).slice(0, 5),
      suspiciousSignals: [
        { label: "Impossible stats", value: Math.max(0, Math.floor(reports.length / 2)) },
        { label: "Rate queue backlog", value: Math.max(0, Math.floor(levels.filter((level) => level.stars === 0).length / 3)) },
        { label: "Privileged actions", value: 0 }
      ]
    }
  };
}

function themesPayload() {
  return { success: true, locales: dashboardLocales, themes: ["Classic", "Minimalistic", "Windows", "CLI", "Neon Core", "City Night", "Robotic Steel", "Lava Forge", "Emerald Control", "Solar Light", "Geometry Pulse"] };
}

function getPlayerList(data: CoreData, search: string, page: number, limit: number) {
  const normalized = search.trim().toLowerCase();
  const items = (data.users ?? []).filter((user) => !normalized || user.userName.toLowerCase().includes(normalized) || String(user.userId) === normalized || String(user.extId) === normalized).sort((a, b) => b.stars - a.stars || b.creatorPoints - a.creatorPoints || a.userName.localeCompare(b.userName));
  const start = page * limit;
  return { success: true, total: items.length, page, limit, players: items.slice(start, start + limit).map((user) => ({ userId: user.userId, accountId: user.extId, userName: user.userName, stars: user.stars, demons: user.demons, diamonds: user.diamonds, moons: user.moons, creatorPoints: user.creatorPoints, lastPlayed: user.lastPlayed, roleIds: resolveRoleIds(user.extId) })) };
}

function getPlayer360(data: CoreData, viewer: DashboardUser, accountId: number) {
  const account = data.accounts?.find((item) => item.accountId === accountId);
  const user = data.users?.find((item) => item.extId === accountId);
  if (!account || !user) return null;
  const viewerIsSelf = viewer.accountId === accountId;
  const viewerIsStaff = isStaffUser(viewer);
  const mode = viewerIsStaff ? "staff" : viewerIsSelf ? "self" : "public";
  const levels = (data.levels ?? []).filter((level) => level.extId === accountId).sort((a, b) => b.updateDate - a.updateDate).slice(0, 8);
  const allMessages = (data.messages ?? []).filter((message) => message.fromAccountId === accountId || message.toAccountId === accountId).sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  const messages = viewerIsStaff || viewerIsSelf ? allMessages : [];
  const saves = (data.saves ?? []).filter((save) => save.accountId === accountId);
  const comments = (data.comments ?? []).filter((comment) => levels.some((level) => level.levelId === comment.levelId)).sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  return {
    success: true,
    mode,
    permissions: {
      canViewPrivateMessages: viewerIsStaff || viewerIsSelf,
      canViewPrivateAccount: viewerIsStaff || viewerIsSelf,
      viewerIsSelf,
      viewerIsStaff
    },
    player: {
      accountId,
      userId: user.userId,
      userName: user.userName,
      email: viewerIsStaff || viewerIsSelf ? account.email : null,
      roleIds: viewerIsStaff || viewerIsSelf ? resolveRoleIds(accountId) : [],
      stats: {
        stars: user.stars,
        demons: user.demons,
        diamonds: user.diamonds,
        moons: user.moons,
        creatorPoints: user.creatorPoints,
        coins: user.coins ?? 0,
        userCoins: user.userCoins ?? 0
      },
      activity: {
        lastPlayed: user.lastPlayed,
        registerDate: account.registerDate,
        saveCount: viewerIsStaff || viewerIsSelf ? saves.length : null,
        messageCount: viewerIsStaff || viewerIsSelf ? allMessages.length : null,
        levelCount: levels.length,
        commentCount: comments.length
      },
      levels,
      messages,
      comments
    }
  };
}

function getLiveControlPayload(data: CoreData) {
  const now = Math.floor(Date.now() / 1000);
  const online = (data.users ?? []).filter((user) => now - (user.lastPlayed ?? 0) < 60 * 30).length;
  const latestLevels = (data.levels ?? []).slice().sort((a, b) => b.updateDate - a.updateDate).slice(0, 5);
  const latestReports = (data.levelReports ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  return { success: true, summary: { online, apiErrors: 0, suspiciousSignals: Math.max(0, Math.floor(latestReports.length / 2)), pendingReports: latestReports.length, freshLevels: latestLevels.length }, latestLevels, latestReports, feed: latestActivity(data) };
}

function getModerationQueuePayload(data: CoreData) {
  const reports = (data.levelReports ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).map((report) => {
    const level = (data.levels ?? []).find((item) => item.levelId === report.levelId);
    return { reportId: report.reportId, levelId: report.levelId, levelName: level?.name ?? "Unknown level", userName: level?.userName ?? "Unknown", timestamp: report.timestamp, suggestedAction: level?.stars ? "review" : "inspect" };
  });
  return { success: true, total: reports.length, items: reports };
}

function getSecuritySummaryPayload(data: CoreData) {
  const reportCount = (data.levelReports ?? []).length;
  const saveCount = (data.saves ?? []).length;
  return { success: true, summary: { rateLimits: "planned", twoFactor: "planned", privilegedUnlock: true, loginEvents: data.accounts?.length ?? 0, suspiciousIps: Math.max(0, Math.floor(reportCount / 2)), cloudBackups: saveCount } };
}

function getEventStudioPayload(data: CoreData) {
  const levels = data.levels ?? [];
  const features = (data.dailyFeatures ?? []).map((feature) => {
    const level = levels.find((item) => item.levelId === feature.levelId);
    const kind = feature.type === 0 ? "daily" : feature.type === 1 ? "weekly" : "event";
    return {
      featureId: feature.featureId,
      kind,
      levelId: feature.levelId,
      levelName: level?.name ?? "Unknown level",
      userName: level?.userName ?? "Unknown",
      duration: feature.duration,
      rewards: feature.rewards,
      timestamp: feature.timestamp
    };
  });
  return {
    success: true,
    summary: {
      activeFeatures: features.length,
      quests: (data.quests ?? []).length,
      mapPacks: data.mapPacks?.length ?? 0,
      gauntlets: data.gauntlets?.length ?? 0,
      vaultCodes: data.vaultCodes?.length ?? 0
    },
    features,
    quests: (data.quests ?? []).slice(0, 6),
    vaultCodes: (data.vaultCodes ?? []).slice(0, 5).map((code) => ({ rewardId: code.rewardId, rewards: code.rewards, uses: code.uses, duration: code.duration, timestamp: code.timestamp }))
  };
}

function getContentHubPayload(data: CoreData) {
  const latestLevels = (data.levels ?? []).slice().sort((a, b) => b.updateDate - a.updateDate).slice(0, 6);
  const latestComments = (data.comments ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  const latestMessages = (data.messages ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  return {
    success: true,
    summary: {
      latestLevels: latestLevels.length,
      comments: latestComments.length,
      messages: latestMessages.length,
      songs: data.songs?.length ?? 0
    },
    latestLevels,
    latestComments,
    latestMessages,
    announcements: [
      { id: 1, title: "Project control feed", body: "Use Content Hub for future dashboard-managed announcements, banners, and launcher-facing status messages.", tone: "accent" },
      { id: 2, title: "Content rollout", body: "This section will absorb more dashboard-managed content flows as the product expands.", tone: "warning" }
    ]
  };
}

function getAccountManagePayload(data: CoreData, user: DashboardUser) {
  const account = data.accounts?.find((item) => item.accountId === user.accountId);
  const profile = data.users?.find((item) => item.extId === user.accountId);
  if (!account || !profile) return null;
  const levels = (data.levels ?? []).filter((level) => level.extId === user.accountId);
  const messages = (data.messages ?? []).filter((message) => message.fromAccountId === user.accountId || message.toAccountId === user.accountId);
  return {
    success: true,
    account: {
      accountId: account.accountId,
      userName: account.userName,
      email: account.email,
      registerDate: account.registerDate,
      privacy: {
        friendsState: account.friendsState ?? 0,
        messagesState: account.messagesState ?? 0,
        commentsState: account.commentsState ?? 0
      },
      social: {
        youtubeUrl: account.youtubeUrl ?? "",
        twitter: account.twitter ?? "",
        twitch: account.twitch ?? "",
        discord: account.discord ?? ""
      },
      summary: {
        levels: levels.length,
        messages: messages.length,
        favourites: 0,
        hiddenLevelLists: 0,
        songs: (data.songs ?? []).filter((song) => song.authorName === account.userName).length
      },
      latestLevels: levels.slice().sort((a, b) => b.updateDate - a.updateDate).slice(0, 6)
    }
  };
}

function getBrowseLevelsPayload(data: CoreData, page: number, limit: number) {
  const items = (data.levels ?? []).slice().sort((a, b) => b.updateDate - a.updateDate || b.downloads - a.downloads);
  const start = page * limit;
  const slice = items.slice(start, start + limit);
  return {
    success: true,
    summary: {
      total: items.length,
      featured: items.filter((level) => level.featured > 0).length,
      rated: items.filter((level) => level.stars > 0).length,
      demons: items.filter((level) => level.demon).length
    },
    page,
    limit,
    items: slice
  };
}

function getBrowseSongsPayload(data: CoreData, page: number, limit: number) {
  const items = (data.songs ?? []).slice().sort((a, b) => a.songId - b.songId);
  const start = page * limit;
  const slice = items.slice(start, start + limit);
  return {
    success: true,
    summary: {
      total: items.length,
      localSongs: items.length,
      artists: new Set(items.map((song) => song.authorName)).size
    },
    page,
    limit,
    items: slice
  };
}
function getProfilePayload(data: CoreData, user: DashboardUser) {
  const account = data.accounts?.find((item) => item.accountId === user.accountId);
  const profile = data.users?.find((item) => item.extId === user.accountId);
  if (!account || !profile) return null;
  const levels = (data.levels ?? []).filter((level) => level.extId === user.accountId).sort((a, b) => b.updateDate - a.updateDate).slice(0, 8);
  const saves = (data.saves ?? []).filter((save) => save.accountId === user.accountId);
  const messages = (data.messages ?? []).filter((message) => message.fromAccountId === user.accountId || message.toAccountId === user.accountId);
  return {
    success: true,
    profile: {
      accountId: account.accountId,
      userId: profile.userId,
      userName: profile.userName,
      email: account.email,
      registerDate: account.registerDate,
      lastPlayed: profile.lastPlayed,
      roleIds: resolveRoleIds(account.accountId),
      stats: {
        stars: profile.stars,
        demons: profile.demons,
        diamonds: profile.diamonds,
        moons: profile.moons,
        creatorPoints: profile.creatorPoints,
        coins: profile.coins ?? 0,
        userCoins: profile.userCoins ?? 0
      },
      social: {
        youtubeUrl: account.youtubeUrl ?? "",
        twitter: account.twitter ?? "",
        twitch: account.twitch ?? "",
        discord: account.discord ?? "",
        instagram: account.instagram ?? "",
        tiktok: account.tiktok ?? "",
        custom: account.custom ?? ""
      },
      summary: {
        levels: levels.length,
        messages: messages.length,
        saves: saves.length
      },
      latestLevels: levels
    }
  };
}

function getMessengerPayload(data: CoreData, user: DashboardUser) {
  const accountId = user.accountId;
  const accountsById = new Map((data.accounts ?? []).map((account) => [account.accountId, account]));
  const inbox = (data.messages ?? [])
    .filter((message) => message.toAccountId === accountId)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 12)
    .map((message) => ({
      ...message,
      fromUserName: accountsById.get(message.fromAccountId)?.userName ?? `Account ${message.fromAccountId}`,
      toUserName: accountsById.get(message.toAccountId)?.userName ?? `Account ${message.toAccountId}`
    }));
  const outbox = (data.messages ?? [])
    .filter((message) => message.fromAccountId === accountId)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 12)
    .map((message) => ({
      ...message,
      fromUserName: accountsById.get(message.fromAccountId)?.userName ?? `Account ${message.fromAccountId}`,
      toUserName: accountsById.get(message.toAccountId)?.userName ?? `Account ${message.toAccountId}`
    }));
  return {
    success: true,
    summary: {
      inbox: inbox.length,
      outbox: outbox.length,
      unreadEstimate: inbox.length,
      contacts: new Set([...inbox.map((item) => item.fromAccountId), ...outbox.map((item) => item.toAccountId)]).size
    },
    inbox,
    outbox
  };
}

function getBrowseClansPayload(data: CoreData, page: number, limit: number) {
  const ownerIds = new Set((data.levels ?? []).map((level) => level.extId));
  const items = Array.from(ownerIds)
    .map((accountId) => {
      const owner = data.accounts?.find((account) => account.accountId === accountId);
      const levels = (data.levels ?? []).filter((level) => level.extId === accountId);
      return {
        clanId: accountId,
        name: `${owner?.userName ?? `Account ${accountId}`} Clan`,
        ownerName: owner?.userName ?? `Account ${accountId}`,
        members: Math.max(1, Math.min(20, levels.length + 1)),
        levels: levels.length,
        stars: levels.reduce((sum, level) => sum + (level.stars ?? 0), 0),
        latestLevelName: levels.slice().sort((a, b) => b.updateDate - a.updateDate)[0]?.name ?? "No levels yet"
      };
    })
    .sort((a, b) => b.levels - a.levels || b.stars - a.stars || a.name.localeCompare(b.name));
  const start = page * limit;
  return {
    success: true,
    summary: {
      total: items.length,
      activeOwners: items.filter((item) => item.levels > 0).length,
      totalLevels: items.reduce((sum, item) => sum + item.levels, 0),
      averageMembers: items.length ? Math.round(items.reduce((sum, item) => sum + item.members, 0) / items.length) : 0
    },
    page,
    limit,
    items: items.slice(start, start + limit)
  };
}
function getUploadHubPayload(data: CoreData, user: DashboardUser) {
  const account = data.accounts?.find((item) => item.accountId === user.accountId);
  const ownLevels = (data.levels ?? []).filter((level) => level.extId === user.accountId).sort((a, b) => b.updateDate - a.updateDate).slice(0, 6);
  const ownSongs = (data.songs ?? []).filter((song) => song.ownerAccountId === user.accountId || song.authorName === (account?.userName ?? user.userName)).slice(0, 6);
  const linkedSongs = (data.songs ?? []).filter((song) => (song.sourceUrl && song.sourceUrl.length > 0) || (!song.authorName || song.authorName !== (account?.userName ?? user.userName))).slice(0, 6);
  return {
    success: true,
    summary: {
      ownSongs: ownSongs.length,
      linkedSongs: linkedSongs.length,
      sfx: 0,
      transfers: ownLevels.length,
      cronTasks: (data.dailyFeatures?.length ?? 0) + (data.quests?.length ?? 0),
      pendingSongs: (data.songs ?? []).filter((song) => song.status === "pending").length
    },
    actions: [
      { id: 'upload-song', title: 'Direct song upload', meta: 'Create a local GDPS track entry for player-owned music.', tone: 'accent' },
      { id: 'upload-song-link', title: 'Song by link', meta: 'Register remote song metadata and attach it to levels later.', tone: 'warning' },
      { id: 'upload-sfx', title: 'Add sound effect', meta: 'Prepare per-level SFX assets for future moderation and approval.', tone: 'success' }
    ],
    linkedSongs: linkedSongs.map((song) => ({ songId: song.songId, name: song.name, authorName: song.authorName || "Unknown author", sourceUrl: song.sourceUrl || null, status: song.status ?? "approved" })),
    transfers: ownLevels.map((level) => ({ levelId: level.levelId, name: level.name, userName: level.userName, updatedAt: level.updateDate })),
    cronTasks: [
      { id: 'refresh-dailies', title: 'Refresh daily rotation', meta: String(data.dailyFeatures?.length ?? 0) + ' active feature slots', tone: 'accent' },
      { id: 'sync-quests', title: 'Sync quest templates', meta: String(data.quests?.length ?? 0) + ' quest templates', tone: 'success' },
      { id: 'rebuild-content-feed', title: 'Rebuild content feed', meta: String(data.levels?.length ?? 0) + ' levels tracked in current store', tone: 'warning' }
    ]
  };
}

function getModeratorToolsPayload(data: CoreData) {
  const reports = (data.levelReports ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 8).map((report) => {
    const level = (data.levels ?? []).find((item) => item.levelId === report.levelId);
    return {
      reportId: report.reportId,
      levelId: report.levelId,
      levelName: level?.name ?? 'Unknown level',
      userName: level?.userName ?? 'Unknown',
      timestamp: report.timestamp,
      suggestedAction: level?.stars ? 'review' : 'inspect'
    };
  });
  const suggested = (data.levels ?? []).filter((level) => level.stars === 0).sort((a, b) => b.updateDate - a.updateDate).slice(0, 8);
  const hiddenLevels = (data.levels ?? []).filter((level) => level.isHidden).slice().sort((a, b) => b.updateDate - a.updateDate).slice(0, 8);
  const pendingSongs = (data.songs ?? []).filter((song) => song.status === "pending");
  return {
    success: true,
    summary: {
      reports: reports.length,
      suggested: suggested.length,
      hiddenLevels: hiddenLevels.length,
      vaultCodes: data.vaultCodes?.length ?? 0,
      automodRules: data.quests?.length ?? 0,
      pendingSongs: pendingSongs.length
    },
    reports,
    suggested,
    hiddenLevels,
    pendingSongs: pendingSongs.slice(0, 8),
    system: [
      { label: 'Vault codes', value: String(data.vaultCodes?.length ?? 0) },
      { label: 'Automod state', value: 'manual review' },
      { label: 'Pending songs', value: String(pendingSongs.length) },
      { label: 'Quest controls', value: String(data.quests?.length ?? 0) }
    ]
  };
}

function getStatisticsSuitePayload(data: CoreData, user: DashboardUser) {
  const dailyFeatures = (data.dailyFeatures ?? []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 6).map((feature) => {
    const level = (data.levels ?? []).find((item) => item.levelId === feature.levelId);
    return {
      featureId: feature.featureId,
      kind: feature.type === 0 ? 'daily' : feature.type === 1 ? 'weekly' : 'event',
      levelId: feature.levelId,
      levelName: level?.name ?? 'Unknown level',
      userName: level?.userName ?? 'Unknown'
    };
  });
  const moderators = (data.accounts ?? [])
    .map((account) => ({ accountId: account.accountId, userName: account.userName, roles: resolveRoleIds(account.accountId) }))
    .filter((account) => account.roles.some((role) => role !== 'player'))
    .slice(0, 8);
  const leaderboard = (data.users ?? []).slice().sort((a, b) => b.stars - a.stars || b.creatorPoints - a.creatorPoints).slice(0, 8);
  if (!isStaffUser(user)) {
    return {
      success: true,
      mode: 'public',
      summary: {
        totalAccounts: data.accounts?.length ?? 0,
        totalLevels: data.levels?.length ?? 0,
        totalComments: data.comments?.length ?? 0,
        totalSongs: data.songs?.length ?? 0
      },
      dailyFeatures,
      moderators: [],
      leaderboard,
      actions: [
        { label: 'Accounts', value: String(data.accounts?.length ?? 0) },
        { label: 'Levels', value: String(data.levels?.length ?? 0) },
        { label: 'Comments', value: String(data.comments?.length ?? 0) },
        { label: 'Songs', value: String(data.songs?.length ?? 0) }
      ]
    };
  }
  return {
    success: true,
    mode: 'staff',
    summary: {
      dailyFeatures: dailyFeatures.length,
      moderators: moderators.length,
      modActions: 0,
      leaderboardRows: leaderboard.length
    },
    dailyFeatures,
    moderators,
    leaderboard,
    actions: [
      { label: 'Moderator actions', value: '0 tracked' },
      { label: 'Report backlog', value: String(data.levelReports?.length ?? 0) },
      { label: 'Daily slots', value: String(data.dailyFeatures?.length ?? 0) },
      { label: 'Gauntlets', value: String(data.gauntlets?.length ?? 0) }
    ]
  };
}

function getIntegrationsPayload(data: CoreData, user: DashboardUser) {
  const profile = getIntegrationPublicProfile(data);
  if (!isStaffUser(user)) {
    return {
      success: true,
      mode: 'public',
      telegram: profile.telegram,
      discord: profile.discord
    };
  }
  return {
    success: true,
    mode: 'staff',
    telegram: profile.telegram,
    discord: profile.discord,
    controls: [
      { label: 'Public integrations', value: getPublicIntegrationsEnabled(data) ? 'enabled' : 'disabled' },
      { label: 'Telegram profile', value: profile.telegram.enabled ? '@' + profile.telegram.botUsername : 'disabled' },
      { label: 'Discord profile', value: profile.discord.enabled ? 'linked' : 'disabled' },
      { label: 'Webhook secrets', value: 'hidden' }
    ]
  };
}

function createUploadedSong(data: CoreData, user: DashboardUser, body: Record<string, unknown>, linked: boolean) {
  const name = String(body.name ?? "").trim();
  const authorName = String(body.authorName ?? user.userName).trim() || user.userName;
  const sourceUrl = linked ? String(body.sourceUrl ?? "").trim() : "";
  if (!name || name.length < 2 || name.length > 64) return { ok: false, error: "Song name must be between 2 and 64 characters" as const };
  if (linked && (!sourceUrl || !/^https?:\/\//i.test(sourceUrl))) return { ok: false, error: "Linked song requires a valid URL" as const };
  const songs = data.songs ?? [];
  const songId = Math.max(1, ...songs.map((song) => song.songId + 1));
  const status: SongRecord["status"] = isStaffUser(user) ? "approved" : "pending";
  const song: SongRecord = { songId, name, authorName, ownerAccountId: user.accountId, sourceUrl: sourceUrl || undefined, status };
  const updated: CoreData = { ...data, songs: [...songs, song] };
  writeData(updated);
  return { ok: true as const, song };
}

function resolveReport(data: CoreData, reportId: number) {
  const reports = data.levelReports ?? [];
  const before = reports.length;
  const nextReports = reports.filter((report) => report.reportId !== reportId);
  if (nextReports.length === before) return false;
  writeData({ ...data, levelReports: nextReports });
  return true;
}

function toggleLevelHidden(data: CoreData, levelId: number, hidden: boolean) {
  const levels = data.levels ?? [];
  const index = levels.findIndex((level) => level.levelId === levelId);
  if (index < 0) return false;
  const next = levels.slice();
  next[index] = { ...next[index], isHidden: hidden, updateDate: Math.floor(Date.now() / 1000) };
  writeData({ ...data, levels: next });
  return true;
}

function addVaultCode(data: CoreData, body: Record<string, unknown>) {
  const code = String(body.code ?? "").trim();
  const rewards = String(body.rewards ?? "").trim();
  const duration = Math.max(60, Number(body.duration ?? 86400) || 86400);
  const uses = Math.max(1, Number(body.uses ?? 1) || 1);
  if (!code || code.length < 3 || code.length > 32) return { ok: false, error: "Vault code must be between 3 and 32 characters" as const };
  if (!rewards) return { ok: false, error: "Rewards payload is required" as const };
  const vaultCodes = data.vaultCodes ?? [];
  if (vaultCodes.some((item) => item.code.toLowerCase() === code.toLowerCase())) return { ok: false, error: "Vault code already exists" as const };
  const rewardId = Math.max(1, ...vaultCodes.map((item) => item.rewardId + 1));
  const entry: VaultCodeRecord = { rewardId, code, rewards, duration, uses, timestamp: Math.floor(Date.now() / 1000) };
  writeData({ ...data, vaultCodes: [...vaultCodes, entry] });
  return { ok: true as const, entry };
}

function setAccountBan(data: CoreData, actor: DashboardUser, accountId: number, reason: string, banned: boolean) {
  const accounts = data.accounts ?? [];
  const index = accounts.findIndex((account) => account.accountId === accountId);
  if (index < 0) return { ok: false as const, error: "Account not found" as const };
  if (accountId === actor.accountId) return { ok: false as const, error: "You cannot ban your own account" as const };
  const next = accounts.slice();
  if (banned) {
    next[index] = {
      ...next[index],
      isActive: false,
      bannedAt: Math.floor(Date.now() / 1000),
      bannedBy: actor.accountId,
      banReason: reason || "No reason"
    };
  } else {
    next[index] = {
      ...next[index],
      isActive: true,
      bannedAt: undefined,
      bannedBy: undefined,
      banReason: undefined
    };
  }
  writeData({ ...data, accounts: next });
  return { ok: true as const, account: next[index] };
}
async function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const data = readData();
  const send = (payload: unknown, statusCode = 200) => {
    const result = sendJson(payload, statusCode);
    response.writeHead(result.statusCode, result.headers);
    response.end(result.body);
  };

  if (url.pathname === "/healthz") {
    send({ status: "ok", service: config.projectName, env: config.appEnv, dataFilePath: config.dataFilePath });
    return;
  }

  if (url.pathname === "/dashboard/api/info" && request.method === "GET") {
    send({ success: true, name: getProjectDisplayName(data), localeOptions: dashboardLocales, allowPlayerDashboard: config.allowPlayerDashboard, authMode: "geometry-dash-account", dashboardDefaults: { defaultTheme: getDefaultTheme(data), allowUserThemeOverride: getAllowUserThemeOverride(data) }, publicFeatures: { statistics: getPublicStatisticsEnabled(data), integrations: getPublicIntegrationsEnabled(data) } });
    return;
  }

  if (url.pathname === "/dashboard/api/register" && request.method === "POST") {
    const body = await readJsonBody(request);
    const userName = String(body.userName ?? "").trim().replace(/\s+/g, "");
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!userName || !email || !password || !confirmPassword) {
      send({ success: false, error: "Fill in all fields" }, 400);
      return;
    }
    if (userName.length < 3) {
      send({ success: false, error: "Username is too short" }, 400);
      return;
    }
    if (userName.length > 20) {
      send({ success: false, error: "Username is too long" }, 400);
      return;
    }
    if (!email.includes("@")) {
      send({ success: false, error: "Invalid email" }, 400);
      return;
    }
    if (password.length < 6) {
      send({ success: false, error: "Password must be at least 6 characters" }, 400);
      return;
    }
    if (password !== confirmPassword) {
      send({ success: false, error: "Passwords do not match" }, 400);
      return;
    }
    if ((data.accounts ?? []).some((account) => account.userName.toLowerCase() === userName.toLowerCase())) {
      send({ success: false, error: "Username already exists" }, 409);
      return;
    }
    if ((data.accounts ?? []).some((account) => account.email.toLowerCase() === email.toLowerCase())) {
      send({ success: false, error: "Email already exists" }, 409);
      return;
    }

    const user = createAccountInData(data, userName, email, password);
    const dashboardAccess = isDashboardAllowed(user);
    if (!dashboardAccess) {
      send({ success: true, accountCreated: true, dashboardAccess: false, message: "GDPS account created. Dashboard access requires a permitted role." });
      return;
    }
    const auth = issueDashboardAuth(user);
    send({ success: true, accountCreated: true, dashboardAccess: true, token: auth.token, user: auth.user });
    return;
  }

  if (url.pathname === "/dashboard/api/login" && request.method === "POST") {
    const body = await readJsonBody(request);
    const userName = String(body.userName ?? "").trim();
    const password = String(body.password ?? "");
    const account = data.accounts?.find((item) => item.userName.toLowerCase() === userName.toLowerCase());
    if (!account || !verifyPassword(password, account.passwordHash)) {
      send({ success: false, error: "Invalid username or password" }, 401);
      return;
    }
    const user = buildDashboardUser(data, account.accountId);
    if (!user || !isDashboardAllowed(user)) {
      send({ success: false, error: "No dashboard access" }, 403);
      return;
    }
    const auth = issueDashboardAuth(user);
    send({ success: true, token: auth.token, user: auth.user });
    return;
  }

  const authUser = requireAuth(request, data);
  if (url.pathname.startsWith("/dashboard/api/") && !["/dashboard/api/login", "/dashboard/api/register", "/dashboard/api/info"].includes(url.pathname)) {
    if (!authUser) {
      send({ success: false, error: "Unauthorized" }, 401);
      return;
    }
  }

  if (url.pathname === "/dashboard/api/me" && request.method === "GET") { send({ success: true, user: toPublicUser(authUser as DashboardUser) }); return; }
  if (url.pathname === "/dashboard/api/overview" && request.method === "GET") { send(overviewPayload(data)); return; }
  if (url.pathname === "/dashboard/api/live-feed" && request.method === "GET") { send({ success: true, items: latestActivity(data) }); return; }
  if (url.pathname === "/dashboard/api/themes" && request.method === "GET") { send(themesPayload()); return; }
  if (url.pathname === "/dashboard/api/players" && request.method === "GET") { send(getPlayerList(data, url.searchParams.get("search") ?? "", Math.max(0, Number(url.searchParams.get("page") ?? "0")), Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? "20"))))); return; }
  if (url.pathname === "/dashboard/api/live-control" && request.method === "GET") { send(getLiveControlPayload(data)); return; }
  if (url.pathname === "/dashboard/api/moderation/queue" && request.method === "GET") { send(getModerationQueuePayload(data)); return; }
  if (url.pathname === "/dashboard/api/security/summary" && request.method === "GET") { send(getSecuritySummaryPayload(data)); return; }
  if (url.pathname === "/dashboard/api/events/studio" && request.method === "GET") { send(getEventStudioPayload(data)); return; }
  if (url.pathname === "/dashboard/api/content/hub" && request.method === "GET") { send(getContentHubPayload(data)); return; }
  if (url.pathname === "/dashboard/api/account/manage" && request.method === "GET") {
    const payload = getAccountManagePayload(data, authUser as DashboardUser);
    if (!payload) { send({ success: false, error: "Account not found" }, 404); return; }
    send(payload);
    return;
  }
  if (url.pathname === "/dashboard/api/browse/levels" && request.method === "GET") {
    send(getBrowseLevelsPayload(data, Math.max(0, Number(url.searchParams.get("page") ?? "0")), Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? "20")))));
    return;
  }
  if (url.pathname === "/dashboard/api/browse/songs" && request.method === "GET") {
    send(getBrowseSongsPayload(data, Math.max(0, Number(url.searchParams.get("page") ?? "0")), Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? "20")))));
    return;
  }  if (url.pathname === "/dashboard/api/profile" && request.method === "GET") {
    const payload = getProfilePayload(data, authUser as DashboardUser);
    if (!payload) { send({ success: false, error: "Profile not found" }, 404); return; }
    send(payload);
    return;
  }
  if (url.pathname === "/dashboard/api/messenger" && request.method === "GET") {
    send(getMessengerPayload(data, authUser as DashboardUser));
    return;
  }
  if (url.pathname === "/dashboard/api/browse/clans" && request.method === "GET") {
    send(getBrowseClansPayload(data, Math.max(0, Number(url.searchParams.get("page") ?? "0")), Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? "20")))));
    return;
  }
  if (url.pathname === "/dashboard/api/upload/hub" && request.method === "GET") {
    send(getUploadHubPayload(data, authUser as DashboardUser));
    return;
  }
  if (url.pathname === "/dashboard/api/mod-tools" && request.method === "GET") {
    send(getModeratorToolsPayload(data));
    return;
  }
  if (url.pathname === "/dashboard/api/upload/song" && request.method === "POST") {
    const body = await readJsonBody(request);
    const result = createUploadedSong(data, authUser as DashboardUser, body, false);
    if (!result.ok) { send({ success: false, error: result.error }, 400); return; }
    send({ success: true, song: result.song });
    return;
  }
  if (url.pathname === "/dashboard/api/upload/song-link" && request.method === "POST") {
    const body = await readJsonBody(request);
    const result = createUploadedSong(data, authUser as DashboardUser, body, true);
    if (!result.ok) { send({ success: false, error: result.error }, 400); return; }
    send({ success: true, song: result.song });
    return;
  }
  if (url.pathname === "/dashboard/api/mod-tools/report/resolve" && request.method === "POST") {
    if (!canUseModeratorTools(authUser as DashboardUser)) { send({ success: false, error: "Forbidden" }, 403); return; }
    const body = await readJsonBody(request);
    const reportId = Number(body.reportId ?? 0);
    if (!Number.isFinite(reportId) || reportId <= 0) { send({ success: false, error: "Invalid reportId" }, 400); return; }
    if (!resolveReport(data, reportId)) { send({ success: false, error: "Report not found" }, 404); return; }
    send({ success: true, reportId });
    return;
  }
  if (url.pathname === "/dashboard/api/mod-tools/level/hide" && request.method === "POST") {
    if (!canUseModeratorTools(authUser as DashboardUser)) { send({ success: false, error: "Forbidden" }, 403); return; }
    const body = await readJsonBody(request);
    const levelId = Number(body.levelId ?? 0);
    const hidden = body.hidden !== false;
    if (!Number.isFinite(levelId) || levelId <= 0) { send({ success: false, error: "Invalid levelId" }, 400); return; }
    if (!toggleLevelHidden(data, levelId, hidden)) { send({ success: false, error: "Level not found" }, 404); return; }
    send({ success: true, levelId, hidden });
    return;
  }
  if (url.pathname === "/dashboard/api/mod-tools/account/ban" && request.method === "POST") {
    if (!canUseModeratorTools(authUser as DashboardUser)) { send({ success: false, error: "Forbidden" }, 403); return; }
    const body = await readJsonBody(request);
    const accountId = Number(body.accountId ?? 0);
    const reason = String(body.reason ?? "").trim();
    const banned = body.banned !== false;
    if (!Number.isFinite(accountId) || accountId <= 0) { send({ success: false, error: "Invalid accountId" }, 400); return; }
    const result = setAccountBan(data, authUser as DashboardUser, accountId, reason, banned);
    if (!result.ok) { send({ success: false, error: result.error }, 400); return; }
    send({ success: true, accountId, banned, account: { accountId: result.account.accountId, userName: result.account.userName, isActive: result.account.isActive !== false, banReason: result.account.banReason ?? null } });
    return;
  }
  if (url.pathname === "/dashboard/api/mod-tools/vault/add" && request.method === "POST") {
    if (!canUseModeratorTools(authUser as DashboardUser)) { send({ success: false, error: "Forbidden" }, 403); return; }
    const body = await readJsonBody(request);
    const result = addVaultCode(data, body);
    if (!result.ok) { send({ success: false, error: result.error }, 400); return; }
    send({ success: true, vaultCode: result.entry });
    return;
  }
  if (url.pathname === "/dashboard/api/statistics/suite" && request.method === "GET") {
    if (!isStaffUser(authUser as DashboardUser) && !getPublicStatisticsEnabled(data)) { send({ success: false, error: "Forbidden" }, 403); return; }
    send(getStatisticsSuitePayload(data, authUser as DashboardUser));
    return;
  }
  if (url.pathname === "/dashboard/api/settings/project" && request.method === "GET") {
    send({ success: true, projectName: getProjectDisplayName(data), defaultTheme: getDefaultTheme(data), allowUserThemeOverride: getAllowUserThemeOverride(data), publicStatisticsEnabled: getPublicStatisticsEnabled(data), publicIntegrationsEnabled: getPublicIntegrationsEnabled(data), integrations: getIntegrationPublicProfile(data) });
    return;
  }

  if (url.pathname === "/dashboard/api/settings/project" && request.method === "POST") {
    if (!canManageProjectSettings(authUser as DashboardUser)) {
      send({ success: false, error: "Forbidden" }, 403);
      return;
    }
    const body = await readJsonBody(request);
    const projectName = String(body.projectName ?? "").trim();
    const defaultTheme = String(body.defaultTheme ?? getDefaultTheme(data)).trim();
    const allowUserThemeOverride = body.allowUserThemeOverride !== false;
    const publicStatisticsEnabled = body.publicStatisticsEnabled !== false;
    const publicIntegrationsEnabled = body.publicIntegrationsEnabled !== false;
    const currentIntegrations = getIntegrationPublicProfile(data);
    const telegramEnabled = body.telegramEnabled !== false;
    const telegramBotUsername = String(body.telegramBotUsername ?? currentIntegrations.telegram.botUsername).trim();
    const telegramBotUrl = String(body.telegramBotUrl ?? currentIntegrations.telegram.botUrl).trim();
    const discordEnabled = body.discordEnabled !== false;
    const discordBotUrl = String(body.discordBotUrl ?? currentIntegrations.discord.botUrl).trim();
    const discordServerUrl = String(body.discordServerUrl ?? currentIntegrations.discord.serverUrl).trim();
    const allowedThemes = new Set(["megasa1nt", "minimalistic", "windows", "cli", "neon-core", "city-night", "robotic-steel", "lava-forge", "emerald-control", "solar-light", "geometry-pulse"]);
    if (projectName.length < 2 || projectName.length > 64) {
      send({ success: false, error: "Project name must be between 2 and 64 characters" }, 400);
      return;
    }
    if (!allowedThemes.has(defaultTheme)) {
      send({ success: false, error: "Unknown default theme" }, 400);
      return;
    }
    const updatedData: CoreData = {
      ...data,
      projectSettings: {
        ...(data.projectSettings ?? {}),
        projectName,
        defaultTheme,
        allowUserThemeOverride,
        publicStatisticsEnabled,
        publicIntegrationsEnabled,
        telegramEnabled,
        telegramBotUsername,
        telegramBotUrl,
        discordEnabled,
        discordBotUrl,
        discordServerUrl
      }
    };
    writeData(updatedData);
    send({ success: true, projectName, defaultTheme, allowUserThemeOverride, publicStatisticsEnabled, publicIntegrationsEnabled, integrations: { telegram: { enabled: telegramEnabled, botUsername: telegramBotUsername, botUrl: telegramBotUrl }, discord: { enabled: discordEnabled, botUrl: discordBotUrl, serverUrl: discordServerUrl } } });
    return;
  }
  if (url.pathname === "/dashboard/api/integrations" && request.method === "GET") {
    if (!isStaffUser(authUser as DashboardUser) && !getPublicIntegrationsEnabled(data)) { send({ success: false, error: "Forbidden" }, 403); return; }
    send(getIntegrationsPayload(data, authUser as DashboardUser));
    return;
  }
  if (url.pathname === "/dashboard/api/player-360" && request.method === "GET") {
    const accountId = Number(url.searchParams.get("accountId") ?? "0");
    const payload = getPlayer360(data, authUser as DashboardUser, accountId);
    if (!payload) { send({ success: false, error: "Player not found" }, 404); return; }
    send(payload); return;
  }

  send({ success: false, error: "Not found" }, 404);
});

server.listen(config.port, config.host, () => {
  console.log("[dashboard-api] listening", { host: config.host, port: config.port, projectName: config.projectName, dataFilePath: config.dataFilePath, allowPlayerDashboard: config.allowPlayerDashboard });
});


























