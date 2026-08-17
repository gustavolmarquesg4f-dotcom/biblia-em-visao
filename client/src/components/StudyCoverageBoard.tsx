// Cartografia de Leituras: mapa de cobertura honesto para os comentários versículo a versículo.

import { Check, CircleDashed, FileText } from "lucide-react";
import { bookCoverage } from "@/lib/verse-commentary-data";
import "@/study-coverage.css";

export default function StudyCoverageBoard() {
  const detailed = bookCoverage.filter(item => item.status === "Foco detalhado").length;
  const chapters = bookCoverage.reduce((total, item) => total + item.chapters, 0);
  const extensions = [
    ["119", "biografias", "personagens e profetas"],
    ["26", "lugares", "atlas e focos geográficos"],
    ["19", "estudos", "leituras profundas indexadas"],
    ["11", "períodos", "história bíblica cronológica"],
    ["10", "apócrifos", "textos e recepção"],
  ];
  return <section className="study-coverage-board" aria-labelledby="coverage-title"><header><div><div className="study-coverage-kicker"><span /> Auditoria de cobertura · enciclopédia</div><h2 id="coverage-title">Profundidade com <em>transparência.</em></h2><p>O painel mostra o que já foi indexado e o que ainda pede expansão editorial. Cobertura significa que há um caminho de estudo disponível; não significa que todo versículo já recebeu comentário exaustivo.</p></div><div className="study-coverage-count"><strong>{detailed}</strong><span>livros com foco<br />detalhado</span></div></header><div className="study-coverage-summary"><span><Check size={14} /> {detailed} com comentário focal</span><span><CircleDashed size={14} /> {bookCoverage.length - detailed} em expansão</span><span><FileText size={14} /> {chapters} capítulos indexados</span></div><div className="study-coverage-extensions" aria-label="Cobertura por tipo de conteúdo">{extensions.map(([value, label, detail]) => <article key={label}><strong>{value}</strong><span>{label}</span><small>{detail}</small></article>)}</div><div className="study-coverage-grid">{bookCoverage.map((item, index) => <article key={item.book} className={item.status === "Foco detalhado" ? "is-detailed" : ""}><div><span>{String(index + 1).padStart(2, "0")}</span>{item.status === "Foco detalhado" ? <Check size={14} /> : <CircleDashed size={14} />}</div><strong>{item.book}</strong><small>{item.chapters} capítulos · {item.status}</small><p>{item.note}</p></article>)}</div></section>;
}
