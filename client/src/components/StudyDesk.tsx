// Cartografia de Leituras: mesa de estudo assimétrica, local-first e metodologicamente explícita.

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bookmark, BookmarkCheck, Check, ChevronDown, CircleHelp, CloudOff, Download, ExternalLink, FileJson, FileText, FolderPlus, Layers3, Library, NotebookPen, Plus, Search, Sparkles, Target, Trophy, Upload, Wifi, X } from "lucide-react";
import { bibleBooks, type Book } from "@/lib/bible-data";
import { bookProfiles } from "@/lib/book-deep";
import { advancedGlossary, glossaryLanguages, type AdvancedGlossaryEntry, type GlossaryLanguage } from "@/lib/advanced-glossary-data";
import { translationComparisons } from "@/lib/translation-comparison-data";
import { bookCoverage, verseCommentaries, type VerseCommentary } from "@/lib/verse-commentary-data";
import { quizSets, type QuizSet } from "@/lib/quiz-data";
import { createStudyBackup, mergeStudyStates, parseStudyBackup, readStudyState, upsertNote, writeStudyState, type StudyState } from "@/lib/study-store";
import { CloseReadingTrack } from "@/components/CloseReadingTrack";
import type { GuidedArticle } from "@/lib/encyclopedic-reading-data";
import type { CloseReadingFrame } from "@/lib/close-reading-frames";
import { framesForDetailedBook, loadDetailedBookReadings, type DetailedBookReading } from "@/lib/detailed-book-readings";
import { loadCoreBookReadings } from "@/lib/core-book-readings";
import { readOfflinePacks, removeStudyPack, saveStudyPack } from "@/lib/offline-study";
import "@/study-backup.css";
import "@/book-roadmap.css";

type DeskTab = "mesa" | "glossario" | "traducoes" | "roteiro" | "comentarios" | "quizzes";

type StudyDeskProps = {
  openBook: (book: Book) => void;
  initialTab?: DeskTab;
};

const tabLabels: { id: DeskTab; label: string; icon: typeof Library }[] = [
  { id: "mesa", label: "Minha mesa", icon: Library },
  { id: "glossario", label: "Línguas", icon: Search },
  { id: "traducoes", label: "Traduções", icon: Layers3 },
  { id: "roteiro", label: "66 livros", icon: Library },
  { id: "comentarios", label: "Versículo a versículo", icon: FileText },
  { id: "quizzes", label: "Revisão", icon: Trophy },
];

