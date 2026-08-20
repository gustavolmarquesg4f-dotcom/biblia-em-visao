import fs from "node:fs";
import path from "node:path";
import { bibleBooks, type Book } from "../client/src/lib/bible-data";
import { bookProfiles } from "../client/src/lib/book-deep";
import { biblicalPlaces } from "../client/src/lib/advanced-data";
import { empireLayers, routeLayers } from "../client/src/lib/route-data";
import { verseCommentaries } from "../client/src/lib/verse-commentary-data";

type ChapterRecord = {
  id: string;
  book: string;
  bookId: string;
  chapter: number;
  reference: string;
  title: string;
  editorialDepth: "Núcleo sintético" | "Foco ampliado";
  textLayer: string;
  contextLayer: string;
  interpretationLayer: string;
  pentecostalLayer: string;
  references: string[];
  source: { label: string; url: string };
  cartography: {
    placeId: string;
    placeLabel: string;
    region: string;
    period: string;
    routeIds: string[];
    routeLabels: string[];
    empireIds: string[];
    empireLabels: string[];
    note: string;
    source: { label: string; url: string };
  };
  verification: {
    chapterExistsInCanon: true;
    commentarySchemaComplete: true;
    cartographicContextPresent: true;
    methodology: string;
  };
};

type Plan = {
  placeId: string;
  region: string;
  period: string;
  routeIds: string[];
  empireIds: string[];
  note: string;
};

