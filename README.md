# Plano de Estudo de 7 Dias — Entrevista Técnica Softplan

Este plano foi montado para uma preparação intensiva de uma semana, considerando uma rotina de aproximadamente **4 a 6 horas por dia**.

O objetivo não é dominar todas as tecnologias profundamente em poucos dias, mas construir uma base sólida para conseguir:

* explicar os principais conceitos técnicos da vaga;
* implementar um projeto prático com as tecnologias mais relevantes;
* demonstrar raciocínio arquitetural;
* mostrar familiaridade com backend Java, Spring Boot, REST, autenticação, testes, Docker e frontend React;
* entender o contexto de sistemas legados com Java EE, JSP, Servlets e Struts.

> Caso o tempo disponível seja menor, priorize Spring Boot, REST, React, Docker, Keycloak e Mockito. Kubernetes prático e Struts prático podem ser tratados como estudo conceitual.

---

## Dia 1 — Fundamentos da vaga + backend base

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

* Qual a diferença entre Java EE e Spring Boot?
* O que é um Servlet?
* O que é JSP?
* O que é Struts?
* Por que Spring Boot é mais produtivo?
* Qual a função de Controller, Service e Repository?

### Prática

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
* conexão com o banco funcionando;
* tabelas sendo criadas;
* possibilidade de criar dados manualmente.

---

## Dia 2 — API REST completa

### Teoria

Estudar:

* REST;
* HTTP methods;
* status codes;
* DTO;
* Bean Validation;
* Exception Handler;
* paginação.

### Conceitos que preciso saber

* `GET` busca recurso;
* `POST` cria recurso;
* `PUT` substitui recurso;
* `PATCH` altera parcialmente;
* `DELETE` remove recurso;
* `400` indica erro de validação;
* `401` indica usuário não autenticado;
* `403` indica usuário sem permissão;
* `404` indica recurso não encontrado;
* `409` indica conflito de regra de negócio;
* `500` indica erro interno no servidor.

### Prática

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

### Também adicionar

* DTOs;
* validações;
* `GlobalExceptionHandler`;
* status codes corretos.

> Observação de modelagem: o campo de status pertence ao `Process`, não à `Request`.
> A solicitação deve ser aceita ou rejeitada pelo fluxo da API, e somente uma solicitação aceita pode gerar um processo.
> O andamento depois disso é controlado pelo status do processo.

### Resultado esperado do dia

Ao final do dia, a API deve estar funcional no Postman ou Insomnia, com o fluxo completo funcionando:

```text
solicitacao -> processo
```

---

## Dia 3 — React consumindo a API

### Teoria

Estudar:

* React components;
* props;
* state;
* `useEffect`;
* forms;
* React Router;
* consumo de API.

### Prática

Criar o frontend com:

* React;
* Vite;
* TypeScript.

### Telas mínimas

Implementar:

* login fake ou tela inicial;
* listagem de solicitações;
* criação de solicitação;
* detalhe da solicitação;
* listagem de processos;
* detalhe do processo;
* alteração de status do processo.

> Não perder tempo com UI perfeita. O foco é demonstrar o fluxo funcionando.

### Resultado esperado do dia

Ao final do dia, o frontend deve conseguir:

* listar solicitações;
* criar solicitações;
* consumir dados reais do backend.

---

## Dia 4 — Keycloak, OAuth2 e OpenID Connect

### Teoria

Estudar:

* autenticação vs autorização;
* OAuth2;
* OpenID Connect;
* JWT;
* Realm;
* Client;
* Roles;
* Resource Server;
* Authorization Server.

### Conceitos obrigatórios

Entender:

* Access Token;
* ID Token;
* Refresh Token;
* JWT claims;
* roles;
* client;
* realm.

### Prática

Subir o Keycloak no Docker Compose.

Configurar:

* Realm: `protocolagov`;
* Client frontend;
* Client backend;
* Roles:

  * `USER`;
  * `ADMIN`;
* usuários de teste.

### Backend

Configurar no backend:

* Spring Security;
* Resource Server JWT;
* proteção de endpoints por role.

### Exemplo de regras de permissão

* `USER` pode criar solicitação;
* `ADMIN` pode aceitar, rejeitar, alterar o status do processo e acessar tudo.

### Resultado esperado do dia

Ao final do dia, o backend deve:

* validar JWT emitido pelo Keycloak;
* proteger endpoints por perfil de usuário.

---

## Dia 5 — Testes com JUnit e Mockito

### Teoria

Estudar:

