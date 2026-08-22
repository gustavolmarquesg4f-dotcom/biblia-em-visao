# Validação da expansão do estudo “O que é ser Igreja?”

## Escopo

A versão ampliada transforma o percurso em uma formação de **14 módulos** e **70 leituras em camadas**: texto, contexto e cenário, significado, debates e limites, e leitura pentecostal/IDB. Cada camada foi escrita em pelo menos dois parágrafos para que o leitor possa avançar de observação para interpretação, comparação e aplicação responsável.

A arquitetura preserva uma distinção importante: **dom, vocação, ofício e cargo administrativo não são sinônimos**. O conteúdo também distingue descrição bíblica, interpretação teológica e aplicação contemporânea. Modelos católicos, reformados, wesleyanos, batistas, ecumênicos e pentecostais são apresentados como leituras situadas, não como se houvesse um único organograma universal da Igreja.

## Cobertura temática

| Núcleo | Módulos | Ênfase |
|---|---:|---|
| Identidade bíblica | 1–3 | Assembleia, povo de Deus, Israel, nova humanidade e corpo de Cristo |
| Ministérios e equipagem | 4–8 | Diaconia, pastoreio, evangelização, anciãos, mestres, dons e vocações |
| Governo e práticas | 9–10 | Autoridade, disciplina, prestação de contas, batismo, mesa, oração e comunhão |
| Missão e cuidado | 11–13 | Cidade, justiça, vulneráveis, santidade, saúde e reforma eclesial |
| História e diálogo | 14 | Agostinho, Calvino, Wesley, Bonhoeffer, Congar, Moltmann, Volf e documentos confessionais |

## Fontes e rastreabilidade

O estudo reúne **26 fontes estruturadas em HTTPS**, incluindo textos bíblicos, documentos do Vaticano II, documentos de Lausanne, fontes institucionais da Igreja de Deus no Brasil, confissões batistas e reformadas, além de páginas de referência para os diálogos históricos. Os links aparecem como âncoras externas acessíveis no leitor, com rótulo legível e abertura em nova aba.

A disponibilidade HTTP foi conferida no conjunto geral do projeto. Alguns domínios confessionais retornam bloqueio automatizado 403 ou timeout para requisições de terminal, embora possam abrir no navegador; isso é documentado como limitação de acesso, não tratado como prova de inexistência. A auditoria estrutural exige HTTPS, rótulo e URL, e não finge que uma verificação automática substitui a leitura crítica da fonte.

## Verificações

- TypeScript: aprovado.
- Auditor específico: aprovado com 14 etapas, 14 módulos, cinco camadas por módulo, dois ou mais parágrafos por camada, 26 fontes HTTPS e zero Markdown cru em referências.
- Build GitHub Pages: aprovado.
- Smoke test de rotas: aprovado para as rotas existentes e para `/igreja` e `/eclesiologia`.
- QA visual: leitura focada, parágrafos separados, índice responsivo e seleção do módulo 14 verificada no DOM após o item ser acionado.
- Cobertura bíblica de referência do projeto: 1.189/1.189 capítulos, preservada pela alteração localizada.

## Referências institucionais

[1]: https://igrejadedeus.org.br/ “Igreja de Deus no Brasil”
[2]: https://lausanne.org/core-documents “Lausanne Movement — Core Documents”
[3]: https://bfm.sbc.net/bfm2000/ “Baptist Faith and Message 2000”
[4]: https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html “Lumen gentium”
[5]: https://www.oikoumene.org/resources/documents/the-church-towards-a-common-vision “The Church: Towards a Common Vision”
