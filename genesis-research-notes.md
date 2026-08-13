# Pesquisa-base para o dossiê relacional de Gênesis

## Fontes consultadas

- [Bible Odyssey — Society of Biblical Literature](https://www.bibleodyssey.org/): portal institucional com categorias de figuras bíblicas, lugares, história e métodos de interpretação.
- [Bible Project — Book of Genesis](https://bibleproject.com/guides/book-of-genesis/): recurso visual de orientação, usado apenas como apoio estrutural, não como fonte acadêmica final.
- [TheTorah.com — The Table of Nations](https://www.thetorah.com/article/the-table-of-nations-the-geography-of-the-world-in-genesis-10): discussão sobre a geografia imaginada em Gênesis 10.
- [HTS — Constructing imaginative geographies in Genesis](https://hts.org.za/index.php/hts/article/view/6969/20407): artigo acadêmico sobre geografia imaginativa, ideologia e construção espacial em Gênesis.
- [Andrews University Digital Commons — Literary Structure of the Genesis Creation Story](https://digitalcommons.andrews.edu/dissertations/38/): estudo sobre estrutura literária de Gênesis 1.

## Achados metodológicos

Gênesis precisa ser apresentado em duas grandes unidades narrativas: Gênesis 1–11, com a chamada história primeva, e Gênesis 12–50, com as narrativas ancestrais de Abraão, Isaque, Jacó e José. Essa divisão deve ser uma porta de entrada, não um resumo suficiente.

O dossiê deve distinguir entre a personagem como figura narrada pelo texto e a possibilidade de reconstruir uma pessoa histórica fora do texto. O mesmo vale para os lugares: Éden, Babel e a tabela das nações funcionam como geografia teológica e imaginativa, enquanto Ur, Harã, Canaã e Egito também participam de debates de geografia histórica.

O padrão relacional exigido pelo usuário será: cada entidade terá um verbete próprio, referências a capítulos, função narrativa, relações, continuidade canônica, localização no mapa, posição nas interpretações e fontes. Assim, “Adão” não será apenas uma definição: será ligado a Eva, queda, morte, imagem de Deus, genealogias, Paulo, Cristo e escatologia.

## Validação da primeira integração

Na prévia, a home exibe o selo de edição avançada e a biblioteca abre os 66 dossiês. O próximo clique em Gênesis deve deixar de abrir somente o dossiê analítico padrão e passar a abrir a interface relacional, com abas para visão integral, pessoas, eventos, mapa, profecias, continuidade e fontes.

O teste de navegação chegou corretamente à biblioteca após o reinício do servidor. Como a lista contém dezenas de botões e os índices visíveis mudam conforme a captura, a abertura de Gênesis será verificada pelo texto do botão, não por posição numérica.

Após uma recarga com parâmetro de versão, a abertura por texto confirmou o novo dossiê: “Gênesis em rede”, 15 pessoas e povos, 10 lugares, 9 arcos, 9 portas de investigação, profecias, continuidade canônica e fontes. A tela antiga estava sendo servida por cache do navegador, não por falha da condição no código.

O teste da aba “Mapa de Gênesis” mostrou os 10 lugares e a seleção de Éden com status “simbólico”. O teste de “Pessoas e povos” mostrou os 15 verbetes; Adão abriu com narrativa própria, referências em Gênesis, Romanos e 1 Coríntios, tags e localização textual.

## Estado real da cobertura

Os 66 livros já possuem perfis de estrutura, lente, pergunta e conexões em `book-deep.ts`. O modelo de dossiê completo com pessoas, lugares, camadas e fontes está preenchido para seis livros. A arquitetura relacional de Gênesis é, portanto, o primeiro modelo completo; os outros livros precisam receber entidades próprias para atingir o mesmo nível, e não apenas herdar uma ficha genérica.

## Pesquisa de profundidade — critérios para a reescrita

O guia do BibleProject confirma uma leitura estrutural útil: Gênesis 1–11 funciona como história primeva e Gênesis 12–50 como narrativa ancestral, conectadas pela chamada de Abraão em Gênesis 12:1–3. Esse esquema será usado apenas como mapa de navegação; cada unidade deverá receber desenvolvimento exegético próprio, não uma frase-resumo.

O estudo de Bill T. Arnold sobre a composição de Gênesis apresenta o debate entre análise de fontes, crítica literária e leitura da forma final. A antiga formulação JEDP não será tratada como consenso simples: o dossiê apresentará a hipótese documental, modelos suplementares/redacionais e leituras canônicas, explicando evidências, limites e divergências. [1]

O estudo de John Day sobre Gênesis 10 mostra que a “Tabela das Nações” é uma construção geográfica e teológica que organiza povos e lugares conhecidos pelos antigos israelitas, com possíveis camadas compostas e nomes cuja identificação moderna permanece discutida. O mapa deverá mostrar grau de confiança e não converter cada nome em coordenada moderna certa. [2]

### Padrão mínimo de conteúdo

Cada arco narrativo precisa conter pelo menos quatro parágrafos: reconstrução do episódio, leitura literária e vocabular, contexto histórico/cultural e implicações teológicas com recepção cristã e pentecostal. Cada entidade principal precisa conter biografia narrativa, relações familiares e políticas, transformação ao longo do livro, referências, debates históricos e continuidade canônica. Cada lugar precisa conter descrição textual, identificação histórica quando possível, grau de certeza, função narrativa e conexão cartográfica.

### Referências

[1]: https://bibleinterp.arizona.edu/articles/genesis — Bill T. Arnold, “Reflections on the Composition of Genesis”, Bible Interp / University of Arizona.
[2]: https://www.thetorah.com/article/the-table-of-nations-the-geography-of-the-world-in-genesis-10 — John Day, “The Table of Nations: The Geography of the World in Genesis 10”, TheTorah.com.
