import type { PatientCandidate } from '@/types/chat'
import { parsePatientSearch, parseToolError } from '@/lib/parseTool'
import { mockSearchPatients } from '@/lib/patientMock'

const API_URL = import.meta.env.VITE_AGENT_API_URL ?? 'http://localhost:8080'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

function authHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function searchPatients(
  query: string,
  options?: { token?: string | null; page?: number; pageSize?: number },
): Promise<PatientCandidate[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    return mockSearchPatients(query)
  }

  const params = new URLSearchParams()
  if (query.trim()) params.set('q', query.trim())
  if (options?.page) params.set('page', String(options.page))
  if (options?.pageSize) params.set('page_size', String(options.pageSize))

  const res = await fetch(`${API_URL}/v1/patients/search?${params.toString()}`, {
    headers: authHeaders(options?.token),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || `HTTP ${res.status}`)
  }

  const payload = (await res.json()) as Record<string, unknown>
  const err = parseToolError(JSON.stringify(payload))
  if (err) throw new Error(err)

  return parsePatientSearch(JSON.stringify(payload))
}
