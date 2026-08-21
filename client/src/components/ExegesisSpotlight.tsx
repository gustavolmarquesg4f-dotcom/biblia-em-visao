/* Cartografia de Leituras: bloco editorial de entrada para estudo exegético, com hierarquia de atlas e leitura confortável em telas estreitas. */
import { ArrowRight, BookOpen, Map, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bibleBooks, type Book } from "@/lib/bible-data";
import AdvancedResearchHub from "@/components/AdvancedResearchHub";
import StudyDesk from "@/components/StudyDesk";
import StudyCoverageBoard from "@/components/StudyCoverageBoard";
import SourceLedger from "@/components/SourceLedger";
import "@/study-desk.css";
import "@/atlas-plates.css";

type ExegesisSpotlightProps = {
  go: (view: "library" | "search" | "atlas" | "apocalypse" | "bibliography") => void;
  openBook: (book: Book) => void;
};

export default function ExegesisSpotlight({ go, openBook }: ExegesisSpotlightProps) {
  const featured = [bibleBooks[0], bibleBooks[1], bibleBooks[39], bibleBooks[43]];

  return (
    <>
    <section className="exegesis-spotlight" aria-labelledby="exegesis-spotlight-title">
      <div className="exegesis-spotlight-copy">
        <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-number">05</span><span>Estudos exegéticos</span></div>
        <h2 id="exegesis-spotlight-title">Abra o texto.<br /><em>Veja o contexto.</em></h2>
        <p>Entre no leitor longo para acompanhar argumento, contexto histórico, personagens, lugares, profecias e continuidade canônica — sem reduzir o livro a uma ficha rápida.</p>
        <div className="exegesis-spotlight-stats" aria-label="Cobertura dos estudos">
          <span><strong>66</strong> livros</span>
          <span><strong>1.189</strong> capítulos</span>
          <span><strong>119</strong> biografias</span>
        </div>
        <div className="exegesis-spotlight-actions">
          <Button className="primary-action primary-action--dark" onClick={() => go("library")}><BookOpen size={16} /> Explorar os estudos</Button>
          <button type="button" className="text-action text-action--dark" onClick={() => go("search")}><Search size={15} /> Buscar uma conexão <ArrowRight size={14} /></button>
        </div>
      </div>
      <div className="exegesis-spotlight-rail">
        <div className="exegesis-rail-heading"><span>Quatro portas de entrada</span><button type="button" onClick={() => go("atlas")}><Map size={14} /> Ver no mapa</button></div>
        {featured.map((book, index) => (
          <button type="button" className="exegesis-entry" key={book.id} onClick={() => openBook(book)} aria-label={`Abrir estudo exegético de ${book.name}`}>
            <span className="exegesis-entry-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="exegesis-entry-content"><strong>{book.name}</strong><small>{book.category} · {book.chapters} capítulos</small><p>{book.summary}</p></span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
    </section>
    <AdvancedResearchHub go={view => go(view)} />
    <StudyDesk openBook={openBook} />
    <StudyCoverageBoard />
    <SourceLedger />
    </>
  );
}
