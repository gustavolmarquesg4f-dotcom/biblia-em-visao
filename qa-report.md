# Relatório de QA — Enciclopédia Bíblica

**Rodada:** 17 de agosto de 2026  
**Escopo:** rotas públicas, navegação, interações, persistência local, pacote offline, responsividade, TypeScript e build de produção.

## Resultado executivo

| Área | Verificação | Resultado |
|---|---|---|
| Rotas principais | Comece, busca, estudos profundos, 66 livros, pessoas, atlas, história, apócrifos e mesa | Aprovado |
| Navegação e filtros | Perguntas guiadas, filtros canônicos, recepção dos apócrifos, períodos do atlas e linha histórica | Aprovado |
| Pessoas e povos | Cartões de Abraão e Sara e fichas locais | Aprovado |
| Leitores | Unidades de leitura, camadas de comentário e módulos de estudo profundo | Aprovado |
| Dados locais | Notas, progresso, foco concluído e coleção de estudo | Aprovado |
| Backup | Exportação, rejeição de JSON inválido e mesclagem de dados | Aprovado por teste de regressão |
| Offline | Manifesto, service worker, criação e remoção de pacote local | Aprovado em produção |
| Responsividade | Oito rotas em 390px e leitores em tablet | Aprovado visualmente |
| TypeScript | `pnpm run check` | Aprovado |
| Build | `pnpm run build` | Aprovado com alerta de tamanho de bundle |

## Interações críticas testadas

| Fluxo | Resultado observado |
|---|---|
| Comece aqui | Os três caminhos de entrada abrem destinos úteis. |
| Busca por perguntas | Perguntas sugeridas exibem resposta, textos-base e continuação. |
| Estudos profundos | Escatologia, Anjos e Trindade trocam módulos e camadas corretamente. |
| Índice dos 66 livros | Livros centrais e livros fora do lote inicial atualizam a leitura. |
| Pessoas e povos | Fichas locais abrem sem depender do carregamento do grafo externo. |
| Atlas | Camadas e períodos atualizam lugares e rotas. |
| História e Apócrifos | Estações, filtros e etapas narrativas atualizam o conteúdo. |
| Mesa de estudo | Abas, foco concluído e pacote offline respondem corretamente. |

## Item de acompanhamento

O build final está funcional, porém o bundle principal continua grande (aproximadamente **2,5 MB** antes de compressão e **657 kB gzip**). A próxima rodada técnica deve aplicar carregamento sob demanda para o atlas, visualizações avançadas e leitores que não são necessários na primeira tela. Isso não bloqueia o uso atual, mas reduzirá o tempo de carregamento em redes móveis.

## Limites desta rodada

Os testes de instalação do PWA e desconexão física foram realizados em prévia/produção de navegador. A instalação como aplicativo e o comportamento em modo avião devem ser confirmados também em um aparelho Android e em um iPhone reais, porque cada sistema operacional apresenta sua própria interface de instalação e política de cache.
