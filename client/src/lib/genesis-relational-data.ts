/* Cartografia de Leituras: Gênesis como uma rede de pessoas, lugares, eventos e promessas. */
export type GenesisEntityType = "Pessoa" | "Povo" | "Instituição";

export type GenesisEntity = {
  id: string;
  name: string;
  type: GenesisEntityType;
  role: string;
  summary: string;
  narrative: string;
  refs: string[];
  tags: string[];
};

export type GenesisPlace = {
  id: string;
  name: string;
  note: string;
  status: "geográfico" | "simbólico" | "disputado";
  refs: string[];
  x: number;
  y: number;
};

export type GenesisEvent = {
  id: string;
  number: string;
  title: string;
  refs: string;
  summary: string;
  consequence: string;
  entities: string[];
};

export type GenesisArc = {
  range: string;
  title: string;
  question: string;
  summary: string;
  entities: string[];
  refs: string[];
};

export const genesisEntities: GenesisEntity[] = [
  { id: "adam", name: "Adão", type: "Pessoa", role: "humano primordial; imagem de Deus", summary: "O humano formado do solo e colocado no jardim para cultivar e guardar.", narrative: "Em Gênesis 1–5, Adão não é apenas um indivíduo isolado: ele representa o humano como criatura, administrador da terra, ser relacional e responsável diante de Deus. O nome hebraico ʾadam se aproxima de ʾadamah, ‘solo’, ligando identidade humana, vocação e fragilidade. Depois da transgressão, ele passa a viver fora do jardim, sob o signo do trabalho, da dor e da morte.", refs: ["Gn 1:26–28", "Gn 2:7–25", "Gn 3:1–24", "Gn 5:1–5", "Rm 5:12–21", "1Co 15:20–49"], tags: ["imagem de Deus", "queda", "solo", "morte"] },
  { id: "eve", name: "Eva", type: "Pessoa", role: "mulher primordial; mãe de todos os viventes", summary: "A mulher formada para a reciprocidade e nomeada depois da ruptura no jardim.", narrative: "Eva é apresentada como parceira correspondente de Adão, não como personagem secundária. Sua conversa com a serpente concentra a questão de Gênesis 3: quem define o bem, em quem se confia e quais são os limites da criatura. O texto também registra sua maternidade, dor e esperança; ela nomeia Caim e reconhece a continuidade da vida apesar da violência.", refs: ["Gn 2:18–25", "Gn 3:1–24", "Gn 4:1–2", "Gn 4:25", "2Co 11:3", "1Tm 2:13–15"], tags: ["imagem de Deus", "queda", "maternidade", "vida"] },
  { id: "serpent", name: "Serpente", type: "Instituição", role: "voz de contestação no jardim", summary: "A criatura astuta que desloca a confiança humana para a autonomia.", narrative: "Gênesis não chama a serpente de Satanás; essa identificação se desenvolve na recepção judaica e cristã posterior. Dentro da cena, ela opera por pergunta, reinterpretação e suspeita: transforma o limite em privação e o conhecimento em promessa de autonomia. A conexão posterior com o adversário deve ser marcada como leitura canônica posterior, não como se o capítulo já oferecesse toda a demonologia cristã.", refs: ["Gn 3:1–15", "Is 27:1", "Jo 8:44", "Ap 12:9", "Ap 20:2"], tags: ["tentação", "mal", "símbolo", "recepção"] },
  { id: "cain", name: "Caim", type: "Pessoa", role: "primeiro filho; irmão que se torna assassino", summary: "O agricultor cuja inveja transforma a rivalidade em violência fratricida.", narrative: "Caim encena a expansão da queda: a ruptura com Deus aparece agora dentro da família. O texto dá espaço à advertência divina antes do crime — ‘o pecado jaz à porta’ — e depois preserva a tensão entre juízo e proteção. Caim é condenado a uma vida de deslocamento, mas recebe um sinal que impede a vingança ilimitada.", refs: ["Gn 4:1–16", "Gn 4:17–24", "Hb 11:4", "1Jo 3:11–12", "Jd 11"], tags: ["violência", "ciúme", "juízo", "misericórdia"] },
  { id: "abel", name: "Abel", type: "Pessoa", role: "pastor; irmão assassinado", summary: "A vítima cuja vida e sangue tornam visível o custo da violência humana.", narrative: "Abel fala pouco no relato, mas sua morte reorganiza a narrativa: o sangue do irmão clama do solo e transforma a terra, antes ligada ao trabalho de Adão, em testemunha da injustiça. A tradição posterior lê Abel como modelo de fé, martírio e testemunho, mas o primeiro sentido narrativo é o grito da vítima diante de Deus.", refs: ["Gn 4:1–10", "Mt 23:35", "Hb 11:4", "Hb 12:24"], tags: ["sangue", "martírio", "fé", "justiça"] },
  { id: "noah", name: "Noé", type: "Pessoa", role: "justo do dilúvio; novo começo humano", summary: "O sobrevivente escolhido para preservar a vida e receber a aliança pós-dilúvio.", narrative: "Noé é apresentado como exceção em uma terra tomada pela violência, mas não como solução definitiva para o problema humano. Depois do dilúvio, Deus repete a bênção de fecundidade dada a Adão; no entanto, a nudez e a embriaguez de Noé mostram que o ‘novo Adão’ também falha. O arco liga juízo, preservação, limite da violência e aliança universal.", refs: ["Gn 6:5–22", "Gn 7–9", "Is 54:9–10", "Mt 24:37–39", "1Pe 3:20–21", "2Pe 2:5"], tags: ["dilúvio", "aliança", "novo começo", "juízo"] },
  { id: "abraham", name: "Abraão", type: "Pessoa", role: "patriarca; receptor da promessa", summary: "O homem chamado a deixar sua terra para se tornar canal de bênção às nações.", narrative: "Abraão é a resposta narrativa à dispersão de Babel. A promessa de terra, descendência e bênção universal move toda a segunda metade do livro. Ele confia, negocia, teme, mente sobre Sara, intercede por Sodoma e enfrenta o teste de Isaque; sua fé não é uma linha reta, mas uma relação tensionada pela espera, pela promessa e pela fragilidade humana.", refs: ["Gn 12:1–9", "Gn 15", "Gn 17", "Gn 18–19", "Gn 22", "Rm 4", "Gl 3", "Hb 11:8–19"], tags: ["promessa", "fé", "aliança", "nações"] },
  { id: "sarah", name: "Sara", type: "Pessoa", role: "matriarca; mãe de Isaque", summary: "A mulher cuja esterilidade e maternidade concentram a tensão entre promessa e impossibilidade.", narrative: "Sara participa ativamente das decisões da casa: deixa o Egito, propõe Hagar, ri diante da promessa e finalmente dá à luz. Suas ações não são apagadas por uma idealização devocional; o texto conserva ciúme, conflito e vulnerabilidade. A promessa não passa por um herói solitário, mas por uma família marcada pela espera e pela disputa.", refs: ["Gn 11:29–30", "Gn 12:10–20", "Gn 16", "Gn 18:1–15", "Gn 21", "1Pe 3:5–6"], tags: ["esterilidade", "promessa", "maternidade", "aliança"] },
  { id: "hagar", name: "Hagar", type: "Pessoa", role: "serva egípcia; mãe de Ismael", summary: "A estrangeira vulnerável que encontra Deus no deserto e recebe uma promessa para seu filho.", narrative: "Hagar revela o custo social da promessa quando uma família tenta produzir por meios humanos aquilo que Deus prometeu. Expulsa, ela não desaparece: no deserto, é vista, ouvida e abençoada. Gênesis mantém sua dignidade e também a tensão do conflito entre as casas de Sara e Hagar.", refs: ["Gn 16", "Gn 21:8–21", "Gl 4:21–31"], tags: ["deserto", "mulher", "estrangeira", "promessa"] },
  { id: "lot", name: "Ló", type: "Pessoa", role: "sobrinho de Abraão; habitante de Sodoma", summary: "O parente que escolhe a planície fértil e termina deslocado entre cidades e cavernas.", narrative: "A trajetória de Ló acompanha a transformação do espaço: ele olha para a planície, aproxima-se de Sodoma, senta-se à porta da cidade e, depois do juízo, foge para Zoar e para uma caverna. O personagem conecta riqueza, hospitalidade, violência urbana, juízo e sobrevivência familiar.", refs: ["Gn 13:5–13", "Gn 14", "Gn 18:16–33", "Gn 19", "Lc 17:28–32", "2Pe 2:7–8"], tags: ["Sodoma", "hospitalidade", "juízo", "deslocamento"] },
  { id: "isaac", name: "Isaque", type: "Pessoa", role: "filho da promessa; patriarca de transição", summary: "O filho recebido como promessa que preserva a continuidade da aliança.", narrative: "Isaque é menos expansivo narrativamente que Abraão e Jacó, e justamente por isso funciona como elo. Seu nascimento resolve a espera de Sara, sua quase-imolação testa a promessa e seu casamento com Rebeca mantém a linhagem. A narrativa o apresenta também como homem de conflitos territoriais, poços e reabertura de caminhos.", refs: ["Gn 21:1–7", "Gn 22", "Gn 24", "Gn 26", "Mt 1:2", "Hb 11:17–20"], tags: ["filho", "poços", "aliança", "continuidade"] },
  { id: "rebekah", name: "Rebeca", type: "Pessoa", role: "matriarca; mãe de Esaú e Jacó", summary: "A mulher que recebe um oráculo sobre duas nações e intervém na sucessão familiar.", narrative: "Rebeca é central para o problema da primogenitura. Sua gravidez é interpretada por um oráculo que desloca a expectativa social: o mais velho servirá ao mais novo. Mais tarde, sua estratégia para obter a bênção para Jacó protege uma promessa, mas também desencadeia exílio, separação e medo.", refs: ["Gn 24", "Gn 25:19–28", "Gn 27", "Gn 28:1–5"], tags: ["oráculo", "maternidade", "primogenitura", "bênção"] },
  { id: "jacob", name: "Jacó / Israel", type: "Pessoa", role: "patriarca; ancestral epônimo de Israel", summary: "O enganador transformado em Israel, cuja família se torna o núcleo do povo bíblico.", narrative: "Jacó atravessa quase todas as tensões de Gênesis: disputa entre irmãos, fraude, trabalho, casamento, fuga, luta com Deus, reconciliação e luto. Seu novo nome não apaga o antigo; Israel continua sendo um homem marcado por conflito. A família de Jacó é a ponte direta entre Gênesis e Êxodo.", refs: ["Gn 25:29–34", "Gn 27", "Gn 28", "Gn 29–31", "Gn 32:22–32", "Gn 35", "Gn 46–49", "Os 12", "Mt 1:2"], tags: ["Israel", "bênção", "luta", "família"] },
  { id: "esau", name: "Esaú / Edom", type: "Povo", role: "irmão de Jacó; ancestral de Edom", summary: "O irmão que se torna simultaneamente parente, vizinho e rival de Israel.", narrative: "Esaú não deve ser reduzido a vilão. Ele é caçador, homem do campo, irmão enganado e depois agente de reconciliação. A genealogia de Gênesis 36 o transforma em Edom, povo com território, chefes e reis; as tensões posteriores entre Israel e Edom dependem dessa memória ambivalente de parentesco e rivalidade.", refs: ["Gn 25:19–34", "Gn 27", "Gn 32–33", "Gn 36", "Dt 23:7–8", "Ob 1–21"], tags: ["Edom", "irmão", "Seir", "reconciliação"] },
  { id: "joseph", name: "José", type: "Pessoa", role: "filho de Jacó; administrador no Egito", summary: "O irmão vendido que transforma poder administrativo em preservação da vida.", narrative: "A história de José é uma longa inversão: favorito, vítima, escravo, prisioneiro, intérprete e governador. Seus sonhos não são apenas previsões pessoais; eles reorganizam a família e a economia da fome. O final não absolve os irmãos, mas distingue intenção humana e providência: o mal planejado por eles é reorientado para salvar vidas.", refs: ["Gn 37", "Gn 39–41", "Gn 42–45", "Gn 46–50", "At 7:9–14", "Hb 11:22"], tags: ["sonhos", "Egito", "providência", "reconciliação"] },
];

