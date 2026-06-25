# Anotações focadas nas suas dificuldades - Protocolo Gov

Pelo material do projeto, as partes que mais merecem revisão são as que misturam conceito com decisão prática: camadas do Spring, desenho de rotas REST, status HTTP, DTO/validação, JPA, transações, autenticação com Keycloak/JWT e controle de permissão.

## 1. Controller, Service e Repository

Pense assim:

- Controller: entrada HTTP.
- Service: regra de negócio.
- Repository: acesso ao banco.

Frase para entrevista:

> O controller recebe a requisição e chama o service. O service valida regras, permissões e transições de estado. O repository conversa com o banco.

Erro comum:

Colocar regra de negócio no controller. O controller deve ser pequeno. Se a regra estiver no service, fica mais fácil testar, reutilizar e manter.

## 2. Endpoint não é regra de negócio

Endpoint é a porta de entrada da API.

Regra de negócio é a decisão interna sobre o que pode acontecer.

Exemplo:

```http
PATCH /api/requests/{id}/accept
```

Essa rota comunica a intenção de aceitar uma solicitação. Mas ela não garante sozinha que a operação é válida. Quem garante isso é o service, verificando:

- se a solicitação existe;
- se o usuário é admin;
- se a solicitação não está rejeitada;
- se a transição de estado faz sentido;
- se deve salvar dentro de uma transação.

Resposta curta:

> A rota comunica a intenção. O service protege a consistência.

## 3. Por que usar PATCH para accept/reject/status

`PATCH` é usado quando você altera parcialmente um recurso ou executa uma transição de estado.

No seu domínio:

- aceitar solicitação;
- rejeitar solicitação;
- alterar status de processo.

Isso é melhor do que deixar o cliente enviar qualquer `status` livremente, porque o backend controla as etapas válidas.

Frase para entrevista:

> Eu prefiro uma rota de ação como `PATCH /requests/{id}/accept` porque ela representa uma transição de estado específica e impede o cliente de manipular o status sem regra.

## 4. Status HTTP importantes

Use estes com segurança:

- `200 OK`: deu certo e retorna corpo.
- `201 Created`: criou recurso novo.
- `204 No Content`: deu certo sem corpo, comum em delete.
- `400 Bad Request`: entrada inválida ou erro de validação.
- `401 Unauthorized`: usuário não autenticado.
- `403 Forbidden`: usuário autenticado, mas sem permissão.
- `404 Not Found`: recurso não encontrado.
- `409 Conflict`: regra de negócio conflitou com o estado atual.
- `500 Internal Server Error`: erro inesperado.

Diferença importante:

- `401`: não sei quem é o usuário.
- `403`: sei quem é o usuário, mas ele não pode fazer isso.
- `409`: a requisição faz sentido, mas o estado atual não permite.

## 5. DTO e Entity

Entity representa o banco.

DTO representa o contrato da API.

Você usa DTO para:

- não expor a entidade diretamente;
- controlar o que o cliente pode enviar;
- validar entrada;
- esconder campos internos;
- impedir que o cliente escolha `id`, `status`, datas ou dono do recurso quando isso deve ser decidido pelo backend.

Resposta curta:

> DTO separa o contrato externo da API do modelo interno do banco.

## 6. Bean Validation e @Valid

Bean Validation usa anotações como:

- `@NotNull`: não pode ser nulo.
- `@NotBlank`: string não pode ser nula, vazia ou só espaços.
- `@Size`: controla tamanho.

`@Valid` no controller manda o Spring validar o DTO antes de executar o método.

Resposta curta:

> Eu valido o formato da entrada no DTO com Bean Validation e aciono essa validação no controller com `@Valid`.

## 7. JPA, Entity e relacionamentos

JPA é a especificação para mapear objetos Java para tabelas.

Hibernate é uma implementação da JPA.

Anotações importantes:

- `@Entity`: classe vira tabela.
- `@Id`: chave primária.
- `@GeneratedValue`: id gerado automaticamente.
- `@ManyToOne`: muitos registros apontam para um registro.
- `@OneToOne`: um registro se relaciona com no máximo um outro.
- `@JoinColumn`: coluna de chave estrangeira.
- `@Enumerated(EnumType.STRING)`: salva enum como texto.

