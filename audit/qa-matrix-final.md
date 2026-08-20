# Matriz final de QA

## Resultado executivo

A versão candidata foi validada por compilação, auditorias determinísticas, build estático e inspeção visual em desktop, tablet e mobile. A cobertura canônica permanece aprovada em **1.189/1.189**, sem lacunas, duplicidades ou registros inválidos.

| Área | Evidência | Resultado |
|---|---|---|
| TypeScript | `pnpm check` | Aprovado |
| Rotas canônicas | `pnpm audit:navigation` | 17/17 rotas verificadas |
| URL profunda de livro | `/livro/1-g-nesis` | Aprovado |
| URL profunda de capítulo | `/livro/1-g-nesis?cap=2` | Aprovado; histórico via `pushState`/`popstate` |
| Cobertura canônica | `pnpm audit:coverage` | 1.189/1.189 |
| Comentários enriquecidos | auditoria de catálogo | 1.150 enriquecidos + 39 focos ampliados; 0 sintéticos |
| Cartografia | auditoria de catálogo | 1.189/1.189 com contexto cartográfico |
| Fontes textuais | auditoria de catálogo | 1.150 registros com base textual livre rastreável |
| Apócrifos | `ApocryphaHub` + `apocryphaArticles` | 10 corpora com etapas, recepção, termos e fontes |
| Atlas | marcadores e camadas de rota | 4 marcadores e 15 camadas de rota verificadas |
| Backup/importação | `study-store.ts` + painel da Mesa | Implementado |
| Offline | `sw.js` + registro em `main.tsx` | Implementado |
| Desktop | navegador e URL pública | Aprovado |
| Tablet | captura 768×1024 | Aprovado sem overflow visível |
| Mobile | captura 390×844 | Aprovado sem overflow; barra inferior com 5 destinos |
| Acessibilidade | `focus-visible`, labels, `prefers-reduced-motion` | Implementado e compilado |
| Publicação | `pnpm build:github` + workflow | Build aprovado; publicação automatizada configurada |

## Correções críticas aplicadas

A navegação agora possui rotas canônicas em português, URL profunda por livro, parâmetro `cap` para capítulos, histórico do navegador, barra móvel alinhada a Início/Livros/Mesa/Lugares/Buscar, rota direta de bibliografia, rota direta de glossário e onboarding que não bloqueia páginas profundas. O leitor recebeu um atalho `Ir direto ao índice de capítulos`, reduzindo o percurso em dossiês longos.

O enriquecimento textual passou a ler corretamente `chapter.content` e `verse.text` da fonte portuguesa livre. A auditoria de amostra de Gênesis 2 confirma **25 versículos reais**, tema detectado por palavras inteiras e base textual rastreável; o estado anterior de `0 versículos` era resultado de uma extração incompatível, já removida.

## Comandos de reprodução

```bash
pnpm check
pnpm audit:navigation
pnpm build:chapters:deep
pnpm audit:coverage
pnpm build:github
```

A publicação automática está definida em `.github/workflows/deploy-pages.yml`, acionada por `push` em `main` ou manualmente, com publicação em `gh-pages` após typecheck, auditoria de navegação, reconstrução textual e auditoria de cobertura.
