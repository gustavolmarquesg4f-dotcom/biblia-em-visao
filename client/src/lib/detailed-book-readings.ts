import type { CloseReadingFrame } from "@/lib/close-reading-frames";
import { staticAsset } from "@/lib/static-asset";

export type DetailedBookUnit = {
  range: string;
  title: string;
  happens: string;
  meaning: string;
  observe: string;
};

export type DetailedBookReading = {
  book: string;
  overview: string;
  units: DetailedBookUnit[];
  methodNote: string;
};

type RawResult = {
  output?: {
    book?: string;
    overview?: string;
    unit_one?: string;
    unit_two?: string;
    unit_three?: string;
    unit_four?: string;
    method_note?: string;
  };
};

const DETAILED_BOOK_READINGS_URL = staticAsset("manus-storage/redigir_unidades_enciclopedicas_66_7bc9c936.json");

function section(source: string, start: string, end?: string) {
  const from = source.indexOf(start);
  if (from < 0) return "";
  const slice = source.slice(from + start.length);
  const to = end ? slice.indexOf(end) : -1;
  return (to >= 0 ? slice.slice(0, to) : slice).trim();
}

function parseUnit(source: string): DetailedBookUnit {
  const marker = ". O que acontece:";
  const splitAt = source.indexOf(marker);
  const heading = splitAt >= 0 ? source.slice(0, splitAt) : source;
  const dash = heading.indexOf(" — ");
  const range = dash >= 0 ? heading.slice(0, dash).trim() : "Unidade de leitura";
  const title = dash >= 0 ? heading.slice(dash + 3).trim() : heading.trim();
  const happens = section(source, "O que acontece:", "O que significa:") || source;
  const meaning = section(source, "O que significa:", "O que observar:") || "Leia esta parte dentro do movimento maior do livro.";
  const observe = section(source, "O que observar:") || "Observe palavras repetidas, personagens, cenário e conexões com as outras partes do livro.";
  return { range, title, happens, meaning, observe };
}

export function framesForDetailedBook(reading: DetailedBookReading): CloseReadingFrame[] {
  return reading.units.map((unit) => ({
    range: unit.range,
    title: unit.title,
    question: "O que acontece aqui, o que a unidade quer comunicar e quais detalhes precisam de atenção?",
    bodyLabel: "O que acontece nesta parte",
  }));
}

export async function loadDetailedBookReadings(): Promise<Record<string, DetailedBookReading>> {
  const response = await fetch(DETAILED_BOOK_READINGS_URL);
  if (!response.ok) throw new Error("Não foi possível carregar o corpus detalhado dos livros.");
  const payload = await response.json() as { results?: RawResult[] };
  return Object.fromEntries((payload.results || []).flatMap(({ output }) => {
    if (!output?.book || !output.overview) return [];
    const unitSources = [output.unit_one, output.unit_two, output.unit_three, output.unit_four].filter((unit): unit is string => typeof unit === "string");
    const units = unitSources.map(parseUnit);
    return [[output.book, { book: output.book, overview: output.overview, units, methodNote: output.method_note || "Leia o texto, o contexto e as interpretações como camadas relacionadas, não como a mesma coisa." } satisfies DetailedBookReading]];
  }));
}
