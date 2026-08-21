import { readFileSync, writeFileSync } from "node:fs";

const payload = JSON.parse(readFileSync("client/public/data/advanced-book-dossiers.json", "utf8"));
const results = payload.results || [];
const records = results.map((item) => item.output ?? item);
const links = [];
for (const record of records) {
  for (const field of ["primary_sources", "academic_bibliography"]) {
    for (const source of String(record[field] || "").split(/;\s*/).filter(Boolean)) {
      try {
        const url = new URL(source);
        links.push({ book: record.name || record.book || "unknown", field, source, url: url.toString() });
      } catch {
        links.push({ book: record.name || record.book || "unknown", field, source, url: "", status: "invalid-url" });
      }
    }
  }
}
const resultsByUrl = new Map();
const queue = [...links];
const worker = async () => {
  while (queue.length) {
    const item = queue.shift();
    if (!item || resultsByUrl.has(item.url || item.source)) continue;
    const key = item.url || item.source;
    if (!item.url) { resultsByUrl.set(key, { ...item }); continue; }
    let status = 0;
    let finalUrl = item.url;
    let error = "";
    try {
      const response = await fetch(item.url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(10000), headers: { "user-agent": "biblia-em-visao-reference-audit/1.0" } });
      status = response.status;
      finalUrl = response.url;
      if (status === 405 || status === 403) {
        const fallback = await fetch(item.url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(10000), headers: { "user-agent": "biblia-em-visao-reference-audit/1.0", range: "bytes=0-1024" } });
        status = fallback.status;
        finalUrl = fallback.url;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
    const reachable = status >= 200 && status < 400;
    resultsByUrl.set(key, { ...item, status, finalUrl, reachable, error });
  }
};
await Promise.all(Array.from({ length: 8 }, worker));
const checked = links.map((item) => resultsByUrl.get(item.url || item.source) || item);
const report = {
  generatedAt: new Date().toISOString(),
  totalLinks: checked.length,
  uniqueUrls: resultsByUrl.size,
  reachable: checked.filter((item) => item.reachable).length,
  unavailable: checked.filter((item) => item.status && !item.reachable).length,
  errors: checked.filter((item) => item.error || item.status === "invalid-url").length,
  results: checked,
};
writeFileSync("audit/reference-http-final.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ totalLinks: report.totalLinks, uniqueUrls: report.uniqueUrls, reachable: report.reachable, unavailable: report.unavailable, errors: report.errors }, null, 2));
