export type MessageRole = 'user' | 'assistant' | 'tool' | 'system'

export interface ChatMessage {
  role: MessageRole
  content: string
  name?: string
  tool_call_id?: string
  tool_calls?: unknown[]
}

export interface ConsultationContext {
  patientId: string
  appointmentId: string
  doctorId: string
  hospitalId: string
  branchId: string
}

export interface PatientCandidate {
  id: string
  name: string
  dob?: string
  mrn?: string
  age?: number
  sex?: string
  appointmentId?: string
  appointmentDate?: string
  appointmentTime?: string
}

export interface PatientContext {
  id: string
  name: string
  age?: number
  sex?: string
  mrn?: string
  allergies?: string[]
  conditions?: string[]
  activeMeds?: string[]
  lastVisitSummary?: string
}

export interface AppointmentOption {
  id: string
  date: string
  time?: string
  reason?: string
}

export interface MidocChatMessage {
  chatid?: string
  chat?: string
  message?: string
  ispatient?: number | boolean
  createddate?: string
  createdat?: string
  sender?: string
}

export interface DoctorNotes {
  info?: string
  medicinedetail?: Array<Record<string, unknown>>
  orders?: Record<string, unknown>
  [key: string]: unknown
}

export interface PendingAction {
  id: string
  type: 'chat_draft' | 'note_draft' | 'chart_note'
  summary: string
  detail?: string
  payload?: string
  status: 'pending' | 'confirmed' | 'dismissed'
}

export interface ConsultationSession {
  id: string
  title: string
  startedAt: Date
  messageCount: number
  patientName?: string
  context?: ConsultationContext
}

export interface ChatResponse {
  messages: ChatMessage[]
  thread_id?: string
}

export interface AgentMeta {
  service: string
  tools: { name: string; description: string }[]
}

export interface HistoryItem {
  id: string
  date: string
  summary: string
}

export interface ReportItem {
  id: string
  title: string
  date: string
  type: string
}

export interface DoctorBranch {
  branchid: string
  hospitalid: string
  hospitalname?: string
  branchname?: string
  roleid?: string
}

export interface DoctorSignInResult {
  token: string
  doctorid?: string
  hospitalid?: string
  branchid?: string
  name?: string
  branches?: DoctorBranch[]
}
