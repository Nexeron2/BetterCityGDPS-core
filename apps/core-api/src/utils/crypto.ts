import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function gjp2FromPassword(password: string): string {
  return createHash("sha1").update(`${password}mI29fmAnxgTs`).digest("hex");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [salt, storedHash] = encoded.split(":");
  if (!salt || !storedHash) return false;

  const candidate = scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, "hex");
  return stored.length === candidate.length && timingSafeEqual(stored, candidate);
}

export function sha1(value: string): string {
  return createHash("sha1").update(value).digest("hex");
}