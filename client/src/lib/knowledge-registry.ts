import { staticAsset } from "@/lib/static-asset";
import type {
  KnowledgeKind,
  KnowledgeNode,
  KnowledgeRelation,
  KnowledgeRelationType,
} from "@shared/knowledge-model";

export type KnowledgeManifest = {
  schemaVersion: number;
  generatedBy: string;
  nodeCount: number;
  relationCount: number;
  countsByKind: Partial<Record<KnowledgeKind, number>>;
  files: Partial<Record<KnowledgeKind, string>>;
  relationsFile: string;
  chapterConnections?: {
    relationCount: number;
    chapterCount: number;
    entityCount: number;
    files: Record<string, string>;
  };
};

type NodeFile = {
  schemaVersion: number;
  kind: KnowledgeKind;
  count: number;
  nodes: KnowledgeNode[];
};

type RelationIndex = {
  schemaVersion: number;
  count: number;
  chunkSize: number;
  files: Array<{ type: KnowledgeRelationType; file: string; count: number }>;
};

type RelationFile = {
  schemaVersion: number;
  count: number;
  relations: KnowledgeRelation[];
};

type ChapterConnectionsFile = {
  schemaVersion: number;
  book: string;
  count: number;
  chapterCount: number;
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
};

export type KnowledgeSearchOptions = {
  kinds?: KnowledgeKind[];
  limit?: number;
};

export type RankedKnowledgeNode = {
  node: KnowledgeNode;
  score: number;
};

export type KnowledgeNeighborhood = {
  node: KnowledgeNode;
  relations: KnowledgeRelation[];
  relatedNodes: KnowledgeNode[];
};

export type ChapterKnowledgeConnections = Pick<
  KnowledgeNeighborhood,
  "relations" | "relatedNodes"
>;

const registryBase = staticAsset("data/knowledge").replace(/\/$/, "");
let manifestPromise: Promise<KnowledgeManifest> | null = null;
let relationIndexPromise: Promise<RelationIndex> | null = null;
const nodeFilePromises = new Map<KnowledgeKind, Promise<KnowledgeNode[]>>();
const relationFilePromises = new Map<string, Promise<KnowledgeRelation[]>>();
const chapterConnectionPromises = new Map<
  string,
  Promise<ChapterConnectionsFile>
