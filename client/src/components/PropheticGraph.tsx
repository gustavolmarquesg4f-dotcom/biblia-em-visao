import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CircleHelp, Filter, Network, Search, Sparkles } from "lucide-react";
import { getAllKnowledgeEntities, getAllKnowledgeRelations, type KnowledgeEntity, type KnowledgeRelation } from "@/lib/entity-graph";
import { loadBiographyCatalog } from "@/lib/biography-data";
import "@/biography-network.css";

type Props = { onOpenEntity: (entityId: string) => void };
type RelationFilter = "all" | KnowledgeRelation["type"];

const filters: { id: RelationFilter; label: string }[] = [
  { id: "all", label: "Todas" }, { id: "prophetic", label: "Proféticas" }, { id: "theological", label: "Teológicas" }, { id: "historical", label: "Históricas" }, { id: "geographic", label: "Geográficas" },
];

function nodeColor(entity: KnowledgeEntity) {
  return entity.kind === "person" ? "#9c5364" : entity.kind === "place" ? "#3c7280" : "#b38b4d";
}

export default function PropheticGraph({ onOpenEntity }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RelationFilter>("all");
  const [selected, setSelected] = useState<KnowledgeRelation | null>(null);
  const [, refresh] = useState(0);

  useEffect(() => { loadBiographyCatalog().then(() => refresh((value) => value + 1)).catch(() => undefined); }, []);

  const entities = getAllKnowledgeEntities();
  const byId = useMemo(() => new Map(entities.map((entity) => [entity.id, entity])), [entities]);
  const relations = getAllKnowledgeRelations().filter((relation) => {
    const from = byId.get(relation.from); const to = byId.get(relation.to);
    const needle = query.trim().toLowerCase();
    const matchesFilter = filter === "all" || relation.type === filter;
    const matchesQuery = !needle || [relation.label, relation.explanation, relation.refs.join(" "), from?.name || "", to?.name || ""].join(" ").toLowerCase().includes(needle);
    return matchesFilter && matchesQuery && from && to;
  }).slice(0, 60);
  const nodeIds = Array.from(new Set(relations.flatMap((relation) => [relation.from, relation.to])));
  const nodes = nodeIds.map((id) => byId.get(id)).filter(Boolean) as KnowledgeEntity[];
  const positions = new Map(nodes.map((node, index) => { const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2; return [node.id, { x: 260 + Math.cos(angle) * 205, y: 188 + Math.sin(angle) * 138 }]; }));

  return <section className="prophetic-graph-card">
    <div className="prophetic-graph-head"><div><span className="entity-section-label"><Network size={14} /> Grafo de relações</span><h2>Veja como a Bíblia <em>se conecta.</em></h2><p>As linhas distinguem profecia, teologia, história e geografia. Clique em um nó para abrir seu verbete.</p></div><div className="prophetic-graph-count"><strong>{nodes.length}</strong><span>nós visíveis<br />{relations.length} relações</span></div></div>
    <div className="prophetic-graph-controls"><label className="graph-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar por livro, pessoa, tema ou profecia…" aria-label="Filtrar grafo bíblico" /></label><div className="graph-filters"><Filter size={14} />{filters.map((item) => <button type="button" key={item.id} className={filter === item.id ? "is-active" : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div></div>
    {relations.length ? <div className="prophetic-graph-layout"><div className="prophetic-graph-canvas"><svg viewBox="0 0 520 390" role="img" aria-label="Grafo de conexões bíblicas">{relations.map((relation) => { const from = positions.get(relation.from); const to = positions.get(relation.to); if (!from || !to) return null; return <line key={relation.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`graph-edge graph-edge--${relation.type}`} onClick={() => setSelected(relation)} />; })}{nodes.map((node) => { const point = positions.get(node.id); if (!point) return null; return <g key={node.id} className="graph-node" role="button" tabIndex={0} onClick={() => onOpenEntity(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onOpenEntity(node.id); }}><circle cx={point.x} cy={point.y} r="12" fill={nodeColor(node)} /><text x={point.x} y={point.y + 29} textAnchor="middle">{node.name.length > 18 ? `${node.name.slice(0, 16)}…` : node.name}</text></g>; })}</svg><div className="graph-legend"><span><i className="graph-legend-dot graph-legend-dot--person" />Pessoas</span><span><i className="graph-legend-dot graph-legend-dot--place" />Lugares</span><span><i className="graph-legend-line graph-legend-line--prophetic" />Profecia</span><span><i className="graph-legend-line graph-legend-line--theological" />Teologia</span></div></div><aside className="prophetic-graph-inspector">{selected ? <><span className="entity-section-label">Relação selecionada</span><h3>{selected.label}</h3><p>{selected.explanation}</p><small>{selected.refs.join(" · ")}</small><button type="button" onClick={() => onOpenEntity(selected.from)}><Sparkles size={14} />Abrir origem da relação <ArrowRight size={13} /></button></> : <><CircleHelp size={20} /><strong>Explore a rede</strong><p>Selecione uma linha para ler o tipo de relação e suas referências. Selecione um nó para abrir o verbete.</p></>}</aside></div> : <div className="knowledge-search-empty"><Network size={22} /><strong>Nenhuma relação neste filtro</strong><p>Remova o termo de busca ou escolha outro tipo de conexão.</p></div>}
  </section>;
}
