const API_URL = process.env.API_URL || 'http://localhost:8080'

export async function getRequests() {
  const res = await fetch(`${API_URL}/requests`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getRequest(id) {
  const res = await fetch(`${API_URL}/requests/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function getProcesses() {
  const res = await fetch(`${API_URL}/processes`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getProcess(id) {
  const res = await fetch(`${API_URL}/processes/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}
