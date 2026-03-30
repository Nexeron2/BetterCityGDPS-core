import type { CoreDomainModuleId } from "../domain/modules";

export type LegacyEndpointMethod = "GET" | "POST";

export type LegacyRoute = {
  path: string;
  module: CoreDomainModuleId;
  operation: string;
  method: LegacyEndpointMethod;
  description: string;
};