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


## GlobalExceptionHandler

`GlobalExceptionHandler` é uma classe com `@RestControllerAdvice`.

Ela centraliza erros, por exemplo:

* erro de validação;
* erro de regra de negócio;
* erro inesperado.

Sem isso, cada controller teria que tratar erro manualmente.

Resposta curta:

> O handler global padroniza respostas de erro e evita duplicar tratamento de exceções em todos os controllers.