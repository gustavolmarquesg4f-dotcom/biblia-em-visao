import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const base = "http://127.0.0.1:3002";
const routes = [
  ["/", "A Bíblia"], ["/comece", "Comece"], ["/66-livros", "66 livros"], ["/livro/1-g-nesis?cap=2", "Gênesis 2"], ["/roteiro", "Roteiro dos 66 livros"], ["/linha-do-tempo", "Linha do tempo"], ["/atlas", "Atlas"], ["/historia", "História bíblica"], ["/pessoas", "Pessoas e povos"], ["/temas", "Temas bíblicos"], ["/busca", "Busca"], ["/mesa", "Mesa de estudo"], ["/canon", "Cânones"], ["/apocrifos", "Apócrifos"], ["/glossario", "Glossário"], ["/apocalipse", "Apocalipse"], ["/bibliografia", "Fontes e bibliografia"],
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
  results.push({ route, marker, hasRoot: dom.includes('id="root"'), hasMarker: dom.includes(marker), hasErrorBoundary: dom.includes("Algo deu errado"), error: error || null });
}
const report = { generatedAt: new Date().toISOString(), base, routeCount: routes.length, passed: results.filter((item) => item.hasRoot && item.hasMarker && !item.hasErrorBoundary).length, results, status: results.every((item) => item.hasRoot && item.hasMarker && !item.hasErrorBoundary) ? "APROVADA" : "REPROVADA" };
fs.writeFileSync(path.join(root, "audit/route-smoke-final.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.status !== "APROVADA") process.exitCode = 1;
