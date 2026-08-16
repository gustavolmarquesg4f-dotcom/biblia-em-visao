import type { DetailedBookReading, DetailedBookUnit } from "@/lib/detailed-book-readings";
import { staticAsset } from "@/lib/static-asset";

type RawCoreResult = { output?: { book?: string; overview?: string; units?: string } };
const CORE_BOOK_READINGS_URL = staticAsset("manus-storage/mapear_livros_centrais_bc56be6f.json");

function part(source: string, start: string, end?: string) {
  const at = source.indexOf(start);
  if (at < 0) return "";
  const tail = source.slice(at + start.length);
  const stop = end ? tail.indexOf(end) : -1;
  return (stop >= 0 ? tail.slice(0, stop) : tail).trim();
}

function parseCoreUnit(source: string): DetailedBookUnit {
  const [heading = "Unidade de leitura", ...bodyLines] = source.split("\n");
  const dash = heading.indexOf(" — ");
  const range = dash >= 0 ? heading.slice(0, dash).trim() : heading.trim();
  const title = dash >= 0 ? heading.slice(dash + 3).trim() : "Leitura guiada";
  const body = bodyLines.join(" ").replace(/\s+/g, " ").trim();
  const happens = part(body, "Narrativa:", "Importância:") || body;
  const meaning = part(body, "Importância:", "Entidades:") || "Esta unidade precisa ser lida dentro do argumento maior do livro, observando como a cena, o discurso ou a carta avança o tema central.";
  const observe = part(body, "Entidades:", "Conexões:") || "Observe personagens, lugares, expressões repetidas, imagens e decisões que conduzem o leitor para a próxima unidade.";
  return { range, title, happens, meaning, observe };
}

export async function loadCoreBookReadings(): Promise<Record<string, DetailedBookReading>> {
  const response = await fetch(CORE_BOOK_READINGS_URL);
  if (!response.ok) throw new Error("Não foi possível carregar o roteiro aprofundado dos livros centrais.");
  const payload = await response.json() as { results?: RawCoreResult[] };
  return Object.fromEntries((payload.results || []).flatMap(({ output }) => {
    if (!output?.book || !output.overview || !output.units) return [];
    const units = output.units.split(/\n\s*\n(?=[A-Za-zÀ-ÿ0-9])/).map(parseCoreUnit).filter((unit) => unit.happens.length > 0);
    return [[output.book, { book: output.book, overview: output.overview, units, methodNote: "Esta leitura acompanha unidades maiores do texto. Texto, contexto histórico e interpretação precisam ser distinguidos; conexões canônicas ajudam a continuar o estudo, mas não substituem a leitura do trecho." } satisfies DetailedBookReading]];
  }));
}
