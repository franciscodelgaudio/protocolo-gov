import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'protocolagov',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'protocologov-frontend',
})

let initialized = false

export async function initKeycloak() {
  if (initialized) return keycloak.authenticated

  const authenticated = await keycloak.init({
    pkceMethod: 'S256',
    checkLoginIframe: false,
  })

  initialized = true
  return authenticated
}

export async function getAccessToken() {
  if (!keycloak.authenticated) return null

  await keycloak.updateToken(30)
  return keycloak.token
}

export function getUserFromToken() {
  const token = keycloak.tokenParsed
  if (!token) return null

  const roles = token.realm_access?.roles ?? []

  return {
    name: token.name ?? token.preferred_username ?? token.email ?? 'Usuario',
    email: token.email,
    role: roles.includes('ADMIN') ? 'ADMIN' : 'USER',
    roles,
  }
}
