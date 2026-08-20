# Validação visual — evidências

- A aplicação carregou no servidor Vite e exibiu a página inicial, a navegação lateral, a Mesa de estudo e a biblioteca dos 66 livros.
- A aba **Cobertura** exibiu no DOM a contagem **1.189/1.189**, o selo `AUDITORIA APROVADA · 1.189/1.189`, `66/66 livros verificados` e `1.189 contextos cartográficos`.
- A biblioteca abriu o dossiê de **Gênesis**; a página mostrou `50 capítulos`, o dossiê integral e o leitor novo com o título **Comentário navegável · cobertura auditada / Capítulo a capítulo, sem lacunas.**
- A inspeção visual foi realizada em viewport desktop do navegador. O catálogo do leitor está montado depois do dossiê e é carregado de `data/chapter-coverage.json`.
- O navegador exibiu uma barra de pré-visualização própria do ambiente no rodapé; ela não pertence ao projeto e não altera a interface da aplicação.


A inspeção do leitor de Gênesis mostrou a ficha `Gênesis 1 · ficha 1/50`, índice canônico com capítulos 01–10 visíveis, badge `FOCO AMPLIADO`, quatro camadas de comentário e o cartão `CONTEXTO CARTOGRÁFICO POR CAPÍTULO` com Éden, região, período, rota patriarcal, nota metodológica e botão `Focar no atlas`. O botão `Próximo` foi acionado no navegador; o controle permaneceu disponível e a estrutura não apresentou erro visual.


## Revalidação após correções

Em 20 de agosto de 2026, a aplicação revisada exibiu no cabeçalho `EDIÇÃO AVANÇADA · 66 dossiês · 1.189 capítulos · atlas temporal`. A aba Cobertura mostrou `1.189/1.189`, `66/66 livros verificados`, `39 focos ampliados · 12 livros`, `1.189 contextos cartográficos` e `AUDITORIA APROVADA · 1.189/1.189`. A aba Versículo a versículo passou a se identificar como `Focos ampliados revisáveis`, exibindo `39 focos ampliados`, `12 livros com foco ampliado` e `54 livros com cobertura integral`, sem a antiga mensagem de expansão do índice de capítulos. A validação foi feita no viewport desktop do navegador; a auditoria móvel/tablet permanece explicitamente aberta no checklist.


A URL pública do GitHub Pages (`https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/`) foi aberta após a sincronização e carregou o cabeçalho `66 dossiês · 1.189 capítulos`. O conteúdo público exibiu `1.189/1.189 capítulos auditados`, `66/66 livros verificados`, `39 focos ampliados · 12 livros`, `1.189 contextos cartográficos`, `1.189 fichas de capítulo` e `1.189 contextos cartográficos`, confirmando que a publicação não ficou restrita ao servidor local.
