/* Cartografia de Leituras: um selo de edição ajuda o visitante a reconhecer a versão viva da enciclopédia. */
import { BookOpen, Clock3, GitBranch } from "lucide-react";

export default function PublicationStatus() {
  return <div className="publication-status" role="status" aria-label="Conteúdo avançado publicado">
    <span className="publication-status-label">Edição avançada</span>
    <span><BookOpen size={12} /> 66 dossiês</span>
    <span><GitBranch size={12} /> 1.189 capítulos</span>
    <span><Clock3 size={12} /> atlas temporal</span>
  </div>;
}
