import { create } from 'zustand'
import { sendChat, checkHealth } from '@/lib/api'
import { messagesForUi } from '@/lib/chatMessages'
import { DEMO_MESSAGES } from '@/lib/mock'
import type {
  ChatMessage,
  ConsultationContext,
  PatientContext,
  PendingAction,
} from '@/types/chat'
import type { ConnectionStatus } from '@/lib/api'
import { scopeFromAuth } from '@/lib/agentScope'
import { useAuthStore } from '@/store/authStore'
import { useConsultationStore } from '@/store/consultationStore'

const LOAD_NOTES_PROMPT =
  'Load the current doctor notes for this patient and appointment using doctor_notes_get. Give a brief one-line confirmation.'

interface CopilotState {
  messages: ChatMessage[]
  threadId: string | null
  isLoading: boolean
  loadingStep: string | null
  error: string | null
  connectionStatus: ConnectionStatus
  pendingActions: PendingAction[]

  init: () => Promise<void>
  startConsultation: (ctx: ConsultationContext, patient: PatientContext) => Promise<void>
  clearChat: () => void
  loadDemo: () => void
  sendMessage: (content: string, options?: { hidden?: boolean }) => Promise<void>
  regenerate: () => Promise<void>
  confirmAction: (id: string) => Promise<void>
  dismissAction: (id: string) => void
}

export const useCopilotStore = create<CopilotState>((set, get) => ({
  messages: [],
  threadId: null,
  isLoading: false,
  loadingStep: null,
  error: null,
  connectionStatus: 'unknown',
  pendingActions: [],

  init: async () => {
    const status = await checkHealth()
    set({ connectionStatus: status })
  },

  startConsultation: async (ctx, patient) => {
    useConsultationStore.getState().openConsultation(ctx, patient)
    set({
      messages: [],
      threadId: null,
      pendingActions: [],
      error: null,
    })
    await get().sendMessage(LOAD_NOTES_PROMPT, { hidden: true })
  },

  clearChat: () => {
    useConsultationStore.getState().clearConsultation()
    set({ messages: [], threadId: null, pendingActions: [], error: null })
  },

  loadDemo: () => {
    const patient: PatientContext = {
      id: 'p-101',
      name: 'Tanish Khandelwal',
      mrn: 'MRN-88421',
    }
    const ctx: ConsultationContext = {
      patientId: 'p-101',
      appointmentId: 'apt-001',
      doctorId: 'doc-1',
      hospitalId: 'hosp-1',
      branchId: 'branch-1',
    }
    useConsultationStore.getState().openConsultation(ctx, patient)
    set({ messages: DEMO_MESSAGES, error: null, isLoading: false })
  },

  sendMessage: async (content, options) => {
    const trimmed = content.trim()
    if (!trimmed || get().isLoading) return

    const consultation = useConsultationStore.getState()
    if (!consultation.context) {
      set({ error: 'Select a patient first' })
      return
    }

    const { messages, threadId } = get()
    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const apiMessages = [...messages, userMsg]

    set({
      messages: options?.hidden ? messages : apiMessages,
      isLoading: true,
      loadingStep: 'Thinking about the notes…',
      error: null,
    })

    try {
      const auth = useAuthStore.getState()
      const response = await sendChat(apiMessages, {
        threadId: threadId ?? undefined,
        consultation: consultation.context,
        scope: scopeFromAuth(auth),
      })

      const lastAssistant = [...response.messages]
        .reverse()
        .find((m) => m.role === 'assistant')
      if (lastAssistant?.content && !options?.hidden) {
        const lower = lastAssistant.content.toLowerCase()
        const hasDraft =
          lower.includes('note') &&
          (lower.includes('save') || lower.includes('draft') || lower.includes('update'))
        if (hasDraft && !get().pendingActions.some((a) => a.status === 'pending')) {
          set({
            pendingActions: [
              ...get().pendingActions,
              {
                id: crypto.randomUUID(),
                type: 'note_draft',
                summary: 'Apply note update via agent',
                detail: lastAssistant.content.slice(0, 200),
                payload: lastAssistant.content,
                status: 'pending',
              },
            ],
          })
        }
      }

      const rawVisible = options?.hidden
        ? response.messages.filter(
            (m) => !(m.role === 'user' && m.content === LOAD_NOTES_PROMPT),
          )
        : response.messages

      set({
        messages: messagesForUi(rawVisible),
        threadId: response.thread_id ?? threadId,
        isLoading: false,
        loadingStep: null,
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Request failed'
      set({
        isLoading: false,
        loadingStep: null,
        error: message,
        messages: options?.hidden ? messages : apiMessages,
      })
    }
  },

  regenerate: async () => {
    const { messages } = get()
    const lastUserIdx = [...messages].map((m) => m.role).lastIndexOf('user')
    if (lastUserIdx < 0) return
    set({ messages: messages.slice(0, lastUserIdx) })
    await get().sendMessage(messages[lastUserIdx].content)
  },

  confirmAction: async (id) => {
    const action = get().pendingActions.find((a) => a.id === id)
    if (!action || action.status !== 'pending' || !action.payload) return

    await get().sendMessage(
      `Save the following doctor notes update using doctor_notes_save:\n\n${action.payload}`,
    )

    set({
      pendingActions: get().pendingActions.map((a) =>
        a.id === id ? { ...a, status: 'confirmed' as const } : a,
      ),
    })
  },

  dismissAction: (id) => {
    set({
      pendingActions: get().pendingActions.map((a) =>
        a.id === id ? { ...a, status: 'dismissed' as const } : a,
      ),
    })
  },
}))
