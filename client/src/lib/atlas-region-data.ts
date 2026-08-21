// Cartografia de Leituras: cada vista editorial aponta de volta para uma região e uma lente histórica explorável.
// Cartografia de Leituras: todas as pranchas usam ativos publicados do projeto e mantêm ligação com o mapa operacional.
import { atlasAsset } from "@/lib/atlas-asset";

export const atlasRegionMap = {
  image: atlasAsset("atlas-levant-master_9616f06c.webp"),
  title: "O Levante em uma leitura",
  description: "A Bíblia nasceu e circulou entre o Mediterrâneo oriental, vales fluviais, serras e desertos. Este mapa oferece orientação regional; os marcadores do atlas abaixo mantêm as coordenadas, rotas e datas exploráveis.",
  markers: [
    { id: "galileia", label: "Galileia", note: "aldeias, lago e ministério de Jesus", x: "46%", y: "35%", placeId: "capernaum", period: "Romano", focus: { lat: 32.8803, lng: 35.5733 } },
    { id: "judeia", label: "Judeia", note: "Jerusalém, Templo e tradições", x: "49%", y: "51%", placeId: "jerusalem", period: "Todos", focus: { lat: 31.7683, lng: 35.2137 } },
    { id: "sinai", label: "Sinai", note: "êxodo e memória do deserto", x: "35%", y: "67%", period: "Bronze", focus: { lat: 28.55, lng: 33.95 } },
    { id: "transjordania", label: "Transjordânia", note: "rotas, reinos e fronteiras", x: "60%", y: "50%", period: "Todos", focus: { lat: 31.85, lng: 36.15 } },
  ],
};

export const atlasCityContexts = [
  { id: "jerusalem", placeName: "Jerusalém", era: "Segundo Templo", image: atlasAsset("atlas-jerusalem-city-v2_abbbdc36.webp"), caption: "Cidade do Templo, de peregrinações, conflitos e memória religiosa." },
  { id: "ephesus", placeName: "Éfeso", era: "Ásia romana", image: atlasAsset("atlas-ephesus-city-v2_b55ad3c0.webp"), caption: "Porto e cidade de redes urbanas, onde Atos e Apocalipse situam comunidades cristãs." },
  { id: "alexandria", placeName: "Alexandria", era: "Mundo helenístico", image: atlasAsset("atlas-alexandria-city-v2_b285e62c.webp"), caption: "Um cruzamento de comércio, tradução grega e judaísmo da diáspora.", focus: { lat: 31.2, lng: 29.9 } },
  { id: "rome", placeName: "Roma", era: "Império romano", image: atlasAsset("atlas-rome-city-v2_0bad9520.webp"), caption: "Centro político que forma o horizonte das cartas e da missão cristã antiga." },
  { id: "babylon", placeName: "Babilônia", era: "Neo-Babilônia · séc. VI a.C.", image: atlasAsset("atlas-babylon-neobabylonian_1fbb3440.webp"), caption: "Capital imperial, cenário de deportação, arquivos e releituras de terra, templo e esperança.", placeId: "babylon", period: "Babilônico" },
  { id: "sinai", placeName: "Sinai", era: "Deserto · Bronze/Ferro", image: atlasAsset("atlas-sinai-wilderness_0ac1f8d8.webp"), caption: "Cordilheiras e wadis que preservam a memória do êxodo, da aliança e dos debates sobre rota.", focus: { lat: 28.55, lng: 33.95 }, period: "Bronze" },
  { id: "galilee", placeName: "Galileia", era: "Século I · Galileia romana", image: atlasAsset("atlas-galilee-first-century_a9e04455.webp"), caption: "Lago, aldeias, agricultura e redes de circulação que situam grande parte dos Evangelhos.", focus: { lat: 32.85, lng: 35.55 }, period: "Romano" },
];
