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

export const emptyStudyState = (): StudyState => ({ notes: [], favorites: [], completed: [], quizBest: {}, collections: [{ id: "pesquisa-aberta", name: "Pesquisa aberta", itemIds: [] }] });

export function readStudyState(): StudyState {
  if (typeof window === "undefined") return emptyStudyState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STUDY_STORAGE_KEY) || "null") as Partial<StudyState> | null;
    if (!parsed) return emptyStudyState();
    return { ...emptyStudyState(), ...parsed, notes: Array.isArray(parsed.notes) ? parsed.notes : [], favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [], completed: Array.isArray(parsed.completed) ? parsed.completed : [], quizBest: parsed.quizBest || {}, collections: Array.isArray(parsed.collections) && parsed.collections.length ? parsed.collections : emptyStudyState().collections };
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
