import type { AppointmentOption, PatientCandidate, HistoryItem, ReportItem } from '@/types/chat'

export function parsePatientSearch(content: string): PatientCandidate[] {
  try {
    const data = JSON.parse(content) as {
      candidates?: PatientCandidate[]
      patients?: PatientCandidate[]
      results?: PatientCandidate[]
      data?: Array<Record<string, unknown>>
      error?: string
    }
    if (data.error) return []

    const rawList: Array<Record<string, unknown>> =
      data.candidates?.map(asRecord) ??
      data.patients?.map(asRecord) ??
      data.results?.map(asRecord) ??
      data.data ??
      []

    return rawList.map((p, i) => normalizePatientCandidate(p, i))
  } catch {
    return []
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

function normalizePatientCandidate(
  p: Record<string, unknown>,
  i = 0,
): PatientCandidate {
  const legacy =
    typeof p._legacy_raw === 'object' && p._legacy_raw !== null
      ? (p._legacy_raw as Record<string, unknown>)
      : null

  const rowKey =
    p.appointmentId ??
    p.appointment_id ??
    p.appointmentid ??
    legacy?.appointmentid ??
    legacy?.appointment_id

  const patientKey =
    p.id ?? p.patient_id ?? p.patientid ?? legacy?.patientid ?? `candidate-${i}`

  const appointmentDate =
    p.appointmentDate ??
    p.appointment_date ??
    p.appointmentdate ??
    legacy?.appointmentdate ??
    legacy?.appointment_date

  const appointmentTime =
    p.appointmentTime ??
    p.appointment_time ??
    p.appointmenttime ??
    legacy?.appointmenttime ??
    legacy?.appointment_time

  return {
    id: String(patientKey),
    name: String(p.name ?? p.full_name ?? p.fullname ?? legacy?.fullname ?? 'Unknown'),
    dob: p.dob
      ? String(p.dob)
      : p.date_of_birth
        ? String(p.date_of_birth)
        : legacy?.dob
          ? String(legacy.dob)
          : undefined,
    mrn: p.mrn
      ? String(p.mrn)
      : p.uniqueid
        ? String(p.uniqueid)
        : legacy?.uniqueid
          ? String(legacy.uniqueid)
          : undefined,
    age: p.age != null && p.age !== '' ? Number(p.age) : undefined,
    sex: p.sex ? String(p.sex) : p.gender ? String(p.gender) : undefined,
    appointmentId: rowKey != null && rowKey !== '' ? String(rowKey) : undefined,
    appointmentDate: appointmentDate != null && appointmentDate !== ''
      ? String(appointmentDate)
      : undefined,
    appointmentTime: appointmentTime != null && appointmentTime !== ''
      ? String(appointmentTime)
      : undefined,
  }
}

export function parseToolError(content: string): string | null {
  try {
    const data = JSON.parse(content) as { error?: string }
    return data.error ?? null
  } catch {
    return null
  }
}

export function parseAppointmentHistory(data: unknown): AppointmentOption[] {
  const list = extractArray(data)
  return list
    .map((item, i) => normalizeAppointment(item as Record<string, unknown>, i))
    .filter((a): a is AppointmentOption => Boolean(a.id))
}

function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    for (const key of ['data', 'appointments', 'history', 'visits', 'items']) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[]
    }
  }
  return []
}

function normalizeAppointment(
  item: Record<string, unknown>,
  i: number,
): AppointmentOption {
  const id = String(
    item.appointmentid ??
      item.appointment_id ??
      item.appointmentId ??
      item.id ??
      item.visitid ??
      `apt-${i}`,
  )
  const dateRaw =
    item.appointmentdate ??
    item.appointment_date ??
    item.scheduleddate ??
    item.visitdate ??
    item.date ??
    item.createddate ??
    ''
  const dateStr = String(dateRaw).slice(0, 10)
  const time =
    item.appointmenttime ??
    item.time ??
    item.visittime
      ? String(item.appointmenttime ?? item.time ?? item.visittime)
      : undefined
  const reason = String(
    item.reason ??
      item.visitreason ??
      item.chiefcomplaint ??
      item.appointmenttype ??
      item.appointmentstatus ??
      item.summary ??
      item.notes ??
      'Visit',
  )

  return {
    id,
    date: dateStr || '—',
    time: time ? String(time).slice(0, 5) : undefined,
    reason,
  }
}

export function parseHistory(content: string): HistoryItem[] {
  try {
    const data = JSON.parse(content) as {
      visits?: HistoryItem[]
      history?: HistoryItem[]
      data?: HistoryItem[]
    }
    return data.visits ?? data.history ?? data.data ?? []
  } catch {
    return []
  }
}

export function parseReports(content: string): ReportItem[] {
  try {
    const data = JSON.parse(content) as {
      reports?: ReportItem[]
      documents?: ReportItem[]
      data?: ReportItem[]
    }
    return data.reports ?? data.documents ?? data.data ?? []
  } catch {
    return []
  }
}

export function parseChatGet(content: string): Array<{ message?: string; chat?: string; ispatient?: number }> {
  try {
    const data = JSON.parse(content) as
      | Array<{ message?: string; chat?: string; ispatient?: number }>
      | { chats?: Array<{ message?: string; chat?: string; ispatient?: number }>; data?: unknown[] }
    if (Array.isArray(data)) return data
    if (Array.isArray(data.chats)) return data.chats
    if (Array.isArray(data.data)) return data.data as Array<{ message?: string; chat?: string }>
    return []
  } catch {
    return []
  }
}

export function parseDoctorNotesGet(content: string): Record<string, unknown> | null {
  try {
    const data = JSON.parse(content) as Record<string, unknown> & { error?: string }
    if (data.error) return null
    return data
  } catch {
    return null
  }
}

export function parseChatSend(content: string): { success?: boolean; message?: string } | null {
  try {
    return JSON.parse(content) as { success?: boolean; message?: string }
  } catch {
    return null
  }
}

export function parseDoctorNotesSave(content: string): { success?: boolean } | null {
  try {
    return JSON.parse(content) as { success?: boolean }
  } catch {
    return null
  }
}
