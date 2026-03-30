export type JsonResult = {
  body: string;
  statusCode: number;
  headers?: Record<string, string>;
};

export function sendJson(payload: unknown, statusCode = 200, headers: Record<string, string> = {}): JsonResult {
  return {
    body: JSON.stringify(payload, null, 2),
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers
    }
  };
}
