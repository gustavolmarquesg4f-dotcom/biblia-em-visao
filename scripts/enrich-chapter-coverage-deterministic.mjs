import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const coveragePath = path.join(root, "client/public/data/chapter-coverage.json");
const textPath = "/tmp/por_blj.complete.simple.json";
const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
const bibleText = JSON.parse(fs.readFileSync(textPath, "utf8"));
const textBooks = new Map((bibleText.books || []).map((book) => [book.name, book]));
const stopWords = new Set("a o os as um uma uns umas de da do das dos em no na nos nas por para com sem que e é ao à aos às se como mais menos seu sua seus suas este esta isto isso aquele aquela aqueles aquelas entre sobre até ou nem não sim foi são ser tem há havia disse deus ele ela eles elas seu sua eu tu nós vós me te lhe lhes meu minha mundo terra povo livro capítulo porque quando onde quem qual quais muito toda todo todos todas depois antes ainda já também cada assim então pois pelo pela pelos pelas".split(" "));
const keywordFamilies = [
  ["aliança", "promessa", "juramento", "pacto"],
  ["rei", "reino", "trono", "coroa"],
  ["templo", "altar", "sacerdote", "sacrifício", "santo", "santidade"],
  ["lei", "mandamento", "estatuto", "ensino"],
  ["casa", "família", "filho", "filhos", "pai", "mãe"],
  ["terra", "cidade", "nação", "nações", "povo", "povos"],
  ["espírito", "espíritos", "sopro", "vento"],
  ["justiça", "justo", "justos", "pobre", "pobres", "órfão", "viúva"],
  ["medo", "temor", "coragem", "fiel", "fidelidade"],
  ["vida", "morte", "viver", "morto", "ressurreição"],
  ["dia", "noite", "luz", "trevas"],
  ["caminho", "subir", "descer", "sair", "voltar", "ir"],
  ["ouvir", "ver", "olhar", "falar", "clamar", "responder"],
];
const familyLabels = new Map([
  ["aliança", "aliança e promessa"], ["rei", "poder e realeza"], ["templo", "culto e santidade"], ["lei", "lei e formação comunitária"], ["casa", "família e pertencimento"], ["terra", "terra, cidade e povo"], ["espírito", "sopro e ação do Espírito"], ["justiça", "justiça e cuidado dos vulneráveis"], ["medo", "medo, coragem e fidelidade"], ["vida", "vida, morte e esperança"], ["dia", "luz, tempo e discernimento"], ["caminho", "caminho, saída e retorno"], ["ouvir", "fala, escuta e testemunho"],
]);

