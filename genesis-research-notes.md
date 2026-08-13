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
