// Cartografia de Leituras — o atlas combina pranchas editoriais declaradamente não escala com camadas vetoriais exploráveis.
// Cartografia de Leituras: pranchas, cartões e mapa operacional apontam para a mesma rota histórica.
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, CircleHelp, Clock3, Layers3, Map, Pause, Play, RotateCcw, Route, ShieldCheck, SkipBack, SkipForward, Sparkles } from "lucide-react";
import { MapView } from "@/components/Map";
import { advancedDossiers, biblicalPlaces, type BiblicalPlace } from "@/lib/advanced-data";
import { atlasPlates, type AtlasPlate } from "@/lib/atlas-plate-data";
import { empireLayers, routeLayers, timelineEvents } from "@/lib/route-data";
import { atlasCityContexts, atlasRegionMap } from "@/lib/atlas-region-data";
import "@/atlas-timeline.css";
import "@/atlas-visual-plates.css";
import "@/atlas-fallback-map.css";
import "@/atlas-review-pass.css";
import "@/atlas-region-context.css";

type Props = {
  go: (view: "study" | "library" | "bibliography") => void;
  focusPlaceId?: string | null;
  onFocusHandled?: () => void;
};

type OverlayCleanup = () => void;

function timelineYear(year: number) {
  return year < 0 ? `${Math.abs(year)} a.C.` : year === 0 ? "c. 1" : `${year} d.C.`;
}

function AtlasPlateArt({ plate }: { plate: AtlasPlate }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (plate.image && !imageFailed) return <img src={plate.image} alt={`Prancha cartográfica: ${plate.title}`} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />;
  const path = plate.id === "exodus" ? "M8 18 C28 10 47 14 56 28 L67 40 L83 47 L95 67 L86 85 L65 89 L44 78 L28 65 L10 45Z" : plate.id === "empires" ? "M12 18 L73 10 L96 32 L86 88 L22 93 L5 60Z" : plate.id === "paul" ? "M4 30 C18 18 28 23 38 34 C48 15 69 15 80 28 C91 31 95 48 87 59 C76 67 72 83 55 91 C35 90 25 72 14 65Z" : "M18 13 C41 9 70 14 90 30 L84 86 L38 92 L14 68Z";
  const route = plate.id === "exodus" ? "M18 39 C35 47 36 63 58 69 S77 54 88 36" : plate.id === "empires" ? "M22 65 C35 36 55 29 77 40 S72 74 51 78" : plate.id === "paul" ? "M16 56 C30 36 42 60 55 40 S76 34 83 56 S66 77 49 66 S31 80 21 68" : "M33 60 C41 39 63 31 76 43 S65 70 48 73 S29 68 33 60";
  const dots = plate.id === "seven-churches" ? [[33,60],[41,39],[56,33],[75,43],[65,70],[48,73],[29,68]] : plate.id === "paul" ? [[16,56],[30,36],[42,60],[55,40],[76,34],[83,56],[66,77]] : [[21,52],[37,40],[54,58],[70,45],[83,62]];
  return <div className={`atlas-visual-plates__vector atlas-visual-plates__vector--${plate.id}`} aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path className="atlas-plate-land" d={path} /><path className="atlas-plate-contour" d="M4 21 C28 6 44 17 61 7 S86 10 98 3 M1 83 C21 65 39 87 55 71 S82 80 99 63 M10 92 C29 77 45 98 70 83" /><path className="atlas-plate-route" d={route} />{dots.map(([cx, cy], index) => <circle key={index} className="atlas-plate-dot" cx={cx} cy={cy} r="2.1" />)}</svg></div>;
}

