import { useEffect, useState } from "react";
import { BookOpenCheck, ChevronRight, Link2, MapPin, Sparkles } from "lucide-react";
import type { GuidedArticle } from "@/lib/encyclopedic-reading-data";
import { closeReadingFrames, type CloseReadingFrame } from "@/lib/close-reading-frames";
import { apocryphaDeepStories } from "@/lib/apocrypha-deep-readings";
import "@/close-reading.css";

export function CloseReadingTrack({ readingId, article, units: suppliedUnits }: { readingId?: string; article: GuidedArticle; units?: CloseReadingFrame[] }) {
  const supplied = readingId ? closeReadingFrames[readingId] : undefined;
  const deepStories = readingId ? apocryphaDeepStories[readingId] : undefined;
  const units: CloseReadingFrame[] = suppliedUnits?.length ? suppliedUnits : supplied?.length ? supplied : article.story.map((_, index) => ({ range: `Movimento ${index + 1}`, title: `Parte ${index + 1} da leitura`, question: "O que esta parte está mostrando ao leitor?" }));
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [readingId]);
  const frame = units[active] ?? units[0];
  const story = deepStories?.[active] ?? article.story[active] ?? article.story[0];
  const meaning = article.meaning[active % article.meaning.length];
  const person = article.peopleAndPlaces[active % article.peopleAndPlaces.length];
  const connection = article.connections[active % article.connections.length];
  const term = article.terms[active % article.terms.length];
  return <section className="close-reading"><header><div><span><BookOpenCheck size={14} /> Leitura em detalhe</span><h4>Leia {frame.range} <em>passo a passo.</em></h4><p>Escolha uma parte do texto. Em cada parada, a enciclopédia mostra a cena, o sentido e os fios que ela puxa para o restante da Bíblia.</p></div><strong>{String(active + 1).padStart(2, "0")}<small>de {String(units.length).padStart(2, "0")}</small></strong></header><div className="close-reading__layout"><nav aria-label="Partes desta leitura">{units.map((unit, index) => <button type="button" key={`${unit.range}-${unit.title}`} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}><i>{String(index + 1).padStart(2, "0")}</i><span><small>{unit.range}</small><b>{unit.title}</b></span><ChevronRight size={15} /></button>)}</nav><article className="close-reading__unit"><span className="close-reading__range">{frame.range}</span><h5>{frame.title}</h5><p className="close-reading__question">{frame.question}</p><section><span>{frame.bodyLabel || "O que esta parte diz"}</span><p>{story}</p></section><div className="close-reading__grid"><section><span><Sparkles size={13} /> O que isso quer comunicar</span><b>{meaning.label}</b><p>{meaning.text}</p></section><section><span><MapPin size={13} /> Pessoa ou lugar para observar</span><b>{person.label}</b><p>{person.text}</p></section></div><footer><span><Link2 size={13} /> Leia junto</span><p>{connection}</p><small><strong>{term.word}:</strong> {term.meaning}</small></footer></article></div></section>;
}
