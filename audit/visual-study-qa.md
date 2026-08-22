# QA visual — estudo sobre Igreja

## Preview local

A rota `http://127.0.0.1:4173/biblia-em-visao/igreja` abriu no preview base-aware com o estudo inicial selecionado. O cabeçalho global identificou a área como **Igreja: corpo e ministérios**, e o conteúdo exibiu o título **O que é ser Igreja?**.

## Conteúdo e rastreabilidade observados

A tela apresentou o percurso com **20 estudos disponíveis**, a rota 20 destacada, **10 estações** no percurso, **10 módulos** no leitor e **5 camadas** em cada módulo. O índice exibiu separadamente corpo de Cristo, corpo diaconal, corpo pastoral, corpo evangelístico, dons, autoridade, práticas comunitárias, missão e teólogos.

A lista de fontes apareceu como âncoras acessíveis com rótulos, ícone de link externo e `aria-label` como “Abrir fonte externa: ...”. Não houve Markdown cru visível no leitor; a extração textual do navegador ainda contém o formato `[rótulo](url)` por limitação do extrator, mas a inspeção dos elementos interativos confirmou que os itens são `<a>`.

## Interação observada

Ao clicar no item do módulo diaconal, o navegador rolou até o leitor e o índice permaneceu visível, com o módulo 1 destacado no momento da captura. A interação precisa ser repetida por coordenada/elemento após a próxima revisão para confirmar o texto do módulo 3 e as camadas, pois o clique por índice foi reenumerado durante a rolagem.

## Impressão de layout

Em viewport de aproximadamente 900 px, a barra lateral e o índice do estudo permanecem navegáveis, o cabeçalho e a placa de orientação preservam a hierarquia, e o leitor tem uma coluna de conteúdo suficientemente ampla para textos longos. A própria página é extensa; a rolagem automática para o leitor é esperada e deve ser verificada em mobile.

## Interação confirmada

A segunda tentativa selecionou corretamente o módulo 3: a placa de orientação mudou para **03/10**, o título mudou para **O corpo diaconal: servir à mesa, aos vulneráveis e à verdade**, e o bloco de texto exibiu Atos 6, 1 Timóteo 3, Romanos 16 e 1 Timóteo 5. Em seguida, a camada **O que isso significa** ficou ativa e exibiu o comentário sobre cuidado material, dignidade e prestação de contas. O índice e a trilha de módulos permaneceram estáveis após as duas interações.

## Responsividade

A captura de **390 × 1000 px** mostrou o cabeçalho móvel, o botão de menu, o contexto da rota, o título editorial, o contador de 20 estudos, a entrada em destaque e a barra de navegação inferior sem overflow horizontal evidente. O leitor fica mais abaixo da página, portanto seu índice precisa ser alcançado por rolagem, comportamento coerente com a extensão do estudo.

A captura de **768 × 1000 px** mostrou o layout intermediário com cabeçalho compacto, modo leitura, barra de contexto e grade principal em uma coluna ampla. O percurso ativo e o início da leitura em coordenadas ficaram legíveis; o beacon flutuante não encobriu o título principal, embora continue sendo um elemento sobreposto esperado do sistema de navegação.

## Alias e descoberta

A rota `http://127.0.0.1:4173/biblia-em-visao/eclesiologia` abriu o mesmo estudo, com o contexto global **Igreja: corpo e ministérios**, 10 módulos e as 14 fontes listadas. O destino especializado aparece na área de destaque e o auditor estático confirma suas palavras-chave no launcher. A tentativa de abrir o launcher por índice não exibiu o painel nesta captura; a descoberta estrutural permanece validada pelo DOM e pelo auditor de navegação.

## Launcher global

O atalho de teclado abriu o painel **Navegação assistida**. Ao pesquisar `igreja`, apareceram dois resultados: **Estudos profundos** e o destino específico **Igreja: corpo e ministérios**, com a descrição “Eclesiologia profunda, dons, diaconato, pastorado e missão”. Isso confirma descoberta funcional por busca e preserva uma entrada ampla e outra direta.

## Console

Após abrir o resultado especializado pelo launcher, a rota retornou a `/igreja` e o console do navegador não apresentou mensagens de erro. Isso reduz o risco de falhas silenciosas de React, chunks ou roteamento no estudo novo.

## Verificação pública final

Após o workflow final `32579845857` terminar em `success`, a rota pública `https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/igreja?deploy=4f300c3` carregou o aplicativo e exibiu o estudo 20. O DOM público mostrou 20 estudos na navegação lateral, dez módulos, as cinco camadas e as fontes externas estruturadas, incluindo os URLs substitutos de Bonhoeffer, Moltmann e Volf.

O alias público `https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/eclesiologia?deploy=4f300c3` também carregou o mesmo leitor e o mesmo título. O teste HTTP simples retornou status 404 para as duas rotas profundas, comportamento compatível com o fallback `404.html` de SPA do GitHub Pages; a verificação visual e DOM confirmou que o aplicativo é renderizado e navegável nessas URLs.
