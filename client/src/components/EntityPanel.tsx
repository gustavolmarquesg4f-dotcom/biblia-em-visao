import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  FileText,
  Landmark,
  LibraryBig,
  MapPin,
  Network,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Streamdown } from "streamdown";
import type { KnowledgeKind, KnowledgeNode } from "@shared/knowledge-model";
import {
  confidenceLabels,
  knowledgeKindLabels,
  loadKnowledgeNeighborhood,
  maturityLabels,
  relationTypeLabels,
  type KnowledgeNeighborhood,
} from "@/lib/knowledge-registry";
import {
  findKnowledgeEntity,
  getAllKnowledgeEntities,
  getAllKnowledgeRelations,
  type KnowledgeEntity,
} from "@/lib/entity-graph";
import { findBiography } from "@/lib/biography-data";
import BiographyPanel from "@/components/BiographyPanel";
import "@/entity-network.css";
import "@/knowledge-registry.css";

type Props = {
  entityId: string | null;
  close: () => void;
  onFocusPlace?: (placeId: string) => void;
  onOpenBook?: (bookName: string) => void;
  onOpenEntity?: (entityId: string) => void;
};

function iconFor(kind: KnowledgeKind | KnowledgeEntity["kind"]) {
  if (kind === "person") return UserRound;
  if (kind === "people-group") return UsersRound;
  if (kind === "place") return MapPin;
  if (kind === "book" || kind === "chapter") return BookOpen;
  if (kind === "event") return Landmark;
  if (kind === "apocryphal-work") return LibraryBig;
  if (kind === "term" || kind === "doctrine") return FileText;
  if (kind === "theme" || kind === "prophecy") return Sparkles;
  return Network;
}

const attributeLabels: Record<string, string> = {
  testament: "Testamento",
  category: "Categoria",
  chapters: "Capítulos",
  author: "Autoria",
  period: "Período",
  book: "Livro",
  chapter: "Capítulo",
  editorialDepth: "Profundidade editorial",
  role: "Papel na narrativa",
  entityType: "Tipo de entidade",
  language: "Idioma",
  semanticRange: "Campo semântico",
  translationNote: "Nota de tradução",
  canonicalStatus: "Situação canônica",
  date: "Data provável",
  tradition: "Tradição",
  primarySource: "Fonte primária específica",
  bookLinksVerified: "Vínculos bíblicos verificados",
};

function displayValue(value: unknown) {
  if (Array.isArray(value))
    return value
      .filter(item => typeof item === "string" || typeof item === "number")
      .join(" · ");
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  return "";
}

