import { ArrowRight, BookOpen, ExternalLink, Network, X } from "lucide-react";
import { Streamdown } from "streamdown";
import { findBiography, type BiographyRecord } from "@/lib/biography-data";
import { bibleBooks } from "@/lib/bible-data";
import "@/biography-network.css";

type Props = {
  biographyId: string | null;
  close: () => void;
  onOpenEntity?: (entityId: string) => void;
  onOpenBook?: (bookName: string) => void;
  onFocusPlace?: (placeId: string) => void;
};

function sectionLabel(label: string) {
  return label.replace(/\s+/g, " ").trim();
}

function normalizeBiographyMarkdown(value: string) {
  return value
    .replace(/\\\[\d+\\\]/g, "")
    .replace(/\[\d+\]/g, "")
    .replace(/\\([*_`[\]()>#+\-.!])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeBiographyPlainText(value: string) {
  return normalizeBiographyMarkdown(value)
    .replace(/\*\*/g, "")
    .replace(/(^|\s)\*([^*]+)\*(?=\s|[,.;:!?)]|$)/g, "$1$2")
    .replace(/__/g, "")
    .trim();
}

function bookFromReference(reference: string) {
  const normalized = reference.toLocaleLowerCase().trim();
  return [...bibleBooks].sort((a, b) => Math.max(a.name.length, a.short.length) - Math.max(b.name.length, b.short.length)).reverse().find((book) => normalized.startsWith(book.name.toLocaleLowerCase()) || normalized.startsWith(book.short.toLocaleLowerCase())) || null;
}

function ReferenceChip({ reference, onOpenBook }: { reference: string; onOpenBook?: (name: string) => void }) {
  const target = bookFromReference(reference);
  return target && onOpenBook ? <button type="button" className="exegesis-reference-chip" onClick={() => onOpenBook(target.name)}>{reference}<ArrowRight size={12} /></button> : <span className="exegesis-reference-chip exegesis-reference-chip--static">{reference}</span>;
}

export default function BiographyPanel({ biographyId, close, onOpenEntity, onOpenBook, onFocusPlace }: Props) {
  if (!biographyId) return null;
  const record = findBiography(biographyId);
  if (!record) return null;
  const sections = Object.entries(record.sections || {});
  return <div className="entity-panel-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    <aside className="entity-panel biography-panel" role="dialog" aria-modal="true" aria-labelledby="biography-panel-title">
      <div className="entity-panel-top"><span className="entity-kind entity-kind--person">Biografia · dossiê profundo</span><button type="button" className="entity-panel-close" onClick={close} aria-label="Fechar biografia"><X size={18} /></button></div>
      <div className="entity-panel-header"><span className="entity-index">PERSONAGEM · {record.refs.length} REFERÊNCIAS</span><h2 id="biography-panel-title">{record.name}</h2><div className="biography-panel-tagline entity-markdown"><Streamdown>{normalizeBiographyMarkdown(record.shortLabel)}</Streamdown></div></div>
      <div className="biography-panel-body">
        <section className="biography-lead-section"><span className="entity-section-label">Resumo do verbete</span><div className="entity-lead entity-markdown"><Streamdown>{normalizeBiographyMarkdown(record.summary)}</Streamdown></div></section>
        {sections.map(([label, text]) => <section key={label} className="biography-section"><span className="entity-section-label">{sectionLabel(label)}</span><div className="entity-markdown"><Streamdown>{normalizeBiographyMarkdown(text)}</Streamdown></div></section>)}
        <section className="entity-ref-block"><span className="entity-section-label">Textos bíblicos principais · abrir livro</span><div className="entity-ref-list">{record.refs.map((ref) => <ReferenceChip key={ref} reference={ref} onOpenBook={onOpenBook} />)}</div></section>
        <section><span className="entity-section-label">Livros relacionados</span><div className="entity-book-list">{record.books.map((name) => <button type="button" key={name} onClick={() => onOpenBook?.(name)}><BookOpen size={13} />{name}<ArrowRight size={12} /></button>)}</div></section>
        {record.related.length > 0 && <section><span className="entity-section-label">Pessoas relacionadas</span><div className="entity-relation-list">{record.related.map((id) => { const related = findBiography(id); return related ? <button type="button" key={id} onClick={() => onOpenEntity?.(id)}><Network size={13} /><span><strong>{related.name}</strong><small>{normalizeBiographyPlainText(related.shortLabel || related.summary)}</small></span><ArrowRight size={12} /></button> : null; })}</div></section>}
        {record.academicNote && <section className="entity-method"><span className="entity-section-label">Nota de método</span><div className="entity-markdown"><Streamdown>{normalizeBiographyMarkdown(record.academicNote)}</Streamdown></div></section>}
        {record.primarySource && <a className="entity-source" href={record.primarySource} target="_blank" rel="noreferrer"><ExternalLink size={13} />Abrir referências bíblicas selecionadas</a>}
      </div>
      <div className="entity-panel-footer"><span>{record.books.length} livros relacionados</span><span>Leitura biográfica</span></div>
    </aside>
  </div>;
}
