# Sisgesc API

Sisgesc API é uma aplicação backend desenvolvida em Node.js com TypeScript, utilizando o framework Express e o ORM TypeORM. O objetivo do projeto é gerenciar matrículas, turmas, turnos e mensalidades escolares.

## Requisitos

Antes de iniciar o projeto, certifique-se de ter os seguintes requisitos instalados:

- Node.js (versão 20 ou superior)
- PostgreSQL 17
- npm

## Configuração do Ambiente

1. Clone o repositório:

   ```bash
   git clone https://github.com/dejardim/sisgesc-api.git
   cd sisgesc-api
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

   ```env
   TYPEORM_HOST=localhost
   TYPEORM_PORT=5432
   TYPEORM_USERNAME=seu_usuario
   TYPEORM_PASSWORD=sua_senha
   TYPEORM_DATABASE=sisgesc
   PORT=3000
   ```

4. Configure o banco de dados:

   Certifique-se de que o banco de dados PostgreSQL esteja rodando e crie o banco de dados especificado na variável `TYPEORM_DATABASE`.

5. Execute as migrações para criar as tabelas e inserir os dados iniciais:

   ```bash
   npm run typeorm:run-migrations
   ```

## Iniciando o Projeto

### Ambiente de Desenvolvimento

Para rodar o projeto em ambiente de desenvolvimento com hot-reload:

```bash
npm run start:dev
```

### Ambiente de Produção

1. Compile o projeto:

   ```bash
   npm run build
   ```

2. Inicie o servidor:

   ```bash
   npm start
   ```

O servidor estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

- **`src/app.ts`**: Configuração do servidor Express.
- **`src/server.ts`**: Ponto de entrada da aplicação.
- **database**: Configuração do TypeORM, entidades e migrações.
- **routers**: Rotas da aplicação.
- **handlers**: Handlers para as rotas.
- **constants**: Constantes como mensagens de erro e códigos de status HTTP.
- **utils**: Funções utilitárias.

## Funcionalidades Implementadas

- **Matrículas**:
  - Criar, listar, atualizar e deletar matrículas.
  - Validação de dados como nome do aluno, gênero e data de nascimento.
- **Mensalidades**:
  - Gerenciar mensalidades associadas às matrículas.
  - Atualizar status de pagamento.
- **Turnos**:
  - Listar turnos disponíveis.
- **Turmas**:
  - Listar turmas disponíveis.

## Funcionalidades Faltantes

- Testes automatizados.
- Documentação da API (ex.: Swagger).
- Autenticação e autorização QuotiAuth.
- Logs estruturados para monitoramento.
- Melhor tratamento de erros e mensagens de retorno.

## Contribuindo

Veja o arquivo CONTRIBUTING.md para mais informações sobre como contribuir para o projeto.
