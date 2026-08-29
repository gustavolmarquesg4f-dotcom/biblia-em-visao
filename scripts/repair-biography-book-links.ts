import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";

import { bibleBooks } from "../client/src/lib/bible-data.ts";
import { extractCanonicalBookNames } from "../shared/knowledge-model.ts";

type BiographyRecord = {
  id: string;
  name: string;
  refs?: string[];
  books?: string[];
  rawBooks?: string[];
  bookLinkMethod?: string;
  bookLinksVerified?: boolean;
  [key: string]: unknown;
};

type BiographyPayload = {
  records: BiographyRecord[];
  [key: string]: unknown;
};

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const catalogPath = path.join(
  projectRoot,
  "client",
  "public",
  "data",
  "biography-catalog.json"
);
const linksPath = path.join(
  projectRoot,
  "client",
  "public",
  "data",
  "biography-book-links.json"
);
const auditPath = path.join(projectRoot, "audit", "biography-link-repair.json");

const payload = JSON.parse(
  await fs.readFile(catalogPath, "utf8")
) as BiographyPayload;
const beforeCounts = Object.fromEntries(
  bibleBooks.map(book => [
    book.name,
    payload.records.filter(record =>
      (record.rawBooks ?? record.books)?.includes(book.name)
    ).length,
  ])
);

let correctedLegacyRecords = 0;
const records = payload.records.map(record => {
  const rawBooks = record.rawBooks ?? record.books ?? [];
  const books = extractCanonicalBookNames(record.refs ?? [], bibleBooks);
  if (JSON.stringify(rawBooks) !== JSON.stringify(books)) {
    correctedLegacyRecords += 1;
  }
  return {
    id: record.id,
    name: record.name,
    refs: record.refs ?? [],
    books,
    rawBooks,
    bookLinkMethod: "explicit-reference-prefix-v1",
    bookLinksVerified: books.length > 0,
  };
});

const afterCounts = Object.fromEntries(
  bibleBooks.map(book => [
    book.name,
    records.filter(record => record.books.includes(book.name)).length,
  ])
);
const recordsWithoutVerifiedBooks = records
  .filter(record => !record.books.length)
  .map(record => ({
    id: record.id,
    name: record.name,
    refs: record.refs ?? [],
  }));
const audit = {
  schemaVersion: 1,
  method:
    "Associação apenas quando o nome completo ou abreviação canônica inicia um segmento de referência e é seguido por número de capítulo.",
  totalRecords: records.length,
  correctedLegacyRecords,
  recordsWithVerifiedBooks: records.length - recordsWithoutVerifiedBooks.length,
  recordsWithoutVerifiedBooks,
  beforeCounts,
  afterCounts,
  collisionCorrections: {
    Oseias: { before: beforeCounts.Oseias, after: afterCounts.Oseias },
    Naum: { before: beforeCounts.Naum, after: afterCounts.Naum },
  },
  preservation: {
    biographiesRemoved: 0,
    originalLinksPreservedInRawBooks: true,
  },
};

await fs.writeFile(
  linksPath,
  await format(
    JSON.stringify({
      schemaVersion: 1,
      method: "explicit-reference-prefix-v1",
      count: records.length,
      records,
    }),
    { parser: "json" }
  ),
  "utf8"
);
await fs.writeFile(
  auditPath,
  await format(JSON.stringify(audit), { parser: "json" }),
  "utf8"
);

console.log(
  `Relações biográficas: ${correctedLegacyRecords} registros legados corrigidos em uma sobreposição auditável; ${recordsWithoutVerifiedBooks.length} permanecem sem referência canônica explícita.`
);
