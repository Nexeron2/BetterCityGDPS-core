import type { IncomingMessage, ServerResponse } from "node:http";
import type { CoreApiConfig } from "../config";
import type { LegacyRouteSummary } from "../legacy/summary";

export type LegacyRequestContext = {
  request: IncomingMessage;
  response: ServerResponse;
  pathname: string;
  query: URLSearchParams;
  body: URLSearchParams;
};

export type LegacyHandlerResult = {
  statusCode: number;
  contentType?: string;
  body: string;
  headers?: Record<string, string>;
};

export type MaybePromise<T> = T | Promise<T>;

export type LegacyDispatcher = {
  dispatch: (context: LegacyRequestContext) => MaybePromise<LegacyHandlerResult | null>;
};

export type CoreApiServerDependencies = {
  config: CoreApiConfig;
  dispatcher: LegacyDispatcher;
  routeSummary: LegacyRouteSummary;
};
