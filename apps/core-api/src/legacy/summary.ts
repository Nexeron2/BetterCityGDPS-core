import { coreDomainModules } from "../domain/modules";
import { legacyRoutes } from "./routes";

export type LegacyRouteSummary = {
  totalRoutes: number;
  modules: Array<{
    id: string;
    label: string;
    routes: number;
  }>;
};

export function buildLegacyRouteSummary(): LegacyRouteSummary {
  return {
    totalRoutes: legacyRoutes.length,
    modules: coreDomainModules.map((module) => ({
      id: module.id,
      label: module.label,
      routes: legacyRoutes.filter((route) => route.module === module.id).length
    }))
  };
}