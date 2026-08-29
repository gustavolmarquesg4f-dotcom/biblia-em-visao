# Bíblia em Visão — modelo editorial e relacional

## Objetivo

Este documento define a linguagem comum para organizar o acervo. A implementação pode continuar usando arquivos TypeScript e JSON durante a transição, mas novos conteúdos devem convergir para este modelo.

## Entidades principais

| Entidade          | Responsabilidade                       | Identificador sugerido                      |
| ----------------- | -------------------------------------- | ------------------------------------------- |
| `book`            | Livro canônico e seu dossiê geral      | `book:genesis`                              |
| `chapter`         | Estudo de um capítulo                  | `chapter:genesis:22`                        |
| `person`          | Pessoa ou personagem coletivo          | `person:abraao`                             |
| `place`           | Lugar, cidade, região ou cenário       | `place:monte-moria`                         |
| `event`           | Acontecimento narrativo ou histórico   | `event:genesis-sacrificio-de-isaque`        |
| `people-group`    | Povo, etnia ou comunidade              | `people-group:filisteus`                    |
| `empire`          | Reino ou império                       | `empire:babilonia`                          |
| `period`          | Período histórico ou literário         | `period:segundo-templo`                     |
| `term`            | Termo bíblico, teológico ou lexical    | `term:alianca`                              |
| `doctrine`        | Doutrina ou tema teológico estruturado | `doctrine:santificacao`                     |
| `apocryphal-work` | Obra apócrifa/deuterocanônica          | `apocryphal-work:enoch-jubilees`            |
| `formation-study` | Estudo fundamental ou jornada          | `formation-study:como-interpretar-a-biblia` |
| `source`          | Fonte rastreável                       | `source:sbl-genesis-2024`                   |

## Campos comuns

Toda entidade editorial deverá caminhar para os seguintes campos:

```ts
type EditorialEntity = {
  id: string;
  kind: string;
  title: string;
  aliases?: string[];
  summary: string;
  content: string;
  references: string[];
  relations: Relation[];
  sources: SourceReference[];
  maturity: "available" | "expanded" | "reviewed" | "complete";
  confessionalLens?: string;
  confidence?: "high" | "medium" | "contextual" | "debated";
  reviewedAt?: string;
  reviewedBy?: string[];
};
```

O modelo é uma direção de convergência. A migração será incremental para que o acervo existente permaneça funcionando. A implementação inicial e seus arquivos modulares estão descritos em [KNOWLEDGE_REGISTRY.md](KNOWLEDGE_REGISTRY.md).

## Relações

Relações não devem ser apenas links. Elas precisam declarar por que dois itens estão conectados.

```ts
type Relation = {
  targetId: string;
  type:
    | "appears-in"
    | "located-at"
    | "participates-in"
    | "belongs-to-period"
    | "related-term"
    | "develops-theme"
    | "canonical-connection"
    | "historical-context"
    | "interpreted-by";
  explanation: string;
  references?: string[];
};
```

Uma relação interpretativa deve ser identificada como interpretação. A existência de palavras semelhantes em dois textos não prova, sozinha, dependência literária, profecia ou cumprimento.

## Estrutura mínima de um livro

1. Identidade e posição no cânon.
2. Nome e significado.
3. Autoria tradicional e debates.
4. Data e período.
5. Destinatários e propósito.
6. Contexto histórico, social, político e religioso.
7. Geografia e cenários.
8. Estrutura literária.
9. Resumo das unidades.
10. Pessoas, povos, lugares e acontecimentos.
11. Termos importantes.
12. Temas teológicos.
13. Conexões canônicas.
14. Perspectiva pentecostal/IDB.
15. Questões interpretativas.
16. Estudos dos capítulos.
17. Bibliografia específica.

## Estrutura mínima de um estudo de capítulo

1. Visão geral.
2. Estrutura do capítulo.
3. O que acontece.
4. Pessoas e grupos envolvidos.
5. Lugares e período.
6. Contexto literário e histórico.
7. Termos importantes.
8. Explicação textual.
9. Questões difíceis.
10. Temas teológicos.
11. Conexões bíblicas.
12. Leitura pentecostal/IDB.
13. Aplicação responsável.
14. Perguntas para reflexão.
15. Fontes.

## Estrutura mínima de uma obra apócrifa/deuterocanônica

1. Nome e variantes.
2. Data e autoria provável.
3. Idioma e transmissão.
4. Contexto histórico.
5. Resumo e estrutura.
6. Temas principais.
7. Relação com o período do Segundo Templo.
8. Recepção judaica e cristã.
9. Situação no cânon católico.
10. Situação nos cânones ortodoxos.
11. Situação na tradição protestante.
12. Contribuições e limites para o estudo cristão.
13. Fontes primárias e bibliografia.

## Classificação das fontes

| Classe                | Uso                                                                        |
| --------------------- | -------------------------------------------------------------------------- |
| Texto bíblico         | Passagem ou edição bíblica efetivamente utilizada.                         |
| Fonte primária        | Manuscrito, inscrição, documento, obra antiga ou testemunho material.      |
| Acadêmica             | Livro, artigo, edição crítica ou pesquisa especializada.                   |
| Institucional         | Museu, universidade, sociedade acadêmica ou acervo oficial.                |
| Confessional          | Declaração de fé, documento denominacional ou obra teológica confessional. |
| Pastoral/introdutória | Material de formação, divulgação ou aplicação.                             |

Cada fonte deve apontar para a obra ou página que sustenta a afirmação. Uma página inicial de editora ou instituição não deve ser tratada como evidência específica.

## Separação de camadas

| Camada        | Pergunta                                              |
| ------------- | ----------------------------------------------------- |
| Texto         | O que a passagem efetivamente diz?                    |
| Contexto      | Em qual ambiente literário e histórico ela está?      |
| Interpretação | Quais sentidos são defendidos e com quais argumentos? |
| Confissão     | Como a tradição pentecostal/IDB recebe o texto?       |
| Aplicação     | Como o ensino pode formar a vida cristã hoje?         |

## Regras de preservação

- Nenhum estudo existente será descartado automaticamente.
- Migrações deverão manter identificadores ou registrar redirecionamentos.
- Conteúdo enriquecido substituirá versões anteriores somente com histórico rastreável.
- Dados repetidos serão consolidados sem eliminar informação exclusiva.
- Alterações editoriais sensíveis deverão ser revisáveis em pull request.