export const genesisPlaces: GenesisPlace[] = [
  { id: "eden", name: "Éden", note: "Jardim de presença, abundância e limite; sua localização física permanece incerta.", status: "simbólico", refs: ["Gn 2–3", "Ez 28:13", "Ap 22:1–5"], x: 70, y: 27 },
  { id: "ur", name: "Ur / Mesopotâmia", note: "Ponto de partida da migração de Terá e Abraão; a identificação de Ur é debatida em detalhes.", status: "disputado", refs: ["Gn 11:27–32", "Gn 15:7", "At 7:2–4"], x: 73, y: 42 },
  { id: "haran", name: "Harã", note: "Lugar de permanência de Terá e chamado de Abraão antes da entrada em Canaã.", status: "geográfico", refs: ["Gn 11:31–32", "Gn 12:4–5", "At 7:4"], x: 61, y: 34 },
  { id: "canaan", name: "Canaã", note: "Terra da promessa e espaço de peregrinação, conflito, altares e sepulturas.", status: "geográfico", refs: ["Gn 12:5–9", "Gn 13:14–18", "Gn 17:8", "Gn 23"], x: 46, y: 54 },
  { id: "hebron", name: "Hebrom / Manre", note: "Centro de residência, hospitalidade, negociação e memória ancestral.", status: "geográfico", refs: ["Gn 13:18", "Gn 18", "Gn 23", "Gn 35:27"], x: 41, y: 60 },
  { id: "sodom", name: "Sodoma e vale do Jordão", note: "Espaço de fertilidade escolhida por Ló e de juízo contra violência e injustiça.", status: "disputado", refs: ["Gn 13:10–13", "Gn 18–19", "Lc 17:28–30"], x: 48, y: 73 },
  { id: "bethel", name: "Betel", note: "Lugar de altar, sonho, voto e retorno na trajetória de Jacó.", status: "geográfico", refs: ["Gn 12:8", "Gn 28:10–22", "Gn 35:1–8"], x: 49, y: 48 },
  { id: "shechem", name: "Siquém", note: "Primeira parada de Abraão em Canaã e lugar de crise na história de Diná.", status: "geográfico", refs: ["Gn 12:6–7", "Gn 33:18–34:31", "Gn 37:12–14"], x: 50, y: 41 },
  { id: "peniel", name: "Peniel / Jaboque", note: "Lugar do combate noturno em que Jacó recebe o nome Israel.", status: "geográfico", refs: ["Gn 32:22–32"], x: 55, y: 31 },
  { id: "egypt", name: "Egito / Gósen", note: "Terra de fome, poder, refúgio e sobrevivência; termina como destino da família de Jacó.", status: "geográfico", refs: ["Gn 12:10–20", "Gn 37–50", "At 7:9–15"], x: 25, y: 76 },
];

