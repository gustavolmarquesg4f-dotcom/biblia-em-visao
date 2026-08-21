import { readFileSync, writeFileSync } from "node:fs";

const inputPath = process.argv[2] ?? "client/public/data/chapter-coverage.json";
const outputPath = process.argv[3] ?? "audit/editorial-quality-baseline.json";
const data = JSON.parse(readFileSync(inputPath, "utf8"));
const records = Array.isArray(data) ? data : (data.records ?? data.chapters ?? []);

const commentaryParts = (record) => [record.textLayer, record.contextLayer, record.interpretationLayer, record.pentecostalLayer].filter((part) => typeof part === "string" && part.trim());
const textOf = (record) => commentaryParts(record).join(" ").trim();
const basisOf = (record) => record.textBasis ?? null;
const sourcesOf = (record) => [record.source, record.textBasis, record.cartography?.source].filter(Boolean);
const versesOf = (record) => Number(record.verseCount ?? record.textBasis?.verseCount ?? String(record.textLayer ?? "").match(/(\d+) vers[íi]culos/i)?.[1] ?? 0) || 0;
const focalOf = (record) => record.editorialDepth === "Foco ampliado";

const normalize = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
const texts = records.map(textOf);
const normalizedTexts = texts.map(normalize);
const frequency = new Map();
for (const text of normalizedTexts) frequency.set(text, (frequency.get(text) ?? 0) + 1);
const repeatedTextGroups = [...frequency.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
const lengths = texts.map((text) => text.length);
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const min = (values) => values.length ? Math.min(...values) : 0;
const max = (values) => values.length ? Math.max(...values) : 0;
const withBasis = records.filter((record) => basisOf(record));
const withVerses = records.filter((record) => versesOf(record) > 0);
const withSources = records.filter((record) => sourcesOf(record).length > 0);
const shortRecords = records.filter((record, index) => !focalOf(record) && commentaryParts(record).join(" ").length < 160);
const emptyRecords = records.filter((record, index) => !focalOf(record) && texts[index].length === 0);
const syntheticMarkers = records.filter((record) => /sint[eé]tic|synthetic/i.test(JSON.stringify(record)) || record.editorialDepth === "Núcleo sintético");

const report = {
  generatedAt: new Date().toISOString(),
  inputPath,
  totalRecords: records.length,
  expandedFocusRecords: records.filter(focalOf).length,
  recordsWithTextBasis: withBasis.length,
  recordsWithVerseCount: withVerses.length,
  recordsWithSources: withSources.length,
  emptyRecords: emptyRecords.length,
  shortNonFocusRecords: shortRecords.length,
  syntheticMarkers: syntheticMarkers.length,
  commentary: {
    uniqueNormalizedTexts: new Set(normalizedTexts).size,
    uniqueTextLayers: new Set(records.map((record) => normalize(String(record.textLayer ?? "")))).size,
    repeatedTextGroups: repeatedTextGroups.length,
    largestRepeatedGroup: repeatedTextGroups[0]?.[1] ?? 0,
    averageCharacters: Math.round(average(lengths)),
    minCharacters: min(lengths),
    maxCharacters: max(lengths),
  },
  verseBasis: {
    averageVerseCount: Math.round(average(records.map(versesOf)) * 10) / 10,
    minVerseCount: min(records.map(versesOf)),
    maxVerseCount: max(records.map(versesOf)),
  },
  repeatedTextSamples: repeatedTextGroups.slice(0, 10).map(([text, count]) => ({ count, text: texts[normalizedTexts.indexOf(text)].slice(0, 220) })),
  shortRecordSamples: shortRecords.slice(0, 10).map((record) => ({ book: record.bookName ?? record.book, chapter: record.chapter, text: textOf(record) })),
};

writeFileSync(outputPath, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
