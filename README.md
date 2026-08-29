# Bíblia em Visão

**Bíblia em Visão** é uma enciclopédia bíblica e teológica interativa para compreender não apenas o texto, mas também livros, pessoas, lugares, acontecimentos, termos, doutrinas, contextos históricos, obras apócrifas/deuterocanônicas e suas conexões.

> O objetivo é ajudar o cristão a enxergar o que está por trás, ao redor e adiante do texto bíblico.

## Acervo atual

- 66 livros canônicos com dossiês avançados e profundos.
- Estudos publicados para os 1.189 capítulos.
- 119 biografias.
- Catálogos relacionais de pessoas, lugares, acontecimentos, temas e profecias.
- Glossários introdutório e avançado.
- Estudos teológicos e trilhas de formação cristã.
- Área de apócrifos/deuterocanônicos com lentes católica, ortodoxa, protestante e do Segundo Templo.
- Atlas, história bíblica e núcleo dedicado ao Apocalipse.

Consulte o [inventário completo](docs/CONTENT_INVENTORY.md), a [visão do produto](docs/PRODUCT_VISION.md) e o [modelo editorial e relacional](docs/CONTENT_MODEL.md).

## Princípios

- Preservar e aprofundar os estudos existentes.
- Distinguir texto, contexto, interpretação, confissão e aplicação.
- Identificar a perspectiva pentecostal/IDB sem tratá-la como consenso universal.
- Apresentar divergências e graus de certeza com clareza.
- Usar fontes específicas e rastreáveis.
- Transformar o acervo em uma rede navegável de conhecimento bíblico.

## Desenvolvimento

Requisitos:

- Node.js compatível com Vite 7.
- pnpm 10.4.1, conforme o campo `packageManager`.

```bash
corepack pnpm@10.4.1 install --frozen-lockfile
corepack pnpm@10.4.1 dev
```

Verificações principais:

```bash
corepack pnpm@10.4.1 check
corepack pnpm@10.4.1 inventory:content
corepack pnpm@10.4.1 build:github
```

## Inventário reproduzível

O comando `inventory:content` lê os catálogos atuais e atualiza:

- `audit/content-inventory.json`, para consumo por ferramentas;
- `docs/CONTENT_INVENTORY.md`, para acompanhamento editorial e de produto.

O inventário não modifica nem remove o conteúdo bíblico.

## Publicação

- [Aplicação publicada](https://gustavolmarquesg4f-dotcom.github.io/biblia-em-visao/)
- [Repositório](https://github.com/gustavolmarquesg4f-dotcom/biblia-em-visao)

## Estado da evolução

A Fase 1 formaliza a visão do produto, o modelo de conteúdo e a linha de base do acervo. As próximas fases devem consolidar identificadores, conectar entidades, dividir os grandes catálogos por livro e aprofundar progressivamente a revisão editorial.
