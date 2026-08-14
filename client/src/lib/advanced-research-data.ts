export type ResearchModule = {
  id: string;
  number: string;
  title: string;
  category: string;
  lede: string;
  depth: string;
  method: string;
  topics: string[];
  sources: { label: string; url: string }[];
};

export const advancedResearchModules: ResearchModule[] = [
  {
    id: "manuscripts",
    number: "01",
    title: "Manuscritos e transmissão",
    category: "Texto e transmissão",
    lede: "Estude como os textos bíblicos foram copiados, preservados, comparados e traduzidos sem imaginar que uma única testemunha manuscrita resolve todas as variantes.",
    depth: "Texto Massorético, Septuaginta, Manuscritos do Mar Morto, Peshitta, Vulgata, papiros, códices, famílias textuais, crítica externa e interna.",
    method: "Cada variante deve ser descrita por testemunhas, data, distribuição, leitura, probabilidade e efeito interpretativo. Variante não significa automaticamente corrupção nem ameaça à fé; é parte da história material da transmissão.",
    topics: ["BHS e BHQ", "LXX", "DSS", "Códices", "Variantes", "Edições críticas"],
    sources: [
      { label: "Israel Museum · Dead Sea Scrolls", url: "https://www.imj.org.il/en/wings/shrine-book/dead-sea-scrolls" },
      { label: "British Library · Hebrew Bible manuscripts", url: "https://www.bl.uk/hebrew-manuscripts" }
    ]
  },
  {
    id: "languages",
    number: "02",
    title: "Hebraico, aramaico e grego",
    category: "Línguas e tradução",
    lede: "Conheça as línguas da Bíblia sem transformar uma palavra isolada em uma doutrina inteira. O sentido nasce de morfologia, sintaxe, gênero e contexto.",
    depth: "Raízes hebraicas, aramaico imperial e judaico, grego koiné, semitismos, hapax legomena, sintaxe verbal, pragmática, metáfora e equivalência de tradução.",
    method: "O estudo parte do texto em sua unidade literária e consulta léxicos e edições críticas. A etimologia ajuda, mas não decide sozinha o significado de uma palavra em cada ocorrência.",
    topics: ["Hebraico bíblico", "Aramaico", "Grego koiné", "Léxico", "Sintaxe", "Tradução"],
    sources: [
      { label: "STEP Bible · ferramentas de línguas", url: "https://www.stepbible.org/" },
      { label: "SBL · Society of Biblical Literature", url: "https://www.sbl-site.org/" }
    ]
  },
  {
    id: "archaeology",
    number: "03",
    title: "Arqueologia e antigo Oriente Próximo",
    category: "História e arqueologia",
    lede: "Relacione cidades, inscrições, estratigrafia, impérios e cultura material aos textos sem exigir que a arqueologia prove ou negue sozinha uma narrativa teológica.",
    depth: "Egito, Canaã, Mesopotâmia, Assíria, Babilônia, Pérsia, cerâmica, epigrafia, urbanismo, culto, economia, guerra e limites da evidência.",
    method: "A evidência arqueológica é datada, localizada e interpretada em camadas. Uma inscrição confirma um nome ou instituição com mais segurança do que confirma uma sequência narrativa inteira.",
    topics: ["Canaã", "Egito", "Assíria", "Babilônia", "Pérsia", "Epigrafia"],
    sources: [
      { label: "British Museum · Ancient Middle East", url: "https://www.britishmuseum.org/collection/galleries/ancient-middle-east" },
      { label: "Israel Antiquities Authority", url: "https://www.antiquities.org.il/" }
    ]
  },
  {
    id: "pentateuch",
    number: "04",
    title: "Pentateuco e formação de Israel",
    category: "Antigo Testamento",
    lede: "Leia Gênesis a Deuteronômio como narrativa, legislação, memória, culto e identidade, acompanhando alianças, personagens e tensões de composição.",
    depth: "História primeva, patriarcas, êxodo, Sinai, tabernáculo, sacerdócio, santidade, Deuteronômio, fontes e hipóteses de composição.",
    method: "A pergunta histórica sobre formação do texto não substitui a leitura canônica. A plataforma coloca lado a lado estrutura final, tradições possíveis, contexto legal do antigo Oriente e leitura teológica.",
    topics: ["Criação", "Patriarcas", "Êxodo", "Aliança", "Lei", "Culto"],
    sources: [
      { label: "Bible Odyssey · Pentateuch", url: "https://www.bibleodyssey.org/" },
      { label: "The Torah · estudos acadêmicos", url: "https://www.thetorah.com/" }
    ]
  },
  {
    id: "history",
    number: "05",
    title: "Israel, Judá, exílio e retorno",
    category: "História e impérios",
    lede: "Acompanhe juízes, monarquia, templo, divisão dos reinos, Assíria, Babilônia, Pérsia, reconstrução e as disputas de memória que atravessam os livros históricos.",
    depth: "Cronologia concorrente, fontes assírias e babilônicas, inscrições reais, reformas, teologia do exílio, Esdras, Neemias, Ester e o período persa.",
    method: "Datas aproximadas e fontes externas serão distinguidas de reconstruções narrativas. O exílio não é apenas um evento geopolítico: é também uma lente teológica para identidade, culpa, esperança e restauração.",
    topics: ["Juízes", "Davi", "Templo", "Reinos", "Exílio", "Restauração"],
    sources: [
      { label: "World History Encyclopedia · Israel antigo", url: "https://www.worldhistory.org/Israel/" },
      { label: "Cambridge · Archaeology of Ancient Israel", url: "https://www.cambridge.org/core/publications/elements/the-archaeology-of-ancient-israel" }
    ]
  },
  {
    id: "wisdom",
    number: "06",
    title: "Poesia, lamento e sabedoria",
    category: "Literatura bíblica",
    lede: "Aprenda a interpretar paralelismo, lamento, hino, provérbio, diálogo sapiencial, erotismo poético e tensão entre ordem moral e experiência do sofrimento.",
    depth: "Jó, Salmos, Provérbios, Eclesiastes e Cântico dos Cânticos, gêneros, vozes, coleções, imagens, teologia da criação e limites da leitura alegórica.",
    method: "Poesia não deve ser tratada como prosa informativa. A forma, o ritmo, a repetição, o contraste e a voz do orador fazem parte do argumento e protegem o leitor contra frases arrancadas do gênero.",
    topics: ["Jó", "Salmos", "Provérbios", "Eclesiastes", "Cântico", "Lamento"],
    sources: [
      { label: "Bible Odyssey · Poetry and Wisdom", url: "https://www.bibleodyssey.org/" },
      { label: "Society of Biblical Literature", url: "https://www.sbl-site.org/" }
    ]
  },
  {
    id: "prophets",
    number: "07",
    title: "Profetas e profecias",
    category: "Profecia e intertextualidade",
    lede: "Estude profecias como palavra situada em crises políticas, culto, injustiça, guerra, exílio e restauração, e acompanhe suas releituras dentro do cânon.",
    depth: "Profetas maiores e menores, oráculos contra nações, atos simbólicos, remanescente, novo êxodo, Dia do Senhor, messianismo e cumprimento interpretado.",
    method: "A plataforma separa previsão, denúncia, promessa, tipologia, alusão, citação e aplicação. Uma leitura cristológica posterior não apaga o horizonte original do oráculo.",
    topics: ["Isaías", "Jeremias", "Ezequiel", "Daniel", "Os Doze", "Cumprimento"],
    sources: [
      { label: "Bible Odyssey · Prophets", url: "https://www.bibleodyssey.org/" },
      { label: "Oxford Biblical Studies", url: "https://www.oxfordbiblicalstudies.com/" }
    ]
  },
  {
    id: "jesus-gospels",
    number: "08",
    title: "Jesus e os quatro Evangelhos",
    category: "Novo Testamento",
    lede: "Reconstrua o ambiente judaico-romano de Jesus e compare as vozes de Mateus, Marcos, Lucas e João sem apagar suas diferenças literárias e teológicas.",
    depth: "Segundo Templo, Roma, templo, sinagoga, fariseus, saduceus, escribas, zelotes, parábolas, milagres, conflitos, cruz e ressurreição.",
    method: "A busca pelo Jesus histórico e a leitura canônica são camadas distintas. O estudo pergunta pelo evento, pela memória comunitária, pelo narrador e pela confissão teológica de cada Evangelho.",
    topics: ["Reino", "Parábolas", "Milagres", "Discípulos", "Paixão", "Ressurreição"],
    sources: [
      { label: "Bible Odyssey · Gospels", url: "https://www.bibleodyssey.org/" },
      { label: "SBL · Historical Jesus research", url: "https://www.sbl-site.org/" }
    ]
  },
  {
    id: "acts-paul",
    number: "09",
    title: "Atos, Paulo e as cartas",
    category: "Igreja primitiva",
    lede: "Siga a expansão do movimento de Jesus pelas cidades do Mediterrâneo, comparando a narrativa de Atos com as cartas e seus conflitos concretos.",
    depth: "Pax Romana, diáspora judaica, sinagogas, viagens, concílio de Jerusalém, comunidades domésticas, autenticidade das cartas, dons e missão.",
    method: "Atos é uma narrativa teológica com pretensão historiográfica; as cartas são documentos situados de comunidades reais. A tensão entre retratos não deve ser apagada por harmonizações rápidas.",
    topics: ["Pentecostes", "Paulo", "Viagens", "Cartas", "Comunidades", "Missão"],
    sources: [
      { label: "Oxford Research Encyclopedia · Acts", url: "https://oxfordre.com/classics/" },
      { label: "SciELO Brasil · estudos do cristianismo primitivo", url: "https://www.scielo.br/" }
    ]
  },
  {
    id: "theology-pentecostal",
    number: "10",
    title: "Teologia pentecostal e IDB",
    category: "Teologia e prática",
    lede: "Consulte doutrinas e práticas pentecostais em diálogo com o texto bíblico, a história do movimento e os documentos oficiais disponíveis da Igreja de Deus.",
    depth: "Espírito Santo, batismo no Espírito, línguas, dons, cura, santificação, culto, Ceia, lavagem dos pés, missão, liderança e escatologia.",
    method: "A plataforma identifica o que é declaração confessional da IDB, o que é posição pentecostal mais ampla e o que é debate acadêmico. Nenhuma denominação será usada como substituto do texto bíblico ou da evidência histórica.",
    topics: ["Espírito", "Dons", "Cura", "Santidade", "Missão", "IDB"],
    sources: [
      { label: "Igreja de Deus no Brasil", url: "https://igrejadedeus.org.br/" },
      { label: "Church of God · Declaration of Faith", url: "https://churchofgod.org/beliefs/declaration-of-faith/" }
    ]
  }
];
