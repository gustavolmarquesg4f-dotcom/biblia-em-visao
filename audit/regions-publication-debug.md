# Diagnóstico da publicação pública

Após publicar `gh-pages` em `71afa4f` com o service worker v3, a URL pública `/atlas?assets=e9031e8` respondeu com tela em branco no navegador. Os ativos individuais respondem HTTP 200 em `/biblia-em-visao/atlas-assets/*.png`, portanto o próximo diagnóstico deve verificar o HTML público, o script principal e o console/runtime do bundle, sem assumir que o problema ainda é o caminho das imagens.
