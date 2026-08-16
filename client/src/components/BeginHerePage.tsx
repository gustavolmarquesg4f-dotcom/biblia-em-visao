import { useLocation } from "wouter";
import { bibleBooks } from "@/lib/bible-data";
import BeginHerePortal from "@/components/BeginHerePortal";

export default function BeginHerePage() {
  const [, navigate] = useLocation();
  const go = (view: "library" | "studies" | "search" | "study") => navigate({ library: "/66-livros", studies: "/estudos", search: "/busca", study: "/mesa" }[view]);
  const openBook = () => navigate("/66-livros");
  return <main className="page-section"><BeginHerePortal go={go} openBook={openBook} genesis={bibleBooks[0]} /></main>;
}
