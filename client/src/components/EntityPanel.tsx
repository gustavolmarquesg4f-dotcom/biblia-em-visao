import { ArrowRight, BookOpen, ExternalLink, MapPin, Network, UserRound, X } from "lucide-react";
import { bibleBooks } from "@/lib/bible-data";
import { findKnowledgeEntity, getAllKnowledgeEntities, getAllKnowledgeRelations, type KnowledgeEntity } from "@/lib/entity-graph";
import { findBiography } from "@/lib/biography-data";
import BiographyPanel from "@/components/BiographyPanel";
import "@/entity-network.css";

// Cartografia de Leituras: painel de verbete contextual, pensado como ficha de arquivo e não como tooltip descartável.

type Props = {
  entityId: string | null;
  close: () => void;
  onFocusPlace?: (placeId: string) => void;
  onOpenBook?: (bookName: string) => void;
  onOpenEntity?: (entityId: string) => void;
};

const iconFor = (kind: KnowledgeEntity["kind"]) => kind === "person" ? UserRound : kind === "place" ? MapPin : Network;

export default function EntityPanel({ entityId, close, onFocusPlace, onOpenBook, onOpenEntity }: Props) {
  if (!entityId) return null;
  const biography = findBiography(entityId);
  if (biography) return <BiographyPanel biographyId={entityId} close={close} onFocusPlace={onFocusPlace} onOpenEntity={onOpenEntity} onOpenBook={onOpenBook} />;
  const entity = findKnowledgeEntity(entityId);
  if (!entity) return null;
  const Icon = iconFor(entity.kind);
  const relatedEntities = entity.related.map((id) => findKnowledgeEntity(id)).filter(Boolean) as KnowledgeEntity[];
  const relations = getAllKnowledgeRelations().filter((relation) => relation.from === entity.id || relation.to === entity.id);
  return <div className="entity-panel-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    <aside className="entity-panel" role="dialog" aria-modal="true" aria-labelledby="entity-panel-title">
      <div className="entity-panel-top"><span className={`entity-kind entity-kind--${entity.kind}`}><Icon size={14} />{entity.kind === "person" ? "Pessoa" : entity.kind === "place" ? "Lugar" : "Conexão"}</span><button className="entity-panel-close" onClick={close} aria-label="Fechar verbete"><X size={18} /></button></div>
      <div className="entity-panel-header"><span className="entity-index">VERBETE · {entity.refs.length} REFERÊNCIAS</span><h2 id="entity-panel-title">{entity.name}</h2><p>{entity.shortLabel}</p></div>
      {entity.kind === "place" && <button className="entity-map-action" onClick={() => onFocusPlace?.(entity.id)}><MapPin size={15} /><span>Destacar no atlas</span><ArrowRight size={14} /></button>}
      <div className="entity-panel-body"><section><span className="entity-section-label">Dossiê</span><p className="entity-lead">{entity.summary}</p><p>{entity.biography}</p></section><section><span className="entity-section-label">Por que importa</span><p>{entity.significance}</p></section><section className="entity-ref-block"><span className="entity-section-label">Referências bíblicas</span><div className="entity-ref-list">{entity.refs.map((ref) => <span key={ref}>{ref}</span>)}</div></section><section><span className="entity-section-label">Livros relacionados</span><div className="entity-book-list">{entity.books.map((name) => <button key={name} onClick={() => onOpenBook?.(name)}><BookOpen size={13} />{name}<ArrowRight size={12} /></button>)}</div></section>{(relations.length > 0 || relatedEntities.length > 0) && <section><span className="entity-section-label">Rede de conexões</span><div className="entity-relation-list">{relations.map((relation) => <button key={relation.id} onClick={() => onOpenEntity?.(relation.from === entity.id ? relation.to : relation.from)}><Network size={13} /><span><strong>{relation.label}</strong><small>{relation.explanation}</small></span><ArrowRight size={12} /></button>)}{relatedEntities.map((related) => <button key={related.id} onClick={() => onOpenEntity?.(related.id)}><UserRound size={13} /><span><strong>{related.name}</strong><small>{related.shortLabel}</small></span><ArrowRight size={12} /></button>)}</div></section>}{entity.primarySource && <section><span className="entity-section-label">Fonte de entrada</span><a className="entity-source" href={entity.primarySource} target="_blank" rel="noreferrer"><ExternalLink size={13} />Abrir fonte selecionada</a></section>}{entity.academicNote && <section className="entity-method"><span className="entity-section-label">Nota de método</span><p>{entity.academicNote}</p></section>}</div>
      <div className="entity-panel-footer"><span>Verbetes indexados · {getAllKnowledgeEntities().length}</span><span>Leitura contextual</span></div>
    </aside>
  </div>;
}
