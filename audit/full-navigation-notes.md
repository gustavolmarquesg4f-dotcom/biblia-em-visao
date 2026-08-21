# Auditoria manual de navegação — rodada pública

A publicação pública abriu a página principal com o onboarding de primeira visita. Após fechá-lo, a home expôs o rail global com Comece, Ponto de partida, Linha do tempo, Atlas, História, 66 livros, Pessoas, Temas, Busca, Estudos profundos, Mesa, Cânones, Apócrifos, Glossário, Apocalipse e Bibliografia. A página também mostrou referências externas do Israel Museum e British Library, links para os 66 livros, escatologia e bibliografia, além de tabs da Mesa, nota, backup/importação e ledger de fontes. Nenhum ErrorBoundary foi observado nesta rodada.

A primeira evidência indica que a navegação global e as superfícies de referências existem, mas exigem testes de destino e de ação: links externos, links de bibliografia, seleção de tabs, busca, filtros, exportação/importação e abertura de livros devem ser clicados individualmente.


## Descoberta crítica — bibliografia

O menu global abriu corretamente `.../bibliografia`, com 303 referências, busca por autor/obra/livro/período, filtro por livro e filtros de tipo. A navegação da rota funciona. Porém, a inspeção visual mostrou várias referências com URLs malformadas, por exemplo `https://archive.org/...\](https://archive.org/...)` e `https://www.ivpress.com/...\](https://www.ivpress.com/...)`, indicando que parte do catálogo contém resíduos de sintaxe Markdown no atributo `href`. Esse é um defeito real: o texto aparece, mas o clique pode levar a um endereço inválido. Também devem ser testados os filtros, a busca e os links externos individualmente.


A primeira referência de Gênesis (`learn.ligonier.org`) abriu corretamente em uma página externa válida. Ao retornar à bibliografia pública, a interface ainda mostrou URLs antigas contaminadas em vários cartões, como `...](https://...)`, porque a correção do catálogo ainda não havia sido publicada neste momento da auditoria. A rota possui 303 referências indexadas, busca, filtro por livro e filtros Primárias/Acadêmicas; esses controles precisam ser exercitados novamente depois do deploy corrigido.


## Busca e filtros da bibliografia

Na publicação em homologação, a busca por `Gênesis` reduziu o catálogo para o cartão de Gênesis; o filtro `Acadêmicas` reduziu as quatro referências para duas, confirmando que a lógica de filtro funciona. A primeira referência de Gênesis abriu uma página externa válida. A etapa restante é publicar o catálogo normalizado e o novo layout, depois repetir o clique nos registros que antes continham resíduos de Markdown.


## Biblioteca dos 66 livros

A rota `.../66-livros` abriu com 66 dossiês, filtros por testamento e categoria e cards clicáveis. A busca por `Apocalipse` retornou **Daniel** e **Apocalipse**, porque o resumo de Daniel contém “visões sobre impérios”; a lógica está funcional, mas a interface deveria comunicar melhor que a busca inclui tema/resumo e não somente o nome do livro. O filtro e os cards devem continuar sendo testados com abertura e retorno.


## Falha crítica — entidades internas dos dossiês

A biblioteca abriu corretamente o dossiê profundo de Apocalipse em `/livro/66-apocalipse`, com 12 seções, índice clicável, campo de filtro, botão Salvar e entidades internas. Ao clicar em `Roma`, a página rolou para a seção correta e o progresso mudou, mas o corpo contém links internos malformados: textos como `[Nova [Jerusalém]...]` aparecem com sintaxe Markdown e hrefs como `#entity-%5BJerusalem%5D(#entity-jerusalem)`. Isso afeta a apresentação e pode impedir o clique em várias entidades. A causa provável está no decorador/normalizador de Markdown ou no corpus profundo, que gera links aninhados; precisa ser corrigido e validado com entidades como Roma, Jerusalém, Jesus e Éden.


## Correção confirmada — entidades

