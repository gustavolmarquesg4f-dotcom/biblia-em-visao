import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PublicationStatus from "./components/PublicationStatus";

function AtlasEntry(_props: unknown) { return <Home initialView="atlas" />; }
function ApocalypseEntry(_props: unknown) { return <Home initialView="apocalypse" />; }
function StudiesEntry(_props: unknown) { return <Home initialView="studies" />; }
function ApocryphaEntry(_props: unknown) { return <Home initialView="apocrypha" />; }
function HistoryEntry(_props: unknown) { return <Home initialView="history" />; }
function HomeEntry(_props: unknown) { return <Home />; }

function Router() {
  const basePath =
    import.meta.env.BASE_URL === "/"
      ? undefined
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <WouterRouter base={basePath}>
      <Switch>
        <Route path={"/"} component={HomeEntry} />
        <Route path={"/atlas"} component={AtlasEntry} />
        <Route path={"/estudos"} component={StudiesEntry} />
        <Route path={"/percursos"} component={StudiesEntry} />
        <Route path={"/apocrifos"} component={ApocryphaEntry} />
        <Route path={"/deuterocanonicos"} component={ApocryphaEntry} />
        <Route path={"/historia"} component={HistoryEntry} />
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
