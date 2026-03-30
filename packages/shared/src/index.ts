export const supportedLocales = ["ru", "en", "es"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const appManifest = {
  coreApi: {
    id: "core-api",
    name: "GDPS Core API"
  },
  dashboard: {
    id: "dashboard-web",
    name: "GDPS Dashboard"
  },
  installer: {
    id: "installer",
    name: "GDPS Installer"
  }
} as const;
