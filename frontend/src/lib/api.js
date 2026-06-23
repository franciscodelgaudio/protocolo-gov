import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const API_URL = process.env.API_URL || 'http://localhost:8080'

async function authHeaders() {
  const session = await getServerSession(authOptions)
  return session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {}
}

export async function getRequests() {
  const res = await fetch(`${API_URL}/requests`, {
    headers: await authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export async function getRequest(id) {
  const res = await fetch(`${API_URL}/requests/${id}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export async function getProcesses() {
  const res = await fetch(`${API_URL}/processes`, {
    headers: await authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export async function getProcess(id) {
  const res = await fetch(`${API_URL}/processes/${id}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`, {
    headers: await authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}
