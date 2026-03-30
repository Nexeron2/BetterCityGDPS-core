export type CoreApiConfig = {
  host: string;
  port: number;
  appEnv: string;
  logLegacyRequests: boolean;
  projectName: string;
  dataFilePath: string;
};

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function loadCoreApiConfig(env: NodeJS.ProcessEnv = process.env): CoreApiConfig {
  return {
    host: env.CORE_API_HOST ?? "0.0.0.0",
    port: readNumber(env.CORE_API_PORT, 3000),
    appEnv: env.NODE_ENV ?? "development",
    logLegacyRequests: readBoolean(env.CORE_API_LOG_LEGACY_REQUESTS, true),
    projectName: env.CORE_API_PROJECT_NAME ?? "Better City GDPS Core",
    dataFilePath: env.CORE_API_DATA_FILE ?? ".data/core-api.json"
  };
}