export const genesisEvents: GenesisEvent[] = [
  { id: "creation", number: "01", title: "Criação e vocação humana", refs: "Gn 1–2", summary: "Deus organiza o caos, dá função aos espaços e cria o humano à sua imagem.", consequence: "A história começa com bondade, responsabilidade e limite; o conflito não nasce de um mundo mau, mas da ruptura da confiança.", entities: ["Adão", "Eva"] },
  { id: "fall", number: "02", title: "A queda e a expulsão", refs: "Gn 3", summary: "A serpente desloca o limite para o campo da suspeita; o humano escolhe autonomia.", consequence: "Vergonha, acusação, dor, trabalho e morte reorganizam relações com Deus, com o outro e com o solo.", entities: ["Adão", "Eva", "Serpente"] },
  { id: "violence", number: "03", title: "Caim e Abel", refs: "Gn 4", summary: "A ruptura do jardim se torna violência entre irmãos e clamor do sangue.", consequence: "O juízo inclui proteção contra vingança total; a cidade aparece tanto como cultura quanto como poder violento.", entities: ["Caim", "Abel"] },
  { id: "flood", number: "04", title: "Dilúvio e aliança com Noé", refs: "Gn 6–9", summary: "A violência universal é julgada, a vida é preservada e a aliança recebe sinal cósmico.", consequence: "A promessa de não destruir a terra novamente antecede qualquer aliança nacional e alcança todas as criaturas.", entities: ["Noé"] },
  { id: "babel", number: "05", title: "Babel e a dispersão", refs: "Gn 10–11", summary: "A concentração de poder em uma cidade e uma torre termina em confusão e dispersão.", consequence: "Gênesis passa da humanidade inteira para uma família específica sem abandonar a meta de abençoar todas as nações.", entities: ["Ninrode"] },
  { id: "call", number: "06", title: "Chamado de Abraão", refs: "Gn 12:1–9", summary: "A promessa de terra, descendência e bênção responde à dispersão de Babel.", consequence: "A eleição de uma família é apresentada como vocação pública para o bem das famílias da terra.", entities: ["Abraão", "Sara", "Ló"] },
  { id: "covenant", number: "07", title: "Alianças e o filho prometido", refs: "Gn 15–22", summary: "A promessa é formalizada, tensionada pela espera e recebida na história de Isaque.", consequence: "A fé é narrada como confiança em uma promessa que atravessa esterilidade, estrangeiros, conflitos e testes.", entities: ["Abraão", "Sara", "Hagar", "Isaque"] },
  { id: "jacob", number: "08", title: "Jacó se torna Israel", refs: "Gn 25–36", summary: "O conflito entre irmãos, o exílio e o combate com Deus reorganizam a identidade do patriarca.", consequence: "O povo futuro recebe um nome que guarda a memória de luta, bênção e transformação.", entities: ["Jacó / Israel", "Esaú / Edom", "Rebeca"] },
  { id: "joseph", number: "09", title: "José, fome e preservação da vida", refs: "Gn 37–50", summary: "A violência entre irmãos leva José ao Egito, onde sonhos e administração enfrentam a fome.", consequence: "Gênesis termina no Egito, com a família preservada, mas também dependente de um império — tensão que Êxodo desenvolverá.", entities: ["José", "Jacó / Israel"] },
];

