// Cartografia de Leituras: leitor hierárquico que transforma temas em investigação textual progressiva.
import { useMemo, useState } from "react";
import { BookOpen, ChevronRight, Layers3, ListTree, Quote, Sparkles } from "lucide-react";
import { deepStudies, studyLayerLabels, type StudyLayerKey } from "@/lib/deep-study-data";
import "@/deep-study-reader.css";

const layers: StudyLayerKey[] = ["texto", "contexto", "significado", "debate", "pentecostal"];

export default function DeepStudyReader({ studyId }: { studyId: string }) {
  const study = deepStudies[studyId];
  const [moduleIndex, setModuleIndex] = useState(0);
  const [layer, setLayer] = useState<StudyLayerKey>("texto");
  const current = useMemo(() => study?.modules[moduleIndex] || study?.modules[0], [moduleIndex, study]);
  if (!study || !current) return null;
  return <section className="deep-reader" aria-label={`Leitor detalhado: ${study.title}`}>
    <header className="deep-reader__intro"><span><Layers3 size={14} /> Leitor enciclopédico · módulos e camadas</span><h3>{study.title}</h3><p>{study.orientation}</p></header>
    <div className="deep-reader__layout"><aside className="deep-reader__index"><div><ListTree size={15} /><strong>Índice do estudo</strong><small>{study.modules.length} módulos · 5 camadas em cada módulo</small></div>{study.modules.map((item, index) => <button key={item.id} className={index === moduleIndex ? "is-active" : ""} onClick={() => { setModuleIndex(index); setLayer("texto"); }}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><ChevronRight size={14} /></button>)}</aside>
      <article className="deep-reader__content"><header><span>{current.references}</span><h4>{current.title}</h4><p><Quote size={15} /> {current.question}</p></header><nav aria-label="Camadas de leitura">{layers.map(item => <button key={item} className={layer === item ? "is-active" : ""} onClick={() => setLayer(item)}>{studyLayerLabels[item]}</button>)}</nav><div className="deep-reader__layer"><span><BookOpen size={15} /> {studyLayerLabels[layer]}</span><p>{current.layers[layer]}</p></div><footer><Sparkles size={15} /><p>Avance camada por camada: primeiro leia o texto, depois localize seu cenário, compreenda o sentido, reconheça onde há debate e, por fim, examine a leitura pentecostal/IDB.</p></footer></article></div>
    <section className="deep-reader__sources"><span>Fontes para continuar</span>{study.sources.map(source => <p key={source}>{source}</p>)}</section>
  </section>;
}
