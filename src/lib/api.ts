import type { AgentMeta, ChatMessage, ChatResponse, ConsultationContext } from '@/types/chat'
import { buildAuthHeaders, type DoctorScope } from '@/lib/agentScope'
import { messagesForApi } from '@/lib/chatMessages'
import { mockChatResponse } from '@/lib/mock'

const API_URL = import.meta.env.VITE_AGENT_API_URL ?? 'http://localhost:8080'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export type ConnectionStatus = 'unknown' | 'healthy' | 'unavailable'

export interface SendChatOptions {
  threadId?: string
  consultation?: ConsultationContext | null
  scope: DoctorScope
}

export async function checkHealth(): Promise<ConnectionStatus> {
  if (USE_MOCK) return 'healthy'
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) })
    return res.ok ? 'healthy' : 'unavailable'
  } catch {
    return 'unavailable'
  }
}

export async function fetchMeta(): Promise<AgentMeta | null> {
  if (USE_MOCK) {
    return {
      service: 'midoc-agents',
      tools: [
        { name: 'doctor_notes_get', description: 'Load doctor notes' },
        { name: 'doctor_notes_save', description: 'Save doctor notes' },
        { name: 'patient_search', description: 'Search patients' },
      ],
    }
  }
  try {
    const res = await fetch(`${API_URL}/v1/meta`)
    if (!res.ok) return null
    return (await res.json()) as AgentMeta
  } catch {
    return null
  }
}

export async function sendChat(
  messages: ChatMessage[],
  options: SendChatOptions,
): Promise<ChatResponse> {
  const { threadId, consultation, scope } = options

  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200))
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    return mockChatResponse(lastUser?.content ?? '', threadId)
  }

  const apiMessages = messagesForApi(messages)
  if (apiMessages.length === 0) {
    throw new Error('No messages to send')
  }

  const body: Record<string, unknown> = {
    messages: apiMessages,
    thread_id: threadId,
  }

  if (consultation) {
    body.patient_id = consultation.patientId
    body.appointment_id = consultation.appointmentId
  }

  if (scope.doctorId) body.doctor_id = scope.doctorId
  if (scope.hospitalId) body.hospital_id = scope.hospitalId
  if (scope.branchId) body.branch_id = scope.branchId

  const res = await fetch(`${API_URL}/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(scope),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(res.status === 401 || res.status === 403 ? 'Unauthorized' : text || `HTTP ${res.status}`)
  }

  return (await res.json()) as ChatResponse
}

export function getApiBaseUrl(): string {
  return API_URL
}
