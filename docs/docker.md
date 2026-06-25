# Ambiente Docker

Este ambiente sobe:

- PostgreSQL da aplicacao em `localhost:5432`
- Keycloak em `http://localhost:8080`
- Backend Spring Boot em `http://localhost:8081`
- Frontend Vite em `http://localhost:5173`

## Subir

```bash
docker compose up --build
```

Depois acesse:

- Aplicacao: `http://localhost:5173`
- Admin do Keycloak: `http://localhost:8080`

Credenciais do admin do Keycloak:

- Usuario: `admin`
- Senha: `admin`

## Usuarios de teste

O realm `protocolagov` e importado automaticamente com:

- Usuario comum: `user@protocologov.local` / `user123`
- Admin: `admin@protocologov.local` / `admin123`

O compose tambem injeta esses dois usuarios no banco local da aplicacao, porque o backend procura o usuario pelo e-mail do token JWT.

## Parar

```bash
docker compose down
```

Para apagar tambem os volumes:

```bash
docker compose down -v
```
