import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const bibleSource = read("client/src/lib/bible-data.ts");
const commentarySource = read("client/src/lib/verse-commentary-data.ts");
const atlasSource = read("client/src/lib/atlas-region-data.ts");
const routeSource = read("client/src/lib/route-data.ts");
const placesSource = read("client/src/lib/advanced-data.ts");
const coverage = JSON.parse(read("client/public/data/chapter-coverage.json"));

const books = [...bibleSource.matchAll(/\[\"([^\"]+)\",\"([^\"]+)\",\"([^\"]+)\",(\d+),/g)].map((match, index) => ({
  index: index + 1,
  name: match[1],
  short: match[2],
  category: match[3],
  chapters: Number(match[4]),
}));
const expectedChapters = books.reduce((total, book) => total + book.chapters, 0);
const focalCommentaries = [...commentarySource.matchAll(/\{ id: \"([^\"]+)\", book: \"([^\"]+)\", chapter: (\d+),/g)].map((match) => ({ id: match[1], book: match[2], chapter: Number(match[3]) }));
const focalKeys = new Set(focalCommentaries.map((item) => `${item.book}:${item.chapter}`));
const records = Array.isArray(coverage.records) ? coverage.records : [];
const coverageKeys = records.map((item) => `${item.book}:${item.chapter}`);
const duplicateCoverageKeys = coverageKeys.filter((key, index) => coverageKeys.indexOf(key) !== index);
const coverageKeySet = new Set(coverageKeys);
const missingCoverage = [];
for (const book of books) {
  for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
    if (!coverageKeySet.has(`${book.name}:${chapter}`)) missingCoverage.push({ book: book.name, chapter });
  }
}
const validPlaceIds = new Set([...placesSource.matchAll(/^\s+\{ id: \"([^\"]+)\", name:/gm)].map((match) => match[1]));
const validRouteIds = new Set([...routeSource.matchAll(/\{ id: \"([^\"]+)\", label:/g)].map((match) => match[1]));
const validEmpireIds = new Set([...routeSource.matchAll(/\{ id: \"([^\"]+)\", label:/g)].map((match) => match[1]));
const invalidRecords = records.filter((record) => {
  const fieldsPresent = [record.id, record.book, record.bookId, record.reference, record.title, record.textLayer, record.contextLayer, record.interpretationLayer, record.pentecostalLayer, record.source?.url, record.cartography?.placeId, record.cartography?.placeLabel, record.cartography?.region, record.cartography?.period, record.cartography?.note, record.cartography?.source?.url, record.verification?.chapterExistsInCanon, record.verification?.commentarySchemaComplete, record.verification?.cartographicContextPresent].every(Boolean);
  const routesValid = (record.cartography?.routeIds || []).every((id) => validRouteIds.has(id));
  const empiresValid = (record.cartography?.empireIds || []).every((id) => validEmpireIds.has(id));
  return !fieldsPresent || !validPlaceIds.has(record.cartography?.placeId) || !routesValid || !empiresValid;
});
const canonicalBookNames = new Set(books.map((book) => book.name));
const recordsWithUnknownBooks = records.filter((record) => !canonicalBookNames.has(record.book));
const report = {
  generatedAt: new Date().toISOString(),
  expectedBooks: books.length,
  expectedChapters,
  publishedBookCount: coverage.bookCount,
  publishedTotal: coverage.total,
  publishedRecords: records.length,
  uniquePublishedChapterKeys: coverageKeySet.size,
  duplicatePublishedChapterKeys: duplicateCoverageKeys.length,
  missingCoverage: missingCoverage.length,
  invalidRecords: invalidRecords.length,
  recordsWithUnknownBooks: recordsWithUnknownBooks.length,
  recordsWithCartography: records.filter((record) => record.cartography?.placeId && record.cartography?.note).length,
  focalRecordsPreserved: records.filter((record) => record.editorialDepth === "Foco ampliado" && focalKeys.has(`${record.book}:${record.chapter}`)).length,
  focalRecordsExpected: focalCommentaries.length,
  enrichedTextRecords: records.filter((record) => record.editorialDepth === "Comentário textual enriquecido").length,
  syntheticRecords: records.filter((record) => record.editorialDepth === "Núcleo sintético").length,
  recordsWithTextBasis: records.filter((record) => record.textBasis?.url && record.textBasis?.licenseUrl).length,
  atlasMarkers: [...atlasSource.matchAll(/\{ id: \"([^\"]+)\", label: \"([^\"]+)\"/g)].length,
  routeLayers: validRouteIds.size,
  coverageStatus: coverage.bookCount === books.length && coverage.total === expectedChapters && records.length === expectedChapters && coverageKeySet.size === expectedChapters && missingCoverage.length === 0 && duplicateCoverageKeys.length === 0 && invalidRecords.length === 0 && recordsWithUnknownBooks.length === 0 && records.filter((record) => record.editorialDepth === "Núcleo sintético").length === 0 ? "APROVADA" : "REPROVADA",
  missingSample: missingCoverage.slice(0, 20),
  invalidSample: invalidRecords.slice(0, 5).map((record) => `${record.book} ${record.chapter}`),
};
fs.mkdirSync(path.join(root, "audit"), { recursive: true });
fs.writeFileSync(path.join(root, "audit", "chapter-coverage-final.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.coverageStatus !== "APROVADA") process.exitCode = 1;