A homologação 3004 inicialmente abriu em branco por montagem assíncrona, mas após aguardar renderizou normalmente. O dossiê de Apocalipse agora mostra `Nova Jerusalém`, `Roma`, `Jesus Cristo`, `Éden` e demais entidades com âncoras limpas, como `#entity-jerusalem`, `#entity-rome` e `#entity-jesus`; a sintaxe quebrada `%5B...%5D(#entity-...)` desapareceu. O decorador foi corrigido para mascarar links Markdown com rótulos/URLs aninhados durante cada substituição e restaurá-los sem alterações.


## Auditoria DOM de entidades

A rota de Apocalipse em homologação apresentou **106 links de entidade**. A verificação automática encontrou **0 hrefs malformados**: nenhum contém `%5B`, `%5D`, parênteses ou colchetes indevidos. A amostra inclui `#entity-eden`, `#entity-nova-criacao`, `#entity-jerusalem`, `#entity-rome` e `#entity-jesus`. O clique DOM em `Roma` foi acionado com sucesso e deve abrir o painel lateral da entidade.


## Fluxo dossiê → atlas

O painel interno de Roma abriu corretamente com resumo, referências bíblicas, método e o botão `Destacar no atlas`. O clique levou à rota `/atlas`, que carregou a prancha local do Levante, 26 lugares, 11 rotas, 4 impérios, filtros por rota/período, linha do tempo e dossiê de Jerusalém. Este fluxo cruzado funciona na homologação. A camada de cartões de cidade ainda exibe o texto visual `Vista editorial indisponível` junto às imagens no conteúdo extraído, embora as imagens carreguem visualmente; isso deve ser confirmado como fallback condicional e pode ser melhorado para não aparecer quando o ativo está disponível.


## Atlas após correção do fallback visual

No atlas local, o scroll até os cartões mostrou as sete imagens WebP carregadas e o texto `Vista editorial indisponível` não aparece mais quando o recurso está disponível. O aviso `Mapa do provedor indisponível` aparece somente para o serviço externo, acompanhado do mapa vetorial próprio, e não bloqueia a exploração. O ajuste condicional do fallback dos cartões foi implementado.


## Cartões de cidades

O DOM encontrou os sete cartões (`Jerusalém`, `Éfeso`, `Alexandria`, `Roma`, `Babilônia`, `Sinai` e `Galileia`). O clique em `Alexandria` foi acionado e a captura final mostrou todas as sete imagens carregadas, sem o fallback `Vista editorial indisponível`. O layout horizontal em desktop não apresentou quebra; o comportamento mobile deve ser repetido no build final.


## Comece aqui

A rota `/comece` abriu com três portas funcionais: visão geral, pergunta e estudo de livro. O onboarding aparece apenas como orientação de primeira visita e foi fechado sem bloquear a rota. A página mantém o rail global e os caminhos de continuidade.


## Percurso guiado e estudos profundos

A ação `Começar pelo percurso guiado` leva a `/estudos-profundos`, e `Abrir estudo escatológico` leva a `/apocalipse`. O módulo renderiza 12 unidades, 22 capítulos indexados, 7 cidades, 5 escolas comparadas, 4 camadas de autoridade, índice de estações, navegação anterior/próxima, comparação de escolas, mapa das sete cidades, capítulo a capítulo, fontes e método. O fluxo principal está conectado.


## Estudos: submódulos

O botão `Capítulo a capítulo` manteve o estudo na rota e levou a uma seção de leitura específica. Em seguida, `Comparar cinco escolas` mudou o conteúdo para as cinco lentes (`Preterista`, `Historicista`, `Futurista`, `Idealista`, `Eclética`) e atualizou o índice/estado ativo para `Escolas de interpretação`. A interação não apresentou erro de rota.


## Pessoas e povos — pendência encontrada