function RegistryEntityPanel({
  entityId,
  close,
  onFocusPlace,
  onOpenBook,
  onOpenEntity,
}: Omit<Props, "entityId"> & { entityId: string }) {
  const [neighborhood, setNeighborhood] =
    useState<KnowledgeNeighborhood | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    loadKnowledgeNeighborhood(entityId)
      .then(value => {
        if (!active) return;
        setNeighborhood(value);
        setError(!value);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [entityId]);

  const node = neighborhood?.node;
  const relatedById = useMemo(
    () =>
      new Map(
        (neighborhood?.relatedNodes ?? []).map(related => [related.id, related])
      ),
    [neighborhood?.relatedNodes]
  );
  const visibleRelations = useMemo(
    () =>
      (neighborhood?.relations ?? [])
        .filter(relation => relation.type !== "contains")
        .sort((left, right) => {
          const order = { high: 0, medium: 1, contextual: 2, debated: 3 };
          return order[left.confidence] - order[right.confidence];
        })
        .slice(0, 30),
    [neighborhood?.relations]
  );
  const chapterCount =
    neighborhood?.relations.filter(relation => relation.type === "contains")
      .length ?? 0;
  const attributes = node
    ? Object.entries(node.attributes ?? {})
        .filter(([key, value]) => attributeLabels[key] && displayValue(value))
        .slice(0, 8)
    : [];
  const bookLinks = node
    ? Array.from(
        new Set([
          ...(node.kind === "book" ? [node.label] : []),
          ...(typeof node.attributes?.book === "string"
            ? [node.attributes.book]
            : []),
          ...(neighborhood?.relatedNodes
            .filter(related => related.kind === "book")
            .map(related => related.label) ?? []),
        ])
      )
    : [];
  const biographySourcePending = Boolean(
    node?.kind === "person" &&
      node.sourceCatalogs.includes("biography-catalog") &&
      !node.attributes?.primarySource
  );

  const Icon = node ? iconFor(node.kind) : Network;
  return (
    <div
      className="entity-panel-backdrop"
      role="presentation"
      onClick={event => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <aside
        className="entity-panel registry-entity-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registry-entity-title"
      >
        <div className="entity-panel-top">
          <span
            className={`entity-kind entity-kind--${node?.kind ?? "registry"}`}
          >
            <Icon size={14} />{" "}
            {node ? knowledgeKindLabels[node.kind] : "Registro conectado"}
          </span>
          <button
            type="button"
            className="entity-panel-close"
            onClick={close}
            aria-label="Fechar verbete"
          >
            <X size={18} />
          </button>
        </div>

        {loading && (
          <div className="registry-entity-state" aria-live="polite">
            <Network size={20} />
            <strong>Buscando contexto e relações…</strong>
          </div>
        )}
        {error && !loading && (
          <div className="registry-entity-state">
            <CircleHelp size={20} />
            <strong>Este verbete não pôde ser carregado.</strong>
            <button type="button" onClick={close}>
              Voltar
            </button>
          </div>
        )}
        {node && !loading && (
          <>
            <div className="entity-panel-header">
              <span className="entity-index">
                {maturityLabels[node.maturity]} · {node.references.length}{" "}
                referências
              </span>
              <h2 id="registry-entity-title">{node.label}</h2>
              <p>
                {node.aliases.length
                  ? `Também conhecido como ${node.aliases.slice(0, 4).join(" · ")}`
                  : knowledgeKindLabels[node.kind]}
              </p>
            </div>
            {node.kind === "place" && (
              <button
                type="button"
                className="entity-map-action"
                onClick={() => onFocusPlace?.(node.id)}
              >
                <MapPin size={15} />
                <span>Localizar no atlas</span>
                <ArrowRight size={14} />
              </button>
            )}
            <div className="entity-panel-body">
              <section>
                <span className="entity-section-label">Dossiê</span>
                <div className="entity-lead registry-entity-markdown">
                  <Streamdown>{node.summary}</Streamdown>
                </div>
              </section>

              {attributes.length > 0 && (
                <section>
                  <span className="entity-section-label">
                    Identidade e contexto
                  </span>
                  <dl className="registry-attribute-grid">
                    {attributes.map(([key, value]) => (
                      <div key={key}>
                        <dt>{attributeLabels[key]}</dt>
                        <dd>{displayValue(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {biographySourcePending && (
                <section className="registry-source-pending">
                  <span className="entity-section-label">
                    <ShieldCheck size={13} /> Estado da fonte
                  </span>
                  <strong>Fonte primária específica ainda pendente</strong>
                  <p>
                    A biografia permanece disponível, mas não recebe selo de
                    revisão concluída até que uma obra, documento ou página
                    institucional específica sustente suas afirmações.
                  </p>
                </section>
              )}

              {node.references.length > 0 && (
                <section className="entity-ref-block">
                  <span className="entity-section-label">Onde acompanhar</span>
                  <div className="entity-ref-list">
                    {node.references.map(reference => (
                      <span key={reference}>{reference}</span>
                    ))}
                  </div>
                </section>
              )}

              {bookLinks.length > 0 && (
                <section>
                  <span className="entity-section-label">
                    Abrir estudo do livro
                  </span>
                  <div className="entity-book-list">
                    {bookLinks.slice(0, 10).map(name => (
                      <button
                        type="button"
                        key={name}
                        onClick={() => onOpenBook?.(name)}
                      >
                        <BookOpen size={13} />
                        {name}
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {(visibleRelations.length > 0 || chapterCount > 0) && (
                <section>
                  <span className="entity-section-label">Rede de conexões</span>
                  {chapterCount > 0 && (
                    <p className="registry-chapter-count">
                      <FileText size={14} /> {chapterCount} capítulos ligados a
                      este livro
                    </p>
                  )}
                  <div className="entity-relation-list">
                    {visibleRelations.map(relation => {
                      const targetId =
                        relation.from === node.id ? relation.to : relation.from;
                      const target = relatedById.get(targetId);
                      if (!target) return null;
                      const RelatedIcon = iconFor(target.kind);
                      return (
                        <button
                          type="button"
                          key={relation.id}
                          onClick={() => onOpenEntity?.(target.id)}
                        >
                          <RelatedIcon size={13} />
                          <span>
                            <strong>{target.label}</strong>
                            <small>
                              {relationTypeLabels[relation.type]} ·{" "}
                              {confidenceLabels[relation.confidence]}
                            </small>
                            {relation.explanation && (
                              <em>{relation.explanation}</em>
                            )}
                          </span>
                          <ArrowRight size={12} />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="entity-method registry-entity-method">
                <span className="entity-section-label">
                  <ShieldCheck size={13} /> Como ler este verbete
                </span>
                <p>
                  As relações distinguem vínculo textual, contexto e
                  interpretação. Uma conexão contextual ou debatida não é
                  apresentada como fato comprovado.
                </p>
              </section>
            </div>
            <div className="entity-panel-footer">
              <span>{node.sourceCatalogs.join(" · ")}</span>
              <span>ID global · {node.id}</span>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function LegacyEntityPanel({
  entityId,
  close,
  onFocusPlace,
  onOpenBook,
  onOpenEntity,
}: Omit<Props, "entityId"> & { entityId: string }) {
  const biography = findBiography(entityId);
  if (biography)
    return (
      <BiographyPanel
        biographyId={entityId}
        close={close}
        onFocusPlace={onFocusPlace}
        onOpenEntity={onOpenEntity}
        onOpenBook={onOpenBook}
      />
    );
  const entity = findKnowledgeEntity(entityId);
  if (!entity) return null;
  const Icon = iconFor(entity.kind);
  const relatedEntities = entity.related
    .map(id => findKnowledgeEntity(id))
    .filter(Boolean) as KnowledgeEntity[];
  const relations = getAllKnowledgeRelations().filter(
    relation => relation.from === entity.id || relation.to === entity.id
  );
  return (
    <div
      className="entity-panel-backdrop"
      role="presentation"
      onClick={event => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <aside
        className="entity-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-panel-title"
      >
        <div className="entity-panel-top">
          <span className={`entity-kind entity-kind--${entity.kind}`}>
            <Icon size={14} />
            {entity.kind === "person"
              ? "Pessoa"
              : entity.kind === "place"
                ? "Lugar"
                : "Conexão"}
          </span>
          <button
            type="button"
            className="entity-panel-close"
            onClick={close}
            aria-label="Fechar verbete"
          >
            <X size={18} />
          </button>
        </div>
        <div className="entity-panel-header">
          <span className="entity-index">
            VERBETE · {entity.refs.length} REFERÊNCIAS
          </span>
          <h2 id="entity-panel-title">{entity.name}</h2>
          <p>{entity.shortLabel}</p>
        </div>
        {entity.kind === "place" && (
          <button
            type="button"
            className="entity-map-action"
            onClick={() => onFocusPlace?.(entity.id)}
          >
            <MapPin size={15} />
            <span>Destacar no atlas</span>
            <ArrowRight size={14} />
          </button>
        )}
        <div className="entity-panel-body">
          <section>
            <span className="entity-section-label">Dossiê</span>
            <p className="entity-lead">{entity.summary}</p>
            <p>{entity.biography}</p>
          </section>
          <section>
            <span className="entity-section-label">Por que importa</span>
            <p>{entity.significance}</p>
          </section>
          <section className="entity-ref-block">
            <span className="entity-section-label">Referências bíblicas</span>
            <div className="entity-ref-list">
              {entity.refs.map(reference => (
                <span key={reference}>{reference}</span>
              ))}
            </div>
          </section>
          <section>
            <span className="entity-section-label">Livros relacionados</span>
            <div className="entity-book-list">
              {entity.books.map(name => (
                <button
                  type="button"
                  key={name}
                  onClick={() => onOpenBook?.(name)}
                >
                  <BookOpen size={13} />
                  {name}
                  <ArrowRight size={12} />
                </button>
              ))}
            </div>
          </section>
          {(relations.length > 0 || relatedEntities.length > 0) && (
            <section>
              <span className="entity-section-label">Rede de conexões</span>
              <div className="entity-relation-list">
                {relations.map(relation => (
                  <button
                    type="button"
                    key={relation.id}
                    onClick={() =>
                      onOpenEntity?.(
                        relation.from === entity.id
                          ? relation.to
                          : relation.from
                      )
                    }
                  >
                    <Network size={13} />
                    <span>
                      <strong>{relation.label}</strong>
                      <small>{relation.explanation}</small>
                    </span>
                    <ArrowRight size={12} />
                  </button>
                ))}
                {relatedEntities.map(related => (
                  <button
                    type="button"
                    key={related.id}
                    onClick={() => onOpenEntity?.(related.id)}
                  >
                    <UserRound size={13} />
                    <span>
                      <strong>{related.name}</strong>
                      <small>{related.shortLabel}</small>
                    </span>
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="entity-panel-footer">
          <span>Verbetes indexados · {getAllKnowledgeEntities().length}</span>
          <span>Leitura contextual</span>
        </div>
      </aside>
    </div>
  );
}

export default function EntityPanel(props: Props) {
  if (!props.entityId) return null;
  if (props.entityId.includes(":"))
    return <RegistryEntityPanel {...props} entityId={props.entityId} />;
  return <LegacyEntityPanel {...props} entityId={props.entityId} />;
}
