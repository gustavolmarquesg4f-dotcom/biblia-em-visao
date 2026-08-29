import { describe, expect, it } from "vitest";

import {
  canonicalKnowledgeLabel,
  extractCanonicalBookNames,
  makeKnowledgeId,
  parseKnowledgeId,
  slugifyKnowledgeLabel,
  type CanonicalBookReference,
} from "@shared/knowledge-model";

const books: CanonicalBookReference[] = [
  { name: "Gênesis", short: "Gn" },
  { name: "Oseias", short: "Os" },
  { name: "Naum", short: "Na" },
  { name: "João", short: "Jo" },
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