A rota `/pessoas` renderiza 7 entradas e a ficha lateral de Abraão e Sara abre corretamente. Porém, o clique em `Abraão` na seção `Rede aprofundada` não trocou visualmente a ficha durante o teste: os IDs `abraham` e `sarah` existem no `entity-graph`, mas a tela permaneceu com a ficha de Abraão e Sara. Esse fluxo precisa ser ajustado para fechar a ficha local antes de abrir o EntityPanel global ou para exibir a biografia conectada diretamente.


## Pessoas — segunda falha reproduzida

Após fechar a ficha local antes de chamar `openEntity`, o clique em `Abraão` não deixou painéis sobrepostos, porém também não abriu o `EntityPanel` global: a rota voltou à grade de Pessoas sem ficha visível. Os IDs `abraham` e `sarah` existem no catálogo de entidades, então é necessário verificar a função de busca/normalização do `EntityPanel` e garantir uma transição explícita para a entidade conectada.


## Pessoas — correção confirmada

Após alinhar `peopleEntityGroups` aos IDs reais (`person-abraao`, `person-sara`, `person-moises` etc.), o clique em `Abraão` fechou a ficha agregada e abriu o painel `Biografia · dossiê profundo` de Abraão. O catálogo carregou 119 biografias; as conexões agora apontam para registros existentes.

A inspeção revelou ainda que o painel biográfico exibia Markdown bruto. O componente foi corrigido para renderizar Markdown e transformar `Gn`, `Rm`, `Gl` e demais referências reconhecidas em chips clicáveis que abrem o livro correspondente.


## Biografias e referências — correção confirmada

A ficha individual de Abraão agora renderiza Markdown sem os delimitadores visíveis e transforma as cinco referências principais em botões navegáveis. O clique em `Gênesis 12:1–3` abriu a rota profunda `/livro/1-g-nesis`, confirmando o fluxo referência → dossiê do livro.


## Dossiê profundo — entidade ainda sem abertura

No dossiê profundo de Gênesis, o link interno `Abraão` aparece como elemento clicável, mas o clique não abriu o painel de entidade; apenas reposicionou a página no texto. A biografia individual funciona quando aberta pela rede Pessoas. É necessário alinhar os IDs gerados por `decorateMarkdown` (`entity-person-abraao`) com o catálogo de entidades/biografias e tratar a carga assíncrona antes de considerar o fluxo de entidades dos dossiês concluído.


## Dossiê profundo — diagnóstico DOM

O DOM do dossiê contém links corretos como `#entity-person-abraao`, mas após o clique há `0` elementos `[role=dialog]` e `0` `.entity-panel`; o console não registra exceção. A próxima correção deve garantir que a resolução assíncrona do catálogo biográfico esteja pronta e que o evento do link seja capturado de maneira observável antes de renderizar o painel.


## Correção de entidades e referências

O painel biográfico foi integrado ao `Streamdown`, com normalização de escapes Markdown, referências principais em chips clicáveis e estilos acessíveis. A rede de Pessoas passou a usar os IDs reais do catálogo (`person-*`). O dossiê profundo agora aguarda o catálogo biográfico antes de abrir entidades de pessoas, evitando painel vazio em links como `#entity-person-abraao`. O typecheck passou após as mudanças.


## Dossiê profundo — segunda reprodução

O acionamento programático de `#entity-person-abraao` encontrou o link, mas o DOM continuou com zero painéis. A navegação por referência de livro funciona; o problema está isolado ao handler de entidades do dossiê. A correção seguinte deve usar uma abertura controlada no próprio componente, possivelmente com o painel de entidade montado localmente, em vez de depender apenas do estado global do Home.


## Dossiê profundo — validação concluída

Após o renderer customizado de links internos, o DOM confirmou `1` backdrop, `1` `aside.entity-panel` e `1` diálogo após o clique em Abraão. Visualmente, o painel contextual abriu sobre o dossiê com resumo, contexto, relações familiares/institucionais, trajetória no cânon e referências bíblicas. O fluxo de entidade no dossiê está aprovado.


## Bibliografia — validação repetida

