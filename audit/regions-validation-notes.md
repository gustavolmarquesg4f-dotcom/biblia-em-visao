# Validação do mapa de regiões relevantes

A falha era funcional: os quatro marcadores do mapa regional apenas alteravam o período por uma condição fixa e não possuíam destino geográfico, `placeId` ou `focus`. Por isso, o clique não selecionava um lugar nem reposicionava o mapa.

A correção adicionou foco e período explícitos a Galileia, Judeia, Sinai e Transjordânia. Galileia aponta para Cafarnaum; Judeia aponta para Jerusalém; Sinai e Transjordânia usam coordenadas regionais de fallback. O handler agora seleciona o lugar quando existe, aplica a lente histórica e faz pan/zoom quando há foco regional.

Na homologação, a rota `/atlas` exibiu os quatro botões com rótulos acessíveis. O clique em Galileia produziu `Cafarnaum`, `Romano` e `14/26` lugares visíveis, confirmando que o mapa regional deixou de ser apenas decorativo e passou a controlar a exploração do atlas.


A segunda rodada confirmou Judeia → Jerusalém, mantendo a lista completa quando a lente é `Todos`, e Sinai → foco regional nas coordenadas de Sinai, aplicando o período `Bronze` sem depender de um lugar fictício no catálogo. A seleção continua acessível pelos botões com `aria-label`.


A terceira rodada confirmou Transjordânia → foco regional em 31.85° N / 36.15° E, com lente `Todos`. O teste também confirmou que, quando o provedor cartográfico externo falha, o mapa vetorial de fallback e a lista de lugares continuam disponíveis; a correção das regiões não depende do provedor externo.


## Publicação

A versão pública em `https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/atlas?v=d01da0f` exibiu os quatro marcadores regionais. O clique público em Galileia selecionou Cafarnaum, aplicou a lente Romano e mostrou `14/26` lugares visíveis. A correção foi publicada na `gh-pages` em `b79dd75` e o código está na `main` em `d01da0f`.
