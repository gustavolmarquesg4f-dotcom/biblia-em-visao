# Validação da navegação — rodada 1

A rota direta `/66-livros` carregou a biblioteca real de 66 dossiês, com o cabeçalho `Explorar os 66 livros` e o próximo passo `Roteiro dos 66 livros`. Isso confirma que o erro anterior em que `/66-livros` abria a Mesa de estudo foi corrigido.

Na homologação, a arquitetura ainda exibe o modal de primeira visita sobre a biblioteca. Ele é funcional, mas repete a função do rail, do beacon e do comando rápido; a próxima rodada deve reduzi-lo a uma orientação não bloqueante ou permitir que a rota direta apareça sem sobreposição após a primeira interação.


A ação `Próxima conexão` em `/66-livros` abriu `/roteiro` e o cabeçalho passou a mostrar `Roteiro dos 66 livros`. O índice da Mesa carregou 66 livros e separou a cobertura integral. O texto obsoleto do roteiro foi substituído por uma distinção entre cobertura integral auditada, comentários textuais enriquecidos e focos ampliados, mantendo navegação e linguagem editorial coerentes.


A URL profunda `/livro/1-g-nesis` carregou diretamente o dossiê de Gênesis, com `50 capítulos`, índice de 12 seções e o leitor `Capítulo a capítulo, sem lacunas` presente no DOM. O contexto da trilha permaneceu em `Dossiê · Gênesis`, enquanto a busca rápida tratou a rota como parte de `Explorar os 66 livros`. O botão `Voltar aos 66 livros` está disponível no topo do dossiê.


A rota `/livro/1-g-nesis?cap=2` iniciou no capítulo 2 e mostrou o selo `Comentário textual enriquecido`, os capítulos vizinhos classificados como comentário textual e a ficha `Gênesis 2 · ficha 2/50`. A validação revelou, porém, que a extração do JSON completo em `complete.simple.json` não corresponde à estrutura usada pelo script: o texto-base apareceu como `0 versículos`. A próxima correção deve extrair capítulos do campo estruturado correto, para que o enriquecimento seja realmente baseado nos versículos e não apenas nos metadados.


Após recarregar a página, a busca do navegador encontrou `25 versículos` em Gênesis 2, com os sinais temáticos `família e pertencimento`, `terra, cidade e povo` e `sopro e ação do Espírito`. O falso estado `0 versículos` deixou de existir no catálogo atual; a primeira ocorrência havia sido apenas cache do JSON anterior no navegador.
