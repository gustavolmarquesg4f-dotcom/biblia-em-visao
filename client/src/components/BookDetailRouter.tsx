import { ArrowLeft, CircleHelp } from "lucide-react";
import { bibleBooks, type Book } from "@/lib/bible-data";
import GenesisRelationalDetail from "@/components/GenesisRelationalDetail";
import RelationalBookDetail from "@/components/RelationalBookDetail";
import { canonicalRelationalBookKey, type RelationalBookData } from "@/lib/relational-book-data";

type Props = { book: Book; saved: boolean; save: () => void; close: () => void; openBook: (book: Book) => void; note: string; setNote: (value: string) => void; relationalData: Record<string, RelationalBookData> };

export default function BookDetailRouter({ book, saved, save, close, openBook, note, setNote, relationalData }: Props) {
  if (book.name === "Gênesis") return <GenesisRelationalDetail book={book} saved={saved} save={save} close={close} openBook={openBook} note={note} setNote={setNote} />;
  const data = relationalData[canonicalRelationalBookKey(book.name)];
  if (data) return <RelationalBookDetail book={book} data={data} saved={saved} save={save} close={close} openBook={openBook} note={note} setNote={setNote} />;
  return <section className="page-section"><button className="back-action" onClick={close}><ArrowLeft size={15} /> Voltar aos 66 livros</button><div className="empty-state"><CircleHelp size={30} /><h3>Dossiê relacional carregando</h3><p>O conteúdo de {book.name} está sendo sincronizado. Reabra o livro quando o catálogo terminar de carregar.</p><button className="primary-action" onClick={() => { const target = bibleBooks.find(item => item.id === book.id); if (target) openBook(target); }}>Tentar novamente</button></div></section>;
}
