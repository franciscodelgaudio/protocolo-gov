# Plano de Estudo de 7 Dias � Entrevista T�cnica Softplan

Este plano foi montado para uma prepara��o intensiva de uma semana, considerando uma rotina de aproximadamente **4 a 6 horas por dia**.

O objetivo n�o � dominar todas as tecnologias profundamente em poucos dias, mas construir uma base s�lida para conseguir:

* explicar os principais conceitos t�cnicos da vaga;
* implementar um projeto pr�tico com as tecnologias mais relevantes;
* demonstrar racioc�nio arquitetural;
* mostrar familiaridade com backend Java, Spring Boot, REST, autentica��o, testes, Docker e frontend React;
* entender o contexto de sistemas legados com Java EE, JSP, Servlets e Struts.

> Caso o tempo dispon�vel seja menor, priorize Spring Boot, REST, React, Docker, Keycloak e Mockito. Kubernetes pr�tico e Struts pr�tico podem ser tratados como estudo conceitual.

---

## Dia 1 � Fundamentos da vaga + backend base

### Teoria

Estudar:

* Java EE vs Spring Boot;
* Servlets;
* JSP;
* Struts;
* Spring Boot;
* Arquitetura MVC;
* Controller, Service e Repository.

### Perguntas que preciso saber responder

* Qual a diferen�a entre Java EE e Spring Boot?
* O que � um Servlet?
* O que � JSP?
* O que � Struts?
* Por que Spring Boot � mais produtivo?
* Qual a fun��o de Controller, Service e Repository?

### Pr�tica

Criar o backend com:

* Spring Boot;
* PostgreSQL;
* JPA;
* entidades principais;
* enums de status;
* repositories.

### Entidades iniciais

Implementar:

* `User`;
* `Request`;
* `Process`.

### Resultado esperado do dia

Ao final do dia, o projeto deve ter:

* backend subindo corretamente;
* conex�o com o banco funcionando;
* tabelas sendo criadas;
* possibilidade de criar dados manualmente.

---

## Dia 2 � API REST completa

### Teoria

Estudar:

* REST;
* HTTP methods;
* status codes;
* Exception Handler;
* pagina��o.

### Conceitos que preciso saber

* `GET` busca recurso;
* `POST` cria recurso;
* `PUT` substitui recurso;
* `PATCH` altera parcialmente;
* `DELETE` remove recurso;
* `400` indica erro de valida��o;
* `401` indica usu�rio n�o autenticado;
* `403` indica usu�rio sem permiss�o;
* `404` indica recurso n�o encontrado;
* `409` indica conflito de regra de neg�cio;
* `500` indica erro interno no servidor.

### Pr�tica

Implementar os endpoints:

```http
POST /requests
GET /requests
GET /requests/{id}
PATCH /requests/{id}/accept
PATCH /requests/{id}/reject
POST /requests/{id}/process
GET /processes
PATCH /processes/{id}/status
```

### Tamb�m adicionar

* valida��es;
* `GlobalExceptionHandler`;
* status codes corretos.

> Observa��o de modelagem: o campo de status pertence ao `Process`, n�o � `Request`.
> A solicita��o deve ser aceita ou rejeitada pelo fluxo da API, e somente uma solicita��o aceita pode gerar um processo.
> O andamento depois disso � controlado pelo status do processo.

### Resultado esperado do dia

Ao final do dia, a API deve estar funcional no Postman ou Insomnia, com o fluxo completo funcionando:

```text
solicitacao -> processo
```

---

## Dia 3 � React consumindo a API

### Teoria

Estudar:

* React components;
* props;
* state;
* `useEffect`;
* forms;
* React Router;
* consumo de API.

### Pr�tica

Criar o frontend com:

* React;
* Vite;
* TypeScript.

### Telas m�nimas

Implementar:

* login fake ou tela inicial;
* listagem de solicita��es;
* cria��o de solicita��o;
* detalhe da solicita��o;
* listagem de processos;
* detalhe do processo;
* altera��o de status do processo.

> N�o perder tempo com UI perfeita. O foco � demonstrar o fluxo funcionando.

### Resultado esperado do dia

Ao final do dia, o frontend deve conseguir:

* listar solicita��es;
* criar solicita��es;
* consumir dados reais do backend.

---

## Dia 4 � Keycloak, OAuth2 e OpenID Connect

### Teoria

Estudar:

* autentica��o vs autoriza��o;
* OAuth2;
* OpenID Connect;
* JWT;
* Realm;
* Client;
* Roles;
* Resource Server;
* Authorization Server.

### Conceitos obrigat�rios

Entender:

* Access Token;
* ID Token;
* Refresh Token;
* JWT claims;
* roles;
* client;
* realm.

### Pr�tica

Subir o Keycloak no Docker Compose.

Configurar:

* Realm: `protocolagov`;
* Client frontend;
* Client backend;
* Roles:

  * `USER`;
  * `ADMIN`;
* usu�rios de teste.

### Backend

Configurar no backend:

* Spring Security;
* Resource Server JWT;
* prote��o de endpoints por role.

### Exemplo de regras de permiss�o

* `USER` pode criar solicita��o;
* `ADMIN` pode aceitar, rejeitar, alterar o status do processo e acessar tudo.

### Resultado esperado do dia

Ao final do dia, o backend deve:

* validar JWT emitido pelo Keycloak;
* proteger endpoints por perfil de usu�rio.

---

## Dia 5 � Testes com JUnit e Mockito

### Teoria

Estudar:

* teste unit�rio;
* teste de integra��o;
* mock;
* stub;
* Arrange, Act, Assert;
* Mockito;
* JUnit.

### Conceitos que preciso saber explicar

* Teste unit�rio testa uma regra isolada;
* teste de integra��o testa componentes trabalhando juntos;
* mock simula uma depend�ncia externa ou infraestrutura.

