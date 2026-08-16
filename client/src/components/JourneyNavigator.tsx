/* Cartografia de Leituras — navegação como rota editorial: grupos, posição atual, retorno e próximo passo. */
import { ArrowLeft, ArrowRight, BookOpen, CircleHelp, Clock3, Compass, Eye, FileText, Landmark, Layers3, Map, ScrollText, Search, Sparkles, Users, X } from "lucide-react";

export type JourneyView = "overview" | "start" | "library" | "study" | "studies" | "theology" | "people" | "canon" | "apocrypha" | "glossary" | "search" | "timeline" | "history" | "atlas" | "themes" | "apocalypse" | "bibliography";

type NavigationItem = { id: JourneyView; label: string; note: string; icon: typeof Compass; count?: string };
type NavigationGroup = { id: string; label: string; index: string; items: NavigationItem[] };

const groups: NavigationGroup[] = [
  { id: "orientar", index: "01", label: "Orientar-se", items: [
    { id: "start", label: "Comece aqui", note: "Três portas para iniciar", icon: Compass },
    { id: "overview", label: "Ponto de partida", note: "A visão do todo", icon: Compass },
    { id: "timeline", label: "Linha do tempo", note: "Períodos e movimentos", icon: Clock3 },
    { id: "atlas", label: "Atlas e lugares", note: "Rotas, cidades, impérios", icon: Map },
    { id: "history", label: "História bíblica", note: "Períodos, impérios, vestígios", icon: Landmark, count: "11" },
  ] },
  { id: "investigar", index: "02", label: "Investigar", items: [
    { id: "library", label: "Os 66 livros", note: "Dossiês e conexões", icon: BookOpen, count: "66" },
    { id: "people", label: "Pessoas e povos", note: "Biografias e redes", icon: Users },
    { id: "themes", label: "Temas bíblicos", note: "Linhas de leitura", icon: Layers3 },
    { id: "search", label: "Busca na rede", note: "Encontrar relações", icon: Search },
  ] },
  { id: "aprofundar", index: "03", label: "Aprofundar", items: [
    { id: "studies", label: "Percursos de estudo", note: "Temas e roteiros pessoais", icon: Sparkles, count: "17" },
    { id: "study", label: "Mesa de estudo", note: "Exegese e pesquisa", icon: FileText },
    { id: "canon", label: "Cânones e textos", note: "Transmissão e contexto", icon: Layers3 },
    { id: "apocrypha", label: "Apócrifos e textos", note: "Deuterocanônicos e recepção", icon: ScrollText, count: "10" },
    { id: "glossary", label: "Glossário", note: "Línguas e termos", icon: CircleHelp },
    { id: "apocalypse", label: "Apocalipse", note: "Rota escatológica", icon: Eye, count: "12" },
    { id: "bibliography", label: "Fontes e bibliografia", note: "Rastrear a pesquisa", icon: FileText },
  ] },
];

const viewMeta = Object.fromEntries(groups.flatMap((group) => group.items.map((item) => [item.id, { ...item, group: group.label, groupIndex: group.index }]))) as Record<JourneyView, NavigationItem & { group: string; groupIndex: string }>;
const nextSteps: Record<JourneyView, JourneyView> = { start: "overview", overview: "timeline", timeline: "atlas", atlas: "history", history: "library", library: "people", people: "themes", themes: "search", search: "studies", studies: "study", study: "canon", canon: "apocrypha", apocrypha: "glossary", glossary: "apocalypse", apocalypse: "bibliography", bibliography: "start", theology: "studies" };

export default function JourneyNavigator({ view, mobileOpen, activeBookName, onNavigate, onClose }: { view: JourneyView; mobileOpen: boolean; activeBookName?: string | null; onNavigate: (view: JourneyView) => void; onClose: () => void }) {
  const current = viewMeta[view];
  return <aside className={`side-rail journey-rail ${mobileOpen ? "side-rail--open" : ""}`}><div className="journey-rail__top"><div className="journey-wordmark"><span className="journey-wordmark__mark">✦</span><div><strong>A Bíblia</strong><span>em visão geral</span><small>ATLAS · 66 LIVROS</small></div></div><button className="rail-close" type="button" onClick={onClose} aria-label="Fechar navegação"><X size={18} /></button></div><div className="journey-rail__position"><span>Você está aqui</span><strong>{activeBookName ? `Dossiê · ${activeBookName}` : current.label}</strong><small>{activeBookName ? "Leitura em profundidade" : `${current.groupIndex} · ${current.group}`}</small></div><nav className="journey-rail__nav" aria-label="Trilhas da enciclopédia">{groups.map((group) => <section key={group.id} className="journey-nav-group"><header><span>{group.index}</span><strong>{group.label}</strong></header><div>{group.items.map((item) => { const Icon = item.icon; const active = view === item.id && !activeBookName; return <button key={item.id} type="button" className={active ? "is-active" : ""} onClick={() => onNavigate(item.id)} aria-current={active ? "page" : undefined}><Icon size={16} /><div><strong>{item.label}</strong><small>{item.note}</small></div>{item.count && <em>{item.count}</em>}<ArrowRight size={13} /></button>; })}</div></section>)}</nav><div className="journey-rail__footer"><span>Rota contínua</span><p>Use a trilha para avançar do contexto ao texto, do texto às conexões e das conexões às fontes.</p></div></aside>;
}

export function JourneyCompass({ currentView, activeBookName, lastView, onNavigate }: { currentView: JourneyView; activeBookName?: string | null; lastView: JourneyView | null; onNavigate: (view: JourneyView) => void }) {
  const current = viewMeta[currentView];
  const next = viewMeta[nextSteps[currentView]];
  return <nav className="journey-compass" aria-label="Orientação do percurso"><div className="journey-compass__trace">{lastView ? <button type="button" onClick={() => onNavigate(lastView)}><ArrowLeft size={14} /> Voltar a {viewMeta[lastView].label}</button> : <span><Compass size={14} /> Ponto de partida</span>}<i /><span>{current.groupIndex} · {current.group}</span></div><div className="journey-compass__here"><span>Em leitura</span><strong>{activeBookName ? `Dossiê: ${activeBookName}` : current.label}</strong></div><button className="journey-compass__next" type="button" onClick={() => onNavigate(next.id)}><span>Próxima conexão</span><strong>{next.label}</strong><ArrowRight size={15} /></button></nav>;
}
