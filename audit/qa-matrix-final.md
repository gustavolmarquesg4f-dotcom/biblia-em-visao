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


## Rodada de qualidade — agosto de 2026

| Área | Evidência adicional | Resultado |
|---|---|---|
| Qualidade editorial | `pnpm audit:editorial` | 1.189 textos compostos únicos, 0 vazios, 0 curtos, 0 grupos repetidos, 1.150 com base textual e 39 focos ampliados |
| Versículos recuperados | auditoria textual pós-alias `Cântico dos Cânticos → Cantares` | 1.150/1.150 comentários enriquecidos com contagem detectável; 39 focos ampliados preservados |
| Ativos do atlas | `pnpm audit:atlas-assets` | 9/9 WebP presentes, 0 ausências, 0 referências obsoletas |
| Compressão visual | `audit/atlas-optimization.json` | 69.986.117 bytes → 7.642.288 bytes; redução de 89,08% |
| Acessibilidade estática | `pnpm audit:accessibility` | 248/248 botões com tipo, 5/5 imagens com alt, 18/18 controles nomeados; foco visível e redução de movimento presentes |
| Acessibilidade DOM | `pnpm audit:dom` | 5/5 rotas principais sem gaps de nome, imagens sem alt ou ErrorBoundary |
| Cache offline | `client/public/sw.js` | Cache atualizado para `v4` |
| Workflow remoto | GitHub Actions run `32439192083` | **success**; `main` `b93a2fd`; `gh-pages` `e6812b2` |
| Publicação pública | URL com `?deploy=e6812b2` | Cabeçalho `1.189 capítulos`, WebP carregado e fallback vetorial disponível |


## Auditoria de navegação completa — fechamento

| Fluxo adicional | Evidência | Resultado |
|---|---|---|
| Referências bibliográficas | `pnpm audit:references` | 303/303 URLs estruturalmente válidas; primeira referência externa abriu destino real |
| Conexões dos dossiês | `pnpm audit:connections` | 18/18 conexões dos seis dossiês resolvidas |
| Grafo Proféticas | Busca → grafo → Proféticas | 2 nós/1 relação: Babilônia → Apocalipse |
| Grafo Históricas | Busca → grafo → Históricas | 4 nós/2 relações |
| Grafo Geográficas | Busca → grafo → Geográficas | 3 nós/2 relações |
| Grafo Teológicas | Busca → grafo → Teológicas | 60 relações teológicas renderizadas dentro do limite visual de 60 |
| Inspector de relações | clique em aresta | Referências e origem da relação abertas |
| Pessoas relacionadas | clique em nó → pessoa relacionada | Verbete troca corretamente e resumos compactos sem Markdown cru |
| Temas → biblioteca | Aliança → `/66-livros?q=Aliança` | 6 livros relacionados preservados na URL |
| Linha do tempo | Patriarcas → Gênesis | `/livro/1-genesis` resolvido pelo `relatedBookId` explícito |
| Apócrifos | Católica → Tobias → estação | Filtro, corpus e estações funcionais |
| Cânones | Formação, Manuscritos, Interpretação | Destinos reais para Estudos profundos/Bibliografia |
| Revisão | quiz → resultado → persistência | Marco e melhor pontuação persistidos |
| Preview Pages | servidor base-aware + `QA_BASE_URL` | 18/18 rotas aprovadas no build com base `/biblia-em-visao/` |
| Mobile/tablet | capturas 390×844 e 768×1024 | Mapa, leitor, busca e barra móvel sem overflow |

O workflow foi corrigido para compilar antes do smoke test, servir o build no prefixo real do GitHub Pages, aguardar o servidor e só então validar as rotas. Isso elimina a reprovação falsa que ocorria quando o smoke test acessava a raiz de um build configurado com base `/biblia-em-visao/`.