export default function StudyDesk({ openBook, initialTab = "mesa" }: StudyDeskProps) {
  const [tab, setTab] = useState<DeskTab>(initialTab);
  const [state, setState] = useState<StudyState>(() => readStudyState());
  const [toast, setToast] = useState("");
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  const [savedOffline, setSavedOffline] = useState(() => readOfflinePacks().some((pack) => pack.id === "mesa-e-estudos"));
  const [savingOffline, setSavingOffline] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => writeStudyState(state), [state]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 2400); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { const sync = () => setOnline(navigator.onLine); window.addEventListener("online", sync); window.addEventListener("offline", sync); return () => { window.removeEventListener("online", sync); window.removeEventListener("offline", sync); }; }, []);

  const update = (next: StudyState) => setState(next);
  const toggleFavorite = (targetId: string) => update({ ...state, favorites: state.favorites.includes(targetId) ? state.favorites.filter(id => id !== targetId) : [...state.favorites, targetId] });
  const toggleCompleted = (targetId: string) => update({ ...state, completed: state.completed.includes(targetId) ? state.completed.filter(id => id !== targetId) : [...state.completed, targetId] });
  const saveDeskNote = (body: string) => { update(upsertNote(state, "mesa-de-estudo", "Minha mesa de estudo", body)); setToast("Nota guardada neste dispositivo."); };
  const exportBackup = () => { const backup = createStudyBackup(state); const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `biblia-em-visao-estudo-${backup.exportedAt.slice(0, 10)}.json`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 0); setToast("Backup baixado. Guarde o arquivo em local seguro."); };
  const importBackup = async (file: File | undefined) => { if (!file) return; if (file.size > 2_000_000) { setToast("O arquivo é grande demais para um backup local desta mesa."); return; } const parsed = parseStudyBackup(await file.text()); if (!parsed.ok) { setToast(parsed.message); return; } update(mergeStudyStates(state, parsed.backup.state)); setToast(`Backup de ${new Date(parsed.backup.exportedAt).toLocaleDateString("pt-BR")} mesclado sem apagar seus dados atuais.`); };
  const toggleOfflinePack = async () => { setSavingOffline(true); try { if (savedOffline) { await removeStudyPack(); setSavedOffline(false); setToast("Pacote offline removido deste dispositivo."); } else { await saveStudyPack(); setSavedOffline(true); setToast("Mesa e estudos essenciais salvos para leitura offline."); } } catch { setToast("Não foi possível preparar o pacote offline agora. Tente novamente com conexão."); } finally { setSavingOffline(false); } };
  const activeNote = state.notes.find(note => note.targetId === "mesa-de-estudo")?.body || "";

  return <section className="study-desk page-section" aria-labelledby="study-desk-title">
    <header className="study-desk-header">
      <div>
        <div className="study-desk-kicker"><span /> Modo de estudo pessoal · local-first</div>
        <h2 id="study-desk-title">Monte a sua mesa.<br /><em>Volte às perguntas.</em></h2>
        <p>Notas, favoritos, progresso, coleções e revisões ficam neste navegador. Nada aqui promete sincronização em nuvem: a transparência faz parte do método.</p>
      </div>
      <div className="study-desk-stamp"><strong>{state.completed.length}</strong><span>marcos<br />concluídos</span></div>
    </header>
    <div className={`offline-study-strip ${online ? "is-online" : "is-offline"}`} role="status">
      <div className="offline-study-status">{online ? <Wifi size={16} /> : <CloudOff size={16} />}<span><strong>{online ? "Conectado" : "Sem conexão"}</strong>{online ? " · suas notas já ficam neste dispositivo" : " · notas, favoritos e estudos salvos continuam disponíveis"}</span></div>
      <button type="button" onClick={toggleOfflinePack} disabled={savingOffline || (!online && !savedOffline)}>{savingOffline ? "Preparando…" : savedOffline ? "Remover pacote local" : "Salvar estudos no celular"}</button>
    </div>
    <div className="study-desk-metrics" aria-label="Resumo do estudo"><Metric icon={Bookmark} value={state.favorites.length} label="salvos" /><Metric icon={NotebookPen} value={state.notes.length} label="notas" /><Metric icon={Target} value={state.completed.length} label="marcos" /><Metric icon={Trophy} value={Object.keys(state.quizBest).length} label="quizzes" /></div>
    <nav className="study-desk-tabs" aria-label="Ferramentas da mesa" role="tablist">{tabLabels.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}><Icon size={15} />{label}</button>)}</nav>
    <div className="study-desk-body">
      {tab === "mesa" && <DeskHome state={state} activeNote={activeNote} saveDeskNote={saveDeskNote} toggleFavorite={toggleFavorite} toggleCompleted={toggleCompleted} update={update} setTab={setTab} exportBackup={exportBackup} importBackup={importBackup} importInputRef={importInputRef} />}
      {tab === "glossario" && <GlossaryDesk state={state} toggleFavorite={toggleFavorite} toggleCompleted={toggleCompleted} />}
      {tab === "traducoes" && <TranslationsDesk state={state} toggleFavorite={toggleFavorite} toggleCompleted={toggleCompleted} />}
      {tab === "roteiro" && <BookRoadmapDesk openBook={openBook} toggleFavorite={toggleFavorite} state={state} />}
      {tab === "comentarios" && <CommentaryDesk state={state} toggleFavorite={toggleFavorite} toggleCompleted={toggleCompleted} openBook={openBook} />}
      {tab === "quizzes" && <QuizDesk state={state} update={update} toggleCompleted={toggleCompleted} />}
    </div>
    {toast && <div className="study-desk-toast" role="status"><Check size={15} />{toast}</div>}
  </section>;
}

function Metric({ icon: Icon, value, label }: { icon: typeof Bookmark; value: number; label: string }) { return <div className="study-desk-metric"><Icon size={16} /><strong>{value}</strong><span>{label}</span></div>; }

