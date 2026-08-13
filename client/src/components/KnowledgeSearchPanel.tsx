import { useEffect, useState } from "react";
import { BookOpen, ChevronRight, Link2, Network, Search, UserRound, X } from "lucide-react";
import { bibleBooks, type Book } from "@/lib/bible-data";
import { searchKnowledge, type KnowledgeEntity } from "@/lib/entity-graph";
import "@/entity-network.css";
import { loadBiographyCatalog } from "@/lib/biography-data";
import PropheticGraph from "@/components/PropheticGraph";

// Cartografia de Leituras: a busca abre o verbete antes de levar o leitor para outro contexto.

type Props = {
  openBook?: (book: Book) => void;
  onOpenEntity: (entityId: string) => void;
  onFocusPlace: (placeId: string) => void;
};

const kinds = [
  { id: "all", label: "Tudo" },
  { id: "person", label: "Pessoas" },
  { id: "place", label: "Lugares" },
  { id: "book", label: "Livros" },
  { id: "relation", label: "Relações" },
];

const iconFor = (kind: KnowledgeEntity["kind"]) => kind === "person" ? UserRound : kind === "place" ? Network : Link2;

export default function KnowledgeSearchPanel({ openBook, onOpenEntity, onFocusPlace }: Props) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [showGraph, setShowGraph] = useState(false);
  const [, setCatalogVersion] = useState(0);
  useEffect(() => { loadBiographyCatalog().then(() => setCatalogVersion((value) => value + 1)).catch(() => undefined); }, []);
  const results = searchKnowledge(query, kind);
  const total = results.entityResults.length + results.bookResults.length + results.relationResults.length;

  return (
    <section className="knowledge-search-page page-section">
      <div className="page-intro">
        <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-number">14</span><span>Grafo bíblico pesquisável</span></div>
        <div className="page-title-row">
          <div><h1>Procure uma palavra.<br /><em>Encontre uma rede.</em></h1><p>Pesquise pessoas, lugares, livros e relações teológicas ou proféticas. Cada resultado abre um verbete com contexto, fontes e relações.</p></div>
          <div className="knowledge-search-count"><strong>{total}</strong><span>resultados<br />indexados</span></div>
        </div>
      </div>

      <div className="knowledge-search-bar"><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: Abraão, Babilônia, aliança, Adão e Cristo…" aria-label="Buscar na rede bíblica" />{query && <button onClick={() => setQuery("")} aria-label="Limpar busca"><X size={15} /></button>}</div>
      <div className="knowledge-filter-row" role="tablist" aria-label="Filtrar resultados">{kinds.map((item) => <button key={item.id} className={kind === item.id ? "is-active" : ""} onClick={() => setKind(item.id)} role="tab" aria-selected={kind === item.id}>{item.label}</button>)}</div>
      <div className="knowledge-graph-launch"><button className={showGraph ? "is-active" : ""} onClick={() => setShowGraph((value) => !value)}><Network size={15} />{showGraph ? "Fechar grafo visual" : "Abrir grafo visual"}</button><span>Explore as conexões em vez de apenas listá-las.</span></div>
      {showGraph && <PropheticGraph onOpenEntity={onOpenEntity} />}

      {!query && <div className="knowledge-search-empty"><Network size={22} /><strong>Comece por uma entidade ou relação</strong><p>Experimente “Adão”, “Jerusalém”, “Babilônia”, “Paulo”, “aliança” ou “império”.</p></div>}
      {query && total === 0 && <div className="knowledge-search-empty"><Search size={22} /><strong>Nenhuma conexão encontrada</strong><p>Tente o nome de um livro, personagem, lugar, tema ou referência bíblica.</p></div>}

      {query && total > 0 && <div className="knowledge-result-groups">
        {results.entityResults.length > 0 && <section className="knowledge-result-group"><div className="knowledge-group-heading"><span><UserRound size={14} />Verbetes de entidades</span><small>{results.entityResults.length}</small></div><div className="knowledge-result-grid">{results.entityResults.map((entity) => { const Icon = iconFor(entity.kind); return <button className="knowledge-result-card" key={entity.id} onClick={() => onOpenEntity(entity.id)}><span className={`knowledge-result-kind knowledge-result-kind--${entity.kind}`}><Icon size={13} />{entity.kind === "person" ? "Pessoa" : "Lugar"}</span><h2>{entity.name}</h2><p>{entity.summary}</p><span className="knowledge-result-meta">{entity.books.slice(0, 3).join(" · ")}</span><ChevronRight size={15} /></button>; })}</div></section>}

        {results.bookResults.length > 0 && <section className="knowledge-result-group"><div className="knowledge-group-heading"><span><BookOpen size={14} />Livros</span><small>{results.bookResults.length}</small></div><div className="knowledge-book-results">{results.bookResults.map((book) => <button key={book.id} onClick={() => openBook?.(book)}><BookOpen size={14} /><span><strong>{book.name}</strong><small>{book.summary}</small></span><ChevronRight size={15} /></button>)}</div></section>}

        {results.relationResults.length > 0 && <section className="knowledge-result-group"><div className="knowledge-group-heading"><span><Link2 size={14} />Relações e profecias</span><small>{results.relationResults.length}</small></div><div className="knowledge-relation-results">{results.relationResults.map((relation) => <article key={relation.id}><span><Link2 size={13} />{relation.label}</span><p>{relation.explanation}</p><small>{relation.refs.join(" · ")}</small></article>)}</div></section>}
      </div>}

      <p className="knowledge-search-hint">Para um lugar, abra o verbete e use “Destacar no atlas”. O mapa preserva a leitura e centraliza a região em uma nova vista.</p>
    </section>
  );
}