### Pr�tica

Criar testes para os Services:

* `RequestServiceTest`;
* `ProcessServiceTest`.

### Casos de teste sugeridos

Testar:

* criar solicita��o v�lida;
* n�o criar solicita��o sem t�tulo;
* aceitar solicita��o pendente;
* n�o aceitar solicita��o j� rejeitada;
* criar processo a partir de solicita��o aceita;
* n�o criar processo a partir de solicita��o pendente;
* alterar status do processo.

Usar Mockito para mockar os repositories.

### Resultado esperado do dia

Ao final do dia, o projeto deve ter pelo menos:

* 8 testes unit�rios passando;
* regras de neg�cio principais cobertas por testes.

---

## Dia 6 � Docker, Docker Compose, JSP/Servlet e Kubernetes b�sico

### Teoria

Estudar:

* Dockerfile;
* image;
* container;
* volume;
* network;
* Docker Compose;
* Pod;
* Deployment;
* Service;
* ConfigMap;
* Secret;
* Ingress.

---

### Pr�tica Docker

Criar Dockerfile para:

* backend;
* frontend.

No `docker-compose.yml`, subir:

* `postgres`;
* `keycloak`;
* `backend`;
* `frontend`.

### Resultado esperado com Docker

O projeto inteiro deve subir com:

```bash
docker compose up
```

---

### Pr�tica JSP/Servlet

Criar um m�dulo simples chamado:

```text
legacy-jsp
```

Com uma rota:

```http
/legacy/requests
```

Essa rota deve renderizar uma lista de solicita��es em JSP.

### Resultado esperado com JSP/Servlet

Ao final dessa parte, eu preciso conseguir explicar a diferen�a entre:

* frontend server-side com JSP;
* frontend SPA com React.

---

### Kubernetes

Criar arquivos simples na pasta `k8s/`:

```text
backend-deployment.yaml
backend-service.yaml
frontend-deployment.yaml
frontend-service.yaml
```

> N�o precisa estar perfeito. O objetivo � conseguir explicar os conceitos principais.

---

## Dia 7 � Revis�o t�cnica + simula��o de entrevista

Nesse dia, n�o implementar muita coisa nova. O foco deve ser consolidar o que j� foi estudado e praticar respostas em voz alta.

### Revis�o te�rica

Conseguir responder:

* Explique a arquitetura do seu projeto.
* Por que voc� separou Controller, Service e Repository?
* Como funciona o fluxo de autentica��o com Keycloak?
* Qual a diferen�a entre OAuth2 e OpenID Connect?
* Como voc� protegeria um endpoint por perfil?
* Como voc� testa uma regra de neg�cio com Mockito?
* Qual a diferen�a entre Docker Compose e Kubernetes?
* O que � um Servlet?
* O que � JSP?
* O que � Struts?
* Como voc� lidaria com um sistema legado em Java EE?
* O que � SOLID?
* Qual design pattern voc� aplicou?
* Como voc� usa IA no desenvolvimento sem depender cegamente dela?

---

## Pitch do projeto para a entrevista

Uma poss�vel explica��o do projeto:

> Eu constru� um projeto chamado ProtocolaGov para simular um sistema de solicita��es e processos p�blicos. A ideia foi praticar uma stack pr�xima da vaga: backend em Java com Spring Boot, API REST, autentica��o com Keycloak, OAuth2 e OpenID Connect, frontend em React, testes com Mockito e ambiente com Docker Compose.
>
> Tamb�m criei um pequeno m�dulo JSP/Servlet para entender melhor o contexto de aplica��es Java EE legadas, j� que a vaga menciona JSP, Servlets e Struts.

---

## Resposta honesta sobre lacunas

Caso perguntem sobre tecnologias que ainda n�o domino profundamente:

> Minha experi�ncia pr�tica mais forte hoje est� em desenvolvimento web fullstack e backend com APIs. Para essa vaga, aprofundei Spring Boot, REST, testes, Docker e Keycloak. Em Java EE legado, JSP, Servlets e Struts, eu ainda n�o tenho tanta viv�ncia profissional, mas estudei o fluxo, implementei exemplos pequenos e entendo como essas tecnologias se encaixam em sistemas corporativos legados.

---

## Prioridade de estudo

### Prioridade 1 � indispens�vel

* Java;
* Spring Boot;
* REST;
* Controller, Service e Repository;
* DTO;
* valida��o;
* Exception Handler;
* JPA;
* PostgreSQL;
* React consumindo API.

### Prioridade 2 � diferencial forte

* Mockito;
* Docker Compose;
* Keycloak;
* OAuth2;
* OpenID Connect;
* Spring Security.

### Prioridade 3 � saber explicar

* Java EE;
* Servlets;
* JSP;
* Struts;
* Kubernetes;
* Design Patterns;
* SOLID;
* Clean Code.

### Prioridade 4 � b�nus

* Kubernetes rodando localmente;
* Struts implementado de verdade;
* CI/CD;
* Testcontainers;
* Swagger/OpenAPI.

---

## Objetivo final da semana

Ao final da semana, eu preciso conseguir demonstrar que:

* entendo desenvolvimento backend com Java;
* consigo construir uma API REST com Spring Boot;
* sei separar responsabilidades em camadas;
* entendo autentica��o e autoriza��o com Keycloak;
* consigo consumir uma API com React;
* sei criar testes unit�rios com Mockito;
* entendo Docker e Docker Compose;
* conhe�o o b�sico de Kubernetes;
* tenho no��o de aplica��es legadas com Java EE, JSP, Servlets e Struts;
* consigo explicar decis�es t�cnicas com clareza;
* uso IA como ferramenta de apoio, mas valido e entendo o que estou implementando.
