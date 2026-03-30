import { appManifest } from "@better-city/shared";
import { coreDomainModules } from "./domain/modules";
import { loadCoreApiConfig } from "./config";
import { createCoreApiServer } from "./http/server";
import { createLegacyDispatcher } from "./legacy/dispatcher";
import { buildLegacyRouteSummary } from "./legacy/summary";
import { legacyRoutes } from "./legacy/routes";

const config = loadCoreApiConfig();
const routeSummary = buildLegacyRouteSummary();
const dispatcher = createLegacyDispatcher(config);
const server = createCoreApiServer({ config, dispatcher, routeSummary });

server.listen(config.port, config.host, () => {
  const startupSummary = {
    app: appManifest.coreApi,
    host: config.host,
    port: config.port,
    routes: legacyRoutes.length,
    compatibilityMode: "legacy-php-endpoints",
    modules: coreDomainModules.length,
    dataFilePath: config.dataFilePath,
    moduleRouteCounts: routeSummary.modules
  };

  console.log("[core-api] listening", startupSummary);
});