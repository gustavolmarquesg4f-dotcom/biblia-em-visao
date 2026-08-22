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
