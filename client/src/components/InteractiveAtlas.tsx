import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, CircleHelp, Clock3, Layers3, Map, Pause, Play, RotateCcw, Route, ShieldCheck, SkipBack, SkipForward } from "lucide-react";
import { MapView } from "@/components/Map";
import { advancedDossiers, biblicalPlaces } from "@/lib/advanced-data";
import { empireLayers, routeLayers, timelineEvents } from "@/lib/route-data";
import "@/atlas-timeline.css";

type Props = {
  go: (view: "study" | "library" | "bibliography") => void;
  focusPlaceId?: string | null;
  onFocusHandled?: () => void;
};

type OverlayCleanup = () => void;

function timelineYear(year: number) {
  return year < 0 ? `${Math.abs(year)} a.C.` : year === 0 ? "c. 1" : `${year} d.C.`;
}

export default function InteractiveAtlas({ go, focusPlaceId = null, onFocusHandled }: Props) {
  const [activeLayers, setActiveLayers] = useState<string[]>(["places"]);
  const [period, setPeriod] = useState("Todos");
  const [selectedId, setSelectedId] = useState(biblicalPlaces[0].id);
  const [mapError, setMapError] = useState<string | null>(null);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const cleanupRef = useRef<OverlayCleanup[]>([]);

  const selected = biblicalPlaces.find((place) => place.id === selectedId) || biblicalPlaces[0];
  const dossier = advancedDossiers.find((item) => item.id === selected.dossier) || advancedDossiers[0];
  const periods = ["Todos", "Bronze", "Ferro", "Babilônico", "Persa", "Segundo Templo", "Romano"];
  const visiblePlaces = period === "Todos" ? biblicalPlaces : biblicalPlaces.filter((place) => place.periods.toLowerCase().includes(period.toLowerCase()));
  const timelineEvent = timelineEvents[timelineIndex];
  const timelineLayerIds = useMemo(() => new Set(timelineEvents.slice(0, timelineIndex + 1).flatMap((event) => event.layerIds)), [timelineIndex]);
  const visibleLayerIds = useMemo(() => new Set([...activeLayers, ...Array.from(timelineLayerIds)]), [activeLayers, timelineLayerIds]);

  const toggle = (id: string) => setActiveLayers((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const focus = (place: typeof biblicalPlaces[number]) => {
    setSelectedId(place.id);
    mapRef.current?.panTo({ lat: place.lat, lng: place.lng });
    mapRef.current?.setZoom(7);
  };

  const jumpTimeline = (index: number) => {
    const next = Math.max(0, Math.min(timelineEvents.length - 1, index));
    setTimelineIndex(next);
    const event = timelineEvents[next];
    mapRef.current?.panTo(event.focus);
    mapRef.current?.setZoom(next < 8 ? 5 : 4);
  };

  useEffect(() => {
    if (!focusPlaceId) return;
    const normalizedFocusId = focusPlaceId.replace(/^place-/, "");
    const place = biblicalPlaces.find((item) => item.id === normalizedFocusId);
    if (!place || !mapRef.current) return;
    focus(place);
    onFocusHandled?.();
  }, [focusPlaceId, onFocusHandled]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setTimelineIndex((current) => {
      if (current >= timelineEvents.length - 1) {
        setIsPlaying(false);
        return current;
      }
      return current + 1;
    }), 1500);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!mapRef.current || !timelineEvent) return;
    mapRef.current.panTo(timelineEvent.focus);
  }, [timelineEvent]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;
    cleanupRef.current.forEach((cleanup) => cleanup());
    cleanupRef.current = [];
    const map = mapRef.current;

    if (activeLayers.includes("places")) {
      visiblePlaces.forEach((place) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({ map, position: { lat: place.lat, lng: place.lng }, title: place.name });
        marker.addListener("click", () => focus(place));
        cleanupRef.current.push(() => { marker.map = null; });
      });
    }

    routeLayers.filter((layer) => visibleLayerIds.has(layer.id)).forEach((layer) => {
      const polyline = new google.maps.Polyline({ map, path: layer.path, strokeColor: layer.color, strokeOpacity: layer.id === timelineEvent?.layerIds[0] ? 1 : 0.85, strokeWeight: layer.id === timelineEvent?.layerIds[0] ? 6 : 4, geodesic: true });
      cleanupRef.current.push(() => polyline.setMap(null));
    });

    empireLayers.filter((layer) => visibleLayerIds.has(layer.id)).forEach((layer) => {
      const polygon = new google.maps.Polygon({ map, paths: layer.polygon, strokeColor: layer.color, strokeOpacity: 0.9, strokeWeight: 2, fillColor: layer.color, fillOpacity: timelineLayerIds.has(layer.id) ? 0.18 : 0.12 });
      cleanupRef.current.push(() => polygon.setMap(null));
    });

    return () => {
      cleanupRef.current.forEach((cleanup) => cleanup());
      cleanupRef.current = [];
    };
  }, [activeLayers, visiblePlaces.length, visibleLayerIds, timelineEvent?.id, timelineLayerIds]);

  return (
    <section className="page-section atlas-page atlas-page--advanced interactive-atlas">
      <div className="page-intro">
        <div className="section-eyebrow"><span className="eyebrow-line" /><span className="eyebrow-number">07</span><span>Atlas geohistórico em camadas</span></div>
        <div className="page-title-row"><div><h1>Rotas, cidades<br /><em>e impérios.</em></h1><p>Ative as camadas para cruzar lugares bíblicos, deslocamentos, redes missionárias e áreas imperiais. Linhas e polígonos são reconstruções didáticas aproximadas, não fronteiras exatas.</p></div><div className="map-key"><span className="key-line" />{biblicalPlaces.length} lugares · {routeLayers.length} rotas · {empireLayers.length} impérios</div></div>
      </div>

      <div className="atlas-layer-toolbar"><div><span>Camadas de contexto</span>{[{ id: "places", label: "Lugares bíblicos", icon: Map }, ...routeLayers.map((layer) => ({ id: layer.id, label: layer.label, icon: Route })), ...empireLayers.map((layer) => ({ id: layer.id, label: layer.label, icon: Layers3 }))].map((item) => <button key={item.id} className={activeLayers.includes(item.id) ? "is-active" : ""} onClick={() => toggle(item.id)}><item.icon size={14} />{item.label}</button>)}</div><div className="atlas-period-switcher"><span>Período</span>{periods.map((item) => <button key={item} className={period === item ? "is-active" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div></div>

      <div className="atlas-timeline"><div className="atlas-timeline-head"><div><span className="atlas-timeline-kicker"><Clock3 size={12} /> Linha do tempo animada</span><h2>{timelineEvent.label}</h2><p>{timelineEvent.description}</p></div><div className="atlas-timeline-controls"><button aria-label="Reiniciar linha do tempo" onClick={() => { setIsPlaying(false); jumpTimeline(0); }}><RotateCcw size={14} /></button><button aria-label={isPlaying ? "Pausar linha do tempo" : "Reproduzir linha do tempo"} onClick={() => setIsPlaying((current) => !current)}>{isPlaying ? <Pause size={14} /> : <Play size={14} />}</button><button aria-label="Evento anterior" disabled={timelineIndex === 0} onClick={() => jumpTimeline(timelineIndex - 1)}><SkipBack size={14} /></button><button aria-label="Próximo evento" disabled={timelineIndex === timelineEvents.length - 1} onClick={() => jumpTimeline(timelineIndex + 1)}><SkipForward size={14} /></button><strong className="atlas-timeline-date">{timelineYear(timelineEvent.year)}</strong></div></div><input className="atlas-timeline-range" type="range" min={0} max={timelineEvents.length - 1} value={timelineIndex} onChange={(event) => jumpTimeline(Number(event.target.value))} aria-label="Linha do tempo histórica" /><div className="atlas-timeline-axis"><span>c. 1250 a.C.</span><span>{timelineEvents.length} eventos · arraste para explorar</span><span>60 d.C.</span></div><div className="atlas-timeline-event"><span>{timelineEvent.kind === "route" ? "Rota" : timelineEvent.kind === "empire" ? "Império" : "Contexto"}</span><strong>{timelineEvent.label}</strong><p>{timelineEvent.description}</p></div></div>

      <div className="atlas-map-layout"><div className="atlas-map-panel"><MapView className="biblical-map" initialCenter={{ lat: 32, lng: 35 }} initialZoom={5} onMapReady={(map) => { mapRef.current = map; if (focusPlaceId) { const normalizedFocusId = focusPlaceId.replace(/^place-/, ""); const place = biblicalPlaces.find((item) => item.id === normalizedFocusId); if (place) { focus(place); onFocusHandled?.(); } } }} onMapError={setMapError} />{mapError && <div className="map-error-banner"><CircleHelp size={15} /><div><strong>Mapa temporariamente indisponível</strong><span>{mapError} A lista continua funcionando.</span></div></div>}<div className="map-method-note"><span>Atlas 02 · Rotas e poderes em escala histórica</span><small>Coordenadas, rotas, áreas e datas são aproximações metodológicas; consulte o dossiê e a bibliografia.</small></div></div><aside className="atlas-place-list"><div className="atlas-list-head"><span>Lugares visíveis</span><strong>{visiblePlaces.length}<small>/{biblicalPlaces.length}</small></strong></div>{visiblePlaces.map((place) => <button key={place.id} className={selected.id === place.id ? "is-active" : ""} onClick={() => focus(place)}><span className="atlas-place-pin"><Map size={14} /></span><div><strong>{place.name}</strong><small>{place.ancientName} · {place.periods}</small><em>{place.refs}</em></div><ChevronRight size={14} /></button>)}</aside></div>

      <article className="atlas-dossier"><div className="atlas-dossier-heading"><div><span className="advanced-label">Dossiê do lugar</span><h2>{selected.name} <em>· {selected.ancientName}</em></h2><p>{selected.summary}</p></div><div className="atlas-coordinates"><span>Coordenadas aproximadas</span><strong>{selected.lat.toFixed(4)}° N<br />{selected.lng.toFixed(4)}° E</strong></div></div><div className="atlas-dossier-grid"><div><span className="advanced-label">Dossiê histórico</span><strong>{dossier.title}</strong><p>{dossier.thesis}</p></div><div><span className="advanced-label">Rotas e relações</span><p>{routeLayers.filter((layer) => layer.path.some((point) => Math.abs(point.lat - selected.lat) < 3 && Math.abs(point.lng - selected.lng) < 5)).map((layer) => layer.label).join(" · ") || "Lugar indexado no atlas; rota relacionada depende da camada ativa."}</p></div><div><span className="advanced-label">Método</span><p><ShieldCheck size={14} /> {dossier.confidence}</p></div></div><div className="atlas-dossier-foot"><div><span>Referências bíblicas</span><strong>{selected.refs}</strong></div><button onClick={() => go("study")}>Abrir dossiê histórico <ChevronRight size={15} /></button><button onClick={() => go("bibliography")}>Ver bibliografia <ChevronRight size={15} /></button></div></article>
    </section>
  );
}
