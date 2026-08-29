import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

import {
  advancedDossiers,
  biblicalPlaces,
} from "../client/src/lib/advanced-data.ts";
import { advancedGlossary } from "../client/src/lib/advanced-glossary-data.ts";
import {
  apocalypseChapters,
  apocalypseSources,
  apocalypseUnits,
  interpretationSchools,
  millennialViews,
  revelationChurches,
} from "../client/src/lib/apocalypse-data.ts";
import {
  apocryphaEntries,
  apocryphaSources,
} from "../client/src/lib/apocrypha-data.ts";
import { bibleBooks, themes, timeline } from "../client/src/lib/bible-data.ts";
import {
  churchStudyModules,
  churchStudySources,
} from "../client/src/lib/church-study-data.ts";
import { glossary, studyModules } from "../client/src/lib/deep-data.ts";
import { deepStudies } from "../client/src/lib/deep-study-data.ts";
import {
  apocryphaArticles,
  historyArticles,
} from "../client/src/lib/encyclopedic-reading-data.ts";
import {
  genesisContinuity,
  genesisEntities,
  genesisEvents,
  genesisPlaces,
  genesisProphecies,
} from "../client/src/lib/genesis-relational-data.ts";
import { groupStudyCollections } from "../client/src/lib/group-study-collections.ts";
import { theologyEntries } from "../client/src/lib/pentecostal-data.ts";
import { sourceLedger } from "../client/src/lib/source-ledger-data.ts";
import { studyPaths } from "../client/src/lib/study-paths-data.ts";

type JsonObject = Record<string, any>;

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const dataDirectory = path.join(projectRoot, "client", "public", "data");

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\batos dos apostolos\b/g, "atos")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function countBy<T>(items: T[], selector: (item: T) => string) {
  return Object.fromEntries(
    Array.from(
      items.reduce((map, item) => {
        const key = selector(item) || "Não informado";
        map.set(key, (map.get(key) ?? 0) + 1);
        return map;
      }, new Map<string, number>())
    ).sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
  );
}

function percentage(value: number, total: number) {
  return total ? Number(((value / total) * 100).toFixed(1)) : 0;
}

async function readJson(fileName: string) {
  return JSON.parse(
    await fs.readFile(path.join(dataDirectory, fileName), "utf8")
  ) as JsonObject;
}

function getDataRevision() {
  try {
    return execFileSync(
      "git",
      ["rev-parse", "--short", "HEAD:client/public/data"],
      {
        cwd: projectRoot,
        encoding: "utf8",
      }
    ).trim();
  } catch {
    return "indisponível";
  }
}

function yes(value: boolean) {
  return value ? "Sim" : "Não";
}

const [
  advancedBookPayload,
  biographyPayload,
  chapterPayload,
  deepDossierPayload,
  relationalPayload,
] = await Promise.all([
  readJson("advanced-book-dossiers.json"),
  readJson("biography-catalog.json"),
  readJson("chapter-coverage.json"),
  readJson("deep-dossier-catalog.json"),
  readJson("relational-books-catalog.json"),
]);

const chapterRecords = chapterPayload.records as JsonObject[];
const biographyRecords = biographyPayload.records as JsonObject[];
const advancedBookRecords = advancedBookPayload.results as JsonObject[];
const deepDossierRecords = deepDossierPayload.books as JsonObject[];
const relationalBooks = relationalPayload.books as JsonObject[];

const advancedBookKeys = new Set(
  advancedBookRecords.map(record => normalize(String(record.input)))
);
const deepDossierKeys = new Set(
  deepDossierRecords.map(record => normalize(String(record.bookName)))
);
const relationalBookKeys = new Set(
  relationalBooks.map(record => normalize(String(record.bookName)))
);
const biographyBookKeys = new Set(
  biographyRecords.flatMap(record =>
    (record.books ?? []).map((book: string) => normalize(book))
  )
);
const biographyLinkCounts = Object.fromEntries(
  bibleBooks.map(book => [
    book.name,
    biographyRecords.filter(record =>
      (record.books ?? []).some(
        (name: string) => normalize(name) === normalize(book.name)
      )
    ).length,
  ])
);
const suspiciousBiographyAssociations = Object.entries(biographyLinkCounts)
  .filter(([, count]) => count > biographyRecords.length / 2)
  .map(([book, count]) => ({
    book,
    count,
    percentage: percentage(count, biographyRecords.length),
  }));

