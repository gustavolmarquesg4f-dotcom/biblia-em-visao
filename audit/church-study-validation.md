# Validação final — “O que é ser Igreja?”

**Projeto:** A Bíblia em Visão Geral
**Data da validação:** 22 de agosto de 2026
**Escopo:** estudo profundo de Eclesiologia, integração de rotas, launcher global, fontes externas e responsividade.

## Resultado executivo

A implementação foi validada em ambiente local de produção com base `/biblia-em-visao/`. O estudo está presente nos dois catálogos, possui dez etapas sincronizadas com dez módulos do leitor, cinco camadas não vazias por módulo e referências estruturadas. As rotas diretas `/igreja` e `/eclesiologia` abrem o estudo correto; o launcher encontra a entrada especializada por “igreja”; e as fontes estruturadas aparecem como links externos acessíveis, sem Markdown cru no DOM renderizado.

> **Status do estudo:** APROVADO para commit e publicação, condicionado à execução do workflow do GitHub e à verificação posterior da URL pública.

## Matriz de validação

| Área | Evidência | Resultado |
|---|---|---:|
| Cobertura do acervo bíblico | 66 livros; 1.189 capítulos publicados; 1.189 chaves únicas; 0 ausências; 0 duplicatas; 1.189 capítulos com cartografia | **APROVADA** |
| TypeScript | `pnpm check` / `tsc --noEmit` | **APROVADA** |
| Estudo de Igreja | ID nos dois catálogos; 10 etapas; 10 módulos; 5 camadas por módulo; 14 fontes; 12 URLs HTTPS estruturados; 0 Markdown cru | **APROVADA** |
| Navegação estrutural | 19 rotas requeridas; 19 correspondências; rotas `/igreja` e `/eclesiologia`; launcher e entrada profunda | **APROVADA** |
| Smoke test DOM | 20 rotas; marcadores presentes; âncoras internas sem ausência; 0 Markdown cru; 0 error boundary | **APROVADA** |
| Acessibilidade estática | 187 arquivos; 251 botões tipados; 18 controles nomeados; 21 regras de foco visível; 10 regras de movimento reduzido; 0 lacunas | **APROVADA** |
| Build GitHub Pages | `pnpm build:github` concluído com bundle base-aware | **APROVADO** |
| QA visual | Capturas em 390 px, 768 px e revisão interativa em aproximadamente 900 px | **APROVADO** |

## Conteúdo validado

O estudo articula Igreja como povo de Deus, corpo de Cristo e comunidade do Espírito. Os módulos tratam do corpo diaconal, do corpo pastoral, do corpo evangelístico, de dons e vocações, de autoridade e prestação de contas, de Palavra/mesa/oração/comunhão, de missão e de diálogo com Agostinho, Calvino, Wesley, Bonhoeffer, Moltmann e Volf.

A redação preserva o limite metodológico de distinguir **dom, vocação, ofício, ordenação e cargo administrativo**. A lente pentecostal/IDB aparece como leitura situada, em diálogo com perspectivas católica, reformada, wesleyana, livre/congregacional e contemporânea, e não como modelo bíblico universal. O conteúdo também explicita cuidado de vulneráveis, transparência, prevenção de abuso, disciplina e restauração, para que autoridade não seja confundida com prestígio ou imunidade.

## Fontes externas

Os doze URLs estruturados do estudo foram testados com requisições HTTP e retornaram status 200 após redirecionamentos. Os três links anteriormente bloqueados por 403 foram substituídos por páginas públicas de Bonhoeffer Society, Yale Center for Faith and Culture e Google Books. As duas referências legadas de Agostinho e Wesley continuam como strings bibliográficas compatíveis, sem URL estruturada, porque não foram convertidas sem uma página primária suficientemente segura no momento da validação.

A auditoria histórica de disponibilidade do corpus de dossiês registrou 303 referências sintaticamente válidas, 268 alcançáveis, 33 indisponíveis e 2 erros. Esse resultado pertence às referências antigas dos 66 dossiês e não aos doze URLs do estudo de Igreja; por isso, foi mantido separado do resultado aprovado das fontes novas.

## QA visual e interação

Em aproximadamente 900 px, a rota abriu com o estudo 20 ativo, exibiu o índice de dez módulos, mostrou o módulo 3 do corpo diaconal após interação e trocou para a camada “O que isso significa” sem perder o contexto. O launcher abriu pelo atalho de teclado e, ao pesquisar “igreja”, apresentou tanto a área ampla de estudos profundos quanto o destino específico “Igreja: corpo e ministérios”. O console não registrou erros após a navegação.

Em 390 px, o cabeçalho móvel, o menu, a rota, o título, o contador de estudos, o card de entrada e a barra inferior permaneceram legíveis sem overflow horizontal evidente. Em 768 px, o layout intermediário preservou a hierarquia do cabeçalho, a entrada em destaque, a rota ativa e o início da leitura em coordenadas. As capturas estão em `audit/screenshots/` e as observações detalhadas em `audit/visual-study-qa.md`.

## Comandos executados

| Comando | Finalidade |
|---|---|
| `pnpm check` | Typecheck do projeto |
| `pnpm audit:church-study` | Integridade específica do estudo novo |
| `pnpm audit:navigation` | Rotas, entrada profunda e aliases |
| `pnpm audit:accessibility` | Regras estáticas de acessibilidade |
| `pnpm audit:dom` | Auditoria DOM disponível no ambiente |
| `pnpm audit:references` | Integridade sintática das referências dos 66 dossiês |
| `pnpm audit:connections` | Resolução das conexões editoriais |
| `pnpm audit:editorial` | Qualidade dos 1.189 registros de capítulo |
| `pnpm audit:references:http` | Disponibilidade histórica dos URLs do corpus |
| `pnpm qa:routes` | Smoke test das 20 rotas no preview base-aware |
| `pnpm build:github` | Build final para GitHub Pages |

## Próxima etapa

Após este relatório, o conjunto de alterações deve ser revisado com `git diff --check`, commitado na `main`, enviado ao GitHub e acompanhado no workflow de publicação. A conclusão pública só deve ser declarada depois de o workflow terminar em `success`, o branch `gh-pages` receber o novo SHA e as rotas públicas `/igreja` e `/eclesiologia` responderem com o título do estudo.
