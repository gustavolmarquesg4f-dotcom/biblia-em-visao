// Acervo de Sinais Vivos: esta camada oferece orientação instantânea e comando rápido sem retirar o leitor do contexto atual.
// Acervo de Sinais Vivos: o comando rápido aceita destinos, temas e referências bíblicas em linguagem natural.
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, BookOpen, Compass, FileText, History, Layers3, Map, Search, Sparkles, UsersRound, X } from "lucide-react";
import { parsePassageIntent, savePassageIntent } from "@/lib/passage-navigation";
import { recordJourneyRoute } from "@/lib/study-journey";
import "@/ux-futurist.css";

type Destination = { label: string; detail: string; href: string; icon: typeof Compass; keywords: string };

const destinations: Destination[] = [
  { label: "Ponto de partida", detail: "A visão geral da enciclopédia", href: "/", icon: Compass, keywords: "inicio começo visão geral panorama" },
  { label: "Comece aqui", detail: "Uma entrada orientada para quem está chegando", href: "/comece", icon: Compass, keywords: "orientação primeiro percurso porta" },
  { label: "Explorar os 66 livros", detail: "Dossiês, capítulos e trilhas de leitura", href: "/66-livros", icon: BookOpen, keywords: "livros biblia gênesis mateus capítulos biblioteca" },
  { label: "Roteiro dos 66 livros", detail: "Um caminho de leitura para cada livro", href: "/roteiro", icon: BookOpen, keywords: "roteiro leitura caminho estrutura livro" },
  { label: "Atlas e lugares", detail: "Cidades, regiões, rotas e impérios", href: "/atlas", icon: Map, keywords: "atlas mapa cidade região rota império" },
  { label: "Linha do tempo", detail: "Períodos, movimentos e transições", href: "/linha-do-tempo", icon: History, keywords: "linha tempo cronologia período história" },
  { label: "Cânones e textos", detail: "Transmissão, variantes e contexto textual", href: "/canon", icon: FileText, keywords: "canon cânone manuscrito texto transmissão" },
  { label: "Temas bíblicos", detail: "Palavras, fios de leitura e livros relacionados", href: "/temas", icon: Layers3, keywords: "tema temas aliança libertação justiça esperança" },
  { label: "Glossário", detail: "Línguas, termos e conceitos de contexto", href: "/glossario", icon: FileText, keywords: "glossário termos hebraico grego conceito" },
  { label: "Estudos profundos", detail: "Escatologia, Espírito, finanças e temas", href: "/estudos-profundos", icon: Layers3, keywords: "estudo escatologia espírito anjos trindade finanças" },
  { label: "Mesa de estudo", detail: "Notas, comentários, fichas e progresso", href: "/mesa", icon: Sparkles, keywords: "mesa notas favoritos comentários estudo cobertura" },
  { label: "Pessoas e povos", detail: "Biografias, relações e linhas de continuidade", href: "/pessoas", icon: UsersRound, keywords: "pessoa povo biografia personagem profeta" },
  { label: "História bíblica", detail: "Períodos, impérios, fontes e debates", href: "/historia", icon: History, keywords: "história período babilônia roma exílio" },
  { label: "Apócrifos e textos", detail: "Deuterocanônicos, recepção e diferenças de cânon", href: "/apocrifos", icon: BookOpen, keywords: "apócrifos deuterocanônicos macabeus sabedoria" },
  { label: "Apocalipse e escatologia", detail: "Símbolos, escolas interpretativas e esperança", href: "/apocalipse", icon: Layers3, keywords: "apocalipse escatologia milênio arrebatamento" },
  { label: "Pesquisa na rede", detail: "Perguntas, entidades e conexões", href: "/busca", icon: Search, keywords: "busca pergunta tema profecia referência" },
  { label: "Fontes e bibliografia", detail: "Rastrear fontes, limites e confiança", href: "/bibliografia", icon: FileText, keywords: "fontes bibliografia pesquisa acadêmica" },
];

const routeAliases: Record<string, string> = {
  "/": "/",
  "/comece": "/comece",
  "/66-livros": "/66-livros",
  "/roteiro": "/roteiro",
  "/mesa": "/mesa",
  "/atlas": "/atlas",
  "/estudos": "/estudos-profundos",
  "/percursos": "/estudos-profundos",
  "/estudos-profundos": "/estudos-profundos",
  "/pessoas": "/pessoas",
  "/povos": "/pessoas",
  "/pessoas-e-povos": "/pessoas",
  "/historia": "/historia",
  "/linha-do-tempo": "/linha-do-tempo",
  "/canon": "/canon",
  "/glossario": "/glossario",
  "/temas": "/temas",
  "/apocrifos": "/apocrifos",
  "/deuterocanonicos": "/apocrifos",
  "/apocalipse": "/apocalipse",
  "/escatologia": "/apocalipse",
  "/apocalypse": "/apocalipse",
  "/busca": "/busca",
  "/bibliografia": "/bibliografia",
};

