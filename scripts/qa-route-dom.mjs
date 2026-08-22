import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3002";
const routes = [
  ["/", "A Bíblia"], ["/comece", "Comece"], ["/66-livros", "66 livros"], ["/livro/1-genesis?cap=2", "Gênesis 2"], ["/livro/1-g-nesis?cap=2", "Gênesis 2"], ["/roteiro", "Roteiro dos 66 livros"], ["/linha-do-tempo", "Linha do tempo"], ["/atlas", "Atlas"], ["/historia", "História bíblica"], ["/pessoas", "Pessoas e povos"], ["/temas", "Temas bíblicos"], ["/busca", "Busca"], ["/mesa", "Mesa de estudo"], ["/canon", "Cânones"], ["/apocrifos", "Apócrifos"], ["/glossario", "Glossário"], ["/apocalipse", "Apocalipse"], ["/bibliografia", "Fontes e bibliografia"],
];
const results = [];
for (const [route, marker] of routes) {
  const url = `${base}${route}`;
  let dom = "";
  let error = "";
  try {
    dom = execFileSync("chromium", ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars", "--virtual-time-budget=2500", "--dump-dom", url], { encoding: "utf8", timeout: 15000, maxBuffer: 2_000_000, stdio: ["ignore", "pipe", "pipe"] });
  } catch (reason) {
    error = reason instanceof Error ? reason.message.slice(0, 240) : String(reason);
  }
  const rendered = dom.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  const visibleText = rendered.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
  const ids = new Set([...rendered.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const anchorRefs = [...rendered.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  const missingAnchors = [...new Set(anchorRefs)].filter((id) => !ids.has(id));
  const rawMarkdown = (visibleText.match(/\*\*|\\\[\d+\\\]/g) || []).length;
  results.push({ route, marker, hasRoot: rendered.includes('id="root"'), hasMarker: visibleText.includes(marker), hasErrorBoundary: visibleText.includes("Algo deu errado"), anchorCount: anchorRefs.length, missingAnchors, rawMarkdown, error: error || null });
}
const report = { generatedAt: new Date().toISOString(), base, routeCount: routes.length, passed: results.filter((item) => item.hasRoot && item.hasMarker && !item.hasErrorBoundary && item.missingAnchors.length === 0 && item.rawMarkdown === 0).length, results, status: results.every((item) => item.hasRoot && item.hasMarker && !item.hasErrorBoundary && item.missingAnchors.length === 0 && item.rawMarkdown === 0) ? "APROVADA" : "REPROVADA" };
fs.writeFileSync(path.join(root, "audit/route-smoke-final.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.status !== "APROVADA") process.exitCode = 1;