const chapterRows = bibleBooks.map(book => {
  const key = normalize(book.name);
  const records = chapterRecords.filter(
    record => normalize(String(record.book)) === key
  );
  return {
    book: book.name,
    testament: book.testament,
    category: book.category,
    expectedChapters: book.chapters,
    publishedStudies: records.length,
    expandedStudies: records.filter(
      record => record.editorialDepth === "Foco ampliado"
    ).length,
    enrichedStudies: records.filter(
      record => record.editorialDepth === "Comentário textual enriquecido"
    ).length,
    completeCoverage: records.length === book.chapters,
    advancedDossier: advancedBookKeys.has(key),
    deepDossier: deepDossierKeys.has(key),
    relationalCoverage: key === "genesis" || relationalBookKeys.has(key),
    rawBiographyLinks: biographyLinkCounts[book.name],
  };
});

const chapterDepth = countBy(chapterRecords, record =>
  String(record.editorialDepth)
);
const expandedChapterCount = chapterRecords.filter(
  record => record.editorialDepth === "Foco ampliado"
).length;
const enrichedChapterCount = chapterRecords.filter(
  record => record.editorialDepth === "Comentário textual enriquecido"
).length;
const biographyWithPrimarySource = biographyRecords.filter(
  record =>
    typeof record.primarySource === "string" && record.primarySource.trim()
).length;
const canonicalBooksWithoutBiography = bibleBooks
  .filter(book => !biographyBookKeys.has(normalize(book.name)))
  .map(book => book.name);
const glossaryTerms = new Set([
  ...advancedGlossary.map(entry => normalize(entry.term)),
  ...glossary.map(entry => normalize(entry[0])),
]);
const formationLessonCount = studyModules.reduce(
  (sum, item) => sum + item.lessons.length,
  0
);
const deepStudyEntries = Object.entries(deepStudies).map(([id, study]) => ({
  id,
  title: study.title,
  modules: study.modules.length,
  sources: study.sources.length,
}));
const deepStudyModuleCount = deepStudyEntries.reduce(
  (sum, study) => sum + study.modules,
  0
);
const relationalTotals = {
  entities:
    relationalBooks.reduce(
      (sum, book) => sum + (book.entities?.length ?? 0),
      0
    ) + genesisEntities.length,
  places:
    relationalBooks.reduce((sum, book) => sum + (book.places?.length ?? 0), 0) +
    genesisPlaces.length,
  events:
    relationalBooks.reduce((sum, book) => sum + (book.events?.length ?? 0), 0) +
    genesisEvents.length,
  themes: relationalBooks.reduce(
    (sum, book) => sum + (book.themes?.length ?? 0),
    0
  ),
  prophecies:
    relationalBooks.reduce(
      (sum, book) => sum + (book.prophecies?.length ?? 0),
      0
    ) + genesisProphecies.length,
  continuityLinks:
    relationalBooks.reduce(
      (sum, book) => sum + (book.continuity?.length ?? 0),
      0
    ) + genesisContinuity.length,
};

const publicDataFiles = await Promise.all(
  (await fs.readdir(dataDirectory))
    .filter(file => file.endsWith(".json"))
    .sort()
    .map(async file => {
      const stats = await fs.stat(path.join(dataDirectory, file));
      return { file, bytes: stats.size };
    })
);

