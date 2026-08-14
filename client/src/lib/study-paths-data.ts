// Cartografia de Leituras: percursos de investigação, não receitas prontas nem promessas de resultado.

export type StudyDestination = "library" | "people" | "atlas" | "themes" | "apocalypse" | "bibliography" | "study";

export type StudyPath = {
  id: string;
  number: string;
  category: string;
  title: string;
  lede: string;
  question: string;
  methodologicalNote: string;
  tags: string[];
  destination: StudyDestination;
  destinationLabel: string;
  steps: { title: string; references: string; summary: string }[];
};

export const studyPaths: StudyPath[] = [
  {
    id: "escatologia-sem-atalhos", number: "01", category: "Rota profunda · 12 estações", title: "Escatologia sem atalhos", lede: "Uma investigação de Daniel a Apocalipse, com símbolos, cidades, escolas interpretativas e esperança cristã sem cronogramas sensacionalistas.", question: "Como ler textos de fim, juízo e nova criação sem reduzir imagens apocalípticas a um calendário secreto?", methodologicalNote: "Distingue texto, contexto imperial, debate hermenêutico, leitura pentecostal e posição confessional.", tags: ["Apocalipse", "Daniel", "parousia", "milênio"], destination: "apocalypse", destinationLabel: "Abrir rota escatológica", steps: [
      { title: "Aprender o gênero", references: "Daniel 7–12 · Apocalipse 1", summary: "Ler visão, símbolo e imagética como linguagem situada em crise, não como código solto da história." },
      { title: "Percorrer as cidades", references: "Apocalipse 2–3", summary: "Cruzar as sete mensagens com a geografia, a vida urbana e a retórica de fidelidade no mundo romano." },
      { title: "Comparar escolas", references: "Apocalipse 4–20", summary: "Avaliar preterismo, historicismo, futurismo, idealismo e leituras ecléticas com seus alcances e limites." },
      { title: "Ler a consumação", references: "1Co 15 · 1Ts 4–5 · Apocalipse 21–22", summary: "Tratar ressurreição, juízo e nova criação como esperança cristã, sem datação e sem especulação dogmática." },
    ]
  },
  {
    id: "financas-trabalho-generosidade", number: "02", category: "Ética bíblica aplicada", title: "Finanças, trabalho e generosidade", lede: "Um estudo bíblico de riqueza, dívida, trabalho, partilha e justiça que recusa tanto a culpa do pobre quanto o evangelho da prosperidade.", question: "Que perguntas bíblicas devem orientar dinheiro e relações econômicas sem transformar a fé em técnica de enriquecimento?", methodologicalNote: "Não oferece aconselhamento financeiro individual. Conecta textos antigos, contextos econômicos, debates éticos e aplicações responsáveis.", tags: ["trabalho", "dívida", "generosidade", "justiça"], destination: "themes", destinationLabel: "Abrir temas bíblicos", steps: [
      { title: "Terra, descanso e limite", references: "Lv 25 · Dt 15", summary: "Examinar jubileu, remissão e descanso como textos de aliança em sociedades agrárias, evitando transportar cada mecanismo diretamente para economias atuais." },
      { title: "Trabalho, sabedoria e risco", references: "Pv 11 · Pv 22 · Ec 5", summary: "Ler diligência, empréstimo, fiança e riqueza com atenção à poesia sapiencial, que observa padrões sem oferecer garantias automáticas." },
      { title: "Profetas e injustiça", references: "Am 5 · Am 8 · Is 58", summary: "Confrontar fraude, exploração e culto desconectado da justiça; a denúncia profética precisa de contexto antes de virar slogan político." },
      { title: "Jesus e o tesouro", references: "Mt 6 · Mt 19 · Lc 16", summary: "Observar riqueza, ansiedade, serviço e mesa no ensino de Jesus, sem fazer da pobreza material uma medida simples de santidade." },
      { title: "Partilha e coleta", references: "At 2–4 · 2Co 8–9", summary: "Estudar a comunhão em Jerusalém e a coleta paulina como práticas de solidariedade entre comunidades, com contexto e voluntariedade." },
      { title: "Discernimento pentecostal", references: "1Tm 6 · Tg 5", summary: "Avaliar promessas de prosperidade à luz de contentamento, cuidado dos vulneráveis, trabalho, generosidade e prestação de contas." },
    ]
  },
  {
    id: "jesus-evangelhos", number: "03", category: "Cristologia e narrativa", title: "Jesus nos quatro Evangelhos", lede: "Leia cada Evangelho como narrativa própria e depois compare seus retratos de Jesus, Reino, cruz e discipulado.", question: "Como a diversidade de vozes canônicas aprofunda, em vez de dissolver, a confissão cristã sobre Jesus?", methodologicalNote: "Começa por cada narrativa antes de harmonizar episódios ou importar debates posteriores.", tags: ["Jesus", "Evangelhos", "Reino", "discípulos"], destination: "library", destinationLabel: "Abrir os Evangelhos", steps: [
      { title: "Mateus e as Escrituras", references: "Mt 1–7 · 21–28", summary: "Messias, ensino e cumprimento lidos na moldura de Israel." },
      { title: "Marcos e o caminho", references: "Mc 1–10 · 14–16", summary: "Urgência, serviço, incompreensão e cruz estruturam o caminho do discípulo." },
      { title: "Lucas e a mesa", references: "Lc 1–4 · 9–24", summary: "Pobres, estrangeiros, oração e reversões sociais fazem parte do anúncio do Reino." },
      { title: "João e os sinais", references: "Jo 1–12 · 13–21", summary: "Sinais, testemunho, vida e glória conduzem a uma cristologia narrativa." },
    ]
  },
  {
    id: "familia-casa-alianca", number: "04", category: "Pessoas, casa e aliança", title: "Família, casa e aliança", lede: "Um percurso por genealogias, casamentos, conflitos domésticos, cuidado e comunidade sem idealizar personagens ou repetir fórmulas simplistas.", question: "Como ler famílias bíblicas marcadas por promessa, violência, afeto, falha e restauração?", methodologicalNote: "Evita usar narrativas descritivas como prescrição automática para cada família atual.", tags: ["família", "aliança", "casa", "comunidade"], destination: "people", destinationLabel: "Abrir pessoas e povos", steps: [
      { title: "Casas em Gênesis", references: "Gn 12–50", summary: "Promessa, infertilidade, rivalidade, migração e reconciliação atravessam as famílias patriarcais." },
      { title: "Lei e proteção", references: "Êx 20 · Dt 6 · Dt 24", summary: "Casa, memória, cuidado e vulnerabilidade aparecem em textos legais diversos." },
      { title: "Jesus e o discipulado", references: "Mc 3 · Lc 8 · Jo 19", summary: "O discipulado reconfigura pertencimento sem apagar obrigações de cuidado." },
      { title: "Igreja como casa", references: "At 16 · 1Tm 3 · Ef 5–6", summary: "Ler metáforas e instruções em seus contextos greco-romanos e eclesiais." },
    ]
  },
  {
    id: "lideranca-poder-servico", number: "05", category: "Poder, serviço e discernimento", title: "Liderança, poder e serviço", lede: "Reis, profetas, juízes, apóstolos e igrejas para investigar autoridade, abuso, prestação de contas e serviço.", question: "Como a Bíblia descreve poder e seus riscos sem canonizar todo líder ou toda estrutura?", methodologicalNote: "Distingue narrativa, lei, crítica profética, ensino de Jesus e práticas das primeiras comunidades.", tags: ["liderança", "poder", "profetas", "serviço"], destination: "people", destinationLabel: "Abrir biografias e redes", steps: [
      { title: "Juízes e reis", references: "Jz 8–9 · 1Sm 8 · 2Sm 11–12", summary: "Autoridade pode libertar, concentrar poder e gerar violência; o texto não esconde falhas." },
      { title: "Profetas diante do trono", references: "1Rs 18 · 2Rs 5 · Jr 22", summary: "A palavra profética confronta idolatria, exploração e propaganda real." },
      { title: "Jesus e a grandeza", references: "Mc 10 · Jo 13", summary: "Serviço, entrega e cuidado subvertem modelos de domínio entre discípulos." },
      { title: "Comunidades e dons", references: "At 20 · 1Co 12–14 · 1Pe 5", summary: "Dons, correção e cuidado pastoral demandam discernimento comunitário." },
    ]
  },
  {
    id: "missao-cidades-povos", number: "06", category: "Mapa, povos e missão", title: "Missão, cidades e povos", lede: "Saia do mapa bíblico para acompanhar deslocamentos, fronteiras, cidades e traduções culturais do testemunho cristão.", question: "Como a mensagem se move entre Jerusalém, Judeia, Samaria, Ásia e Roma sem perder suas tensões?", methodologicalNote: "Usa o atlas como orientação didática; rotas e fronteiras são reconstruções aproximadas, não coordenadas absolutas.", tags: ["missão", "Atos", "Paulo", "cidades"], destination: "atlas", destinationLabel: "Abrir atlas em camadas", steps: [
      { title: "Jerusalém e Judeia", references: "At 1–7", summary: "Testemunho, templo, conflito e comunidade começam num cenário urbano e judaico." },
      { title: "Samaria e Antioquia", references: "At 8–13", summary: "Barreiras étnicas, línguas e mesas compartilhadas entram no centro da narrativa." },
      { title: "Cidades paulinas", references: "At 13–20 · cartas paulinas", summary: "Estradas, sinagogas, casas, mercados e associações ajudam a contextualizar as cartas." },
      { title: "Ásia e Apocalipse", references: "Ap 1–3", summary: "As cidades das sete igrejas conectam missão, economia, culto imperial e fidelidade." },
    ]
  },
];
