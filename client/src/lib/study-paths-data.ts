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
  {
    id: "oracao-lamento-discernimento", number: "07", category: "Oração e vida diante de Deus", title: "Oração, lamento e discernimento", lede: "Salmos, sabedoria, Evangelhos e cartas para ler oração como relação, intercessão, protesto, silêncio e entrega — não como fórmula de controle.", question: "Como a oração bíblica sustenta fé, lamento, espera e ação sem prometer resposta automática a cada pedido?", methodologicalNote: "Lê oração em gêneros diversos e rejeita a ideia de que sofrimento ou resposta tardia provem falta de fé.", tags: ["oração", "salmos", "lamento", "discernimento"], destination: "themes", destinationLabel: "Abrir temas bíblicos", steps: [
      { title: "Aprender a lamentar", references: "Sl 13 · Sl 42–43 · Sl 88", summary: "O lamento põe medo, ausência e protesto diante de Deus sem abandonar a relação de aliança." },
      { title: "Discernir a sabedoria", references: "Pv 3 · Ec 3 · Jó 38–42", summary: "Pedido, limite humano e mistério coexistem; sabedoria não é controle do futuro." },
      { title: "A oração de Jesus", references: "Mt 6 · Mc 14 · Lc 11", summary: "Pai-nosso, deserto e Getsêmani unem confiança, petição, obediência e agonia." },
      { title: "Interceder em comunidade", references: "Rm 8 · Ef 6 · Tg 5", summary: "O Espírito, a igreja e o cuidado mútuo enquadram a intercessão sem culpar quem sofre." },
    ]
  },
  {
    id: "espirito-dons-fruto-missao", number: "08", category: "Espírito Santo e vida da igreja", title: "Espírito Santo, dons, fruto e missão", lede: "Um percurso pentecostal com base bíblica para investigar promessa, poder, discernimento, carisma, fruto e serviço comunitário.", question: "Como afirmar a atualidade do Espírito e dos dons sem medir maturidade por uma experiência isolada?", methodologicalNote: "Distingue narrativa de Atos, ensino das cartas, leitura pentecostal e posição confessional da IDB.", tags: ["Espírito Santo", "dons", "fruto", "missão"], destination: "study", destinationLabel: "Abrir mesa de estudo", steps: [
      { title: "Promessa e Pentecostes", references: "Jl 2 · Lc 24 · At 1–2", summary: "Ler promessa, testemunho e formação da comunidade no horizonte profético e lucano." },
      { title: "Dons e corpo", references: "1Co 12–14 · Rm 12", summary: "Dons são distribuídos para edificação, discernimento e serviço; nenhum membro esgota o corpo." },
      { title: "Fruto e caráter", references: "Gl 5 · Ef 4–5", summary: "A presença do Espírito também aparece em amor, santidade, reconciliação e vida compartilhada." },
      { title: "Missão e discernimento", references: "At 13 · At 16 · 1Ts 5", summary: "Orientação, envio e teste comunitário impedem que linguagem espiritual dispense responsabilidade." },
    ]
  },
  {
    id: "cura-saude-oracao", number: "09", category: "Cura, saúde e cuidado", title: "Cura, saúde e oração", lede: "Narrativas de cura, lamento e cuidado comunitário para sustentar oração confiante sem reduzir pessoas enfermas a um problema espiritual.", question: "Como orar por cura, usar recursos de cuidado e acompanhar quem sofre sem culpa, espetáculo ou promessa indevida?", methodologicalNote: "Não diagnostica, não substitui cuidado médico e não apresenta cura como resultado garantido da fé ou do ministério.", tags: ["cura", "saúde", "oração", "compaixão"], destination: "people", destinationLabel: "Abrir pessoas e biografias", steps: [
      { title: "Compaixão e sinais", references: "Mc 1–2 · Lc 4 · Jo 9", summary: "As curas de Jesus unem compaixão, restauração social e sinais; cada narrativa tem voz própria." },
      { title: "Oração e cuidado", references: "Tg 5 · 2Rs 5 · 2Tm 4", summary: "Oração, unção, conselho, recursos e limites aparecem sem uma única explicação para todo sofrimento." },
      { title: "Dons e comunidade", references: "1Co 12–13", summary: "Dons de cura pertencem ao corpo e são inseparáveis de amor, discernimento e responsabilidade." },
      { title: "Esperança e lamento", references: "Rm 8 · 2Co 4–5 · Ap 21", summary: "A esperança escatológica consola sem negar dor presente nem culpabilizar quem espera." },
    ]
  },
  {
    id: "santidade-corpo-comunidade", number: "10", category: "Santidade e formação", title: "Santidade, corpo e comunidade", lede: "Uma investigação de aliança, templo, discipulado e vida comum para entender santidade como pertencimento e transformação integral.", question: "Como falar de santidade sem legalismo, individualismo ou desprezo pelo corpo e pela comunidade?", methodologicalNote: "Distingue pureza ritual, ética, metáfora do templo e tradição de santificação posterior.", tags: ["santidade", "corpo", "discipulado", "comunidade"], destination: "library", destinationLabel: "Abrir os 66 livros", steps: [
      { title: "Santo em Israel", references: "Lv 19 · Is 6 · Ez 36", summary: "Santo, justiça, culto, corpo e terra se relacionam em contextos rituais e sociais concretos." },
      { title: "Jesus e a mesa", references: "Mc 7 · Mt 5–7", summary: "Jesus reconfigura fronteiras e coloca desejo, verdade, misericórdia e reconciliação no centro." },
      { title: "Corpo e templo", references: "1Co 3 · 1Co 6 · Rm 12", summary: "Corpo não é acessório da fé; culto e ética atravessam práticas pessoais e relações comunitárias." },
      { title: "Vida no Espírito", references: "Gl 5 · 1Ts 4–5 · Hb 12", summary: "Santificação inclui fruto, esperança, disciplina e cuidado mútuo — não uma escada de mérito." },
    ]
  },
  {
    id: "sofrimento-lamento-esperanca", number: "11", category: "Sofrimento, cruz e esperança", title: "Sofrimento, lamento e esperança", lede: "Jó, salmos, profetas, cruz e ressurreição para enfrentar dor e mal sem respostas simplistas ou romantização da ferida.", question: "Que formas de esperança a Bíblia oferece quando a explicação não chega e a dor permanece?", methodologicalNote: "Recusa atribuir automaticamente sofrimento a pecado pessoal, disciplina divina ou ausência de fé.", tags: ["sofrimento", "Jó", "cruz", "esperança"], destination: "library", destinationLabel: "Abrir dossiês bíblicos", steps: [
      { title: "Jó e o limite das respostas", references: "Jó 1–2 · Jó 38–42", summary: "Amigos podem transformar teologia em acusação; o livro preserva protesto, mistério e encontro." },
      { title: "Lamento profético", references: "Lm 3 · Hc 1–3 · Sl 22", summary: "O clamor não é o oposto da fé; ele pode ser linguagem pública de confiança ferida." },
      { title: "Cruz e solidariedade", references: "Mc 15 · Rm 8 · 2Co 1", summary: "A cruz não justifica violência; ela revela entrega, solidariedade e esperança em meio à morte." },
      { title: "Nova criação", references: "1Pe 1 · Ap 21–22", summary: "A consumação promete restauração sem apagar a importância do cuidado e da justiça no presente." },
    ]
  },
  {
    id: "etica-sexual-corpo-fidelidade", number: "12", category: "Corpo, fidelidade e cuidado", title: "Ética sexual, corpo e fidelidade", lede: "Leia textos sobre corpo, desejo, casamento, vulnerabilidade e cuidado com atenção ao contexto histórico, à dignidade e à responsabilidade relacional.", question: "Como estudar ética sexual biblicamente com verdade, graça, cuidado a vulneráveis e sem instrumentalizar textos contra pessoas?", methodologicalNote: "Não reduz textos a listas; considera gênero, linguagem, mundo antigo, debates acadêmicos, leitura pentecostal e proteção contra abuso e violência.", tags: ["ética sexual", "corpo", "fidelidade", "cuidado"], destination: "bibliography", destinationLabel: "Abrir bibliografia e fontes", steps: [
      { title: "Corpo e criação", references: "Gn 1–2 · Sl 139", summary: "Criação, imagem de Deus e corporeidade oferecem pontos de partida, sem ignorar narrativas de queda e conflito." },
      { title: "Leis e vulnerabilidade", references: "Dt 22 · Lv 18–20", summary: "Leis antigas devem ser lidas em seus mundos sociais, jurídicos e cultuais antes de qualquer aplicação contemporânea." },
      { title: "Jesus, desejo e cuidado", references: "Mt 5 · Mt 19 · Jo 4", summary: "Jesus trata desejo, verdade, aliança e vulnerabilidade sem legitimar acusação pública ou violência." },
      { title: "Comunidade e responsabilidade", references: "1Co 5–7 · Ef 5 · 1Ts 4", summary: "Corpo, consentimento, fidelidade, poder e cuidado comunitário requerem leitura atenta ao contexto das cartas." },
    ]
  },
];
