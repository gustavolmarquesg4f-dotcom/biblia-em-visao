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

Consulte o [inventário completo](docs/CONTENT_INVENTORY.md), a [visão do produto](docs/PRODUCT_VISION.md), o [modelo editorial e relacional](docs/CONTENT_MODEL.md), o [registro de conhecimento da Fase 2](docs/KNOWLEDGE_REGISTRY.md), a [experiência conectada da Fase 3](docs/PHASE_3_CONNECTED_EXPERIENCE.md) e o [guia contextual de capítulos da Fase 4](docs/PHASE_4_CHAPTER_CONTEXT.md).

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
corepack pnpm@10.4.1 test
corepack pnpm@10.4.1 inventory:content
corepack pnpm@10.4.1 knowledge:check
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

## Registro de conhecimento

O comando `knowledge:check` gera a camada modular em `client/public/data/knowledge/` e valida IDs, relações e garantias de preservação. Antes de regenerá-la, `repair:biography-links` cria uma sobreposição auditável usando somente referências explícitas, preservando os dados anteriores em `rawBooks` sem reescrever os dossiês biográficos.

Na interface, a rota `/busca` pesquisa os 3.128 verbetes do registro. Cada dossiê de livro apresenta pessoas, povos, cenários, acontecimentos, temas, termos, profecias e conexões canônicas relacionados. O leitor de capítulos acrescenta um guia contextual baseado em 3.132 referências explícitas, cobrindo 894 capítulos sem atribuir relações aos demais por inferência. Os módulos e arquivos por livro são carregados sob demanda e mantidos em cache.

## Estado da evolução

A Fase 1 formalizou a visão do produto, o modelo de conteúdo e a linha de base do acervo. A Fase 2 criou identificadores globais, relações tipadas, arquivos modulares e validação automática. A Fase 3 ligou esse registro à busca, aos verbetes e aos 66 dossiês. A Fase 4 leva a rede aos estudos de capítulo, separando vínculos explícitos de lacunas que ainda exigem revisão editorial.
