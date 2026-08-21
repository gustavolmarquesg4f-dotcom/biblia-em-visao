import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const app = read("client/src/App.tsx");
const home = read("client/src/pages/Home.tsx");
const command = read("client/src/components/ExperienceCommandLayer.tsx");
const reader = read("client/src/components/ChapterCoverageReader.tsx");
const requiredRoutes = ["/", "/comece", "/66-livros", "/livro/:bookId", "/roteiro", "/linha-do-tempo", "/atlas", "/historia", "/pessoas", "/temas", "/busca", "/mesa", "/canon", "/apocrifos", "/glossario", "/apocalipse", "/bibliografia"];
const checks = {
  requiredRoutes: requiredRoutes.filter((route) => app.includes(`\"${route}\"`)),
  deepBookEntry: app.includes("function BookDetailEntry") && app.includes("initialBookId={bookId}"),
  deepBookNavigation: home.includes("bookSlug =") && home.includes("setLocation(`/livro/${encodeURIComponent(bookSlug(book))}`)"),
  libraryReturn: home.includes("setLocation(viewPaths.library)"),
  directChapterHistory: reader.includes("new URLSearchParams(window.location.search).get(\"cap\")") && reader.includes("window.history") && reader.includes("popstate"),
  mobilePrimaryDestinations: ["id: \"overview\"", "id: \"library\"", "id: \"study\"", "id: \"atlas\"", "id: \"search\""].every((token) => home.includes(token)),
  commandDeepContext: command.includes('location.startsWith("/livro/")'),
  onboardingDoesNotBlockDeepRoutes: read("client/src/components/OnboardingNavigator.tsx").includes('(location === "/" || location === "/comece")'),
};
const report = { generatedAt: new Date().toISOString(), requiredRouteCount: requiredRoutes.length, matchedRouteCount: checks.requiredRoutes.length, ...checks, status: checks.requiredRoutes.length === requiredRoutes.length && Object.entries(checks).filter(([key]) => key !== "requiredRoutes").every(([, value]) => value === true) ? "APROVADA" : "REPROVADA" };
fs.mkdirSync(path.join(root, "audit"), { recursive: true });
fs.writeFileSync(path.join(root, "audit/navigation-final.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.status !== "APROVADA") process.exitCode = 1;
