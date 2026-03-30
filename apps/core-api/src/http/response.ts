import type { LegacyHandlerResult } from "./types";

export function sendText(body: string, statusCode = 200, headers: Record<string, string> = {}): LegacyHandlerResult {
  return {
    statusCode,
    contentType: "text/plain; charset=utf-8",
    body,
    headers
  };
}

export function sendJson(payload: unknown, statusCode = 200, headers: Record<string, string> = {}): LegacyHandlerResult {
  return {
    statusCode,
    contentType: "application/json; charset=utf-8",
    body: JSON.stringify(payload, null, 2),
    headers
  };
}