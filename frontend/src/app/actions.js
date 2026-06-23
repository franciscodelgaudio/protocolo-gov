'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authOptions } from './api/auth/[...nextauth]/route'

const API_URL = process.env.API_URL || 'http://localhost:8080'

async function authHeaders() {
  const session = await getServerSession(authOptions)
  return {
    'Content-Type': 'application/json',
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
  }
}

export async function createRequest(formData) {
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    createdAt: new Date().toISOString(),
  }

  const res = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Falha ao criar solicitação')

  revalidatePath('/requests')
  redirect('/requests')
}

export async function deleteRequest(id) {
  await fetch(`${API_URL}/requests/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  })
  revalidatePath('/requests')
  redirect('/requests')
}

export async function createProcess(formData) {
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    status: 'PENDENTE',
    createdAt: new Date().toISOString(),
    requestId: Number(formData.get('requestId')),
  }

  const res = await fetch(`${API_URL}/processes`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Falha ao criar processo')

  const process = await res.json()
  revalidatePath('/processes')
  revalidatePath(`/requests/${data.requestId}`)
  redirect(`/processes/${process.id}`)
}

export async function updateProcessStatus(id, _prevState, formData) {
  const status = formData.get('status')
  const headers = await authHeaders()

  const getRes = await fetch(`${API_URL}/processes/${id}`, {
    headers,
    cache: 'no-store',
  })
  const process = await getRes.json()

  const res = await fetch(`${API_URL}/processes/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ ...process, status }),
  })

  if (!res.ok) throw new Error('Falha ao atualizar status')

  revalidatePath(`/processes/${id}`)
  revalidatePath('/processes')
}
