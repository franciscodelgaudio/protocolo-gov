/**
 * API Service Stubs
 *
 * Cada função corresponde a um endpoint do backend.
 * Para integrar com a API real, substitua o corpo de cada função
 * por uma chamada fetch() ao endpoint indicado no comentário.
 *
 * Base URL: /api
 */

import * as mock from '../mocks/data.js'

// Estado em memória — permite CRUD durante a sessão
let users = structuredClone(mock.mockUsers)
let requests = structuredClone(mock.mockRequests)
let processes = structuredClone(mock.mockProcesses)
let userRequests = structuredClone(mock.mockUserRequests)

const delay = () => new Promise((r) => setTimeout(r, 250))

// ─── USERS ────────────────────────────────────────────────────────────────────

/** POST /api/users */
export async function createUser(userDTO) {
  await delay()
  const newUser = { id: Math.max(...users.map((u) => u.id)) + 1, ...userDTO }
  users.push(newUser)
  const { password: _p, ...response } = newUser
  return response
}

/** GET /api/users/:id */
export async function getUserById(id) {
  await delay()
  const user = users.find((u) => u.id === Number(id))
  if (!user) throw new Error('Usuário não encontrado')
  const { password: _p, ...response } = user
  return response
}

/** GET /api/users — lista completa (não existe no backend, usado internamente) */
export async function getAllUsers() {
  await delay()
  return users.map(({ password: _p, ...u }) => u)
}

/** PUT /api/users/:id */
export async function updateUser(id, userDTO) {
  await delay()
  const idx = users.findIndex((u) => u.id === Number(id))
  if (idx === -1) throw new Error('Usuário não encontrado')
  users[idx] = { ...users[idx], ...userDTO }
  const { password: _p, ...response } = users[idx]
  return response
}

/** DELETE /api/users/:id */
export async function deleteUser(id) {
  await delay()
  users = users.filter((u) => u.id !== Number(id))
}

// ─── REQUESTS ─────────────────────────────────────────────────────────────────

/** POST /api/requests */
export async function createRequest(requestDTO) {
  await delay()
  const newRequest = {
    id: Math.max(...requests.map((r) => r.id)) + 1,
    name: requestDTO.name,
    description: requestDTO.description,
    status: 'PENDING',
    createdAt: new Date().toISOString().split('T')[0],
  }
  requests.push(newRequest)
  userRequests.push({
    id: Math.max(...userRequests.map((ur) => ur.id)) + 1,
    userId: Number(requestDTO.userId),
    requestId: newRequest.id,
  })
  return newRequest
}

/** GET /api/requests?userId=&page=&size= */
export async function getRequests({ userId, page = 0, size = 8, status }) {
  await delay()
  const user = users.find((u) => u.id === Number(userId))

  let filtered = [...requests]
  if (user?.role !== 'ADMIN') {
    const myIds = userRequests
      .filter((ur) => ur.userId === Number(userId))
      .map((ur) => ur.requestId)
    filtered = filtered.filter((r) => myIds.includes(r.id))
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status)
  }

  const totalElements = filtered.length
  const totalPages = Math.ceil(totalElements / size)
  const content = filtered.slice(page * size, (page + 1) * size)
  return { content, totalElements, totalPages, page }
}

/** GET /api/requests/:id?userId= */
export async function getRequestById(id, userId) {
  await delay()
  const request = requests.find((r) => r.id === Number(id))
  if (!request) throw new Error('Solicitação não encontrada')

  const link = userRequests.find((ur) => ur.requestId === Number(id))
  const owner = link ? users.find((u) => u.id === link.userId) : null
  const process = processes.find((p) => p.request?.id === Number(id)) || null

  return { ...request, owner: owner ? { id: owner.id, name: owner.name } : null, process }
}

/** PUT /api/requests/:id */
export async function updateRequest(id, requestDTO) {
  await delay()
  const idx = requests.findIndex((r) => r.id === Number(id))
  if (idx === -1) throw new Error('Solicitação não encontrada')
  requests[idx] = { ...requests[idx], name: requestDTO.name, description: requestDTO.description }
  return requests[idx]
}

/** PATCH /api/requests/:id/accept?userId= */
export async function acceptRequest(id, userId) {
  await delay()
  const idx = requests.findIndex((r) => r.id === Number(id))
  if (idx === -1) throw new Error('Solicitação não encontrada')
  requests[idx] = { ...requests[idx], status: 'ACCEPTED' }
  return requests[idx]
}

/** PATCH /api/requests/:id/reject?userId= */
export async function rejectRequest(id, userId) {
  await delay()
  const idx = requests.findIndex((r) => r.id === Number(id))
  if (idx === -1) throw new Error('Solicitação não encontrada')
  requests[idx] = { ...requests[idx], status: 'REJECTED' }
  return requests[idx]
}

/** DELETE /api/requests/:id?userId= */
export async function deleteRequest(id, userId) {
  await delay()
  requests = requests.filter((r) => r.id !== Number(id))
  processes = processes.filter((p) => p.request?.id !== Number(id))
  userRequests = userRequests.filter((ur) => ur.requestId !== Number(id))
}

// ─── PROCESSES ────────────────────────────────────────────────────────────────

/** POST /api/requests/:requestId/process */
export async function createProcessFromRequest(requestId, createDTO) {
  await delay()
  const request = requests.find((r) => r.id === Number(requestId))
  if (!request) throw new Error('Solicitação não encontrada')

  const newProcess = {
    id: processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1,
    name: createDTO.name,
    description: createDTO.description,
    status: 'PENDING',
    createdAt: new Date().toISOString().split('T')[0],
    request: { id: request.id, name: request.name },
  }
  processes.push(newProcess)
  return newProcess
}

/** GET /api/processes?userId=&page=&size= */
export async function getProcesses({ userId, page = 0, size = 8, status }) {
  await delay()
  let filtered = [...processes]
  if (status && status !== 'ALL') {
    filtered = filtered.filter((p) => p.status === status)
  }

  const totalElements = filtered.length
  const totalPages = Math.ceil(totalElements / size)
  const content = filtered.slice(page * size, (page + 1) * size)
  return { content, totalElements, totalPages, page }
}

/** GET /api/processes/:id?userId= */
export async function getProcessById(id, userId) {
  await delay()
  const process = processes.find((p) => p.id === Number(id))
  if (!process) throw new Error('Processo não encontrado')
  return process
}

/** PUT /api/processes/:id */
export async function updateProcess(id, processDTO) {
  await delay()
  const idx = processes.findIndex((p) => p.id === Number(id))
  if (idx === -1) throw new Error('Processo não encontrado')
  processes[idx] = { ...processes[idx], name: processDTO.name, description: processDTO.description }
  return processes[idx]
}

/** PATCH /api/processes/:id/status */
export async function updateProcessStatus(id, updateDTO) {
  await delay()
  const idx = processes.findIndex((p) => p.id === Number(id))
  if (idx === -1) throw new Error('Processo não encontrado')
  processes[idx] = { ...processes[idx], status: updateDTO.status }
  return processes[idx]
}

/** DELETE /api/processes/:id?userId= */
export async function deleteProcess(id, userId) {
  await delay()
  processes = processes.filter((p) => p.id !== Number(id))
}
