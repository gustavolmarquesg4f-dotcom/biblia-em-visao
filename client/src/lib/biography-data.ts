import type { KnowledgeEntity, KnowledgeRelation } from "@/lib/entity-graph";

// Cartografia de Leituras: catálogo biográfico carregado separadamente para manter o texto longo fora do bundle inicial.
export const BIOGRAPHY_CATALOG_URL = "/manus-storage/biography-catalog_d53d56ca.json";

export type BiographyRecord = KnowledgeEntity & {
  sections?: Record<string, string>;
  sourceFile?: string;
};

let records: BiographyRecord[] = [];
let loading: Promise<BiographyRecord[]> | null = null;

function isRecord(value: unknown): value is BiographyRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<BiographyRecord>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.biography === "string";
}

export function registerBiographyCatalog(payload: unknown) {
  const source = Array.isArray(payload) ? payload : (payload as { records?: unknown[] } | null)?.records;
  records = Array.isArray(source) ? source.filter(isRecord) : [];
  return records;
}

export async function loadBiographyCatalog() {
  if (records.length) return records;
  if (!loading) {
    loading = fetch(BIOGRAPHY_CATALOG_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Catálogo biográfico indisponível.");
        return response.json();
      })
      .then(registerBiographyCatalog)
      .finally(() => { loading = null; });
  }
  return loading;
}

export function getBiographyEntities() {
  return records;
}

export function findBiography(id: string) {
  return records.find((record) => record.id === id) || null;
}

export function getBiographyRelations(): KnowledgeRelation[] {
  return records.flatMap((record) => record.related.slice(0, 8).map((target, index) => ({
    id: `bio-${record.id}-${target}-${index}`,
    from: record.id,
    to: target,
    label: record.sections && Object.keys(record.sections).some((key) => key.toLowerCase().includes("profet")) ? "conexão profética" : "conexão teológica",
    type: record.sections && Object.keys(record.sections).some((key) => key.toLowerCase().includes("profet")) ? "prophetic" : "theological",
    explanation: "Relação extraída do dossiê biográfico e apresentada como ponto de partida para investigação, não como prova automática de dependência textual.",
    refs: record.refs.slice(0, 4),
  })));
}
