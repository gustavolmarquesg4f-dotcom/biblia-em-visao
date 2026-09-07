import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  ChapterEditorialProfile,
  KnowledgeNode,
  KnowledgeRelation,
} from "@shared/knowledge-model";
import {
  loadChapterKnowledge,
  loadKnowledgeKind,
  normalizeKnowledgeSearch,
  rankKnowledgeNodes,
  resetKnowledgeRegistryCacheForTests,
} from "@/lib/knowledge-registry";

const nodes: KnowledgeNode[] = [
  {
    id: "person:paulo",
    kind: "person",
    label: "Paulo",
    aliases: ["Saulo"],
    summary: "Apóstolo e missionário no mundo mediterrâneo.",
    references: ["At 9", "Rm 1"],
    sourceCatalogs: ["biography-catalog"],
    maturity: "reviewed",
  },
  {
    id: "place:sao-paulo",
    kind: "place",
    label: "São Paulo",
    aliases: [],
    summary: "Entrada de teste para conferir acentos.",
    references: [],
    sourceCatalogs: ["test"],
    maturity: "available",
  },
  {
    id: "term:charis",
    kind: "term",
    label: "Charis",
    aliases: ["graça"],
    summary: "Favor e benevolência no vocabulário grego.",
    references: ["Ef 2:8"],
    sourceCatalogs: ["advanced-glossary"],
    maturity: "reviewed",
    attributes: { language: "Grego" },
  },
];

afterEach(() => {
  resetKnowledgeRegistryCacheForTests();
  vi.unstubAllGlobals();
});

describe("registro de conhecimento no cliente", () => {
  it("normaliza acentos e pontuação em português", () => {
    expect(normalizeKnowledgeSearch("  São-Paulo — Graça! ")).toBe(
      "sao paulo graca"
    );
  });

  it("prioriza correspondência exata de nome e também encontra aliases", () => {
    expect(rankKnowledgeNodes(nodes, "Paulo")[0].node.id).toBe("person:paulo");
    expect(rankKnowledgeNodes(nodes, "Saulo")[0].node.id).toBe("person:paulo");
    expect(rankKnowledgeNodes(nodes, "graca")[0].node.id).toBe("term:charis");
  });

  it("aplica filtros de tipo sem perder a busca sem acentos", () => {
    const result = rankKnowledgeNodes(nodes, "sao paulo", { kinds: ["place"] });
    expect(result.map(entry => entry.node.id)).toEqual(["place:sao-paulo"]);
  });

  it("carrega cada módulo uma única vez e reutiliza o cache", async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/manifest.json")) {
        return new Response(
          JSON.stringify({
            schemaVersion: 1,
            generatedBy: "test",
            nodeCount: 1,
            relationCount: 0,
            countsByKind: { person: 1 },
            files: { person: "people.json" },
            relationsFile: "relations.json",
          })
        );
      }
      if (url.endsWith("/people.json")) {
        return new Response(
          JSON.stringify({
            schemaVersion: 1,
            kind: "person",
            count: 1,
            nodes: [nodes[0]],
          })
        );
      }
      return new Response("not found", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const first = await loadKnowledgeKind("person");
    const second = await loadKnowledgeKind("person");

    expect(first).toEqual([nodes[0]]);
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("carrega as conexões do capítulo pelo arquivo pequeno do livro", async () => {
    const chapter: KnowledgeNode = {
      id: "chapter:atos:9",
      kind: "chapter",
      label: "Atos 9",
      aliases: ["At 9"],
      summary: "A conversão de Saulo.",
      references: ["At 9"],
      sourceCatalogs: ["chapter-coverage"],
      maturity: "expanded",
    };
    const relation: KnowledgeRelation = {
      id: "relation:appears-in:person-paulo:chapter-atos-9",
      from: "person:paulo",
      to: chapter.id,
      type: "appears-in",
      label: "aparece em",
      explanation: "O verbete cita At 9.",
      references: ["At 9"],
      sourceCatalog: "explicit-reference:biography-catalog",
      confidence: "high",
    };
    const editorialProfile: ChapterEditorialProfile = {
      chapterId: chapter.id,
      reference: "Atos 9",
      status: "connected",
      priority: "medium",
      editorialDepth: "Comentário textual enriquecido",
      structuralChecks: {
        fourLayers: true,
        source: true,
        cartography: true,
        canonicalDialogue: true,
        explicitConnections: true,
      },
      structuralScore: 5,
      connectionCount: 1,
      entityConnectionCount: 1,
      connectionKinds: ["person"],
      coveredDimensions: ["people"],
      pendingDimensions: ["scenes", "terms", "theology"],
      humanReview: {
        completed: false,
        reviewedAt: null,
        reviewedBy: [],
      },
    };
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/manifest.json")) {
        return new Response(
          JSON.stringify({
            schemaVersion: 1,
            generatedBy: "test",
            nodeCount: 2,
            relationCount: 1,
            countsByKind: { chapter: 1, person: 1 },
            files: { chapter: "chapters.json", person: "people.json" },
            relationsFile: "relations.json",
            chapterConnections: {
              relationCount: 1,
              chapterCount: 1,
              entityCount: 1,
              files: { atos: "chapter-connections/atos.json" },
            },
          })
        );
      }
      if (url.endsWith("/chapter-connections/atos.json")) {
        return new Response(
          JSON.stringify({
            schemaVersion: 1,
            book: "Atos",
            count: 1,
            chapterCount: 1,
            nodes: [nodes[0]],
            relations: [relation],
            editorialProfiles: [editorialProfile],
          })
        );
      }
      return new Response("not found", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const first = await loadChapterKnowledge(chapter.id);
    const second = await loadChapterKnowledge(chapter.id);

    expect(first?.relatedNodes.map(node => node.id)).toEqual(["person:paulo"]);
    expect(first?.relations).toEqual([relation]);
    expect(first?.editorialProfile).toEqual(editorialProfile);
    expect(second?.relatedNodes).toEqual(first?.relatedNodes);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).endsWith("/chapters.json")
      )
    ).toBe(false);
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).endsWith("/relations.json")
      )
    ).toBe(false);
  });
});
