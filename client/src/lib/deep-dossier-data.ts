import { staticAsset } from "./static-asset";

export const DEEP_DOSSIER_CATALOG_URL = staticAsset("data/deep-dossier-catalog.json");

export type DeepDossierRecord = {
  bookName: string;
  confidence: number | null;
  bytes: number;
  sectionCount: number;
  longParagraphCount: number;
  headings: string[];
  markdown: string;
};

export function canonicalDeepBookKey(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/^(1|2|3)\s+/, "$1-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function normalizeDeepDossierPayload(payload: unknown): Record<string, DeepDossierRecord> {
  const books = Array.isArray((payload as { books?: unknown[] })?.books) ? (payload as { books: DeepDossierRecord[] }).books : [];
  return Object.fromEntries(books.map((book) => [canonicalDeepBookKey(book.bookName), book]));
}
