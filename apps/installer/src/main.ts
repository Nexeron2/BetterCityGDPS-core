import { appManifest } from "@better-city/shared";
import { installerLocales, installerSteps } from "@better-city/i18n";

const installerPlan = {
  runtime: ["mysql", "postgresql", "sqlite"],
  webServers: ["nginx", "apache2", "manual"],
  defaultLocaleChoices: ["ru", "en", "es"],
  dashboardThemeDefaults: ["megasa1nt", "minimalistic", "windows", "cli", "neon-core", "city-night", "robotic-steel", "lava-forge", "emerald-control", "solar-light", "geometry-pulse"],
  installerFlow: [
    "choose-language",
    "choose-mode",
    "configure-database",
    "set-project-identity",
    "set-dashboard-default-theme",
    "set-superadmin",
    "set-privileged-password",
    "choose-web-server",
    "finalize-install"
  ],
  docs: [
    "docs/install/manual.md",
    "docs/install/installer-flow.md"
  ]
};

console.log("[installer] bootstrap", {
  app: appManifest.installer,
  locales: installerLocales.map((locale) => locale.code),
  steps: installerSteps,
  plan: installerPlan
});
