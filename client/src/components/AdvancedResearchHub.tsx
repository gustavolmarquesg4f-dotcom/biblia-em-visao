import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, ExternalLink, Filter, Search, ShieldCheck } from "lucide-react";
import { advancedResearchModules, type ResearchModule } from "@/lib/advanced-research-data";

type AdvancedResearchHubProps = {
  go: (view: "apocalypse" | "library" | "bibliography") => void;
};

export default function AdvancedResearchHub({ go }: AdvancedResearchHubProps) {
  const [activeId, setActiveId] = useState(advancedResearchModules[0].id);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const categories = ["Todos", ...Array.from(new Set(advancedResearchModules.map(module => module.category)))];
  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return advancedResearchModules.filter(module => {
      const inCategory = category === "Todos" || module.category === category;
      const haystack = [module.title, module.category, module.lede, module.depth, ...module.topics].join(" ").toLowerCase();
      return inCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, query]);
  const active = advancedResearchModules.find(module => module.id === activeId) || filtered[0] || advancedResearchModules[0];

  const chooseCategory = (next: string) => {
    setCategory(next);
    const nextModule = advancedResearchModules.find(module => next === "Todos" || module.category === next);
    if (nextModule) setActiveId(nextModule.id);
  };

  return <section className="advanced-research-hub page-section">
    <header className="research-hub-header">
      <div>
        <div className="research-hub-kicker"><span /> Pesquisa bíblica avançada · 10 eixos</div>
        <h2>Não pare no resumo.<br /><em>Entre nas fontes.</em></h2>
        <p>Um centro de pesquisa para estudar transmissão textual, línguas, arqueologia, história, gêneros, Jesus, igreja primitiva e teologia pentecostal com método e limites de certeza.</p>
      </div>
      <div className="research-hub-seal"><strong>10</strong><span>eixos<br />de pesquisa</span></div>
    </header>
    <div className="research-hub-tools">
      <label className="research-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar em temas, métodos e fontes..." aria-label="Buscar nos módulos de pesquisa" /></label>
      <div className="research-filters" aria-label="Filtrar módulos"><Filter size={15} />{categories.map(item => <button type="button" key={item} className={category === item ? "is-active" : ""} onClick={() => chooseCategory(item)}>{item}</button>)}</div>
    </div>
    <div className="research-hub-layout">
      <aside className="research-module-list" aria-label="Módulos de pesquisa">
        {filtered.map((module, index) => <button type="button" key={module.id} className={module.id === active.id ? "is-active" : ""} onClick={() => setActiveId(module.id)}><span>{module.number || String(index + 1).padStart(2, "0")}</span><div><small>{module.category}</small><strong>{module.title}</strong></div><ArrowRight size={14} /></button>)}
        {!filtered.length && <p className="research-empty">Nenhum eixo encontrado. Tente “manuscrito”, “profetas” ou “Jesus”.</p>}
      </aside>
      <article className="research-module-detail">
        <div className="research-detail-top"><div><span>{active.category}</span><h3>{active.title}</h3></div><ShieldCheck size={20} /></div>
        <p className="research-lede">{active.lede}</p>
        <div className="research-long-grid"><div><span>O que entra no dossiê</span><p>{active.depth}</p></div><div><span>Como pesquisar</span><p>{active.method}</p></div></div>
        <div className="research-topic-row"><span>Índice de termos</span>{active.topics.map(topic => <b key={topic}>{topic}</b>)}</div>
        <div className="research-sources"><div className="research-sources-heading"><span>Fontes para começar</span><small>links externos · leitura rastreável</small></div>{active.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><BookOpen size={15} /><span>{source.label}</span><ExternalLink size={14} /></a>)}</div>
        <div className="research-hub-actions"><button type="button" onClick={() => go("library")}>Abrir os 66 livros <ArrowRight size={15} /></button><button type="button" onClick={() => go("apocalypse")}>Abrir escatologia completa <ArrowRight size={15} /></button><button type="button" onClick={() => go("bibliography")}>Ver bibliografia geral <ArrowRight size={15} /></button></div>
      </article>
    </div>
  </section>;
}
