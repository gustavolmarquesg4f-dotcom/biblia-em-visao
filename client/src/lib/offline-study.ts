import { staticAsset } from "@/lib/static-asset";

export type OfflinePack = {
  id: string;
  title: string;
  savedAt: string;
  routes: string[];
};

export const OFFLINE_PACKS_KEY = "biblia-em-visao-offline-packs-v1";

const base = () => import.meta.env.BASE_URL || "/";
const normalizedRoute = (route: string) => `${base().replace(/\/$/, "")}/${route.replace(/^\//, "")}`.replace(/([^:]\/)\/+/, "$1");

export function readOfflinePacks(): OfflinePack[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(OFFLINE_PACKS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((pack): pack is OfflinePack => typeof pack === "object" && pack !== null && typeof (pack as OfflinePack).id === "string" && typeof (pack as OfflinePack).title === "string" && typeof (pack as OfflinePack).savedAt === "string" && Array.isArray((pack as OfflinePack).routes)) : [];
  } catch { return []; }
}

function writeOfflinePacks(packs: OfflinePack[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(OFFLINE_PACKS_KEY, JSON.stringify(packs));
}

export async function saveStudyPack(): Promise<OfflinePack> {
  const routes = ["", "mesa", "estudos-profundos", "66-livros", "estudos", "busca", "atlas"];
  const urls = [
    ...routes.map(normalizedRoute),
    staticAsset("manus-storage/redigir_unidades_enciclopedicas_66_7bc9c936.json"),
    staticAsset("manus-storage/mapear_livros_centrais_bc56be6f.json"),
  ];
  if ("caches" in window) {
    const cache = await caches.open("biblia-em-visao-offline-v1");
    await Promise.all(urls.map(async (url) => {
      try {
        const response = await fetch(url, { credentials: "same-origin" });
        if (response.ok) await cache.put(url, response.clone());
      } catch { /* A navegação principal já permanece disponível pelo cache existente. */ }
    }));
  }
  const pack: OfflinePack = { id: "mesa-e-estudos", title: "Mesa e estudos essenciais", savedAt: new Date().toISOString(), routes };
  const packs = readOfflinePacks().filter((entry) => entry.id !== pack.id);
  writeOfflinePacks([pack, ...packs]);
  return pack;
}

export async function removeStudyPack() {
  if (typeof window !== "undefined" && "caches" in window) await caches.delete("biblia-em-visao-offline-v1");
  writeOfflinePacks(readOfflinePacks().filter((pack) => pack.id !== "mesa-e-estudos"));
}