A rota `/bibliografia` abre com 303 referências indexadas. A busca por `Gênesis` reduziu o conjunto ao dossiê correto; o filtro `Acadêmicas` reduziu as quatro referências para duas entradas. O primeiro cartão abriu `learn.ligonier.org` em URL válida. Os cartões exibem domínio legível, URL completa e rótulo acessível.


## Biografias — falha editorial restante

O painel individual de Abraão abre corretamente e as referências são clicáveis, porém o texto biográfico ainda mostra marcadores Markdown crus (`**Abrão**`, `\[36\]`) no subtítulo e no corpo. A navegação funciona, mas a apresentação do conteúdo precisa normalizar Markdown/escapes em todas as seções antes da publicação.


## Pessoas e povos — validação repetida

A rota `/pessoas` abre a ficha de Abraão e Sara. O botão `Abraão` abre o verbete individual com cinco referências, livros relacionados e pessoas relacionadas. O chip `Gênesis 12:1–3` navegou para `/livro/1-g-nesis`, confirmando a cadeia pessoas → referência → dossiê.


## Busca na rede — Markdown cru

A consulta `Abraão` retorna 17 resultados e os cartões são acionáveis, mas os resumos de Noé, Abraão, Sara e outras biografias exibem marcadores Markdown crus (`**Abrão**`, `\*nome\*`, `\[36\]`). A navegação dos cartões funciona, porém a camada de apresentação da busca precisa limpar ou renderizar os resumos biográficos.


## Busca e biografia — correção concluída

Na busca por `Abraão`, o DOM confirmou `0` marcadores `**`, `0` escapes `\\[` e `0` marcadores numéricos, com 16 cartões visíveis. O cartão de Abraão abriu o painel biográfico; o painel exibiu subtítulo e corpo com Markdown renderizado, sem símbolos crus. O chip `Gênesis 12:1–3` abriu o dossiê de Gênesis.


## Temas bíblicos — inconsistência de rota

A URL `/temas` abriu o conteúdo correto de Temas bíblicos, mas o cabeçalho global exibiu `Você está em Ponto de partida` e a rota ativa correspondente ao overview. O módulo está acessível, porém o estado/label da rota não está sincronizado com o caminho canônico.


## Temas bíblicos — diagnóstico final da inconsistência

O DOM de `/temas` confirmou `window.location.pathname === /temas`, `topbar-context === Temas bíblicos`, mas `signal-launcher` e `signal-route-beacon` ainda exibiam `Ponto de partida`. O alias `/temas` já foi adicionado ao código; a homologação precisa ser reiniciada/recompilada para descartar o módulo antigo antes de decidir se há segunda origem do estado.


## Temas bíblicos — persistência após restart

Após reiniciar o Vite diretamente na porta 3004, o DOM ainda mostrou `signal-launcher = Ponto de partida` e `signal-route-beacon = Ponto de partida` para `/temas`, enquanto o `topbar-context` permaneceu `Temas bíblicos`. O problema não é apenas cache do servidor; é necessário inspecionar o path recebido pelo `useLocation`/`routeContext` ou outra origem do launcher.


## Temas → biblioteca — filtro perdido

O clique em `Aliança` no cartão temático navegou corretamente para `/66-livros`, mas a busca da biblioteca permaneceu vazia e exibiu todos os 66 livros. O callback passava o rótulo para `setSearch`, porém o componente `AdvancedBookLibrary` não recebia nem aplicava esse valor. É necessário preservar o filtro temático na navegação.


## Temas → biblioteca — segunda reprodução

Mesmo com `initialQuery` no componente, o retorno pela ação de Aliança ainda exibiu a busca vazia. A solução será tornar o filtro explícito na URL (`/66-livros?q=Aliança`) e ler esse parâmetro na biblioteca, evitando perda de estado entre a troca de views e o carregamento lazy.


## Temas → biblioteca — causa encontrada

