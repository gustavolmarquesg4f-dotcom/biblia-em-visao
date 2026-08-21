import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CircleHelp, ExternalLink, GitBranch, Loader2, Search, ShieldCheck } from "lucide-react";
import { Streamdown } from "streamdown";
import type { Book } from "@/lib/bible-data";
import { bibleBooks } from "@/lib/bible-data";
import { canonicalBookKey } from "@/lib/advanced-book-data";
import { canonicalExegesisKey, loadExegesisData, type ExegesisDossier } from "@/lib/exegesis-data";
import "@/exegesis-reader.css";

type Props = { book: Book; onOpenBook?: (name: string) => void };
type ReaderTab = "chapters" | "prophecies" | "method";

function bookFromReference(reference: string) {
  const ordered = [...bibleBooks].sort((a, b) => b.name.length - a.name.length);
  return ordered.find(book => canonicalExegesisKey(reference).startsWith(canonicalExegesisKey(book.name)));
}

function ReferenceChip({ reference, onOpenBook }: { reference: string; onOpenBook?: (name: string) => void }) {
  const target = bookFromReference(reference);
  return target && onOpenBook ? <button type="button" className="exegesis-reference-chip" onClick={() => onOpenBook(target.name)}>{reference}<ArrowRight size={12} /></button> : <span className="exegesis-reference-chip exegesis-reference-chip--static">{reference}</span>;
}

