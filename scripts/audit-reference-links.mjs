import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dataPath = join(root, "client/public/data/advanced-book-dossiers.json");
const payload = JSON.parse(readFileSync(dataPath, "utf8"));
const records = Array.isArray(payload) ? payload : payload.results ? payload.results.map((item) => item?.output ?? item) : payload.books || payload.records || Object.values(payload);
const fields = ["primary_sources", "academic_bibliography"];
const issues = [];
let total = 0;
let valid = 0;
let normalized = 0;
const extractUrl = (source) => source.match(/https?:\/\/[^\s)\\\]]+/)?.[0]?.replace(/[.,;]+$/, "") || "";
for (const record of records) {
  for (const field of fields) {
    const value = typeof record?.[field] === "string" ? record[field] : "";
    for (const source of value.split(/;\s*/).filter(Boolean)) {
      total += 1;
      const url = extractUrl(source);
      try {
        const parsed = new URL(url);
        if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname && !/[\\\]\[]/.test(url)) valid += 1;
        else issues.push({ book: record.name || record.book || "unknown", field, source, url, reason: "invalid protocol, hostname or delimiter" });
      } catch {
        issues.push({ book: record.name || record.book || "unknown", field, source, url, reason: "URL parser rejected value" });
      }
      if (url !== source) normalized += 1;
    }
  }
}
const report = {
  generatedAt: new Date().toISOString(),
  records: records.length,
  total,
  valid,
  normalized,
  invalid: issues.length,
  issues,
  status: issues.length === 0 ? "APROVADA" : "REVISAR",
};
writeFileSync(join(root, "audit/reference-links-final.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