A URL continuou sem `q` porque `setSearch(label)` é assíncrono e `go("library")` leu o valor anterior de `search`. A correção definitiva é aceitar `queryOverride` em `go()` e passá-lo diretamente nos fluxos de Temas e Pessoas.


## Temas → biblioteca — correção validada

O launcher e o beacon agora exibem `Temas bíblicos` e `Próxima: Glossário` em `/temas`. O fluxo de Aliança abriu `/66-livros?q=Aliança`; o campo recebeu `Aliança` e a biblioteca mostrou 6 resultados relacionados: Gênesis, Êxodo, Deuteronômio, Josué, Jeremias e Oseias.


## Biblioteca — filtros combinados

Em `/66-livros?q=Aliança`, o campo permaneceu preenchido e a lista retornou 6 livros. Após aplicar `Antigo Testamento`, os mesmos 6 resultados foram mantidos, confirmando que busca e filtro de testamento combinam corretamente.


## Linha do tempo — seleção de período

A rota `/linha-do-tempo` identifica-se corretamente, mas o clique no botão `02 · Gênesis 12–50 · Patriarcas` não alterou o painel principal: permaneceu `Período selecionado · Gênesis 1–11 / Origens`. Será necessário testar o alvo DOM e corrigir a seleção se o handler não estiver sendo acionado.


## Linha do tempo — livro relacionado incorreto

Após selecionar `Patriarcas`, o painel mudou corretamente para Gênesis 12–50, mas `Abrir livro relacionado` abriu `/livro/9-1-samuel`. O cálculo atual usa `bibleBooks[selected * 8]`, um atalho posicional inadequado. Cada período precisa declarar explicitamente o ID do livro relacionado.


## Linha do tempo — validação do handler

Após a correção dos IDs, o clique assistido no card Patriarcas ainda mostrou Origens imediatamente. O teste seguinte usará o DOM diretamente e aguardará a atualização React para distinguir atraso de renderização de falha real do controle.


## Cânones — ações sem destino

O botão `Estudar formação do cânon` permaneceu em `/canon` e não alterou conteúdo após o clique. Os cartões `Manuscritos` e `Interpretação` também precisam ser testados; o módulo aparenta exibir CTAs sem handlers efetivos.


## Linha do tempo — correção validada

O teste DOM após recompilação confirmou `Patriarcas`, `Gênesis 12–50`, `aria-pressed=true` e destino `/livro/1-g-nesis`. O problema do cálculo posicional que abria 1 Samuel foi corrigido com `relatedBookId` explícito para cada período.


## Apócrifos — estações de leitura

O filtro Católica reduziu corretamente o corpus para 8 e Tobias foi selecionado. Porém, o clique assistido em `02 O que acontece` rolou para o dossiê, mas o conteúdo ainda mostrava `O que você precisa saber primeiro`. Será necessário validar o handler diretamente e, se confirmado, corrigir a troca de estação.


## Apócrifos — estação validada

O teste DOM confirmou `02 O que acontece` com `class=is-active` e conteúdo real de leitura em detalhe para Tobias (`Tob 1–2`, cinco partes). A extração visual anterior permaneceu no texto inicial, mas o estado React e o corpo renderizado estavam corretos.


## Glossário — busca e atalho

O atalho `Aliança` preencheu a busca com `aliança` e reduziu o catálogo para 8 resultados (6 livros e 2 pessoas), mantendo a rota Glossário corretamente identificada.


## Apocalipse — CTA de rota

O módulo abre com 12 unidades, 22 capítulos indexados, 7 cidades e 5 escolas. O CTA `Abrir rota de 12 estações` não produziu mudança visual após o clique assistido; precisa ser validado no DOM e, se necessário, receber uma âncora/scroll explícita para o índice da rota.


## Cânones — CTAs

O teste direto confirmou que `Estudar formação do cânon` abre `/estudos-profundos` e renderiza o catálogo de estudos. A primeira captura assistida manteve a URL `/canon` por atraso/stale do navegador, mas o handler real está funcional.


