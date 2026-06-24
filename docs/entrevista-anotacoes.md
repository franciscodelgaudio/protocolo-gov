# Anotações de entrevista - Backend Java e APIs

Estas anotações são para conversar com segurança sobre as tecnologias e decisões que aparecem em um backend Java moderno: Java EE/Jakarta EE, Spring Boot, JPA, Bean Validation, MVC, Controller, Service, Repository, DTO, Pageable, transações e desenho de rotas REST.

## Ideia central

Uma boa API não é só um CRUD. Ela deve expressar as ações importantes do domínio e proteger a consistência dos dados.

Exemplo:

```http
PATCH /requests/{id}/open
PATCH /requests/{id}/accept
PATCH /requests/{id}/reject
PATCH /processes/{id}/status
```

Essas rotas deixam clara a intenção da operação. Mas a rota, sozinha, não garante que o banco fique correto. Quem garante isso é a camada de service, aplicando regras de negócio, validações de estado, permissões e transações.

Frase importante:

> A rota comunica a intenção da operação. O service garante a consistência da regra de negócio.

## Java EE / Jakarta EE

Java EE, hoje Jakarta EE, é um conjunto de especificações para aplicações corporativas Java.

Exemplos de tecnologias desse ecossistema:

* Servlets;
* JSP;
* JPA;
* Bean Validation;
* CDI;
* APIs de segurança e transação.

Diferença geral para Spring Boot:

* Java EE/Jakarta EE define especificações implementadas por servidores de aplicação.
* Spring Boot é um framework opinativo que facilita criar aplicações standalone com configuração automática e servidor embutido.

Resposta curta:

> Java EE é um conjunto de especificações corporativas. Spring Boot é uma forma mais produtiva e opinativa de criar aplicações Java, geralmente com servidor embutido e autoconfiguração.

## Servlet e JSP

Servlet é um componente Java que recebe requisições HTTP e gera respostas.

JSP é uma tecnologia server-side para renderizar HTML no servidor, misturando página com expressões Java.

Em sistemas legados, é comum encontrar:

```text
Browser -> Servlet/Controller -> Service -> DAO/Repository -> Banco
```

Com JSP, a página HTML é montada no servidor. Com React, Angular ou Vue, o frontend geralmente consome JSON de uma API.

Resposta curta:

> Servlet é a base Java para lidar com HTTP. JSP é uma forma antiga de gerar HTML no servidor. Hoje, em aplicações modernas, é comum expor uma API REST e deixar o frontend consumir JSON.

## MVC

MVC significa Model, View e Controller.

* Model: representa dados e regras do domínio.
* View: apresenta informação para o usuário.
* Controller: recebe a ação/requisição e coordena a resposta.

Em uma API REST, a View geralmente não é uma página renderizada pelo backend. A resposta JSON vira a representação consumida por outra aplicação, como React ou Postman.

Resposta curta:

> Em uma API REST, o Controller recebe HTTP, chama a regra de negócio e devolve JSON. A View tradicional é substituída por um cliente externo que consome essa resposta.

## Controller

Controller é a camada de entrada HTTP.

Responsabilidades:

* mapear rotas;
* receber parâmetros e corpo da requisição;
* disparar validação com `@Valid`;
* chamar o service;
* retornar status HTTP correto.

O controller não deve concentrar regra de negócio pesada.

Exemplo mental:

```java
@PatchMapping("/requests/{id}/open")
public ResponseEntity<RequestResponseDTO> open(@PathVariable Long id) {
    return ResponseEntity.ok(service.open(id));
}
```

O método é pequeno porque a regra fica no service.

Resposta curta:

> Controller é a porta de entrada HTTP. Ele traduz a requisição para uma chamada de service e traduz o resultado para resposta HTTP.

## Service

Service é onde ficam as regras de negócio.

Responsabilidades:

* validar se o recurso existe;
* verificar permissões;
* validar se a transição de estado é permitida;
* chamar repositories;
* decidir qual erro retornar em caso de conflito;
* executar operações transacionais.

Exemplo:

```text
Para abrir uma request:
1. buscar request por id;
2. se não existir, 404;
3. validar permissão;
4. verificar se o status atual permite abrir;
5. alterar status;
6. salvar.
```

Resposta curta:

> O service protege o domínio. É nele que eu valido se uma ação como abrir, aceitar ou rejeitar pode acontecer antes de alterar o banco.

## Repository

Repository é a camada de persistência.

Com Spring Data JPA, normalmente criamos uma interface:

```java
public interface RequestRepository extends JpaRepository<Request, Long> {
}
```

Ela já ganha métodos como:

* `save`;
* `findById`;
* `findAll`;
* `deleteById`;
* `existsById`.

Resposta curta:

> Repository abstrai o acesso ao banco. Ele evita espalhar código de persistência pelo controller ou service.

## JPA e Hibernate

JPA é uma especificação para mapear objetos Java para tabelas relacionais.

Hibernate é uma implementação muito usada da JPA.

Conceitos principais:

* `@Entity`: classe persistida no banco;
* `@Id`: chave primária;
* `@GeneratedValue`: geração automática do id;
* `@Table`: configura tabela;
* `@Column`: configura coluna;
* `@OneToOne`, `@ManyToOne`, `@OneToMany`: relacionamentos;
* `@JoinColumn`: coluna de relacionamento;
* `@Enumerated(EnumType.STRING)`: salva enum como texto.

Resposta curta:

> JPA permite trabalhar com entidades Java em vez de escrever SQL para tudo. Hibernate é a implementação que faz o mapeamento objeto-relacional acontecer.

## Bean Validation

Bean Validation valida objetos com anotações.

Exemplos:

```java
@NotBlank
private String name;

@NotNull
private Long userId;

@Size(min = 3, max = 100)
private String title;
```

Diferenças úteis:

* `@NotNull`: o valor não pode ser `null`;
* `@NotBlank`: para `String`; não pode ser `null`, vazia ou só espaços;
* `@Size`: limita tamanho.

No controller, usamos:

```java
public ResponseEntity<?> create(@Valid @RequestBody CreateRequestDTO dto)
```

Resposta curta:

> Bean Validation impede que dados inválidos entrem no fluxo da aplicação. Com `@Valid`, o Spring valida o DTO antes de executar o método.

## DTO

DTO significa Data Transfer Object.

Ele define o contrato da API, separado da entidade do banco.

Por que usar DTO:

* não expor entidade diretamente;
* controlar o que o cliente pode enviar;
* esconder campos sensíveis;
* aplicar validações específicas;
* evitar acoplamento entre banco e API.

Exemplo:

```text
CreateRequestDTO:
- name
- description

Request entity:
- id
- name
- description
- status
- createdAt
```

O cliente não deveria escolher campos como `id`, `status` ou `createdAt` em muitos fluxos. O backend decide esses valores.

Resposta curta:

> DTO separa o contrato externo da API do modelo interno do banco.

## Pageable

`Pageable` é uma abstração do Spring Data para paginação e ordenação.

O cliente chama:

```http
GET /api/requests?page=0&size=10
GET /api/requests?page=0&size=10&sort=createdAt,desc
```

O Spring entende automaticamente:

* `page`;
* `size`;
* `sort`.

A primeira página é `0`.

O controller recebe:

```java
public ResponseEntity<Page<RequestDTO>> findAll(Pageable pageable)
```

O repository pode usar:

```java
repository.findAll(pageable)
```

Diferença entre `List` e `Page`:

* `List`: só os itens;
* `Page`: itens e metadados, como `totalElements`, `totalPages`, `size` e `number`.

Resposta curta:

> Pageable evita carregar tudo de uma vez. O frontend passa `page`, `size` e `sort`, e o Spring transforma isso em um objeto de paginação.

## Transactions

Transação é uma unidade de trabalho no banco.

Ideia:

```text
ou tudo dá certo,
ou tudo é desfeito.
```

Usamos `@Transactional` quando uma regra envolve mais de uma operação que precisa ser consistente.

Exemplo:

```text
Criar solicitação:
1. salvar a solicitação;
2. salvar o vínculo com o usuário.
```

Se o vínculo falhar, não quero deixar a solicitação solta no banco. A transação ajuda a evitar esse tipo de estado quebrado.

Resposta curta:

> `@Transactional` garante atomicidade. Se algo falha no meio do fluxo, o banco não deve ficar salvo pela metade.

## REST e métodos HTTP

Métodos principais:

* `GET`: buscar;
* `POST`: criar;
* `PUT`: substituir/atualizar recurso inteiro;
* `PATCH`: alterar parcialmente ou executar transição de estado;
* `DELETE`: remover.

Status úteis:

* `200 OK`: sucesso com resposta;
* `201 Created`: recurso criado;
* `204 No Content`: sucesso sem corpo;
* `400 Bad Request`: erro de entrada/validação;
* `403 Forbidden`: sem permissão;
* `404 Not Found`: recurso não encontrado;
* `409 Conflict`: conflito com regra de negócio;
* `500 Internal Server Error`: erro inesperado.

Resposta curta:

> REST usa recursos, URIs e métodos HTTP para expressar operações. O status HTTP deve comunicar o resultado da operação.

## Rotas de ação: `/requests/{id}/open`

Essa foi uma parte importante de entender.

Uma rota como:

```http
PATCH /requests/{id}/open
```

significa:

```text
Quero aplicar a ação "open" na request de id informado.
```

Ela é diferente de:

```http
PUT /requests/{id}
```

Porque `PUT` sugere substituir ou atualizar o recurso inteiro, enquanto `PATCH /open` sugere uma transição de estado específica.

Exemplos de rotas de ação:

```http
PATCH /requests/{id}/open
PATCH /requests/{id}/cancel
PATCH /requests/{id}/accept
PATCH /requests/{id}/reject
PATCH /processes/{id}/complete
```

Essas rotas ajudam a API a falar a linguagem do domínio.