* teste unitário;
* teste de integração;
* mock;
* stub;
* Arrange, Act, Assert;
* Mockito;
* JUnit.

### Conceitos que preciso saber explicar

* Teste unitário testa uma regra isolada;
* teste de integração testa componentes trabalhando juntos;
* mock simula uma dependência externa ou infraestrutura.

### Prática

Criar testes para os Services:

* `RequestServiceTest`;
* `ProcessServiceTest`.

### Casos de teste sugeridos

Testar:

* criar solicitação válida;
* não criar solicitação sem título;
* aceitar solicitação pendente;
* não aceitar solicitação já rejeitada;
* criar processo a partir de solicitação aceita;
* não criar processo a partir de solicitação pendente;
* alterar status do processo.

Usar Mockito para mockar os repositories.

### Resultado esperado do dia

Ao final do dia, o projeto deve ter pelo menos:

* 8 testes unitários passando;
* regras de negócio principais cobertas por testes.

---

## Dia 6 — Docker, Docker Compose, JSP/Servlet e Kubernetes básico

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

### Prática Docker

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

### Prática JSP/Servlet

Criar um módulo simples chamado:

```text
legacy-jsp
```

Com uma rota:

```http
/legacy/requests
```

Essa rota deve renderizar uma lista de solicitações em JSP.

### Resultado esperado com JSP/Servlet

Ao final dessa parte, eu preciso conseguir explicar a diferença entre:

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

> Não precisa estar perfeito. O objetivo é conseguir explicar os conceitos principais.

---

## Dia 7 — Revisão técnica + simulação de entrevista

Nesse dia, não implementar muita coisa nova. O foco deve ser consolidar o que já foi estudado e praticar respostas em voz alta.

### Revisão teórica

Conseguir responder:

* Explique a arquitetura do seu projeto.
* Por que você separou Controller, Service e Repository?
* Como funciona o fluxo de autenticação com Keycloak?
* Qual a diferença entre OAuth2 e OpenID Connect?
* Como você protegeria um endpoint por perfil?
* Como você testa uma regra de negócio com Mockito?
* Qual a diferença entre Docker Compose e Kubernetes?
* O que é um Servlet?
* O que é JSP?
* O que é Struts?
* Como você lidaria com um sistema legado em Java EE?
* O que é SOLID?
* Qual design pattern você aplicou?
* Como você usa IA no desenvolvimento sem depender cegamente dela?

---

## Pitch do projeto para a entrevista

Uma possível explicação do projeto:

> Eu construí um projeto chamado ProtocolaGov para simular um sistema de solicitações e processos públicos. A ideia foi praticar uma stack próxima da vaga: backend em Java com Spring Boot, API REST, autenticação com Keycloak, OAuth2 e OpenID Connect, frontend em React, testes com Mockito e ambiente com Docker Compose.
>
> Também criei um pequeno módulo JSP/Servlet para entender melhor o contexto de aplicações Java EE legadas, já que a vaga menciona JSP, Servlets e Struts.

---

## Resposta honesta sobre lacunas

Caso perguntem sobre tecnologias que ainda não domino profundamente:

> Minha experiência prática mais forte hoje está em desenvolvimento web fullstack e backend com APIs. Para essa vaga, aprofundei Spring Boot, REST, testes, Docker e Keycloak. Em Java EE legado, JSP, Servlets e Struts, eu ainda não tenho tanta vivência profissional, mas estudei o fluxo, implementei exemplos pequenos e entendo como essas tecnologias se encaixam em sistemas corporativos legados.

---

## Prioridade de estudo

### Prioridade 1 — indispensável

* Java;
* Spring Boot;
* REST;
* Controller, Service e Repository;
* DTO;
* validação;
* Exception Handler;
* JPA;
* PostgreSQL;
* React consumindo API.

### Prioridade 2 — diferencial forte

* Mockito;
* Docker Compose;
* Keycloak;
* OAuth2;
* OpenID Connect;
* Spring Security.

### Prioridade 3 — saber explicar

* Java EE;
* Servlets;
* JSP;
* Struts;
* Kubernetes;
* Design Patterns;
* SOLID;
* Clean Code.

### Prioridade 4 — bônus

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
* entendo autenticação e autorização com Keycloak;
* consigo consumir uma API com React;
* sei criar testes unitários com Mockito;
* entendo Docker e Docker Compose;
* conheço o básico de Kubernetes;
* tenho noção de aplicações legadas com Java EE, JSP, Servlets e Struts;
* consigo explicar decisões técnicas com clareza;
* uso IA como ferramenta de apoio, mas valido e entendo o que estou implementando.
