# Backend Teste Pleno

Este projeto é um teste técnico para a vaga de Backend Pleno, onde é utilizando ExpressJS, Sequelize, Puppeteer e algumas outros bibliotecas para criar o servidor.

## Começando o projeto

### Configurar o sistema

- Vá para a pasta que você deseja clonar este repositório `cd ~/SUA_PASTA_DE_REPOSITORIOS`
- Clone este repositório: `git clone https://github.com/Buraym/backend-teste-pleno/ backend-teste-pleno`
- Entre na pasta: `cd backend-teste-pleno`
- Instale as dependências usando NPM -> `npm install` | YARN -> `yarn` ( preferencialmente )

### Trabalhando no projeto

- Foi usado a biblioteca `ts-node-dev` para desenvolver com a funcionalidade de Hot reload.
- Foi feita uma pasta para as configurações do banco de dados chamada `config`, onde cria a conexão, e depois no arquivo principal, ela é testada, sincronizada e utilizada.
- O servidor usa o formato de pastas nomeadas, onde o arquivo se chama index.ts, não precisando mostrar qual arquivo é, pois assim fica mais legível e organizado.
- Dentro da pasta `src`, tem o arquivo principal `index.ts`, que roda o servidor usando o `app.ts`, que usa as rotas para servir a aplicação.
- Existem 4 pastas, dentre elas, a `utils`, para utilidades que podem ser reaproveitadas, a `routes`, para organizar quais rotas usam quais funções, a `controllers`, que tem guardado as funções diversas, como importação de boletos por CSV, organização de posição de boletos em reportes e outras funções, e por fim, a pasta `models`, que contém cada modelo feito no sequelize, mostrando a chaves estrangeiras e outros atributos.
- Existem também outras pastas como `reports` e `uploads`, que só servem para abrigar alguns arquivos como o CSV de boletos e os reportes separados por página, mas estas não aparecem no github, pois foi colocado no arquivo `gitignore`, para não ficar visível dados potêncialmente críticos.
- Existem pelos 4 rotas de CRUD para cada entidade do sistema, como o `Paycheck`, `Spot` e o `Paycheck Index`, sendo estes o boleto, lote e index do boleto, para poder trocar ou mudar a posição quando for importar o PDF.

## Banco de dados

O projeto utiliza o Sequelize para interagir com as tabelas pelo PostgreSQL, no meu eu uso as variáveis `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, que seriam o nome do banco de dados, o usuário, a senha, e o ip do banco ( coloco localhost ), enfim, eu usei o PGAdmin para criar o banco e fazer as alterações necessárias. Além destas variáveis de ambiente, a `SERVER_PORT` define qual porta utiliza qual ( por padrão á 8000 ).

## Rotas utilizadas

O projeto conta com um total de 14 rotas, sendo principalmente 4 rotas de CRUD para cada uma, e duas rotas, uma de importação de CSV e outra importação de reportes de PDF

| ROTA                               | TIPO DE REQ |       FUNÇÃO        |  QUERY   | BODY |
| ---------------------------------- | :---------: | :-----------------: | :------: | :--: |
| _localhost:8000/paychecks/_        |    `GET`    | Listagem de item(s) | Opcional | Não  |
| _localhost:8000/paychecks/_        |   `POST`    |   Criação de item   |   Não    | Sim  |
| _localhost:8000/paychecks/import_  |   `POST`    |  Importação de CSV  |   Não    | Não  |
| _localhost:8000/paychecks/pdf_     |   `POST`    |  Importação de PDF  |   Não    | Não  |
| _localhost:8000/paychecks/_        |    `PUT`    | Atualização de item |   Sim    | Sim  |
| _localhost:8000/paychecks/_        |  `DELETE`   |   Remoção de item   |   Sim    | Não  |
| _localhost:8000/spots/_            |    `GET`    | Listagem de item(s) | Opcional | Não  |
| _localhost:8000/spots/_            |   `POST`    |   Criação de item   |   Não    | Sim  |
| _localhost:8000/spots/_            |    `PUT`    | Atualização de item |   Sim    | Sim  |
| _localhost:8000/spots/_            |  `DELETE`   |   Remoção de item   |   Sim    | Não  |
| _localhost:8000/paycheck-indexes/_ |    `GET`    | Listagem de item(s) | Opcional | Não  |
| _localhost:8000/paycheck-indexes/_ |   `POST`    |   Criação de item   |   Não    | Sim  |
| _localhost:8000/paycheck-indexes/_ |    `PUT`    | Atualização de item |   Sim    | Sim  |
| _localhost:8000/paycheck-indexes/_ |  `DELETE`   |   Remoção de item   |   Sim    | Não  |

Para a lista completa de requisições, acesso o [link do postman](https://www.postman.com/descent-module-meteorologist-58752338/backend-teste-pleno-requests-api/) com as configurações ( lembre-se de verificar as rotas e usar o postman agent, para usar do desktop caso você esteja servindo a aplicação )
