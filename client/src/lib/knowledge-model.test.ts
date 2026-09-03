import { describe, expect, it } from "vitest";

import {
  canonicalKnowledgeLabel,
  extractCanonicalChapterReferences,
  extractCanonicalBookNames,
  makeKnowledgeId,
  parseKnowledgeId,
  slugifyKnowledgeLabel,
  type CanonicalBookReference,
} from "@shared/knowledge-model";

const books: CanonicalBookReference[] = [
  { name: "Gênesis", short: "Gn", chapters: 50 },
  { name: "Oseias", short: "Os" },
  { name: "Naum", short: "Na" },
  { name: "João", short: "Jo", chapters: 21 },
  { name: "1 João", short: "1Jo" },
  { name: "2 Coríntios", short: "2Co" },
  { name: "1 Timóteo", short: "1Tm" },
];

describe("identificadores globais", () => {
  it("normaliza acentos e nomes alternativos", () => {
    expect(slugifyKnowledgeLabel("Atos dos Apóstolos")).toBe("atos");
    expect(makeKnowledgeId("chapter", "Gênesis", 22)).toBe(
      "chapter:genesis:22"
    );
  });

  it("remove a grafia original entre parênteses sem perder o nome", () => {
    expect(canonicalKnowledgeLabel("Moisés (מֹשֶׁה)")).toBe("Moisés");
    expect(makeKnowledgeId("person", "Moisés (מֹשֶׁה)")).toBe("person:moises");
  });

  it("valida a estrutura do identificador", () => {
    expect(parseKnowledgeId("person:abraao")).toEqual({
      kind: "person",
      parts: ["abraao"],
    });
    expect(parseKnowledgeId("desconhecido:abraao")).toBeNull();
  });
});

describe("extração de capítulos explícitos", () => {
  it("herda o livro depois de ponto e vírgula", () => {
    expect(
      extractCanonicalChapterReferences(["Gn 12:1–3; 15:1–6; 17:1"], books).map(
        ({ book, chapter }) => `${book} ${chapter}`
      )
    ).toEqual(["Gênesis 12", "Gênesis 15", "Gênesis 17"]);
  });

  it("distingue intervalo de capítulos de intervalo de versículos", () => {
    expect(
      extractCanonicalChapterReferences(
        ["Gn 1:1–2:3; Jo 13:1–17; Jo 14–16"],
        books
      ).map(({ book, chapter }) => `${book} ${chapter}`)
    ).toEqual([
      "Gênesis 1",
      "Gênesis 2",
      "João 13",
      "João 14",
      "João 15",
      "João 16",
    ]);
  });

  it("aceita capítulos repetidos após vírgula, mas ignora versículos soltos", () => {
    expect(
      extractCanonicalChapterReferences(
        ["Gn 4:1, 4:8, 4:10; Gn 5:2, 8, 9"],
        books
      ).map(({ book, chapter }) => `${book} ${chapter}`)
    ).toEqual(["Gênesis 4", "Gênesis 5"]);
  });

  it("não confunde Evangelho e cartas de João", () => {
    expect(
      extractCanonicalChapterReferences(["1 João 4:8; Jo 3:16"], books).map(
        ({ book, chapter }) => `${book} ${chapter}`
      )
    ).toEqual(["João 3", "1 João 4"]);
  });
});

describe("extração de referências bíblicas", () => {
  it("encontra mais de um livro em uma referência composta", () => {
    expect(
      extractCanonicalBookNames(["2 Coríntios 11:3; 1 Timóteo 2:13–15"], books)
    ).toEqual(["2 Coríntios", "1 Timóteo"]);
  });

  it("aceita abreviações quando seguidas por capítulo", () => {
    expect(extractCanonicalBookNames(["Gn 12:1–3; Os 12:3"], books)).toEqual([
      "Gênesis",
      "Oseias",
    ]);
  });

  it("não confunde palavras comuns com Oseias ou Naum", () => {
    expect(
      extractCanonicalBookNames(["Os discípulos estavam na cidade."], books)
    ).toEqual([]);
  });

  it("não confunde 1 João com o Evangelho de João", () => {
    expect(extractCanonicalBookNames(["1 João 4:8"], books)).toEqual([
      "1 João",
    ]);
  });
});
