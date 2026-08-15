import { useMemo, useState } from "react";
import { ArrowRight, BookMarked, ExternalLink, Layers3, ScrollText, ShieldCheck } from "lucide-react";
import { apocryphaEntries, apocryphaSources, canonLenses, type ApocryphaEntry, type CanonLens } from "@/lib/apocrypha-data";
import type { JourneyView } from "@/components/JourneyNavigator";
import "@/apocrypha-hub.css";

export default function ApocryphaHub({ go }: { go: (view: JourneyView) => void }) {
  const [lens, setLens] = useState<CanonLens | "all">("all");
  const [activeId, setActiveId] = useState(apocryphaEntries[0].id);
  const entries = useMemo(() => lens === "all" ? apocryphaEntries : apocryphaEntries.filter(entry => entry.lenses.includes(lens)), [lens]);
  const active = entries.find(entry => entry.id === activeId) || entries[0];
  return <section className="apocrypha-hub page-section">
    <header className="apocrypha-hub__hero"><div><span className="apocrypha-hub__kicker"><ScrollText size={14} /> Cânon, recepção e Segundo Templo</span><h1>Além dos 66.<br /><em>Outras bibliotecas em diálogo.</em></h1><p>Esta área não acrescenta livros ao cânon protestante da plataforma. Ela oferece contexto para textos deuterocanônicos, apócrifos e obras judaicas antigas que moldam a história de leitura da Bíblia.</p></div><div className="apocrypha-hub__seal"><strong>10</strong><span>textos e<br />coleções-guia</span></div></header>
    <section className="apocrypha-hub__method"><ShieldCheck size={18} /><div><strong>Como esta seção lê</strong><p>Use cada rótulo para distinguir status canônico, circulação antiga, recepção e discussão histórica. “Apócrifo” não funciona do mesmo modo em todas as tradições.</p></div><button type="button" onClick={() => go("canon")}>Ver comparação de cânones <ArrowRight size={15} /></button></section>
    <div className="apocrypha-hub__layout"><aside className="apocrypha-hub__index"><span>Filtro de recepção</span><button className={lens === "all" ? "is-active" : ""} onClick={() => setLens("all")}>Todas as coleções <em>{apocryphaEntries.length}</em></button>{canonLenses.map(item => <button key={item.id} className={lens === item.id ? "is-active" : ""} onClick={() => setLens(item.id)}><div><strong>{item.label}</strong><small>{item.note}</small></div><em>{apocryphaEntries.filter(entry => entry.lenses.includes(item.id)).length}</em></button>)}<div className="apocrypha-hub__index-note"><Layers3 size={15} /> Filtrar não decide autoridade; apenas mostra como as coleções são recebidas e estudadas.</div></aside>
      <main className="apocrypha-hub__content"><div className="apocrypha-hub__catalog-head"><div><span>Catálogo comparativo</span><h2>{entries.length} portas para <em>uma época plural.</em></h2></div><p>Selecione um verbete para cruzar gênero, período, uso e pergunta histórica.</p></div><div className="apocrypha-hub__catalog">{entries.map((entry, index) => <button key={entry.id} className={entry.id === active.id ? "is-active" : ""} onClick={() => setActiveId(entry.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{entry.collection} · {entry.period}</small><strong>{entry.title}</strong><em>{entry.genre}</em></div><ArrowRight size={15} /></button>)}</div>{active && <ApocryphaDetail entry={active} />}</main></div>
    <footer className="apocrypha-hub__sources"><div><span>Rastro de pesquisa</span><h2>Continue pelas <em>fontes.</em></h2></div><div>{apocryphaSources.map(source => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><ExternalLink size={15} /><span><small>{source.kind}</small>{source.label}</span><ArrowRight size={14} /></a>)}</div></footer>
  </section>;
}

function ApocryphaDetail({ entry }: { entry: ApocryphaEntry }) {
  return <article className="apocrypha-detail"><header><div><span>{entry.collection}</span><h2>{entry.title}</h2><p>{entry.summary}</p></div><BookMarked size={28} /></header><div className="apocrypha-detail__grid"><div><span>Pergunta histórica</span><p>{entry.historicalQuestion}</p></div><div><span>Recepção</span><p>{entry.reception}</p></div></div><footer><span>Âncoras de leitura</span><strong>{entry.references}</strong></footer></article>;
}