## Mesa de estudo — abas de referência

A aba `Línguas` abriu 21 verbetes, o filtro `Grego` reduziu corretamente para 12 e exibiu detalhe de Logos com referência SBL. A aba `Traduções` abriu 8 passagens comparadas, tabela, fonte Bible Odyssey e controles de revisão.


## Mesa de estudo — índice dos 66 livros

A aba `66 livros` abriu os 66 registros, os filtros Todos/Antigo/Novo e a busca. A seleção de Gênesis atualizou o detalhe, mostrou 50 capítulos, quatro blocos estruturais e o CTA `Abrir dossiê de Gênesis`.


## Mesa de estudo — focos ampliados

A aba `Versículo a versículo` abriu 39 focos, seletor de livro, quatro camadas de comentário, fonte metodológica, ação de conclusão e CTAs para dossiê. O conteúdo de Gênesis 1:1–5 foi renderizado com conexões Jo 1:1–5, 2Co 4:6 e Ap 21:1–5.


## Cobertura — cartões navegáveis

A auditoria DOM encontrou os cartões dos livros sem `button`/ação no painel de Cobertura. Eles agora são botões semânticos com foco visível, label `Abrir dossiê de …` e callback para a URL profunda do livro; a prop foi propagada pela Mesa e pela home e o typecheck passou.


## Apocalipse — CTAs de entrada

O CTA `Abrir rota de 12 estações` agora produz feedback visível: ativa `Rota completa`, rola até `Escatologia sem atalhos interpretativos` e deixa as 12 unidades disponíveis no viewport. O CTA `Ver rota das sete cidades` foi ligado ao painel cartográfico da Ásia Menor; `Comparar cinco escolas` rola para o painel correspondente.


## Apocalipse — validação DOM dos CTAs

O clique assistido no botão `Ver rota das sete cidades` pareceu não alterar a extração visual imediatamente, mas o acionamento DOM confirmou `activeTab: Sete igrejas`, `churchHeading: Sete cidades, sete diagnósticos`, painel a 112 px do topo e `scrollY: 1187`. O handler funciona; a impressão inicial foi apenas atraso da renderização/extração.


## Cânones e textos — CTAs

Os três CTAs foram validados: formação do cânon abre Estudos profundos; Manuscritos abre Fontes e bibliografia; Interpretação mantém a navegação de estudo. A bibliografia pública mostra 303 referências indexadas, filtros por livro e categoria, domínio legível e links externos clicáveis. O primeiro link acadêmico de Gênesis abriu um destino externo real em `learn.ligonier.org`.

## Revisão — Mesa de estudo

A aba Revisão abre quatro conjuntos de perguntas, mostra feedback de resposta correta, desabilita as opções após a escolha e oferece avanço para a próxima pergunta. A resposta correta do primeiro conjunto exibiu `Boa leitura`, explicação, referência metodológica e botão `Próxima pergunta`.


## Revisão — persistência do marco

O ciclo de perguntas e o resultado `3/3` funcionam, mas a inspeção do `localStorage` mostrou `quizBest.metodo-enciclopedia: 3` com `completed: []`. A conclusão ainda não está sendo persistida como marco; o fluxo precisa usar uma atualização de estado única e ser revalidado após o HMR.


## Estudos profundos — entrada escatológica

O CTA `Abrir estudo escatológico` abre `/apocalipse` e mantém a rota especializada. A rota apresenta 12 estações, 22 capítulos indexados, sete cidades e cinco escolas interpretativas.

## Mesa de estudo — Revisão

O quiz `Método de pesquisa bíblica` foi concluído com `3/3`. Após a correção de estado, o armazenamento local passou a registrar `completed: ["quiz-metodo-enciclopedia"]` e `quizBest.metodo-enciclopedia: 3`; o contador de revisões também foi atualizado. O botão `Refazer com outra atenção` reinicia o quiz sem remover a conclusão anterior.


## Cânones — interpretação

