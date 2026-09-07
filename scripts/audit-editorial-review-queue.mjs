import { readFileSync } from "node:fs";

const queue = JSON.parse(
  readFileSync("audit/editorial-review-queue.json", "utf8")
);
const validation = JSON.parse(
  readFileSync("audit/knowledge-registry-validation.json", "utf8")
);
const manifest = JSON.parse(
  readFileSync("client/public/data/knowledge/manifest.json", "utf8")
);

const total = Number(queue.summary?.chapters ?? 0);
const statusTotal = Object.values(queue.summary?.statusCounts ?? {}).reduce(
  (sum, value) => sum + Number(value),
  0
);
const priorityTotal = Object.values(queue.summary?.priorityCounts ?? {}).reduce(
  (sum, value) => sum + Number(value),
  0
);
const falseReviews = (queue.queue ?? []).filter(
  profile =>
    profile.status === "reviewed" && profile.humanReview?.completed !== true
);
const failures = [
  [total === 1189, `Esperados 1.189 perfis; encontrados ${total}.`],
  [statusTotal === total, "A soma dos estados editoriais está inconsistente."],
  [
    priorityTotal === total,
    "A soma das prioridades editoriais está inconsistente.",
  ],
  [
    falseReviews.length === 0,
    "Há capítulos marcados como revisados sem assinatura humana.",
  ],
  [
    validation.invariants?.editorialProfileForEveryChapter === true,
    "Nem todo capítulo recebeu perfil editorial.",
  ],
  [
    validation.invariants?.completeStructuralBaseline === true,
    "A linha de base estrutural não está completa.",
  ],
  [
    manifest.editorialReview?.chapterCount === total,
    "Manifesto e fila editorial divergem.",
  ],
  [
    queue.sourceReview?.biographiesMissingPrimarySource?.length ===
      queue.summary?.biographiesMissingPrimarySource,
    "A fila de fontes primárias das biografias está inconsistente.",
  ],
  [
    queue.sourceReview?.biographiesMissingVerifiedBooks?.length ===
      queue.summary?.biographiesMissingVerifiedBooks,
    "A fila de vínculos biográficos está inconsistente.",
  ],
  [
    queue.apocryphaReview?.length === 10,
    "A fila editorial não preservou as 10 entradas apócrifas/deuterocanônicas.",
  ],
].filter(([passed]) => !passed);

if (failures.length) {
  for (const [, message] of failures) console.error(`- ${message}`);
  process.exitCode = 1;
} else {
  console.log(
    `Fila editorial válida: ${total} capítulos; ${queue.summary.priorityCounts.high} prioritários; ${queue.summary.biographiesMissingPrimarySource} biografias sem fonte primária; ${queue.summary.humanReviewed} revisões humanas registradas.`
  );
}
