// Cartografia de Leituras: mapa de cobertura honesto para os comentários versículo a versículo.

import { Check, CircleDashed, FileText } from "lucide-react";
import { bookCoverage } from "@/lib/verse-commentary-data";
import "@/study-coverage.css";

export default function StudyCoverageBoard() {
  const detailed = bookCoverage.filter(item => item.status === "Foco detalhado").length;
  return <section className="study-coverage-board" aria-labelledby="coverage-title"><header><div><div className="study-coverage-kicker"><span /> Auditoria de cobertura · 66 livros</div><h2 id="coverage-title">Profundidade com <em>transparência.</em></h2><p>O catálogo integral de capítulos continua disponível nos dossiês. Este painel separa os focos versículo a versículo já desenvolvidos dos livros que ainda aguardam o próximo lote editorial.</p></div><div className="study-coverage-count"><strong>{detailed}</strong><span>livros com foco<br />detalhado</span></div></header><div className="study-coverage-summary"><span><Check size={14} /> {detailed} com comentário focal</span><span><CircleDashed size={14} /> {bookCoverage.length - detailed} em expansão</span><span><FileText size={14} /> {bookCoverage.reduce((total, item) => total + item.chapters, 0)} capítulos indexados</span></div><div className="study-coverage-grid">{bookCoverage.map((item, index) => <article key={item.book} className={item.status === "Foco detalhado" ? "is-detailed" : ""}><div><span>{String(index + 1).padStart(2, "0")}</span>{item.status === "Foco detalhado" ? <Check size={14} /> : <CircleDashed size={14} />}</div><strong>{item.book}</strong><small>{item.chapters} capítulos · {item.status}</small><p>{item.note}</p></article>)}</div></section>;
}
