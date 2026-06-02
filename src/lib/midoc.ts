import type {
  ConsultationContext,
  DoctorNotes,
  DoctorSignInResult,
  MidocChatMessage,
  PatientContext,
} from '@/types/chat'
import {
  mockGetChat,
  mockGetDoctorNotes,
  mockGetPatientDetails,
  mockSignIn,
} from '@/lib/midocMock'

const MIDOC_API_URL =
  import.meta.env.VITE_MIDOC_API_URL ?? 'https://midoc-api-dev.azurewebsites.net/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export class MidocApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MidocApiError'
  }
}

export async function midocRpc<T>(
  token: string,
  functionName: string,
  input: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${MIDOC_API_URL}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ input }),
  })

  if (!res.ok) {
    throw new MidocApiError(`HTTP ${res.status}: ${res.statusText}`)
  }

  const json = await res.json()
  if (json?.output?.result === 'failure') {
    throw new MidocApiError(json.output.message ?? 'Midoc API failed')
  }
  return (json.output?.data ?? json.output) as T
}

function ctxInput(ctx: ConsultationContext, extra: Record<string, unknown> = {}) {
  return {
    doctorid: ctx.doctorId,
    patientid: ctx.patientId,
    appointmentid: ctx.appointmentId,
    hospitalid: ctx.hospitalId,
    branchid: ctx.branchId,
    ...extra,
  }
}

export async function doctorSignIn(
  email: string,
  password: string,
): Promise<DoctorSignInResult> {
  if (USE_MOCK) return mockSignIn(email, password)

  const res = await fetch(`${MIDOC_API_URL}/midoc_doctorsignin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { email, password } }),
  })
  if (!res.ok) throw new MidocApiError(`HTTP ${res.status}: ${res.statusText}`)
  const json = await res.json()
  if (json?.output?.result === 'failure') {
    throw new MidocApiError(json.output.message ?? 'Sign-in failed')
  }
  const output = json.output as Record<string, unknown> | undefined
  const data = (output?.data ?? output ?? {}) as Record<string, unknown>

  const token = String(output?.token ?? data.token ?? '')
  if (!token) throw new MidocApiError('Sign-in did not return a token')

  const loginId = data.loginid ?? data.doctorid
  const fullName = data.fullname ?? data.name ?? data.doctorname

  return {
    token,
    doctorid: loginId != null ? String(loginId) : undefined,
    hospitalid: data.hospitalid != null ? String(data.hospitalid) : undefined,
    branchid: data.branchid != null ? String(data.branchid) : undefined,
    name: fullName != null ? String(fullName) : undefined,
  }
}

export async function getChatByDoctor(
  token: string,
  ctx: ConsultationContext,
): Promise<MidocChatMessage[]> {
  if (USE_MOCK) return mockGetChat()
  const data = await midocRpc<MidocChatMessage[] | { chats?: MidocChatMessage[] }>(
    token,
    'midoc_getchatbydoctor',
    ctxInput(ctx),
  )
  if (Array.isArray(data)) return data
  return data.chats ?? []
}

export async function addChat(
  token: string,
  ctx: ConsultationContext,
  message: string,
): Promise<unknown> {
  if (USE_MOCK) {
    return { success: true, chat: message }
  }
  return midocRpc(token, 'midoc_addchat', ctxInput(ctx, { chat: message, ispatient: 0 }))
}

export async function updateChat(
  token: string,
  ctx: ConsultationContext,
  chatId: string,
  message: string,
): Promise<unknown> {
  if (USE_MOCK) return { success: true }
  return midocRpc(
    token,
    'midoc_updatechat',
    ctxInput(ctx, { chatid: chatId, chat: message }),
  )
}

export async function getDoctorNotes(
  token: string,
  ctx: ConsultationContext,
): Promise<DoctorNotes> {
  if (USE_MOCK) return mockGetDoctorNotes()
  return midocRpc<DoctorNotes>(token, 'midoc_getdoctornotes', ctxInput(ctx))
}

export async function updateDoctorNotes(
  token: string,
  ctx: ConsultationContext,
  notes: DoctorNotes,
): Promise<unknown> {
  if (USE_MOCK) return { success: true }
  return midocRpc(token, 'midoc_updatedoctornotes', ctxInput(ctx, notes))
}

export async function getChatMedia(
  token: string,
  ctx: ConsultationContext,
): Promise<unknown[]> {
  if (USE_MOCK) return []
  const data = await midocRpc<unknown[] | { media?: unknown[] }>(
    token,
    'midoc_getchatmediabydoctor',
    ctxInput(ctx),
  )
  if (Array.isArray(data)) return data
  return (data as { media?: unknown[] }).media ?? []
}

export async function getPatientDetails(
  token: string,
  patientId: string,
): Promise<PatientContext> {
  if (USE_MOCK) return mockGetPatientDetails(patientId)
  const data = await midocRpc<Record<string, unknown>>(token, 'midoc_getpatientdetails', {
    patientid: patientId,
  })
  return {
    id: patientId,
    name: String(data.fullname ?? data.full_name ?? data.name ?? 'Unknown'),
    age: data.age ? Number(data.age) : undefined,
    sex: data.sex ? String(data.sex) : data.gender ? String(data.gender) : undefined,
    mrn: data.mrn ? String(data.mrn) : undefined,
  }
}

export async function loadNotesData(
  token: string,
  ctx: ConsultationContext,
) {
  const [notes, patient] = await Promise.all([
    getDoctorNotes(token, ctx),
    getPatientDetails(token, ctx.patientId),
  ])
  return { notes, patient }
}

export async function loadConsultationData(
  token: string,
  ctx: ConsultationContext,
) {
  const [chat, notes, media, patient] = await Promise.all([
    getChatByDoctor(token, ctx),
    getDoctorNotes(token, ctx),
    getChatMedia(token, ctx),
    getPatientDetails(token, ctx.patientId),
  ])
  return { chat, notes, media, patient }
}

export function getMidocApiUrl(): string {
  return MIDOC_API_URL
}
