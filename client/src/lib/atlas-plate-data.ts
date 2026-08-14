// Cartografia de Leituras — pranchas editoriais orientam; os vetores do mapa interativo sustentam a consulta geográfica.
export type AtlasPlate = {
  id: string;
  index: string;
  era: string;
  title: string;
  description: string;
  image?: string;
  layerIds: string[];
  period: string;
  focus: { lat: number; lng: number };
  zoom: number;
  source: { label: string; url: string };
};

export const atlasPlates: AtlasPlate[] = [
  { id: "origins", index: "01", era: "Origens · Bronze", title: "Do Nilo aos grandes rios", description: "Leia Gênesis no corredor que conecta Egito, Levante e Mesopotâmia; as rotas são orientações de leitura, não uma localização comprovada de cada cena.", image: "/manus-storage/atlas-master-origins_8dc8764c.png", layerIds: ["patriarchs"], period: "Bronze", focus: { lat: 32.4, lng: 40.2 }, zoom: 5, source: { label: "Pleiades · Gazetteer de lugares antigos", url: "https://pleiades.stoa.org/places" } },
  { id: "exodus", index: "02", era: "Êxodo · Ferro I", title: "Deserto, aliança e assentamento", description: "Conecte as tradições do êxodo, os locais de memória e os debates sobre rota, escala e datação sem confundir uma reconstrução didática com prova arqueológica.", layerIds: ["exodus"], period: "Ferro", focus: { lat: 30.4, lng: 34.1 }, zoom: 6, source: { label: "Atlas metodológico · rotas aproximadas", url: "https://www.bibleodyssey.org/theme/places/" } },
  { id: "empires", index: "03", era: "Impérios · Exílio", title: "Poderes que atravessam os textos", description: "Assíria, Babilônia e Pérsia entram como contextos históricos distintos: não são apenas cenário, mas forças que reconfiguram cidades, memórias e linguagem profética.", layerIds: ["assyria", "babylonian", "persian", "return"], period: "Persa", focus: { lat: 33.2, lng: 43.5 }, zoom: 5, source: { label: "Bible Odyssey · Império Persa", url: "https://www.bibleodyssey.org/map-gallery/persian-empire-map/" } },
  { id: "paul", index: "04", era: "Missão · Mediterrâneo", title: "Cidades, estradas e comunidades", description: "Percorra viagens paulinas por mar e terra, observando como Antioquia, Ásia Menor, Macedônia, Acaia e Roma formam uma rede urbana concreta.", layerIds: ["paul-first", "paul-second", "paul-third", "paul-rome"], period: "Romano", focus: { lat: 37.7, lng: 25.1 }, zoom: 5, source: { label: "Pleiades · lugares e conexões", url: "https://pleiades.stoa.org/places" } },
  { id: "seven-churches", index: "05", era: "Apocalipse · Ásia", title: "Sete cidades, uma rota de leitura", description: "Veja as cidades da Ásia Menor como uma rede real de comunicação e contexto, mantendo aberto o debate sobre a datação e o alcance simbólico do sete.", layerIds: ["seven-churches"], period: "Romano", focus: { lat: 38.5, lng: 28.0 }, zoom: 7, source: { label: "Pleiades · Asia Minor", url: "https://pleiades.stoa.org/places/837" } },
];