const root = path.resolve(new URL("..", import.meta.url).pathname);
const outputPath = path.join(root, "client/public/data/chapter-coverage.json");
const sourceUrl = (book: Book, chapter: number) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(`${book.name} ${chapter}`)}&version=ARA`;
const atlasSource = { label: "Atlas editorial · método e camadas", url: "https://www.bibleodyssey.org/" };
const placeById = new Map(biblicalPlaces.map((place) => [place.id, place]));
const routeById = new Map(routeLayers.map((route) => [route.id, route]));
const empireById = new Map(empireLayers.map((empire) => [empire.id, empire]));
const existingByKey = new Map(verseCommentaries.map((commentary) => [`${commentary.book}:${commentary.chapter}`, commentary]));

function sectionFor(book: Book, chapter: number) {
  const structure = bookProfiles[book.name]?.structure || "Leitura contínua do livro";
  const segments = structure.split("·").map((segment) => segment.trim()).filter(Boolean);
  const matching = segments.find((segment) => {
    const range = segment.match(/(\d+)\s*[–-]\s*(\d+)/);
    const single = segment.match(/(?:^|\s)(\d+)(?::|\s|$)/);
    if (range) return chapter >= Number(range[1]) && chapter <= Number(range[2]);
    if (single) return chapter === Number(single[1]);
    return false;
  });
  if (matching) return matching.replace(/^[^:]+:\s*/, "");
  if (segments.length) return segments[Math.min(segments.length - 1, Math.floor((chapter - 1) / Math.max(1, Math.ceil(book.chapters / segments.length))))].replace(/^[^:]+:\s*/, "");
  return "Leitura contínua do livro";
}

function planFor(book: Book, chapter: number): Plan {
  const name = book.name;
  if (name === "Gênesis") return chapter <= 11 ? { placeId: "eden", region: "Origens · Crescente Fértil", period: "Origens–Bronze", routeIds: ["patriarchs"], empireIds: [], note: "Éden é um marcador narrativo didático; a coordenada não é uma localização arqueológica comprovada." } : chapter <= 36 ? { placeId: chapter <= 26 ? "canaan" : "hebron", region: "Canaã · Levante meridional", period: "Bronze · tradições patriarcais", routeIds: ["patriarchs"], empireIds: [], note: "A rota patriarcal é uma reconstrução didática de deslocamentos narrados, não um itinerário arqueologicamente certificado." } : { placeId: "egypt", region: "Egito · delta e vale do Nilo", period: "Bronze–Êxodo", routeIds: ["patriarchs"], empireIds: [], note: "O Egito é o cenário textual da última unidade de Gênesis; a correlação entre personagens e sítios específicos permanece debatida." };
  if (name === "Êxodo" || name === "Levítico") return chapter <= 18 && name === "Êxodo" ? { placeId: "egypt", region: "Egito → deserto do Sinai", period: "Êxodo · datação debatida", routeIds: ["exodus"], empireIds: [], note: "A rota do êxodo é apresentada pelo atlas como traçado didático; não se trata de uma linha comprovada ponto a ponto." } : { placeId: "sinai", region: "Sinai · deserto e montanhas", period: "Êxodo · Bronze/Ferro", routeIds: ["exodus"], empireIds: [], note: "Sinai é uma aproximação regional para as cenas de aliança, culto e peregrinação; as localizações tradicionais são debatidas." };
  if (name === "Números") return chapter <= 21 ? { placeId: "sinai", region: "Sinai · deserto", period: "Êxodo e peregrinação", routeIds: ["exodus"], empireIds: [], note: "A localização serve à orientação da narrativa de deserto; a rota completa não é diretamente verificável em cada etapa." } : { placeId: "canaan", region: "Canaã e fronteira oriental", period: "Ferro I · tradição de assentamento", routeIds: ["exodus"], empireIds: [], note: "As fronteiras são aproximadas e o capítulo é lido em relação ao movimento de aproximação de Canaã." };
  if (name === "Deuteronômio" || name === "Josué" || name === "Juízes" || name === "Rute") return { placeId: name === "Rute" ? "bethlehem" : name === "Josué" ? "jericho" : "canaan", region: "Canaã · planaltos e vales do Levante", period: "Ferro I–II · cronologia debatida", routeIds: ["exodus", "kingdoms"], empireIds: [], note: "O mapa orienta a relação entre terra, aldeias e fronteiras; não transforma a retórica de conquista em fronteira moderna nem em dado arqueológico automático." };
  if (["1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Neemias", "Lamentações"].includes(name)) return chapter <= 10 && ["1 Samuel", "2 Samuel"].includes(name) ? { placeId: "jerusalem", region: "Judá · Jerusalém e montanhas centrais", period: "Monarquia · Ferro II", routeIds: ["kingdoms"], empireIds: [], note: "Jerusalém funciona como foco político e cultual; a extensão da monarquia e a cronologia são discutidas na pesquisa." } : name === "2 Reis" && chapter >= 17 ? { placeId: "babylon", region: "Jerusalém → Babilônia", period: "Assírio–babilônico", routeIds: ["kingdoms", "return"], empireIds: ["assyria", "babylonian"], note: "A camada imperial ajuda a ler queda, deportação e exílio; as linhas do atlas são aproximações históricas." } : { placeId: "jerusalem", region: "Jerusalém · Judá e templo", period: "Monarquia e restauração", routeIds: ["kingdoms"], empireIds: ["assyria", "babylonian"], note: "O capítulo é situado na rede de Jerusalém, templo, reinos e impérios; a cartografia distingue cenário textual de reconstrução histórica." };
  if (["Esdras", "Ester", "Daniel"].includes(name)) return name === "Ester" ? { placeId: "susa", region: "Susa · administração persa", period: "Persa aquemênida", routeIds: ["return"], empireIds: ["persian"], note: "Susa é um foco urbano e administrativo; o atlas não pretende demonstrar cada detalhe da ambientação narrativa." } : name === "Daniel" && chapter <= 6 ? { placeId: "babylon", region: "Babilônia · corte imperial", period: "Babilônico–persa", routeIds: ["return"], empireIds: ["babylonian", "persian"], note: "A corte serve como lente de resistência cultural; a datação literária e o referente histórico dos episódios são debatidos." } : { placeId: "babylon", region: "Babilônia e Yehud", period: "Exílio–restauração persa", routeIds: ["return"], empireIds: ["babylonian", "persian"], note: "O eixo Babilônia–Yehud situa deportação, retorno e administração; a rota é declaradamente didática." };
  if (["Jó", "Salmos", "Provérbios", "Eclesiastes", "Cântico dos Cânticos"].includes(name)) return { placeId: "jerusalem", region: "Levantino · poesia, culto e sabedoria", period: "Vários períodos de Israel", routeIds: ["kingdoms"], empireIds: [], note: "Para poesia e sabedoria, o mapa indica o horizonte cultural de Israel sem atribuir a cada poema um local de composição comprovado." };
  if (["Isaías", "Jeremias", "Ezequiel", "Oseias", "Joel", "Amós", "Obadias", "Jonas", "Miqueias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"].includes(name)) return name === "Ezequiel" || name === "Obadias" ? { placeId: "babylon", region: "Babilônia · exílio e imaginação profética", period: "Babilônico–persa", routeIds: ["return", "kingdoms"], empireIds: ["babylonian"], note: "O lugar do profeta e o lugar da visão não são automaticamente a mesma coisa; o mapa registra o horizonte histórico indicado pela tradição textual." } : { placeId: "jerusalem", region: "Jerusalém, Judá e fronteiras imperiais", period: "Ferro II–persa", routeIds: ["kingdoms"], empireIds: ["assyria", "babylonian", "persian"], note: "A profecia circula entre cidade, templo, campo e império; as camadas são aproximações e não substituem análise textual." };
  if (["Mateus", "Marcos", "Lucas", "João"].includes(name)) return chapter <= Math.ceil(book.chapters * 0.55) ? { placeId: "capernaum", region: "Galileia · aldeias, lago e redes locais", period: "Galileia romana · século I", routeIds: ["jesus-galilee"], empireIds: ["rome"], note: "Cafarnaum é um foco representativo para a Galileia; nem toda cena evangélica ocorre nesta aldeia." } : { placeId: "jerusalem", region: "Judeia · Jerusalém e templo", period: "Judeia romana · século I", routeIds: ["jesus-galilee"], empireIds: ["rome"], note: "Jerusalém situa as cenas de peregrinação, templo, conflito e paixão; o capítulo pode incluir deslocamentos narrativos." };
  if (name === "Atos") return chapter <= 12 ? { placeId: "jerusalem", region: "Jerusalém, Judeia e Samaria", period: "Igreja nascente · século I", routeIds: ["jesus-galilee", "paul"], empireIds: ["rome"], note: "O mapa acompanha a expansão descrita por Atos sem pressupor que sua narrativa seja um diário cartográfico exaustivo." } : chapter <= 19 ? { placeId: "ephesus", region: "Ásia Menor e Egeu", period: "Roma · século I", routeIds: ["paul", "paul-first", "paul-second", "paul-third"], empireIds: ["rome"], note: "Éfeso representa a rede urbana da missão no Egeu; as rotas são traçados didáticos." } : { placeId: "rome", region: "Mediterrâneo oriental → Roma", period: "Roma · século I", routeIds: ["paul", "paul-rome"], empireIds: ["rome"], note: "A rota marítima até Roma é aproximada e evidencia infraestrutura imperial, portos e circulação de testemunhos." };
  const letterPlaces: Record<string, string> = { "Romanos": "rome", "1 Coríntios": "corinth", "2 Coríntios": "corinth", "Gálatas": "antioch", "Efésios": "ephesus", "Filipenses": "rome", "Colossenses": "ephesus", "1 Tessalonicenses": "antioch", "2 Tessalonicenses": "antioch", "1 Timóteo": "ephesus", "2 Timóteo": "rome", "Tito": "antioch", "Filemom": "colossae", "Hebreus": "jerusalem", "Tiago": "jerusalem", "1 Pedro": "rome", "2 Pedro": "rome", "1 João": "ephesus", "2 João": "ephesus", "3 João": "ephesus", "Judas": "jerusalem" };
  if (letterPlaces[name]) return { placeId: placeById.has(letterPlaces[name]) ? letterPlaces[name] : "jerusalem", region: name === "Romanos" ? "Roma · capital imperial" : "Cidades e redes do Mediterrâneo oriental", period: "Segundo Templo tardio · século I", routeIds: ["paul", "paul-rome"], empireIds: ["rome"], note: "O local funciona como horizonte epistolar ou rede comunitária; não significa que cada capítulo tenha sido escrito no sítio indicado." };
  if (name === "Apocalipse") return chapter <= 3 ? { placeId: ["ephesus", "smyrna", "pergamum", "thyatira", "sardis", "philadelphia", "laodicea"][Math.max(0, chapter - 1)], region: "Ásia romana · circuito das sete igrejas", period: "Ásia romana · final do século I", routeIds: ["seven-churches"], empireIds: ["rome"], note: "As sete cidades são identificáveis no texto; o circuito e a geometria do atlas são aproximações para orientação." } : { placeId: "patmos", region: "Patmos e Ásia romana", period: "Final do século I · datação debatida", routeIds: ["seven-churches"], empireIds: ["rome"], note: "Patmos é o lugar narrado da visão; as cenas projetam imagens sobre redes urbanas, império e nova criação." };
  return { placeId: "jerusalem", region: "Levante e Mediterrâneo oriental", period: book.period, routeIds: ["kingdoms"], empireIds: book.testament === "Novo Testamento" ? ["rome"] : [], note: "Este contexto regional é uma aproximação editorial para orientar a leitura; não atribui ao capítulo uma localização de composição não atestada." };
}

function buildRecord(book: Book, chapter: number): ChapterRecord {
  const key = `${book.name}:${chapter}`;
  const existing = existingByKey.get(key);
  const plan = planFor(book, chapter);
  const place = placeById.get(plan.placeId) || placeById.get("jerusalem")!;
  const profile = bookProfiles[book.name];
  const section = sectionFor(book, chapter);
  const reference = `${book.name} ${chapter}`;
  const source = existing?.source || { label: "Bíblia Gateway · texto bíblico consultável", url: sourceUrl(book, chapter) };
  const references = existing?.references || Array.from(new Set([`${book.short} ${chapter}`, ...(profile?.connects || []).slice(0, 3)]));
  return {
    id: existing?.id || `${book.id}-cap-${chapter}`,
    book: book.name,
    bookId: book.id,
    chapter,
    reference,
    title: existing?.title || `${book.name} ${chapter} · ${section}`,
    editorialDepth: existing ? "Foco ampliado" : "Núcleo sintético",
    textLayer: existing?.textLayer || `O capítulo ${chapter} de ${book.name} é lido como uma unidade completa dentro do movimento “${section}”. Comece observando quem fala, quem age, quais imagens se repetem e como a passagem avança a pergunta central do livro: ${profile?.question || book.summary}`,
    contextLayer: existing?.contextLayer || `${book.summary} Neste capítulo, a lente histórica e literária deve ser mantida junto do gênero de ${book.category.toLowerCase()} e do período indicado como ${book.period}. O cenário não é um detalhe decorativo: ele ajuda a distinguir o que o texto afirma diretamente, o que a tradição releu e o que permanece reconstrução.` ,
    interpretationLayer: existing?.interpretationLayer || `A leitura editorial relaciona este capítulo à pergunta “${profile?.question || "Que tipo de comunidade, memória ou esperança está sendo formada aqui?"}”. A estrutura de ${book.name} sugere uma conexão com ${profile?.connects?.slice(0, 3).join(", ") || "outros livros do cânon"}, mas a relação é apresentada como diálogo interpretativo, não como prova de autoria, previsão ou equivalência histórica.`,
    pentecostalLayer: existing?.pentecostalLayer || `Uma leitura pentecostal/IDB pode receber este capítulo em oração, discernimento e prática comunitária, mantendo Cristo, o Espírito, a santidade e o cuidado do próximo no centro. A aplicação confessional é identificada como recepção; não substitui o contexto histórico, não transforma hipótese em doutrina e não promete que o texto funcione como fórmula automática para resultados pessoais.`,
    references,
    source,
    cartography: {
      placeId: place.id,
      placeLabel: place.name,
      region: plan.region,
      period: plan.period,
      routeIds: plan.routeIds.filter((id) => routeById.has(id)),
      routeLabels: plan.routeIds.filter((id) => routeById.has(id)).map((id) => routeById.get(id)!.label),
      empireIds: plan.empireIds.filter((id) => empireById.has(id)),
      empireLabels: plan.empireIds.filter((id) => empireById.has(id)).map((id) => empireById.get(id)!.label),
      note: plan.note,
      source: atlasSource,
    },
    verification: {
      chapterExistsInCanon: true,
      commentarySchemaComplete: true,
      cartographicContextPresent: true,
      methodology: existing ? "Foco editorial existente preservado e complementado com metadados cartográficos." : "Registro sintético gerado a partir do cânon de 66 livros, do perfil editorial do livro e das camadas cartográficas do atlas; a localização é explicitamente aproximada quando não é direta.",
    },
  };
}

const records = bibleBooks.flatMap((book) => Array.from({ length: book.chapters }, (_, index) => buildRecord(book, index + 1)));
const payload = {
  version: "2026-08-20.chapter-coverage.v1",
  total: records.length,
  bookCount: bibleBooks.length,
  method: "Cobertura integral por unidade canônica: cada capítulo recebe registro de comentário, referências, fonte consultável, contexto regional e ligação às camadas do atlas.",
  records,
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, total: payload.total, books: payload.bookCount, focalRecords: records.filter((record) => record.editorialDepth === "Foco ampliado").length, places: new Set(records.map((record) => record.cartography.placeId)).size }, null, 2));
