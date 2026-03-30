import { createHmac, timingSafeEqual } from "node:crypto";

type DashboardTokenPayload = {
  accountId: number;
  roleIds: string[];
  issuedAt: number;
  expiresAt: number;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function issueDashboardToken(payload: DashboardTokenPayload, secret: string): string {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export function verifyDashboardToken(token: string, secret: string): DashboardTokenPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded, secret);
  const left = Buffer.from(signature, "utf8");
  const right = Buffer.from(expected, "utf8");
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as DashboardTokenPayload;
    if (payload.expiresAt < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