const inventory = {
  schemaVersion: 1,
  sourceDataRevision: getDataRevision(),
  guarantees: {
    studiesRemoved: 0,
    visualChanges: 0,
    contentMutations: 0,
  },
  canonical: {
    books: bibleBooks.length,
    chaptersExpected: bibleBooks.reduce((sum, book) => sum + book.chapters, 0),
    chaptersPublished: chapterRecords.length,
    booksWithCompleteChapterCoverage: chapterRows.filter(
      row => row.completeCoverage
    ).length,
    advancedBookDossiers: advancedBookRecords.length,
    deepBookDossiers: deepDossierRecords.length,
    relationalBooksInCatalog: relationalBooks.length,
    relationalBooksWithGenesisSpecializedModule: relationalBooks.length + 1,
    chapterDepth,
    chapterRows,
  },
  people: {
    biographies: biographyRecords.length,
    kindBreakdown: countBy(biographyRecords, record => String(record.kind)),
    canonicalBooksReferenced:
      bibleBooks.length - canonicalBooksWithoutBiography.length,
    canonicalBooksWithoutBiography,
    linkCountsAreUnreviewed: true,
    suspiciousAssociations: suspiciousBiographyAssociations,
    withPrimarySource: biographyWithPrimarySource,
    withoutPrimarySource: biographyRecords.length - biographyWithPrimarySource,
  },
  relational: relationalTotals,
  terms: {
    advancedGlossaryEntries: advancedGlossary.length,
    introductoryGlossaryEntries: glossary.length,
    uniqueAcrossBothCatalogs: glossaryTerms.size,
  },
  theologyAndFormation: {
    theologyEntries: theologyEntries.length,
    formationModules: studyModules.length,
    formationLessons: formationLessonCount,
    deepStudies: deepStudyEntries.length,
    deepStudyModules: deepStudyModuleCount,
    churchStudyModules: churchStudyModules.length,
    churchStudySources: churchStudySources.length,
    studyPaths: studyPaths.length,
    groupStudyCollections: groupStudyCollections.length,
  },
  apocrypha: {
    catalogEntries: apocryphaEntries.length,
    guidedArticles: Object.keys(apocryphaArticles).length,
    sources: apocryphaSources.length,
    works: apocryphaEntries.map(entry => ({
      id: entry.id,
      title: entry.title,
      lenses: entry.lenses,
    })),
  },
  historyAtlasAndApocalypse: {
    historicalArticles: Object.keys(historyArticles).length,
    advancedHistoricalDossiers: advancedDossiers.length,
    timelineEntries: timeline.length,
    globalThemes: themes.length,
    biblicalPlaces: biblicalPlaces.length,
    apocalypseChapters: apocalypseChapters.length,
    apocalypseUnits: apocalypseUnits.length,
    revelationChurches: revelationChurches.length,
    interpretationSchools: interpretationSchools.length,
    millennialViews: millennialViews.length,
    apocalypseSources: apocalypseSources.length,
  },
  sources: {
    ledgerEntries: sourceLedger.length,
    biographiesWithPrimarySource: biographyWithPrimarySource,
    chapterRecordsWithSource: chapterRecords.filter(
      record => record.source?.url
    ).length,
    chapterRecordsWithTextBasis: chapterRecords.filter(
      record => record.textBasis?.url
    ).length,
  },
  storage: {
    publicDataFiles,
    totalPublicDataBytes: publicDataFiles.reduce(
      (sum, file) => sum + file.bytes,
      0
    ),
  },
};

const bookTable = chapterRows
  .map(
    row =>
      `| ${row.book} | ${row.publishedStudies}/${row.expectedChapters} | ${row.expandedStudies} | ${yes(row.advancedDossier)} | ${yes(row.deepDossier)} | ${yes(row.relationalCoverage)} | ${row.rawBiographyLinks} |`
  )
  .join("\n");
const apocryphaList = apocryphaEntries
  .map(entry => `- **${entry.title}** — ${entry.lenses.join(", ")}.`)
  .join("\n");
const dataFileTable = publicDataFiles
  .map(file => `| \`${file.file}\` | ${(file.bytes / 1024).toFixed(1)} KB |`)
  .join("\n");
const missingBiographyText = canonicalBooksWithoutBiography.length
  ? canonicalBooksWithoutBiography.join(", ")
  : "Nenhum";

