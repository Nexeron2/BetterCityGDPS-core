import { gzipSync } from "node:zlib";
import { sha1 } from "./crypto";
import type { StoredLevel, StoredUser } from "../storage/types";

export function urlSafeBase64Encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
}

export function urlSafeBase64Decode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

export function xorCipher(value: string, key: number): string {
  const keyBytes = String(key).split("").map((char) => char.charCodeAt(0));
  const input = Array.from(value).map((char) => char.charCodeAt(0));
  return input.map((byte, index) => String.fromCharCode(byte ^ keyBytes[index % keyBytes.length])).join("");
}

export function levelHashList(levels: Array<Pick<StoredLevel, "levelId" | "stars" | "verifiedCoins">>): string {
  const seed = levels
    .map((level) => {
      const id = String(level.levelId);
      return `${id[0]}${id[id.length - 1]}${level.stars}${level.verifiedCoins}`;
    })
    .join("");

  return sha1(`${seed}xI25fpAapCQg`);
}

export function levelHashSolo(levelString: string): string {
  if (levelString.length < 41) {
    return sha1(`${levelString}xI25fpAapCQg`);
  }

  const interval = Math.floor(levelString.length / 40);
  let hashSeed = "????????????????????????????????????????";
  const chars = hashSeed.split("");

  for (let index = 39; index >= 0; index -= 1) {
    chars[index] = levelString[index * interval] ?? "?";
  }

  hashSeed = chars.join("");
  return sha1(`${hashSeed}xI25fpAapCQg`);
}

export function levelHashSolo2(payload: string): string {
  return sha1(`${payload}xI25fpAapCQg`);
}

export function levelHashSolo3(payload: string): string {
  return sha1(`${payload}oC36fpYaPtdg`);
}

export function levelHashSolo4(payload: string): string {
  return sha1(`${payload}pC26fpYaQCtg`);
}

export function encodeLevelStringForDownload(levelString: string, gameVersion: number): string {
  if (gameVersion <= 18) return levelString;
  if (!levelString.startsWith("kS1")) return levelString;
  return gzipSync(levelString).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
}

export function formatUserString(user: StoredUser): string {
  return `${user.userId}:${user.userName}:${user.extId}`;
}