O CTA `Interpretação` foi acionado pelo texto exato no DOM e abriu `/estudos-profundos`; o acionamento anterior por índice havia atingido a camada de navegação assistida, não o CTA, por mudança de índices.

## Revisão — marco concluído

O quiz agora registra `quiz-metodo-enciclopedia` em `completed` no armazenamento local, mantém a melhor pontuação `3` e o botão de refazer reinicia sem retirar o marco.


## História bíblica — estações

A implementação em `BiblicalHistoryHub` usa `history-detail .encyclopedia-guide__nav`; a estação `02 O que acontece` foi acionada com esse seletor e trocou o conteúdo para a narrativa em partes. O teste inicial por texto global atingiu a `EncyclopediaGuide` oculta de Apócrifos, gerando falso negativo. A fonte Pleiades abre externamente e `Ver atlas do Levante` usa o callback global.


## Apócrifos — filtro e dossiê

O filtro `Católica` reduz o catálogo de 10 para 8 corpora. O card visível de Tobias abre o dossiê correto; a estação `02 O que acontece` fica ativa, troca o conteúdo para `Tob 1–2`, mostra a divisão em cinco movimentos e não deixa marcadores Markdown crus no texto.


## Dossiê profundo — índice e referências

O índice interno de Gênesis oferecia `#deep-section-0` a `#deep-section-11`, mas nenhum desses IDs existia no DOM. O renderizador agora atribui IDs aos 12 títulos H2 e preserva o índice original quando o filtro de seções está ativo. A auditoria DOM confirmou 12/12 âncoras sem ausências; clicar em `Profecias` levou o título `9. Profecias, Alusões e Conexões Canônicas` ao topo visível após a rolagem suave.


## Rodada complementar — dossiê e interface

Foi corrigido o índice interno do dossiê, que possuía links para `deep-section-*` sem IDs correspondentes. A validação ampliada confirmou 17/17 rotas com marcadores, sem ErrorBoundary, sem âncoras ausentes e sem Markdown cru no HTML renderizado.

O painel biográfico de Abraão ainda mostrava `**Sarai**` e itálico cru nos subtítulos das pessoas relacionadas. A normalização foi aplicada também a esses campos; o DOM confirmou zero marcadores crus após HMR.

As referências abreviadas do grafo profético de Gênesis agora resolvem pelo campo `short` do catálogo canônico, evitando que `Rm`, `Ap`, `Gl`, `Is` e demais referências caiam em toast sem navegação.


## Apocalipse — sete cidades

A validação DOM percorreu os sete marcadores com `aria-label="Selecionar ..."`. Todos responderam e alteraram o diagnóstico ativo: Éfeso, Esmirna, Pérgamo, Tiatira, Sardes, Filadélfia e Laodiceia, com 7/7 detalhes correspondentes.


## Biblioteca — Cântico dos Cânticos

A busca por `Cântico dos Cânticos` encontrou o livro correto e abriu `/livro/22-c-ntico-dos-nticos`. O dossiê carregou 40/40 seções, 40/40 âncoras válidas e o leitor integral de capítulos mostrou 8/8. A inspeção DOM encontrou zero Markdown cru após o renderer e a normalização biográfica.


## URLs profundas — compatibilidade

A URL canônica `/livro/1-genesis?cap=2` e a URL legada `/livro/1-g-nesis?cap=2` carregaram Gênesis 2, com 13 âncoras e zero âncoras quebradas. O smoke test ampliado foi aprovado em 18/18 rotas, sem ErrorBoundary e sem Markdown cru no HTML renderizado.


## Busca de lugares — validação final

A busca por `Roma` retornou 66 resultados em Todos e 2 em Lugares. O filtro Lugares reduziu corretamente para Babilônia e Roma. O clique em Roma abriu o verbete contextual com quatro referências, livros relacionados, pessoas conectadas e o botão `Destacar no atlas`; esse botão levou ao Atlas, que montou 26 lugares, 11 rotas, 4 impérios e o dossiê cartográfico. O caminho Busca → Lugar → Atlas foi aprovado.


