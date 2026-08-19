// Acervo de Sinais Vivos: interpreta referências humanas e conserva o próximo destino de estudo no próprio dispositivo.
import { bibleBooks } from "@/lib/bible-data";

export type PassageIntent = { bookName: string; chapter?: number; verses?: string; original: string };

const aliases: Record<string, string> = {
  "gn": "Gênesis", "gen": "Gênesis", "genesis": "Gênesis", "ex": "Êxodo", "exodo": "Êxodo", "lv": "Levítico", "lev": "Levítico",
  "nm": "Números", "num": "Números", "dt": "Deuteronômio", "deut": "Deuteronômio", "js": "Josué", "jz": "Juízes", "rt": "Rute",
  "1sm": "1 Samuel", "2sm": "2 Samuel", "1rs": "1 Reis", "2rs": "2 Reis", "sl": "Salmos", "slm": "Salmos", "pv": "Provérbios",
  "is": "Isaías", "jr": "Jeremias", "ez": "Ezequiel", "dn": "Daniel", "os": "Oséias", "jl": "Joel", "am": "Amós",
  "mt": "Mateus", "mc": "Marcos", "lc": "Lucas", "jo": "João", "joao": "João", "at": "Atos", "rm": "Romanos", "rom": "Romanos",
  "1co": "1 Coríntios", "2co": "2 Coríntios", "gl": "Gálatas", "ef": "Efésios", "fp": "Filipenses", "cl": "Colossenses",
  "1ts": "1 Tessalonicenses", "2ts": "2 Tessalonicenses", "1tm": "1 Timóteo", "2tm": "2 Timóteo", "tt": "Tito", "hb": "Hebreus",
  "tg": "Tiago", "1pe": "1 Pedro", "2pe": "2 Pedro", "1jo": "1 João", "2jo": "2 João", "3jo": "3 João", "jd": "Judas",
  "ap": "Apocalipse", "apocalipse": "Apocalipse", "revelacao": "Apocalipse",
};

const normalize = (value: string) => value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\./g, "").trim();

export function parsePassageIntent(input: string): PassageIntent | null {
  const original = input.trim();
  const normalized = normalize(original).replace(/\s+/g, " ");
  if (!normalized) return null;
  const known = [...bibleBooks.map((book) => ({ key: normalize(book.name), name: book.name })), ...Object.entries(aliases).map(([key, name]) => ({ key, name }))].sort((a, b) => b.key.length - a.key.length);
  const candidate = known.find((item) => normalized === item.key || normalized.startsWith(`${item.key} `) || normalized.startsWith(`${item.key}:`));
  if (!candidate) return null;
  const rest = normalized.slice(candidate.key.length).trim().replace(/^[,;.:\s]+/, "");
  const match = rest.match(/^(\d+)?(?:\s*[:.,]\s*([\d,\-–]+))?/);
  const chapter = match?.[1] ? Number(match[1]) : undefined;
  const verses = match?.[2]?.replace("–", "-");
  return { bookName: candidate.name, chapter, verses, original };
}

const intentKey = "biblia-em-visao:passage-intent";
export function savePassageIntent(intent: PassageIntent) { window.sessionStorage.setItem(intentKey, JSON.stringify(intent)); }
export function takePassageIntent(): PassageIntent | null { try { const saved = window.sessionStorage.getItem(intentKey); window.sessionStorage.removeItem(intentKey); return saved ? JSON.parse(saved) as PassageIntent : null; } catch { return null; } }
