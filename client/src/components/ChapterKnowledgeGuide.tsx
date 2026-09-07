import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  ClipboardCheck,
  Landmark,
  Languages,
  Loader2,
  Network,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import type {
  ChapterEditorialDimension,
  ChapterEditorialProfile,
  KnowledgeNode,
  KnowledgeRelation,
} from "@shared/knowledge-model";
import {
  knowledgeKindLabels,
  loadChapterKnowledge,
  relationTypeLabels,
} from "@/lib/knowledge-registry";
import "@/chapter-knowledge-guide.css";

type Props = {
  chapterId: string;
  reference: string;
  onOpenEntity?: (entityId: string) => void;
};

type GuideGroup = {
  id: string;
  label: string;
  question: string;
  kinds: KnowledgeNode["kind"][];
  icon: typeof UserRound;
};

const groups: GuideGroup[] = [
  {
    id: "people",
    label: "Pessoas e povos",
    question: "Quem participa ou é mencionado?",
    kinds: ["person", "people-group"],
    icon: UserRound,
  },
  {
    id: "scenes",
    label: "Cenários e acontecimentos",
    question: "Onde acontece e o que está em jogo?",
    kinds: ["place", "event", "period", "empire"],
    icon: Landmark,
  },
  {
    id: "terms",
    label: "Termos para entender",
    question: "Que palavra ou conceito merece atenção?",
    kinds: ["term"],
    icon: Languages,
  },
  {
    id: "theology",
    label: "Teologia e conexões",
    question: "Que tema, doutrina ou diálogo atravessa o capítulo?",
    kinds: ["theme", "doctrine", "prophecy", "apocryphal-work", "book"],
    icon: Sparkles,
  },
];

const editorialStatusLabels: Record<ChapterEditorialProfile["status"], string> =
  {
    published: "Estudo publicado",
    connected: "Contexto conectado",
    expanded: "Contexto ampliado",
    reviewed: "Revisão humana registrada",
  };

const priorityLabels: Record<ChapterEditorialProfile["priority"], string> = {
  high: "revisão prioritária",
  medium: "aprofundamento necessário",
  standard: "ampliação planejada",
  polish: "refino editorial",
};

const dimensionLabels: Record<ChapterEditorialDimension, string> = {
  people: "pessoas e povos",
  scenes: "cenários e acontecimentos",
  terms: "termos",
  theology: "teologia e conexões",
};

function iconFor(kind: KnowledgeNode["kind"]) {
  if (kind === "person") return UserRound;
  if (kind === "people-group") return UsersRound;
  if (kind === "place" || kind === "event") return Landmark;
  if (kind === "term") return Languages;
  if (kind === "book" || kind === "apocryphal-work") return BookOpen;
  return Sparkles;
}

