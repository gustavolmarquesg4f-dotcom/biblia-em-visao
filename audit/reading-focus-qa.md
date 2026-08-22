# QA visual — modo de leitura focado

**Data:** 22 de agosto de 2026  
**Ambiente:** preview local base-aware, rota `/biblia-em-visao/igreja?ux=focus-v1`.

A primeira renderização com cache-busting confirmou que o modo focado foi aplicado: o hero geral, o card de escatologia, a grade de estudos, o índice externo, a placa de rota e os blocos inferiores não aparecem quando o estudo de Igreja está ativo. O leitor passa a ocupar o centro da página com sua própria introdução, placa de orientação, índice de dez módulos e conteúdo por camadas.

A nova hierarquia melhorou de forma significativa: o título “O que é ser Igreja?” ficou separado do título do módulo, e o título do módulo 1 deixou de dominar a tela. O índice interno permanece compreensível e os botões de camadas seguem visíveis.

Pontos ainda observados na captura: a navegação global à esquerda continua densa por ser compartilhada com todo o projeto; os avisos flutuantes inferiores ainda competem levemente com o texto; e a largura disponível do conteúdo pode ser refinada em telas intermediárias. A próxima verificação deve testar 390 px, 768 px e uma viewport desktop com o modo focado, além de clicar no módulo diaconal e em uma camada.


A segunda captura, em desktop com cache-busting, confirmou a aplicação do modo de leitura focado e o recolhimento automático do trilho global; o controle “Mostrar menu” permanece disponível como saída. A inspeção do DOM identificou dois elementos fixos que ainda atravessam a leitura: `.signal-launcher` (launcher contextual) e `.signal-route-beacon` (baliza de rota). Eles devem ser ocultados ou convertidos em controles discretos apenas durante o foco de Igreja, enquanto a barra superior e o status de publicação permanecem acessíveis.


A terceira tentativa de preview, após os ajustes de overlays e saída, apresentou tela em branco no navegador, embora `pnpm check` e `pnpm build:github` tenham passado e o servidor tenha entregue `index.html` e assets com status 200. O console não mostrou erro. Esta falha de renderização bloqueia qualquer publicação; o bundle precisa ser diagnosticado e o preview deve voltar a renderizar antes de prosseguir.


A verificação do CSS v4 confirmou que os seletores de ocultação entraram no bundle, mas o estilo computado dos overlays continuou em `display:flex/grid`. A causa é estrutural: `.signal-launcher`, `.signal-route-beacon` e `.publication-status` são montados fora do descendente `.app-shell`, então `.app-shell--church-reading .…` não pode alcançá-los. A correção final deve usar uma classe no `body`/documento ou outro seletor global equivalente.


As capturas carregadas com espera confirmaram que em 768 px o modo focado apresenta cabeçalho, placa, título e índice em uma coluna legível, sem sobreposição. Em 390 px, a composição geral está boa e sem overlays, mas os títulos dos botões do índice interno ultrapassam a largura disponível; a causa provável é a largura mínima automática da coluna `1fr` e do elemento `strong`. A correção deve usar `minmax(0,1fr)`, `min-width:0`, `white-space:normal` e `overflow-wrap:anywhere` nos itens do índice.


Após o ajuste de `minmax(0,1fr)`, `min-width:0`, quebra normal e `overflow-wrap`, a captura de 768 px permaneceu aprovada. A captura de 390 px mantém o cartão dentro da tela e os elementos essenciais em ordem; o índice usa a largura disponível e não há overlays fixos cobrindo a leitura. A rota mantém a saída “Todos os estudos” e o menu superior como caminhos de retorno.


Na versão final do preview, a rota abriu sem overlays globais e a seleção do módulo 3 (“O corpo diaconal”) atualizou a placa de orientação, o título, as referências bíblicas e o conteúdo sem perder a hierarquia. O desktop permanece visualmente equilibrado: leitura central, índice interno à esquerda, controles de camadas abaixo do título e retorno “Todos os estudos” acima do leitor.