## A rota deixa o banco mais correto?

A rota ajuda, mas não sozinha.

Ela ajuda porque o cliente não manda simplesmente:

```json
{
  "status": "OPEN"
}
```

Em vez disso, o cliente pede:

```http
PATCH /requests/{id}/open
```

Isso deixa claro que ele está pedindo uma ação de negócio.

Mas a consistência vem do service:

```text
1. request existe?
2. usuário pode abrir?
3. status atual permite abrir?
4. já está aberta?
5. está cancelada?
6. pode mudar para OPEN?
7. salvar dentro de transação.
```

Então a frase correta é:

> A rota de ação ajuda a expressar melhor a intenção e evita deixar o cliente manipular status livremente. Mas quem realmente protege o banco é o service, com validação de regra, estado e transação.

## Por que não deixar o cliente alterar status livremente?

Porque o cliente poderia pular etapas.

Exemplo ruim:

```http
PUT /requests/10
```

Com body:

```json
{
  "status": "APPROVED"
}
```

Problema: talvez a request ainda nem tenha sido analisada, talvez o usuário não tenha permissão, talvez esteja cancelada.

Exemplo melhor:

```http
PATCH /requests/10/accept
```

O cliente pede a ação. O backend decide se ela é válida.

Resposta curta:

> O cliente não deve mandar o estado final livremente. Ele deve pedir uma ação, e o backend valida se aquela transição é permitida.

## Quando retornar 409 Conflict

Use `409 Conflict` quando a requisição está bem formada, o recurso existe, mas a operação conflita com o estado atual ou uma regra de negócio.

Exemplos:

* abrir algo que já está fechado definitivamente;
* aceitar uma solicitação já rejeitada;
* criar processo para solicitação ainda pendente;
* criar segundo processo para a mesma solicitação.

Resposta curta:

> `409` é adequado quando o problema não é sintaxe nem recurso inexistente, mas conflito com uma regra de negócio.

## GlobalExceptionHandler

`GlobalExceptionHandler` é uma classe com `@RestControllerAdvice`.

Ela centraliza erros, por exemplo:

* erro de validação;
* erro de regra de negócio;
* erro inesperado.

Sem isso, cada controller teria que tratar erro manualmente.

Resposta curta:

> O handler global padroniza respostas de erro e evita duplicar tratamento de exceções em todos os controllers.

## Perguntas prováveis e respostas

### Por que você usaria uma rota como `/requests/{id}/open`?

Porque ela expressa uma ação de negócio e uma transição de estado específica. Isso é melhor do que permitir que o cliente altere o campo `status` livremente.

### Essa rota garante que o banco fique correto?

Não sozinha. Ela só comunica a intenção. O banco fica correto porque o service valida estado, permissão e regras antes de salvar.

### Onde fica a regra de negócio?

No service.

### Onde fica a validação de formato dos dados?

No DTO, com Bean Validation, e é acionada no controller com `@Valid`.

### Onde fica o acesso ao banco?

No repository, geralmente usando Spring Data JPA.

### Por que usar DTO?

Para separar o contrato da API da entidade do banco e controlar o que o cliente pode enviar ou receber.

### Por que usar Pageable?

Para evitar buscar todos os registros de uma vez e permitir que o cliente navegue por páginas.

### Por que usar Transaction?

Para garantir que uma operação com múltiplos passos seja atômica: ou tudo salva, ou nada salva.

### Qual resposta dar sobre arquitetura?

> Eu separo controller, service e repository para dividir responsabilidades. Controller lida com HTTP, service com regra de negócio e repository com persistência.

### Qual resposta dar sobre rotas e domínio?

> Eu tento desenhar rotas que expressem ações reais do domínio. Para transições de estado, prefiro `PATCH /recurso/{id}/acao`, e deixo o service validar se a transição é permitida.

## Mini pitch técnico

Uma resposta boa e segura:

> Eu entendo que uma API backend não deve ser apenas CRUD. Em muitos casos, existem ações de domínio, como abrir, aceitar, rejeitar, cancelar ou concluir. Eu posso expressar essas ações com rotas como `PATCH /requests/{id}/open`, mas a consistência não vem da rota em si. A consistência vem da camada de service, que valida permissões, estado atual, regras de negócio e salva dentro de uma transação quando necessário. Uso DTOs e Bean Validation para controlar a entrada, Repository/JPA para persistência e Pageable para listagens grandes.

## Checklist de estudo

* Explicar Java EE/Jakarta EE em alto nível.
* Explicar Servlet e JSP.
* Explicar MVC em API REST.
* Dizer a responsabilidade de Controller, Service e Repository.
* Explicar JPA e Hibernate.
* Explicar Entity e relacionamentos.
* Explicar Bean Validation e `@Valid`.
* Explicar DTO.
* Explicar Pageable com `page`, `size` e `sort`.
* Explicar `@Transactional`.
* Explicar `PATCH /requests/{id}/open`.
* Explicar por que a regra fica no Service.
* Explicar quando usar `409 Conflict`.