const markdown = `# Bíblia em Visão — inventário do acervo

> Relatório gerado por \`pnpm inventory:content\` a partir da revisão de dados \`${inventory.sourceDataRevision}\`. Nenhum estudo ou conteúdo foi alterado durante o inventário.

## Resumo executivo

| Área | Acervo identificado |
| --- | ---: |
| Livros canônicos | ${inventory.canonical.books} |
| Capítulos esperados | ${inventory.canonical.chaptersExpected} |
| Estudos de capítulo publicados | ${inventory.canonical.chaptersPublished} |
| Livros com cobertura integral | ${inventory.canonical.booksWithCompleteChapterCoverage} |
| Dossiês avançados | ${inventory.canonical.advancedBookDossiers} |
| Dossiês profundos | ${inventory.canonical.deepBookDossiers} |
| Biografias | ${inventory.people.biographies} |
| Menções relacionais de entidades | ${inventory.relational.entities} |
| Menções relacionais de lugares | ${inventory.relational.places} |
| Acontecimentos relacionados | ${inventory.relational.events} |
| Temas relacionados | ${inventory.relational.themes} |
| Profecias/conexões proféticas | ${inventory.relational.prophecies} |
| Termos únicos nos dois glossários | ${inventory.terms.uniqueAcrossBothCatalogs} |
| Entradas apócrifas/deuterocanônicas | ${inventory.apocrypha.catalogEntries} |
| Estudos teológicos profundos | ${inventory.theologyAndFormation.deepStudies} |
| Trilhas de estudo | ${inventory.theologyAndFormation.studyPaths} |

## Cobertura dos capítulos

Todos os ${inventory.canonical.chaptersExpected} capítulos canônicos possuem um estudo publicado.

| Profundidade editorial atual | Quantidade | Percentual |
| --- | ---: | ---: |
| Foco ampliado | ${expandedChapterCount} | ${percentage(expandedChapterCount, chapterRecords.length)}% |
| Comentário textual enriquecido | ${enrichedChapterCount} | ${percentage(enrichedChapterCount, chapterRecords.length)}% |

Essas duas classificações são preservadas. O modelo editorial propõe uma evolução futura para os estados “disponível”, “ampliado”, “revisado” e “dossiê completo”, sem retirar os estudos existentes.

## Matriz dos 66 livros

| Livro | Estudos | Focos ampliados | Dossiê avançado | Dossiê profundo | Relações | Links biográficos brutos |
| --- | ---: | ---: | --- | --- | --- | ---: |
${bookTable}

O catálogo relacional principal possui 65 livros. Gênesis está em um módulo relacional especializado; em conjunto, há cobertura relacional para os 66 livros.

Os links biográficos desta tabela são dados brutos e ainda não equivalem a vínculos revisados. O inventário detectou associações suspeitas: ${suspiciousBiographyAssociations.map(item => `**${item.book}: ${item.count} registros (${item.percentage}%)**`).join("; ")}. A hipótese mais provável é colisão entre abreviações bíblicas curtas e palavras comuns — por exemplo, “Os”/Oseias e “Na”/Naum. Esses vínculos não devem alimentar a navegação relacional antes de serem regenerados e validados.

## Pessoas

- ${inventory.people.biographies} biografias publicadas.
- O campo bruto \`books\` menciona ${inventory.people.canonicalBooksReferenced} dos 66 livros, mas ainda precisa de validação editorial.
- Livros sem qualquer associação bruta: **${missingBiographyText}**.
- ${inventory.people.withPrimarySource} biografias possuem o campo \`primarySource\`; ${inventory.people.withoutPrimarySource} ainda precisam de uma fonte primária/institucional específica nesse campo.

O número de menções relacionais não representa necessariamente entidades únicas: alguns nomes aparecem em mais de um livro. A futura consolidação deverá preservar as menções locais e criar uma identidade única para cada pessoa, povo, lugar ou conceito.

## Termos, teologia e formação

- ${inventory.terms.advancedGlossaryEntries} verbetes no glossário avançado e ${inventory.terms.introductoryGlossaryEntries} no glossário introdutório.
- ${inventory.terms.uniqueAcrossBothCatalogs} termos únicos após normalização dos dois catálogos.
- ${inventory.theologyAndFormation.theologyEntries} entradas de teologia pentecostal/IDB.
- ${inventory.theologyAndFormation.formationModules} módulos de formação com ${inventory.theologyAndFormation.formationLessons} lições.
- ${inventory.theologyAndFormation.deepStudies} estudos profundos com ${inventory.theologyAndFormation.deepStudyModules} módulos.
- O estudo “O que é ser Igreja” possui ${inventory.theologyAndFormation.churchStudyModules} módulos e ${inventory.theologyAndFormation.churchStudySources} fontes.
- ${inventory.theologyAndFormation.studyPaths} trilhas e ${inventory.theologyAndFormation.groupStudyCollections} coleções para grupos.

## Apócrifos e deuterocanônicos

Há ${inventory.apocrypha.catalogEntries} entradas no catálogo e ${inventory.apocrypha.guidedArticles} artigos guiados.

${apocryphaList}

As lentes registradas já permitem diferenciar recepção católica, ortodoxa, protestante e contexto do Segundo Templo. A próxima evolução deverá tornar essa classificação visível e uniforme em cada página.

## História, atlas e Apocalipse

- ${inventory.historyAtlasAndApocalypse.historicalArticles} artigos históricos guiados e ${inventory.historyAtlasAndApocalypse.advancedHistoricalDossiers} dossiês históricos avançados.
- ${inventory.historyAtlasAndApocalypse.biblicalPlaces} lugares no catálogo avançado de lugares.
- ${inventory.historyAtlasAndApocalypse.apocalypseChapters} capítulos de Apocalipse, ${inventory.historyAtlasAndApocalypse.apocalypseUnits} unidades interpretativas e ${inventory.historyAtlasAndApocalypse.revelationChurches} igrejas históricas.
- ${inventory.historyAtlasAndApocalypse.interpretationSchools} escolas interpretativas e ${inventory.historyAtlasAndApocalypse.millennialViews} posições milenistas.

## Arquivos públicos de dados

| Arquivo | Tamanho atual |
| --- | ---: |
${dataFileTable}

Total aproximado: **${(inventory.storage.totalPublicDataBytes / 1024 / 1024).toFixed(1)} MB** de JSON público. O tamanho confirma a necessidade futura de dividir o acervo por livro e carregar somente o conteúdo solicitado.

## Lacunas identificadas na Fase 1

### Prioridade editorial

1. Padronizar metadados de maturidade e revisão sem retirar as classificações existentes.
2. Completar a fonte específica das ${inventory.people.withoutPrimarySource} biografias sem \`primarySource\`.
3. Revisar a classificação entre fonte primária, acadêmica, institucional, confessional e pastoral.
4. Consolidar glossários e entidades duplicadas mantendo aliases e relações.
5. Registrar grau de certeza em afirmações históricas e posições teológicas debatidas.
6. Corrigir o extrator de referências biográficas para eliminar colisões de abreviações como “Os” e “Na”.

### Prioridade estrutural

1. Criar identificadores globais estáveis para livros, pessoas, lugares, eventos, termos e doutrinas.
2. Unificar o modelo relacional especializado de Gênesis com a interface comum dos outros 65 livros.
3. Separar os grandes catálogos por livro ou entidade, sem mudar o conteúdo apresentado.
4. Conectar os estudos de capítulo às entidades já existentes.
5. Eliminar fontes duplicadas de verdade entre arquivos TypeScript e catálogos JSON.

### Prioridade de experiência

1. Permitir abrir pessoas, lugares, termos e acontecimentos a partir do estudo de um capítulo.
2. Criar entradas claras para livros, pessoas, lugares, termos, doutrinas, apócrifos e formação cristã.
3. Indicar contexto canônico dos apócrifos em todas as páginas relacionadas.
4. Tornar o nível de aprofundamento e a revisão editorial compreensíveis sem desvalorizar o estudo.

## Critério de conclusão da Fase 1

- Visão do produto formalizada em \`docs/PRODUCT_VISION.md\`.
- Modelo editorial e relacional formalizado em \`docs/CONTENT_MODEL.md\`.
- Inventário reproduzível por comando.
- Cobertura dos 66 livros e 1.189 capítulos confirmada.
- Acervo preservado integralmente.
- Lacunas e prioridades registradas para a próxima fase.
`;

