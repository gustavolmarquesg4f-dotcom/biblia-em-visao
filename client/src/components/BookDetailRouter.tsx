import { ArrowLeft, CircleHelp } from "lucide-react";
import { type Book } from "@/lib/bible-data";
import DeepDossierDetail from "@/components/DeepDossierDetail";

type Props = { book: Book; saved: boolean; save: () => void; close: () => void; openBook: (book: Book) => void; note: string; setNote: (value: string) => void; relationalData?: unknown };

export default function BookDetailRouter({ book, saved, save, close, openBook, note, setNote }: Props) {
  return <DeepDossierDetail book={book} saved={saved} save={save} close={close} openBook={openBook} note={note} setNote={setNote} />;
}
