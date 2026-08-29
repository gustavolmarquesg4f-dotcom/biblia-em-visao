# Bíblia em Visão — registro de conhecimento

## Objetivo da Fase 2

O registro de conhecimento transforma os catálogos existentes em uma camada comum de descoberta e navegação. Ele não substitui nem reduz os estudos: funciona como um índice modular que aponta para livros, capítulos, pessoas, povos, lugares, acontecimentos, temas, profecias, termos, doutrinas, obras apócrifas e estudos de formação.

## Identificadores globais

Todo nó recebe um identificador previsível formado por tipo e nome normalizado.

| Conteúdo      | Exemplo                              |
| ------------- | ------------------------------------ |
| Livro         | `book:genesis`                       |
| Capítulo      | `chapter:genesis:22`                 |
| Pessoa        | `person:abraao`                      |
| Lugar         | `place:monte-moria`                  |
| Acontecimento | `event:genesis-sacrificio-de-isaque` |
| Termo         | `term:hesed`                         |
| Doutrina      | `doctrine:santificacao`              |
| Obra apócrifa | `apocryphal-work:enoch-jubilees`     |

Os IDs removem acentos e variações de pontuação, mas nomes, aliases e grafias originais permanecem nos dados. Contribuições repetidas de catálogos diferentes são combinadas no mesmo nó quando a identidade pode ser estabelecida com segurança.

## Relações tipadas

As conexões declaram direção, tipo, explicação, referências, catálogo de origem e grau de confiança. Exemplos:

- livro `contains` capítulo;
- pessoa `appears-in` livro;
- pessoa `participates-in` acontecimento;
- livro `develops-theme` tema;
- livro `canonical-connection` outro livro.

Uma conexão interpretativa ou canônica pode ser classificada como contextual ou debatida. O registro não converte proximidade verbal em fato histórico ou cumprimento profético automático.

## Arquivos modulares

O manifesto está em `client/public/data/knowledge/manifest.json`. Cada tipo possui um arquivo independente no mesmo diretório. `relations.json` funciona como índice e aponta para blocos de no máximo 700 relações em `knowledge/relations/`. Essa divisão permite que a interface carregue apenas a área solicitada em vez de baixar o acervo completo.

O registro é regenerado e validado com:

```bash
corepack pnpm@10.4.1 repair:biography-links
corepack pnpm@10.4.1 knowledge:check
```

## Segurança dos vínculos biográficos

O catálogo legado associava livros por busca de abreviações dentro de texto corrido. Isso confundia palavras comuns como “os” e “na” com Oseias (`Os`) e Naum (`Na`).

A Fase 2 aceita uma associação somente quando o nome completo ou a abreviação canônica inicia um segmento de referência e vem seguido de número de capítulo. A sobreposição `biography-book-links.json` guarda o resultado verificado em `books` e preserva integralmente o resultado anterior em `rawBooks`. O catálogo biográfico original não é reescrito; a aplicação combina os dois arquivos durante o carregamento. Biografias sem referências estruturadas continuam publicadas e não recebem relações inventadas.

## Garantias automatizadas

O arquivo `audit/knowledge-registry-validation.json` confirma:

- 66 nós de livros e 1.189 nós de capítulos;
- preservação das 119 biografias;
- preservação dos vínculos biográficos legados em `rawBooks`;
- ausência de IDs malformados;
- ausência de relações apontando para nós inexistentes;
- ausência de associações biográficas acima do limiar de colisão.

Esta entrega cria a fundação de dados da Fase 2. A conexão dessa camada com as telas e a busca pode ser feita incrementalmente, sem interromper as rotas atuais.
