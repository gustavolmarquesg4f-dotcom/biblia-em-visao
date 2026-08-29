import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";

import { advancedGlossary } from "../client/src/lib/advanced-glossary-data.ts";
import { apocryphaEntries } from "../client/src/lib/apocrypha-data.ts";
import {
  bibleBooks,
  themes as globalThemes,
} from "../client/src/lib/bible-data.ts";
import { studyModules } from "../client/src/lib/deep-data.ts";
import {
  genesisEntities,
  genesisEvents,
  genesisPlaces,
  genesisProphecies,
} from "../client/src/lib/genesis-relational-data.ts";
import { theologyEntries } from "../client/src/lib/pentecostal-data.ts";
import {
  canonicalKnowledgeLabel,
  makeKnowledgeId,
  parseKnowledgeId,
  slugifyKnowledgeLabel,
  type KnowledgeKind,
  type KnowledgeNode,
  type KnowledgeRelation,
  type KnowledgeRelationType,
} from "../shared/knowledge-model.ts";

type JsonObject = Record<string, any>;

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const publicDataDirectory = path.join(projectRoot, "client", "public", "data");
const outputDirectory = path.join(publicDataDirectory, "knowledge");
const auditDirectory = path.join(projectRoot, "audit");

async function readJson(fileName: string) {
  return JSON.parse(
    await fs.readFile(path.join(publicDataDirectory, fileName), "utf8")
  ) as JsonObject;
}

