// Acervo de Sinais Vivos: a primeira visita oferece uma escolha clara de percurso e sai de cena sem bloquear a investigação.
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Compass, Map, Sparkles, X } from "lucide-react";
import { readOnboardingProfile, saveOnboardingProfile } from "@/lib/study-journey";
import "@/onboarding-navigator.css";

const routes = [
  { href: "/comece", label: "Ter uma visão geral", detail: "Comece pela história, pelos grandes movimentos e pelas perguntas certas.", icon: Compass },
  { href: "/66-livros", label: "Abrir um livro da Bíblia", detail: "Escolha um livro e siga seu dossiê, capítulos, pessoas e conexões.", icon: BookOpen },
  { href: "/atlas", label: "Entrar pelo mapa", detail: "Veja regiões, cidades, rotas, impérios e contextos antes de aprofundar.", icon: Map },
];

export default function OnboardingNavigator() {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { if ((location === "/" || location === "/comece") && !readOnboardingProfile().completed) setOpen(true); const reopen = () => setOpen(true); window.addEventListener("biblia-onboarding:open", reopen); return () => window.removeEventListener("biblia-onboarding:open", reopen); }, [location]);
  const choose = (href: string) => { saveOnboardingProfile({ completed: true, entry: href }); setOpen(false); navigate(href); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const dismiss = () => { saveOnboardingProfile({ completed: true }); setOpen(false); };
  if (!open) return null;
  return <div className="onboarding-navigator" role="dialog" aria-modal="true" aria-label="Orientação inicial"><section><header><div className="onboarding-navigator__sigil"><Compass size={19} /><i /></div><div><span>Primeira coordenada · 01</span><h2>Por onde você quer <em>começar?</em></h2></div><button type="button" onClick={dismiss} aria-label="Fechar orientação inicial"><X size={17} /></button></header><p>Não existe um único caminho para conhecer a Bíblia. Escolha uma porta de entrada; o sistema guardará sua rota neste dispositivo e mostrará como continuar.</p><div className="onboarding-navigator__routes">{routes.map((route, index) => <button key={route.href} type="button" onClick={() => choose(route.href)}><span>{String(index + 1).padStart(2, "0")}</span><route.icon size={19} /><div><strong>{route.label}</strong><small>{route.detail}</small></div></button>)}</div><footer><Sparkles size={14} /><span>Você poderá trocar de rota a qualquer momento pelo botão de comando ou pelo menu.</span><button type="button" onClick={dismiss}>Explorar sozinho</button></footer></section></div>;
}
