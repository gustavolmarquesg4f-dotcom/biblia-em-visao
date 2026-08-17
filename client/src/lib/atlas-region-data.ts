export const atlasRegionMap = {
  image: "/manus-storage/atlas-levant-master_ea820703.png",
  title: "O Levante em uma leitura",
  description: "A Bíblia nasceu e circulou entre o Mediterrâneo oriental, vales fluviais, serras e desertos. Este mapa oferece orientação regional; os marcadores do atlas abaixo mantêm as coordenadas, rotas e datas exploráveis.",
  markers: [
    { id: "galileia", label: "Galileia", note: "aldeias, lago e ministério de Jesus", x: "46%", y: "35%" },
    { id: "judeia", label: "Judeia", note: "Jerusalém, Templo e tradições", x: "49%", y: "51%" },
    { id: "sinai", label: "Sinai", note: "êxodo e memória do deserto", x: "35%", y: "67%" },
    { id: "transjordania", label: "Transjordânia", note: "rotas, reinos e fronteiras", x: "60%", y: "50%" },
  ],
};

export const atlasCityContexts = [
  { id: "jerusalem", placeName: "Jerusalém", era: "Segundo Templo", image: "/manus-storage/atlas-jerusalem-city-v2_5ef5c120.png", caption: "Cidade do Templo, de peregrinações, conflitos e memória religiosa." },
  { id: "ephesus", placeName: "Éfeso", era: "Ásia romana", image: "/manus-storage/atlas-ephesus-city-v2_78b571ff.png", caption: "Porto e cidade de redes urbanas, onde Atos e Apocalipse situam comunidades cristãs." },
  { id: "alexandria", placeName: "Alexandria", era: "Mundo helenístico", image: "/manus-storage/atlas-alexandria-city-v2_b55d13a8.png", caption: "Um cruzamento de comércio, tradução grega e judaísmo da diáspora." },
  { id: "rome", placeName: "Roma", era: "Império romano", image: "/manus-storage/atlas-rome-city-v2_5c13c4f5.png", caption: "Centro político que forma o horizonte das cartas e da missão cristã antiga." },
];
