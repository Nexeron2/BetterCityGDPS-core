import { request as httpsRequest } from "node:https";
import type { CoreApiConfig } from "../config";
import { FileCoreStore } from "../storage/file-store";
import { hashPassword, gjp2FromPassword, verifyPassword } from "../utils/crypto";
import { encodeLevelStringForDownload, formatUserString, levelHashList, levelHashSolo, levelHashSolo2, levelHashSolo3, levelHashSolo4, urlSafeBase64Decode, urlSafeBase64Encode, xorCipher } from "../utils/gd";
import { sendJson, sendText } from "../http/response";
import type { LegacyHandlerResult, LegacyRequestContext } from "../http/types";
import type { StoredAccountComment, StoredComment, StoredFriendRequest, StoredFriendship, StoredLevel, StoredMessage, StoredUser } from "../storage/types";

function parseNumber(value: string | null | undefined, fallback = 0): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseString(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function parseNumberList(value: string | null | undefined): number[] {
  return (value ?? "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((part) => Number.isFinite(part));
}

function hasFlag(value: string | null | undefined): boolean {
  return parseNumber(value) === 1;
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function formatLegacyTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}.${minutes}`;
}

function createDefaultUser(userName: string): Omit<StoredUser, "userId" | "extId"> {
  return { userName, stars: 0, demons: 0, coins: 0, userCoins: 0, diamonds: 0, moons: 0, creatorPoints: 0, color1: 0, color2: 3, color3: 0, accIcon: 0, accShip: 0, accBall: 0, accBird: 0, accDart: 0, accRobot: 0, accGlow: 0, accSpider: 0, accExplosion: 0, accSwing: 0, accJetpack: 0, dinfo: "", sinfo: "", pinfo: "", lastPlayed: Math.floor(Date.now() / 1000), chest1Time: 0, chest1Count: 0, chest2Time: 0, chest2Count: 0 };
}

function buildProfileResponse(user: StoredUser, account: ReturnType<FileCoreStore["findAccountById"]>): string {
  return [`1:${user.userName}`,`2:${user.userId}`,`13:${user.coins}`,`17:${user.userCoins}`,`10:${user.color1}`,`11:${user.color2}`,`51:${user.color3}`,`3:${user.stars}`,`46:${user.diamonds}`,`52:${user.moons}`,`4:${user.demons}`,`8:${Math.round(user.creatorPoints)}`,`18:${account?.messagesState ?? 0}`,`19:${account?.friendsState ?? 0}`,`50:${account?.commentsState ?? 0}`,`20:${account?.youtubeUrl ?? ""}`,`21:${user.accIcon}`,`22:${user.accShip}`,`23:${user.accBall}`,`24:${user.accBird}`,`25:${user.accDart}`,`26:${user.accRobot}`,`28:${user.accGlow}`,`43:${user.accSpider}`,`48:${user.accExplosion}`,`53:${user.accSwing}`,`54:${user.accJetpack}`,`30:1`,`16:${user.extId}`,`31:0`,`44:${account?.twitter ?? ""}`,`45:${account?.twitch ?? ""}`,`59:${account?.instagram ?? ""}`,`60:${account?.tiktok ?? ""}`,`58:${account?.discord ?? ""}`,`61:${account?.custom ?? ""}`,`49:0`,`55:${user.dinfo}`,`56:${user.sinfo}`,`57:${user.pinfo}`,"29:1"].join(":");
}

function buildLevelEntry(level: StoredLevel): string {
  return [`1:${level.levelId}`,`2:${level.name}`,`5:${level.version}`,`6:${level.userId}`,"8:10",`9:${level.difficulty}`,`10:${level.downloads}`,`12:${level.audioTrack}`,`13:${level.gameVersion}`,`14:${level.likes}`,`17:${level.demon}`,`43:${level.demonDiff}`,`25:${level.auto}`,`18:${level.stars}`,`19:${level.featured}`,`42:${level.epic}`,`45:${level.objects}`,`3:${level.description}`,`15:${level.length}`,`30:${level.original}`,`31:${level.twoPlayer}`,`37:${level.coins}`,`38:${level.verifiedCoins}`,`39:${level.requestedStars}`,"46:1","47:2",`40:${level.isLdm}`,`35:${level.songId}`].join(":");
}

function buildDownloadResponse(level: StoredLevel, gameVersion: number, featureId = 0, user: StoredUser | null = null): string {
  const encodedDescription = gameVersion > 19 ? urlSafeBase64Encode(level.description) : level.description;
  const encodedLevelString = encodeLevelStringForDownload(level.levelString, gameVersion);
  const soloSeed = `${level.userId},${level.stars},${level.demon},${level.levelId},${level.verifiedCoins},${level.featured},${level.password},${featureId}`;
  const response = [`1:${level.levelId}`,`2:${level.name}`,`3:${encodedDescription}`,`4:${encodedLevelString}`,`5:${level.version}`,`6:${level.userId}`,"8:10",`9:${level.difficulty}`,`10:${level.downloads}`,"11:1",`12:${level.audioTrack}`,`13:${level.gameVersion}`,`14:${level.likes}`,`17:${level.demon}`,`43:${level.demonDiff}`,`25:${level.auto}`,`18:${level.stars}`,`19:${level.featured}`,`42:${level.epic}`,`45:${level.objects}`,`15:${level.length}`,`30:${level.original}`,`31:${level.twoPlayer}`,`28:${formatLegacyTime(level.uploadDate)}`,`29:${formatLegacyTime(level.updateDate)}`,`35:${level.songId}`,`36:${level.extraString}`,`37:${level.coins}`,`38:${level.verifiedCoins}`,`39:${level.requestedStars}`,`46:${level.wt}`,`47:${level.wt2}`,`48:${level.settingsString}`,`40:${level.isLdm}`,`27:${level.password}`,`52:${level.songIds}`,`53:${level.sfxIds}`,`57:${level.ts}`, ...(featureId ? [`41:${featureId}`] : [])].join(":");
  const suffix = user ? `#${formatUserString(user)}` : "";
  return `${response}#${levelHashSolo(level.levelString)}#${levelHashSolo2(soloSeed)}${suffix}`;
}

function buildCommentEntry(comment: StoredComment, user: StoredUser): string {
  const encoded = urlSafeBase64Encode(comment.comment);
  return `2~${encoded}~3~${comment.userId}~4~${comment.likes}~5~0~7~${comment.isSpam}~9~${formatLegacyTime(comment.timestamp)}~6~${comment.commentId}~10~${comment.percent}~11~0:1~${user.userName}~7~1~9~${user.accIcon}~10~${user.color1}~11~${user.color2}~14~0~15~0~16~${user.extId}`;
}

function buildMessageEntry(message: StoredMessage, user: StoredUser, sent: number): string {
  return `6:${user.userName}:3:${user.userId}:2:${user.extId}:1:${message.messageId}:4:${message.subject}:8:${message.isNew}:9:${sent}:7:${formatLegacyTime(message.timestamp)}`;
}

function buildMessageDetail(message: StoredMessage, user: StoredUser, sent: number): string {
  return `6:${user.userName}:3:${user.userId}:2:${user.extId}:1:${message.messageId}:4:${message.subject}:8:${message.isNew}:9:${sent}:5:${message.body}:7:${formatLegacyTime(message.timestamp)}`;
}

function buildFriendRequestEntry(request: StoredFriendRequest, user: StoredUser): string {
  return `1:${user.userName}:2:${user.userId}:9:${user.accIcon}:10:${user.color1}:11:${user.color2}:14:0:15:0:16:${user.extId}:32:${request.requestId}:35:${request.comment}:41:${request.isNew}:37:${formatLegacyTime(request.timestamp)}`;
}
function buildAccountCommentEntry(comment: StoredAccountComment): string {
  return `2~${comment.comment}~3~${comment.userId}~4~${comment.likes}~5~0~7~${comment.isSpam}~9~${formatLegacyTime(comment.timestamp)}~6~${comment.accountCommentId}`;
}

function sanitizeHandle(value: string): string {
  return value.replace(/[^a-zA-Z0-9_]/g, "");
}


function sanitizeSongText(value: string): string {
  return value.replace(/[#:|~]/g, "").trim();
}

function decodeEscapedJsonText(value: string): string {
  return value.replace(/\\\//g, "/").replace(/\\\\/g, "\\").replace(/\\u0026/g, "&");
}


function parseSongInfoPayload(payload: string): { songId: number; name: string; authorId: number; authorName: string; size: string; download: string; isDisabled: number } | null {
  const parts = payload.split("~|~");
  const values = new Map<string, string>();

  for (let index = 0; index < parts.length - 1; index += 2) {
    values.set(parts[index], parts[index + 1]);
  }

  const songId = Number(values.get("1") ?? "0");
  const name = values.get("2") ?? "";
  const authorId = Number(values.get("3") ?? "0");
  const authorName = values.get("4") ?? "";
  const size = values.get("5") ?? "0";
  const download = values.get("10") ?? "";

  if (!Number.isFinite(songId) || songId <= 0 || !name || !authorName || !download) {
    return null;
  }

  return {
    songId,
    name,
    authorId: Number.isFinite(authorId) ? authorId : 0,
    authorName,
    size,
    download,
    isDisabled: 0
  };
}

function httpRequest(url: string, method: "GET" | "POST", body?: URLSearchParams): Promise<string | null> {
  return new Promise((resolve) => {
    const request = httpsRequest(url, {
      method,
      headers: body ? {
        "content-type": "application/x-www-form-urlencoded",
        "content-length": Buffer.byteLength(body.toString())
      } : undefined
    }, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

    request.on("error", () => resolve(null));
    request.setTimeout(10000, () => {
      request.destroy();
      resolve(null);
    });

    if (body) request.write(body.toString());
    request.end();
  });
}

async function fetchRemoteSongInfo(songId: number): Promise<string | null> {
  const boomlingsBody = new URLSearchParams({
    songID: String(songId),
    secret: "Wmfd2893gb7"
  });

  const boomlingsResponse = await httpRequest("https://www.boomlings.com/database/getGJSongInfo.php", "POST", boomlingsBody);
  if (boomlingsResponse && !["-1", "-2", ""].includes(boomlingsResponse.trim())) {
    return boomlingsResponse.trim();
  }

  const ngResponse = await httpRequest(`https://www.newgrounds.com/audio/listen/${songId}`, "GET");
  if (!ngResponse) return null;

  const urlMatch = ngResponse.match(/"url":"([^"]+)"/);
  const artistMatch = ngResponse.match(/"artist":"([^"]+)"/);
  const titleMatch = ngResponse.match(/<title>([^<]+)<\/title>/i);
  if (!urlMatch || !artistMatch || !titleMatch) return null;

  const downloadUrl = decodeEscapedJsonText(urlMatch[1]);
  const authorName = sanitizeSongText(decodeEscapedJsonText(artistMatch[1]));
  const title = sanitizeSongText(titleMatch[1].replace(/\s*-\s*Newgrounds.*$/i, ""));
  if (!downloadUrl || !authorName || !title) return null;

  return `1~|~${songId}~|~2~|~${title}~|~3~|~1234~|~4~|~${authorName}~|~5~|~6.69~|~6~|~~|~7~|~~|~8~|~1~|~10~|~${downloadUrl}`;
}

function buildPackHash(packs: Array<{ mapPackId: number; stars: number; coins: number }>): string {
  const seed = packs.map((pack) => {
    const id = String(pack.mapPackId);
    return `${id[0]}${id[id.length - 1]}${pack.stars}${pack.coins}`;
  }).join("");
  return levelHashSolo2(seed);
}

function buildGauntletHash(gauntlets: Array<{ gauntletId: number; levelIds: number[] }>): string {
  const seed = gauntlets.map((gauntlet) => `${gauntlet.gauntletId}${gauntlet.levelIds.join(",")}`).join("");
  return levelHashSolo2(seed);
}

function decodeIncomingChk(value: string, key: number): string {
  if (!value) return "";
  if (value.length > 5) {
    try {
      return xorCipher(urlSafeBase64Decode(value.slice(5)), key);
    } catch {
      return value;
    }
  }
  return value;
}

function createRewardStuff(orbsRange: [number, number], diamondsRange: [number, number], keysRange: [number, number]): string {
  const randomBetween = (min: number, max: number) => Math.floor((min + max) / 2);
  return `${randomBetween(orbsRange[0], orbsRange[1])},${randomBetween(diamondsRange[0], diamondsRange[1])},3,${randomBetween(keysRange[0], keysRange[1])}`;
}
function buildUserListEntry(user: StoredUser, isNew: number): string {
  return `1:${user.userName}:2:${user.userId}:9:${user.accIcon}:10:${user.color1}:11:${user.color2}:14:0:15:0:16:${user.extId}:18:0:41:${isNew}`;
}

function findAccountAndUser(store: FileCoreStore, context: LegacyRequestContext): { accountId: number; user: StoredUser } | null {
  const accountId = parseNumber(context.body.get("accountID"));
  if (!accountId) return null;
  const user = store.findUserByExtId(accountId);
  if (!user) return null;
  return { accountId, user };
}

function findAuthenticatedAccount(store: FileCoreStore, context: LegacyRequestContext): { account: NonNullable<ReturnType<FileCoreStore["findAccountById"]>>; user: StoredUser } | null {
  const accountId = parseNumber(context.body.get("accountID"));
  const userName = parseString(context.body.get("userName"));
  const password = parseString(context.body.get("password"));
  const gjp2 = parseString(context.body.get("gjp2"));
  const account = accountId ? store.findAccountById(accountId) : store.findAccountByUserName(userName);
  if (!account) return null;

  const valid = password ? verifyPassword(password, account.passwordHash) : (gjp2 ? gjp2 === account.gjp2 : false);
  if (!valid) return null;

  const user = store.findUserByExtId(account.accountId);
  if (!user) return null;
  return { account, user };
}

function sanitizeSaveData(saveData: string, password: string): string {
  if (!password) return saveData;
  return saveData.replace(`<k>GJA_002</k><s>${password}</s>`, '<k>GJA_002</k><s>password</s>');
}
function getRequestIp(context: LegacyRequestContext): string {
  const forwarded = context.request.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim();
  return forwarded || context.request.socket.remoteAddress || "0.0.0.0";
}

function getDifficultyFromStars(stars: number): { diff: number; auto: number; demon: number } {
  if (stars <= 0) return { diff: 0, auto: 0, demon: 0 };
  if (stars === 1) return { diff: 10, auto: 0, demon: 0 };
  if (stars === 2) return { diff: 20, auto: 0, demon: 0 };
  if (stars === 3) return { diff: 30, auto: 0, demon: 0 };
  if (stars === 4) return { diff: 40, auto: 0, demon: 0 };
  return { diff: 50, auto: 0, demon: 0 };
}

function hasDirectModAccess(accountId: number): boolean {
  return accountId === 1;
}

function matchesDifficulty(level: StoredLevel, diff: number, demonFilter: number): boolean {
  if (diff === 0) return true;
  if (diff === -1) return level.difficulty === 0 && level.auto === 0 && level.demon === 0;
  if (diff === -3) return level.auto === 1;
  if (diff === -2) {
    if (level.demon !== 1) return false;
    switch (demonFilter) {
      case 1: return level.demonDiff === 3;
      case 2: return level.demonDiff === 4;
      case 3: return level.demonDiff === 0;
      case 4: return level.demonDiff === 5;
      case 5: return level.demonDiff === 6;
      default: return true;
    }
  }

  const allowed = new Set(String(diff).split(",").map((part) => Number(`${part}0`)).filter((part) => Number.isFinite(part)));
  if (allowed.size === 0) return true;
  return level.auto === 0 && level.demon === 0 && allowed.has(level.difficulty);
}

function applyLevelFilters(levels: StoredLevel[], context: LegacyRequestContext): StoredLevel[] {
  const search = parseString(context.body.get("str"));
  const searchLower = search.toLowerCase();
  const type = parseNumber(context.body.get("type"), 0);
  const diffRaw = parseString(context.body.get("diff"));
  const diff = diffRaw === "" || diffRaw === "-" ? 0 : Number(diffRaw);
  const demonFilter = parseNumber(context.body.get("demonFilter"), 0);
  const lengthFilter = new Set(parseNumberList(context.body.get("len")));
  const song = parseNumber(context.body.get("song"), 0);
  const customSong = context.body.has("customSong");
  const gameVersion = parseNumber(context.body.get("gameVersion"), 21);
  const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
  const followedUsers = new Set(parseNumberList(context.body.get("followed")));
  const listIds = new Set(parseNumberList(search));
  const userSearchId = parseNumber(search, 0);
  const now = Math.floor(Date.now() / 1000);

  let filtered = levels.filter((level) => level.unlisted === 0);

  filtered = filtered.filter((level) => {
    if (context.body.has("original") && hasFlag(context.body.get("original")) && level.original !== 0) return false;
    if (hasFlag(context.body.get("coins")) && !(level.verifiedCoins === 1 && level.coins > 0)) return false;
    if (hasFlag(context.body.get("twoPlayer")) && level.twoPlayer !== 1) return false;
    if (hasFlag(context.body.get("star")) && level.stars === 0) return false;
    if (hasFlag(context.body.get("noStar")) && level.stars !== 0) return false;
    if (lengthFilter.size > 0 && !lengthFilter.has(level.length)) return false;
    if (!matchesDifficulty(level, diff, demonFilter)) return false;

    if (song > 0) {
      if (customSong) {
        if (level.songId !== song) return false;
      } else if (!(level.songId === 0 && level.audioTrack === song - 1)) {
        return false;
      }
    }

    const ratingFilters: boolean[] = [];
    if (hasFlag(context.body.get("featured"))) ratingFilters.push(level.featured > 0);
    if (hasFlag(context.body.get("epic"))) ratingFilters.push(level.epic === 1);
    if (hasFlag(context.body.get("mythic"))) ratingFilters.push(level.epic === 2);
    if (hasFlag(context.body.get("legendary"))) ratingFilters.push(level.epic === 3);
    if (ratingFilters.length > 0 && !ratingFilters.some(Boolean)) return false;

    return true;
  });

  switch (type) {
    case 0:
    case 15:
      if (search) {
        if (/^\d+$/.test(search)) filtered = filtered.filter((level) => level.levelId === Number(search));
        else filtered = filtered.filter((level) => level.name.toLowerCase().includes(searchLower));
      }
      filtered = filtered.sort((a, b) => b.likes - a.likes || b.uploadDate - a.uploadDate);
      break;
    case 1:
      filtered = filtered.sort((a, b) => b.downloads - a.downloads || b.uploadDate - a.uploadDate);
      break;
    case 2:
      filtered = filtered.sort((a, b) => b.likes - a.likes || b.uploadDate - a.uploadDate);
      break;
    case 3: {
      const weekAgo = now - 7 * 24 * 60 * 60;
      filtered = filtered.filter((level) => level.uploadDate > weekAgo).sort((a, b) => b.likes - a.likes || b.uploadDate - a.uploadDate);
      break;
    }
    case 5:
      filtered = filtered.filter((level) => level.userId === userSearchId).sort((a, b) => b.updateDate - a.updateDate || b.uploadDate - a.uploadDate);
      break;
    case 6:
    case 17:
      filtered = filtered.filter((level) => gameVersion > 21 ? level.featured > 0 || level.epic > 0 : level.featured > 0).sort((a, b) => b.featured - a.featured || b.epic - a.epic || b.updateDate - a.updateDate);
      break;
    case 7:
      filtered = filtered.filter((level) => level.objects > 9999).sort((a, b) => b.uploadDate - a.uploadDate);
      break;
    case 10:
    case 19:
      filtered = filtered.filter((level) => listIds.has(level.levelId));
      break;
    case 11:
      filtered = filtered.filter((level) => level.stars > 0).sort((a, b) => b.updateDate - a.updateDate || b.uploadDate - a.uploadDate);
      break;
    case 12:
      filtered = filtered.filter((level) => followedUsers.has(level.extId)).sort((a, b) => b.updateDate - a.updateDate || b.uploadDate - a.uploadDate);
      break;
    case 13:
    case 27:
      filtered = [];
      break;
    case 16:
      filtered = filtered.filter((level) => level.epic > 0).sort((a, b) => b.epic - a.epic || b.featured - a.featured || b.updateDate - a.updateDate);
      break;
    default:
      filtered = filtered.sort((a, b) => b.uploadDate - a.uploadDate);
      break;
  }

  return filtered.slice(page * 10, (page + 1) * 10);
}

function countFilteredLevels(levels: StoredLevel[], context: LegacyRequestContext): number {
  const body = new URLSearchParams();
  for (const [key, value] of context.body.entries()) body.set(key, value);
  body.set("page", "0");

  const firstPage = applyLevelFilters(levels, { ...context, body });
  if (firstPage.length < 10) return firstPage.length;

  const search = parseString(context.body.get("str"));
  const searchLower = search.toLowerCase();
  const type = parseNumber(context.body.get("type"), 0);
  const diffRaw = parseString(context.body.get("diff"));
  const diff = diffRaw === "" || diffRaw === "-" ? 0 : Number(diffRaw);
  const demonFilter = parseNumber(context.body.get("demonFilter"), 0);
  const lengthFilter = new Set(parseNumberList(context.body.get("len")));
  const song = parseNumber(context.body.get("song"), 0);
  const customSong = context.body.has("customSong");
  const gameVersion = parseNumber(context.body.get("gameVersion"), 21);
  const followedUsers = new Set(parseNumberList(context.body.get("followed")));
  const listIds = new Set(parseNumberList(search));
  const userSearchId = parseNumber(search, 0);
  const now = Math.floor(Date.now() / 1000);

  let filtered = levels.filter((level) => level.unlisted === 0);
  filtered = filtered.filter((level) => {
    if (context.body.has("original") && hasFlag(context.body.get("original")) && level.original !== 0) return false;
    if (hasFlag(context.body.get("coins")) && !(level.verifiedCoins === 1 && level.coins > 0)) return false;
    if (hasFlag(context.body.get("twoPlayer")) && level.twoPlayer !== 1) return false;
    if (hasFlag(context.body.get("star")) && level.stars === 0) return false;
    if (hasFlag(context.body.get("noStar")) && level.stars !== 0) return false;
    if (lengthFilter.size > 0 && !lengthFilter.has(level.length)) return false;
    if (!matchesDifficulty(level, diff, demonFilter)) return false;
    if (song > 0) {
      if (customSong) {
        if (level.songId !== song) return false;
      } else if (!(level.songId === 0 && level.audioTrack === song - 1)) {
        return false;
      }
    }
    const ratingFilters: boolean[] = [];
    if (hasFlag(context.body.get("featured"))) ratingFilters.push(level.featured > 0);
    if (hasFlag(context.body.get("epic"))) ratingFilters.push(level.epic === 1);
    if (hasFlag(context.body.get("mythic"))) ratingFilters.push(level.epic === 2);
    if (hasFlag(context.body.get("legendary"))) ratingFilters.push(level.epic === 3);
    if (ratingFilters.length > 0 && !ratingFilters.some(Boolean)) return false;
    return true;
  });

  switch (type) {
    case 0:
    case 15:
      if (search) {
        if (/^\d+$/.test(search)) filtered = filtered.filter((level) => level.levelId === Number(search));
        else filtered = filtered.filter((level) => level.name.toLowerCase().includes(searchLower));
      }
      break;
    case 3:
      filtered = filtered.filter((level) => level.uploadDate > now - 7 * 24 * 60 * 60);
      break;
    case 5:
      filtered = filtered.filter((level) => level.userId === userSearchId);
      break;
    case 6:
    case 17:
      filtered = filtered.filter((level) => gameVersion > 21 ? level.featured > 0 || level.epic > 0 : level.featured > 0);
      break;
    case 7:
      filtered = filtered.filter((level) => level.objects > 9999);
      break;
    case 10:
    case 19:
      filtered = filtered.filter((level) => listIds.has(level.levelId));
      break;
    case 11:
      filtered = filtered.filter((level) => level.stars > 0);
      break;
    case 12:
      filtered = filtered.filter((level) => followedUsers.has(level.extId));
      break;
    case 13:
    case 27:
      filtered = [];
      break;
    case 16:
      filtered = filtered.filter((level) => level.epic > 0);
      break;
  }

  return filtered.length;
}

export function createCoreHandlers(config: CoreApiConfig) {
  const store = new FileCoreStore(config.dataFilePath);

  return {
    getAccountUrl(context: LegacyRequestContext): LegacyHandlerResult {
      const host = context.request.headers.host ?? "localhost";
      const protocol = context.request.headers["x-forwarded-proto"]?.toString() || "http";
      return sendText(`${protocol}://${host}`);
    },
    registerAccount(context: LegacyRequestContext): LegacyHandlerResult {
      const userName = parseString(context.body.get("userName")).replace(/\s+/g, "");
      const password = parseString(context.body.get("password"));
      const email = parseString(context.body.get("email"));
      if (!userName || !password || !email) return sendText("-1");
      if (userName.length > 20) return sendText("-4");
      if (userName.length < 3) return sendText("-9");
      if (password.length < 6) return sendText("-8");
      if (!email.includes("@")) return sendText("-6");
      if (store.findAccountByUserName(userName)) return sendText("-2");
      store.createAccount({ userName, passwordHash: hashPassword(password), gjp2: gjp2FromPassword(password), email, registerDate: Math.floor(Date.now() / 1000), isActive: true, friendsState: 0, messagesState: 0, commentsState: 0, youtubeUrl: "", twitter: "", twitch: "", instagram: "", tiktok: "", discord: "", custom: "" }, createDefaultUser(userName));
      return sendText("1");
    },
    loginAccount(context: LegacyRequestContext): LegacyHandlerResult {
      const userName = parseString(context.body.get("userName"));
      const password = parseString(context.body.get("password"));
      const gjp2 = parseString(context.body.get("gjp2"));
      const account = store.findAccountByUserName(userName);
      if (!account) return sendText("-1");
      const valid = password ? verifyPassword(password, account.passwordHash) : gjp2 === account.gjp2;
      if (!valid) return sendText("-1");
      const user = store.findUserByExtId(account.accountId);
      if (!user) return sendText("-1");
      store.updateUser(user.userId, (current) => ({ ...current, lastPlayed: Math.floor(Date.now() / 1000) }));
      return sendText(`${account.accountId},${user.userId}`);
    },
    syncAccount(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      if (!authenticated) return sendText("-2");

      const saved = store.getAccountSave(authenticated.account.accountId);
      if (!saved) return sendText("-1");
      return sendText(`${saved.saveData};21;30;a;a`);
    },
    backupAccount(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      if (!authenticated) return sendText("-1");

      const rawSaveData = parseString(context.body.get("saveData"));
      if (!rawSaveData) return sendText("-1");

      const password = parseString(context.body.get("password"));
      const sanitized = sanitizeSaveData(rawSaveData, password);
      store.upsertAccountSave(authenticated.account.accountId, sanitized);
      return sendText("1");
    },
    restoreItems(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      if (!authenticated) return sendText("-1");

      const saved = store.getAccountSave(authenticated.account.accountId);
      if (!saved) return sendText("-1");

      try {
        return sendText(xorCipher(urlSafeBase64Decode(saved.saveData), 24157));
      } catch {
        return sendText("-1");
      }
    },
    requestUserAccess(): LegacyHandlerResult { return sendText("0"); },
    submitUserInfo(context: LegacyRequestContext): LegacyHandlerResult {
      const accountId = parseNumber(context.body.get("accountID"));
      const userName = parseString(context.body.get("userName"));
      const account = accountId ? store.findAccountById(accountId) : store.findAccountByUserName(userName);
      if (!account) return sendText("-1");
      const user = store.findUserByExtId(account.accountId);
      if (!user) return sendText("-1");
      store.updateUser(user.userId, (current) => ({ ...current, userName: userName || current.userName, lastPlayed: Math.floor(Date.now() / 1000) }));
      return sendText("1");
    },
    updateUserScore(context: LegacyRequestContext): LegacyHandlerResult {
      const accountId = parseNumber(context.body.get("accountID"));
      const userName = parseString(context.body.get("userName"));
      const account = accountId ? store.findAccountById(accountId) : store.findAccountByUserName(userName);
      if (!account) return sendText("-1");
      const user = store.findUserByExtId(account.accountId);
      if (!user) return sendText("-1");
      const updated = store.updateUser(user.userId, (current) => ({ ...current, userName: userName || current.userName, stars: parseNumber(context.body.get("stars"), current.stars), demons: parseNumber(context.body.get("demons"), current.demons), coins: parseNumber(context.body.get("coins"), current.coins), userCoins: parseNumber(context.body.get("userCoins"), current.userCoins), diamonds: parseNumber(context.body.get("diamonds"), current.diamonds), moons: parseNumber(context.body.get("moons"), current.moons), color1: parseNumber(context.body.get("color1"), current.color1), color2: parseNumber(context.body.get("color2"), current.color2), color3: parseNumber(context.body.get("color3"), current.color3), accIcon: parseNumber(context.body.get("accIcon"), current.accIcon), accShip: parseNumber(context.body.get("accShip"), current.accShip), accBall: parseNumber(context.body.get("accBall"), current.accBall), accBird: parseNumber(context.body.get("accBird"), current.accBird), accDart: parseNumber(context.body.get("accDart"), current.accDart), accRobot: parseNumber(context.body.get("accRobot"), current.accRobot), accGlow: parseNumber(context.body.get("accGlow"), current.accGlow), accSpider: parseNumber(context.body.get("accSpider"), current.accSpider), accExplosion: parseNumber(context.body.get("accExplosion"), current.accExplosion), accSwing: parseNumber(context.body.get("accSwing"), current.accSwing), accJetpack: parseNumber(context.body.get("accJetpack"), current.accJetpack), dinfo: parseString(context.body.get("dinfo")) || current.dinfo, sinfo: parseString(context.body.get("sinfo")) || current.sinfo, pinfo: parseString(context.body.get("pinfo")) || current.pinfo, lastPlayed: Math.floor(Date.now() / 1000) }));
      return sendText(updated ? String(updated.userId) : "-1");
    },
    getScores(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");
      const type = parseString(context.body.get("type")) || "top";
      const statIndex = parseNumber(context.body.get("stat"), 0);
      const statMap = ["stars", "moons", "demons", "userCoins"] as const;
      const stat = statMap[statIndex] ?? "stars";
      let users = store.listUsersSortedBy(type === "creators" ? "creatorPoints" : stat);
      if (type === "friends") {
        const friendIds = store.listFriendships(actor.accountId).map((friendship) => friendship.person1 === actor.accountId ? friendship.person2 : friendship.person1);
        friendIds.push(actor.accountId);
        users = store.listUsersSortedBy(stat, friendIds);
      }
      const payload = users.map((user, index) => `1:${user.userName}:2:${user.userId}:13:${user.coins}:17:${user.userCoins}:6:${index + 1}:9:${user.accIcon}:10:${user.color1}:11:${user.color2}:51:${user.color3}:14:0:15:0:16:${user.extId}:3:${user.stars}:8:${Math.round(user.creatorPoints)}:4:${user.demons}:7:${user.extId}:46:${user.diamonds}:52:${user.moons}`).join("|");
      return sendText(payload || "-1");
    },
    getCreators(): LegacyHandlerResult {
      const users = store.listUsersSortedBy("creatorPoints").filter((user) => user.creatorPoints > 0);
      const payload = users.map((user, index) => `1:${user.userName}:2:${user.userId}:13:${user.coins}:17:${user.userCoins}:6:${index + 1}:9:${user.accIcon}:10:${user.color1}:11:${user.color2}:14:0:15:0:16:${user.extId}:3:${user.stars}:8:${Math.round(user.creatorPoints)}:4:${user.demons}:7:${user.extId}:46:${user.diamonds}`).join("|");
      return sendText(payload || "-1");
    },
    getLevelScores(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const levelId = parseNumber(context.body.get("levelID"));
      if (!actor || !levelId) return sendText("-1");
      const percent = parseNumber(context.body.get("percent"), 0);
      const coins = parseNumber(context.body.get("s9"), 5819) - 5819;
      if (percent >= 0 && percent <= 100) store.upsertLevelScore(actor.accountId, levelId, percent, Math.max(coins, 0));
      const type = parseNumber(context.body.get("type"), 1);
      let accountIds: number[] | undefined;
      if (type === 0) {
        accountIds = store.listFriendships(actor.accountId).map((friendship) => friendship.person1 === actor.accountId ? friendship.person2 : friendship.person1);
        accountIds.push(actor.accountId);
      }
      const scores = store.listLevelScores(levelId, accountIds);
      const payload = scores.map((score, index) => {
        const user = store.findUserByExtId(score.accountId);
        if (!user) return null;
        return `1:${user.userName}:2:${user.userId}:9:${user.accIcon}:10:${user.color1}:11:${user.color2}:51:${user.color3}:14:0:15:0:16:${user.extId}:3:${score.percent}:6:${index + 1}:13:${score.coins}:42:${formatLegacyTime(score.timestamp)}`;
      }).filter((entry): entry is string => Boolean(entry)).join("|");
      return sendText(payload || "-1");
    },
    async getSongInfo(context: LegacyRequestContext): Promise<LegacyHandlerResult> {
      const songId = parseNumber(context.body.get("songID"));
      if (!songId) return sendText("-1");
      const song = store.findSongById(songId);
      if (!song) {
        const remoteSong = await fetchRemoteSongInfo(songId);
        return sendText(remoteSong ?? "-1");
      }
      if (song.isDisabled === 1) return sendText("-2");
      return sendText(`1~|~${song.songId}~|~2~|~${song.name}~|~3~|~${song.authorId}~|~4~|~${song.authorName}~|~5~|~${song.size}~|~6~|~~|~7~|~~|~8~|~0~|~10~|~${song.download}`);
    },
    getTopArtists(context: LegacyRequestContext): LegacyHandlerResult {
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      const result = store.listTopSongs(page);
      const payload = result.songs.map((song) => `4:${song.authorName} - ${song.name}, ${song.songId}:7:${song.download}`).join("|");
      return sendText(`${payload || "4:There is no songs!"}#${result.total}:${page * 20}:20`);
    },
    getUserInfo(context: LegacyRequestContext): LegacyHandlerResult {
      const targetAccountId = parseNumber(context.body.get("targetAccountID"));
      if (!targetAccountId) return sendText("-1");
      const account = store.findAccountById(targetAccountId);
      const user = store.findUserByExtId(targetAccountId);
      if (!account || !user) return sendText("-1");
      return sendText(buildProfileResponse(user, account));
    },
    searchUsers(context: LegacyRequestContext): LegacyHandlerResult {
      const search = parseString(context.body.get("str"));
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      const result = store.searchUsers(search, page);
      if (result.users.length === 0) return sendText("-1");
      const payload = result.users.map((user) => `1:${user.userName}:2:${user.userId}:13:${user.coins}:17:${user.userCoins}:9:${user.accIcon}:10:${user.color1}:11:${user.color2}:51:${user.color3}:14:0:15:0:16:${user.extId}:3:${user.stars}:8:${Math.round(user.creatorPoints)}:4:${user.demons}:46:${user.diamonds}:52:${user.moons}`).join("|");
      return sendText(`${payload}#${result.total}:${page * 10}:10`);
    },
    updateAccountSettings(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");
      store.updateAccount(actor.accountId, (account) => ({
        ...account,
        messagesState: parseNumber(context.body.get("mS"), account.messagesState),
        friendsState: parseNumber(context.body.get("frS"), account.friendsState),
        commentsState: parseNumber(context.body.get("cS"), account.commentsState),
        youtubeUrl: sanitizeHandle(parseString(context.body.get("yt"))),
        twitter: sanitizeHandle(parseString(context.body.get("twitter"))),
        twitch: sanitizeHandle(parseString(context.body.get("twitch"))),
        instagram: sanitizeHandle(parseString(context.body.get("instagram"))),
        tiktok: sanitizeHandle(parseString(context.body.get("tiktok"))),
        discord: sanitizeHandle(parseString(context.body.get("discord"))),
        custom: sanitizeHandle(parseString(context.body.get("custom")))
      }));
      return sendText("1");
    },
    getAccountComments(context: LegacyRequestContext): LegacyHandlerResult {
      const accountId = parseNumber(context.body.get("accountID"));
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      if (!accountId) return sendText("#0:0:0");
      const user = store.findUserByExtId(accountId);
      if (!user) return sendText("#0:0:0");
      const comments = store.listAccountCommentsForUser(user.userId);
      const pageComments = comments.slice(page * 10, (page + 1) * 10);
      const payload = pageComments.map(buildAccountCommentEntry).join("|");
      return sendText(`${payload}#${comments.length}:${page * 10}:10`);
    },
    uploadAccountComment(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const comment = parseString(context.body.get("comment"));
      if (!actor || !comment) return sendText("-1");
      store.createAccountComment({ userId: actor.user.userId, userName: actor.user.userName, comment });
      return sendText("1");
    },
    deleteAccountComment(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const commentId = parseNumber(context.body.get("commentID"));
      if (!actor || !commentId) return sendText("-1");
      return sendText(store.deleteAccountComment(commentId, actor.user.userId) ? "1" : "-1");
    },
    getLevels(context: LegacyRequestContext): LegacyHandlerResult {
      const gameVersion = parseNumber(context.body.get("gameVersion"), 21);
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      const allLevels = store.listLevels();
      const filteredLevels = applyLevelFilters(allLevels, context);
      const totalCount = countFilteredLevels(allLevels, context);
      const levelSection = filteredLevels.map(buildLevelEntry).join("|");
      const userSection = filteredLevels
        .map((level) => store.findUserByUserId(level.userId))
        .filter((user): user is StoredUser => Boolean(user))
        .map(formatUserString)
        .join("|");
      const payload = `${levelSection}#${userSection}${gameVersion > 18 ? "#" : ""}#${totalCount}:${page * 10}:10#${levelHashList(filteredLevels)}`;
      return sendText(payload);
    },
    downloadLevel(context: LegacyRequestContext): LegacyHandlerResult {
      let levelId = parseNumber(context.body.get("levelID"));
      const gameVersion = parseNumber(context.body.get("gameVersion"), 22);
      let featureId = 0;
      let includeUser = false;
      if (levelId === -1 || levelId === -2 || levelId === -3) {
        const featureType = levelId === -1 ? 0 : levelId === -2 ? 1 : 2;
        const feature = store.getDailyFeature(featureType as 0 | 1 | 2, Math.floor(Date.now() / 1000));
        if (!feature) return sendText("-1");
        levelId = feature.levelId;
        featureId = feature.featureId + (featureType * 100000);
        includeUser = true;
      }
      if (!levelId) return sendText("-1");
      const level = store.findLevelById(levelId);
      if (!level) return sendText("-1");
      const user = includeUser ? store.findUserByUserId(level.userId) ?? null : null;
      return sendText(buildDownloadResponse(level, gameVersion, featureId, user));
    },
    uploadLevel(context: LegacyRequestContext): LegacyHandlerResult {
      const accountId = parseNumber(context.body.get("accountID"));
      const userName = parseString(context.body.get("userName"));
      const account = accountId ? store.findAccountById(accountId) : store.findAccountByUserName(userName);
      if (!account) return sendText("-1");
      const user = store.findUserByExtId(account.accountId);
      if (!user) return sendText("-1");
      const levelName = parseString(context.body.get("levelName"));
      const rawDescription = parseString(context.body.get("levelDesc"));
      const levelString = parseString(context.body.get("levelString"));
      if (!levelName || !levelString) return sendText("-1");
      const existing = store.findLevelByNameForUser(user.userId, levelName);
      const description = parseNumber(context.body.get("gameVersion"), 22) < 20 ? rawDescription : (rawDescription ? decodeBase64Url(rawDescription) : "");
      const level = store.createOrUpdateLevel({
        name: levelName,
        description,
        version: parseNumber(context.body.get("levelVersion"), existing?.version ?? 1),
        userId: user.userId,
        extId: account.accountId,
        userName: user.userName,
        gameVersion: parseNumber(context.body.get("gameVersion"), 22),
        binaryVersion: parseNumber(context.body.get("binaryVersion"), 39),
        audioTrack: parseNumber(context.body.get("audioTrack"), 1),
        songId: parseNumber(context.body.get("songID"), 0),
        songIds: parseString(context.body.get("songIDs")),
        sfxIds: parseString(context.body.get("sfxIDs")),
        length: parseNumber(context.body.get("levelLength"), 0),
        downloads: existing?.downloads ?? 300,
        likes: existing?.likes ?? 100,
        stars: existing?.stars ?? 0,
        featured: existing?.featured ?? 0,
        epic: existing?.epic ?? 0,
        objects: parseNumber(context.body.get("objects"), 0),
        coins: parseNumber(context.body.get("coins"), 0),
        verifiedCoins: existing?.verifiedCoins ?? 0,
        requestedStars: parseNumber(context.body.get("requestedStars"), 0),
        difficulty: existing?.difficulty ?? 0,
        demon: existing?.demon ?? 0,
        demonDiff: existing?.demonDiff ?? 0,
        auto: parseNumber(context.body.get("auto"), 0),
        original: parseNumber(context.body.get("original"), 0),
        twoPlayer: parseNumber(context.body.get("twoPlayer"), 0),
        extraString: parseString(context.body.get("extraString")),
        levelInfo: parseString(context.body.get("levelInfo")),
        password: parseNumber(context.body.get("password"), 0),
        levelString,
        settingsString: parseString(context.body.get("settingsString")),
        isLdm: parseNumber(context.body.get("ldm"), 0),
        wt: parseNumber(context.body.get("wt"), 0),
        wt2: parseNumber(context.body.get("wt2"), 0),
        ts: parseNumber(context.body.get("ts"), 0),
        unlisted: parseNumber(context.body.get("unlisted"), 0)
      }, existing?.levelId);
      return sendText(String(level.levelId));
    },
    updateLevelDescription(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      const levelId = parseNumber(context.body.get("levelID"));
      const encodedDescription = parseString(context.body.get("levelDesc"));
      if (!authenticated || !levelId) return sendText("-1");

      let description = encodedDescription;
      if (encodedDescription) {
        try {
          description = decodeBase64Url(encodedDescription);
        } catch {
          description = encodedDescription;
        }
      }

      const current = store.findLevelById(levelId);
      if (!current || current.extId !== authenticated.account.accountId) return sendText("-1");
      store.updateLevel(levelId, (level) => ({ ...level, description }));
      return sendText("1");
    },
    deleteLevel(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      const levelId = parseNumber(context.body.get("levelID"));
      if (!authenticated || !levelId) return sendText("-1");
      return sendText(store.deleteLevel(levelId, authenticated.user.userId) ? "1" : "-1");
    },
    rateStars(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      if (!authenticated) return sendText("-1");
      if (hasDirectModAccess(authenticated.account.accountId)) {
        const stars = parseNumber(context.body.get("stars"), 0);
        const levelId = parseNumber(context.body.get("levelID"));
        const difficulty = getDifficultyFromStars(stars);
        if (levelId) {
          store.updateLevel(levelId, (level) => ({ ...level, stars, difficulty: difficulty.diff, auto: difficulty.auto, demon: difficulty.demon, requestedStars: stars }));
        }
      }
      return sendText("1");
    },
    rateDemon(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      if (!authenticated || !hasDirectModAccess(authenticated.account.accountId)) return sendText("-1");
      const rating = parseNumber(context.body.get("rating"), 0);
      const levelId = parseNumber(context.body.get("levelID"));
      const demonMap: Record<number, number> = { 1: 3, 2: 4, 3: 0, 4: 5, 5: 6 };
      const demonDiff = demonMap[rating];
      if (!levelId || demonDiff === undefined) return sendText("-1");
      store.updateLevel(levelId, (level) => ({ ...level, demon: 1, auto: 0, demonDiff, difficulty: 50 }));
      return sendText(String(levelId));
    },
    suggestStars(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      if (!authenticated) return sendText("-2");
      const stars = parseNumber(context.body.get("stars"), 0);
      const feature = parseNumber(context.body.get("feature"), 0);
      const levelId = parseNumber(context.body.get("levelID"));
      if (!levelId) return sendText("-2");
      const difficulty = getDifficultyFromStars(stars);
      if (hasDirectModAccess(authenticated.account.accountId)) {
        store.updateLevel(levelId, (level) => ({
          ...level,
          stars,
          difficulty: difficulty.diff,
          auto: difficulty.auto,
          demon: difficulty.demon,
          requestedStars: stars,
          featured: Math.max(feature, 0),
          verifiedCoins: level.coins > 0 ? 1 : level.verifiedCoins
        }));
      } else {
        store.updateLevel(levelId, (level) => ({ ...level, requestedStars: stars }));
      }
      return sendText("1");
    },
    reportLevel(context: LegacyRequestContext): LegacyHandlerResult {
      const levelId = parseNumber(context.body.get("levelID"));
      if (!levelId) return sendText("-1");
      const ip = getRequestIp(context);
      const existing = store.findReportByLevelAndIp(levelId, ip);
      if (existing) return sendText("-1");
      const report = store.createLevelReport(levelId, ip);
      return sendText(String(report.reportId));
    },
    likeItem(context: LegacyRequestContext): LegacyHandlerResult {
      const type = parseNumber(context.body.get("type"), 1);
      const itemId = parseNumber(context.body.get("itemID")) || parseNumber(context.body.get("levelID"));
      const isLike = parseNumber(context.body.get("like"), 1);
      if (!itemId) return sendText("-1");
      const ip = getRequestIp(context);
      if (store.countItemLikesForIp(itemId, type, ip) > 2) return sendText("-1");
      const changed = store.applyItemLike(itemId, type, isLike);
      if (!changed) return sendText("-1");
      store.addItemLike(itemId, type, isLike, ip);
      return sendText("1");
    },
    getComments(context: LegacyRequestContext): LegacyHandlerResult {
      const levelId = parseNumber(context.body.get("levelID"));
      if (!levelId) return sendText("-2");
      const comments = store.listCommentsForLevel(levelId);
      if (comments.length === 0) return sendText("-2");
      const entries = comments.map((comment) => {
        const user = store.findUserByUserId(comment.userId);
        return user ? buildCommentEntry(comment, user) : null;
      }).filter((entry): entry is string => Boolean(entry));
      return sendText(`${entries.join("|")}#${comments.length}:0:${entries.length}`);
    },
    uploadComment(context: LegacyRequestContext): LegacyHandlerResult {
      const levelId = parseNumber(context.body.get("levelID"));
      const accountId = parseNumber(context.body.get("accountID"));
      const userName = parseString(context.body.get("userName"));
      const commentRaw = parseString(context.body.get("comment"));
      if (!levelId || !commentRaw) return sendText("-1");
      const account = accountId ? store.findAccountById(accountId) : store.findAccountByUserName(userName);
      const level = store.findLevelById(levelId);
      if (!account || !level) return sendText("-1");
      const user = store.findUserByExtId(account.accountId);
      if (!user) return sendText("-1");
      const comment = decodeBase64Url(commentRaw);
      store.createComment({ levelId, userId: user.userId, userName: user.userName, comment, percent: parseNumber(context.body.get("percent"), 0) });
      return sendText("1");
    },
    deleteComment(context: LegacyRequestContext): LegacyHandlerResult {
      const commentId = parseNumber(context.body.get("commentID"));
      const accountId = parseNumber(context.body.get("accountID"));
      if (!commentId || !accountId) return sendText("-1");
      const user = store.findUserByExtId(accountId);
      if (!user) return sendText("-1");
      return sendText(store.deleteComment(commentId, user.userId) ? "1" : "-1");
    },
    getMessages(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");
      const sent = hasFlag(context.body.get("getSent"));
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      const allMessages = store.listMessagesForAccount(actor.accountId, sent);
      if (allMessages.length === 0) return sendText("-2");
      const pageMessages = allMessages.slice(page * 10, (page + 1) * 10);
      const entries = pageMessages.map((message) => {
        const otherAccountId = sent ? message.toAccountId : message.accountId;
        const otherUser = store.findUserByExtId(otherAccountId);
        return otherUser ? buildMessageEntry(message, otherUser, sent ? 1 : 0) : null;
      }).filter((entry): entry is string => Boolean(entry));
      return sendText(`${entries.join("|")}#${allMessages.length}:${page * 10}:10`);
    },
    uploadMessage(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const toAccountId = parseNumber(context.body.get("toAccountID"));
      if (!actor || !toAccountId || actor.accountId === toAccountId) return sendText("-1");
      if (!store.findAccountById(toAccountId)) return sendText("-1");
      if (store.isBlocked(toAccountId, actor.accountId)) return sendText("-1");
      store.createMessage({ accountId: actor.accountId, toAccountId, subject: parseString(context.body.get("subject")), body: parseString(context.body.get("body")) });
      return sendText("1");
    },
    downloadMessage(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const messageId = parseNumber(context.body.get("messageID"));
      const isSender = hasFlag(context.body.get("isSender"));
      if (!actor || !messageId) return sendText("-1");
      const message = store.findMessageForAccount(messageId, actor.accountId);
      if (!message) return sendText("-1");
      if (!isSender) store.markMessageRead(messageId, actor.accountId);
      const otherAccountId = isSender ? message.toAccountId : message.accountId;
      const otherUser = store.findUserByExtId(otherAccountId);
      const refreshed = store.findMessageForAccount(messageId, actor.accountId) ?? message;
      if (!otherUser) return sendText("-1");
      return sendText(buildMessageDetail(refreshed, otherUser, isSender ? 1 : 0));
    },
    deleteMessage(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");
      const singleId = parseNumber(context.body.get("messageID"));
      const messageIds = context.body.has("messages") ? parseNumberList(context.body.get("messages")) : (singleId ? [singleId] : []);
      if (messageIds.length === 0) return sendText("-1");
      for (const messageId of messageIds) store.deleteMessage(messageId, actor.accountId);
      return sendText("1");
    },
    getFriendRequests(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");
      const sent = hasFlag(context.body.get("getSent"));
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      const requests = store.listFriendRequests(actor.accountId, sent);
      if (requests.length === 0) return sendText("-2");
      const pageRequests = requests.slice(page * 10, (page + 1) * 10);
      const entries = pageRequests.map((request) => {
        const otherAccountId = sent ? request.toAccountId : request.accountId;
        const otherUser = store.findUserByExtId(otherAccountId);
        return otherUser ? buildFriendRequestEntry(request, otherUser) : null;
      }).filter((entry): entry is string => Boolean(entry));
      return sendText(`${entries.join("|")}#${requests.length}:${page * 10}:10`);
    },
    uploadFriendRequest(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const targetAccountId = parseNumber(context.body.get("toAccountID"));
      if (!actor || !targetAccountId || targetAccountId === actor.accountId) return sendText("-1");
      if (!store.findAccountById(targetAccountId)) return sendText("-1");
      if (store.isBlocked(targetAccountId, actor.accountId)) return sendText("-1");
      if (store.friendshipExists(actor.accountId, targetAccountId)) return sendText("-1");
      const existing = store.listFriendRequests(actor.accountId, true).some((request) => request.toAccountId === targetAccountId) || store.listFriendRequests(actor.accountId, false).some((request) => request.accountId === targetAccountId);
      if (existing) return sendText("-1");
      store.createFriendRequest(actor.accountId, targetAccountId, parseString(context.body.get("comment")));
      return sendText("1");
    },
    acceptFriendRequest(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const requestId = parseNumber(context.body.get("requestID"));
      if (!actor || !requestId) return sendText("-1");
      const request = store.findFriendRequest(requestId);
      if (!request || request.toAccountId !== actor.accountId || request.accountId === actor.accountId) return sendText("-1");
      if (!store.friendshipExists(request.accountId, actor.accountId)) store.createFriendship(request.accountId, actor.accountId);
      store.deleteFriendRequest(requestId, actor.accountId);
      return sendText("1");
    },
    readFriendRequest(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const requestId = parseNumber(context.body.get("requestID"));
      if (!actor || !requestId) return sendText("-1");
      store.markFriendRequestRead(requestId, actor.accountId);
      return sendText("1");
    },
    deleteFriendRequest(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const targetAccountId = parseNumber(context.body.get("targetAccountID"));
      if (!actor || !targetAccountId) return sendText("-1");
      for (const request of [...store.listFriendRequests(actor.accountId, true), ...store.listFriendRequests(actor.accountId, false)]) {
        if ((request.accountId === actor.accountId && request.toAccountId === targetAccountId) || (request.toAccountId === actor.accountId && request.accountId === targetAccountId)) {
          store.deleteFriendRequest(request.requestId, actor.accountId);
        }
      }
      return sendText("1");
    },
    getUserList(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const type = parseNumber(context.body.get("type"), -1);
      if (!actor || (type !== 0 && type !== 1)) return sendText("-1");
      if (type === 0) {
        const friendships = store.listFriendships(actor.accountId);
        if (friendships.length === 0) return sendText("-2");
        const entries = friendships.map((friendship: StoredFriendship) => {
          const otherAccountId = friendship.person1 === actor.accountId ? friendship.person2 : friendship.person1;
          const otherUser = store.findUserByExtId(otherAccountId);
          const isNew = friendship.person1 === actor.accountId ? friendship.isNew2 : friendship.isNew1;
          return otherUser ? buildUserListEntry(otherUser, isNew) : null;
        }).filter((entry): entry is string => Boolean(entry));
        store.clearFriendshipNewFlags(actor.accountId);
        return entries.length ? sendText(entries.join("|")) : sendText("-2");
      }
      const blocks = store.listBlocksForAccount(actor.accountId);
      if (blocks.length === 0) return sendText("-2");
      const entries = blocks.map((block) => {
        const otherUser = store.findUserByExtId(block.person2);
        return otherUser ? buildUserListEntry(otherUser, 0) : null;
      }).filter((entry): entry is string => Boolean(entry));
      return entries.length ? sendText(entries.join("|")) : sendText("-2");
    },
    removeFriend(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const targetAccountId = parseNumber(context.body.get("targetAccountID"));
      if (!actor || !targetAccountId) return sendText("-1");
      store.removeFriendship(actor.accountId, targetAccountId);
      return sendText("1");
    },
    blockUser(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const targetAccountId = parseNumber(context.body.get("targetAccountID"));
      if (!actor || !targetAccountId || targetAccountId === actor.accountId) return sendText("-1");
      if (!store.isBlocked(actor.accountId, targetAccountId)) store.createBlock(actor.accountId, targetAccountId);
      return sendText("1");
    },
    unblockUser(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      const targetAccountId = parseNumber(context.body.get("targetAccountID"));
      if (!actor || !targetAccountId) return sendText("-1");
      store.removeBlock(actor.accountId, targetAccountId);
      return sendText("1");
    },
    getDailyLevel(context: LegacyRequestContext): LegacyHandlerResult {
      const type = parseNumber(context.body.get("type"), context.body.has("weekly") ? parseNumber(context.body.get("weekly"), 0) : 0) as 0 | 1 | 2;
      if (type !== 0 && type !== 1 && type !== 2) return sendText("-1");
      const current = Math.floor(Date.now() / 1000);
      const feature = store.getDailyFeature(type, current);
      if (!feature) return sendText("-1");
      const featureId = feature.featureId + (type * 100000);
      const timeLeft = Math.max(0, feature.duration - current);
      return sendText(`${featureId}|${type === 2 ? 10 : timeLeft}`);
    },
    getRewards(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");
      const rewardType = parseNumber(context.body.get("rewardType"), 0) as 0 | 1 | 2;
      const user = store.findUserByUserId(actor.user.userId);
      if (!user) return sendText("-1");
      const current = Math.floor(Date.now() / 1000) + 100;
      const chest1Wait = 3600;
      const chest2Wait = 14400;
      let chest1Left = Math.max(0, chest1Wait - (current - user.chest1Time));
      let chest2Left = Math.max(0, chest2Wait - (current - user.chest2Time));
      if (rewardType === 1) {
        if (chest1Left !== 0) return sendText("-1");
        store.updateChestState(user.userId, 1, current);
        chest1Left = chest1Wait;
      }
      if (rewardType === 2) {
        if (chest2Left !== 0) return sendText("-1");
        store.updateChestState(user.userId, 2, current);
        chest2Left = chest2Wait;
      }
      const refreshed = store.findUserByUserId(actor.user.userId) ?? user;
      const chk = decodeIncomingChk(parseString(context.body.get("chk")), 59182);
      const udid = parseString(context.body.get("udid"));
      const chest1Stuff = createRewardStuff([500, 1000], [5, 10], [1, 2]);
      const chest2Stuff = createRewardStuff([1500, 2500], [10, 20], [2, 4]);
      const payload = `1:${refreshed.userId}:${chk}:${udid}:${actor.accountId}:${chest1Left}:${chest1Stuff}:${refreshed.chest1Count}:${chest2Left}:${chest2Stuff}:${refreshed.chest2Count}:${rewardType}`;
      const encoded = urlSafeBase64Encode(xorCipher(payload, 59182));
      return sendText(`SaKuJ${encoded}|${levelHashSolo4(encoded)}`);
    },
    getChallenges(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");
      const templates = store.listQuestTemplates();
      if (templates.length < 3) return sendText("-1");
      const chk = decodeIncomingChk(parseString(context.body.get("chk")), 19847);
      const udid = parseString(context.body.get("udid"));
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const timeLeft = Math.max(0, Math.floor(midnight.getTime() / 1000) - Math.floor(Date.now() / 1000));
      const from = Math.floor(new Date("2000-12-17T00:00:00Z").getTime() / 1000);
      const days = Math.floor((Math.floor(Date.now() / 1000) - from) / 86400);
      const questBaseId = days * 3;
      const offset = (days + store.getQuestSeed(actor.user.userId)) % templates.length;
      const picked = [templates[offset % templates.length], templates[(offset + 1) % templates.length], templates[(offset + 2) % templates.length]];
      const quests = picked.map((quest, index) => `${questBaseId + index},${quest.type},${quest.amount},${quest.reward},${quest.name}`);
      const payload = `SaKuJ:${actor.user.userId}:${chk}:${udid}:${actor.accountId}:${timeLeft}:${quests.join(":")}`;
      const encoded = urlSafeBase64Encode(xorCipher(payload, 19847));
      return sendText(`SaKuJ${encoded}|${levelHashSolo3(encoded)}`);
    },
    getSecretReward(context: LegacyRequestContext): LegacyHandlerResult {
      const actor = findAccountAndUser(store, context);
      if (!actor) return sendText("-1");

      const rewardKey = parseString(context.body.get("rewardKey"));
      if (!rewardKey) return sendText("-1");

      const vaultCode = store.findVaultCodeByKey(rewardKey);
      const current = Math.floor(Date.now() / 1000);
      if (!vaultCode || vaultCode.uses === 0 || (vaultCode.duration !== 0 && vaultCode.duration <= current)) {
        return sendText("-1");
      }

      if (store.hasClaimedVaultCode(actor.accountId, vaultCode.rewardId)) {
        return sendText("-1");
      }

      if (vaultCode.uses > 0) {
        store.decrementVaultCodeUses(vaultCode.rewardId);
      }
      store.claimVaultCode(actor.accountId, vaultCode.rewardId);

      const chk = decodeIncomingChk(parseString(context.body.get("chk")), 59182);
      const payload = `Sa1nt:${chk}:${vaultCode.rewardId}:1:${vaultCode.rewards}`;
      const encoded = urlSafeBase64Encode(xorCipher(payload, 59182));
      return sendText(`Sa1nt${encoded}|${levelHashSolo4(encoded)}`);
    },
    getMapPacks(context: LegacyRequestContext): LegacyHandlerResult {
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      const result = store.getMapPacks(page);
      if (result.items.length === 0) return sendText("-1");
      const payload = result.items.map((pack) => `1:${pack.mapPackId}:2:${pack.name}:3:${pack.levelIds.join(",")}:4:${pack.stars}:5:${pack.coins}:6:${pack.difficulty}:7:${pack.rgbColors}:8:${pack.colors2 || pack.rgbColors}`).join("|");
      return sendText(`${payload}#${result.total}:${page * 10}:10#${buildPackHash(result.items)}`);
    },
    getGauntlets(): LegacyHandlerResult {
      const gauntlets = store.listGauntlets();
      if (gauntlets.length === 0) return sendText("-1");
      const payload = gauntlets.map((gauntlet) => `1:${gauntlet.gauntletId}:3:${gauntlet.levelIds.join(",")}`).join("|");
      return sendText(`${payload}#${buildGauntletHash(gauntlets)}`);
    },
    getLevelLists(context: LegacyRequestContext): LegacyHandlerResult {
      const page = Math.max(parseNumber(context.body.get("page"), 0), 0);
      const result = store.getLevelLists(page);
      if (result.items.length === 0) return sendText("-1");
      const levelSection = result.items.map((list) => `1:${list.listId}:2:${list.listName}:3:${list.listDesc}:5:${list.listVersion}:49:${list.accountId}:50:${list.userName}:10:${list.downloads}:7:${list.starDifficulty}:14:${list.likes}:19:${list.starFeatured}:51:${list.levelIds.join(",")}:55:${list.starStars}:56:${list.countForReward}:28:${list.uploadDate}:29:${list.updateDate}`).join("|");
      const userSection = result.items.map((list) => `${list.userId}:${list.userName}:${list.accountId}`).join("|");
      return sendText(`${levelSection}#${userSection}#${result.total}:${page * 10}:10#Sa1ntSosetHuiHelloFromGreenCatsServerLOL`);
    },
    uploadLevelList(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      if (!authenticated) return sendText("-9");
      if (parseString(context.body.get("secret")) !== "Wmfd2893gb7") return sendText("-100");

      const listId = parseNumber(context.body.get("listID"));
      const listName = parseString(context.body.get("listName")) || "Unnamed list";
      const listDesc = parseString(context.body.get("listDesc"));
      const levelIds = parseNumberList(context.body.get("listLevels"));
      if (levelIds.length === 0) return sendText("-6");

      const current = listId ? store.getSnapshot().levelLists.find((list) => list.listId === listId) : undefined;
      if (current && current.accountId !== authenticated.account.accountId) return sendText("-1");

      const list = store.createOrUpdateLevelList({
        listName,
        listDesc,
        listVersion: parseNumber(context.body.get("listVersion"), current?.listVersion ?? 1) || 1,
        accountId: authenticated.account.accountId,
        userId: authenticated.user.userId,
        userName: authenticated.user.userName,
        downloads: current?.downloads ?? 0,
        likes: current?.likes ?? 0,
        starDifficulty: parseNumber(context.body.get("difficulty"), current?.starDifficulty ?? 0),
        starFeatured: current?.starFeatured ?? 0,
        starStars: current?.starStars ?? 0,
        countForReward: current?.countForReward ?? levelIds.length,
        levelIds
      }, current?.listId);

      return sendText(String(list.listId));
    },
    deleteLevelList(context: LegacyRequestContext): LegacyHandlerResult {
      const authenticated = findAuthenticatedAccount(store, context);
      const listId = parseNumber(context.body.get("listID"));
      if (!authenticated || !listId) return sendText("-1");
      return sendText(store.deleteLevelList(listId, authenticated.account.accountId) ? "1" : "-1");
    },
    debugSnapshot(): LegacyHandlerResult { return sendJson(store.getSnapshot()); }
  };
}



























