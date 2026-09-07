# Fase 5 — qualidade editorial verificável

## Objetivo

A Fase 5 não tenta esconder as lacunas do acervo com um selo genérico de “conteúdo completo”. Ela separa três fatos diferentes:

1. o estudo está publicado e possui as quatro camadas editoriais;
2. o capítulo está conectado a verbetes e diálogos canônicos por referências explícitas;
3. uma pessoa identificada revisou teologicamente o conteúdo.

Somente o terceiro fato permite o estado `reviewed`, mediante `reviewedAt` e `reviewedBy`. Na ausência desses campos, a interface informa com clareza que a revisão humana ainda está pendente.

## Entregas

### Perfil editorial dos 1.189 capítulos

Cada capítulo recebe um perfil com:

- cinco verificações estruturais: quatro camadas, fonte, cartografia, diálogo canônico e conexões explícitas;
- quantidade de conexões e de entidades não canônicas;
- dimensões cobertas ou pendentes: pessoas, cenários, termos e teologia;
- estado editorial e prioridade de revisão;
- assinatura de revisão humana, quando existir.

O perfil viaja no mesmo arquivo modular do livro. A tela não precisa baixar um catálogo editorial global para mostrar o estado do capítulo aberto.

### Diálogos canônicos auditáveis

As referências já publicadas em `Diálogos e referências` passam a gerar relações `canonical-connection` entre o capítulo e os livros citados. Um nome isolado só é aceito quando todo o item corresponde a um livro ou alias canônico; abreviações curtas dentro de frases continuam rejeitadas.

Essas relações têm confiança `contextual` e explicam que uma indicação editorial não prova dependência literária, cumprimento profético ou consenso interpretativo.

### Fila editorial reproduzível

O arquivo `audit/editorial-review-queue.json` reúne:

- capítulos ordenados pela ausência de entidades e dimensões contextuais;
- biografias sem fonte primária específica;
- biografias sem vínculo canônico verificado;
- obras apócrifas/deuterocanônicas que ainda precisam de conexões explícitas.

O comando abaixo impede divergências, perfis ausentes e falsos selos de revisão:

```bash
pnpm knowledge:check
pnpm audit:review-queue
```

O mesmo controle é executado antes da publicação no GitHub Pages.

## Leitura correta das métricas

Cobertura estrutural não equivale a revisão teológica. Uma conexão canônica mostra que o estudo indicou outro livro; ela não substitui verbetes específicos de pessoas, lugares, acontecimentos e termos. Por isso, capítulos com apenas diálogos entre livros continuam na fila prioritária.

O estado inicial da Fase 5 registra zero revisões humanas assinadas. Esse número é intencionalmente honesto: conteúdos existentes continuam preservados e ampliados, mas somente serão promovidos a `reviewed` após conferência editorial identificada.

### Linha de base gerada

| Indicador                                                          |   Resultado |
| ------------------------------------------------------------------ | ----------: |
| Capítulos com perfil editorial                                     | 1.189/1.189 |
| Capítulos com ao menos um diálogo ou entidade explícita            | 1.189/1.189 |
| Relações capítulo–conhecimento                                     |       6.708 |
| Capítulos em prioridade alta por não possuírem entidade específica |         295 |
| Biografias sem fonte primária específica                           |          83 |
| Biografias sem vínculo canônico verificado                         |          84 |
| Obras apócrifas/deuterocanônicas sem conexão canônica explícita    |        9/10 |
| Revisões humanas assinadas                                         |           0 |

Os 295 capítulos prioritários deixaram de ser ilhas canônicas, pois agora apontam para livros já declarados em seus estudos. Eles continuam prioritários porque conexões entre livros não respondem, sozinhas, quem participa, onde acontece e quais termos precisam ser explicados.

## Próximo trabalho editorial

1. revisar primeiro os capítulos sem qualquer entidade específica;
2. completar termos, a dimensão atualmente menos conectada;
3. indicar fontes primárias específicas nas biografias pendentes;
4. consolidar aliases e identidades antes de criar novos verbetes duplicados;
5. ampliar relações apócrifas com distinção entre contexto histórico, recepção confessional e autoridade canônica;
6. registrar responsável e data somente após a revisão efetiva.
