// Acervo de Sinais Vivos: pequenas marcas locais preservam a continuidade sem exigir conta ou sincronização em nuvem.
export type JourneyRoute = { href: string; label: string; visitedAt: string };
const routeKey = "biblia-em-visao:journey-routes";

export function readJourneyRoutes(): JourneyRoute[] { try { const saved = window.localStorage.getItem(routeKey); const routes = saved ? JSON.parse(saved) as JourneyRoute[] : []; return Array.isArray(routes) ? routes.slice(0, 5) : []; } catch { return []; } }
export function recordJourneyRoute(href: string, label: string) { const next = [{ href, label, visitedAt: new Date().toISOString() }, ...readJourneyRoutes().filter((item) => item.href !== href)].slice(0, 5); window.localStorage.setItem(routeKey, JSON.stringify(next)); }

export type OnboardingProfile = { completed: boolean; entry?: string };
const onboardingKey = "biblia-em-visao:onboarding";
export function readOnboardingProfile(): OnboardingProfile { try { const saved = window.localStorage.getItem(onboardingKey); return saved ? JSON.parse(saved) as OnboardingProfile : { completed: false }; } catch { return { completed: false }; } }
export function saveOnboardingProfile(profile: OnboardingProfile) { window.localStorage.setItem(onboardingKey, JSON.stringify(profile)); }
