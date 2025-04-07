# Guia de Contribuição

Obrigado por considerar contribuir para o Sisgesc API! Este guia ajudará você a começar.

## Como Contribuir

1. **Faça um Fork do Repositório**  
   Crie um fork do repositório para sua conta GitHub.

2. **Clone o Repositório**  
   Clone o repositório para sua máquina local:

   ```bash
   git clone https://github.com/seu-usuario/sisgesc-api.git
   cd sisgesc-api
   ```

3. **Crie uma Branch**  
   Crie uma branch para sua feature ou correção de bug:

   ```bash
   git checkout -b minha-feature
   ```

4. **Faça as Alterações**  
   Implemente as alterações necessárias no código.

5. **Teste Suas Alterações**  
   Certifique-se de que suas alterações não quebrem o projeto. Adicione testes, se necessário.

6. **Commit e Push**  
   Faça commit das suas alterações e envie para o repositório remoto:

   ```bash
   git add .
   git commit -m "Descrição da minha alteração"
   git push origin minha-feature
   ```

7. **Abra um Pull Request**  
   No repositório original, abra um Pull Request descrevendo suas alterações.

## Regras de Contribuição

- **Siga o Padrão de Código**: Certifique-se de que seu código segue os padrões do projeto.
- **Adicione Testes**: Sempre que possível, adicione testes para validar suas alterações.
- **Documente Suas Alterações**: Atualize o README ou outros documentos relevantes, se necessário.
- **Seja Respeitoso**: Trabalhamos juntos para melhorar o projeto. Respeite os outros contribuidores.

## Configuração do Ambiente de Desenvolvimento

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo .env.

3. Execute o servidor em modo de desenvolvimento:

   ```bash
   npm run start:dev
   ```

4. Execute as migrações para configurar o banco de dados:

   ```bash
   npm run typeorm:run-migrations
   ```

## Reportando Problemas

Se encontrar um bug ou tiver uma sugestão, abra uma [issue](https://github.com/dejardim/sisgesc-api/issues) no repositório.

## Agradecimentos

Agradecemos sua contribuição para o Sisgesc API!