## Fechamento da auditoria interativa

A auditoria foi ampliada com: 18 conexões canônicas dos seis dossiês aprofundados, todas resolvidas; Busca por `Roma` com filtro Lugares e fluxo Roma → verbete → Atlas; CTAs de Cânones para Estudos profundos/Bibliografia; quiz com marco `quiz-metodo-enciclopedia` persistido; História com estação e fonte Pleiades; Apócrifos com filtro Católica e dossiê de Tobias; Glossário → Gênesis; Temas → `/66-livros?q=Aliança` com seis resultados; Linha do tempo Patriarcas → `/livro/1-genesis`; sete cidades de Apocalipse; Mesa, backup, salvar, cobertura e retorno; slugs canônico e legado. O smoke test atualizado foi aprovado em 18/18 rotas, sem ErrorBoundary, âncoras quebradas ou Markdown cru.


## História — verificação do CTA de bibliografia

A inspeção do componente `BiblicalHistoryHub` confirmou que `Abrir bibliografia acadêmica` chama diretamente `go("bibliography")`. O teste visual anterior atingiu outro controle por índice e terminou em Apócrifos; não é uma falha de implementação. O CTA de atlas usa `go("atlas")` e o CTA de bibliografia usa `go("bibliography")` de forma explícita.


## Grafo visual — filtro Proféticas

A auditoria de cliques encontrou uma falha real: `Proféticas` exibia `0 nós / 0 relações` porque a relação `r-babylon-apocalypse` apontava para `apocalipse`, ID ausente no catálogo de entidades. Foi adicionada a entidade profética `Apocalipse` com resumo, referências, fonte e conexões. Após a correção, o filtro mostrou `2 nós / 1 relação`, com Babilônia e Apocalipse, e a linha ficou navegável.


## Grafo visual — filtros completos

Os filtros foram acionados e validados em uso real: `Proféticas` mostra 2 nós e 1 relação (Babilônia → Apocalipse); `Históricas` mostra 4 nós e 2 relações; `Geográficas` mostra 3 nós e 2 relações. `Teológicas` exibe 29 nós e 60 relações porque o componente aplica limite visual de 60 e essa é a categoria mais extensa; o filtro está ativo e as arestas renderizadas são exclusivamente `graph-edge--theological`, não é falha de filtragem.


## Fechamento da rodada de cliques

O painel contextual do grafo foi revisado após a inspeção de Eva/Adão: os resumos compactos de pessoas relacionadas agora passam pela normalização de texto e não exibem marcadores Markdown crus; os botões permanecem acionáveis. A tentativa inicial de `pnpm qa:routes` em 3002 falhou por ausência de servidor, não por falha da aplicação. Reexecutado com `QA_BASE_URL=http://127.0.0.1:3004`, o smoke test aprovou 18/18 rotas, sem ErrorBoundary, âncoras quebradas ou Markdown cru.

O workflow foi ajustado para compilar antes do smoke test, iniciar `vite preview` em 4173, aguardar o servidor e só então executar a matriz de rotas.


## QA visual final — mobile

A captura do Atlas em 390×844 confirmou mapa WebP carregado, título legível, breadcrumb de rota, próxima conexão e barra inferior com cinco destinos sem overflow horizontal. A captura de Gênesis em 390×844 confirmou dossiê integral 66/66, botão Salvar, retorno à biblioteca, hierarquia tipográfica e barra inferior preservada; o índice capítulo a capítulo permanece abaixo do cabeçalho introdutório e é acessível pelo atalho do leitor.


A captura da Busca na rede em 768×1024 confirmou escala intermediária estável, campo de pesquisa, seis sugestões acionáveis, cinco filtros de resultado, CTA de grafo e navegação responsiva sem overflow horizontal. O layout usa cabeçalho compacto e barra inferior adequados ao breakpoint tablet.
