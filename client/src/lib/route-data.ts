export type MapPoint = { lat: number; lng: number };
export type RouteLayer = { id: string; label: string; color: string; description: string; path: MapPoint[] };
export type EmpireLayer = { id: string; label: string; color: string; description: string; polygon: MapPoint[] };

export const routeLayers: RouteLayer[] = [
  { id: "patriarchs", label: "Patriarcas", color: "#a8664f", description: "Rota aproximada entre Mesopotâmia, Canaã e Egito nas narrativas patriarcais.", path: [{ lat: 30.96, lng: 46.1 }, { lat: 36.86, lng: 39.0 }, { lat: 32.2, lng: 35.3 }, { lat: 31.53, lng: 35.1 }, { lat: 31.25, lng: 34.8 }] },
  { id: "exodus", label: "Êxodo e conquista", color: "#d6a96f", description: "Traçado didático das localizações tradicionalmente associadas ao êxodo, deserto e entrada em Canaã.", path: [{ lat: 30.8, lng: 32.8 }, { lat: 29.9, lng: 32.55 }, { lat: 28.5, lng: 33.9 }, { lat: 30.6, lng: 34.7 }, { lat: 31.87, lng: 35.44 }] },
  { id: "kingdoms", label: "Reinos e exílio", color: "#5e7c78", description: "Eixos de circulação entre Jerusalém, Samaria, Megido, Babilônia e Susa em períodos de monarquia e exílio.", path: [{ lat: 31.77, lng: 35.21 }, { lat: 32.28, lng: 35.2 }, { lat: 32.58, lng: 35.18 }, { lat: 32.54, lng: 44.42 }, { lat: 32.19, lng: 48.25 }] },
  { id: "paul", label: "Viagens missionárias", color: "#8f4d49", description: "Cidades e eixos associados às viagens de Paulo e às redes urbanas do cristianismo nascente.", path: [{ lat: 36.2, lng: 36.16 }, { lat: 36.9, lng: 34.9 }, { lat: 37.94, lng: 27.34 }, { lat: 37.91, lng: 22.88 }, { lat: 37.98, lng: 23.72 }, { lat: 41.9, lng: 12.5 }] },
];

export const empireLayers: EmpireLayer[] = [
  { id: "assyria", label: "Assíria", color: "#b07b61", description: "Esquema aproximado do eixo assírio no Levante; não representa fronteiras precisas.", polygon: [{ lat: 37.0, lng: 38.0 }, { lat: 36.4, lng: 44.0 }, { lat: 34.8, lng: 43.5 }, { lat: 32.5, lng: 36.0 }, { lat: 34.0, lng: 32.0 }] },
  { id: "babylonian", label: "Babilônia", color: "#a8664f", description: "Área didática de influência babilônica no corredor sírio-palestino.", polygon: [{ lat: 35.0, lng: 39.0 }, { lat: 34.0, lng: 46.0 }, { lat: 29.5, lng: 46.0 }, { lat: 29.5, lng: 35.0 }, { lat: 32.5, lng: 32.0 }] },
  { id: "persian", label: "Pérsia aquemênida", color: "#d6a96f", description: "Rede imperial persa em escala esquemática, conectando Susa, Babilônia, Yehud e o Egeu.", polygon: [{ lat: 39.0, lng: 26.0 }, { lat: 40.0, lng: 60.0 }, { lat: 25.0, lng: 60.0 }, { lat: 25.0, lng: 34.0 }, { lat: 30.0, lng: 26.0 }] },
  { id: "rome", label: "Roma no Oriente", color: "#5e7c78", description: "Corredor oriental romano usado para contextualizar cidades, estradas e circulação do Novo Testamento.", polygon: [{ lat: 45.0, lng: 9.0 }, { lat: 42.0, lng: 38.0 }, { lat: 30.0, lng: 38.0 }, { lat: 30.0, lng: 12.0 }, { lat: 37.0, lng: 8.0 }] },
];

