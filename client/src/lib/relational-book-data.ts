import { staticAsset } from "./static-asset";

export const RELATIONAL_BOOKS_URL = staticAsset("data/relational-books-catalog.json");

export type RelationalRow = Record<string, string>;
export type RelationalSource = { label: string; url: string | null; verified: boolean };
export type RelationalBookData = {
  bookName: string;
  chapterCount: number;
  identity: string;
  chapterArcs: { range: string; title: string; summary: string; question: string }[];
  entities: RelationalRow[];
  events: RelationalRow[];
  places: RelationalRow[];
  themes: RelationalRow[];
  prophecies: RelationalRow[];
  continuity: RelationalRow[];
  pentecostal: string;
  idbStatus: string;
  academicDebates: string[];
  primarySources: RelationalSource[];
  academicSources: RelationalSource[];
  qualityNote: string;
};

export type RelationalBooksPayload = { books?: RelationalBookData[] };

export function canonicalRelationalBookKey(value: string) {
  return value.split(" — ")[0].trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function normalizeRelationalBooksPayload(payload: RelationalBooksPayload) {
  return (payload.books || []).reduce<Record<string, RelationalBookData>>((acc, book) => {
    if (book.bookName) acc[canonicalRelationalBookKey(book.bookName)] = book;
    return acc;
  }, {});
}