export default function ChapterKnowledgeGuide({
  chapterId,
  reference,
  onOpenEntity,
}: Props) {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [relations, setRelations] = useState<KnowledgeRelation[]>([]);
  const [editorialProfile, setEditorialProfile] =
    useState<ChapterEditorialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setExpanded([]);
    setEditorialProfile(null);
    loadChapterKnowledge(chapterId)
      .then(neighborhood => {
        if (!active) return;
        setNodes(neighborhood?.relatedNodes ?? []);
        setRelations(neighborhood?.relations ?? []);
        setEditorialProfile(neighborhood?.editorialProfile ?? null);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [chapterId]);

  const relationByNode = useMemo(() => {
    const map = new Map<string, KnowledgeRelation>();
    for (const relation of relations) {
      const relatedId =
        relation.from === chapterId ? relation.to : relation.from;
      if (!map.has(relatedId)) map.set(relatedId, relation);
    }
    return map;
  }, [chapterId, relations]);
  const grouped = groups.map(group => ({
    ...group,
    nodes: nodes
      .filter(node => group.kinds.includes(node.kind))
      .sort((left, right) => left.label.localeCompare(right.label, "pt-BR")),
  }));
  const confidenceCount = relations.filter(
    relation =>
      relation.confidence === "contextual" || relation.confidence === "debated"
  ).length;

  if (loading) {
    return (
      <section
        className="chapter-knowledge chapter-knowledge--state"
        aria-live="polite"
      >
        <Loader2 className="chapter-coverage-spin" size={17} />
        <div>
          <strong>Conectando {reference} ao acervo…</strong>
          <span>Somente referências explícitas serão apresentadas.</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="chapter-knowledge chapter-knowledge--state">
        <CircleHelp size={18} />
        <div>
          <strong>O guia contextual não pôde ser carregado.</strong>
          <span>
            O comentário e as fontes do capítulo continuam disponíveis.
          </span>
        </div>
      </section>
    );
  }

  if (!nodes.length) {
    return (
      <section className="chapter-knowledge chapter-knowledge--empty">
        <Network size={20} />
        <div>
          <span>Guia contextual · Fase 5</span>
          <h4>Nenhum vínculo explícito catalogado para {reference}.</h4>
          <p>
            Esta ausência não significa que o capítulo esteja sem contexto. Ela
            indica que pessoas, lugares, termos e temas ainda precisam de
            revisão relacional específica; as quatro camadas do estudo
            permanecem publicadas acima.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="chapter-knowledge"
      aria-labelledby={`chapter-knowledge-${chapterId}`}
    >
      <header className="chapter-knowledge__head">
        <div>
          <span>
            <Network size={14} /> Guia contextual · Fase 5
          </span>
          <h4 id={`chapter-knowledge-${chapterId}`}>
            Entenda quem, onde, o que e por quê.
          </h4>
          <p>
            Entidades aparecem quando seus verbetes citam a passagem; diálogos
            canônicos vêm das referências já declaradas neste estudo. Abra cada
            ficha para conferir origem e grau de confiança.
          </p>
        </div>
        <div className="chapter-knowledge__proof">
          <strong>{nodes.length}</strong>
          <span>conexões explícitas</span>
          <small>
            {confidenceCount
              ? `${confidenceCount} contextuais ou debatidas`
              : "vínculos textuais"}
          </small>
        </div>
      </header>

      {editorialProfile && (
        <aside
          className={`chapter-editorial-status is-${editorialProfile.priority}`}
          aria-label={`Estado editorial de ${reference}`}
        >
          <ClipboardCheck size={18} />
          <div>
            <span>Estado editorial transparente</span>
            <strong>{editorialStatusLabels[editorialProfile.status]}</strong>
            <p>
              {editorialProfile.humanReview.completed
                ? `Revisão registrada por ${editorialProfile.humanReview.reviewedBy.join(", ")}.`
                : "A estrutura está publicada, mas ainda não há assinatura de revisão humana para este capítulo."}
            </p>
          </div>
          <div className="chapter-editorial-status__metrics">
            <span>
              <b>{editorialProfile.structuralScore}/5</b> itens estruturais
            </span>
            <span>
              <b>{editorialProfile.entityConnectionCount}</b> entidades
            </span>
            <small>{priorityLabels[editorialProfile.priority]}</small>
          </div>
          {editorialProfile.pendingDimensions.length > 0 && (
            <p className="chapter-editorial-status__pending">
              <b>Ainda ampliar:</b>{" "}
              {editorialProfile.pendingDimensions
                .map(dimension => dimensionLabels[dimension])
                .join(" · ")}
            </p>
          )}
        </aside>
      )}

      <div className="chapter-knowledge__groups">
        {grouped.map(group => {
          const GroupIcon = group.icon;
          const isExpanded = expanded.includes(group.id);
          const visible = isExpanded ? group.nodes : group.nodes.slice(0, 6);
          return (
            <article key={group.id} className="chapter-knowledge__group">
              <div className="chapter-knowledge__group-head">
                <span>
                  <GroupIcon size={14} /> {group.label}
                </span>
                <strong>{group.nodes.length}</strong>
              </div>
              <p>{group.question}</p>
              <div className="chapter-knowledge__cards">
                {visible.map(node => {
                  const relation = relationByNode.get(node.id);
                  const Icon = iconFor(node.kind);
                  return (
                    <button
                      type="button"
                      key={node.id}
                      onClick={() => onOpenEntity?.(node.id)}
                      disabled={!onOpenEntity}
                    >
                      <Icon size={14} />
                      <span>
                        <strong>{node.label}</strong>
                        <small>
                          {knowledgeKindLabels[node.kind]}
                          {relation
                            ? ` · ${relationTypeLabels[relation.type]}`
                            : ""}
                        </small>
                        {node.summary && <em>{node.summary}</em>}
                      </span>
                      <ArrowRight size={12} />
                    </button>
                  );
                })}
                {!group.nodes.length && (
                  <span className="chapter-knowledge__missing">
                    Ainda sem verbete explicitamente ligado.
                  </span>
                )}
              </div>
              {group.nodes.length > 6 && (
                <button
                  type="button"
                  className="chapter-knowledge__more"
                  onClick={() =>
                    setExpanded(current =>
                      current.includes(group.id)
                        ? current.filter(id => id !== group.id)
                        : [...current, group.id]
                    )
                  }
                >
                  {isExpanded
                    ? "Mostrar menos"
                    : `Ver todos os ${group.nodes.length}`}
                </button>
              )}
            </article>
          );
        })}
      </div>

      <footer className="chapter-knowledge__foot">
        <ShieldCheck size={14} />
        <span>
          Vínculo não é consenso automático. Relações contextuais ou debatidas
          aparecem identificadas no verbete.
        </span>
      </footer>
    </section>
  );
}
