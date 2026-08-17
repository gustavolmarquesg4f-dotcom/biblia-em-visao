import assert from "node:assert/strict";
import {
  createStudyBackup,
  emptyStudyState,
  mergeStudyStates,
  parseStudyBackup,
} from "../client/src/lib/study-store.ts";

const original = {
  ...emptyStudyState(),
  notes: [{ id: "n1", targetId: "gen-1", targetLabel: "Gênesis 1", body: "Nota inicial", updatedAt: "2026-08-01T00:00:00.000Z" }],
  favorites: ["genesis"],
  completed: ["gen-1"],
  quizBest: { escatologia: 3 },
};

const exported = createStudyBackup(original);
const parsed = parseStudyBackup(JSON.stringify(exported));
assert.equal(parsed.ok, true, "O backup exportado deve ser reconhecido.");
if (!parsed.ok) throw new Error(parsed.message);
assert.equal(parsed.backup.state.notes[0].body, "Nota inicial");
assert.equal(parseStudyBackup("{\"kind\":\"wrong\"}").ok, false, "Arquivos estranhos devem ser rejeitados.");

const local = {
  ...emptyStudyState(),
  notes: [{ id: "n2", targetId: "gen-1", targetLabel: "Gênesis 1", body: "Nota mais recente", updatedAt: "2026-08-02T00:00:00.000Z" }],
  favorites: ["exodo"],
  quizBest: { escatologia: 5 },
};
const merged = mergeStudyStates(local, parsed.backup.state);
assert.equal(merged.notes.length, 1, "Notas do mesmo trecho devem ser mescladas.");
assert.equal(merged.notes[0].body, "Nota mais recente", "A nota mais recente deve prevalecer.");
assert.deepEqual(new Set(merged.favorites), new Set(["genesis", "exodo"]));
assert.equal(merged.quizBest.escatologia, 5, "A maior nota do quiz deve ser preservada.");

console.log("QA backup: exportação, validação e mesclagem aprovadas.");