Resposta curta:

> JPA permite trabalhar com objetos Java enquanto o Hibernate faz o mapeamento para tabelas relacionais.

## 8. Pageable

`Pageable` evita buscar todos os registros de uma vez.

O cliente chama:

```http
GET /api/requests?page=0&size=10&sort=createdAt,desc
```

O Spring monta o objeto `Pageable`.

A primeira página é `0`.

Diferença:

- `List`: só itens.
- `Page`: itens + metadados, como total de elementos e total de páginas.

Resposta curta:

> Uso Pageable para melhorar performance e devolver listagens navegáveis.

## 9. @Transactional

Transação significa:

> Ou tudo dá certo, ou tudo é desfeito.

No seu projeto, criar uma solicitação envolve salvar a request e salvar o vínculo com o usuário. Se uma parte falhar, o banco não deve ficar pela metade.

Resposta curta:

> Uso `@Transactional` quando uma operação tem múltiplos passos de banco que precisam permanecer consistentes.

## 10. Autenticação, autorização e Keycloak

Autenticação:

> Quem é você?

Autorização:

> O que você pode fazer?

Keycloak é o servidor de identidade. Ele faz login, emite tokens e informa roles.

O backend é um Resource Server OAuth2. Ele recebe o JWT, valida o token e extrai roles.

No seu `SecurityConfig`, as roles do token são transformadas em authorities do Spring:

```text
USER -> ROLE_USER
ADMIN -> ROLE_ADMIN
```

Por isso o Spring usa:

```java
hasRole("ADMIN")
```

e não:

```java
hasRole("ROLE_ADMIN")
```

Resposta curta:

> O Keycloak autentica o usuário e emite o JWT. O backend valida esse JWT e usa as roles para autorizar endpoints.

## 11. Stateless

Com JWT, o backend não precisa guardar sessão do usuário no servidor.

Cada requisição leva o token.

Resposta curta:

> A API é stateless porque cada requisição traz as informações necessárias no token, sem depender de sessão no servidor.

## 12. Fluxo do Protocolo Gov

Fluxo principal:

```text
Usuário cria solicitação -> admin aceita ou rejeita -> solicitação aceita pode gerar processo -> processo muda de status
```

Regras importantes:

- usuário comum cria e consulta suas próprias solicitações;
- admin consulta tudo;
- só admin aceita ou rejeita solicitação;
- só admin cria processo a partir de solicitação;
- processo só deveria nascer de solicitação aceita;
- status não deve ser controlado livremente pelo cliente.

Pitch curto:

> O sistema modela um fluxo de protocolo. O cidadão cria uma solicitação, o admin analisa, e uma solicitação aceita pode virar processo. As permissões são protegidas por roles e as transições de estado ficam no service.

## 13. Frontend consumindo API

No frontend, o serviço de API centraliza chamadas HTTP.

Ideia:

- página chama função do service;
- service chama `/api/...`;
- Vite proxy encaminha para backend;
- backend responde JSON;
- tela atualiza estado com `useState` e `useEffect`.

Resposta curta:

> Eu centralizo chamadas HTTP em um service para não espalhar `fetch` pelas telas.

## 14. Docker Compose

Docker Compose sobe vários serviços juntos, como:

- backend;
- frontend;
- banco PostgreSQL;
- Keycloak.

Resposta curta:

> Docker Compose facilita subir o ambiente completo com banco, autenticação e aplicação usando um único comando.

## 15. Respostas que você deve treinar em voz alta

1. O que faz Controller, Service e Repository?
2. Por que a regra fica no Service?
3. Por que usar DTO?
4. Por que usar `@Valid`?
5. Quando usar `PATCH`?
6. Quando retornar `403`, `404` e `409`?
7. Por que `@Transactional`?
8. O que é JPA e o que é Hibernate?
9. Como funciona Keycloak com JWT?
10. Como proteger endpoint por role?
11. Qual é o fluxo do Protocolo Gov?
12. Por que o cliente não deve controlar status livremente?

