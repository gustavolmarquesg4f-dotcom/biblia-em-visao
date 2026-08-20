import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Layers3, Loader2, MapPinned, Route, Search, ShieldCheck } from "lucide-react";
import type { Book } from "@/lib/bible-data";
import { chapterCoverageForBook, loadChapterCoverage, type ChapterCoverageRecord } from "@/lib/chapter-coverage-data";
import "@/chapter-coverage-reader.css";

type Props = {
  book: Book;
  onFocusPlace?: (placeId: string) => void;
};

const layerLabels = [
  ["Texto", "textLayer"],
  ["Contexto", "contextLayer"],
  ["Interpretação", "interpretationLayer"],
  ["Leitura pentecostal / IDB", "pentecostalLayer"],
] as const;
const depthLabel = (depth: ChapterCoverageRecord["editorialDepth"]) => depth === "Foco ampliado" ? "foco ampliado" : depth === "Comentário textual enriquecido" ? "comentário textual" : "núcleo";
const depthClass = (depth: ChapterCoverageRecord["editorialDepth"]) => depth === "Foco ampliado" ? "is-focus" : depth === "Comentário textual enriquecido" ? "is-enriched" : "";

export default function ChapterCoverageReader({ book, onFocusPlace }: Props) {
  const readChapterFromUrl = () => { if (typeof window === "undefined") return 1; const value = Number(new URLSearchParams(window.location.search).get("cap")); return Number.isInteger(value) && value > 0 ? value : 1; };
  const [chapters, setChapters] = useState<ChapterCoverageRecord[]>([]);
  const [activeChapter, setActiveChapter] = useState(() => readChapterFromUrl());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    loadChapterCoverage()
      .then((payload) => {
        if (!alive) return;
        const nextChapters = chapterCoverageForBook(payload, book.name);
        setChapters(nextChapters);
        const requestedChapter = readChapterFromUrl();
        setActiveChapter(nextChapters.some((chapter) => chapter.chapter === requestedChapter) ? requestedChapter : 1);
      })
      .catch((reason) => alive && setError(reason instanceof Error ? reason.message : "Falha ao carregar o comentário por capítulo."))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [book.name]);

  useEffect(() => { const onPopState = () => setActiveChapter(readChapterFromUrl()); window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, [book.id]);
  const navigateChapter = (chapter: number, mode: "push" | "replace" = "push") => { setActiveChapter(chapter); if (typeof window !== "undefined") { const url = new URL(window.location.href); if (chapter === 1) url.searchParams.delete("cap"); else url.searchParams.set("cap", String(chapter)); window.history[`${mode}State`]({}, "", `${url.pathname}${url.search}${url.hash}`); } };
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return chapters.filter((chapter) => !normalized || `${chapter.chapter} ${chapter.title} ${chapter.textLayer} ${chapter.contextLayer} ${chapter.cartography.placeLabel}`.toLowerCase().includes(normalized));
  }, [chapters, query]);
  const active = chapters.find((chapter) => chapter.chapter === activeChapter) || chapters[0];
  const activeIndex = active ? chapters.findIndex((chapter) => chapter.chapter === active.chapter) : -1;
  const hasCompleteBookCoverage = chapters.length === book.chapters && chapters.every((chapter, index) => chapter.chapter === index + 1);

  if (loading) return <section className="chapter-coverage-reader chapter-coverage-reader--loading"><Loader2 size={18} className="chapter-coverage-spin" /><span>Carregando os {book.chapters} capítulos de {book.name}…</span></section>;
  if (error || !active) return <section className="chapter-coverage-reader chapter-coverage-reader--error"><ShieldCheck size={18} /><div><strong>Comentário integral indisponível nesta carga</strong><p>{error || `Não há ficha publicada para ${book.name}.`}</p></div></section>;

  return <section id={`chapter-coverage-${book.id}`} className="chapter-coverage-reader" aria-labelledby={`chapter-coverage-title-${book.id}`}>
    <header className="chapter-coverage-header">
      <div>
        <span className="chapter-coverage-kicker"><BookOpen size={14} /> Comentário navegável · cobertura auditada</span>
        <h2 id={`chapter-coverage-title-${book.id}`}>Capítulo a capítulo, <em>sem lacunas.</em></h2>
        <p>As fichas abaixo distinguem texto, contexto, interpretação e recepção pentecostal/IDB. Quando o atlas não oferece uma localização direta, a aproximação é declarada no próprio registro.</p>
        <a className="chapter-coverage-jump" href={`#chapter-coverage-${book.id}-index`}>Ir direto ao índice de capítulos <ArrowRight size={14} /></a>
      </div>
      <div className={`chapter-coverage-proof ${hasCompleteBookCoverage ? "is-complete" : "is-incomplete"}`}><ShieldCheck size={16} /><strong>{chapters.length}/{book.chapters}</strong><span>capítulos deste livro</span><small>{hasCompleteBookCoverage ? "sequência canônica íntegra" : "verificação pendente"}</small></div>
    </header>

    <div className="chapter-coverage-method"><span><ShieldCheck size={14} /> Verificação estrutural</span><strong>{hasCompleteBookCoverage ? `1–${book.chapters} presentes e ordenados` : "A sequência precisa de revisão"}</strong><span><Layers3 size={14} /> Camadas por ficha</span><strong>4 comentários + fontes</strong></div>

    <div className="chapter-coverage-layout">
      <aside id={`chapter-coverage-${book.id}-index`} className="chapter-coverage-index" aria-label={`Índice de capítulos de ${book.name}`}>
        <div className="chapter-coverage-index-head"><div><span>Índice canônico</span><strong>{filtered.length} de {chapters.length}</strong></div><label><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar capítulo ou lugar" aria-label={`Buscar em ${book.name}`} /></label></div>
        <div className="chapter-coverage-grid">{filtered.map((chapter) => <button type="button" key={chapter.id} className={chapter.chapter === active.chapter ? "is-active" : ""} onClick={() => { navigateChapter(chapter.chapter); window.setTimeout(() => document.getElementById(`chapter-record-${book.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 10); }} aria-current={chapter.chapter === active.chapter ? "page" : undefined}><span>{String(chapter.chapter).padStart(2, "0")}</span><strong>{chapter.title}</strong><small>{chapter.cartography.placeLabel} · {depthLabel(chapter.editorialDepth)}</small></button>)}</div>
      </aside>

      <article className="chapter-coverage-record" id={`chapter-record-${book.id}`}>
        <div className="chapter-coverage-record-top"><div><span>{active.reference} · ficha {activeIndex + 1}/{chapters.length}</span><h3>{active.title}</h3></div><span className={`chapter-depth-badge ${depthClass(active.editorialDepth)}`}>{active.editorialDepth}</span></div>
        <div className="chapter-coverage-layers">{layerLabels.map(([label, key]) => <section key={key} className={`chapter-layer chapter-layer--${key.replace("Layer", "").toLowerCase()}`}><span>{label}</span><p>{active[key]}</p></section>)}</div>

        <section className="chapter-coverage-map-card" aria-label={`Contexto cartográfico de ${active.reference}`}>
          <div className="chapter-coverage-map-card-head"><div><span><MapPinned size={14} /> Contexto cartográfico por capítulo</span><h4>{active.cartography.placeLabel} <em>· {active.cartography.region}</em></h4></div><button type="button" onClick={() => onFocusPlace?.(`place-${active.cartography.placeId}`)} disabled={!onFocusPlace} title={onFocusPlace ? `Focar ${active.cartography.placeLabel} no atlas` : "Abra o atlas pelo menu para explorar o lugar"}><MapPinned size={14} /> Focar no atlas</button></div>
          <div className="chapter-map-grid"><div><span>Período</span><strong>{active.cartography.period}</strong></div><div><span>Rotas</span><strong>{active.cartography.routeLabels.join(" · ") || "Nenhuma rota específica"}</strong></div><div><span>Camadas imperiais</span><strong>{active.cartography.empireLabels.join(" · ") || "Sem camada imperial direta"}</strong></div></div>
          <p className="chapter-map-note">{active.cartography.note}</p><a href={active.cartography.source.url} target="_blank" rel="noreferrer"><Route size={13} /> {active.cartography.source.label} <ExternalLink size={12} /></a>
        </section>

        <div className="chapter-coverage-references"><div><span>Diálogos e referências</span><strong>{active.references.join(" · ")}</strong></div><div className="chapter-coverage-reference-links"><a href={active.source.url} target="_blank" rel="noreferrer">Abrir texto consultável <ExternalLink size={13} /></a>{active.textBasis && <a href={active.textBasis.url} target="_blank" rel="noreferrer">Base textual: {active.textBasis.label} <ExternalLink size={13} /></a>}</div></div>
        <div className="chapter-coverage-record-foot"><span><ShieldCheck size={14} /> Registro canônico, comentário e contexto cartográfico presentes.</span><div><button type="button" disabled={activeIndex <= 0} onClick={() => navigateChapter(chapters[activeIndex - 1]?.chapter || 1)}><ArrowLeft size={14} /> Anterior</button><button type="button" disabled={activeIndex >= chapters.length - 1} onClick={() => navigateChapter(chapters[activeIndex + 1]?.chapter || book.chapters)}>Próximo <ArrowRight size={14} /></button></div></div>
      </article>
    </div>
  </section>;
}
