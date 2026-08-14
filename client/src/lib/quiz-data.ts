// Cartografia de Leituras: perguntas de revisão para discernimento, não competição.

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  reference: string;
};

export type QuizSet = {
  id: string;
  title: string;
  description: string;
  category: "Livro" | "Período" | "Personagem" | "Doutrina" | "Escatologia";
  questions: QuizQuestion[];
};

export const quizSets: QuizSet[] = [
  { id: "metodo-enciclopedia", title: "Método de pesquisa bíblica", description: "Teste se você consegue distinguir texto, contexto, interpretação e doutrina.", category: "Doutrina", questions: [
    { id: "m-1", prompt: "Qual afirmação descreve melhor uma distinção metodológica?", options: ["Uma hipótese arqueológica é apresentada como prova final.", "A leitura confessional é identificada como confessional e comparada com outras camadas.", "Toda interpretação pentecostal é tratada como consenso acadêmico.", "O contexto histórico substitui o texto bíblico."], answer: 1, explanation: "O método da plataforma não elimina a fé; ele identifica a natureza de cada afirmação e evita que uma camada seja apresentada como outra.", reference: "Notas de método da enciclopédia" },
    { id: "m-2", prompt: "O que uma variante textual mostra primeiro?", options: ["Que toda a passagem é falsa.", "Que existe diferença entre testemunhos e é necessário avaliar os argumentos.", "Que a tradução mais antiga é sempre perfeita.", "Que o sentido teológico desaparece."], answer: 1, explanation: "Uma variante é um dado sobre a transmissão. A avaliação exige comparar testemunhos, contexto, genealogia e decisões editoriais.", reference: "Yale University Library — crítica textual" },
    { id: "m-3", prompt: "Por que capítulos e versículos exigem cautela?", options: ["Porque são parte do hebraico original.", "Porque foram acrescentados posteriormente para localização e podem cortar unidades literárias.", "Porque não existem em nenhuma Bíblia moderna.", "Porque impedem qualquer leitura teológica."], answer: 1, explanation: "A divisão facilita a consulta, mas não deve substituir a percepção de cenas, poemas, argumentos e discursos inteiros.", reference: "Bible Odyssey — por que a Bíblia tem esta forma" },
  ] },
  { id: "pentateuco", title: "Pentateuco e formação de Israel", description: "Percorra criação, êxodo, aliança, deserto, lei e memória.", category: "Período", questions: [
    { id: "p-1", prompt: "Em Êxodo 3, qual é a resposta imediata à insegurança de Moisés?", options: ["Uma genealogia completa.", "A promessa de presença: ‘Eu estarei contigo’.", "A ordem para construir o templo.", "A coroação de Moisés."], answer: 1, explanation: "A vocação é sustentada pela presença de Deus e pela memória da libertação, não pela autoconfiança do mediador.", reference: "Êxodo 3:12" },
    { id: "p-2", prompt: "Como ler Gênesis 1 sem reduzir o capítulo a um cronograma?", options: ["Ignorando sua forma literária.", "Observando repetição, separação, nomeação, bondade e contexto cosmológico.", "Tratando todo símbolo como código secreto.", "Eliminando a confissão teológica."], answer: 1, explanation: "A forma litúrgica e a confissão de ordem e bondade são parte do argumento do texto; perguntas materiais devem ser tratadas com métodos próprios.", reference: "Gênesis 1:1–5" },
    { id: "p-3", prompt: "Qual tensão atravessa a linguagem de Torah?", options: ["Ela significa apenas punição.", "Ela pode significar lei, ensino e instrução conforme o contexto.", "Ela nunca aparece em poesia.", "Ela é uma palavra grega do Novo Testamento."], answer: 1, explanation: "‘Instrução’ comunica melhor alguns contextos; ‘lei’ preserva a tradição, mas não esgota o campo semântico.", reference: "Salmo 1:1–3" },
  ] },
  { id: "espirito-missao", title: "Espírito, dons e missão", description: "Relacione Pentecostes, dons, comunidade e discernimento pentecostal.", category: "Doutrina", questions: [
    { id: "e-1", prompt: "Qual é o movimento narrativo de Atos 2?", options: ["Experiência privada sem testemunho.", "Derramamento do Espírito, comunicação pública, testemunho e formação comunitária.", "Fim da missão entre povos.", "Substituição das Escrituras por êxtase."], answer: 1, explanation: "O Espírito capacita testemunho e comunidade; o episódio é interpretado por Joel e conduz a arrependimento, batismo e partilha.", reference: "Atos 2:1–47" },
    { id: "e-2", prompt: "Como a plataforma trata os dons espirituais?", options: ["Como prova automática de superioridade.", "Como dons para serviço e edificação, em diálogo com discernimento e vida comunitária.", "Como fenômenos sem relação com o Espírito.", "Como uma doutrina que elimina amor e justiça."], answer: 1, explanation: "Charisma e pneuma aparecem em contextos de edificação, missão, santidade e responsabilidade; nenhum dom substitui o amor.", reference: "1 Coríntios 12–14" },
    { id: "e-3", prompt: "Qual limite a escatologia pentecostal deve respeitar?", options: ["Marcar datas com segurança.", "Transformar toda crise política em cumprimento certo.", "Discernir, perseverar e evitar especulação apresentada como profecia.", "Abandonar esperança futura."], answer: 2, explanation: "A esperança é mantida, mas o texto bíblico não autoriza cronogramas infalíveis nem a canonização de manchetes.", reference: "Mateus 24:36–44; Apocalipse 13" },
  ] },
  { id: "apocalipse-leitura", title: "Apocalipse sem especulação", description: "Identifique símbolos, escolas interpretativas e limites de certeza.", category: "Escatologia", questions: [
    { id: "a-1", prompt: "O que apokalypsis significa antes do uso popular moderno?", options: ["Revelação ou desvelamento.", "Somente catástrofe nuclear.", "Uma tabela cronológica.", "Uma tradução de império."], answer: 0, explanation: "O termo grego aponta para revelação. O gênero interpreta a crise por imagens simbólicas e esperança, não apenas por destruição.", reference: "Apocalipse 1:1" },
    { id: "a-2", prompt: "Qual postura é metodologicamente mais segura diante de Apocalipse 13?", options: ["Escolher uma manchete e encerrá-la.", "Comparar Daniel, contexto imperial, escolas de leitura e limites de certeza.", "Ignorar o simbolismo.", "Afirmação de datas exatas."], answer: 1, explanation: "O texto exige sabedoria e discernimento; a enciclopédia apresenta hipóteses e tradições sem transformá-las em certeza indiscutível.", reference: "Apocalipse 13:18" },
    { id: "a-3", prompt: "O que as escolas preterista, historicista, futurista, idealista e eclética têm em comum?", options: ["Todas concordam em cada detalhe.", "São modelos de leitura que destacam relações diferentes entre texto, história e consumação.", "São nomes de cinco manuscritos.", "Eliminam a necessidade de contexto."], answer: 1, explanation: "Modelos interpretativos organizam dados e tensões; apresentá-los lado a lado permite discernir seus alcances e limites.", reference: "Apocalipse 1–22" },
  ] },
];
