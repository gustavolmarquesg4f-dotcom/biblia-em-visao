# Bíblia em Visão Geral — Direção visual

## Três direções consideradas

### Theme Name: Cartografia de Leituras
Very Brief Intro: Uma plataforma editorial que trata a Bíblia como um território de histórias, gêneros, pessoas e caminhos. Mistura biblioteca histórica, atlas didático e painel de estudo contemporâneo.
Probability: 0.07

### Theme Name: Caderno de Margens
Very Brief Intro: Uma experiência mais íntima e contemplativa, baseada em anotações, marcações e páginas de estudo com ritmo de caderno pessoal. A interface privilegia a leitura lenta e o pensamento em camadas.
Probability: 0.04

### Theme Name: Observatório da Narrativa
Very Brief Intro: Uma leitura mais panorâmica e analítica, com linha do tempo, relações entre temas e visualizações que mostram a progressão da narrativa bíblica. O tom seria mais próximo de um museu digital.
Probability: 0.08

## Abordagem escolhida: Cartografia de Leituras

### Design Movement
Editorial cartográfico contemporâneo, inspirado em atlas históricos, catálogos de museus e publicações de história cultural.

### Core Principles
1. **Orientação antes da sobrecarga:** cada tela responde onde estou, o que estou vendo e como isso se conecta ao todo.
2. **Contexto antes da conclusão:** autoria, período, gênero e público vêm antes de interpretações rápidas.
3. **Textura com função:** papel, linhas de mapa e detalhes de arquivo criam atmosfera sem competir com a leitura.
4. **Assimetria editorial:** blocos de informação se distribuem como uma prancha de atlas, em vez de uma grade centralizada e genérica.

### Color Philosophy
O azul-tinta funciona como campo de concentração e confiança; o marfim de pergaminho torna o conteúdo acolhedor e legível; o vinho sinaliza pontos de atenção, temas e caminhos; o latão antigo sugere descoberta sem parecer luxo artificial. A paleta é quente e histórica, mas deve continuar clara e acessível.

### Layout Paradigm
Uma composição de “mesa de estudo”: barra lateral de orientação, grandes aberturas editoriais, painéis de conteúdo assimétricos, linhas de percurso e seções que alternam leitura e visualização. O conteúdo mais denso permanece em colunas confortáveis, enquanto cronologia e mapas ocupam o espaço horizontal.

### Signature Elements
1. Linhas finas de rota que conectam períodos, temas e livros.
2. Selos de gênero literário com contorno de arquivo.
3. Pequenos marcadores de coordenadas, capítulos e progresso como linguagem de atlas.

### Interaction Philosophy
Interações devem parecer exploração, não gamificação agressiva. Filtros revelam caminhos; cartões se expandem como fichas de catálogo; hover e foco iluminam conexões; progresso é uma trilha discreta, não uma competição.

### Animation
Entradas usam deslocamento curto e opacidade com easing editorial, em até 240ms. Linhas de rota podem ser desenhadas ao entrar na viewport. Cartões elevam levemente no hover, com mudança de sombra e borda, nunca com saltos. Respeitar `prefers-reduced-motion` e manter ações de teclado instantâneas.

### Typography System
Títulos em **DM Serif Display**, com contraste e personalidade de publicação. Texto e controles em **Manrope**, com boa legibilidade em telas. Labels e coordenadas em Manrope semibold, com espaçamento de letras positivo e caixa alta moderada. A hierarquia deve privilegiar títulos curtos, resumos arejados e metadados compactos.

### Brand Essence
Uma mesa de orientação para quem quer compreender a Bíblia livro por livro, contexto por contexto, sem se perder no volume da obra.

Personalidade: **curiosa, cuidadosa, orientadora**.

### Brand Voice
As manchetes são convidativas e precisas; CTAs soam como convites à descoberta; microcopy explica sem infantilizar. Evitar frases religiosas genéricas, promessas absolutas e linguagem de disputa denominacional.

Exemplos:

> Comece pelo mapa. Depois, siga a história.

> Um livro não existe isolado: veja o que veio antes e o que ele abriu caminho para contar.

### Wordmark & Logo
O símbolo é uma combinação geométrica de livro aberto, agulha de bússola e uma rota central. O wordmark deve usar DM Serif Display em composição própria, com “Bíblia” maior e “em visão geral” menor, alinhado como legenda de atlas.

### Signature Brand Color
**Azul Tinta do Atlas — #172A3A**, usado em superfícies de orientação, navegação e títulos de maior autoridade.

## Decisões de implementação

O primeiro lançamento usa o cânon protestante de 66 livros como base de navegação. O modelo de dados mantém `testament`, `category`, `tradition` e `canonicalOrder` separados para permitir uma futura extensão ao cânon católico sem reescrever a interface. A experiência será uma SPA estática, com busca e filtros no cliente, mapas didáticos desenhados em SVG e referências de imagem hospedadas pelo armazenamento do projeto.

## Style Decisions

1. Toda tela principal deve incluir ao menos um sinal cartográfico funcional — rota, coordenada, legenda, marco numerado ou rede de relações — para que o atlas seja sistema, não decoração.
2. O wordmark trata **Bíblia** como título editorial em DM Serif Display e **em visão geral** como legenda espaçada de atlas, sempre acompanhado do símbolo livro–bússola–rota.
3. Busca, filtros e listas serão tratados como índices, legendas ou fichas de arquivo; evitar a aparência de formulários neutros.
4. Superfícies de orientação, investigação e aprofundamento devem alternar escala, pausas e intensidade para a leitura longa não parecer uma parede homogênea de cartões.
