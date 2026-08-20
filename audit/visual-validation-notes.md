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


## QA móvel — viewport 390×844

A captura de `/livro/1-g-nesis?cap=2` mostrou uma composição sem rolagem horizontal visível, header compacto, breadcrumb de leitura, botão `Voltar aos 66 livros`, salvar, barra inferior com `Início`, `Livros`, `Mesa`, `Lugares` e `Buscar`, além da marca de `1.189 capítulos`. A hierarquia do dossiê permaneceu legível em tela estreita.

O leitor capítulo a capítulo apareceu em estado de carregamento na primeira captura headless, indicando que a tela inicial móvel deve ser verificada após a carga assíncrona; não houve overflow nem corte dos controles. A barra inferior cobre a largura corretamente e mantém cinco destinos principais.


A segunda captura headless em 390×844 aguardou 8 segundos e confirmou o estado carregado do dossiê, com cabeçalho, estatísticas, barra inferior e largura sem overflow. O leitor capítulo a capítulo fica abaixo do bloco introdutório longo; a navegação oferece acesso por índice/âncora e a validação desktop confirmou o conteúdo do leitor. A captura móvel não deve ser interpretada como falha de carregamento, mas como evidência de que o topo ocupa mais de um viewport em telas pequenas.


## QA tablet — viewport 768×1024

A captura em 768×1024 confirmou a transição para header compacto, modo leitura, breadcrumb, salvar e composição sem corte horizontal. O dossiê e a grade de estatísticas usam a largura disponível de forma legível. A ação `Ir direto ao índice de capítulos` foi adicionada ao cabeçalho do leitor para reduzir o percurso até a cobertura integral quando o dossiê antecede o módulo capítulo a capítulo.


## Publicação final — gh-pages

Após o push de `main` e `gh-pages`, a URL pública `https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/` carregou a versão final. O DOM público confirmou `AUDITORIA APROVADA · 1.189/1.189`, `66/66 livros verificados`, `39 focos ampliados · 12 livros`, `1.189 contextos cartográficos` e a navegação com `Explorar os 66 livros`, `Mesa de estudo`, `Apócrifos e textos`, `Glossário` e `Fontes e bibliografia`.


Após o deploy `b4c6fc1` em `gh-pages`, a abertura pública com `?v=be5a979` confirmou a troca do shell antigo. O DOM público passou a mostrar `1.189/1.189 capítulos auditados`, `1.150 comentários textuais`, `39 focos ampliados` e o texto `Cobertura canônica + comentário textual enriquecido + foco ampliado`; a expressão obsoleta `comentário sintético` não aparece mais na publicação atual.
