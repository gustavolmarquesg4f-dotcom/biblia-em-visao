import { ArrowRight, BookOpen, Compass, Search } from "lucide-react";
import type { Book } from "@/lib/bible-data";
import "@/begin-here.css";

type Props = {
  go: (view: "library" | "studies" | "search" | "study") => void;
  openBook: (book: Book) => void;
  genesis: Book;
};

export default function BeginHerePortal({ go, openBook, genesis }: Props) {
  return <section className="begin-here" aria-labelledby="begin-here-title">
    <div className="begin-here__imprint"><span className="begin-here__mark">⌁</span><div><strong>A Bíblia</strong><small>EM VISÃO GERAL · ATLAS 66</small></div><em>COORD. 01° · PORTA DE ENTRADA</em></div>
    <header><span><Compass size={15} /> Você não precisa saber tudo para começar</span><h2 id="begin-here-title">Escolha sua primeira<br /><em>pergunta.</em></h2><p>Esta enciclopédia foi organizada para quem ainda está se localizando e para quem quer aprofundar. Comece por um caminho; você poderá mudar de rota a qualquer momento.</p></header>
    <div className="begin-here__choices">
      <article><span>01 · panorama</span><BookOpen size={20} /><h3>Nunca estudei<br />a Bíblia.</h3><p>Veja a história geral, os grandes períodos e a porta de entrada de cada livro antes de mergulhar nos detalhes.</p><button onClick={() => go("studies")}>Começar pelo percurso guiado <ArrowRight size={15} /></button></article>
      <article><span>02 · pesquisa</span><Search size={20} /><h3>Tenho uma<br />pergunta.</h3><p>Escreva como você fala: sofrimento, graça, dívida, Espírito Santo, Apocalipse ou um personagem.</p><button onClick={() => go("search")}>Fazer uma pergunta <ArrowRight size={15} /></button></article>
      <article><span>03 · leitura</span><Compass size={20} /><h3>Quero estudar<br />um livro a fundo.</h3><p>Abra uma obra, siga suas unidades de leitura, personagens, lugares, capítulos e conexões canônicas.</p><button onClick={() => openBook(genesis)}>Começar por Gênesis <ArrowRight size={15} /></button></article>
    </div>
  </section>;
}
