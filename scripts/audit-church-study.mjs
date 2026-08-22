import fs from "node:fs";
import path from "node:path";
import { studyPaths } from "../client/src/lib/study-paths-data.ts";
import { deepStudies } from "../client/src/lib/deep-study-data.ts";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const churchPath = studyPaths.find((study) => study.id === "o-que-e-ser-igreja");
const churchStudy = deepStudies["o-que-e-ser-igreja"];
const requiredTags = ["Igreja", "corpo de Cristo", "diáconos", "pastores", "evangelistas", "missão", "dons"];
const requiredLayers = ["texto", "contexto", "significado", "debate", "pentecostal"];
const sources = churchStudy?.sources || [];
const structuredSources = sources.filter((source) => typeof source !== "string");
const httpsSources = structuredSources.filter((source) => {
  try {
    return new URL(source.url).protocol === "https:";
  } catch {
    return false;
  }
});
const app = read("client/src/App.tsx");
const home = read("client/src/pages/Home.tsx");
const command = read("client/src/components/ExperienceCommandLayer.tsx");
const reader = read("client/src/components/DeepStudyReader.tsx");
const rawMarkdownSources = sources.filter((source) => typeof source === "string" && /^\[[^\]]+\]\(https?:\/\//.test(source));
const checks = {
  idInStudyPathCatalog: Boolean(churchPath),
  idInDeepStudyCatalog: Boolean(churchStudy),
  studyPathNumber: churchPath?.number === "20",
  studyPathTags: requiredTags.every((tag) => churchPath?.tags.includes(tag)),
  studyPathSteps: churchPath?.steps.length === 14,
  deepStudyModules: churchStudy?.modules.length === 14,
  deepStudyLayers: Boolean(churchStudy) && churchStudy.modules.every((item) => requiredLayers.every((layer) => typeof item.layers[layer] === "string" && item.layers[layer].trim().length >= 160)),
  deepStudyParagraphs: Boolean(churchStudy) && churchStudy.modules.every((item) => requiredLayers.every((layer) => String(item.layers[layer]).split(/\n\s*\n/).filter(Boolean).length >= 2)),
  sourceCount: sources.length >= 20,
  structuredHttpsSources: httpsSources.length >= 20,
  structuredSourceLabels: structuredSources.every((source) => source.label.trim().length > 0 && source.url.trim().length > 0),
  noRawMarkdownSources: rawMarkdownSources.length === 0,
  directChurchRoute: app.includes('path={"/igreja"}') && app.includes('initialDeepStudyId="o-que-e-ser-igreja"'),
  ecclesiologyAlias: app.includes('path={"/eclesiologia"}') && home.includes('"/eclesiologia": "studies"'),
  launcherDestination: command.includes('href: "/igreja"') && command.includes("corpo de Cristo") && command.includes("diaconato") && command.includes("evangelistas"),
  readerExternalLinks: reader.includes("target=\"_blank\"") && reader.includes("ExternalLink"),
};
const report = {
  generatedAt: new Date().toISOString(),
  studyId: "o-que-e-ser-igreja",
  pathSteps: churchPath?.steps.length || 0,
  modules: churchStudy?.modules.length || 0,
  sources: sources.length,
  httpsSources: httpsSources.length,
  rawMarkdownSources: rawMarkdownSources.length,
  checks,
  status: Object.values(checks).every(Boolean) ? "APROVADA" : "REPROVADA",
};
fs.mkdirSync(path.join(root, "audit"), { recursive: true });
fs.writeFileSync(path.join(root, "audit/church-study-final.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.status !== "APROVADA") process.exitCode = 1;