export const genesisArcs: GenesisArc[] = [
  { range: "Gn 1–2", title: "Um mundo ordenado", question: "Que tipo de mundo Deus cria e qual é a vocação humana?", summary: "Criação, imagem de Deus, jardim, trabalho, descanso, relação e limite formam o cenário normativo do livro.", entities: ["Adão", "Eva"], refs: ["Gn 1:1–2:25", "Sl 8", "Jo 1:1–5", "Ap 21–22"] },
  { range: "Gn 3–5", title: "Ruptura dentro da família", question: "Como a desconfiança se torna vergonha, violência e morte?", summary: "A queda não é um episódio isolado: ela se espalha no casal, nos irmãos, no trabalho, na cidade e na genealogia.", entities: ["Eva", "Adão", "Caim", "Abel"], refs: ["Gn 3–5", "Rm 5:12–21", "1Jo 3:11–12"] },
  { range: "Gn 6–11", title: "Juízo, preservação e nações", question: "O que Deus faz quando a violência ocupa a terra?", summary: "Dilúvio, aliança, tabela das nações e Babel articulam juízo e preservação sem resolver definitivamente o problema humano.", entities: ["Noé"], refs: ["Gn 6–11", "Is 54:9–10", "At 17:26"] },
  { range: "Gn 12–17", title: "A promessa toma um nome", question: "Por que uma família é escolhida depois da dispersão?", summary: "Abraão e Sara recebem terra, descendência e vocação de bênção, enquanto enfrentam fome, medo, esterilidade e espera.", entities: ["Abraão", "Sara", "Ló", "Hagar"], refs: ["Gn 12:1–3", "Gn 15", "Gn 17", "Gl 3:6–14"] },
  { range: "Gn 18–24", title: "Hospitalidade, juízo e continuidade", question: "Como a promessa atravessa cidades violentas e a morte?", summary: "Sodoma, intercessão, nascimento de Isaque, Moriá, morte de Sara e casamento de Isaque deslocam a promessa para a próxima geração.", entities: ["Abraão", "Sara", "Ló", "Isaque"], refs: ["Gn 18–24", "Mt 8:11", "Hb 11:17–19"] },
  { range: "Gn 25–36", title: "A família da promessa é conflituosa", question: "Como bênção e engano convivem na formação de Israel?", summary: "Esaú e Jacó, Rebeca, Labão, Lia, Raquel e o combate em Peniel mostram que a promessa não produz uma família sem feridas.", entities: ["Jacó / Israel", "Esaú / Edom", "Rebeca"], refs: ["Gn 25–36", "Os 12:2–6", "Rm 9:6–13"] },
  { range: "Gn 37–41", title: "O irmão vendido no centro do império", question: "O que acontece quando a providência passa por escravidão, prisão e poder?", summary: "José desce ao Egito, interpreta sonhos e sobe ao governo sem apagar o trauma da venda e da violência familiar.", entities: ["José", "Jacó / Israel"], refs: ["Gn 37–41", "At 7:9–10"] },
  { range: "Gn 42–50", title: "Reconciliação sem apagar a culpa", question: "Como o mal dos irmãos é confrontado e transformado em preservação?", summary: "A fome reúne a família, José testa a mudança dos irmãos, Judá se oferece e a casa de Jacó desce ao Egito.", entities: ["José", "Jacó / Israel"], refs: ["Gn 42–50", "Gn 50:20", "Hb 11:21–22"] },
];

