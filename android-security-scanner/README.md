# Sentinela Mobile

Aplicativo Android defensivo para diagnóstico local de sinais que merecem revisão de segurança.

## O que verifica
- opções de desenvolvedor e ADB;
- serviços de acessibilidade habilitados;
- administradores do dispositivo;
- VPN ativa e apps que oferecem serviço VPN;
- aplicativos instalados, origem de instalação e permissões sensíveis concedidas;
- apps que podem instalar outros pacotes;
- indícios comuns de root;
- combinação de origem desconhecida + várias permissões sensíveis.

## Privacidade
A análise acontece localmente. O app não lê mensagens, senhas, fotos, conteúdo de outros aplicativos nem envia os resultados para servidor. O relatório só sai do aparelho quando o usuário toca em **Compartilhar relatório**.

## Importante
Nenhum aplicativo comum consegue provar sozinho que um telefone foi “clonado”. O Sentinela Mobile procura evidências associadas a spyware, controle remoto, permissões avançadas, sideload e alterações relevantes de segurança. Um achado é um sinal para investigação, não uma acusação contra um app.

## Instalação
Baixe o APK gerado pelo workflow **Build Sentinela Mobile APK**, permita a instalação do arquivo quando o Android solicitar e execute **Iniciar varredura**.

Versão inicial: 0.1.0.
