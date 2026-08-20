import { staticAsset } from "@/lib/static-asset";

export type ChapterCoverageRecord = {
  id: string;
  book: string;
  bookId: string;
  chapter: number;
  reference: string;
  title: string;
  editorialDepth: "Núcleo sintético" | "Foco ampliado";
  textLayer: string;
  contextLayer: string;
  interpretationLayer: string;
  pentecostalLayer: string;
  references: string[];
  source: { label: string; url: string };
  cartography: {
    placeId: string;
    placeLabel: string;
    region: string;
    period: string;
    routeIds: string[];
    routeLabels: string[];
    empireIds: string[];
    empireLabels: string[];
    note: string;
    source: { label: string; url: string };
  };
  verification: {
    chapterExistsInCanon: true;
    commentarySchemaComplete: true;
    cartographicContextPresent: true;
    methodology: string;
  };
};

export type ChapterCoveragePayload = {
  version: string;
  total: number;
  bookCount: number;
  method: string;
  records: ChapterCoverageRecord[];
};

export const CHAPTER_COVERAGE_URL = staticAsset("data/chapter-coverage.json");

let coveragePromise: Promise<ChapterCoveragePayload> | null = null;

export function loadChapterCoverage() {
  if (!coveragePromise) {
    coveragePromise = fetch(CHAPTER_COVERAGE_URL).then((response) => {
      if (!response.ok) throw new Error("Não foi possível carregar a cobertura integral de capítulos.");
      return response.json() as Promise<ChapterCoveragePayload>;
    });
  }
  return coveragePromise;
}

export function chapterCoverageForBook(payload: ChapterCoveragePayload, bookName: string) {
  return payload.records.filter((record) => record.book === bookName).sort((a, b) => a.chapter - b.chapter);
}