A camada “O que isso significa” foi acionada no módulo diaconal e atualizou corretamente a placa, o rótulo da camada e o texto, preservando a mesma composição visual. O console do navegador permaneceu sem erros após a navegação do índice e da camada.


A verificação pública após o workflow `32587638519` confirmou que `/igreja` já serve a versão refinada no GitHub Pages. A rota abriu sem overlays globais, manteve “Todos os estudos” e o clique público no módulo 3 carregou “O corpo diaconal” com placa, título e conteúdo atualizados.


No GitHub Pages, o DOM público confirmou `body.reading-focus-active`, shell em `app-shell--church-reading`, título “O que é ser Igreja?” e botão “Todos os estudos”. Os três overlays globais — launcher, baliza de rota e status de publicação — estão com `display:none`, sem remover o menu superior nem os controles internos do estudo.


A versão ampliada no preview carregou com o contador 01/14 e índice completo de quatorze módulos. A seleção do módulo diaconal atualizou o contador para 04/14, o título, a pergunta, as referências e o texto em parágrafos separados, confirmando que a ampliação de conteúdo não quebrou a navegação focada.


A captura ampliada de 390 px manteve o título, a orientação, a placa e o contador 01/14 legíveis; o índice mostra os novos módulos “Israel, promessa e nova humanidade” e demais unidades sem os overlays globais. Em 768 px, o texto introdutório ganhou profundidade sem congestionamento, e o índice de quatorze módulos permanece em uma coluna clara.


A inspeção do leitor ampliado confirmou uma camada com dois parágrafos renderizados, índice com 14 módulos e 26 fontes estruturadas, além de conteúdo que se estende naturalmente para a seção de fontes e material de grupo. A tentativa de acionar o item 14 a partir da posição rolada não alterou o módulo exibido; será repetida com retorno ao topo e alvo explicitamente visível antes do QA final.


A rota reiniciada exibiu o índice completo e a ampliação em parágrafos separados. A tentativa de clicar no item 14 a partir da lista visual fez o navegador rolar para a região inferior, mas o estado textual permaneceu no módulo inicial; a auditoria determinística confirmou a presença dos 14 módulos, e a navegação do módulo 4 já foi validada. O fluxo de seleção deve ser refinado para manter o item escolhido e o conteúdo correspondente claramente visíveis quando o índice ficar longo.


O teste visual do item 14, quando o navegador precisou rolar para alcançar o botão fora do viewport, não alterou o estado exibido. Como os itens 1–4 e a troca de camada funcionaram, será feita uma verificação programática do próprio botão 14 para determinar se o evento do componente está correto ou se a limitação pertence ao mecanismo de interação fora da área visível.


A verificação direta do evento do componente confirmou a navegação completa: o botão 14 atualizou o leitor para “Grandes teólogos e confissões em diálogo”, o contador foi para 14/14, o título de conteúdo correspondeu ao módulo e a camada renderizou dois parágrafos. O console permaneceu limpo. O clique visual anterior não havia disparado porque o item estava fora do viewport; o componente em si está correto após o ajuste de seleção e rolagem.


Na versão compilada final, a orientação passou a declarar quatorze módulos e setenta leituras em camadas. A inspeção DOM confirmou 14 botões de módulo, estado focado no corpo, módulo 14 aberto em 14/14, título correspondente e dois parágrafos na camada ativa.


A rota pública final no GitHub Pages foi verificada no navegador. O estudo exibiu a orientação com 14 módulos e 70 leituras; o acionamento do botão do módulo 14 atualizou o contador para 14/14, o título para “Grandes teólogos e confissões em diálogo”, renderizou dois parágrafos na camada ativa e manteve o modo focado. O status HTTP 404 do caminho profundo corresponde ao fallback SPA 404.html, mas a aplicação pública carregou e funcionou no navegador.