export const genesisChapterBands = [
  { range: "1–5", title: "Criação, jardim e irmãos", question: "Como a bondade inicial se converte em vergonha e violência?" },
  { range: "6–11", title: "Dilúvio, Noé e Babel", question: "Como juízo e preservação abrem a história das nações?" },
  { range: "12–17", title: "Abraão, Sara e as alianças", question: "Como uma promessa impossível ganha forma histórica?" },
  { range: "18–23", title: "Sodoma, Isaque e Sara", question: "Como hospitalidade, juízo e luto moldam a promessa?" },
  { range: "24–28", title: "Isaque, Rebeca e Jacó", question: "Quem recebe a bênção e o que o conflito revela?" },
  { range: "29–36", title: "Labão, Lia, Raquel e Israel", question: "Como o enganador é confrontado e transformado?" },
  { range: "37–41", title: "José entre irmãos e impérios", question: "Como um vendido se torna administrador da vida?" },
  { range: "42–45", title: "A família reencontra a verdade", question: "Arrependimento é possível quando a fome reúne os irmãos?" },
  { range: "46–50", title: "Egito, bênçãos e futuro", question: "Por que Gênesis termina fora da terra prometida?" },
];

export const genesisProphecies = [
  { source: "Gn 3:15", title: "A semente da mulher", reading: "O texto anuncia inimizade entre serpente e descendência e uma ferida decisiva na cabeça da serpente.", connections: ["Rm 16:20", "Hb 2:14", "Ap 12:9", "Ap 20:2"], note: "A leitura cristã tradicional vê aqui um protoevangelho; a exegese histórico-literária também considera a função do oráculo dentro da narrativa da queda." },
  { source: "Gn 12:1–3", title: "Abraão e as famílias da terra", reading: "A eleição de Abraão é formulada como bênção pública, não como privilégio fechado.", connections: ["Gn 18:18", "Is 49:6", "At 3:25", "Gl 3:8–14"], note: "Paulo usa a promessa como chave para pensar a inclusão das nações; a continuidade deve ser estudada sem apagar o contexto de Gênesis." },
  { source: "Gn 49:8–12", title: "Judá e o governo", reading: "O poema de Jacó associa Judá a liderança, cetro e expectativa de obediência das nações.", connections: ["Nm 24:17", "2Sm 7:12–16", "Mt 1:2–6", "Ap 5:5"], note: "A tradição messiânica relaciona o texto à dinastia davídica e a Cristo; o poema também funciona como bênção tribal dentro do final de Gênesis." },
  { source: "Gn 50:20", title: "Mal planejado, vida preservada", reading: "José interpreta a ação dos irmãos em uma moldura de providência sem chamar o mal de bem.", connections: ["At 7:9–14", "Rm 8:28", "Fp 1:12–14"], note: "A frase não é uma licença para justificar abuso; ela vem depois de confronto, choro, prova e responsabilidade." },
];

