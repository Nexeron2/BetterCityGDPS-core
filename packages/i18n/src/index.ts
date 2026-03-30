import type { SupportedLocale } from "@better-city/shared";

type LocaleOption = {
  code: SupportedLocale;
  label: string;
};

export const installerLocales: LocaleOption[] = [
  { code: "ru", label: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" }
];

export const dashboardLocales = installerLocales;

export const installerSteps = [
  "language",
  "mode",
  "database",
  "instance",
  "superadmin",
  "privileged-access",
  "theme",
  "modules",
  "migration",
  "finish"
] as const;
