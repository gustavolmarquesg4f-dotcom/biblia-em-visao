import { staticAsset } from "./static-asset";

export type AdvancedBookDossier = {
  book_name: string;
  dossier_markdown: string;
  primary_sources: string;
  academic_bibliography: string;
  confidence_limits: string;
};

export const ADVANCED_BOOK_DOSSIERS_URL = staticAsset("data/advanced-book-dossiers.json");

export type AdvancedBookPayload = {
  results?: Array<{ input?: string; output?: AdvancedBookDossier; error?: string }>;
};

export function canonicalBookName(value: string) {
  return value.split(" — ")[0].trim();
}

export function canonicalBookKey(value: string) {
  return canonicalBookName(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function normalizeAdvancedBookPayload(payload: AdvancedBookPayload) {
  return (payload.results || []).reduce<Record<string, AdvancedBookDossier>>((acc, item) => {
    if (item.output?.book_name && item.output.dossier_markdown) acc[canonicalBookKey(item.input || item.output.book_name)] = { ...item.output, book_name: canonicalBookName(item.output.book_name) };
    return acc;
  }, {});
}
