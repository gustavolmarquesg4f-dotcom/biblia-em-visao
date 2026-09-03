import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  FileText,
  Landmark,
  MapPin,
  Network,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { KnowledgeNode, KnowledgeRelation } from "@shared/knowledge-model";
import { makeKnowledgeId } from "@shared/knowledge-model";
import type { Book } from "@/lib/bible-data";
import {
  knowledgeKindLabels,
  loadConnectedKnowledgeRelations,
  loadKnowledgeNodesByIds,
  relationTypeLabels,
} from "@/lib/knowledge-registry";
import "@/knowledge-registry.css";

type Props = {
  book: Book;
  onOpenEntity: (entityId: string) => void;
  onOpenBook?: (bookName: string) => void;
};

type Group = {
  id: string;
  label: string;
  prompt: string;
  kinds: KnowledgeNode["kind"][];
  icon: typeof BookOpen;
};

const groups: Group[] = [
  {
    id: "people",
    label: "Pessoas e povos",
    prompt: "Quem participa desta história?",
    kinds: ["person", "people-group"],
    icon: UserRound,
  },
  {
    id: "scenes",
    label: "Cenários e acontecimentos",
    prompt: "Onde acontece e o que muda?",
    kinds: ["place", "event"],
    icon: Landmark,
  },
  {
    id: "ideas",
    label: "Temas, termos e profecias",
    prompt: "Que ideias atravessam o livro?",
    kinds: ["theme", "prophecy", "term", "doctrine"],
    icon: Sparkles,
  },
  {
    id: "books",
    label: "Conexões canônicas",
    prompt: "Que outro livro continua a conversa?",
    kinds: ["book"],
    icon: BookOpen,
  },
];

function iconFor(kind: KnowledgeNode["kind"]) {
  if (kind === "book" || kind === "chapter") return BookOpen;
  if (kind === "person") return UserRound;
  if (kind === "people-group") return UsersRound;
  if (kind === "place") return MapPin;
  if (kind === "event") return Landmark;
  return Sparkles;
}

export default function BookKnowledgeNavigator({
  book,
  onOpenEntity,
  onOpenBook,
}: Props) {
  const [relations, setRelations] = useState<KnowledgeRelation[]>([]);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const bookId = makeKnowledgeId("book", book.name);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    loadConnectedKnowledgeRelations(bookId)
      .then(async nextRelations => {
        const relatedIds = Array.from(
          new Set(
            nextRelations
              .map(relation =>
                relation.from === bookId ? relation.to : relation.from
              )
              .filter(id => !id.startsWith("chapter:"))
          )
        );
        const nextNodes = await loadKnowledgeNodesByIds(relatedIds);
        if (!active) return;
        setRelations(nextRelations);
        setNodes(nextNodes);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [bookId]);

  const relationByNode = useMemo(() => {
    const map = new Map<string, KnowledgeRelation>();
    for (const relation of relations) {
      const relatedId = relation.from === bookId ? relation.to : relation.from;
      if (!map.has(relatedId)) map.set(relatedId, relation);
    }
    return map;
  }, [bookId, relations]);
  const chapterCount = relations.filter(
    relation => relation.type === "contains"
  ).length;
  const grouped = groups.map(group => ({
    ...group,
    nodes: nodes.filter(node => group.kinds.includes(node.kind)),
  }));
  const connectedCount = nodes.length;

  if (loading) {
    return (
      <section
        className="book-knowledge book-knowledge--state"
        aria-live="polite"
      >
        <Network size={20} />
        <div>
          <strong>Montando a rede de {book.name}…</strong>
          <span>
            Pessoas, cenários, acontecimentos e ideias são carregados sob
            demanda.
          </span>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="book-knowledge book-knowledge--state">
        <CircleHelp size={20} />
        <div>
          <strong>A rede contextual não pôde ser carregada.</strong>
          <span>
            O dossiê e os estudos dos capítulos continuam disponíveis.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="book-knowledge" aria-labelledby="book-knowledge-title">
      <header className="book-knowledge__head">
        <div>
          <span>
            <Network size={14} /> Registro conectado · Fase 3
          </span>
          <h2 id="book-knowledge-title">
            {book.name} <em>não está sozinho.</em>
          </h2>
          <p>
            Abra uma pessoa, um cenário, um acontecimento ou uma ideia sem sair
            do fluxo do estudo.
          </p>
        </div>
        <div className="book-knowledge__score">
          <strong>{connectedCount}</strong>
          <span>verbetes relacionados</span>
          <small>{chapterCount || book.chapters} capítulos ligados</small>
        </div>
      </header>

      <div className="book-knowledge__groups">
        {grouped.map(group => {
          const GroupIcon = group.icon;
          return (
            <article key={group.id} className="book-knowledge__group">
              <div className="book-knowledge__group-head">
                <span>
                  <GroupIcon size={15} /> {group.label}
                </span>
                <strong>{group.nodes.length}</strong>
              </div>
              <p>{group.prompt}</p>
              <div className="book-knowledge__links">
                {group.nodes.slice(0, 10).map(node => {
                  const relation = relationByNode.get(node.id);
                  const Icon = iconFor(node.kind);
                  const open = () =>
                    node.kind === "book"
                      ? onOpenBook?.(node.label)
                      : onOpenEntity(node.id);
                  return (
                    <button type="button" key={node.id} onClick={open}>
                      <Icon size={13} />
                      <span>
                        <strong>{node.label}</strong>
                        <small>
                          {relation
                            ? relationTypeLabels[relation.type]
                            : knowledgeKindLabels[node.kind]}
                        </small>
                      </span>
                      <ArrowRight size={12} />
                    </button>
                  );
                })}
                {group.nodes.length === 0 && (
                  <span className="book-knowledge__empty">
                    Sem vínculo estruturado neste grupo.
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <footer className="book-knowledge__foot">
        <FileText size={14} />
        <span>
          As relações mostram origem, explicação e grau de confiança no verbete
          aberto.
        </span>
      </footer>
    </section>
  );
}
