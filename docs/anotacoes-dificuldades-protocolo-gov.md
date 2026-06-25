# Anotações focadas nas suas dificuldades - Protocolo Gov

Pelo material do projeto, as partes que mais merecem revisão são as que misturam conceito com decisão prática: camadas do Spring, desenho de rotas REST, status HTTP, DTO/validação, JPA, transações, autenticação com Keycloak/JWT e controle de permissão.

## 3. Por que usar PATCH para accept/reject/status

`PATCH` é usado quando você altera parcialmente um recurso ou executa uma transição de estado.

No seu domínio:

- aceitar solicitação;
- rejeitar solicitação;
- alterar status de processo.

Isso é melhor do que deixar o cliente enviar qualquer `status` livremente, porque o backend controla as etapas válidas.

Frase para entrevista:

> Eu prefiro uma rota de ação como `PATCH /requests/{id}/accept` porque ela representa uma transição de estado específica e impede o cliente de manipular o status sem regra.

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