function DeskHome({ state, activeNote, saveDeskNote, toggleFavorite, toggleCompleted, update, setTab, exportBackup, importBackup, importInputRef }: { state: StudyState; activeNote: string; saveDeskNote: (body: string) => void; toggleFavorite: (id: string) => void; toggleCompleted: (id: string) => void; update: (state: StudyState) => void; setTab: (tab: DeskTab) => void; exportBackup: () => void; importBackup: (file: File | undefined) => void; importInputRef: React.RefObject<HTMLInputElement | null> }) {
  const [note, setNote] = useState(activeNote);
  const [newCollection, setNewCollection] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(state.collections[0]?.id || "pesquisa-aberta");
  const featured = [{ id: "mesa-metodo", label: "Método e camadas", meta: "Texto · contexto · interpretação · doutrina", action: () => setTab("glossario") }, { id: "mesa-traducoes", label: "Decisões de tradução", meta: `${translationComparisons.length} passagens comparadas`, action: () => setTab("traducoes") }, { id: "mesa-comentarios", label: "Comentários focais", meta: `${verseCommentaries.length} blocos desenvolvidos`, action: () => setTab("comentarios") }, { id: "mesa-escatologia", label: "Discernimento escatológico", meta: "Símbolo sem cronograma", action: () => setTab("quizzes") }];
  const progress = Math.min(100, Math.round((state.completed.length / 12) * 100));
  const addCollection = () => { const name = newCollection.trim(); if (!name) return; const collection = { id: `collection-${Date.now()}`, name, itemIds: [] }; update({ ...state, collections: [...state.collections, collection] }); setSelectedCollection(collection.id); setNewCollection(""); };
  const addToCollection = (id: string) => update({ ...state, collections: state.collections.map(collection => collection.id === selectedCollection && !collection.itemIds.includes(id) ? { ...collection, itemIds: [...collection.itemIds, id] } : collection) });
  return <div className="study-desk-home">
    <div className="study-desk-home-grid">
      <article className="study-desk-progress-card"><div className="study-desk-card-label"><Target size={15} /> Ritmo de pesquisa</div><div className="study-progress-number"><strong>{progress}%</strong><span>dos marcos desta mesa</span></div><div className="study-progress-bar"><i style={{ width: `${progress}%` }} /></div><p>Marque comentários e revisões concluídos sem transformar a leitura em corrida. O número é um lembrete, não uma nota espiritual.</p><button className="study-desk-primary" onClick={() => setTab("comentarios")}>Abrir lote de comentários <ArrowRight size={15} /></button></article>
      <article className="study-desk-note-card"><div className="study-desk-card-label"><NotebookPen size={15} /> Nota de margem</div><textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Escreva a pergunta que você não quer perder..." aria-label="Nota principal da mesa de estudo" /><div className="study-desk-note-actions"><span>{note.length} caracteres</span><button onClick={() => saveDeskNote(note)}><Check size={14} /> Guardar nota</button></div></article>
    </div>
    <div className="study-desk-section-heading"><div><span>Portas de entrada</span><h3>Quatro perguntas para continuar</h3></div><span>{state.favorites.length} salvos na mesa</span></div>
    <div className="study-desk-feature-grid">{featured.map((item, index) => <article key={item.id} className="study-desk-feature"><div><span>{String(index + 1).padStart(2, "0")}</span><button onClick={() => toggleFavorite(item.id)} aria-label={state.favorites.includes(item.id) ? `Remover ${item.label} dos favoritos` : `Salvar ${item.label}`}>{state.favorites.includes(item.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}</button></div><h4>{item.label}</h4><p>{item.meta}</p><button className="study-desk-link" onClick={item.action}>Abrir superfície <ArrowRight size={14} /></button></article>)}</div>
    <div className="study-desk-collection-row"><div><span>Organização</span><strong>Acervos pessoais</strong><small>Crie uma coleção de perguntas, comentários ou termos.</small></div><select value={selectedCollection} onChange={event => setSelectedCollection(event.target.value)} aria-label="Selecionar coleção">{state.collections.map(collection => <option key={collection.id} value={collection.id}>{collection.name} · {collection.itemIds.length}</option>)}</select><label><input value={newCollection} onChange={event => setNewCollection(event.target.value)} placeholder="Nova coleção" aria-label="Nome da nova coleção" /><button onClick={addCollection} aria-label="Criar coleção"><Plus size={15} /></button></label><button className="study-desk-collection-add" onClick={() => addToCollection("mesa-metodo")}><FolderPlus size={15} /> Adicionar porta atual</button></div>
    <div className="study-backup-panel"><div><span><FileJson size={14} /> Backup portátil</span><h3>Leve sua mesa com você.</h3><p>O arquivo inclui notas, favoritos, progresso, histórico de quizzes e coleções. A importação valida a versão e <strong>mescla</strong> os dados, sem substituir silenciosamente o que já existe neste navegador.</p></div><div className="study-backup-actions"><button className="study-desk-primary" onClick={exportBackup}><Download size={15} /> Exportar backup</button><button className="study-backup-import" onClick={() => importInputRef.current?.click()}><Upload size={15} /> Importar e mesclar</button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={event => { void importBackup(event.target.files?.[0]); event.currentTarget.value = ""; }} aria-label="Selecionar backup da mesa de estudo" /></div></div>
    <div className="study-desk-home-foot"><button onClick={() => toggleCompleted("mesa-primeira-leitura")} className={state.completed.includes("mesa-primeira-leitura") ? "is-done" : ""}>{state.completed.includes("mesa-primeira-leitura") ? <Check size={15} /> : <CircleHelp size={15} />} Marcar orientação como lida</button><span>Dados guardados somente neste navegador.</span></div>
  </div>;
}

function GlossaryDesk({ state, toggleFavorite, toggleCompleted }: { state: StudyState; toggleFavorite: (id: string) => void; toggleCompleted: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<GlossaryLanguage | "Todos">("Todos");
  const [activeId, setActiveId] = useState(advancedGlossary[0].id);
  const filtered = useMemo(() => advancedGlossary.filter(entry => (language === "Todos" || entry.language === language) && (!query.trim() || `${entry.term} ${entry.original} ${entry.transliteration} ${entry.definition} ${entry.semanticRange} ${entry.related.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim()))), [language, query]);
  const active = filtered.find(entry => entry.id === activeId) || filtered[0] || advancedGlossary[0];
  return <div className="study-reference-grid"><aside className="study-reference-index"><div className="study-reference-toolbar"><label><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar termo, original ou conceito" aria-label="Buscar no glossário avançado" /></label><div>{glossaryLanguages.map(item => <button key={item} className={language === item ? "is-active" : ""} onClick={() => setLanguage(item)}>{item}</button>)}</div></div><div className="study-reference-count">{filtered.length} de {advancedGlossary.length} verbetes linguísticos</div>{filtered.map(entry => <button key={entry.id} className={active.id === entry.id ? "is-active" : ""} onClick={() => setActiveId(entry.id)}><span>{entry.language.slice(0, 2).toUpperCase()}</span><div><strong>{entry.term}</strong><small>{entry.original} · {entry.transliteration}</small></div><ArrowRight size={14} /></button>)}</aside><article className="study-reference-detail"><div className="study-reference-detail-head"><div><span>{active.language} · {active.methodology}</span><h3>{active.term} <em>{active.original}</em></h3><strong>{active.transliteration} · {active.pronunciation}</strong></div><button onClick={() => toggleFavorite(active.id)} aria-label="Salvar termo">{state.favorites.includes(active.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></div><div className="study-language-grid"><InfoBlock label="Definição" text={active.definition} /><InfoBlock label="Campo semântico" text={active.semanticRange} /><InfoBlock label="Nota gramatical" text={active.grammaticalNote} /><InfoBlock label="Efeito na tradução" text={active.translationNote} /></div><div className="study-reference-refs"><div><span>Referências bíblicas</span><strong>{active.refs.join(" · ")}</strong></div><div><span>Verbetes relacionados</span><strong>{active.related.join(" · ")}</strong></div></div><div className="study-source-line"><span>Fonte para começar</span>{active.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={13} /></a>)}</div><button className={`study-complete-button ${state.completed.includes(`glossary-${active.id}`) ? "is-done" : ""}`} onClick={() => toggleCompleted(`glossary-${active.id}`)}>{state.completed.includes(`glossary-${active.id}`) ? <Check size={15} /> : <Target size={15} />} {state.completed.includes(`glossary-${active.id}`) ? "Termo revisado" : "Marcar termo como revisado"}</button></article></div>;
}

function InfoBlock({ label, text }: { label: string; text: string }) { return <div className="study-info-block"><span>{label}</span><p>{text}</p></div>; }

function TranslationsDesk({ state, toggleFavorite, toggleCompleted }: { state: StudyState; toggleFavorite: (id: string) => void; toggleCompleted: (id: string) => void }) {
  const [activeId, setActiveId] = useState(translationComparisons[0].id);
  const active = translationComparisons.find(item => item.id === activeId) || translationComparisons[0];
  return <div className="translation-desk"><header><div><span>Oficina de tradução</span><h3>Uma passagem, várias decisões.</h3><p>Compare caminhos de tradução e veja onde entram o texto, o contexto, a recepção e a tradição. A tabela não declara um vencedor automático.</p></div><button onClick={() => toggleFavorite(active.id)} aria-label="Salvar comparação">{state.favorites.includes(active.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></header><div className="translation-selector">{translationComparisons.map((item, index) => <button key={item.id} className={active.id === item.id ? "is-active" : ""} onClick={() => setActiveId(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.reference}</strong><small>{item.title}</small></div><ArrowRight size={14} /></button>)}</div><article className="translation-detail"><div className="translation-detail-heading"><div><span>{active.reference}</span><h4>{active.title}</h4></div><span className="translation-badge">decisão explícita</span></div><div className="translation-context-grid"><InfoBlock label="Questão original" text={active.originalIssue} /><InfoBlock label="Contexto de leitura" text={active.context} /></div><div className="translation-table-wrap"><table><thead><tr><th>Ângulo</th><th>O que prioriza</th><th>O que o leitor precisa observar</th></tr></thead><tbody>{active.rows.map(row => <tr key={row.version}><th>{row.version}</th><td>{row.approach}</td><td>{row.note}</td></tr>)}</tbody></table></div><blockquote>{active.textualNote}</blockquote><div className="study-source-line">{active.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={13} /></a>)}</div><button className={`study-complete-button ${state.completed.includes(`translation-${active.id}`) ? "is-done" : ""}`} onClick={() => toggleCompleted(`translation-${active.id}`)}>{state.completed.includes(`translation-${active.id}`) ? <Check size={15} /> : <Target size={15} />} {state.completed.includes(`translation-${active.id}`) ? "Comparação revisada" : "Marcar comparação como revisada"}</button></article></div>;
}

function CommentaryDesk({ state, toggleFavorite, toggleCompleted, openBook }: { state: StudyState; toggleFavorite: (id: string) => void; toggleCompleted: (id: string) => void; openBook: (book: Book) => void }) {
  const [book, setBook] = useState("Todos");
  const [activeId, setActiveId] = useState(verseCommentaries[0].id);
  const filtered = book === "Todos" ? verseCommentaries : verseCommentaries.filter(comment => comment.book === book);
  const active: VerseCommentary = filtered.find(comment => comment.id === activeId) || filtered[0] || verseCommentaries[0];
  const coverage = bookCoverage.filter(item => item.status === "Foco detalhado");
  const detailedArticle: GuidedArticle = { firstAnswer: active.textLayer, story: [active.textLayer, active.contextLayer, active.interpretationLayer, active.pentecostalLayer], meaning: [{ label: "O argumento do trecho", text: active.interpretationLayer }, { label: "Leitura em comunidade", text: active.pentecostalLayer }], peopleAndPlaces: [{ label: "Contexto para observar", text: active.contextLayer }, { label: "Conexões no cânon", text: active.references.join(" · ") }], connections: active.references.map(reference => `${active.book} ${active.chapter}:${active.verses} conversa com ${reference}.`), receptionOrDebate: [active.interpretationLayer, active.pentecostalLayer], terms: [{ word: "Texto", meaning: "A passagem é lida dentro do argumento do livro, não como frase isolada." }, { word: "Contexto", meaning: "O cenário histórico e literário ajuda a observar o que a passagem está fazendo." }] };
  const detailedFrames: CloseReadingFrame[] = [{ range: `${active.book} ${active.chapter}:${active.verses}`, title: "O que o texto descreve", question: "Quais palavras, imagens e movimentos aparecem diretamente na passagem?", bodyLabel: "O que o texto diz" }, { range: "Contexto", title: "O mundo em volta do trecho", question: "O que o primeiro público reconheceria nesta situação, imagem ou linguagem?", bodyLabel: "Contexto histórico e literário" }, { range: "Interpretação", title: "O argumento e o debate", question: "Que leitura simplista este trecho pede para evitar?", bodyLabel: "Como interpretar com cuidado" }, { range: "Leitura pentecostal", title: "Fé, discernimento e prática", question: "Como receber o texto sem tirar Cristo, comunidade e responsabilidade do centro?", bodyLabel: "Leitura pentecostal / IDB" }];
  return <div className="commentary-desk"><header><div><span>Comentário em lote revisável</span><h3>O verso dentro do argumento.</h3><p>Os blocos abaixo são focos desenvolvidos, não uma falsa declaração de cobertura integral. O índice mostra onde o lote está avançado e onde a expansão ainda continua.</p></div><div className="commentary-count"><strong>{verseCommentaries.length}</strong><span>focos publicados</span></div></header><div className="commentary-controls"><label>Livro<select value={book} onChange={event => { setBook(event.target.value); const next = verseCommentaries.find(comment => event.target.value === "Todos" || comment.book === event.target.value); if (next) setActiveId(next.id); }}><option>Todos</option>{coverage.map(item => <option key={item.book}>{item.book}</option>)}</select></label><div><span>{coverage.length} livros com foco detalhado</span><span>{bookCoverage.length - coverage.length} livros com índice em expansão</span></div></div><div className="commentary-layout"><aside className="commentary-index">{filtered.map((comment, index) => <button key={comment.id} className={active.id === comment.id ? "is-active" : ""} onClick={() => setActiveId(comment.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{comment.book} {comment.chapter}:{comment.verses}</strong><small>{comment.title}</small></div><ArrowRight size={14} /></button>)}{!filtered.length && <p>Nenhum foco neste filtro.</p>}</aside><article className="commentary-detail"><div className="commentary-detail-top"><div><span>{active.book} · capítulo {active.chapter} · versos {active.verses}</span><h4>{active.title}</h4></div><button onClick={() => toggleFavorite(active.id)} aria-label="Salvar comentário">{state.favorites.includes(active.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></div><CloseReadingTrack readingId={`commentary-${active.id}`} article={detailedArticle} units={detailedFrames} /><div className="commentary-bottom"><div><span>Conexões</span><strong>{active.references.join(" · ")}</strong></div><a href={active.source.url} target="_blank" rel="noreferrer">Fonte metodológica <ExternalLink size={13} /></a></div><div className="commentary-actions"><button className={`study-complete-button ${state.completed.includes(`commentary-${active.id}`) ? "is-done" : ""}`} onClick={() => toggleCompleted(`commentary-${active.id}`)}>{state.completed.includes(`commentary-${active.id}`) ? <Check size={15} /> : <Target size={15} />} {state.completed.includes(`commentary-${active.id}`) ? "Foco concluído" : "Marcar foco como concluído"}</button>{bibleBooks.find(item => item.name === active.book) && <button className="study-desk-link" onClick={() => openBook(bibleBooks.find(item => item.name === active.book)!)}>Abrir dossiê de {active.book} <ArrowRight size={14} /></button>}</div></article></div></div>;
}

function BookRoadmapDesk({ openBook, toggleFavorite, state }: { openBook: (book: Book) => void; toggleFavorite: (targetId: string) => void; state: StudyState }) {
  const [testament, setTestament] = useState<"Todos" | Book["testament"]>("Todos");
  const [query, setQuery] = useState("");
  const [activeName, setActiveName] = useState(bibleBooks[0].name);
  const [readings, setReadings] = useState<Record<string, DetailedBookReading>>({});
  const [loadingReadings, setLoadingReadings] = useState(true);
  useEffect(() => { let mounted = true; Promise.all([loadDetailedBookReadings(), loadCoreBookReadings().catch(() => ({}))]).then(([initial, core]) => { if (mounted) setReadings({ ...initial, ...core }); }).catch(() => { if (mounted) setReadings({}); }).finally(() => { if (mounted) setLoadingReadings(false); }); return () => { mounted = false; }; }, []);
  const filtered = useMemo(() => bibleBooks.filter(book => (testament === "Todos" || book.testament === testament) && (!query.trim() || `${book.name} ${book.category} ${book.themes.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim()))), [query, testament]);
  const active = filtered.find(book => book.name === activeName) || filtered[0] || bibleBooks[0];
  const profile = bookProfiles[active.name];
  const reading = readings[active.name];
  const coverage = bookCoverage.find(item => item.book === active.name);
  const hasDetailedFocus = coverage?.status === "Foco detalhado";
  const favoriteId = `roadmap-${active.id}`;
  const article: GuidedArticle | null = reading ? { firstAnswer: reading.overview, story: reading.units.map(unit => unit.happens), meaning: reading.units.map(unit => ({ label: "O que isso quer comunicar", text: unit.meaning })), peopleAndPlaces: reading.units.map(unit => ({ label: "O que observar", text: unit.observe })), connections: reading.units.map(unit => `${active.name}: ${unit.title}. Continue no dossiê do livro para pessoas, lugares e relações canônicas.`), receptionOrDebate: [reading.methodNote], terms: [{ word: "Leitura em camadas", meaning: reading.methodNote }] } : null;
  return <div className="book-roadmap">
    <header className="book-roadmap-header"><div><span>Índice de leitura dos 66 livros</span><h3>Todo livro tem um caminho.<br /><em>Comece pelo que ele realmente diz.</em></h3><p>Este índice não troca o texto por resumo. Ele mostra a estrutura do livro, a pergunta que o atravessa, o modo de ler e o estado real da expansão de comentário por unidade.</p></div><div className="book-roadmap-stamp"><strong>66</strong><span>livros<br />mapeados</span></div></header>
    <div className="book-roadmap-tools"><label><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar livro, categoria ou tema" aria-label="Buscar nos 66 livros" /></label><div>{(["Todos", "Antigo Testamento", "Novo Testamento"] as const).map(option => <button key={option} className={testament === option ? "is-active" : ""} onClick={() => setTestament(option)}>{option === "Todos" ? "Todos" : option === "Antigo Testamento" ? "Antigo" : "Novo"}</button>)}</div></div>
    <div className="book-roadmap-layout"><aside className="book-roadmap-index"><div className="book-roadmap-count">{filtered.length} livros encontrados</div>{filtered.map((book, index) => { const status = bookCoverage.find(item => item.book === book.name)?.status === "Foco detalhado"; return <button key={book.id} className={active.name === book.name ? "is-active" : ""} onClick={() => setActiveName(book.name)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{book.name}</strong><small>{book.category} · {book.chapters} capítulos</small></div>{status && <i aria-label="Possui focos detalhados" />}</button>; })}</aside>
      <article className="book-roadmap-detail"><div className="book-roadmap-detail-top"><div><span>{active.testament} · {active.category} · {active.chapters} capítulos</span><h4>{active.name}</h4><p>{reading?.overview || active.summary}</p></div><button onClick={() => toggleFavorite(favoriteId)} aria-label={`Salvar roteiro de ${active.name}`}>{state.favorites.includes(favoriteId) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></div>
        <div className="book-roadmap-status"><span>{hasDetailedFocus ? "Foco detalhado disponível" : "Roteiro estrutural pronto"}</span><p>{hasDetailedFocus ? "Este livro já possui unidades comentadas em profundidade na aba Versículo a versículo." : "A estrutura de leitura já está definida; as unidades comentadas serão acrescentadas sem apresentar planejamento como conteúdo concluído."}</p></div>
        <section className="book-roadmap-reading"><div><span>01 · Por onde o livro caminha</span><p>{profile?.structure || "Estrutura editorial em preparação."}</p></div><div><span>02 · Como ler sem se perder</span><p>{profile?.lens || "Comece observando gênero, contexto e conexões canônicas."}</p></div><div><span>03 · A pergunta que o livro mantém aberta</span><p>{profile?.question || "Que pergunta este livro faz a respeito de Deus, do povo e do mundo?"}</p></div><div><span>04 · Pontes para continuar</span><p>{profile?.connects.join(" · ") || active.themes.join(" · ")}</p></div></section>
        {article ? <CloseReadingTrack readingId={`book-roadmap-${active.id}`} article={article} units={framesForDetailedBook(reading)} /> : <div className="book-roadmap-loading">{loadingReadings ? "Carregando as quatro unidades detalhadas deste livro…" : "O roteiro estrutural está disponível; a leitura detalhada desta obra será restaurada quando o corpus estiver acessível."}</div>}
        <div className="book-roadmap-actions"><button className="study-desk-primary" onClick={() => openBook(active)}>Abrir dossiê de {active.name} <ArrowRight size={15} /></button><span>{article ? "As quatro unidades abaixo são a porta de entrada. O dossiê amplia pessoas, lugares, eventos e fontes." : "Quando uma unidade detalhada estiver disponível, ela aparecerá no comentário por trecho."}</span></div>
      </article></div>
  </div>;
}

function Layer({ label, text, tone }: { label: string; text: string; tone: string }) { return <section className={`commentary-layer commentary-layer--${tone}`}><span>{label}</span><p>{text}</p></section>; }

function QuizDesk({ state, update, toggleCompleted }: { state: StudyState; update: (state: StudyState) => void; toggleCompleted: (id: string) => void }) {
  const [quizId, setQuizId] = useState(quizSets[0].id);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const quiz: QuizSet = quizSets.find(item => item.id === quizId) || quizSets[0];
  const question = quiz.questions[index];
  const finished = index >= quiz.questions.length;
  const chooseQuiz = (id: string) => { setQuizId(id); setIndex(0); setSelected(null); setScore(0); };
  const answer = (option: number) => { if (selected !== null) return; setSelected(option); if (option === question.answer) setScore(value => value + 1); };
  const next = () => { if (index + 1 >= quiz.questions.length) { const finalScore = score + (selected === question.answer ? 0 : 0); update({ ...state, quizBest: { ...state.quizBest, [quiz.id]: Math.max(state.quizBest[quiz.id] || 0, finalScore) } }); setIndex(quiz.questions.length); } else { setIndex(value => value + 1); setSelected(null); } };
  return <div className="quiz-desk"><div className="quiz-list">{quizSets.map(item => <button key={item.id} className={quiz.id === item.id ? "is-active" : ""} onClick={() => chooseQuiz(item.id)}><span>{item.category}</span><strong>{item.title}</strong><small>{item.questions.length} perguntas</small><ArrowRight size={14} /></button>)}</div><article className="quiz-card"><div className="quiz-card-top"><div><span>{quiz.category} · revisão guiada</span><h3>{quiz.title}</h3><p>{quiz.description}</p></div><div className="quiz-score"><strong>{state.quizBest[quiz.id] ?? "—"}</strong><span>melhor<br />pontuação</span></div></div>{finished ? <div className="quiz-result"><Trophy size={30} /><strong>{score}/{quiz.questions.length}</strong><p>Revisão concluída. A pontuação mostra o que revisar, não mede maturidade espiritual nem valor da sua leitura.</p><button className="study-desk-primary" onClick={() => { setIndex(0); setSelected(null); setScore(0); toggleCompleted(`quiz-${quiz.id}`); }}>Refazer com outra atenção <ArrowRight size={15} /></button></div> : <><div className="quiz-progress"><span>Questão {index + 1} de {quiz.questions.length}</span><div><i style={{ width: `${((index + 1) / quiz.questions.length) * 100}%` }} /></div></div><h4>{question.prompt}</h4><div className="quiz-options">{question.options.map((option, optionIndex) => <button key={option} className={selected === null ? "" : optionIndex === question.answer ? "is-correct" : selected === optionIndex ? "is-wrong" : ""} onClick={() => answer(optionIndex)} disabled={selected !== null}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{selected !== null && <div className={`quiz-feedback ${selected === question.answer ? "is-correct" : "is-wrong"}`}><strong>{selected === question.answer ? "Boa leitura." : "Volte ao argumento."}</strong><p>{question.explanation}</p><small>{question.reference}</small><button onClick={next}>{index + 1 === quiz.questions.length ? "Concluir revisão" : "Próxima pergunta"} <ArrowRight size={14} /></button></div>}</>}</article></div>;
}
