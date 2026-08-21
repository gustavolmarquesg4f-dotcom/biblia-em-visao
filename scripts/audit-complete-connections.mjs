import fs from "node:fs";

const booksSource = fs.readFileSync(new URL("../client/src/lib/bible-data.ts", import.meta.url), "utf8");
const entriesSource = fs.readFileSync(new URL("../client/src/lib/complete-book-data.ts", import.meta.url), "utf8");
const books = new Set([...booksSource.matchAll(/\["([^"]+)"\s*,\s*"[^"]+"\s*,/g)].map(match => match[1]));
const connections = [...entriesSource.matchAll(/book:\s*"([^"]+)"/g)].map(match => match[1]);
const missing = [...new Set(connections.filter(book => !books.has(book)))];
const resolved = connections.filter(book => books.has(book));
const entryNames = [...entriesSource.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map(match => match[1]);
const report = { generatedAt: new Date().toISOString(), entries: entryNames.length, entryNames, connectionCount: connections.length, resolvedCount: resolved.length, missingCount: missing.length, missingBooks: missing };
fs.writeFileSync("audit/complete-connections-final.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
if (missing.length) process.exitCode = 1;
