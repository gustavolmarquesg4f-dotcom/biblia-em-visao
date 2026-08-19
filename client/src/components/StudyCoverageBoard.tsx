// Cartografia de Leituras: mapa de cobertura honesto para os comentários versículo a versículo.

// Cartografia de Leituras: mostrar com honestidade que dossiê integral e comentário focal capítulo a capítulo são camadas diferentes de profundidade.
import { Check, CircleDashed, FileText, Layers3 } from "lucide-react";
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
  return <section className="study-coverage-board" aria-labelledby="coverage-title"><header><div><div className="study-coverage-kicker"><span /> Auditoria de cobertura · enciclopédia</div><h2 id="coverage-title">Profundidade com <em>transparência.</em></h2><p>Todos os 66 livros possuem dossiê enciclopédico integral, com contexto, estrutura, passagens, personagens, lugares, conexões e fontes. Comentário focal por capítulo é uma camada adicional em expansão; não é a medida única de profundidade.</p></div><div className="study-coverage-count"><strong>66</strong><span>dossiês integrais<br />em leitura longa</span></div></header><div className="study-coverage-summary"><span><Layers3 size={14} /> 66 dossiês integrais</span><span><Check size={14} /> {detailed} com comentário focal</span><span><FileText size={14} /> {chapters} capítulos indexados</span></div><div className="study-coverage-extensions" aria-label="Cobertura por tipo de conteúdo">{extensions.map(([value, label, detail]) => <article key={label}><strong>{value}</strong><span>{label}</span><small>{detail}</small></article>)}</div><div className="study-coverage-grid">{bookCoverage.map((item, index) => <article key={item.book} className="is-detailed"><div><span>{String(index + 1).padStart(2, "0")}</span><Check size={14} /></div><strong>{item.book}</strong><small>{item.chapters} capítulos · dossiê integral</small><p>{item.status === "Foco detalhado" ? "Dossiê integral + comentários focais por capítulo." : "Dossiê integral com rota aprofundada por passagens; comentários focais continuam sendo ampliados."}</p></article>)}</div></section>;
}
