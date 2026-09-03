# Bíblia em Visão — Fase 4: guia contextual dos capítulos

## Objetivo

A Fase 4 transforma o comentário dos 1.189 capítulos em uma porta de entrada para o restante da enciclopédia. O leitor continua mostrando as quatro camadas já publicadas — texto, contexto, interpretação e leitura pentecostal/IDB — e passa a responder, com verbetes clicáveis:

- quem participa ou é mencionado;
- onde a narrativa acontece e quais acontecimentos estão em jogo;
- quais termos precisam ser entendidos;
- quais temas, doutrinas, profecias e diálogos históricos atravessam o capítulo.

O princípio editorial é **conectar somente o que o acervo já sustenta por referência explícita**. Uma lacuna visível é preferível a um vínculo provável apresentado como fato.

## Extração auditável

O gerador reconhece nomes e abreviações dos 66 livros, referências compostas e intervalos de capítulos.

Exemplos:

- `Gn 12:1–3; 15:1–6; 17:1` liga o verbete a Gênesis 12, 15 e 17;
- `Gn 1:1–2:3` liga Gênesis 1 e 2;
- `1Co 12–14` liga 1 Coríntios 12, 13 e 14;
- `Jo 13:1–17` liga somente João 13, sem transformar os versículos 1 e 17 em capítulos.

A extração não usa semelhança de palavras, geração de texto nem inferência automática. Cada nova relação preserva a referência original, o catálogo de origem e o grau de confiança.

## Resultado desta fase

| Indicador                                   |    Resultado |
| ------------------------------------------- | -----------: |
| Nós preservados                             |        3.128 |
| Relações totais                             |        6.772 |
| Novas relações capítulo-entidade            |        3.132 |
| Capítulos com ao menos um vínculo explícito | 894 de 1.189 |
| Verbetes ligados a capítulos                |        1.266 |
| Arquivos contextuais por livro              |           66 |

Distribuição dos vínculos explícitos:

| Tipo de verbete                  | Relações |
| -------------------------------- | -------: |
| Pessoas                          |      833 |
| Povos e grupos                   |      168 |
| Lugares                          |      632 |
| Acontecimentos                   |      337 |
| Temas                            |      539 |
| Profecias                        |      505 |
| Termos                           |       63 |
| Doutrinas                        |       54 |
| Obras apócrifas/deuterocanônicas |        1 |

## Experiência no leitor

Cada capítulo com conexões recebe um guia organizado em quatro perguntas:

1. Pessoas e povos — quem participa ou é mencionado?
2. Cenários e acontecimentos — onde acontece e o que está em jogo?
3. Termos para entender — que palavra ou conceito merece atenção?
4. Teologia e conexões — que tema, doutrina ou diálogo atravessa o capítulo?

Cada cartão abre o verbete canônico da Fase 3, onde o usuário pode conferir resumo, referências, origem, relações e confiança. Listas extensas começam compactas e podem ser expandidas.

Quando não há relação explícita, a interface não fica vazia nem sugere que o estudo inexiste. Ela informa que a revisão relacional específica ainda está pendente e preserva o comentário, o contexto cartográfico e as fontes já publicados.

## Desempenho e degradação segura

As conexões são divididas por livro em `client/public/data/knowledge/chapter-connections/`. O conjunto possui cerca de 2,7 MB, mas o navegador carrega somente o arquivo do livro aberto; o maior arquivo atual tem cerca de 132 KB.

O carregador mantém cache por livro. Se o arquivo contextual falhar, apenas o guia mostra indisponibilidade: o dossiê, as quatro camadas do capítulo, o atlas e as fontes continuam funcionando.

## Garantias e testes

Os testes verificam:

- herança do livro em referências separadas por ponto e vírgula;
- distinção entre intervalo de capítulos e intervalo de versículos;
- prevenção de colisão entre João e 1 João;
- carregamento do arquivo pequeno do livro sem consultar o índice global de relações;
- reutilização do cache.

Validação da entrega:

```bash
corepack pnpm@10.4.1 check
corepack pnpm@10.4.1 test
corepack pnpm@10.4.1 knowledge:check
corepack pnpm@10.4.1 inventory:check
corepack pnpm@10.4.1 build
```

## Limites editoriais assumidos

295 capítulos ainda não possuem uma entidade relacionada por referência explícita. Eles continuam integralmente acessíveis e agora formam uma fila editorial objetiva. O fato de um capítulo ter poucos vínculos também não significa que possua pouca profundidade; significa apenas que o catálogo relacional ainda não registrou todas as pessoas, lugares, termos e temas necessários.

A relação com obras apócrifas/deuterocanônicas permanece especialmente conservadora. Nesta fase, somente uma conexão canônica explícita foi encontrada. Ampliações futuras devem manter visível a diferença entre uso histórico/literário, recepção confessional e autoridade canônica.