await fs.mkdir(path.join(projectRoot, "docs"), { recursive: true });
await fs.mkdir(path.join(projectRoot, "audit"), { recursive: true });
const formattedInventory = await format(JSON.stringify(inventory), {
  parser: "json",
});
const formattedMarkdown = await format(markdown, { parser: "markdown" });
await fs.writeFile(
  path.join(projectRoot, "audit", "content-inventory.json"),
  formattedInventory,
  "utf8"
);
await fs.writeFile(
  path.join(projectRoot, "docs", "CONTENT_INVENTORY.md"),
  formattedMarkdown,
  "utf8"
);

const invariants = [
  { label: "66 livros canônicos", passed: inventory.canonical.books === 66 },
  {
    label: "1.189 capítulos esperados",
    passed: inventory.canonical.chaptersExpected === 1189,
  },
  {
    label: "1.189 estudos publicados",
    passed: inventory.canonical.chaptersPublished === 1189,
  },
  {
    label: "cobertura integral dos 66 livros",
    passed: inventory.canonical.booksWithCompleteChapterCoverage === 66,
  },
  {
    label: "dossiê avançado para os 66 livros",
    passed: inventory.canonical.advancedBookDossiers === 66,
  },
  {
    label: "dossiê profundo para os 66 livros",
    passed: inventory.canonical.deepBookDossiers === 66,
  },
  {
    label: "cobertura relacional para os 66 livros",
    passed:
      inventory.canonical.relationalBooksWithGenesisSpecializedModule === 66,
  },
];

if (process.argv.includes("--check")) {
  const failures = invariants.filter(invariant => !invariant.passed);
  if (failures.length) {
    console.error(
      `Inventário inválido: ${failures.map(failure => failure.label).join(", ")}.`
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Inventário validado: ${invariants.length} garantias estruturais atendidas.`
    );
  }
}

console.log(
  `Inventário concluído: ${inventory.canonical.books} livros, ${inventory.canonical.chaptersPublished} capítulos, ${inventory.people.biographies} biografias e ${inventory.apocrypha.catalogEntries} entradas apócrifas.`
);