function asReferences(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function maturityFromChapter(value: string): KnowledgeNode["maturity"] {
  if (value === "Comentário textual enriquecido") return "expanded";
  return "available";
}

const nodes = new Map<string, KnowledgeNode>();
const relations = new Map<string, KnowledgeRelation>();
let mergedNodeContributions = 0;

function addNode(node: KnowledgeNode) {
  const current = nodes.get(node.id);
  if (!current) {
    nodes.set(node.id, node);
    return node.id;
  }

  mergedNodeContributions += 1;
  const maturityOrder = ["available", "expanded", "reviewed", "complete"];
  nodes.set(node.id, {
    ...current,
    aliases: unique([...current.aliases, ...node.aliases]),
    references: unique([...current.references, ...node.references]),
    sourceCatalogs: unique([...current.sourceCatalogs, ...node.sourceCatalogs]),
    sourceIds: unique([
      ...(current.sourceIds ?? []),
      ...(node.sourceIds ?? []),
    ]),
    summary:
      node.summary.length > current.summary.length
        ? node.summary
        : current.summary,
    maturity:
      maturityOrder.indexOf(node.maturity) >
      maturityOrder.indexOf(current.maturity)
        ? node.maturity
        : current.maturity,
    attributes: { ...(current.attributes ?? {}), ...(node.attributes ?? {}) },
  });
  return node.id;
}

function relationId(type: KnowledgeRelationType, from: string, to: string) {
  return `relation:${type}:${from.replaceAll(":", "-")}:${to.replaceAll(":", "-")}`;
}

function addRelation(
  type: KnowledgeRelationType,
  from: string,
  to: string,
  options: {
    label: string;
    explanation: string;
    references?: string[];
    sourceCatalog: string;
    confidence?: KnowledgeRelation["confidence"];
  }
) {
  const id = relationId(type, from, to);
  const existing = relations.get(id);
  if (existing) {
    existing.references = unique([
      ...existing.references,
      ...(options.references ?? []),
    ]);
    return;
  }
  relations.set(id, {
    id,
    from,
    to,
    type,
    label: options.label,
    explanation: options.explanation,
    references: options.references ?? [],
    sourceCatalog: options.sourceCatalog,
    confidence: options.confidence ?? "high",
  });
}

function node(
  kind: KnowledgeKind,
  label: string,
  sourceCatalog: string,
  options: Partial<
    Omit<KnowledgeNode, "id" | "kind" | "label" | "sourceCatalogs">
  > & {
    idPart?: string;
  } = {}
) {
  const cleanLabel = canonicalKnowledgeLabel(label);
  return addNode({
    id: makeKnowledgeId(kind, options.idPart ?? cleanLabel),
    kind,
    label: cleanLabel,
    aliases: unique(options.aliases ?? []),
    summary: options.summary ?? "",
    references: unique(options.references ?? []),
    sourceCatalogs: [sourceCatalog],
    maturity: options.maturity ?? "available",
    sourceIds: options.sourceIds,
    attributes: options.attributes,
  });
}

const [
  biographyPayload,
  biographyLinksPayload,
  chapterPayload,
  relationalPayload,
] = await Promise.all([
  readJson("biography-catalog.json"),
  readJson("biography-book-links.json"),
  readJson("chapter-coverage.json"),
  readJson("relational-books-catalog.json"),
]);

const biographyLinksById = new Map(
  (biographyLinksPayload.records as JsonObject[]).map(record => [
    record.id,
    record,
  ])
);
const biographyRecords = (biographyPayload.records as JsonObject[]).map(
  record => ({
    ...record,
    ...(biographyLinksById.get(record.id) ?? {}),
  })
);
const chapterRecords = chapterPayload.records as JsonObject[];
const relationalBooks = relationalPayload.books as JsonObject[];

const bookBySlug = new Map(
  bibleBooks.map(book => [slugifyKnowledgeLabel(book.name), book])
);
const bookIdBySlug = new Map<string, string>();

for (const book of bibleBooks) {
  const bookId = node("book", book.name, "bible-data", {
    idPart: book.name,
    aliases: [book.short],
    summary: book.summary,
    maturity: "complete",
    sourceIds: [book.id],
    attributes: {
      testament: book.testament,
      category: book.category,
      chapters: book.chapters,
      author: book.author,
      period: book.period,
    },
  });
  bookIdBySlug.set(slugifyKnowledgeLabel(book.name), bookId);
}

for (const chapter of chapterRecords) {
  const bookSlug = slugifyKnowledgeLabel(String(chapter.book));
  const bookId = bookIdBySlug.get(bookSlug);
  if (!bookId) continue;
  const chapterId = addNode({
    id: makeKnowledgeId("chapter", chapter.book, chapter.chapter),
    kind: "chapter",
    label: `${chapter.book} ${chapter.chapter}`,
    aliases: [String(chapter.reference)],
    summary: String(chapter.title ?? chapter.textLayer ?? ""),
    references: unique([
      String(chapter.reference),
      ...asReferences(chapter.references),
    ]),
    sourceCatalogs: ["chapter-coverage"],
    maturity: maturityFromChapter(String(chapter.editorialDepth)),
    sourceIds: [String(chapter.id)],
    attributes: {
      book: chapter.book,
      chapter: chapter.chapter,
      editorialDepth: chapter.editorialDepth,
    },
  });
  addRelation("contains", bookId, chapterId, {
    label: "contém capítulo",
    explanation: `${chapter.book} contém o estudo do capítulo ${chapter.chapter}.`,
    references: [String(chapter.reference)],
    sourceCatalog: "chapter-coverage",
  });
}

const personAliasToId = new Map<string, string>();
for (const biography of biographyRecords) {
  const personId = node("person", String(biography.name), "biography-catalog", {
    aliases: asReferences(biography.aliases),
    summary: String(biography.summary ?? biography.shortLabel ?? ""),
    references: asReferences(biography.refs),
    maturity: biography.primarySource ? "reviewed" : "expanded",
    sourceIds: [String(biography.id)],
    attributes: {
      periods: biography.periods ?? [],
      primarySource: biography.primarySource ?? null,
      bookLinksVerified: biography.bookLinksVerified === true,
    },
  });

  for (const alias of [biography.name, ...(biography.aliases ?? [])]) {
    personAliasToId.set(slugifyKnowledgeLabel(String(alias)), personId);
  }
  for (const bookName of biography.books ?? []) {
    const bookId = bookIdBySlug.get(slugifyKnowledgeLabel(String(bookName)));
    if (!bookId) continue;
    addRelation("appears-in", personId, bookId, {
      label: "aparece em",
      explanation:
        "Associação confirmada por referência bíblica explícita no dossiê biográfico.",
      references: asReferences(biography.refs),
      sourceCatalog: "biography-catalog",
    });
  }
}

function resolvePersonId(label: string) {
  const clean = canonicalKnowledgeLabel(label);
  const candidates = [clean, ...clean.split(/\s*\/\s*/)].map(
    slugifyKnowledgeLabel
  );
  return candidates.map(value => personAliasToId.get(value)).find(Boolean);
}

function relationalEntityKind(type: string): KnowledgeKind {
  if (type === "Pessoa") return "person";
  if (type === "Povo") return "people-group";
  return "theme";
}

function addRelationalBook(book: JsonObject) {
  const sourceCatalog = "relational-books-catalog";
  const sourceBook =
    bookBySlug.get(slugifyKnowledgeLabel(String(book.bookName))) ??
    bookBySlug.get(
      slugifyKnowledgeLabel(
        String(book.bookName).replace("Atos dos Apóstolos", "Atos")
      )
    );
  if (!sourceBook) return;
  const bookId = bookIdBySlug.get(slugifyKnowledgeLabel(sourceBook.name))!;

  for (const entity of book.entities ?? []) {
    const kind = relationalEntityKind(String(entity.type));
    const entityId =
      (kind === "person" && resolvePersonId(String(entity.name))) ||
      node(kind, String(entity.name), sourceCatalog, {
        summary: String(entity.summary ?? entity.role ?? ""),
        references: asReferences(entity.refs),
        maturity: "expanded",
      });
    addNode({
      id: entityId,
      kind,
      label: canonicalKnowledgeLabel(String(entity.name)),
      aliases: [],
      summary: String(entity.summary ?? entity.role ?? ""),
      references: asReferences(entity.refs),
      sourceCatalogs: [sourceCatalog],
      maturity: "expanded",
      attributes: { role: entity.role, entityType: entity.type },
    });
    addRelation("appears-in", entityId, bookId, {
      label: "aparece em",
      explanation: String(
        entity.role ?? `Entidade relacionada a ${sourceBook.name}.`
      ),
      references: asReferences(entity.refs),
      sourceCatalog,
    });
  }

  for (const place of book.places ?? []) {
    const placeId = node("place", String(place.name), sourceCatalog, {
      summary: String(place.function ?? ""),
      references: asReferences(place.refs),
      maturity: "expanded",
      attributes: { status: place.status },
    });
    addRelation("appears-in", placeId, bookId, {
      label: "cenário de",
      explanation: String(
        place.function ?? `Lugar relacionado a ${sourceBook.name}.`
      ),
      references: asReferences(place.refs),
      sourceCatalog,
    });
  }

  for (const event of book.events ?? []) {
    const eventId = node("event", String(event.title), sourceCatalog, {
      idPart: `${sourceBook.name}-${event.title}`,
      summary: String(event.what ?? ""),
      references: asReferences(event.chapters).map(
        value => `${sourceBook.name} ${value}`
      ),
      maturity: "expanded",
      attributes: { consequence: event.consequence, entities: event.entities },
    });
    addRelation("appears-in", eventId, bookId, {
      label: "acontece em",
      explanation: String(event.consequence ?? event.what ?? ""),
      sourceCatalog,
    });
    for (const entityName of String(event.entities ?? "").split(/\s*,\s*/)) {
      const personId = resolvePersonId(entityName);
      if (personId) {
        addRelation("participates-in", personId, eventId, {
          label: "participa de",
          explanation: `${entityName} participa deste acontecimento.`,
          sourceCatalog,
        });
      }
    }
  }

  for (const theme of book.themes ?? []) {
    const themeId = node("theme", String(theme.name), sourceCatalog, {
      summary: String(theme.explanation ?? ""),
      maturity: "expanded",
      attributes: { connections: theme.connections },
    });
    addRelation("develops-theme", bookId, themeId, {
      label: "desenvolve tema",
      explanation: String(theme.explanation ?? ""),
      sourceCatalog,
    });
  }

  for (const prophecy of book.prophecies ?? []) {
    const prophecyId = node(
      "prophecy",
      String(prophecy.source),
      sourceCatalog,
      {
        idPart: `${sourceBook.name}-${prophecy.source}`,
        summary: String(prophecy.interpretations ?? ""),
        references: asReferences(prophecy.connections),
        maturity: "expanded",
        attributes: { type: prophecy.type },
      }
    );
    addRelation("appears-in", prophecyId, bookId, {
      label: "conexão profética em",
      explanation: String(prophecy.interpretations ?? ""),
      references: asReferences(prophecy.connections),
      sourceCatalog,
      confidence: "debated",
    });
  }

  for (const connection of book.continuity ?? []) {
    const targetId = bookIdBySlug.get(
      slugifyKnowledgeLabel(String(connection.book))
    );
    if (!targetId) continue;
    addRelation("canonical-connection", bookId, targetId, {
      label: "conecta-se a",
      explanation: String(connection.reason ?? ""),
      references: asReferences(connection.refs),
      sourceCatalog,
      confidence: "contextual",
    });
  }
}

for (const book of relationalBooks) addRelationalBook(book);

const genesisBookId = bookIdBySlug.get("genesis")!;
for (const entity of genesisEntities) {
  const kind = relationalEntityKind(entity.type);
  const entityId =
    (kind === "person" && resolvePersonId(entity.name)) ||
    node(kind, entity.name, "genesis-relational", {
      summary: entity.summary,
      references: entity.refs,
      maturity: "expanded",
      sourceIds: [entity.id],
      attributes: { role: entity.role, tags: entity.tags },
    });
  addNode({
    id: entityId,
    kind,
    label: canonicalKnowledgeLabel(entity.name),
    aliases: entity.name.includes("/") ? entity.name.split(/\s*\/\s*/) : [],
    summary: entity.narrative || entity.summary,
    references: entity.refs,
    sourceCatalogs: ["genesis-relational"],
    maturity: "expanded",
    sourceIds: [entity.id],
    attributes: { role: entity.role, tags: entity.tags },
  });
  addRelation("appears-in", entityId, genesisBookId, {
    label: "aparece em",
    explanation: entity.role,
    references: entity.refs,
    sourceCatalog: "genesis-relational",
  });
}

for (const place of genesisPlaces) {
  const placeId = node("place", place.name, "genesis-relational", {
    summary: place.note,
    references: place.refs,
    maturity: "expanded",
    sourceIds: [place.id],
    attributes: { status: place.status, x: place.x, y: place.y },
  });
  addRelation("appears-in", placeId, genesisBookId, {
    label: "cenário de",
    explanation: place.note,
    references: place.refs,
    sourceCatalog: "genesis-relational",
  });
}

for (const event of genesisEvents) {
  const eventId = node("event", event.title, "genesis-relational", {
    idPart: `genesis-${event.id}`,
    summary: event.summary,
    references: [event.refs],
    maturity: "expanded",
    sourceIds: [event.id],
    attributes: { consequence: event.consequence, entities: event.entities },
  });
  addRelation("appears-in", eventId, genesisBookId, {
    label: "acontece em",
    explanation: event.consequence,
    references: [event.refs],
    sourceCatalog: "genesis-relational",
  });
  for (const entityName of event.entities) {
    const personId = resolvePersonId(entityName);
    if (personId) {
      addRelation("participates-in", personId, eventId, {
        label: "participa de",
        explanation: `${entityName} participa deste acontecimento.`,
        references: [event.refs],
        sourceCatalog: "genesis-relational",
      });
    }
  }
}

for (const prophecy of genesisProphecies) {
  const prophecyId = node("prophecy", prophecy.title, "genesis-relational", {
    idPart: `genesis-${prophecy.source}-${prophecy.title}`,
    summary: prophecy.reading,
    references: [prophecy.source, ...prophecy.connections],
    maturity: "expanded",
    attributes: { note: prophecy.note },
  });
  addRelation("appears-in", prophecyId, genesisBookId, {
    label: "conexão profética em",
    explanation: prophecy.note,
    references: [prophecy.source, ...prophecy.connections],
    sourceCatalog: "genesis-relational",
    confidence: "debated",
  });
}

for (const theme of globalThemes) {
  node("theme", theme.label, "bible-data", {
    summary: theme.detail,
    maturity: "reviewed",
  });
}

for (const entry of advancedGlossary) {
  node("term", entry.term, "advanced-glossary", {
    idPart: entry.id,
    aliases: [entry.original, entry.transliteration],
    summary: entry.definition,
    references: entry.refs,
    maturity: "reviewed",
    sourceIds: [entry.id],
    attributes: {
      language: entry.language,
      semanticRange: entry.semanticRange,
      translationNote: entry.translationNote,
    },
  });
}

for (const entry of theologyEntries) {
  node("doctrine", entry.title, "pentecostal-theology", {
    idPart: entry.id,
    summary: entry.statement,
    references: asReferences(entry.biblicalBasis),
    maturity: "reviewed",
    sourceIds: [entry.id],
    attributes: {
      category: entry.category,
      pentecostalReading: entry.pentecostalReading,
      distinction: entry.distinction,
      source: entry.source,
    },
  });
}

for (const entry of apocryphaEntries) {
  node("apocryphal-work", entry.title, "apocrypha", {
    idPart: entry.id,
    summary: entry.summary,
    references: [entry.references],
    maturity: "reviewed",
    sourceIds: [entry.id],
    attributes: {
      collection: entry.collection,
      period: entry.period,
      genre: entry.genre,
      lenses: entry.lenses,
      historicalQuestion: entry.historicalQuestion,
      reception: entry.reception,
    },
  });
}

for (const module of studyModules) {
  node("formation-study", module.title, "formation", {
    idPart: module.id,
    summary: module.description,
    maturity: "reviewed",
    sourceIds: [module.id],
    attributes: {
      level: module.level,
      duration: module.duration,
      lessons: module.lessons.length,
    },
  });
}

const nodesByKind = Object.fromEntries(
  Array.from(nodes.values())
    .sort((a, b) => a.id.localeCompare(b.id))
    .reduce((map, item) => {
      const group = map.get(item.kind) ?? [];
      group.push(item);
      map.set(item.kind, group);
      return map;
    }, new Map<KnowledgeKind, KnowledgeNode[]>())
) as Partial<Record<KnowledgeKind, KnowledgeNode[]>>;

const relationList = Array.from(relations.values()).sort((a, b) =>
  a.id.localeCompare(b.id)
);
const unresolvedRelations = relationList.filter(
  relation => !nodes.has(relation.from) || !nodes.has(relation.to)
);
const malformedNodeIds = Array.from(nodes.keys()).filter(
  id => !parseKnowledgeId(id)
);
const suspiciousBiographyAssociations = bibleBooks
  .map(book => ({
    book: book.name,
    count: biographyRecords.filter(record => record.books?.includes(book.name))
      .length,
  }))
  .filter(item => item.count > biographyRecords.length / 2);

const fileByKind: Record<KnowledgeKind, string> = {
  book: "books.json",
  chapter: "chapters.json",
  person: "people.json",
  "people-group": "people-groups.json",
  place: "places.json",
  event: "events.json",
  theme: "themes.json",
  prophecy: "prophecies.json",
  term: "terms.json",
  doctrine: "doctrines.json",
  "apocryphal-work": "apocrypha.json",
  "formation-study": "formation.json",
  period: "periods.json",
  empire: "empires.json",
};

const activeKinds = (Object.keys(nodesByKind) as KnowledgeKind[]).sort();
const relationDirectory = path.join(outputDirectory, "relations");
const relationFiles: Array<{
  type: KnowledgeRelationType;
  file: string;
  count: number;
}> = [];
const relationGroups = relationList.reduce((map, relation) => {
  const group = map.get(relation.type) ?? [];
  group.push(relation);
  map.set(relation.type, group);
  return map;
}, new Map<KnowledgeRelationType, KnowledgeRelation[]>());
const relationChunkSize = 700;
for (const [type, group] of relationGroups) {
  for (let offset = 0; offset < group.length; offset += relationChunkSize) {
    const part = Math.floor(offset / relationChunkSize) + 1;
    const file = `relations/${type}-${String(part).padStart(3, "0")}.json`;
    relationFiles.push({
      type,
      file,
      count: group.slice(offset, offset + relationChunkSize).length,
    });
  }
}
const manifest = {
  schemaVersion: 1,
  generatedBy: "pnpm knowledge:build",
  nodeCount: nodes.size,
  relationCount: relationList.length,
  countsByKind: Object.fromEntries(
    activeKinds.map(kind => [kind, nodesByKind[kind]?.length ?? 0])
  ),
  files: Object.fromEntries(activeKinds.map(kind => [kind, fileByKind[kind]])),
  relationsFile: "relations.json",
};

const validation = {
  schemaVersion: 1,
  valid:
    (nodesByKind.book?.length ?? 0) === 66 &&
    (nodesByKind.chapter?.length ?? 0) === 1189 &&
    biographyRecords.length === 119 &&
    unresolvedRelations.length === 0 &&
    malformedNodeIds.length === 0 &&
    suspiciousBiographyAssociations.length === 0,
  counts: {
    nodes: nodes.size,
    relations: relationList.length,
    byKind: manifest.countsByKind,
    biographyRecords: biographyRecords.length,
    biographyRecordsWithRawLinksPreserved: biographyRecords.filter(record =>
      Array.isArray(record.rawBooks)
    ).length,
    mergedNodeContributions,
  },
  invariants: {
    canonicalBooks: (nodesByKind.book?.length ?? 0) === 66,
    canonicalChapters: (nodesByKind.chapter?.length ?? 0) === 1189,
    biographiesPreserved: biographyRecords.length === 119,
    originalBiographyLinksPreserved: biographyRecords.every(record =>
      Array.isArray(record.rawBooks)
    ),
    noUnresolvedRelations: unresolvedRelations.length === 0,
    stableNodeIds: malformedNodeIds.length === 0,
    noSuspiciousBiographyAssociations:
      suspiciousBiographyAssociations.length === 0,
  },
  unresolvedRelations: unresolvedRelations.map(relation => relation.id),
  malformedNodeIds,
  suspiciousBiographyAssociations,
};

await fs.mkdir(outputDirectory, { recursive: true });
await fs.mkdir(auditDirectory, { recursive: true });
await fs.rm(relationDirectory, { recursive: true, force: true });
await fs.mkdir(relationDirectory, { recursive: true });
for (const kind of activeKinds) {
  await fs.writeFile(
    path.join(outputDirectory, fileByKind[kind]),
    await format(
      JSON.stringify({
        schemaVersion: 1,
        kind,
        count: nodesByKind[kind]?.length ?? 0,
        nodes: nodesByKind[kind],
      }),
      { parser: "json" }
    ),
    "utf8"
  );
}
await fs.writeFile(
  path.join(outputDirectory, "relations.json"),
  await format(
    JSON.stringify({
      schemaVersion: 1,
      count: relationList.length,
      chunkSize: relationChunkSize,
      files: relationFiles,
    }),
    { parser: "json" }
  ),
  "utf8"
);
for (const relationFile of relationFiles) {
  const [type, partText] = path
    .basename(relationFile.file, ".json")
    .split(/-(?=\d{3}$)/);
  const part = Number(partText);
  const group = relationGroups.get(type as KnowledgeRelationType) ?? [];
  const chunk = group.slice(
    (part - 1) * relationChunkSize,
    part * relationChunkSize
  );
  await fs.writeFile(
    path.join(outputDirectory, relationFile.file),
    await format(
      JSON.stringify({
        schemaVersion: 1,
        type,
        part,
        count: chunk.length,
        relations: chunk,
      }),
      { parser: "json" }
    ),
    "utf8"
  );
}
await fs.writeFile(
  path.join(outputDirectory, "manifest.json"),
  await format(JSON.stringify(manifest), { parser: "json" }),
  "utf8"
);
await fs.writeFile(
  path.join(auditDirectory, "knowledge-registry-validation.json"),
  await format(JSON.stringify(validation), { parser: "json" }),
  "utf8"
);

if (process.argv.includes("--check") && !validation.valid) {
  console.error(
    "Registro de conhecimento inválido. Consulte audit/knowledge-registry-validation.json."
  );
  process.exitCode = 1;
} else {
  console.log(
    `Registro de conhecimento: ${nodes.size} nós, ${relationList.length} relações e ${activeKinds.length} tipos.`
  );
}
