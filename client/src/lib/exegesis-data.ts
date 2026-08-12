export type ExegesisChapter = {
  chapter: number;
  title: string;
  content: string;
  references: string[];
  prophetic: boolean;
  prophetic_references: string[];
};

export type ExegesisSection = { title: string; content: string; references: string[] };

export type ExegesisDossier = {
  book_name: string;
  slug: string;
  confidence_notes: string;
  chapters: ExegesisChapter[];
  prophecy_sections: ExegesisSection[];
  source_sections: ExegesisSection[];
  sections: Array<{ level: number; title: string; content: string }>;
  raw_markdown: string;
};

export type ExegesisPayload = { total: number; dossiers: ExegesisDossier[] };

export const EXEGESIS_DATA_URL = "/manus-storage/exegesis-data_1e6a078a.json";

let exegesisPromise: Promise<ExegesisPayload> | null = null;

export function canonicalExegesisKey(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function loadExegesisData() {
  if (!exegesisPromise) {
    exegesisPromise = fetch(EXEGESIS_DATA_URL).then(response => {
      if (!response.ok) throw new Error("Não foi possível carregar os comentários exegéticos.");
      return response.json() as Promise<ExegesisPayload>;
    });
  }
  return exegesisPromise;
}
