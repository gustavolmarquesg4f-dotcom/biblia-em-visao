import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  FileText,
  Landmark,
  LibraryBig,
  MapPin,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import type { KnowledgeKind, KnowledgeNode } from "@shared/knowledge-model";
import { bibleBooks, type Book } from "@/lib/bible-data";
import {
  knowledgeKindLabels,
  loadAllKnowledgeNodes,
  loadKnowledgeManifest,
  maturityLabels,
  rankKnowledgeNodes,
  type KnowledgeManifest,
} from "@/lib/knowledge-registry";
import { bookFromEntityReference } from "@/lib/entity-graph";
import { questionGuides } from "@/lib/question-guides";
import "@/entity-network.css";
import "@/question-search.css";
import "@/knowledge-registry.css";

type Props = {
  openBook?: (book: Book) => void;
  onOpenEntity: (entityId: string) => void;
  onFocusPlace: (placeId: string) => void;
};

type FilterId =
  | "all"
  | "people"
  | "places"
  | "books"
  | "chapters"
  | "events"
  | "ideas"
  | "apocrypha";

const filters: Array<{ id: FilterId; label: string; kinds?: KnowledgeKind[] }> =
  [
    { id: "all", label: "Tudo" },
    {
      id: "people",
      label: "Pessoas e povos",
      kinds: ["person", "people-group"],
    },
    { id: "places", label: "Lugares", kinds: ["place"] },
    { id: "books", label: "Livros", kinds: ["book"] },
    { id: "chapters", label: "Capítulos", kinds: ["chapter"] },
    { id: "events", label: "Acontecimentos", kinds: ["event"] },
    {
      id: "ideas",
      label: "Temas e termos",
      kinds: ["theme", "prophecy", "term", "doctrine"],
    },
    { id: "apocrypha", label: "Apócrifos", kinds: ["apocryphal-work"] },
  ];

const kindOrder: KnowledgeKind[] = [
  "book",
  "chapter",
  "person",
  "people-group",
  "place",
  "event",
  "theme",
  "prophecy",
  "term",
  "doctrine",
  "apocryphal-work",
  "formation-study",
];

function iconFor(kind: KnowledgeKind) {
  if (kind === "book" || kind === "chapter") return BookOpen;
  if (kind === "person") return UserRound;
  if (kind === "people-group") return UsersRound;
  if (kind === "place") return MapPin;
  if (kind === "event") return Landmark;
  if (kind === "apocryphal-work") return LibraryBig;
  if (kind === "term" || kind === "doctrine") return FileText;
  return Sparkles;
}

