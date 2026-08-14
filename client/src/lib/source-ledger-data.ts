// Cartografia de Leituras: ledger de fontes com proveniência, camada metodológica e limite explícito.

export type SourceKind = "Primária" | "Acadêmica" | "Institucional" | "Confessional";
export type SourceLayer = "Testemunho material" | "Pesquisa histórica" | "Pesquisa textual" | "Divulgação acadêmica" | "Posição de fé";
export type ConfidenceLevel = "Alta" | "Média" | "Contextual";

export type SourceLedgerRecord = {
  id: string;
  title: string;
  institution: string;
  kind: SourceKind;
  layer: SourceLayer;
  confidence: ConfidenceLevel;
  url: string;
  scope: string;
  limit: string;
  related: string[];
};

export const sourceLedger: SourceLedgerRecord[] = [
  { id: "dead-sea-library", title: "Leon Levy Dead Sea Scrolls Digital Library", institution: "Israel Antiquities Authority", kind: "Primária", layer: "Testemunho material", confidence: "Alta", url: "https://www.deadseascrolls.org.il/?locale=en_US", scope: "Imagens e metadados de fragmentos e manuscritos do Mar Morto.", limit: "O testemunho antigo não resolve sozinho a reconstrução de cada passagem nem define a interpretação teológica.", related: ["manuscritos", "línguas", "crítica textual"] },
  { id: "yale-nt-text", title: "Textual Criticism — New Testament Studies", institution: "Yale University Library", kind: "Institucional", layer: "Pesquisa textual", confidence: "Alta", url: "https://guides.library.yale.edu/newtestament/textualcriticism", scope: "Guia de livros, métodos, edições, testemunhos, escribas e debates da crítica textual do NT.", limit: "É um guia bibliográfico; não substitui a leitura das edições críticas e dos estudos listados.", related: ["papiros", "edições críticas", "variantes"] },
  { id: "sbl", title: "Society of Biblical Literature", institution: "Society of Biblical Literature", kind: "Acadêmica", layer: "Divulgação acadêmica", confidence: "Alta", url: "https://www.sbl-site.org/", scope: "Sociedade erudita, publicações e recursos de investigação bíblica interdisciplinar.", limit: "É uma instituição acadêmica plural, não uma declaração confessional nem um consenso sobre cada questão.", related: ["método", "Bible Odyssey", "bibliografia"] },
  { id: "bible-odyssey-form", title: "Why Does the Bible Look the Way It Does?", institution: "Bible Odyssey / SBL", kind: "Acadêmica", layer: "Divulgação acadêmica", confidence: "Contextual", url: "https://www.bibleodyssey.org/articles/why-does-the-bible-look-the-way-it-does/", scope: "Cânones, ordens, traduções, capítulos, versículos e formação gradual das coleções.", limit: "Texto de divulgação: serve como entrada orientada e aponta bibliografia, mas não substitui monografias especializadas.", related: ["cânon", "traduções", "Tanakh"] },
  { id: "nt-canon", title: "The New Testament Canon", institution: "Bible Odyssey / SBL", kind: "Acadêmica", layer: "Pesquisa histórica", confidence: "Contextual", url: "https://www.bibleodyssey.org/articles/the-new-testament-canon/", scope: "Recepção dos escritos, variação de listas e reconhecimento gradual do cânon do NT.", limit: "A história de recepção não decide a autoridade confessional que cada comunidade atribui aos textos.", related: ["cânon", "igreja antiga", "recepção"] },
  { id: "tel-dan", title: "The Tel Dan Inscription", institution: "Biblical Archaeology Society", kind: "Acadêmica", layer: "Pesquisa histórica", confidence: "Média", url: "https://www.biblicalarchaeology.org/daily/biblical-artifacts/the-tel-dan-inscription-the-first-historical-evidence-of-the-king-david-bible-story/", scope: "Estela aramaica, leitura ‘Casa de Davi’, datação, autoria e debate sobre o reino davídico.", limit: "A estela pode apoiar uma dinastia davídica sem resolver extensão do reino, cronologia exata ou todos os detalhes narrativos.", related: ["Davi", "Aramaico", "arqueologia"] },
  { id: "israel-antiquities", title: "Israel Antiquities Authority", institution: "Israel Antiquities Authority", kind: "Institucional", layer: "Testemunho material", confidence: "Alta", url: "https://www.antiquities.org.il/", scope: "Instituição de patrimônio, escavações, conservação e informação arqueológica em Israel.", limit: "Dados de patrimônio exigem interpretação histórica contextual e não são equivalentes a comentário bíblico.", related: ["arqueologia", "inscrições", "lugares"] },
  { id: "step-bible", title: "STEP Bible — ferramentas de línguas", institution: "Tyndale House", kind: "Institucional", layer: "Pesquisa textual", confidence: "Contextual", url: "https://www.stepbible.org/", scope: "Ferramentas de consulta a textos, léxicos, morfologia e traduções.", limit: "Ferramenta de consulta não substitui gramáticas, crítica textual e análise de contexto.", related: ["hebraico", "grego", "morfologia"] },
  { id: "idb-brasil", title: "Igreja de Deus no Brasil", institution: "Igreja de Deus no Brasil", kind: "Confessional", layer: "Posição de fé", confidence: "Contextual", url: "https://igrejadedeus.org.br/", scope: "Portal público para identidade, missão e referências institucionais brasileiras.", limit: "Uma fonte denominacional sustenta a descrição da posição IDB; não deve ser apresentada como consenso acadêmico ou de todo o cristianismo.", related: ["IDB", "pentecostalismo", "missão"] },
  { id: "cog-faith", title: "Declaration of Faith", institution: "Church of God", kind: "Confessional", layer: "Posição de fé", confidence: "Contextual", url: "https://churchofgod.org/beliefs/declaration-of-faith/", scope: "Declaração doutrinária pública da tradição Church of God usada como referência confessional pentecostal.", limit: "Documento confessional, não autoria do texto bíblico nem prova histórica de cada afirmação teológica.", related: ["Espírito Santo", "cura", "escatologia"] },
];

export const sourceKinds: (SourceKind | "Todos")[] = ["Todos", "Primária", "Acadêmica", "Institucional", "Confessional"];
export const sourceLayers: (SourceLayer | "Todas")[] = ["Todas", "Testemunho material", "Pesquisa histórica", "Pesquisa textual", "Divulgação acadêmica", "Posição de fé"];
export const confidenceLevels: (ConfidenceLevel | "Todas")[] = ["Todas", "Alta", "Média", "Contextual"];
