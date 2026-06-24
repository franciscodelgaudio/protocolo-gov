/**
 * API Service — consome o backend em /api (proxy Vite → localhost:8080)
 *
 * Cada função corresponde a um endpoint do backend Spring Boot.
 * As respostas de lista usam o formato Page do Spring Data:
 *   { content, totalElements, totalPages, number, size, ... }
 */

// ─── HTTP helper ─────────────────────────────────────────────────────────────

async function http(path, options = {}) {
  const { body, ...rest } = options
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...rest,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const msg =
      (Array.isArray(data?.messages) ? data.messages[0] : null) ??
      data?.message ??
      `Erro ${res.status}`
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

// Converte Page do Spring Data para o formato usado nos componentes
function adaptPage(springPage) {
  return {
    content: springPage.content ?? [],
    totalElements: springPage.totalElements ?? 0,
    totalPages: springPage.totalPages ?? 0,
    page: springPage.number ?? 0,
  }
}

// Formata data ISO para exibição (ex: "2026-06-24")
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

// ─── USERS ────────────────────────────────────────────────────────────────────

/** POST /api/users */
export async function createUser(userDTO) {
  return http('/users', { method: 'POST', body: userDTO })
}

/** GET /api/users */
export async function getAllUsers() {
  return http('/users')
}

/** GET /api/users/:id */
export async function getUserById(id) {
  return http(`/users/${id}`)
}

/** PUT /api/users/:id */
export async function updateUser(id, userDTO) {
  return http(`/users/${id}`, { method: 'PUT', body: userDTO })
}

/** DELETE /api/users/:id */
export async function deleteUser(id) {
  return http(`/users/${id}`, { method: 'DELETE' })
}

// ─── REQUESTS ─────────────────────────────────────────────────────────────────

/** POST /api/requests */
export async function createRequest(requestDTO) {
  return http('/requests', { method: 'POST', body: requestDTO })
}

/**
 * GET /api/requests?userId=&page=&size=&status=
 * status: ALL | PENDING | ACCEPTED | REJECTED
 */
export async function getRequests({ userId, page = 0, size = 8, status }) {
  const params = new URLSearchParams({ userId, page, size })
  if (status && status !== 'ALL') params.set('status', status)
  const data = await http(`/requests?${params}`)
  return adaptPage(data)
}

/** GET /api/requests/:id?userId= */
export async function getRequestById(id, userId) {
  return http(`/requests/${id}?userId=${userId}`)
}

/** PUT /api/requests/:id */
export async function updateRequest(id, requestDTO) {
  return http(`/requests/${id}`, { method: 'PUT', body: requestDTO })
}

/** PATCH /api/requests/:id/accept?userId= */
export async function acceptRequest(id, userId) {
  return http(`/requests/${id}/accept?userId=${userId}`, { method: 'PATCH' })
}

/** PATCH /api/requests/:id/reject?userId= */
export async function rejectRequest(id, userId) {
  return http(`/requests/${id}/reject?userId=${userId}`, { method: 'PATCH' })
}

/** DELETE /api/requests/:id?userId= */
export async function deleteRequest(id, userId) {
  return http(`/requests/${id}?userId=${userId}`, { method: 'DELETE' })
}

// ─── PROCESSES ────────────────────────────────────────────────────────────────

/** POST /api/requests/:requestId/process */
export async function createProcessFromRequest(requestId, createDTO) {
  return http(`/requests/${requestId}/process`, { method: 'POST', body: createDTO })
}

/**
 * GET /api/processes?userId=&page=&size=&status=
 * status: ALL | PENDING | IN_PROGRESS | COMPLETED | CANCELLED
 */
export async function getProcesses({ userId, page = 0, size = 8, status }) {
  const params = new URLSearchParams({ userId, page, size })
  if (status && status !== 'ALL') params.set('status', status)
  const data = await http(`/processes?${params}`)
  return adaptPage(data)
}

/** GET /api/processes/:id?userId= */
export async function getProcessById(id, userId) {
  return http(`/processes/${id}?userId=${userId}`)
}

/** PUT /api/processes/:id */
export async function updateProcess(id, processDTO) {
  return http(`/processes/${id}`, { method: 'PUT', body: processDTO })
}

/** PATCH /api/processes/:id/status */
export async function updateProcessStatus(id, updateDTO) {
  return http(`/processes/${id}/status`, { method: 'PATCH', body: updateDTO })
}

/** DELETE /api/processes/:id?userId= */
export async function deleteProcess(id, userId) {
  return http(`/processes/${id}?userId=${userId}`, { method: 'DELETE' })
}