export default function ExegesisBookReader({ book, onOpenBook }: Props) {
  const [dossier, setDossier] = useState<ExegesisDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<ReaderTab>("chapters");
  const [chapterNumber, setChapterNumber] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    loadExegesisData().then(payload => {
      if (!alive) return;
      const found = payload.dossiers.find(item => canonicalExegesisKey(item.book_name) === canonicalBookKey(book.name));
      if (!found) throw new Error("Este livro ainda não possui o dossiê exegético carregado.");
      setDossier(found);
      setChapterNumber(found.chapters[0]?.chapter || 1);
    }).catch(reason => alive && setError(reason instanceof Error ? reason.message : "Falha ao abrir o comentário exegético.")).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [book.name]);

  const chapter = dossier?.chapters.find(item => item.chapter === chapterNumber) || dossier?.chapters[0];
  const filteredChapters = useMemo(() => dossier?.chapters.filter(item => !query || `${item.chapter} ${item.title} ${item.content}`.toLowerCase().includes(query.toLowerCase())) || [], [dossier, query]);
  const prophecyRefs = useMemo(() => {
    if (!dossier) return [];
    const refs = dossier.chapters.flatMap(item => item.prophetic_references).concat(dossier.prophecy_sections.flatMap(item => item.references));
    return Array.from(new Set(refs)).slice(0, 80);
  }, [dossier]);

  if (loading) return <div className="exegesis-loading"><Loader2 className="animate-spin" size={18} /> Carregando o comentário capítulo a capítulo…</div>;
  if (error || !dossier) return <div className="exegesis-error"><CircleHelp size={18} /><span>{error || "Dossiê exegético indisponível."}</span></div>;

  return <section className="exegesis-reader">
    <div className="exegesis-reader-heading">
      <div><span className="advanced-label">Exegese avançada · {dossier.chapters.length} capítulos</span><h2>Comentário de <em>{book.name}</em></h2><p>Leitura por capítulo com contexto, argumento, problemas interpretativos, relações proféticas e limites de certeza.</p></div>
      <div className="exegesis-confidence"><ShieldCheck size={16} /><span>Metodologia</span><strong>Texto · história · recepção</strong></div>
    </div>
    <div className="exegesis-tabs" role="tablist">
      <button type="button" className={tab === "chapters" ? "is-active" : ""} onClick={() => setTab("chapters")}><BookOpen size={15} /> Capítulos</button>
      <button type="button" className={tab === "prophecies" ? "is-active" : ""} onClick={() => setTab("prophecies")}><GitBranch size={15} /> Profecias e relações</button>
      <button type="button" className={tab === "method" ? "is-active" : ""} onClick={() => setTab("method")}><ShieldCheck size={15} /> Método e fontes</button>
    </div>
    {tab === "chapters" && <div className="exegesis-chapter-layout">
      <aside className="exegesis-chapter-sidebar"><div className="exegesis-sidebar-label">Índice interno</div><div className="exegesis-search"><Search size={14} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar capítulo…" aria-label="Buscar capítulo" /></div><div className="exegesis-chapter-grid">{filteredChapters.map(item => <button type="button" key={item.chapter} className={item.chapter === chapter?.chapter ? "is-active" : ""} onClick={() => setChapterNumber(item.chapter)}><span>{String(item.chapter).padStart(2, "0")}</span><strong>{item.title || `Capítulo ${item.chapter}`}</strong>{item.prophetic && <GitBranch size={12} />}</button>)}</div></aside>
      <article className="exegesis-chapter-content">{chapter && <><div className="exegesis-chapter-kicker">Capítulo {chapter.chapter} · {book.name}</div><h3>{chapter.title || `Capítulo ${chapter.chapter}`}</h3><div className="exegesis-chapter-meta"><span>{chapter.references.length} referências detectadas</span>{chapter.prophetic && <span className="exegesis-prophecy-badge"><GitBranch size={12} /> relação profética</span>}</div><div className="exegesis-markdown"><Streamdown>{chapter.content}</Streamdown></div>{chapter.references.length > 0 && <div className="exegesis-reference-panel"><span>Referências e diálogos</span><div>{chapter.references.map(reference => <ReferenceChip key={reference} reference={reference} onOpenBook={onOpenBook} />)}</div></div>}<div className="exegesis-chapter-nav"><button type="button" disabled={chapter.chapter <= 1} onClick={() => setChapterNumber(value => Math.max(1, value - 1))}><ArrowLeft size={14} /> Anterior</button><button type="button" disabled={chapter.chapter >= dossier.chapters.length} onClick={() => setChapterNumber(value => Math.min(dossier.chapters.length, value + 1))}>Próximo <ArrowRight size={14} /></button></div></>}</article>
    </div>}
    {tab === "prophecies" && <div className="exegesis-prophecy-layout"><div className="exegesis-prophecy-intro"><span className="advanced-label">Grafo de referências</span><h3>Profecias não ficam isoladas.</h3><p>O sistema destaca referências reconhecidas no comentário, mas não presume que toda relação seja uma previsão direta. Cada ligação precisa ser lida como citação, alusão, tipologia, releitura ou aplicação posterior.</p><div className="exegesis-prophecy-legend"><span><i className="prophecy-dot prophecy-dot--text" /> Texto citado</span><span><i className="prophecy-dot prophecy-dot--interpretation" /> Relação interpretativa</span><span><i className="prophecy-dot prophecy-dot--debate" /> Debate</span></div></div><div className="exegesis-prophecy-list"><div className="exegesis-sidebar-label">Referências encontradas</div>{prophecyRefs.length === 0 && <p className="exegesis-muted">Nenhuma referência profética indexada nesta camada.</p>}{prophecyRefs.map(reference => <div className="exegesis-prophecy-edge" key={reference}><span>{book.name}</span><ArrowRight size={14} /><ReferenceChip reference={reference} onOpenBook={onOpenBook} /></div>)}</div><div className="exegesis-prophecy-sections">{dossier.prophecy_sections.map(section => <article key={section.title}><span>{section.title}</span><p>{section.content.slice(0, 420)}{section.content.length > 420 ? "…" : ""}</p></article>)}</div></div>}
    {tab === "method" && <div className="exegesis-method-layout"><article className="exegesis-method-card"><span className="advanced-label">Limites de confiança</span><h3>O que sabemos, debatemos e inferimos.</h3><p>{dossier.confidence_notes}</p><div className="method-legend"><span><i className="legend-dot legend-dot--blue" /> Texto e evidência</span><span><i className="legend-dot legend-dot--wine" /> Interpretação</span><span><i className="legend-dot legend-dot--gold" /> Hipótese ou tradição</span></div></article><article className="exegesis-method-card exegesis-method-card--sources"><span className="advanced-label">Fontes do dossiê</span>{dossier.source_sections.map(section => <div key={section.title}><strong>{section.title}</strong><p>{section.content.slice(0, 650)}{section.content.length > 650 ? "…" : ""}</p></div>)}<a href="#bibliografia" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Abrir bibliografia global <ExternalLink size={13} /></a></article></div>}
  </section>;
}
