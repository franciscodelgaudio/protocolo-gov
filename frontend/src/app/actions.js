'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const API_URL = process.env.API_URL || 'http://localhost:8080'

export async function createRequest(formData) {
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    createdAt: new Date().toISOString(),
  }

  const res = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Falha ao criar solicitação')

  revalidatePath('/requests')
  redirect('/requests')
}

export async function deleteRequest(id) {
  await fetch(`${API_URL}/requests/${id}`, { method: 'DELETE' })
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
    headers: { 'Content-Type': 'application/json' },
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

  const getRes = await fetch(`${API_URL}/processes/${id}`, { cache: 'no-store' })
  const process = await getRes.json()

  const res = await fetch(`${API_URL}/processes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...process, status }),
  })

  if (!res.ok) throw new Error('Falha ao atualizar status')

  revalidatePath(`/processes/${id}`)
  revalidatePath('/processes')
}
