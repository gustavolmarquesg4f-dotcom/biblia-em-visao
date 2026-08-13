# Testes da rede de conhecimento

## Busca avançada

Na prévia de desenvolvimento, a entrada “Busca avançada” apareceu na navegação lateral. A busca por “Abraão” retornou sete resultados indexados: Abraão, Sara, Ur, Harã, Hebrom, Egito e a relação profética “aliança e promessa”. Os resultados mostram tipo de entidade, livros relacionados, resumo e referências bíblicas.

## Próximos testes

- Abrir o painel completo de Abraão.
- Abrir um lugar, como Ur, e confirmar o botão “Destacar no atlas”.
- Verificar a abertura do atlas com foco geográfico externo.
- Confirmar busca por uma relação profética e navegação entre entidades relacionadas.

## Resultado observado

A busca por Abraão foi validada com sete resultados e uma relação profética. O primeiro clique por índice visual não abriu o painel; a ativação direta do cartão foi usada como teste alternativo. Após a correção de roteamento global, é necessário recarregar a prévia para confirmar o painel e o foco geográfico no bundle final.

Após reinício e recarga com `?entities=v2`, a Busca avançada aparece na Home, abre a tela “Busca e conexões” e apresenta 96 resultados indexados sem erro de carregamento.

A busca por “Ur” retorna 41 resultados e mostra pessoas, lugares, livros e cinco relações/profecias, incluindo “origem e ruptura”, “cidade e exílio”, “missão e império” e “Adão e Cristo”.

O clique em um resultado geográfico levou ao atlas, que carregou o mapa real, marcadores, rotas e camadas. A inspeção mostrou que o dossiê visível ainda estava em Jerusalém; o fluxo correto precisa abrir primeiro o painel de Ur e só então acionar “Destacar no atlas” para validar o foco específico sem ambiguidade.

Após a correção de normalização dos IDs e recarga em `?entities=v4`, a Home abriu normalmente e a Busca avançada foi acessada novamente para repetir o teste de Ur com o bundle atualizado.

O resultado de Ur agora abre corretamente um painel “Lugar · Ur” com quatro referências, biografia, livros relacionados, Abraão e Harã, além do botão explícito “Destacar no atlas”.

O teste integrado confirmou que o painel permanece aberto após a busca; o clique no botão explícito de destaque será usado como passo final para confirmar a troca de vista e o local selecionado.

O catálogo cartográfico foi ampliado com Éden, Ur, Harã, Canaã, Hebrom e Egito, todos com coordenadas didáticas, período, dossiê, resumo e referências. A prévia v5 foi reiniciada e a Busca avançada voltou a retornar Ur.

Validação concluída: o clique em “Destacar no atlas” abriu o atlas com 19 lugares, exibiu Ur na lista ativa, centralizou a câmera na Mesopotâmia e mostrou o dossiê geográfico de Ur com coordenadas e fontes metodológicas.