function AtlasFallbackMap({ selected, places, layerIds, onSelect }: { selected: BiblicalPlace; places: BiblicalPlace[]; layerIds: Set<string>; onSelect: (place: BiblicalPlace) => void }) {
  const project = (point: { lat: number; lng: number }) => ({ x: 5 + ((point.lng - 10) / 50) * 90, y: 95 - ((point.lat - 20) / 25) * 90 });
  const line = (path: { lat: number; lng: number }[]) => path.map((point, index) => { const { x, y } = project(point); return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ");
  const polygon = (path: { lat: number; lng: number }[]) => path.map((point) => { const { x, y } = project(point); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ");
  return <div className="atlas-fallback-map" role="region" aria-label="Mapa interativo com lugares, rotas e áreas históricas aproximadas"><div className="atlas-fallback-map__label"><Map size={14} /><span>Mapa interativo de continuidade</span><small>toque em uma cidade ou ative uma camada</small></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Mapa vetorial com lugares e rotas selecionáveis"><path className="atlas-fallback-map__land" d="M8 15 C20 7 29 14 36 25 C48 9 65 10 75 23 C89 22 96 36 90 50 C98 64 86 82 71 85 C57 97 38 88 30 78 C15 74 7 62 12 49 C3 38 3 23 8 15Z" />{empireLayers.filter((layer) => layerIds.has(layer.id)).map((layer) => <polygon key={layer.id} className="atlas-fallback-map__empire" points={polygon(layer.polygon)} style={{ fill: layer.color }} />)}{routeLayers.filter((layer) => layerIds.has(layer.id)).map((layer) => <path key={layer.id} className="atlas-fallback-map__route" d={line(layer.path)} style={{ stroke: layer.color }} />)}{places.map((place) => { const { x, y } = project(place); const isSelected = place.id === selected.id; return <circle key={place.id} className={isSelected ? "atlas-fallback-map__place is-selected" : "atlas-fallback-map__place"} cx={x} cy={y} r={isSelected ? 2.3 : 1.45} role="button" tabIndex={0} aria-label={`Selecionar ${place.name}`} onClick={() => onSelect(place)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(place); } }} />; })}</svg><div className="atlas-fallback-map__footer"><span>Rotas e áreas: aproximações didáticas</span><strong>{selected.name}</strong></div></div>;
}

function AtlasCityContextCard({ city, onFocus }: { city: typeof atlasCityContexts[number]; onFocus: (city: typeof atlasCityContexts[number]) => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <button type="button" aria-label={`Explorar ${city.placeName} no atlas`} onClick={() => onFocus(city)}>
    {!imageFailed && <img src={city.image} alt={`Reconstrução editorial de ${city.placeName}`} loading="lazy" decoding="async" width="2176" height="1632" onError={() => setImageFailed(true)} />}
    {imageFailed && <span className="atlas-city-context__image-fallback"><Map size={20} /><small>Vista editorial indisponível</small></span>}
    <span className="atlas-city-context__wash" /><span className="atlas-city-context__copy"><small>{city.era}</small><strong>{city.placeName}</strong><em>{city.caption}</em></span><ChevronRight size={17} />
  </button>;
}

export default function InteractiveAtlas({ go, focusPlaceId = null, onFocusHandled }: Props) {
  const [activeLayers, setActiveLayers] = useState<string[]>(["places"]);
  const [period, setPeriod] = useState("Todos");
  const [selectedId, setSelectedId] = useState(biblicalPlaces[0].id);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlateId, setActivePlateId] = useState(atlasPlates[0].id);
  const mapRef = useRef<google.maps.Map | null>(null);
  const cleanupRef = useRef<OverlayCleanup[]>([]);

  const selected = biblicalPlaces.find((place) => place.id === selectedId) || biblicalPlaces[0];
  const dossier = advancedDossiers.find((item) => item.id === selected.dossier) || advancedDossiers[0];
  const periods = ["Todos", "Bronze", "Ferro", "Babilônico", "Persa", "Segundo Templo", "Romano"];
  const visiblePlaces = period === "Todos" ? biblicalPlaces : biblicalPlaces.filter((place) => place.periods.toLowerCase().includes(period.toLowerCase()));
  const timelineEvent = timelineEvents[timelineIndex];
  const timelineLayerIds = useMemo(() => new Set(timelineEvents.slice(0, timelineIndex + 1).flatMap((event) => event.layerIds)), [timelineIndex]);
  const visibleLayerIds = useMemo(() => new Set([...activeLayers, ...Array.from(timelineLayerIds)]), [activeLayers, timelineLayerIds]);
  const layerGroups = [
    { id: "places", label: "Lugares e arquivos", items: [{ id: "places", label: "Lugares bíblicos", icon: Map }] },
    { id: "routes", label: "Rotas e deslocamentos", items: routeLayers.map((layer) => ({ id: layer.id, label: layer.label, icon: Route })) },
    { id: "powers", label: "Poderes e contextos", items: empireLayers.map((layer) => ({ id: layer.id, label: layer.label, icon: Layers3 })) },
  ];

  const toggle = (id: string) => setActiveLayers((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const openPlate = (plate: AtlasPlate) => {
    setActivePlateId(plate.id);
    setActiveLayers(Array.from(new Set(["places", ...plate.layerIds])));
    setPeriod(plate.period);
    mapRef.current?.panTo(plate.focus);
    mapRef.current?.setZoom(plate.zoom);
  };

  const focus = (place: typeof biblicalPlaces[number]) => {
    setSelectedId(place.id);
    mapRef.current?.panTo({ lat: place.lat, lng: place.lng });
    mapRef.current?.setZoom(7);
  };

  const focusRegion = (region: typeof atlasRegionMap.markers[number]) => {
    setPeriod(region.period || "Todos");
    const place = region.placeId ? biblicalPlaces.find((item) => item.id === region.placeId) : undefined;
    if (place) {
      focus(place);
      return;
    }
    if (region.focus) {
      mapRef.current?.panTo(region.focus);
      mapRef.current?.setZoom(region.id === "sinai" ? 6 : 5);
    }
  };

  const focusCityContext = (city: typeof atlasCityContexts[number]) => {
    const place = biblicalPlaces.find((item) => item.id === city.placeId || item.name === city.placeName);
    if (place) {
      focus(place);
      return;
    }
    if (city.focus) {
      setPeriod(city.period || "Todos");
      mapRef.current?.panTo(city.focus);
      mapRef.current?.setZoom(city.id === "sinai" ? 6 : 7);
    }
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
    if (!place) return;
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

      <section className="atlas-region-map" aria-label="Mapa regional do Levante">
        <div className="atlas-region-map__image"><img src={atlasRegionMap.image} alt="Mapa editorial da região do Levante e Mediterrâneo oriental" width="2560" height="1440" fetchPriority="high" decoding="async" onError={(event) => { event.currentTarget.classList.add("is-unavailable"); }} /><div className="atlas-region-map__image-fallback" aria-hidden="true"><Map size={28} /><span>Regiões do Levante</span></div><div className="atlas-region-map__shade" />{atlasRegionMap.markers.map((marker) => <button key={marker.id} type="button" className="atlas-region-map__marker" style={{ left: marker.x, top: marker.y }} onClick={() => focusRegion(marker)} aria-label={`Explorar a região ${marker.label}`}><i /><span><strong>{marker.label}</strong><small>{marker.note}</small></span></button>)}</div>
        <div className="atlas-region-map__copy"><span className="advanced-label">Mapa de regiões · primeiro olhar</span><h2>{atlasRegionMap.title}</h2><p>{atlasRegionMap.description}</p><div><span>Toque em uma região</span><strong>e o atlas ajusta a lente histórica</strong></div></div>
      </section>

      <section className="atlas-visual-plates" aria-label="Pranchas históricas do atlas">
        <div className="atlas-visual-plates__heading"><div><span className="advanced-label">Atlas visual · cinco portas de entrada</span><h2>Mapas que situam<br /><em>cada grande movimento.</em></h2><p>Escolha uma prancha para ativar suas camadas no mapa operacional. As imagens organizam o percurso; os marcadores, rotas e áreas vetoriais abaixo permanecem a fonte de exploração interativa.</p></div><div className="atlas-visual-plates__seal"><Sparkles size={16} /><span>Pranchas editoriais<br />não em escala</span></div></div>
        <div className="atlas-visual-plates__deck">{atlasPlates.map((plate) => <button key={plate.id} type="button" className={activePlateId === plate.id ? "is-active" : ""} onClick={() => openPlate(plate)} aria-label={`Abrir prancha ${plate.index}: ${plate.title}`} aria-pressed={activePlateId === plate.id}><AtlasPlateArt plate={plate} /><span className="atlas-visual-plates__wash" /><span className="atlas-visual-plates__index">{plate.index}</span><span className="atlas-visual-plates__copy"><small>{plate.era}</small><strong>{plate.title}</strong></span><ChevronRight size={17} /></button>)}</div>
        {(() => { const plate = atlasPlates.find((item) => item.id === activePlateId) || atlasPlates[0]; return <div className="atlas-visual-plates__caption"><div><span>Legenda da prancha {plate.index}</span><p>{plate.description}</p></div><a href={plate.source.url} target="_blank" rel="noreferrer">{plate.source.label} <ChevronRight size={13} /></a></div>; })()}
      </section>

      <div className="atlas-layer-toolbar atlas-layer-toolbar--legend"><div className="atlas-layer-catalog">{layerGroups.map((group, index) => <section key={group.id}><header><span>{String(index + 1).padStart(2, "0")}</span><strong>{group.label}</strong></header><div>{group.items.map((item) => <button key={item.id} type="button" className={activeLayers.includes(item.id) ? "is-active" : ""} onClick={() => toggle(item.id)} aria-pressed={activeLayers.includes(item.id)}><item.icon size={14} />{item.label}</button>)}</div></section>)}</div><div className="atlas-period-switcher"><span>Período de leitura</span><div>{periods.map((item, index) => <button key={item} type="button" className={period === item ? "is-active" : ""} onClick={() => setPeriod(item)} aria-pressed={period === item}><i>{String(index).padStart(2, "0")}</i>{item}</button>)}</div></div></div>

      <div className="atlas-timeline"><div className="atlas-timeline-head"><div><span className="atlas-timeline-kicker"><Clock3 size={12} /> Linha do tempo animada</span><h2>{timelineEvent.label}</h2><p>{timelineEvent.description}</p></div><div className="atlas-timeline-controls"><button type="button" aria-label="Reiniciar linha do tempo" onClick={() => { setIsPlaying(false); jumpTimeline(0); }}><RotateCcw size={14} /></button><button type="button" aria-label={isPlaying ? "Pausar linha do tempo" : "Reproduzir linha do tempo"} onClick={() => setIsPlaying((current) => !current)}>{isPlaying ? <Pause size={14} /> : <Play size={14} />}</button><button type="button" aria-label="Evento anterior" disabled={timelineIndex === 0} onClick={() => jumpTimeline(timelineIndex - 1)}><SkipBack size={14} /></button><button type="button" aria-label="Próximo evento" disabled={timelineIndex === timelineEvents.length - 1} onClick={() => jumpTimeline(timelineIndex + 1)}><SkipForward size={14} /></button><strong className="atlas-timeline-date">{timelineYear(timelineEvent.year)}</strong></div></div><input className="atlas-timeline-range" type="range" min={0} max={timelineEvents.length - 1} value={timelineIndex} onChange={(event) => jumpTimeline(Number(event.target.value))} aria-label="Linha do tempo histórica" /><div className="atlas-timeline-axis"><span>c. 1250 a.C.</span><span>{timelineEvents.length} eventos · arraste para explorar</span><span>60 d.C.</span></div><div className="atlas-timeline-event"><span>{timelineEvent.kind === "route" ? "Rota" : timelineEvent.kind === "empire" ? "Império" : "Contexto"}</span><strong>{timelineEvent.label}</strong><p>{timelineEvent.description}</p></div></div>

      <div className="atlas-map-layout"><div className="atlas-map-panel"><MapView className={mapReady ? "biblical-map" : "biblical-map biblical-map--provider-loading"} initialCenter={{ lat: 32, lng: 35 }} initialZoom={5} onMapReady={(map) => { mapRef.current = map; setMapReady(true); setMapError(null); if (focusPlaceId) { const normalizedFocusId = focusPlaceId.replace(/^place-/, ""); const place = biblicalPlaces.find((item) => item.id === normalizedFocusId); if (place) { focus(place); onFocusHandled?.(); } } }} onMapError={(message) => { setMapError(message); setMapReady(false); }} />{!mapReady && <><AtlasFallbackMap selected={selected} places={visiblePlaces} layerIds={visibleLayerIds} onSelect={focus} /><div className="map-error-banner"><CircleHelp size={15} /><div><strong>{mapError ? "Mapa do provedor indisponível" : "Mapa interativo pronto para explorar"}</strong><span>{mapError ? "O mapa vetorial mantém a exploração de lugares, rotas e camadas." : "As camadas, cidades e rotas continuam disponíveis enquanto o provedor carrega."}</span></div></div></>}<div className="map-method-note"><span>Atlas 02 · Rotas e poderes em escala histórica</span><small>Coordenadas, rotas, áreas e datas são aproximações metodológicas; consulte o dossiê e a bibliografia.</small></div></div><aside className="atlas-place-list"><div className="atlas-list-head"><span>Lugares visíveis</span><strong>{visiblePlaces.length}<small>/{biblicalPlaces.length}</small></strong></div>{visiblePlaces.map((place) => <button key={place.id} type="button" className={selected.id === place.id ? "is-active" : ""} onClick={() => focus(place)} aria-pressed={selected.id === place.id}><span className="atlas-place-pin"><Map size={14} /></span><div><strong>{place.name}</strong><small>{place.ancientName} · {place.periods}</small><em>{place.refs}</em></div><ChevronRight size={14} /></button>)}</aside></div>

      <article className="atlas-dossier"><div className="atlas-dossier-heading"><div><span className="advanced-label">Dossiê do lugar</span><h2>{selected.name} <em>· {selected.ancientName}</em></h2><p>{selected.summary}</p></div><div className="atlas-coordinates"><span>Coordenadas aproximadas</span><strong>{selected.lat.toFixed(4)}° N<br />{selected.lng.toFixed(4)}° E</strong></div></div><div className="atlas-dossier-grid"><div><span className="advanced-label">Dossiê histórico</span><strong>{dossier.title}</strong><p>{dossier.thesis}</p></div><div><span className="advanced-label">Rotas e relações</span><p>{routeLayers.filter((layer) => layer.path.some((point) => Math.abs(point.lat - selected.lat) < 3 && Math.abs(point.lng - selected.lng) < 5)).map((layer) => layer.label).join(" · ") || "Lugar indexado no atlas; rota relacionada depende da camada ativa."}</p></div><div><span className="advanced-label">Método</span><p><ShieldCheck size={14} /> {dossier.confidence}</p></div></div><div className="atlas-dossier-foot"><div><span>Referências bíblicas</span><strong>{selected.refs}</strong></div><button type="button" onClick={() => go("study")}>Abrir dossiê histórico <ChevronRight size={15} /></button><button type="button" onClick={() => go("bibliography")}>Ver bibliografia <ChevronRight size={15} /></button></div></article>

      <section className="atlas-city-context" aria-labelledby="city-context-title"><header><span className="advanced-label">Cidades e regiões em contexto</span><h2 id="city-context-title">Não apenas pontos no <em>mapa.</em></h2><p>Estas vistas são reconstruções editoriais para ajudar a imaginar escala, terreno e redes urbanas. Ao abrir uma prancha, o atlas reposiciona sua lente; o dossiê e o mapa interativo preservam a exploração factual.</p></header><div>{atlasCityContexts.map((city) => <AtlasCityContextCard key={city.id} city={city} onFocus={focusCityContext} />)}</div></section>
    </section>
  );
}
