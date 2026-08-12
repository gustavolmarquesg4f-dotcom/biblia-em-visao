# Auditoria avançada — conteúdo e atlas

## Achados principais

1. A página atual usa um `RouteMap` em SVG com caminhos decorativos e uma `Atlas` baseada em imagem estática. Os pontos não representam localidades bíblicas com coordenadas, não há zoom, pan, camadas, legenda geohistórica ou seleção de lugares reais.
2. O projeto já possui `client/src/components/Map.tsx` com `MapView`, carregamento do proxy Google Maps e suporte a marcadores, geocodificação, geometria e rotas, mas esse componente ainda não é utilizado pela página `Atlas`.
3. A fonte Cambridge Elements sobre *The Archaeology of Ancient Israel* afirma que o estudo atual integra fontes arqueológicas, textuais e iconográficas, e que novas técnicas e estudos de identidade revisam interpretações tradicionais. Isso deve orientar o modo avançado, com distinção entre evidência, texto e reconstrução.
4. A fonte do Israel Museum não carregou conteúdo textual na navegação automatizada; ela não será usada como base única. A plataforma deve priorizar fontes acadêmicas acessíveis e registrar limitações de consulta.

## Diagnóstico editorial

Os textos atuais funcionam como introdução editorial, mas repetem fórmulas de orientação (“comece pelo mapa”, “lente de leitura”, “siga a história”) e não oferecem densidade suficiente para um leitor experiente. A revisão precisa trocar frases de acolhimento por dossiês com problema histórico, evidência, bibliografia, controvérsia, implicações textuais e posição teológica explicitada.

## Correção de produto necessária

O atlas deve ser reconstruído com coordenadas reais e dados de lugares bíblicos, rotas e períodos. A experiência deve mostrar uma nota clara de que a cartografia moderna é uma aproximação para a geografia antiga, e cada ponto deve abrir um dossiê com nomes antigos e modernos, referências, período, evidência e grau de segurança.

## Referências consultadas

1. [Cambridge University Press, *The Archaeology of Ancient Israel*](https://www.cambridge.org/core/publications/elements/the-archaeology-of-ancient-israel) — apresenta a integração de fontes arqueológicas, textuais e iconográficas e a necessidade de revisar interpretações tradicionais.
2. [Israel Museum, Archaeology of the Land of Israel](https://www.imj.org.il/en/wings/archaeology/archaeology-land-israel) — referência institucional consultada, mas cujo conteúdo textual não carregou na navegação automatizada; não foi usada como fonte única.