function routeContext(location: string) {
  const canonicalPath = routeAliases[location] || (location.startsWith("/livro/") ? "/66-livros" : location);
  const current = destinations.find((item) => item.href === canonicalPath) || destinations[0];
  const currentIndex = destinations.findIndex((item) => item.href === current.href);
  return { current, next: destinations[(currentIndex + 1) % destinations.length] };
}

export default function ExperienceCommandLayer() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(0);
  const { current, next } = routeContext(location.split("?")[0]);
  const passage = useMemo(() => parsePassageIntent(query), [query]);
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return destinations;
    return destinations.filter((item) => `${item.label} ${item.detail} ${item.keywords}`.toLocaleLowerCase("pt-BR").includes(normalized));
  }, [query]);
  const navigate = (href: string) => { setLocation(href); setOpen(false); setQuery(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openPassage = () => { if (!passage) return; savePassageIntent(passage); navigate("/mesa"); };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing = target?.matches("input, textarea, select, [contenteditable='true']");
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen((value) => !value); }
      if (!editing && event.key === "/") { event.preventDefault(); setOpen(true); }
      if (event.key === "Escape") { setOpen(false); setQuery(""); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(() => { const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); setProgress(Math.min(100, Math.round((window.scrollY / max) * 100))); }); };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("scroll", updateProgress); window.removeEventListener("resize", updateProgress); };
  }, [location]);

  useEffect(() => { recordJourneyRoute(location.split("?")[0], current.label); }, [current.label, location]);

  return <>
    <div className="signal-page-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress / 100})` }} /><i>{progress}%</i></div>
    <button type="button" className="signal-launcher" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
      <span className="signal-launcher__pulse" aria-hidden="true" /><Compass size={17} /><span><small>Você está em</small><strong>{current.label}</strong></span><kbd>⌘ K</kbd>
    </button>
    <div className="signal-route-beacon" aria-live="polite"><div className="signal-route-beacon__sigil" aria-hidden="true"><Compass size={13} /><i /></div><span><i /> Rota ativa · Bíblia em Visão Geral</span><strong>{current.label}</strong><button type="button" onClick={() => navigate(next.href)}>Próxima: {next.label} <ArrowUpRight size={13} /></button></div>
    {open && <div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setOpen(false); setQuery(""); } }}><section className="command-palette" role="dialog" aria-modal="true" aria-label="Comando rápido de navegação"><header><div><span><Sparkles size={14} /> Navegação assistida</span><h2>Para onde<br /><em>vamos agora?</em></h2></div><button type="button" onClick={() => { setOpen(false); setQuery(""); }} aria-label="Fechar painel de navegação"><X size={17} /></button></header><label className="command-palette__input"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Digite João 3:16, Gênesis 1, tema ou lugar…" /><kbd>ESC</kbd></label><div className="command-palette__route"><span>Coordenada atual</span><strong>{current.label}</strong><i /> <span>Próxima conexão</span><button type="button" onClick={() => navigate(next.href)}>{next.label} <ArrowUpRight size={14} /></button></div><div className="command-palette__results" aria-label="Destinos disponíveis">{passage && <button type="button" className="command-palette__passage" onClick={openPassage}><span><BookOpen size={17} /></span><div><small>Passagem reconhecida · abrir estudo</small><strong>{passage.bookName}{passage.chapter ? ` ${passage.chapter}${passage.verses ? `:${passage.verses}` : ""}` : ""}</strong><em>Ir ao comentário desenvolvido ou ao roteiro detalhado deste livro.</em></div><ArrowUpRight size={16} /></button>}{results.length ? results.map((item, index) => <button key={item.href} type="button" onClick={() => navigate(item.href)}><span><item.icon size={17} /></span><div><small>{String(index + 1).padStart(2, "0")} · Rota de consulta</small><strong>{item.label}</strong><em>{item.detail}</em></div><ArrowUpRight size={16} /></button>) : !passage && <div className="command-palette__empty"><Search size={18} /><p>Nenhuma área coincide. Tente “João 3:16”, “atlas”, “estudo” ou “história”.</p></div>}</div><footer><span><kbd>⌘ K</kbd> abrir e fechar</span><span><kbd>/</kbd> pesquisar de qualquer página</span><button type="button" onClick={() => { setOpen(false); window.dispatchEvent(new Event("biblia-onboarding:open")); }}>Refazer orientação</button></footer></section></div>}
  </>;
}
