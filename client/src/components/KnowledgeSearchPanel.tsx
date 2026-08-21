import { useEffect, useState } from "react";
import { BookOpen, ChevronRight, Link2, Network, Search, UserRound, X } from "lucide-react";
import { bibleBooks, type Book } from "@/lib/bible-data";
import { searchKnowledge, type KnowledgeEntity } from "@/lib/entity-graph";
import "@/entity-network.css";
import { loadBiographyCatalog } from "@/lib/biography-data";
import PropheticGraph from "@/components/PropheticGraph";
import { questionGuides } from "@/lib/question-guides";
import "@/question-search.css";

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

function cleanEntitySnippet(value: string) {
  return value
    .replace(/\\\[\d+\\\]/g, "")
    .replace(/\[\d+\]/g, "")
    .replace(/\\([*_`[\]()>#+\-.!])/g, "$1")
    .replace(/\*{1,2}|_{1,2}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function KnowledgeSearchPanel({ openBook, onOpenEntity, onFocusPlace }: Props) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [showGraph, setShowGraph] = useState(false);
  const [, setCatalogVersion] = useState(0);
  useEffect(() => { loadBiographyCatalog().then(() => setCatalogVersion((value) => value + 1)).catch(() => undefined); }, []);
  const results = searchKnowledge(query, kind);
  const total = results.entityResults.length + results.bookResults.length + results.relationResults.length;
  const normalizedQuestion = query.toLocaleLowerCase("pt-BR");
  const questionMatch = questionGuides.find((guide) => guide.keywords.some((keyword) => normalizedQuestion.includes(keyword)));
  const openQuestionBook = () => { const book = bibleBooks.find((item) => item.name === questionMatch?.book); if (book) openBook?.(book); };

  return <section className="knowledge-search-page page-section">
    <div className="page-intro">
      <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-number">14</span><span>Grafo bíblico pesquisável</span></div>
      <div className="page-title-row"><div><h1>Pergunte como você fala.<br /><em>Encontre uma rede.</em></h1><p>Pesquise perguntas, pessoas, lugares, livros e relações teológicas ou proféticas. Cada resultado abre um verbete com contexto, fontes e relações.</p></div><div className="knowledge-search-count"><strong>{total}</strong><span>resultados<br />indexados</span></div></div>
    </div>

    <div className="knowledge-search-bar"><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: Por que Jó sofreu? O que é graça? Quem é Melquisedeque?" aria-label="Perguntar ou buscar na rede bíblica" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca"><X size={15} /></button>}</div>
    {!query && <section className="question-guides" aria-label="Perguntas para começar"><span>Comece com uma pergunta humana</span><div className="question-guides__chips">{questionGuides.map((guide) => <button type="button" key={guide.question} onClick={() => setQuery(guide.question)}>{guide.question}</button>)}</div></section>}
    {query && questionMatch && <section className="question-answer" aria-live="polite"><span>Resposta enciclopédica inicial</span><h2>{questionMatch.question}</h2><p>{questionMatch.answer}</p><div className="question-answer__foot"><div><div className="question-answer__refs">{questionMatch.references.map((reference) => <span key={reference}>{reference}</span>)}</div><small>{questionMatch.next}</small></div>{questionMatch.book && <button type="button" className="question-answer__book" onClick={openQuestionBook}>Abrir {questionMatch.book} <ChevronRight size={14} /></button>}</div></section>}
    <div className="knowledge-filter-row" role="tablist" aria-label="Filtrar resultados">{kinds.map((item) => <button type="button" key={item.id} className={kind === item.id ? "is-active" : ""} onClick={() => setKind(item.id)} role="tab" aria-selected={kind === item.id}>{item.label}</button>)}</div>
    <div className="knowledge-graph-launch"><button type="button" className={showGraph ? "is-active" : ""} onClick={() => setShowGraph((value) => !value)}><Network size={15} />{showGraph ? "Fechar grafo visual" : "Abrir grafo visual"}</button><span>Explore as conexões em vez de apenas listá-las.</span></div>
    {showGraph && <PropheticGraph onOpenEntity={onOpenEntity} />}

    {!query && <div className="knowledge-search-empty"><Network size={22} /><strong>Comece por uma pergunta, entidade ou relação</strong><p>Experimente “Por que Jó sofreu?”, “O que é graça?”, “Adão”, “Jerusalém”, “Babilônia”, “Paulo” ou “aliança”.</p></div>}
    {query && total === 0 && !questionMatch && <div className="knowledge-search-empty"><Search size={22} /><strong>Nenhuma conexão encontrada</strong><p>Tente o nome de um livro, personagem, lugar, tema, referência bíblica ou uma das perguntas sugeridas.</p></div>}

    {query && total > 0 && <div className="knowledge-result-groups">
      {results.entityResults.length > 0 && <section className="knowledge-result-group"><div className="knowledge-group-heading"><span><UserRound size={14} />Verbetes de entidades</span><small>{results.entityResults.length}</small></div><div className="knowledge-result-grid">{results.entityResults.map((entity) => { const Icon = iconFor(entity.kind); return <button type="button" className="knowledge-result-card" key={entity.id} onClick={() => onOpenEntity(entity.id)}><span className={`knowledge-result-kind knowledge-result-kind--${entity.kind}`}><Icon size={13} />{entity.kind === "person" ? "Pessoa" : "Lugar"}</span><h2>{entity.name}</h2><p>{cleanEntitySnippet(entity.summary)}</p><span className="knowledge-result-meta">{entity.books.slice(0, 3).join(" · ")}</span><ChevronRight size={15} /></button>; })}</div></section>}
      {results.bookResults.length > 0 && <section className="knowledge-result-group"><div className="knowledge-group-heading"><span><BookOpen size={14} />Livros</span><small>{results.bookResults.length}</small></div><div className="knowledge-book-results">{results.bookResults.map((book) => <button type="button" key={book.id} onClick={() => openBook?.(book)}><BookOpen size={14} /><span><strong>{book.name}</strong><small>{cleanEntitySnippet(book.summary)}</small></span><ChevronRight size={15} /></button>)}</div></section>}
      {results.relationResults.length > 0 && <section className="knowledge-result-group"><div className="knowledge-group-heading"><span><Link2 size={14} />Relações e profecias</span><small>{results.relationResults.length}</small></div><div className="knowledge-relation-results">{results.relationResults.map((relation) => <article key={relation.id}><span><Link2 size={13} />{relation.label}</span><p>{relation.explanation}</p><small>{relation.refs.join(" · ")}</small></article>)}</div></section>}
    </div>}
    <p className="knowledge-search-hint">Para um lugar, abra o verbete e use “Destacar no atlas”. O mapa preserva a leitura e centraliza a região em uma nova vista.</p>
  </section>;
}
