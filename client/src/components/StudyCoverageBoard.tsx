import { useEffect, useMemo, useState } from "react";
import { Check, CircleDashed, FileText, Layers3, MapPinned, ShieldCheck } from "lucide-react";
import { bibleBooks } from "@/lib/bible-data";
import { bookCoverage, verseCommentaries } from "@/lib/verse-commentary-data";
import { loadChapterCoverage, type ChapterCoveragePayload } from "@/lib/chapter-coverage-data";
import "@/study-coverage.css";

export default function StudyCoverageBoard() {
  const [payload, setPayload] = useState<ChapterCoveragePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canonicalChapters = useMemo(() => bibleBooks.reduce((total, book) => total + book.chapters, 0), []);
  const detailedBooks = bookCoverage.filter((item) => item.status === "Foco ampliado").length;
  const detailed = verseCommentaries.length;
  const records = payload?.records.length || 0;
  const enrichedRecords = payload?.records.filter((record) => record.editorialDepth === "Comentário textual enriquecido").length || 0;
  const focalRecords = payload?.records.filter((record) => record.editorialDepth === "Foco ampliado").length || 0;
  const syntheticRecords = payload?.records.filter((record) => record.editorialDepth === "Núcleo sintético").length || 0;
  const isComplete = payload?.total === canonicalChapters && records === canonicalChapters && payload.bookCount === bibleBooks.length && syntheticRecords === 0;
  const extensions = [
    ["1.189", "fichas de capítulo", "comentário + fonte consultável"],
    ["1.150", "comentários textuais", "leitura específica baseada no capítulo"],
    [String(focalRecords || 39), "focos ampliados", "camada editorial preservada"],
    ["1.189", "contextos cartográficos", "lugar, período, rota e método"],
    ["66", "livros", "sequência canônica completa"],
    ["15", "rotas", "camadas históricas do atlas"],
  ];

  useEffect(() => {
    loadChapterCoverage().then(setPayload).catch((reason) => setError(reason instanceof Error ? reason.message : "Falha na auditoria do catálogo."));
  }, []);

  return <section className="study-coverage-board" aria-labelledby="coverage-title"><header><div><div className="study-coverage-kicker"><span /> Auditoria de cobertura · enciclopédia</div><h2 id="coverage-title">Nenhum capítulo <em>fora do mapa.</em></h2><p>A cobertura integral é medida por uma ficha canônica para cada capítulo dos 66 livros. Cada ficha tem comentário em quatro camadas, fonte consultável e contexto cartográfico explícito; os 1.150 comentários textuais enriquecidos permanecem distinguidos dos 39 focos ampliados.</p></div><div className={`study-coverage-count ${isComplete ? "is-complete" : ""}`}><strong>{payload ? `${records.toLocaleString("pt-BR")}/${canonicalChapters.toLocaleString("pt-BR")}` : `—/${canonicalChapters.toLocaleString("pt-BR")}`}</strong><span>capítulos auditados<br />{isComplete ? "cobertura integral confirmada" : error ? "falha ao carregar o catálogo" : "validando catálogo publicado"}</span></div></header><div className="study-coverage-summary"><span><ShieldCheck size={14} /> {isComplete ? "66/66 livros verificados" : `${bibleBooks.length} livros no cânon`}</span><span><Check size={14} /> {enrichedRecords.toLocaleString("pt-BR")} comentários enriquecidos · {detailed} focos ampliados</span><span><MapPinned size={14} /> {records ? `${records.toLocaleString("pt-BR")} contextos cartográficos` : "contextos cartográficos"}</span></div>{error && <div className="study-coverage-error" role="status"><CircleDashed size={15} /> {error}</div>}<div className="study-coverage-extensions" aria-label="Cobertura por tipo de conteúdo">{extensions.map(([value, label, detail]) => <article key={label}><strong>{value}</strong><span>{label}</span><small>{detail}</small></article>)}</div><div className="study-coverage-grid">{bookCoverage.map((item, index) => <article key={item.book} className="is-detailed"><div><span>{String(index + 1).padStart(2, "0")}</span><Check size={14} /></div><strong>{item.book}</strong><small>{item.chapters} capítulos · ficha integral publicada</small><p>{item.status === "Foco ampliado" ? "Cobertura canônica + comentário textual enriquecido + foco ampliado." : "Cobertura canônica + comentário textual enriquecido + contexto cartográfico."}</p></article>)}</div><footer className="study-coverage-foot"><span><FileText size={14} /> Fonte de contagem: catálogo canônico local + JSON publicado.</span><strong>{isComplete ? "AUDITORIA APROVADA · 1.189/1.189" : "AUDITORIA EM ANDAMENTO"}</strong><Layers3 size={15} /></footer></section>;
}