function cleanSnippet(value: string) {
  return value
    .replace(/\*{1,2}|_{1,2}|`/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function groupLabel(kind: KnowledgeKind) {
  if (kind === "person" || kind === "people-group") return "Pessoas e povos";
  if (kind === "theme" || kind === "prophecy") return "Temas e profecias";
  if (kind === "term" || kind === "doctrine") return "Termos e doutrinas";
  return knowledgeKindLabels[kind];
}

export default function KnowledgeSearchPanel({
  openBook,
  onOpenEntity,
}: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [manifest, setManifest] = useState<KnowledgeManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([loadKnowledgeManifest(), loadAllKnowledgeNodes()])
      .then(([nextManifest, nextNodes]) => {
        if (!active) return;
        setManifest(nextManifest);
        setNodes(nextNodes);
        setError(null);
      })
      .catch(() => {
        if (active)
          setError("O índice completo não pôde ser carregado nesta conexão.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const activeFilter = filters.find(item => item.id === filter) ?? filters[0];
  const ranked = useMemo(
    () =>
      rankKnowledgeNodes(nodes, deferredQuery, {
        kinds: activeFilter.kinds,
        limit: 120,
      }),
    [activeFilter.kinds, deferredQuery, nodes]
  );
  const groups = useMemo(() => {
    const grouped = new Map<string, KnowledgeNode[]>();
    for (const { node } of ranked) {
      const label = groupLabel(node.kind);
      grouped.set(label, [...(grouped.get(label) ?? []), node]);
    }
    return Array.from(grouped.entries()).sort(
      ([left], [right]) =>
        kindOrder.indexOf(
          ranked.find(entry => groupLabel(entry.node.kind) === left)?.node
            .kind ?? "book"
        ) -
        kindOrder.indexOf(
          ranked.find(entry => groupLabel(entry.node.kind) === right)?.node
            .kind ?? "book"
        )
    );
  }, [ranked]);
  const normalizedQuestion = query.toLocaleLowerCase("pt-BR");
  const questionMatch = questionGuides.find(guide =>
    guide.keywords.some(keyword => normalizedQuestion.includes(keyword))
  );

  const openNode = (node: KnowledgeNode) => {
    if (node.kind === "book") {
      const book = bookFromEntityReference(node.label);
      if (book) openBook?.(book);
      return;
    }
    onOpenEntity(node.id);
  };
  const openQuestionBook = () => {
    const book = bibleBooks.find(item => item.name === questionMatch?.book);
    if (book) openBook?.(book);
  };

  return (
    <section className="knowledge-search-page page-section knowledge-registry-search">
      <div className="page-intro">
        <div className="section-eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-number">14</span>
          <span>Registro de conhecimento conectado</span>
        </div>
        <div className="page-title-row">
          <div>
            <h1>
              Pergunte como você fala.
              <br />
              <em>Encontre o contexto.</em>
            </h1>
            <p>
              Pesquise livros, capítulos, pessoas, povos, lugares,
              acontecimentos, termos, doutrinas, profecias e obras apócrifas em
              um único índice.
            </p>
          </div>
          <div className="knowledge-search-count">
            <strong>
              {manifest?.nodeCount.toLocaleString("pt-BR") ?? "—"}
            </strong>
            <span>
              verbetes
              <br />
              conectados
            </span>
          </div>
        </div>
      </div>

      <div
        className="knowledge-registry-proof"
        aria-label="Cobertura do registro"
      >
        <span>
          <Network size={15} />{" "}
          {manifest?.relationCount.toLocaleString("pt-BR") ?? "—"} relações
          tipadas
        </span>
        <span>
          <BookOpen size={15} /> {manifest?.countsByKind.book ?? 66} livros
        </span>
        <span>
          <FileText size={15} />{" "}
          {manifest?.countsByKind.chapter?.toLocaleString("pt-BR") ?? "1.189"}{" "}
          capítulos
        </span>
        <span>
          <ShieldCheck size={15} /> conteúdo preservado e rastreável
        </span>
      </div>

      <label className="knowledge-search-bar">
        <Search size={18} />
        <input
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Ex.: Melquisedeque, graça, Gênesis 22, Babilônia, 1 Enoque…"
          aria-label="Buscar no registro de conhecimento bíblico"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpar busca"
          >
            <X size={15} />
          </button>
        )}
      </label>

      {!query && (
        <section
          className="question-guides"
          aria-label="Perguntas para começar"
        >
          <span>Comece com uma pergunta humana</span>
          <div className="question-guides__chips">
            {questionGuides.map(guide => (
              <button
                type="button"
                key={guide.question}
                onClick={() => setQuery(guide.question)}
              >
                {guide.question}
              </button>
            ))}
          </div>
        </section>
      )}

      {query && questionMatch && (
        <section className="question-answer" aria-live="polite">
          <span>Resposta enciclopédica inicial</span>
          <h2>{questionMatch.question}</h2>
          <p>{questionMatch.answer}</p>
          <div className="question-answer__foot">
            <div>
              <div className="question-answer__refs">
                {questionMatch.references.map(reference => (
                  <span key={reference}>{reference}</span>
                ))}
              </div>
              <small>{questionMatch.next}</small>
            </div>
            {questionMatch.book && (
              <button
                type="button"
                className="question-answer__book"
                onClick={openQuestionBook}
              >
                Abrir {questionMatch.book} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </section>
      )}

      <div
        className="knowledge-filter-row knowledge-registry-filters"
        role="tablist"
        aria-label="Filtrar resultados"
      >
        {filters.map(item => (
          <button
            type="button"
            key={item.id}
            className={filter === item.id ? "is-active" : ""}
            onClick={() => setFilter(item.id)}
            role="tab"
            aria-selected={filter === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="knowledge-search-empty" aria-live="polite">
          <Network size={22} />
          <strong>Organizando a enciclopédia…</strong>
          <p>Os módulos são carregados apenas quando a busca é aberta.</p>
        </div>
      )}
      {error && (
        <div className="knowledge-search-empty knowledge-registry-error">
          <CircleHelp size={22} />
          <strong>Não foi possível abrir o índice completo</strong>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && !query && (
        <div className="knowledge-search-empty">
          <Network size={22} />
          <strong>Uma busca para toda a biblioteca</strong>
          <p>
            Digite um nome, referência, termo original, tema, doutrina ou obra
            antiga.
          </p>
        </div>
      )}
      {!loading && query && ranked.length === 0 && !questionMatch && (
        <div className="knowledge-search-empty">
          <Search size={22} />
          <strong>Nenhum verbete encontrado</strong>
          <p>
            Tente menos palavras, outra grafia, uma abreviação bíblica ou um
            filtro diferente.
          </p>
        </div>
      )}

      {query && ranked.length > 0 && (
        <div className="knowledge-registry-results" aria-live="polite">
          <div className="knowledge-registry-result-summary">
            <strong>{ranked.length}</strong>
            <span>
              {ranked.length === 120
                ? "resultados mais relevantes"
                : "resultados encontrados"}
            </span>
            <small>{activeFilter.label}</small>
          </div>
          {groups.map(([label, entries]) => (
            <section className="knowledge-result-group" key={label}>
              <div className="knowledge-group-heading">
                <span>
                  <Network size={14} />
                  {label}
                </span>
                <small>{entries.length}</small>
              </div>
              <div className="knowledge-registry-grid">
                {entries.map(node => {
                  const Icon = iconFor(node.kind);
                  return (
                    <button
                      type="button"
                      className="knowledge-registry-card"
                      key={node.id}
                      onClick={() => openNode(node)}
                    >
                      <span
                        className={`knowledge-result-kind knowledge-result-kind--${node.kind}`}
                      >
                        <Icon size={13} /> {knowledgeKindLabels[node.kind]}
                      </span>
                      <h2>{node.label}</h2>
                      <p>{cleanSnippet(node.summary)}</p>
                      <div>
                        <small>{maturityLabels[node.maturity]}</small>
                        <small>
                          {node.references.slice(0, 2).join(" · ") ||
                            "Verbete contextual"}
                        </small>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