>();

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${registryBase}/${path}`);
  if (!response.ok) {
    throw new Error(
      `Registro de conhecimento indisponível (${response.status}).`
    );
  }
  return response.json() as Promise<T>;
}

export function loadKnowledgeManifest() {
  manifestPromise ??= fetchJson<KnowledgeManifest>("manifest.json");
  return manifestPromise;
}

async function loadRelationIndex() {
  if (!relationIndexPromise) {
    relationIndexPromise = loadKnowledgeManifest().then(manifest =>
      fetchJson<RelationIndex>(manifest.relationsFile)
    );
  }
  return relationIndexPromise;
}

export async function loadKnowledgeKind(kind: KnowledgeKind) {
  const cached = nodeFilePromises.get(kind);
  if (cached) return cached;

  const promise = loadKnowledgeManifest().then(async manifest => {
    const file = manifest.files[kind];
    if (!file) return [];
    const payload = await fetchJson<NodeFile>(file);
    return payload.nodes;
  });
  nodeFilePromises.set(kind, promise);
  return promise;
}

export async function loadKnowledgeKinds(kinds: KnowledgeKind[]) {
  const files = await Promise.all(
    Array.from(new Set(kinds)).map(loadKnowledgeKind)
  );
  return files.flat();
}

export async function loadAllKnowledgeNodes() {
  const manifest = await loadKnowledgeManifest();
  return loadKnowledgeKinds(Object.keys(manifest.files) as KnowledgeKind[]);
}

export async function loadKnowledgeNode(id: string) {
  const kind = id.split(":")[0] as KnowledgeKind;
  const nodes = await loadKnowledgeKind(kind);
  return nodes.find(node => node.id === id) ?? null;
}

export async function loadKnowledgeNodesByIds(ids: string[]) {
  const wanted = new Set(ids);
  const kinds = Array.from(
    new Set(ids.map(id => id.split(":")[0] as KnowledgeKind))
  );
  const nodes = await loadKnowledgeKinds(kinds);
  return nodes.filter(node => wanted.has(node.id));
}

export async function loadKnowledgeRelations(types?: KnowledgeRelationType[]) {
  const index = await loadRelationIndex();
  const selectedTypes = types?.length ? new Set(types) : null;
  const files = index.files.filter(
    entry => !selectedTypes || selectedTypes.has(entry.type)
  );
  const chunks = await Promise.all(
    files.map(entry => {
      const cached = relationFilePromises.get(entry.file);
      if (cached) return cached;
      const promise = fetchJson<RelationFile>(entry.file).then(
        payload => payload.relations
      );
      relationFilePromises.set(entry.file, promise);
      return promise;
    })
  );
  return chunks.flat();
}

export async function loadConnectedKnowledgeRelations(
  id: string,
  types?: KnowledgeRelationType[]
) {
  const relations = await loadKnowledgeRelations(types);
  return relations.filter(
    relation => relation.from === id || relation.to === id
  );
}

export async function loadKnowledgeNeighborhood(
  id: string,
  types?: KnowledgeRelationType[],
  relatedLimit = 80
): Promise<KnowledgeNeighborhood | null> {
  const [node, connected] = await Promise.all([
    loadKnowledgeNode(id),
    loadConnectedKnowledgeRelations(id, types),
  ]);
  if (!node) return null;
  const relatedIds = Array.from(
    new Set(
      connected.map(relation =>
        relation.from === id ? relation.to : relation.from
      )
    )
  ).slice(0, relatedLimit);
  const relatedNodes = await loadKnowledgeNodesByIds(relatedIds);
  return { node, relations: connected, relatedNodes };
}

export async function loadChapterKnowledge(
  chapterId: string
): Promise<ChapterKnowledgeConnections | null> {
  const [kind, bookSlug, chapter] = chapterId.split(":");
  if (kind !== "chapter" || !bookSlug || !/^\d+$/.test(chapter)) return null;
  const manifest = await loadKnowledgeManifest();
  const file = manifest.chapterConnections?.files[bookSlug];
  if (!file) return { relations: [], relatedNodes: [] };

  let payload = chapterConnectionPromises.get(file);
  if (!payload) {
    payload = fetchJson<ChapterConnectionsFile>(file);
    chapterConnectionPromises.set(file, payload);
  }
  const chapterConnections = await payload;
  const relations = chapterConnections.relations.filter(
    relation => relation.from === chapterId || relation.to === chapterId
  );
  const relatedIds = new Set(
    relations.map(relation =>
      relation.from === chapterId ? relation.to : relation.from
    )
  );
  const relatedNodes = chapterConnections.nodes.filter(related =>
    relatedIds.has(related.id)
  );
  return { relations, relatedNodes };
}

export function normalizeKnowledgeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchableAttributes(attributes?: Record<string, unknown>) {
  if (!attributes) return "";
  return Object.values(attributes)
    .flatMap(value => (Array.isArray(value) ? value : [value]))
    .filter(
      (value): value is string | number =>
        typeof value === "string" || typeof value === "number"
    )
    .join(" ");
}

function scoreNode(
  node: KnowledgeNode,
  normalizedQuery: string,
  tokens: string[]
) {
  const label = normalizeKnowledgeSearch(node.label);
  const aliases = node.aliases.map(normalizeKnowledgeSearch);
  const summary = normalizeKnowledgeSearch(node.summary);
  const references = normalizeKnowledgeSearch(node.references.join(" "));
  const context = normalizeKnowledgeSearch(
    `${node.sourceCatalogs.join(" ")} ${searchableAttributes(node.attributes)}`
  );
  const fullText = `${label} ${aliases.join(" ")} ${summary} ${references} ${context}`;

  if (!tokens.every(token => fullText.includes(token))) return 0;
  let score = 10;
  if (label === normalizedQuery) score += 180;
  else if (label.startsWith(normalizedQuery)) score += 110;
  else if (label.includes(normalizedQuery)) score += 75;
  if (aliases.some(alias => alias === normalizedQuery)) score += 140;
  if (aliases.some(alias => alias.startsWith(normalizedQuery))) score += 70;
  for (const token of tokens) {
    if (label.split(" ").includes(token)) score += 24;
    else if (label.includes(token)) score += 14;
    if (summary.includes(token)) score += 5;
    if (references.includes(token)) score += 3;
  }
  if (node.maturity === "complete") score += 5;
  if (node.maturity === "reviewed") score += 3;
  return score;
}

export function rankKnowledgeNodes(
  nodes: KnowledgeNode[],
  query: string,
  options: KnowledgeSearchOptions = {}
): RankedKnowledgeNode[] {
  const normalizedQuery = normalizeKnowledgeSearch(query);
  if (!normalizedQuery) return [];
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const acceptedKinds = options.kinds?.length ? new Set(options.kinds) : null;
  return nodes
    .filter(node => !acceptedKinds || acceptedKinds.has(node.kind))
    .map(node => ({ node, score: scoreNode(node, normalizedQuery, tokens) }))
    .filter(entry => entry.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.node.label.localeCompare(right.node.label, "pt-BR")
    )
    .slice(0, options.limit ?? 60);
}

export const knowledgeKindLabels: Record<KnowledgeKind, string> = {
  book: "Livro",
  chapter: "Capítulo",
  person: "Pessoa",
  "people-group": "Povo ou grupo",
  place: "Lugar",
  event: "Acontecimento",
  theme: "Tema",
  prophecy: "Profecia",
  term: "Termo",
  doctrine: "Doutrina",
  "apocryphal-work": "Apócrifo / deuterocanônico",
  "formation-study": "Estudo de formação",
  period: "Período",
  empire: "Império",
};

export const maturityLabels: Record<KnowledgeNode["maturity"], string> = {
  available: "Estudo disponível",
  expanded: "Conteúdo ampliado",
  reviewed: "Revisão editorial concluída",
  complete: "Dossiê completo",
};

export const relationTypeLabels: Record<KnowledgeRelationType, string> = {
  contains: "contém",
  "appears-in": "aparece em",
  "located-at": "localiza-se em",
  "participates-in": "participa de",
  "belongs-to-period": "pertence ao período",
  "related-term": "relaciona-se ao termo",
  "develops-theme": "desenvolve o tema",
  "canonical-connection": "conexão canônica",
  "historical-context": "contexto histórico",
  "interpreted-by": "é interpretado por",
};

export const confidenceLabels: Record<KnowledgeRelation["confidence"], string> =
  {
    high: "alta confiança",
    medium: "confiança média",
    contextual: "relação contextual",
    debated: "relação debatida",
  };

export function resetKnowledgeRegistryCacheForTests() {
  manifestPromise = null;
  relationIndexPromise = null;
  nodeFilePromises.clear();
  relationFilePromises.clear();
  chapterConnectionPromises.clear();
}
