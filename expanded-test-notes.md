# Validação da expansão

## Biblioteca profunda

- A view “Os 66 livros” carregou 66 cartões, com filtros por testamento e gênero, busca e indicação de “Dossiê completo” ou “Ficha de orientação”.
- O cartão de Gênesis abriu o dossiê retornado pelo arquivo estático publicado, com texto analítico longo e abas para fontes primárias, bibliografia e limites/confiança.
- O dossiê exibiu autoria, período, temas e uma separação explícita entre texto, reconstrução histórica, tradição pentecostal, posição denominacional e hipótese acadêmica.

## Bibliografia

- A view “Bibliografia” carregou 591 referências agregadas dos 66 relatórios.
- A interface oferece filtro por livro, busca por autor/obra/período e abas Todos, Primárias e Acadêmicas.
- Cada referência é apresentada como link externo clicável; a seção também exibe os limites de confiança do dossiê correspondente.

## Atlas com camadas

- O atlas exibiu 13 lugares, 4 rotas e 4 camadas imperiais, além de filtros por período.
- As camadas visíveis na interface são Lugares bíblicos, Patriarcas, Êxodo e conquista, Reinos e exílio, Viagens missionárias, Assíria, Babilônia, Pérsia aquemênida e Roma no Oriente.
- O mapa carregou com Google Maps, zoom, satélite, tela cheia e lista lateral de lugares.
- A ativação de “Viagens missionárias” desenhou a polilinha colorida entre cidades do Mediterrâneo oriental e Roma, mantendo os marcadores.
- A ativação de “Pérsia aquemênida” adicionou a área poligonal translúcida ao mapa e manteve a rota ativa, permitindo leitura combinada de deslocamento e poder imperial.

## Correção de cobertura

- A normalização passou a remover categorias anexadas ao nome e diferenças de acentuação.
- A biblioteca final exibiu “Dossiê completo” nos 66 cartões, incluindo Oseias e Miqueias, que antes apareciam como fichas de orientação.
- O relatório consolidado contém 66 dossiês válidos; cada livro tem pelo menos uma fonte primária e uma fonte acadêmica indexadas, totalizando 66 referências primárias e 66 acadêmicas no modelo recebido.
- A biblioteca, a bibliografia global e o atlas foram integrados à navegação principal e validados após o build final.

## Expansão exegética e temporal

- A base consolidada contém 66 dossiês, 592 capítulos, 288 seções com linguagem profética e 195 referências detectadas.
- O leitor exegético foi integrado à ficha de cada livro com índice de capítulos, busca interna, navegação anterior/próximo, aba de profecias e aba de método/fontes.
- O atlas recebeu 14 eventos temporais, controles de reprodução/pausa, avanço/retrocesso, slider, foco geográfico e ativação progressiva de rotas e impérios.
- Build TypeScript e build de produção concluídos sem erro.
- A inspeção de console encontrou e corrigiu âncoras aninhadas na bibliografia; após a correção, não surgiram novos erros no carregamento.
- A página inicial foi verificada em desktop 1280px e móvel 390px sem cortes visíveis.
- O primeiro catálogo relacional tinha listas vazias porque o parser não removia o hífen dos marcadores `ENTITY`, `EVENT`, `PLACE`, `THEME`, `PROPHECY` e `CONNECTION`; o parser foi corrigido e o catálogo foi republicado.
- A auditoria final do JSON confirma 65/65 livros com entidades, eventos, lugares, temas, profecias e continuidade preenchidos; Gênesis permanece no componente relacional dedicado.
- Êxodo foi reaberto na prévia com 10 entidades, 5 lugares, 7 conexões canônicas e oito arcos com título, resumo e pergunta separados, sem duplicação.
