# Geolocation search

**Alguma dúvida?** Entre em contato por e-mail: prado.eder@gmail.com

## Introdução

Mecanismo de busca de propriedades por geolocalização dentro de um mundo fictício.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/dfe8166672746dd1bdc1)

## Quick Start

Primeiro, faça o download do código para qualquer local na sua máquina...
```
$ git clone https://github.com/ederavilaprado/geolocation.git
```

Em seguida, escolha um dos 2 caminhos disponíveis:

**Utilizando Docker**

Antes de iniciar, certifique-se de ter o [docker](https://www.docker.com/products/docker) instalado na sua máquina.  
Certifique também se o daemon do docker está ativado, ou no caso de MacOs, se a sua docker machine está inciada.  
Navegue até o diretório da aplicação (o que você clonou no passo anterior)
```
$ cd geolocation
# fazendo o build da aplicação
$ docker build -t geolocation:1.0.0 .
# executando a aplicação
$ docker run -d -p 1337:1337 geolocation:1.0.0
```

**Local**  
Vamos subir o projeto rodando local.  
Certifique-se de ter o node instalado (versão >= 4.4.7). Uma boa dica para a instalação do node é utilizando o projeto https://github.com/creationix/nvm#install-script.  
```
$ cd geolocation
# instalando dependências
$ npm install
# carga no banco de dados com os registros disponíveis no desafio
$ npm run firstLoad
# iniciando a aplicação
$ npm start
```

**Validando**  
Indiferente da forma escolhida acima, o resultado final é o mesmo.  
Lembre-se de substituir o host de `dockerhost` para `localhost` caso esteja executando local.  

Cadastrando uma nova propriedade (guarde o id retornado, ou o location do header, iremos precisar no teste a seguir)  
```
$ curl -X POST -H "Content-Type: application/json" -d '{
  "x": 1337,
  "y": 1,
  "price": 10000,
  "title": "Apartment 221 B, Baker Street",
  "description": "Sherlock Holmes lives here",
  "beds": 3,
  "baths": 2,
  "squareMeters": 200
}' "http://dockerhost:1337/v1/properties"
```

Com o id retornado no último request... vamos recuperar a propriedade cadastrada
```
$ curl -X GET "http://dockerhost:1337/v1/properties/7f870d66-e0e3-48f9-b5c0-14eb122bf107"
```

Ou fazer uma query por várias propriedades
```
$ curl -X GET "http://dockerhost:1337/v1/properties?ax=1200&ay=100&bx=1400&by=1"
```

## Testes
Para executar os testes do projeto, basta...

```
$ npm test
```
Por enquanto não temos testes realmente úteis, apenas 1 teste apresentando o funcionamento da plataforma de testes.  
Ponto importante é a necessidade de ajustes para se fazer um mockup da base de dados, ou até mesmo subir com a mesma em memória ou um lugar alternativo temporário.  

## TODO

Lista de tarefas:  

- [x] load provinces
- [x] load properties
- [x] add docker quick start
- [x] better description on swagger
- [x] readme
- [ ] add some better tests

- [ ] add vagrant quick start
- [ ] add swagger ui (https://github.com/apigee-127/swagger-tools)
- [ ] JWT
- [ ] log
- [ ] add config to project
- [ ] add .editorconfig
- [ ] add eslint
- [ ] add eshint
