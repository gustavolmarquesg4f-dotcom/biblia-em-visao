# Bíblia em Visão — Fase 3: experiência conectada

## Objetivo

A Fase 3 transforma o registro de conhecimento da Fase 2 em uma experiência real de estudo. Os 3.128 nós e as 3.640 relações deixam de funcionar apenas como arquivos de infraestrutura e passam a alimentar a busca, os verbetes e a navegação contextual dos 66 dossiês.

O princípio continua sendo o mesmo: **conectar e aprofundar sem substituir os estudos publicados**.

## Entregas

### 1. Carregador modular no cliente

O arquivo client/src/lib/knowledge-registry.ts é a porta de entrada do registro.

- Lê o manifesto antes de escolher os módulos necessários.
- Mantém cache por tipo de nó e por bloco de relações.
- Carrega relações apenas quando uma experiência conectada é aberta.
- Resolve um ID global para seu nó e sua vizinhança.
- Expõe busca normalizada para português, inclusive sem acentos.
- Ordena resultados por correspondência exata, alias, nome, resumo, referências e metadados.

Uma falha na camada relacional não remove o dossiê nem os capítulos: a interface informa a indisponibilidade e preserva a leitura principal.

### 2. Busca global baseada no registro

A rota /busca consulta o registro completo, em vez do pequeno grafo manual anterior.

Filtros publicados:

- pessoas e povos;
- lugares;
- livros;
- capítulos;
- acontecimentos;
- temas, termos, doutrinas e profecias;
- obras apócrifas/deuterocanônicas.

Cada resultado mostra tipo editorial, nível de maturidade, resumo e referências. Livros abrem o dossiê integral; os demais resultados abrem um verbete contextual.

### 3. Verbete canônico

IDs como person:abraao, place:jerusalem, term:hesed e apocryphal-work:enoch-jubilees abrem o mesmo painel.

O painel apresenta:

- identidade, aliases e nível de maturidade;
- resumo integral, inclusive conteúdo em Markdown;
- metadados próprios do tipo;
- referências;
- livros relacionados;
- relações com explicação e grau de confiança;
- origem do catálogo e ID global;
- ação de atlas quando o lugar também existe na cartografia publicada.

Os painéis biográficos e os links legados continuam funcionando durante a migração.

### 4. Navegação contextual dentro dos 66 livros

Todo dossiê recebe a seção **“Este livro não está sozinho”**, construída a partir das relações da Fase 2.

Ela organiza as conexões em quatro perguntas:

1. Quem participa desta história?
2. Onde acontece e o que muda?
3. Que ideias atravessam o livro?
4. Que outro livro continua a conversa?

Os botões abrem pessoas, povos, lugares, acontecimentos, temas, termos, doutrinas, profecias e outros livros sem criar dados novos ou inferir relações ausentes.

## Desempenho

- A tela inicial não baixa o registro.
- A busca, carregada de forma adiada, baixa os módulos de nós somente quando aberta.
- As relações permanecem divididas nos blocos definidos na Fase 2 e são memorizadas depois do primeiro uso.
- Um dossiê carrega somente os nós ligados ao livro; capítulos são contabilizados sem duplicar o leitor de capítulos.
- A busca usa processamento adiado para não bloquear a digitação enquanto classifica os resultados.

## Garantias editoriais

- Nenhum estudo, biografia, capítulo ou dossiê foi removido.
- A interface não cria vínculos quando o registro não possui uma relação explícita.
- Relações contextuais e debatidas são identificadas.
- O catálogo de origem permanece visível no verbete.
- O atlas aceita IDs canônicos e mantém compatibilidade com os IDs anteriores.
- A falha de um módulo relacional degrada apenas o recurso complementar.

## Testes e critérios de conclusão

O teste client/src/lib/knowledge-registry.test.ts verifica:

- normalização de acentos e pontuação;
- prioridade de correspondência exata;
- busca por aliases;
- filtro por tipo;
- cache de módulos.

Validação da entrega:

    corepack pnpm@10.4.1 check
    corepack pnpm@10.4.1 test
    corepack pnpm@10.4.1 knowledge:check
    corepack pnpm@10.4.1 inventory:check
    corepack pnpm@10.4.1 build

## Limites desta fase

A Fase 3 conecta o acervo existente. Ela não converte automaticamente todos os textos em conteúdo editorial revisado, não inventa relações ausentes e não substitui a revisão teológica e bibliográfica humana.
