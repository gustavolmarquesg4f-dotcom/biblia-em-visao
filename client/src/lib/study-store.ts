// Cartografia de Leituras: persistência local-first para uma mesa de estudo honesta e portátil.

export type StudyNote = {
  id: string;
  targetId: string;
  targetLabel: string;
  body: string;
  updatedAt: string;
};

export type StudyCollection = {
  id: string;
  name: string;
  itemIds: string[];
};

export type StudyState = {
  notes: StudyNote[];
  favorites: string[];
  completed: string[];
  quizBest: Record<string, number>;
  collections: StudyCollection[];
};

export const STUDY_STORAGE_KEY = "biblia-em-visao-study-v1";
export const STUDY_BACKUP_VERSION = 1;

export type StudyBackup = {
  app: "A Bíblia em Visão Geral";
  kind: "study-backup";
  version: typeof STUDY_BACKUP_VERSION;
  exportedAt: string;
  state: StudyState;
};

export const emptyStudyState = (): StudyState => ({ notes: [], favorites: [], completed: [], quizBest: {}, collections: [{ id: "pesquisa-aberta", name: "Pesquisa aberta", itemIds: [] }] });

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function stringList(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function validNotes(value: unknown): StudyNote[] { return Array.isArray(value) ? value.filter((note): note is StudyNote => isRecord(note) && typeof note.id === "string" && typeof note.targetId === "string" && typeof note.targetLabel === "string" && typeof note.body === "string" && typeof note.updatedAt === "string") : []; }
function validCollections(value: unknown): StudyCollection[] { return Array.isArray(value) ? value.filter((collection): collection is StudyCollection => isRecord(collection) && typeof collection.id === "string" && typeof collection.name === "string" && Array.isArray(collection.itemIds)).map(collection => ({ ...collection, itemIds: stringList(collection.itemIds) })) : []; }
function validQuizBest(value: unknown): Record<string, number> { if (!isRecord(value)) return {}; return Object.entries(value).reduce<Record<string, number>>((acc, [key, score]) => { if (typeof score === "number" && Number.isFinite(score) && score >= 0) acc[key] = score; return acc; }, {}); }

export function normalizeStudyState(value: unknown): StudyState {
  if (!isRecord(value)) return emptyStudyState();
  const collections = validCollections(value.collections);
  return { notes: validNotes(value.notes), favorites: stringList(value.favorites), completed: stringList(value.completed), quizBest: validQuizBest(value.quizBest), collections: collections.length ? collections : emptyStudyState().collections };
}

export function readStudyState(): StudyState {
  if (typeof window === "undefined") return emptyStudyState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STUDY_STORAGE_KEY) || "null") as unknown;
    return normalizeStudyState(parsed);
  } catch {
    return emptyStudyState();
  }
}

export function writeStudyState(state: StudyState) {
  if (typeof window !== "undefined") window.localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(state));
}

export function upsertNote(state: StudyState, targetId: string, targetLabel: string, body: string): StudyState {
  const nextNotes = state.notes.filter(note => note.targetId !== targetId);
  if (body.trim()) nextNotes.unshift({ id: `${targetId}-${Date.now()}`, targetId, targetLabel, body: body.trim(), updatedAt: new Date().toISOString() });
  return { ...state, notes: nextNotes };
}

export function createStudyBackup(state: StudyState): StudyBackup { return { app: "A Bíblia em Visão Geral", kind: "study-backup", version: STUDY_BACKUP_VERSION, exportedAt: new Date().toISOString(), state: normalizeStudyState(state) }; }

export function parseStudyBackup(raw: string): { ok: true; backup: StudyBackup } | { ok: false; message: string } {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.app !== "A Bíblia em Visão Geral" || parsed.kind !== "study-backup") return { ok: false, message: "Este arquivo não é um backup reconhecido da Bíblia em Visão Geral." };
    if (parsed.version !== STUDY_BACKUP_VERSION) return { ok: false, message: "A versão deste backup não é compatível com esta mesa de estudo." };
    if (typeof parsed.exportedAt !== "string" || !Number.isFinite(Date.parse(parsed.exportedAt))) return { ok: false, message: "A data de exportação deste backup é inválida." };
    return { ok: true, backup: { app: "A Bíblia em Visão Geral", kind: "study-backup", version: STUDY_BACKUP_VERSION, exportedAt: parsed.exportedAt, state: normalizeStudyState(parsed.state) } };
  } catch { return { ok: false, message: "Não foi possível ler este arquivo JSON." }; }
}

export function mergeStudyStates(current: StudyState, incoming: StudyState): StudyState {
  const notes = new Map<string, StudyNote>();
  for (const note of [...current.notes, ...incoming.notes]) { const existing = notes.get(note.targetId); if (!existing || Date.parse(note.updatedAt) >= Date.parse(existing.updatedAt)) notes.set(note.targetId, note); }
  const collections = new Map<string, StudyCollection>();
  for (const collection of [...current.collections, ...incoming.collections]) { const existing = collections.get(collection.id); collections.set(collection.id, existing ? { ...existing, name: collection.name || existing.name, itemIds: Array.from(new Set([...existing.itemIds, ...collection.itemIds])) } : collection); }
  const quizBest = { ...current.quizBest };
  for (const [quizId, score] of Object.entries(incoming.quizBest)) quizBest[quizId] = Math.max(quizBest[quizId] || 0, score);
  return normalizeStudyState({ notes: Array.from(notes.values()).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)), favorites: Array.from(new Set([...current.favorites, ...incoming.favorites])), completed: Array.from(new Set([...current.completed, ...incoming.completed])), quizBest, collections: Array.from(collections.values()) });
}
