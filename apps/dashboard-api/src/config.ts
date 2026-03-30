import { resolve } from "node:path";

export type DashboardApiConfig = {
  appEnv: string;
  host: string;
  port: number;
  projectName: string;
  dataFilePath: string;
  tokenSecret: string;
  tokenTtlSeconds: number;
  allowPlayerDashboard: boolean;
};

export function getDashboardApiConfig(): DashboardApiConfig {
  return {
    appEnv: process.env.NODE_ENV ?? "development",
    host: process.env.DASHBOARD_API_HOST ?? "0.0.0.0",
    port: Number(process.env.DASHBOARD_API_PORT ?? "3100"),
    projectName: process.env.DASHBOARD_PROJECT_NAME ?? "GDPS Dashboard API",
    dataFilePath: resolve(process.cwd(), process.env.BETTER_CITY_DATA_FILE ?? ".data/core-api.json"),
    tokenSecret: process.env.DASHBOARD_TOKEN_SECRET ?? "better-city-dashboard-dev-secret",
    tokenTtlSeconds: Number(process.env.DASHBOARD_TOKEN_TTL ?? String(60 * 60 * 12)),
    allowPlayerDashboard: process.env.DASHBOARD_ALLOW_PLAYERS === "1"
  };
}

