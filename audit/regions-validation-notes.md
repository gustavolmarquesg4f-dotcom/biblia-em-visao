# Validação do mapa de regiões relevantes

A falha era funcional: os quatro marcadores do mapa regional apenas alteravam o período por uma condição fixa e não possuíam destino geográfico, `placeId` ou `focus`. Por isso, o clique não selecionava um lugar nem reposicionava o mapa.

A correção adicionou foco e período explícitos a Galileia, Judeia, Sinai e Transjordânia. Galileia aponta para Cafarnaum; Judeia aponta para Jerusalém; Sinai e Transjordânia usam coordenadas regionais de fallback. O handler agora seleciona o lugar quando existe, aplica a lente histórica e faz pan/zoom quando há foco regional.

Na homologação, a rota `/atlas` exibiu os quatro botões com rótulos acessíveis. O clique em Galileia produziu `Cafarnaum`, `Romano` e `14/26` lugares visíveis, confirmando que o mapa regional deixou de ser apenas decorativo e passou a controlar a exploração do atlas.


A segunda rodada confirmou Judeia → Jerusalém, mantendo a lista completa quando a lente é `Todos`, e Sinai → foco regional nas coordenadas de Sinai, aplicando o período `Bronze` sem depender de um lugar fictício no catálogo. A seleção continua acessível pelos botões com `aria-label`.


A terceira rodada confirmou Transjordânia → foco regional em 31.85° N / 36.15° E, com lente `Todos`. O teste também confirmou que, quando o provedor cartográfico externo falha, o mapa vetorial de fallback e a lista de lugares continuam disponíveis; a correção das regiões não depende do provedor externo.


## Publicação

A versão pública em `https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/atlas?v=d01da0f` exibiu os quatro marcadores regionais. O clique público em Galileia selecionou Cafarnaum, aplicou a lente Romano e mostrou `14/26` lugares visíveis. A correção foi publicada na `gh-pages` em `b79dd75` e o código está na `main` em `d01da0f`.


## Ativos visuais e responsividade

A causa dos 404/500 era o uso de `/manus-storage`, um proxy de armazenamento não configurado para esses arquivos. Os nove ativos foram gerados, movidos para `client/public/atlas-assets` e passaram a ser resolvidos por `atlasAsset(...)`, que respeita a base do Vite e do GitHub Pages.

A auditoria local encontrou `TOTAL=9 MISSING=0`. A homologação respondeu `200 image/png` para mapa-mestre, prancha de Origens, Jerusalém, Alexandria e Sinai. A captura desktop mostrou o mapa do Levante carregado e a captura inferior mostrou sete cartões de cidades/regiões com imagens visíveis. Foram geradas capturas adicionais em 390×844 e 768×1024 para validação responsiva.


A captura mobile 390×844 inicialmente mostrou apenas `Preparando o atlas` por causa da montagem assíncrona; após `virtual-time-budget=10000`, a captura mostrou o título completo, o mapa do Levante carregado e a barra inferior Início/Livros/Mesa/Lugares/Buscar sem overflow horizontal. O aviso do Chromium sobre página não compartilhável pertence à captura headless, não ao aplicativo.


## Publicação v3

Os URLs públicos dos cinco ativos testados responderam `200 image/png`: mapa do Levante, prancha de Origens, Jerusalém, Alexandria e Sinai. O primeiro navegador integrado ainda exibiu blank por cache antigo; o Chromium headless renderizou o atlas completo. Após abrir a publicação com `?assets=e9031e8-v3`, o navegador integrado também renderizou o atlas, exibindo a imagem do Levante e a prancha com o caminho base-aware `/biblia-em-visao/atlas-assets/...`. O service worker público está em `biblia-em-visao-offline-v3`.


A publicação pública final em `https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/atlas?assets=e9031e8-v3` renderizou o mapa-mestre visível. Os marcadores regionais apareceram; o clique público em Galileia aplicou a seleção e deixou o atlas na lente de Cafarnaum/14 lugares visíveis, mantendo a interação após a troca de ativos. A prancha e os cartões usam agora URLs `/biblia-em-visao/atlas-assets/...`.
