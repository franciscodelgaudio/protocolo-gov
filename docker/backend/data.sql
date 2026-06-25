INSERT INTO users (name, email, password, avatar_url, role)
VALUES
  ('Usuario Teste', 'user@protocologov.local', 'managed-by-keycloak', null, 'USER'),
  ('Admin Teste', 'admin@protocologov.local', 'managed-by-keycloak', null, 'ADMIN')
ON CONFLICT (email) DO NOTHING;
