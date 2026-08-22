import type { DeepStudyModule, DeepStudySource } from "./deep-study-data";

const module = (id: string, title: string, references: string, question: string, texto: string, contexto: string, significado: string, debate: string, pentecostal: string): DeepStudyModule => ({
  id,
  title,
  references,
  question,
  layers: { texto, contexto, significado, debate, pentecostal },
});

export const churchStudyModules: DeepStudyModule[] = [
  module(
    "identidade",
    "1. Igreja: assembleia, povo e casa de Deus",
    "Mateus 16:13–20 · Atos 2:42–47 · 1 Pedro 2:4–10 · 1 Timóteo 3:14–16",
    "O que se perde quando Igreja é reduzida a prédio, evento, marca ou opinião individual?",
    `No Novo Testamento, ekklesia nomeia uma assembleia convocada e, em diferentes contextos, a comunidade local e o povo reunido em Cristo. A Igreja aparece como casa de Deus, povo adquirido, rebanho, templo e comunidade de discípulos. Nenhuma imagem sozinha esgota o mistério: a Igreja recebe sua identidade de Deus, reúne pessoas reais e se torna visível em culto, ensino, mesa, cuidado e testemunho.

Mateus 16 relaciona a comunidade à confissão de Jesus como Messias; Atos 2 mostra uma comunidade que persevera no ensino apostólico, na comunhão, no partir do pão e nas orações; 1 Pedro 2 chama os crentes de pedras vivas, sacerdócio santo e povo de propriedade de Deus. A Igreja, portanto, não começa no gosto do consumidor religioso, mas na convocação e na obra de Deus que reúne pessoas diferentes em torno de Cristo.`,
    `As primeiras comunidades nasceram em casas, sinagogas, pátios, estradas e cidades do Mediterrâneo. Elas precisaram aprender a viver entre judeus e gentios, ricos e pobres, mulheres e homens, pessoas livres e escravizadas, sem apagar conflitos nem fingir que a unidade já estava pronta. A linguagem de povo, casa e assembleia conversa com a história de Israel e com a vida urbana antiga, mas é reorientada pela morte e ressurreição de Jesus.

A pesquisa histórico-social sugere grupos relativamente pequenos, com reuniões domésticas, liderança variada, redes de patronagem e diferentes formas de sustento. Essa reconstrução é probabilística: não autoriza impor uma única forma de culto, prédio, governo ou financiamento a todas as épocas.`,
    `Ser Igreja é pertencer a Cristo e, por isso, pertencer a um povo. A fé não é uma experiência privada que dispensa o irmão, nem a instituição é um fim em si mesma. A comunidade se torna testemunha quando a adoração gera verdade, reconciliação, hospitalidade, ensino, serviço e esperança.

O prédio pode acolher a Igreja; ele não define sozinho o que a Igreja é. Uma igreja sem espaço próprio continua podendo ser Igreja, e uma instituição com grande estrutura pode deixar de expressar a vida do corpo quando perde a verdade, o cuidado e a missão.`,
    `A tradição católica enfatiza a Igreja como povo de Deus, corpo de Cristo e realidade sacramental; tradições reformadas sublinham Palavra, sacramentos ou ordenanças e disciplina; tradições livres destacam a comunidade confessante; perspectivas pentecostais acentuam presença do Espírito, dons e missão. O debate não deve escolher uma caricatura, mas perguntar quais dimensões cada tradição protege e quais riscos precisa vigiar.

Também existe debate sobre a relação entre Igreja local e Igreja universal, sobre a continuidade de Israel e sobre quais marcas tornam uma comunidade reconhecível. A resposta cristã não pode ser apenas sociológica: a Igreja é visível em práticas, mas sua origem e esperança são teológicas.`,
    `A perspectiva pentecostal/IDB pode confessar a Igreja como comunidade viva, cheia do Espírito e enviada à Grande Comissão, sem substituir santidade, ensino e cuidado por intensidade de culto. O poder do Espírito cria testemunhas e servos; não cria uma elite acima do corpo nem autoriza líderes a controlar consciências.

A pergunta pentecostal decisiva é se a experiência do Espírito produz um povo mais parecido com Jesus: reconciliado, generoso, santo, atento aos pobres, capaz de ouvir a Palavra e pronto para testemunhar.`,
  ),
  module(
    "povo-promessa",
    "2. Israel, promessa e nova humanidade",
    "Êxodo 19:3–6 · Isaías 2:1–4 · Romanos 9–11 · Gálatas 3:26–29 · Efésios 2:11–22",
    "Como falar da Igreja como povo de Deus sem apagar Israel nem ignorar a entrada dos povos?",
    `A linguagem de povo de Deus não nasce no Novo Testamento. Êxodo 19 chama Israel de propriedade peculiar, reino de sacerdotes e nação santa; Isaías imagina povos caminhando para a instrução do Senhor. Em Cristo, Gálatas 3 e Efésios 2 descrevem uma nova humanidade na qual gentios são incorporados pela fé e a inimizade é enfrentada.

Romanos 9–11 impede uma conclusão apressada. Paulo fala da dor por Israel, da fidelidade de Deus às suas promessas e do mistério da relação entre judeus e gentios. A Igreja não pode usar a linguagem de povo para transformar a eleição em privilégio étnico, nem para declarar que a história de Israel perdeu toda relevância.`,
    `As primeiras comunidades cristãs eram formadas em uma encruzilhada: Jesus, os apóstolos e a linguagem das promessas eram judaicos, mas a missão alcançava cidades gentílicas. Circuncisão, alimentos, calendários, mesa e pertencimento tornaram-se questões práticas, não abstrações. Atos 15 registra que a unidade foi buscada por conversa, testemunhos, Escrituras, oração e decisão comum.

A expansão para os povos ocorreu dentro do mundo imperial, com deslocamentos, redes comerciais, sinagogas da diáspora e casas de patronos. A Igreja precisou aprender a atravessar fronteiras sem transformar o evangelho em uma cópia da cultura dominante.`,
    `Ser povo de Deus significa receber uma identidade que não é fabricada por raça, classe, nacionalidade, sucesso ou consumo. A Igreja é uma comunidade de memória e promessa: lembra a história bíblica, participa da reconciliação em Cristo e espera a restauração de todas as coisas.

Essa identidade é vocacional. O povo é chamado para anunciar as virtudes de Deus, praticar justiça e servir como sinal de reconciliação. Pertencer não é ganhar superioridade espiritual; é assumir responsabilidade por uma vida que torne visível a fidelidade de Deus.`,
    `Há debates intensos sobre continuidade e descontinuidade entre Israel e Igreja, sobre leituras de Gálatas e Romanos, e sobre a linguagem de cumprimento. Uma aplicação que transforma judeus em simples degrau histórico produz supersessionismo e pode alimentar antijudaísmo. Outra aplicação que impede qualquer leitura cristológica das promessas ignora o modo como o Novo Testamento lê Jesus e a missão aos gentios.

O estudo deve distinguir a afirmação bíblica de uma teoria completa sobre o Estado moderno de Israel. Textos sobre povo de Deus não autorizam nacionalismo teológico, racismo ou apropriação política automática da Escritura.`,
    `A leitura pentecostal/IDB pode enfatizar que o Espírito atravessa fronteiras e forma uma comunidade de muitas línguas, como em Atos 2. Mas Pentecostes não apaga povos; ele torna o evangelho audível em suas próprias línguas e desafia a pretensão de uma cultura ser a medida do Reino.

Uma Igreja pentecostal saudável combina zelo missionário com humildade histórica: anuncia Cristo, honra a história bíblica de Israel, rejeita antijudaísmo, acolhe povos e testa seus discursos políticos à luz do amor, da verdade e da justiça.`,
  ),
  module(
    "corpo",
    "3. O corpo de Cristo: unidade que precisa de cada membro",
    "Romanos 12:3–8 · 1 Coríntios 12–14 · Efésios 4:1–16 · Colossenses 1:15–20",
    "Como afirmar uma só Igreja sem apagar a diversidade de corpos, dons, histórias e responsabilidades?",
    `Paulo usa o corpo para falar de pertencimento, interdependência e diversidade. Cristo é a cabeça; o Espírito distribui dons; cada membro recebe uma função; o amor e a edificação regulam a reunião. Em Efésios 4, ministros equipam os santos para o ministério, e o corpo cresce quando cada parte coopera. O texto não descreve uma plateia dependente de um único performer.

Em 1 Coríntios 12, a frase “o corpo não é um só membro, mas muitos” combate tanto a superioridade de alguns quanto a sensação de inutilidade de outros. O olho não pode dizer à mão “não preciso de você”; o membro ferido não deve ser descartado. A metáfora é uma ética de dependência mútua.`,
    `A metáfora respondia a comunidades com diferenças de status, origem e prática. Em Corinto, falar em corpo confrontava a competição por dons; em Roma, chamava pessoas de origens diversas à sobriedade; em Efésios, ligava maturidade à unidade da fé e à verdade em amor.

O corpo é uma imagem socialmente exigente porque torna visível a relação entre privilégio, necessidade e responsabilidade. O problema não é somente quem fala no culto; é quem é ouvido, quem recebe cuidado, quem tem acesso aos recursos e quem permanece invisível.`,
    `A Igreja saudável não mede valor pelo microfone, pela posição, pelo número de seguidores ou pela proximidade com o líder. O corpo reconhece ministérios públicos e serviços discretos, ensino e misericórdia, governo e hospitalidade, oração e administração. Unidade não é uniformidade: é comunhão orientada para Cristo, na qual diferenças não viram desprezo nem a diversidade vira desculpa para desordem.

A linguagem do corpo também impede que a liderança seja pensada como substituição. Líderes existem para equipar, e membros existem para participar. O corpo amadurece quando a responsabilidade circula sem que a doutrina seja abandonada.`,
    `Há debate sobre se o corpo de Cristo deve ser entendido principalmente como realidade local, universal, sacramental ou espiritual. Também há divergência sobre listas de dons, cargos permanentes e participação de mulheres em funções de governo e ensino. Uma leitura responsável distingue o que o texto afirma, o que cada tradição deduz e o que a prática histórica acrescentou.

O risco aparece nos dois extremos: transformar a metáfora em organograma rígido ou usá-la para rejeitar toda forma de coordenação. Paulo fala de muitos membros, mas também de ordem, ensino, correção e responsabilidade.`,
    `A leitura pentecostal valoriza o corpo como espaço de dons, testemunho e discernimento. A correção decisiva é que dom sem fruto não é maturidade: 1 Coríntios 13 fica entre os capítulos sobre dons; Efésios 4 conduz à maturidade e ao amor. Uma igreja cheia do Espírito precisa ser também uma igreja que ouve, testa, inclui, protege e edifica.

Na prática, o culto pentecostal pode abrir espaço para testemunhos, oração e participação sem transformar espontaneidade em licença para interromper, humilhar ou manipular. O Espírito distribui; a comunidade discerne; Cristo permanece o centro.`,
  ),
  module(
    "diaconal",
    "4. O corpo diaconal: servir à mesa, aos vulneráveis e à verdade",
    "Atos 6:1–7 · 1 Timóteo 3:8–13 · Romanos 16:1–2 · 1 Timóteo 5:3–16",
    "Por que cuidar de pessoas, recursos e mesas também é ministério espiritual e não tarefa de segunda categoria?",
    `Atos 6 apresenta uma crise concreta na distribuição diária às viúvas; os apóstolos reconhecem a gravidade do serviço e organizam a comunidade para que a Palavra e a mesa não sejam abandonadas. 1 Timóteo 3 exige dos diáconos caráter, fidelidade, consciência limpa, casa bem cuidada e serviço provado. Romanos 16 chama Febe de diakonos em uma saudação que a apresenta como serva e benfeitora.

O texto não reduz diaconia a logística. A maneira como a comunidade distribui alimento revela quem ela considera parte do corpo. O cuidado é teológico porque afirma, em ações concretas, que a dignidade do vulnerável não depende de poder, produtividade ou visibilidade.`,
    `A distribuição de alimentos acontecia em uma comunidade com diferenças linguísticas e culturais entre hebreus e helenistas. Viúvas eram vulneráveis em uma economia sem proteção social moderna. O diaconato precisa ser lido no cruzamento de culto, economia, hospitalidade, gênero, família, pobreza e confiança pública; não basta importar o título para um cargo honorário.

As comunidades antigas dependiam de redes de hospitalidade, ofertas, trabalho e patronagem. Isso exigia cuidado para que ajuda não se tornasse controle e para que doadores não comprassem superioridade dentro da assembleia.`,
    `O corpo diaconal administra cuidado para que a comunhão se torne material: alimento, visitação, acolhimento, ordem, recursos, acompanhamento e defesa da dignidade. Serviço diaconal não é apenas executar tarefas; é discernir necessidades, corrigir omissões, criar processos justos e prestar contas.

Uma diaconia madura mantém registros, define critérios públicos, protege a privacidade, encaminha casos complexos a profissionais e evita criar dependência pessoal do líder. Ela sabe que oração e ajuda material não competem: ambas fazem parte da atenção cristã ao ser humano inteiro.`,
    `Cristãos divergem sobre quanto Atos 6 institui o ofício posterior de diácono, sobre o alcance de diakonos para mulheres e sobre a relação entre diaconato, administração e assistência. Algumas tradições ordenam diáconos como ministério litúrgico; outras os veem como líderes de cuidado e governo; outras usam o termo para ministérios de serviço diversos.

O consenso ético mínimo é que caráter, competência, transparência e cuidado não são opcionais. O título não corrige uma prática injusta. A Igreja precisa avaliar se sua estrutura serve a pessoas reais e se existe correção quando recursos ou relações são mal administrados.`,
    `Na prática pentecostal/IDB, o corpo diaconal pode unir oração, hospitalidade, visitação, ação social, apoio ao culto e zelo pela ordem sem se tornar polícia interna ou braço informal de poder. A unção não elimina prestação de contas: recursos precisam de registros, decisões precisam de colegialidade e o cuidado precisa de protocolos para não expor vítimas nem criar dependência abusiva.

O diácono não é um auxiliar sem voz. É um ministro que ajuda a Igreja a perceber necessidades, reparar desigualdades e fazer a mesa do Senhor contradizer a mesa da exclusão.`,
  ),
  module(
    "pastoral",
    "5. O corpo pastoral: ensinar, cuidar, proteger e equipar",
    "1 Timóteo 3:1–7 · Tito 1:5–9 · Atos 20:17–38 · 1 Pedro 5:1–4 · João 10:1–18",
    "Como exercer liderança pastoral sem domínio, isolamento do líder ou abandono do rebanho?",
    `Os textos usam vocabulários de supervisão, presbitério e pastoreio em combinações que não formam um manual administrativo único. 1 Timóteo 3 e Tito 1 destacam caráter e aptidão para ensinar; Atos 20 reúne vigilância, ensino e lágrimas; 1 Pedro 5 ordena pastorear sem dominar; João 10 apresenta o pastor em contraste com o mercenário e coloca a vida em jogo no cuidado.

A liderança bíblica é relacional e doutrinária. Ela guarda a memória do evangelho, acompanha pessoas, identifica perigos e prepara o corpo para servir. Não se resume a falar bem, administrar uma agenda ou reunir multidões.`,
    `As comunidades do primeiro século viviam em casas, redes de patronagem e cidades com autoridades religiosas e civis. Liderar implicava ensinar, discernir conflitos, hospedar, proteger doutrina, administrar relações e responder por pessoas. A pluralidade de termos sugere desenvolvimento e variação de estruturas, não licença para imaginar que qualquer modelo posterior seja automaticamente bíblico.

O cuidado pastoral também ocorria em ambientes de sofrimento, perseguição, pobreza e migração. Isso explica por que vigilância, hospitalidade, sobriedade e exemplo aparecem ao lado de ensino e governo.`,
    `O corpo pastoral existe para servir à maturidade do corpo inteiro. Ensinar é interpretar com fidelidade; pastorear é conhecer, proteger, corrigir, consolar e acompanhar; supervisionar é cuidar de doutrina, pessoas e recursos. A liderança saudável distribui ministério e prepara novos servos. Ela não precisa fabricar dependência para provar sua importância.

Pastorear inclui limites: não prometer o que Deus não prometeu, não invadir a consciência, não substituir atendimento médico ou psicológico e não usar intimidade pastoral para obter favores. A vulnerabilidade de quem procura cuidado exige ética, não apenas boa intenção.`,
    `As tradições divergem sobre bispos, presbíteros, pastores, ordenação, sucessão, governo congregacional, presbiteriano e episcopal, e sobre quem pode ocupar cada função. Também há debate sobre autoridade pastoral em casos de disciplina e sobre os limites da obediência.

A regra de 1 Pedro 5 é crucial: liderança cristã não é senhorio sobre os que foram confiados, mas exemplo e cuidado sob o Supremo Pastor. Uma estrutura pode ser legítima e ainda precisar de reformas quando centraliza informação, dinheiro ou decisões sem revisão.`,
    `A tradição pentecostal reconhece chamado, unção, dons de liderança e autoridade espiritual, mas precisa avaliá-los pelos requisitos de caráter, ensino, família, testemunho e fruto. O título de pastor não protege contra abuso; a linguagem de cobertura não substitui transparência; a experiência profética não suspende a necessidade de conselho, limites, proteção e correção.

Uma liderança pentecostal madura convida a comunidade a discernir, forma sucessores, aceita perguntas difíceis e sabe pedir ajuda. O pastor não é o dono da presença de Deus, e a igreja não é obrigada a escolher entre fidelidade espiritual e segurança institucional.`,
  ),
  module(
    "evangelista",
    "6. O corpo evangelístico: anunciar, atravessar fronteiras e formar discípulos",
    "Efésios 4:11–16 · Atos 8:4–40 · Atos 21:8–9 · 2 Timóteo 4:1–5 · Mateus 28:18–20",
    "O que caracteriza o evangelista: falar em público, anunciar boas-novas, plantar comunidades, equipar testemunhas ou tudo isso em relação?",
    `Efésios inclui evangelistas entre os dons de Cristo para equipar os santos; Atos chama Filipe de evangelista e narra seu testemunho em Samaria e no caminho de Gaza; 2 Timóteo ordena fazer a obra de um evangelista. Evangelizar envolve anunciar Jesus, explicar a Escritura, responder a pessoas concretas, atravessar fronteiras e incorporar discípulos em uma comunidade.

Mateus 28 não termina na decisão inicial. Fazer discípulos inclui batizar, ensinar a guardar o que Jesus ordenou e caminhar sob sua presença. O anúncio é urgente, mas não deve ser separado de formação, pertencimento, perseverança e cuidado.`,
    `Filipe atua em ambientes de deslocamento, tensão étnica e estradas imperiais. O evangelho circula por casas, cidades, sinagogas, mercados, prisões e caminhos. Evangelização no Novo Testamento não é apenas campanha: inclui hospitalidade, tradução, catequese, batismo, vida comunitária, sofrimento e continuidade do testemunho.

O encontro com o eunuco etíope também recorda que a missão atravessa fronteiras de origem, corpo, status e geografia. O evangelista precisa aprender a escutar a pergunta do outro e a ler a Escritura de modo compreensível, sem exigir que a pessoa abandone sua dignidade para se aproximar.`,
    `O evangelista não é vendedor de decisões nem celebridade que concentra o anúncio. Sua tarefa é tornar Cristo inteligível, convidar à conversão, formar discípulos e equipar a Igreja para testemunhar. A proclamação precisa respeitar consciência, verdade, contexto e vulnerabilidade.

Pressão psicológica, promessa indevida, exploração de testemunhos, exposição pública e manipulação financeira contradizem a boa-nova que se pretende anunciar. O fruto do evangelismo é uma comunidade reconciliada e perseverante, não somente uma estatística de mãos levantadas.`,
    `Há debate sobre evangelista como ofício específico, dom itinerante, função missionária ou vocação de toda a Igreja. A melhor síntese não apaga a tensão: todos os discípulos são chamados a testemunhar, e algumas pessoas recebem graça, treinamento e reconhecimento especiais para evangelizar e equipar.

O ministério especializado existe para multiplicar participação, não para monopolizar missão. Plantar igrejas também levanta perguntas sobre continuidade: quem ensina os novos convertidos, quem cuida dos vulneráveis, quem responde por dinheiro e como a comunidade local discerne sua maturidade?`,
    `A missão pentecostal/IDB confessa a Grande Comissão, a ação do Espírito e a necessidade de proclamar o evangelho completo. A maturidade aparece quando fervor se alia a doutrina, compaixão, santidade, tradução cultural e responsabilidade.

O evangelista anuncia com autoridade, mas também escuta, serve, sofre com pessoas e encaminha novos convertidos para uma igreja que ensina e cuida. O poder do Espírito não é uma técnica de persuasão; é capacitação para testemunhar Cristo com verdade e amor.`,
  ),
  module(
    "equipar",
    "7. Anciãos, mestres e ministérios que equipam",
    "Efésios 4:7–16 · Atos 14:21–28 · Atos 20:17–35 · 1 Timóteo 5:17–22 · Tito 1:5–9",
    "Como reconhecer ministérios diferentes sem criar castas espirituais ou concentrar todo o conhecimento?",
    `Efésios 4 descreve apóstolos, profetas, evangelistas, pastores e mestres como dons dados para o aperfeiçoamento dos santos, o trabalho do ministério e a edificação do corpo. O alvo é que todos cheguem à maturidade e não sejam levados por qualquer vento de doutrina. A lista funciona como promessa de capacitação, não como catálogo para prestígio.

Atos mostra Paulo e Barnabé fortalecendo discípulos, nomeando anciãos, orando e confiando a comunidade à graça de Deus. 1 Timóteo 5 reconhece que alguns anciãos trabalham especialmente na palavra e no ensino, mas ainda exige testemunho, proteção contra acusações levianas e exame cuidadoso.`,
    `As primeiras comunidades combinavam liderança itinerante, anciãos locais, profetas, mestres, anfitriões, cooperadores e pessoas responsáveis por recursos. A variedade refletia crescimento, distâncias e necessidades diferentes. Não havia uma separação moderna entre “clero profissional” e “leigos” nos mesmos termos em todos os lugares.

O ensino era transmitido em relações de confiança: memória dos apóstolos, leitura pública, catequese, cartas e vida compartilhada. Isso tornava a formação inseparável do caráter de quem ensinava e da capacidade da comunidade de testar o ensino recebido.`,
    `Ministério é serviço público reconhecido pela comunidade. Equipar significa abrir caminhos para que outras pessoas leiam a Bíblia, sirvam, evangelizem, cuidem, liderem e discernam. Um mestre que mantém todos dependentes de sua explicação falha na finalidade do ensino.

O reconhecimento de anciãos e mestres precisa unir competência bíblica, humildade, capacidade de ouvir, honestidade intelectual e vida coerente. A formação teológica não substitui piedade, mas a piedade também não torna dispensável o estudo cuidadoso.`,
    `As tradições divergem sobre a permanência de apóstolos e profetas, a relação entre anciãos e pastores, o papel de mestres, a ordenação e a participação de mulheres. Há ainda tensão entre formação acadêmica e reconhecimento comunitário. Uma universidade não garante maturidade, e a ausência de diploma não prova falta de chamado.

O debate deve evitar rótulos rápidos. Pergunte-se o que cada modelo faz com a autoridade, como protege a comunidade contra erro e como impede que o acesso ao saber bíblico se torne monopólio.`,
    `Em uma igreja pentecostal, mestres e anciãos ajudam a interpretar experiências, testar profecias e conectar dons à Escritura. O Espírito não é adversário da formação; ele conduz a uma verdade que precisa ser aprendida, praticada e compartilhada.

A IDB pode fortalecer sua identidade formando líderes que unam fogo e fundamento: oração e exegese, testemunho e história, convicção e prestação de contas. O mestre serve quando torna o corpo mais capaz de discernir, não quando se apresenta como a única voz segura.`,
  ),
  module(
    "dons",
    "8. Dons, ministérios e vocações: autoridade distribuída para edificação",
    "Romanos 12:1–8 · 1 Coríntios 12:1–31 · 1 Coríntios 13–14 · 1 Pedro 4:7–11",
    "Como discernir dons sem transformar manifestação espiritual em ranking de valor?",
    `As listas de Romanos 12, 1 Coríntios 12 e 1 Pedro 4 não coincidem e não pretendem esgotar o agir de Deus. Elas incluem serviço, ensino, exortação, contribuição, liderança, misericórdia, palavra de sabedoria, fé, cura, socorros, governos, línguas e interpretação. O critério repetido é a edificação do corpo e o amor.

Paulo usa a expressão “graça dada” para deslocar o foco do mérito para a responsabilidade. O dom não é propriedade do ministro, mas uma graça confiada para o bem comum. O discernimento observa tanto a manifestação quanto a forma como a pessoa trata os outros.`,
    `Corinto conhecia competição por honra, eloquência e experiências religiosas. Paulo não extingue os dons; ele os reorganiza: um Espírito, muitos membros, amor como caminho e avaliação comunitária. A reunião cristã precisa ser inteligível e construtiva, para que quem chega reconheça a presença de Deus e não apenas o desempenho de especialistas.

No mundo antigo, fala pública, patronagem e prestígio podiam produzir hierarquias. A correção paulina é radical: o membro menos honroso recebe cuidado maior, e nenhum dom autoriza desprezar outro membro.`,
    `Dom é graça recebida para servir, não certificado de superioridade. Vocação é reconhecida por caráter, fruto, competência, confirmação comunitária e perseverança. Ministérios podem ter visibilidade desigual, mas não dignidade desigual.

É útil distinguir quatro termos: dom é capacitação recebida; vocação é chamado discernido ao longo do tempo; ofício é responsabilidade reconhecida e delimitada; cargo é uma função administrativa criada por uma comunidade. Eles podem se relacionar, mas não são sinônimos. Confundir os termos cria abuso de linguagem e expectativas irreais.`,
    `Continuísmo e cessacionismo divergem sobre a permanência de dons extraordinários; continuístas divergem sobre profecia, cura, línguas e autoridade. Também há tensão entre linguagem de dons e estruturas de ofício. Uma leitura cuidadosa evita tanto apagar o testemunho bíblico quanto usar experiência privada para silenciar exame, Escritura e comunidade.

Nenhuma lista de dons resolve sozinha perguntas sobre remuneração, treinamento, limites, sucessão ou disciplina. Essas decisões precisam considerar Escritura, história, contexto, competência e proteção das pessoas.`,
    `A ênfase pentecostal no batismo no Espírito e nos dons precisa ser acompanhada por fruto, ordem e discernimento. 1 Coríntios 14 limita a reunião para que todos aprendam; Gálatas 5 mede o Espírito por caráter; Efésios 4 mede ministérios pelo equipar.

Onde um dom produz medo, dependência, humilhação ou impunidade, a igreja deve interromper, examinar e proteger. Dizer “foi Deus quem me deu” não encerra o discernimento; o próprio Novo Testamento manda julgar, testar e guardar o que é bom.`,
  ),
  module(
    "autoridade",
    "9. Autoridade, disciplina e prestação de contas",
    "Mateus 18:15–20 · Atos 15:1–35 · Gálatas 6:1–5 · 1 Timóteo 5:19–22 · 1 Pedro 5:1–5",
    "Como a Igreja corrige, decide e protege sem trocar discernimento por autoritarismo?",
    `Mateus 18 coloca correção em um processo que busca ganhar o irmão; Atos 15 mostra uma decisão comunitária com debate, testemunho, Escritura, experiência e carta; Gálatas 6 pede restauração com mansidão; 1 Pedro 5 proíbe dominar. Autoridade cristã é responsabilidade diante de Deus e dos irmãos, não licença para imunidade pessoal.

A autoridade aparece como serviço de preservar a verdade, o vínculo e a segurança do corpo. Ela pode precisar dizer não, suspender uma atividade, corrigir doutrina, proteger uma vítima ou pedir restituição. Seu objetivo não é preservar a imagem da instituição a qualquer custo.`,
    `As comunidades lidavam com conflitos de identidade, mesa, circuncisão, falsos ensinos, relações de poder e reputação. Decisões não eram tomadas por uma fórmula única: havia apóstolos, anciãos, enviados, assembleia, cartas e discernimento. A autoridade circulava em redes, e a comunidade precisava aprender a falar e a ouvir.

1 Timóteo 5 é especialmente sóbrio: acusações contra presbíteros não devem ser recebidas sem cuidado, mas pecados comprovados também não podem ser tratados como assunto privado quando afetam o corpo. A proteção contra calúnia e a proteção contra encobrimento precisam coexistir.`,
    `Uma Igreja confiável define quem decide, como decide, quem pode contestar, como recursos são auditados e como denúncias são recebidas. Disciplina não é vingança; restauração não é encobrimento; perdão não elimina limites; submissão não significa aceitar abuso.

Líderes devem responder por sua doutrina, conduta, dinheiro e tratamento das pessoas. Procedimentos não são falta de fé. São formas de amar o próximo quando emoções, reputação e poder podem distorcer o julgamento.`,
    `Tradições cristãs organizam autoridade de modos distintos: episcopal, presbiteral, congregacional, carismático e modelos mistos. O debate não pode ser resolvido apenas por slogans. Toda estrutura tem riscos: centralização, fragmentação, populismo, captura por famílias ou silenciamento de minorias.

O teste ético é se a forma protege a verdade, os vulneráveis e a missão. Um governo participativo pode continuar manipulável; um governo episcopal pode criar accountability forte ou concentração perigosa. A estrutura precisa ser examinada por seus frutos e mecanismos concretos.`,
    `No ambiente pentecostal, linguagem de autoridade espiritual precisa ser purificada de coerção. Profecia deve ser julgada; revelações não podem substituir Escritura; cobertura não pode impedir denúncia; cura e libertação não podem produzir exposição ou culpa.

Uma igreja cheia do Espírito cria conselhos, registros, canais seguros, formação de líderes e correção pública quando o dano é público. A submissão cristã é ao senhorio de Cristo e ao discernimento responsável, não à personalidade de um líder.`,
  ),
  module(
    "praticas",
    "10. Palavra, batismo, mesa, oração e comunhão",
    "Atos 2:42–47 · Mateus 28:18–20 · 1 Coríntios 10–11 · Colossenses 3:12–17 · Efésios 5:18–21",
    "Quais práticas fazem a Igreja permanecer Igreja ao longo do tempo?",
    `Atos 2 reúne doutrina dos apóstolos, comunhão, partir do pão e orações. Mateus liga batismo e ensino à missão; 1 Coríntios corrige a Ceia porque ricos humilhavam pobres; Colossenses e Efésios conectam cântico, gratidão, ensino, submissão mútua e vida santa. A Igreja é reconhecida por práticas repetidas que encarnam sua confissão.

A Palavra não é apenas informação religiosa: é memória pública do evangelho, critério de discernimento e formação da imaginação da comunidade. Batismo e Ceia não são adornos do culto; são sinais de pertencimento, promessa, comunhão e esperança, compreendidos de formas diferentes pelas tradições cristãs.`,
    `A mesa do mundo antigo era atravessada por status, patronagem e distinção social. A Ceia cristã não era neutra: sua forma podia testemunhar o evangelho ou reproduzir desigualdade. Batismo incorporava pessoas a um povo; ensino guardava a memória; oração colocava a comunidade diante de Deus; cântico formava imaginação compartilhada.

O culto cristão acontecia em casas, espaços públicos e edifícios posteriores. Forma e lugar mudaram, mas a pergunta permaneceu: a reunião permite que a comunidade escute Deus, reconheça uns aos outros, confesse o pecado, receba graça e seja enviada?`,
    `Palavra sem mesa vira informação; mesa sem verdade vira sociabilidade; oração sem justiça pode virar fuga; missão sem comunhão produz ativismo. A Igreja permanece no caminho quando suas práticas se corrigem mutuamente: ensino forma, batismo incorpora, Ceia reconcilia, oração sustenta, comunhão cura e missão envia.

Práticas também criam hábitos. O modo como a comunidade acolhe crianças, ouve idosos, recebe estrangeiros, coleta ofertas, trata quem discorda e distribui tempo revela sua teologia tanto quanto o sermão.`,
    `Católicos, ortodoxos, protestantes e pentecostais divergem sobre sacramentos, ordenanças, presença de Cristo, batismo infantil, Ceia, lava-pés e formas de culto. O estudo não apaga essas diferenças. Ele pergunta como cada tradição entende a ação de Deus, a participação da comunidade e o vínculo entre rito, fé, ética e missão.

Também há debate sobre culto presencial e digital, espontaneidade e liturgia, música e silêncio, centralidade da pregação e participação dos dons. O critério não é gosto pessoal, mas se a forma serve à verdade, ao amor, à acessibilidade e à edificação.`,
    `A tradição pentecostal/IDB enfatiza culto vivo, oração, dons, batismo no Espírito, santidade, Ceia e lava-pés conforme sua declaração de fé. A vitalidade do culto precisa desembocar em comunhão, discipulado, cuidado e missão.

Uma experiência intensa que não forma reconciliação, generosidade e serviço não alcança a finalidade bíblica do corpo. O Espírito pode agir em uma reunião vibrante e também no ensino paciente, na visita silenciosa, na confissão, no trabalho diaconal e na perseverança de quem permanece fiel sem aplauso.`,
  ),
  module(
    "missao",
    "11. Igreja enviada: evangelho, justiça, cidade e esperança",
    "Mateus 5:13–16 · Mateus 28:18–20 · Atos 1:8 · Tiago 2:14–26 · 2 Coríntios 5:14–21",
    "Como a Igreja anuncia Cristo e participa do bem comum sem perder a centralidade do evangelho?",
    `Jesus envia discípulos para fazer discípulos; Atos descreve testemunho de Jerusalém aos confins; Tiago recusa uma fé que vê o irmão com necessidade e apenas oferece palavras. A Igreja é enviada para proclamar, ensinar, batizar, curar, servir, denunciar injustiça, acolher estrangeiros e esperar a renovação de Deus.

2 Coríntios 5 chama a comunidade de embaixadora da reconciliação. A missão não é afirmar que a Igreja controla o mundo, mas testemunhar que Deus reconciliou em Cristo e, por isso, relações, instituições e hábitos podem ser confrontados e renovados.`,
    `A missão atravessa impérios, religiões, línguas, economias e cidades. O evangelho circulou por rotas de comércio e migração, mas também encontrou pobres, mulheres, escravizados, autoridades e comunidades marginalizadas. Cada contexto exigiu tradução sem perda do centro cristológico.

Lausanne insiste na relação entre evangelização e responsabilidade social; Lumen gentium descreve a Igreja como sinal e instrumento de união com Deus e de unidade do gênero humano. As duas fontes pertencem a contextos diferentes e não devem ser confundidas, mas ajudam a discutir a presença pública da Igreja.`,
    `Missão é participação na missão de Deus, não expansão de uma marca. Evangelizar é anunciar Jesus com verdade e respeito; servir é tratar o próximo como pessoa e não como projeto; fazer justiça é enfrentar práticas que ferem dignidade; esperança é agir no presente sem acreditar que a Igreja controla o Reino.

A Igreja enviada aprende a traduzir sem manipular culturas. Ela não confunde conversão com assimilação cultural, nem responsabilidade social com plataforma partidária. O discipulado ensina a viver o senhorio de Cristo no trabalho, na família, na cidade, na política cotidiana e no cuidado da criação.`,
    `O século XX produziu debates entre evangelização e ação social, Igreja e Estado, conversão e desenvolvimento, ecumenismo e fronteiras confessionais. Moltmann enfatiza o Espírito e a esperança pública; Bonhoeffer chama a Igreja à ação concreta em favor do outro; tradições evangélicas insistem na centralidade da conversão; a tradição católica articula sacramento, povo e serviço.

O diálogo exige discernimento, não mistura apressada. A Igreja precisa perguntar quem se beneficia de sua ação, quais vozes são silenciadas e se o serviço cria autonomia, dignidade e justiça ou apenas dependência e publicidade religiosa.`,
    `A missão pentecostal/IDB parte do evangelho completo, do poder do Espírito e da Grande Comissão. Ela pode unir oração, plantação de igrejas, discipulado, ação social, cura, educação e presença na cidade sem transformar necessitados em números.

O evangelista, o pastor e o diácono participam da mesma missão, com funções diferentes e igual responsabilidade diante de Cristo. A oração por avivamento precisa incluir arrependimento institucional, reconciliação racial, honestidade financeira e serviço aos que não podem retribuir.`,
  ),
  module(
    "vulneraveis",
    "12. Santidade, justiça e cuidado dos vulneráveis",
    "Miqueias 6:6–8 · Isaías 58 · Tiago 1:27 · Tiago 2:1–17 · Gálatas 6:1–10",
    "Como a Igreja pode falar de santidade sem usar a linguagem espiritual para esconder negligência, violência ou desigualdade?",
    `Os profetas ligam culto e justiça: Deus rejeita uma religiosidade que mantém cânticos enquanto explora o pobre. Isaías 58 une jejum a soltar opressões, repartir pão e acolher o sem-teto; Miqueias resume a vida fiel em praticar justiça, amar misericórdia e andar humildemente. Tiago chama a atenção para órfãos, viúvas e favoritismo aos ricos.

Santidade bíblica é separação para Deus que se torna uma forma diferente de tratar pessoas. Ela inclui sexualidade e linguagem, mas não se esgota em moralidade privada. Abrange dinheiro, racismo, violência, hospitalidade, poder, verdade e uso do corpo comunitário.`,
    `Vulnerabilidade tinha formas específicas no mundo bíblico: viuvez, orfandade, estrangeirismo, doença, escravidão, pobreza, perseguição e ausência de proteção jurídica. As categorias atuais não são idênticas, mas o princípio de atenção aos que podem ser ignorados continua exigindo tradução cuidadosa.

A Igreja antiga dependia de relações pessoais e podia reproduzir patronagem. Por isso, textos sobre partilha, ofertas, honra e mesa precisam ser lidos também como crítica às relações que transformam ajuda em domínio ou o pobre em objeto de piedade.`,
    `Cuidar dos vulneráveis exige mais que compaixão momentânea. Exige escuta, prevenção, encaminhamento, políticas claras, orçamento, formação e disposição para corrigir quem possui mais poder. A Igreja não deve pedir que uma vítima prove sua lealdade antes de receber proteção.

A disciplina cristã precisa diferenciar pecado, sofrimento, conflito, crime e necessidade de cuidado especializado. O perdão pode ser central para a fé, mas não substitui investigação, denúncia, limites, reparação possível e proteção continuada.`,
    `Alguns cristãos temem que a ênfase social dilua o evangelho; outros usam o evangelho para evitar qualquer linguagem de justiça. O Novo Testamento não autoriza os dois atalhos. A centralidade de Cristo não é concorrente do cuidado, e o cuidado não deve ser usado para esconder a necessidade de arrependimento e fé.

Também há debates sobre como a Igreja deve falar de política, gênero, raça, pobreza e saúde mental. A prudência exige convicção bíblica, humildade de conhecimento, escuta de pessoas afetadas e recusa de generalizações que transformam grupos inteiros em problemas.`,
    `A tradição pentecostal pode recuperar sua herança de oração pelos enfermos, mutualidade, acolhimento e solidariedade comunitária. Mas precisa rejeitar a ideia de que sofrimento prova falta de fé ou que prosperidade material prova aprovação divina.

Uma Igreja cheia do Espírito cria ambientes em que pessoas podem confessar, pedir ajuda, denunciar, descansar e ser acompanhadas. O avivamento que não aumenta compaixão, honestidade e proteção dos vulneráveis precisa ser discernido com temor e verdade.`,
  ),
  module(
    "saude",
    "13. Saúde eclesial: discernir frutos, sinais e caminhos de reforma",
    "Apocalipse 2–3 · 1 Tessalonicenses 5:12–22 · Atos 20:28–35 · 1 Coríntios 11:17–34 · Gálatas 6:1–5",
    "Como avaliar se uma igreja está viva, saudável e fiel — para além de números, fama ou intensidade emocional?",
    `As cartas às sete igrejas do Apocalipse avaliam obras, perseverança, doutrina, amor, sofrimento, tolerância ao mal e capacidade de ouvir. Algumas são elogiadas e corrigidas; outras parecem vivas, mas são chamadas a despertar. 1 Tessalonicenses manda examinar tudo, reter o bem e não apagar o Espírito.

1 Coríntios 11 mostra que a saúde da Igreja aparece na mesa: uma reunião pode conservar linguagem sagrada e, ao mesmo tempo, humilhar os pobres. Saúde eclesial é, portanto, discernimento integral de fé, caráter, doutrina, relações, práticas e missão.`,
    `Comunidades mudam com o tempo. Crescimento numérico pode decorrer de migração, reprodução familiar, carisma de um líder ou necessidades sociais; declínio pode acompanhar perseguição, envelhecimento ou fidelidade silenciosa. Nenhum número possui significado teológico automático.

As igrejas do Novo Testamento também conheceram conflitos, falsos ensinos, divisões e desigualdades. A presença de problemas não prova que uma comunidade deixou de ser Igreja, mas a recusa sistemática de ouvir, corrigir e proteger revela doença espiritual e institucional.`,
    `Um diagnóstico pastoral pode observar pelo menos sete sinais: centralidade de Cristo; fidelidade e compreensão da Escritura; participação real dos membros; fruto do Espírito; cuidado dos vulneráveis; transparência de autoridade e dinheiro; e missão que não instrumentaliza pessoas.

Reforma saudável começa nomeando a realidade sem humilhar o corpo. Envolve escuta, oração, dados, confissão, mudanças de processo, formação, supervisão e tempo. Saúde não é perfeição; é capacidade de receber correção, reparar danos e voltar à missão.`,
    `Há modelos que medem saúde por crescimento, outros por santidade, sacramentos, doutrina, justiça, participação ou experiência do Espírito. Cada métrica protege algo e pode distorcer algo. Uma igreja numericamente forte pode ser espiritualmente superficial; uma comunidade pequena pode ser fiel ou apenas fechada.

O debate precisa evitar uma nova idolatria: a idolatria do indicador. Relatórios são úteis, mas não medem arrependimento, segurança emocional, amor pelos inimigos ou a qualidade da escuta. Indicadores devem servir ao discernimento, nunca substituí-lo.`,
    `Na lente pentecostal/IDB, sinais e maravilhas devem ser avaliados junto com amor, santidade, ensino, justiça e perseverança. O fruto do Espírito não é uma alternativa menos espiritual aos dons; é o ambiente no qual os dons podem servir sem destruir.

Uma igreja madura cria ciclos de avaliação e oração, abre espaço para testemunho e crítica, forma equipes de proteção, revisa suas finanças e pergunta regularmente: quem está ficando para trás? O Espírito que envia também convence, corrige e restaura.`,
  ),
  module(
    "teologos",
    "14. Grandes teólogos e confissões em diálogo",
    "Agostinho · Calvino · Wesley · Bonhoeffer · Congar · Moltmann · Volf · Lumen gentium · Lausanne",
    "O que ganhamos quando ouvimos tradições teológicas diferentes sem transformar nenhuma delas em atalho?",
    `A Escritura continua sendo a fonte normativa do estudo, mas a Igreja sempre precisou interpretar, confessar, corrigir e praticar. Agostinho pensa a Igreja peregrina e a paz da Cidade de Deus; Calvino organiza Palavra, ofícios, disciplina e cuidado; Wesley enfatiza santidade social e comunidade disciplinada; Bonhoeffer insiste na vida concreta em comunhão; Congar recupera povo, carismas e corresponsabilidade; Moltmann destaca Espírito e esperança; Volf explora participação e comunhão.

Essas vozes não são um coro sem dissonâncias. O valor do diálogo está em colocar perguntas na mesa e perceber que uma tradição pode enxergar um risco que outra deixou na sombra.`,
    `Cada teólogo responde a uma crise histórica. Agostinho escreve diante de império, heresias e disputa sobre identidade cristã; Calvino diante da Reforma e da reorganização da Igreja; Wesley diante de avivamento, disciplina e pobreza industrial; Bonhoeffer diante do nazismo e da Igreja confessante; Congar diante da renovação católica; Moltmann diante da teologia da esperança e dos traumas do pós-guerra; Volf diante de pluralidade e participação.

Lumen gentium e Lausanne também são documentos situados: um conciliar e católico, outro evangélico e transdenominacional. Suas contribuições não devem ser niveladas como se tivessem o mesmo gênero ou autoridade.`,
    `Ler teólogos é aprender a fazer perguntas melhores. Agostinho lembra que a Igreja não se confunde com o triunfo de uma cidade terrena; Calvino lembra que ensino e disciplina precisam de forma; Wesley lembra que santidade é social; Bonhoeffer lembra que não existe amor abstrato sem irmão concreto; Congar lembra que dons e corresponsabilidade pertencem à Igreja; Moltmann lembra que o Espírito abre a comunidade para esperança; Volf lembra que comunhão não exige apagar pessoas.

A síntese não é somar frases famosas. É discernir quais ênfases podem ser recebidas, quais precisam ser corrigidas e quais não podem ser transplantadas sem contexto.`,
    `Eles não concordam entre si. Divergem sobre sacramentos, governo, relação entre Igreja e Estado, liberdade, tradição, escatologia, participação e missão. As fontes secundárias consultadas também fazem críticas e advertências. O estudo não deve usar um nome famoso como selo de aprovação: cada proposta precisa ser lida em seu contexto, comparada com a Escritura e avaliada por seus frutos e limites.

A comparação entre autores separados por séculos pode produzir falsos paralelos. Termos como comunhão, ministério, carisma, sacramento, missão e liberdade precisam ser definidos no vocabulário próprio de cada teólogo.`,
    `Para a leitura pentecostal/IDB, esse diálogo amplia a autoconsciência sem dissolver a confissão. A Igreja de Deus no Brasil afirma uma missão pentecostal orientada ao evangelho completo; ouvir outras tradições pode fortalecer doutrina, santidade, serviço, ecumenismo e discernimento.

O critério final não é parecer moderno ou antigo, mas se a comunidade exalta Cristo, anda no Espírito, protege o vulnerável e edifica o corpo. Uma tradição recebida com gratidão ainda pode ser reformada pela Palavra, pelo Espírito e pelo clamor das pessoas que a Igreja é chamada a servir.`,
  ),
];

