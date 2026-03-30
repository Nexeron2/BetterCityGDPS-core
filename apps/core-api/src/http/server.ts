import { createServer } from "node:http";
import { URL } from "node:url";
import { sendJson, sendText } from "./response";
import type { CoreApiServerDependencies, LegacyRequestContext } from "./types";

async function readRequestBody(request: LegacyRequestContext["request"]): Promise<URLSearchParams> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return new URLSearchParams(rawBody);
}

export function createCoreApiServer(deps: CoreApiServerDependencies) {
  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    if (url.pathname === "/healthz") {
      const result = sendJson({
        status: "ok",
        service: deps.config.projectName,
        env: deps.config.appEnv,
        routes: deps.routeSummary.totalRoutes
      });

      response.writeHead(result.statusCode, {
        "content-type": result.contentType ?? "text/plain; charset=utf-8"
      });
      response.end(result.body);
      return;
    }

    if (url.pathname === "/__legacy-routes") {
      const result = sendJson(deps.routeSummary);
      response.writeHead(result.statusCode, {
        "content-type": result.contentType ?? "application/json; charset=utf-8"
      });
      response.end(result.body);
      return;
    }

    const body = request.method === "POST" ? await readRequestBody(request) : new URLSearchParams();
    const context: LegacyRequestContext = {
      request,
      response,
      pathname: url.pathname,
      query: url.searchParams,
      body
    };

    const result = await deps.dispatcher.dispatch(context);

    const baseLog = {
      method: request.method ?? "GET",
      path: url.pathname,
      statusCode: result?.statusCode ?? 404,
      bodyKeys: [...body.keys()]
    };

    if (deps.config.logLegacyRequests) {
      if (!result || url.pathname.startsWith("/getGJLevels") || url.pathname === "/getAccountURL.php") {
        console.log("[core-api] legacy request", {
          ...baseLog,
          bodyValues: Object.fromEntries(body.entries()),
          knownRoute: Boolean(result)
        });
      } else {
        console.log("[core-api] legacy request", baseLog);
      }
    }

    if (!result) {
      const notFound = sendText("-1", 404, {
        "x-bcgc-status": "unknown-endpoint"
      });

      response.writeHead(notFound.statusCode, {
        "content-type": notFound.contentType ?? "text/plain; charset=utf-8",
        ...notFound.headers
      });
      response.end(notFound.body);
      return;
    }

    response.writeHead(result.statusCode, {
      "content-type": result.contentType ?? "text/plain; charset=utf-8",
      ...result.headers
    });
    response.end(result.body);
  });
}


