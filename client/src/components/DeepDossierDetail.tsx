import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, ListTree, Save, Search, ShieldCheck } from "lucide-react";
import { Streamdown } from "streamdown";
import { bibleBooks, type Book } from "@/lib/bible-data";
import { DEEP_DOSSIER_CATALOG_URL, canonicalDeepBookKey, normalizeDeepDossierPayload, type DeepDossierRecord } from "@/lib/deep-dossier-data";
import "@/deep-dossier-reader.css";

type Props = {
  book: Book;
  close: () => void;
  openBook?: (book: Book) => void;
  saved?: boolean;
  save?: () => void;
  note?: string;
  setNote?: (value: string) => void;
};

export default function DeepDossierDetail({ book, close, openBook, saved = false, save, note = "", setNote }: Props) {
  const [record, setRecord] = useState<DeepDossierRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const index = bibleBooks.findIndex((item) => item.id === book.id);
  const filteredHeadings = useMemo(() => (record?.headings || []).filter((heading) => !query.trim() || heading.toLowerCase().includes(query.toLowerCase().trim())), [record, query]);
  const wordCount = record?.markdown.trim().split(/\s+/).length || 0;
  const minutes = Math.max(8, Math.round(wordCount / 220));

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetch(DEEP_DOSSIER_CATALOG_URL)
      .then((response) => { if (!response.ok) throw new Error("O dossiê integral não pôde ser carregado."); return response.json(); })
      .then((payload) => {
        if (!alive) return;
        const catalog = normalizeDeepDossierPayload(payload);
        setRecord(catalog[canonicalDeepBookKey(book.name)] || null);
        if (!catalog[canonicalDeepBookKey(book.name)]) setError(`O dossiê integral de ${book.name} ainda não está associado ao catálogo.`);
      })
      .catch((reason) => alive && setError(reason instanceof Error ? reason.message : "Falha ao carregar o dossiê integral."))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [book.name]);

  const previous = index > 0 ? bibleBooks[index - 1] : null;
  const next = index >= 0 && index < bibleBooks.length - 1 ? bibleBooks[index + 1] : null;

  return <section className="deep-dossier-page">
    <div className="deep-dossier-topbar">
      <button className="back-action" onClick={close}><ArrowLeft size={15} /> Voltar aos 66 livros</button>
      <div className="deep-dossier-actions"><span>Enciclopédia integral · {String(index + 1).padStart(2, "0")}/66</span>{save && <button className={`deep-save ${saved ? "is-saved" : ""}`} onClick={save}>{saved ? <CheckCircle2 size={15} /> : <Save size={15} />}{saved ? "Salvo" : "Salvar"}</button>}</div>
    </div>
    <header className="deep-dossier-hero">
      <div><span className="deep-dossier-kicker">{book.testament} · {book.category} · {book.chapters} capítulos</span><h1>{book.name}</h1><p>{book.summary}</p></div>
      <div className="deep-dossier-proof"><span><BookOpen size={15} /> Leitura desenvolvida</span><strong>Contexto + texto + conexões</strong><small>Sem substituir debate por uma frase</small></div>
    </header>
    {loading && <div className="deep-dossier-loading"><BookOpen size={18} /> Carregando o texto integral de {book.name}…</div>}
    {error && <div className="deep-dossier-error"><ShieldCheck size={18} /><div><strong>Conteúdo não disponível nesta carga</strong><p>{error}</p></div></div>}
    {record && <>
      <div className="deep-dossier-stats"><div><strong>{record.sectionCount}</strong><span>seções</span></div><div><strong>{record.longParagraphCount}</strong><span>blocos desenvolvidos</span></div><div><strong>{wordCount.toLocaleString("pt-BR")}</strong><span>palavras</span></div><div><strong>{minutes} min</strong><span>leitura estimada</span></div></div>
      <div className="deep-dossier-layout">
        <aside className="deep-dossier-index"><div className="deep-index-heading"><span><ListTree size={15} /> Índice do dossiê</span><small>{filteredHeadings.length}/{record.headings.length}</small></div><div className="deep-index-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar seções…" aria-label="Filtrar seções do dossiê" /></div><nav>{filteredHeadings.map((heading, headingIndex) => <a href={`#deep-section-${headingIndex}`} key={`${heading}-${headingIndex}`}>{String(headingIndex + 1).padStart(2, "0")} · {heading}</a>)}</nav><div className="deep-index-method"><ShieldCheck size={16} /><p>O texto distingue reconstrução histórica, interpretação, tradição confessional e hipótese.</p></div></aside>
        <article className="deep-dossier-reading"><div className="deep-reading-header"><span>Texto principal</span><span><Clock3 size={14} /> {minutes} min de leitura</span></div><div className="deep-reading-prose"><Streamdown>{record.markdown}</Streamdown></div></article>
      </div>
      {setNote && <section className="deep-dossier-notes"><div><span>Anotação de pesquisa</span><h2>O que este livro <em>explica?</em></h2><p>Registre conexões, objeções e perguntas que surgirem durante a leitura.</p></div><div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={`Anote uma pergunta sobre ${book.name}…`} aria-label={`Anotação de pesquisa sobre ${book.name}`} /><small>{note ? `${note.length} caracteres nesta sessão` : "Notas desta sessão"}</small></div></section>}
      <nav className="deep-dossier-next" aria-label="Navegar entre os livros">{previous ? <button onClick={() => openBook?.(previous)}><ArrowLeft size={15} /><span><small>Livro anterior</small><strong>{previous.name}</strong></span></button> : <span />}{next ? <button onClick={() => openBook?.(next)}><span><small>Próximo livro</small><strong>{next.name}</strong></span><ArrowRight size={15} /></button> : <span />}</nav>
    </>}
  </section>;
}
