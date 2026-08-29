import type { KnowledgeEntity, KnowledgeRelation } from "@/lib/entity-graph";
import { staticAsset } from "@/lib/static-asset";

// Cartografia de Leituras: catálogo biográfico carregado separadamente para manter o texto longo fora do bundle inicial.
export const BIOGRAPHY_CATALOG_URL = staticAsset("data/biography-catalog.json");
export const BIOGRAPHY_BOOK_LINKS_URL = staticAsset(
  "data/biography-book-links.json"
);

export type BiographyRecord = KnowledgeEntity & {
  sections?: Record<string, string>;
  sourceFile?: string;
  rawBooks?: string[];
  bookLinkMethod?: string;
  bookLinksVerified?: boolean;
};

type BiographyBookLink = Pick<
  BiographyRecord,
  "id" | "books" | "rawBooks" | "bookLinkMethod" | "bookLinksVerified"
>;

let records: BiographyRecord[] = [];
let loading: Promise<BiographyRecord[]> | null = null;

function isRecord(value: unknown): value is BiographyRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<BiographyRecord>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.biography === "string"
  );
}

export function registerBiographyCatalog(
  payload: unknown,
  linksPayload?: unknown
) {
  const source = Array.isArray(payload)
    ? payload
    : (payload as { records?: unknown[] } | null)?.records;
  const linkSource = Array.isArray(linksPayload)
    ? linksPayload
    : (linksPayload as { records?: BiographyBookLink[] } | null)?.records;
  const linksById = new Map(
    (Array.isArray(linkSource) ? linkSource : []).map(link => [link.id, link])
  );
  records = Array.isArray(source)
    ? source.filter(isRecord).map(record => ({
        ...record,
        ...(linksById.get(record.id) ?? {}),
      }))
    : [];
  return records;
}

export async function loadBiographyCatalog() {
  if (records.length) return records;
  if (!loading) {
    loading = Promise.all([
      fetch(BIOGRAPHY_CATALOG_URL).then(response => {
        if (!response.ok) throw new Error("Catálogo biográfico indisponível.");
        return response.json();
      }),
      fetch(BIOGRAPHY_BOOK_LINKS_URL).then(response =>
        response.ok ? response.json() : { records: [] }
      ),
    ])
      .then(([payload, linksPayload]) =>
        registerBiographyCatalog(payload, linksPayload)
      )
      .finally(() => {
        loading = null;
      });
  }
  return loading;
}

export function getBiographyEntities() {
  return records;
}

export function findBiography(id: string) {
  return records.find(record => record.id === id) || null;
}

export function getBiographyRelations(): KnowledgeRelation[] {
  return records.flatMap(record =>
    record.related.slice(0, 8).map((target, index) => ({
      id: `bio-${record.id}-${target}-${index}`,
      from: record.id,
      to: target,
      label:
        record.sections &&
        Object.keys(record.sections).some(key =>
          key.toLowerCase().includes("profet")
        )
          ? "conexão profética"
          : "conexão teológica",
      type:
        record.sections &&
        Object.keys(record.sections).some(key =>
          key.toLowerCase().includes("profet")
        )
          ? "prophetic"
          : "theological",
      explanation:
        "Relação extraída do dossiê biográfico e apresentada como ponto de partida para investigação, não como prova automática de dependência textual.",
      refs: record.refs.slice(0, 4),
    }))
  );
}