export const genesisContinuity = [
  { book: "Êxodo", reason: "A família de Jacó se torna povo no Egito; a promessa enfrenta opressão, Faraó e libertação.", refs: "Gn 46–50 → Êx 1–3" },
  { book: "Isaías", reason: "A esperança de descendência, bênção e restauração é relida na linguagem profética de servo, reino e novas coisas.", refs: "Gn 12; 22; 49 → Is 11; 42; 49" },
  { book: "Mateus", reason: "A genealogia de Jesus começa em Abraão e organiza a identidade messiânica dentro da história de Israel.", refs: "Gn 12; 22; 49 → Mt 1" },
  { book: "Romanos", reason: "Paulo usa Adão e Abraão para pensar pecado, fé, promessa, justiça e a inclusão das nações.", refs: "Gn 3; 15; 17 → Rm 4–5" },
  { book: "Gálatas", reason: "A promessa a Abraão é ligada à bênção das nações e à discussão sobre pertencimento ao povo de Deus.", refs: "Gn 12; 15; 17 → Gl 3–4" },
  { book: "Hebreus", reason: "Abraão, Sara, Isaque e José entram na galeria da fé e da espera por uma promessa ainda maior.", refs: "Gn 12; 22; 50 → Hb 11" },
  { book: "Apocalipse", reason: "A árvore da vida, a serpente e a presença de Deus retornam transformadas na nova criação.", refs: "Gn 2–3 → Ap 21–22" },
];

export const genesisSources = [
  { label: "Bible Odyssey — Society of Biblical Literature", url: "https://www.bibleodyssey.org/" },
  { label: "John Day — The Table of Nations: The Geography of the World in Genesis 10", url: "https://www.thetorah.com/article/the-table-of-nations-the-geography-of-the-world-in-genesis-10" },
  { label: "José-Alberto Garijo-Serrano — Constructing imaginative geographies in Genesis", url: "https://hts.org.za/index.php/hts/article/view/6969/20407" },
  { label: "Jacques Doukhan — The Literary Structure of the Genesis Creation Story", url: "https://digitalcommons.andrews.edu/dissertations/38/" },
  { label: "BibleProject — Genesis guide and related resources", url: "https://bibleproject.com/guides/book-of-genesis/" },
];
