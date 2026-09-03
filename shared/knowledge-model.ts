export const knowledgeKinds = [
  "book",
  "chapter",
  "person",
  "people-group",
  "place",
  "event",
  "theme",
  "prophecy",
  "term",
  "doctrine",
  "apocryphal-work",
  "formation-study",
  "period",
  "empire",
] as const;

export type KnowledgeKind = (typeof knowledgeKinds)[number];

export const relationTypes = [
  "contains",
  "appears-in",
  "located-at",
  "participates-in",
  "belongs-to-period",
  "related-term",
  "develops-theme",
  "canonical-connection",
  "historical-context",
  "interpreted-by",
] as const;

export type KnowledgeRelationType = (typeof relationTypes)[number];

export type KnowledgeNode = {
  id: string;
  kind: KnowledgeKind;
  label: string;
  aliases: string[];
  summary: string;
  references: string[];
  sourceCatalogs: string[];
  maturity: "available" | "expanded" | "reviewed" | "complete";
  sourceIds?: string[];
  attributes?: Record<string, unknown>;
};

export type KnowledgeRelation = {
  id: string;
  from: string;
  to: string;
  type: KnowledgeRelationType;
  label: string;
  explanation: string;
  references: string[];
  sourceCatalog: string;
  confidence: "high" | "medium" | "contextual" | "debated";
};

export type CanonicalBookReference = {
  name: string;
  short: string;
  aliases?: string[];
  chapters?: number;
};

export type CanonicalChapterReference = {
  book: string;
  chapter: number;
  reference: string;
};

export function canonicalKnowledgeLabel(value: string) {
  return value
    .replace(/\s*\([^)]*[\u0590-\u08ff][^)]*\)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyKnowledgeLabel(value: string) {
  return canonicalKnowledgeLabel(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\batos dos apostolos\b/g, "atos")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function makeKnowledgeId(
  kind: KnowledgeKind,
  ...parts: Array<string | number>
) {
  const normalizedParts = parts
    .map(part => slugifyKnowledgeLabel(String(part)))
    .filter(Boolean);
  if (!normalizedParts.length)
    throw new Error(`Identificador ${kind} sem conteúdo.`);
  return `${kind}:${normalizedParts.join(":")}`;
}

export function parseKnowledgeId(value: string) {
  const [kind, ...parts] = value.split(":");
  if (
    !knowledgeKinds.includes(kind as KnowledgeKind) ||
    !parts.length ||
    parts.some(part => !part)
  )
    return null;
  return { kind: kind as KnowledgeKind, parts };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function referenceSegments(reference: string) {
  return reference
    .replace(/[\*_`]/g, "")
    .split(/\s*;\s*|\s+e\s+(?=(?:[1-3]\s*)?[A-Za-zÀ-ÖØ-öø-ÿ])/gi)
    .map(segment => segment.trim())
    .filter(Boolean);
}

export function extractCanonicalBookNames(
  references: string[],
  books: CanonicalBookReference[]
) {
  const matches = new Set<string>();
  const candidates = books
    .flatMap((book, order) => {
      const aliases = new Set([book.name, book.short, ...(book.aliases ?? [])]);
      return Array.from(aliases).map(alias => ({
        alias,
        book: book.name,
        order,
        pattern: new RegExp(`^${escapeRegExp(alias)}(?=\\s*\\d)`, "i"),
      }));
    })
    .sort((a, b) => b.alias.length - a.alias.length);

  for (const reference of references) {
    for (const segment of referenceSegments(reference)) {
      const candidate = candidates.find(item => item.pattern.test(segment));
      if (candidate) matches.add(candidate.book);
    }
  }

  return books.filter(book => matches.has(book.name)).map(book => book.name);
}

function canonicalBookMatches(value: string, books: CanonicalBookReference[]) {
  const matches = books
    .flatMap((book, order) => {
      const aliases = new Set([book.name, book.short, ...(book.aliases ?? [])]);
      return Array.from(aliases).flatMap(alias => {
        const pattern = new RegExp(
          `(^|[^\\p{L}\\p{N}])(${escapeRegExp(alias)})(?=\\s*\\d)`,
          "giu"
        );
        return Array.from(value.matchAll(pattern)).map(match => ({
          book,
          order,
          alias,
          start: (match.index ?? 0) + match[1].length,
          end: (match.index ?? 0) + match[0].length,
        }));
      });
    })
    .sort(
      (left, right) =>
        left.start - right.start ||
        right.alias.length - left.alias.length ||
        left.order - right.order
    );

  return matches.filter(
    (match, index) =>
      !matches.some(
        (candidate, candidateIndex) =>
          candidateIndex < index &&
          candidate.start <= match.start &&
          candidate.end > match.start
      )
  );
}

function chaptersFromReferenceFragment(
  fragment: string,
  maximumChapter?: number
) {
  const normalized = fragment.replace(/[\*_`]/g, "").trim();
  const main = normalized.match(
    /^(\d+)(?:[:.](\d+))?(?:\s*[–—-]\s*(\d+)(?:[:.](\d+))?)?/
  );
  if (!main) return [];

  const start = Number(main[1]);
  const hasStartVerse = Boolean(main[2]);
  const rangeEnd = main[3] ? Number(main[3]) : null;
  const hasEndVerse = Boolean(main[4]);
  const chapters = new Set<number>([start]);

  if (rangeEnd && (!hasStartVerse || hasEndVerse)) {
    const lower = Math.min(start, rangeEnd);
    const upper = Math.max(start, rangeEnd);
    if (upper - lower <= 150) {
      for (let chapter = lower; chapter <= upper; chapter += 1) {
        chapters.add(chapter);
      }
    }
  }

  for (const match of Array.from(normalized.matchAll(/,\s*(\d+)\s*[:.]/g))) {
    chapters.add(Number(match[1]));
  }

  return Array.from(chapters)
    .filter(
      chapter =>
        Number.isInteger(chapter) &&
        chapter > 0 &&
        (!maximumChapter || chapter <= maximumChapter)
    )
    .sort((left, right) => left - right);
}

/**
 * Extrai somente capítulos declarados por uma referência bíblica explícita.
 * Segmentos como `Gn 12:1-3; 15:1-6` herdam o livro, enquanto números de
 * versículos isolados não são promovidos a capítulos.
 */
export function extractCanonicalChapterReferences(
  references: string[],
  books: CanonicalBookReference[]
): CanonicalChapterReference[] {
  const found = new Map<string, CanonicalChapterReference>();

  for (const reference of references) {
    let currentBook: CanonicalBookReference | null = null;
    for (const segment of reference.split(/\s*;\s*/)) {
      const matches = canonicalBookMatches(segment, books);
      const fragments: Array<{
        book: CanonicalBookReference;
        value: string;
      }> = matches.length
        ? matches.map((match, index) => ({
            book: match.book,
            value: segment.slice(match.end, matches[index + 1]?.start),
          }))
        : currentBook
          ? [{ book: currentBook, value: segment }]
          : [];

      for (const fragment of fragments) {
        currentBook = fragment.book;
        for (const chapter of chaptersFromReferenceFragment(
          fragment.value,
          fragment.book.chapters
        )) {
          const key = `${fragment.book.name}:${chapter}`;
          if (!found.has(key)) {
            found.set(key, {
              book: fragment.book.name,
              chapter,
              reference,
            });
          }
        }
      }
    }
  }

  return Array.from(found.values()).sort(
    (left, right) =>
      books.findIndex(book => book.name === left.book) -
        books.findIndex(book => book.name === right.book) ||
      left.chapter - right.chapter
  );
}
