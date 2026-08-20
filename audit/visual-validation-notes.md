# Validação visual — evidências

- A aplicação carregou no servidor Vite e exibiu a página inicial, a navegação lateral, a Mesa de estudo e a biblioteca dos 66 livros.
- A aba **Cobertura** exibiu no DOM a contagem **1.189/1.189**, o selo `AUDITORIA APROVADA · 1.189/1.189`, `66/66 livros verificados` e `1.189 contextos cartográficos`.
- A biblioteca abriu o dossiê de **Gênesis**; a página mostrou `50 capítulos`, o dossiê integral e o leitor novo com o título **Comentário navegável · cobertura auditada / Capítulo a capítulo, sem lacunas.**
- A inspeção visual foi realizada em viewport desktop do navegador. O catálogo do leitor está montado depois do dossiê e é carregado de `data/chapter-coverage.json`.
- O navegador exibiu uma barra de pré-visualização própria do ambiente no rodapé; ela não pertence ao projeto e não altera a interface da aplicação.


A inspeção do leitor de Gênesis mostrou a ficha `Gênesis 1 · ficha 1/50`, índice canônico com capítulos 01–10 visíveis, badge `FOCO AMPLIADO`, quatro camadas de comentário e o cartão `CONTEXTO CARTOGRÁFICO POR CAPÍTULO` com Éden, região, período, rota patriarcal, nota metodológica e botão `Focar no atlas`. O botão `Próximo` foi acionado no navegador; o controle permaneceu disponível e a estrutura não apresentou erro visual.
