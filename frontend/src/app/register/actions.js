'use server'

import { redirect } from 'next/navigation'

const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL || 'http://localhost:8180'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'protocologov'
const API_URL = process.env.API_URL || 'http://localhost:8080'

async function getAdminToken() {
  const res = await fetch(
    `${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: process.env.KEYCLOAK_ADMIN_USERNAME,
        password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      }),
    }
  )
  if (!res.ok) throw new Error('Falha ao obter token de admin')
  const data = await res.json()
  return data.access_token
}

export async function registerUser(prevState, formData) {
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const username = formData.get('username')
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  if (password !== confirmPassword) {
    return { error: 'As senhas não coincidem.' }
  }

  let adminToken
  try {
    adminToken = await getAdminToken()
  } catch {
    return { error: 'Não foi possível conectar ao servidor de autenticação.' }
  }

  const keycloakRes = await fetch(
    `${KEYCLOAK_BASE_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        username,
        email,
        firstName,
        lastName,
        enabled: true,
        credentials: [{ type: 'password', value: password, temporary: false }],
      }),
    }
  )

  if (!keycloakRes.ok) {
    const body = await keycloakRes.json().catch(() => ({}))
    if (keycloakRes.status === 409) return { error: 'Usuário ou e-mail já cadastrado.' }
    const detail = body.errorMessage || body.error_description || body.error || JSON.stringify(body)
    return { error: `Erro ${keycloakRes.status}: ${detail}` }
  }

  await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${firstName} ${lastName}`,
      email,
      password: '',
      role: 'CIDADAO',
    }),
  }).catch(() => null)

  redirect('/login?registered=true')
}
