import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderDashboardPage, renderLoginPage } from "./dashboard/render";

function generateDashboardSite(): void {
  const outputDir = resolve(__dirname);
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(resolve(outputDir, "index.html"), renderDashboardPage(), "utf8");
  writeFileSync(resolve(outputDir, "login.html"), renderLoginPage(), "utf8");
}

generateDashboardSite();
console.log("[dashboard-web] generated", {
  files: ["index.html", "login.html"],
  outDir: __dirname
});