export const churchStudySources: DeepStudySource[] = [
  { label: "Efésios 4 — dons, unidade e edificação do corpo", url: "https://www.bibliaonline.com.br/acf/ef/4" },
  { label: "1 Timóteo 3 — requisitos de bispos e diáconos", url: "https://www.bibliaonline.com.br/acf/1tm/3" },
  { label: "Atos 6 — serviço às mesas e cuidado das viúvas", url: "https://www.bibliaonline.com.br/acf/atos/6" },
  { label: "1 Coríntios 12–14 — corpo, dons, amor e ordem", url: "https://www.bibliaonline.com.br/acf/1co/12" },
  { label: "1 Pedro 5 — pastoreio sem domínio", url: "https://www.bibliaonline.com.br/acf/1pe/5" },
  { label: "Lumen gentium — Igreja como povo de Deus, corpo de Cristo e comunidade", url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html" },
  { label: "Unitatis redintegratio — ecumenismo e unidade cristã", url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19641121_unitatis-redintegratio_en.html" },
  { label: "Pacto de Lausanne — evangelização e responsabilidade social", url: "https://lausanne.org/statement/lausanne-covenant" },
  { label: "The Cape Town Commitment — missão integral e reconciliação", url: "https://lausanne.org/statement/ctcommitment" },
  { label: "Igreja de Deus no Brasil — missão, crenças e identidade pentecostal", url: "https://igrejadedeus.org.br/" },
  { label: "Igreja de Deus no Brasil — declaração de fé pública", url: "https://idbbrasilia.com.br/declaracao-de-fe-idb/" },
  { label: "Confissão de Westminster — Igreja visível e invisível", url: "https://www.pcaac.org/bco/westminster-confession/" },
  { label: "The Wesleyan Church — Articles of Religion", url: "https://www.wesleyan.org/about/articles-of-religion" },
  { label: "Baptist Faith and Message 2000 — congregação e missão", url: "https://bfm.sbc.net/bfm2000/" },
  { label: "Agostinho — A cidade de Deus, Livro XIX", url: "https://www.newadvent.org/fathers/120119.htm" },
  { label: "Christian Classics Ethereal Library — clássicos cristãos públicos", url: "https://www.ccel.org/" },
  { label: "Dietrich Bonhoeffer Reading Room — fontes e bibliografia", url: "https://reading-rooms.tyndale.ca/dietrich-bonhoeffer/" },
  { label: "The Church in the Power of the Spirit — introdução a Moltmann", url: "https://faith.yale.edu/media/the-church-in-the-power-of-the-spirit" },
  { label: "Miroslav Volf — After Our Likeness", url: "https://books.google.com/books/about/After_Our_Likeness.html?id=J-s7xzugXqkC" },
  { label: "Anders Runesson — Ekklesia, Bible Odyssey/SBL", url: "https://www.bibleodyssey.org/articles/ekklesia/" },
  { label: "Elizabeth E. Shively — Jesus and Ekklesia", url: "https://www.bibleodyssey.org/articles/jesus-and-ekklesia/" },
  { label: "John S. Kloppenborg — Early Christ Groups", url: "https://www.bibleodyssey.org/articles/early-christ-groups/" },
  { label: "World Council of Churches — The Church: Towards a Common Vision", url: "https://www.oikoumene.org/resources/documents/the-church-towards-a-common-vision" },
  { label: "Yves Congar e a renovação eclesiológica do Vaticano II", url: "https://periodicos.puc-rio.br/pesquisasemteologia/article/view/2062" },
  { label: "Eclesiologia ecumênica — Teologia Latino-Americana", url: "https://teologicalatinoamericana.com/?p=2704" },
  { label: "Society of Biblical Literature — Bible Odyssey", url: "https://www.bibleodyssey.org/" },
];
