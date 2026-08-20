import { Toaster } from "@/components/ui/sonner";
// Acervo de Sinais Vivos: a raiz preserva comando rápido e orientação inicial em todas as rotas da enciclopédia.
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PublicationStatus from "./components/PublicationStatus";
import ExperienceCommandLayer from "./components/ExperienceCommandLayer";
import OnboardingNavigator from "./components/OnboardingNavigator";

function AtlasEntry(_props: unknown) { return <Home initialView="atlas" />; }
function ApocalypseEntry(_props: unknown) { return <Home initialView="apocalypse" />; }
function StudiesEntry(_props: unknown) { return <Home initialView="studies" />; }
function StudyDeskEntry(_props: unknown) { return <Home initialView="study" />; }
function BookRoadmapEntry(_props: unknown) { return <Home initialView="study" initialStudyTab="roteiro" />; }
function BookLibraryEntry(_props: unknown) { return <Home initialView="library" />; }
function BookDetailEntry(_props: unknown) { const [location] = useLocation(); const bookId = decodeURIComponent(location.split("/").pop() || ""); return <Home initialView="library" initialBookId={bookId} />; }
function TimelineEntry(_props: unknown) { return <Home initialView="timeline" />; }
function CanonEntry(_props: unknown) { return <Home initialView="canon" />; }
function GlossaryEntry(_props: unknown) { return <Home initialView="glossary" />; }
function BibliographyEntry(_props: unknown) { return <Home initialView="bibliography" />; }
function ThemesEntry(_props: unknown) { return <Home initialView="themes" />; }
function ApocryphaEntry(_props: unknown) { return <Home initialView="apocrypha" />; }
function HistoryEntry(_props: unknown) { return <Home initialView="history" />; }
function SearchEntry(_props: unknown) { return <Home initialView="search" />; }
function PeopleEntry(_props: unknown) { return <Home initialView="people" />; }
function BeginHereEntry(_props: unknown) { return <Home initialView="start" />; }
function HomeEntry(_props: unknown) { return <Home />; }

function Router() {
  const basePath =
    import.meta.env.BASE_URL === "/"
      ? undefined
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <WouterRouter base={basePath}>
      <ExperienceCommandLayer />
      <OnboardingNavigator />
      <Switch>
        <Route path={"/"} component={HomeEntry} />
        <Route path={"/atlas"} component={AtlasEntry} />
        <Route path={"/estudos"} component={StudiesEntry} />
        <Route path={"/percursos"} component={StudiesEntry} />
        <Route path={"/estudos-profundos"} component={StudiesEntry} />
        <Route path={"/mesa"} component={StudyDeskEntry} />
        <Route path={"/66-livros"} component={BookLibraryEntry} />
        <Route path={"/livro/:bookId"} component={BookDetailEntry} />
        <Route path={"/roteiro"} component={BookRoadmapEntry} />
        <Route path={"/linha-do-tempo"} component={TimelineEntry} />
        <Route path={"/canon"} component={CanonEntry} />
        <Route path={"/glossario"} component={GlossaryEntry} />
        <Route path={"/glossary"} component={GlossaryEntry} />
        <Route path={"/bibliografia"} component={BibliographyEntry} />
        <Route path={"/temas"} component={ThemesEntry} />
        <Route path={"/apocrifos"} component={ApocryphaEntry} />
        <Route path={"/deuterocanonicos"} component={ApocryphaEntry} />
        <Route path={"/historia"} component={HistoryEntry} />
        <Route path={"/busca"} component={SearchEntry} />
        <Route path={"/pessoas"} component={PeopleEntry} />
        <Route path={"/povos"} component={PeopleEntry} />
        <Route path={"/pessoas-e-povos"} component={PeopleEntry} />
        <Route path={"/comece"} component={BeginHereEntry} />
        <Route path={"/apocalipse"} component={ApocalypseEntry} />
        <Route path={"/escatologia"} component={ApocalypseEntry} />
        <Route path={"/apocalypse"} component={ApocalypseEntry} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <PublicationStatus />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