function normalize(value) { return value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function words(value) { return normalize(value).match(/[a-zà-ÿ]{3,}/gi)?.map((word) => normalize(word)) || []; }
function sourceChapter(record) {
  const book = textBooks.get(record.book);
  const wrapper = book?.chapters?.find((item) => Number(item.chapter?.number ?? item.number ?? item.chapter) === record.chapter);
  const chapter = wrapper?.chapter || wrapper;
  const verses = chapter?.content || chapter?.verses || [];
  return verses.map((verse) => ({ number: Number(verse.number ?? verse.verse ?? 0), text: Array.isArray(verse.content) ? verse.content.join(" ") : String(verse.text ?? verse.content ?? "") })).filter((verse) => verse.text.trim());
}
function compact(text, max = 150) {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).replace(/[,;:.!?\s]+$/, "")}…`;
}
function dominantTerms(text) {
  const count = new Map();
  for (const word of words(text)) if (!stopWords.has(word)) count.set(word, (count.get(word) || 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6).map(([word]) => word);
}
function detectedFamilies(text) {
  const tokenSet = new Set(words(text));
  return keywordFamilies.filter((family) => family.some((term) => tokenSet.has(normalize(term)))).map((family) => familyLabels.get(family[0])).filter(Boolean).slice(0, 3);
}
function titleFor(record, verses, families) {
  const first = compact(verses[0]?.text || record.title, 72).replace(/^e\s+/i, "");
  const signal = families[0] || "movimento do capítulo";
  return `${record.book} ${record.chapter} · ${signal}: ${first}`;
}
function updateRecord(record) {
  if (record.editorialDepth === "Foco ampliado") return record;
  const verses = sourceChapter(record);
  const fullText = verses.map((verse) => verse.text).join(" ");
  const terms = dominantTerms(fullText);
  const families = detectedFamilies(fullText);
  const first = compact(verses[0]?.text || "O capítulo começa sem texto recuperado.", 132);
  const last = compact(verses.at(-1)?.text || "O capítulo termina sem texto recuperado.", 132);
  const range = verses.length ? `versículos ${verses[0].number}–${verses.at(-1).number}` : "unidade sem contagem recuperada";
  const termText = terms.length ? terms.join(", ") : "vocabulário próprio do capítulo";
  const familyText = families.length ? families.join("; ") : "a sequência narrativa ou argumentativa";
  const place = record.cartography.placeLabel;
  const period = record.cartography.period;
  const profileQuestion = record.interpretationLayer.match(/pergunta “([^”]+)”/)?.[1] || "Que tipo de comunidade, memória ou esperança está sendo formada aqui?";
  record.title = titleFor(record, verses, families);
  record.editorialDepth = "Comentário textual enriquecido";
  record.textLayer = `A unidade possui ${verses.length} ${verses.length === 1 ? "versículo" : "versículos"} (${range}) e se organiza por sinais recorrentes de ${familyText}. A abertura do capítulo introduz: “${first}”. O encerramento retoma ou desloca a cena com: “${last}”. A leitura deve observar mudanças de voz, repetições e ações, sem transformar um recorte verbal em resumo de todo o livro.`;
  record.contextLayer = `O capítulo pertence ao movimento “${record.title.split(" · ").slice(1).join(" · ") || record.book}” dentro de ${record.book}, obra classificada como ${record.bookId ? "unidade canônica" : "texto bíblico"} e situada editorialmente em ${period}. O contexto cartográfico usa ${place}, na região ${record.cartography.region}, como coordenada de leitura; isso orienta o cenário e não prova que cada detalhe tenha ocorrido ou sido composto nesse ponto. Termos observáveis do capítulo incluem ${termText}.`;
  record.interpretationLayer = `Uma interpretação responsável começa pela relação entre ${familyText} e a pergunta do livro: “${profileQuestion}”. O vocabulário mais saliente — ${termText} — sustenta uma hipótese de leitura sobre como o capítulo distribui conflito, promessa, identidade ou esperança. Essa relação é uma inferência editorial: o capítulo não deve ser usado sozinho para provar autoria, cronologia, previsão específica ou equivalência automática com outro texto.`;
  record.pentecostalLayer = `Na recepção pentecostal/IDB, o capítulo pode ser levado à oração, ao discernimento e à prática comunitária a partir de seus movimentos de ${familyText}. Uma aplicação madura pergunta como o texto forma caráter, cuidado do próximo, santidade, esperança e responsabilidade diante de Deus. Essa recepção é confessional e situada; não substitui a observação do texto, não transforma metáfora em fórmula e não promete resultados pessoais automáticos.`;
  record.verification.methodology = "Comentário textual enriquecido a partir do texto integral de uma tradução portuguesa de uso livre, contagem de versículos, termos recorrentes, perfil editorial do livro e camadas cartográficas do atlas; não publica o texto integral nem transforma inferência em fato histórico.";
  record.textBasis = { label: "Free Use Bible API · Bíblia Livre", translation: "por_blj", url: "https://bible.helloao.org/api/por_blj/complete.simple.json", licenseUrl: "https://ebible.org/Scriptures/details.php?id=porbr2018" };
  return record;
}
for (const record of coverage.records) updateRecord(record);
coverage.version = "2026-08-20.chapter-coverage.v3";
coverage.method = "Cobertura integral por unidade canônica: cada capítulo recebe comentário textual enriquecido em quatro camadas, referências, fonte consultável, contexto regional e ligação às camadas do atlas; os 39 focos ampliados permanecem preservados e o texto bíblico integral não é publicado.";
fs.writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 2)}\n`);
console.log(JSON.stringify({ total: coverage.records.length, focal: coverage.records.filter((record) => record.editorialDepth === "Foco ampliado").length, enriched: coverage.records.filter((record) => record.editorialDepth === "Comentário textual enriquecido").length, synthetic: coverage.records.filter((record) => record.editorialDepth === "Núcleo sintético").length }, null, 2));
