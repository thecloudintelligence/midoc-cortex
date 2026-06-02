import { create } from 'zustand'
import type { ConsultationContext, DoctorNotes, PatientContext } from '@/types/chat'
import { parseDoctorNotesGet } from '@/lib/parseTool'
import type { ChatMessage } from '@/types/chat'

interface ConsultationState {
  context: ConsultationContext | null
  patient: PatientContext | null
  notes: DoctorNotes | null
  notesPreview: string
  isLoadingNotes: boolean
  error: string | null

  openConsultation: (ctx: ConsultationContext, patient: PatientContext) => void
  clearConsultation: () => void
  setNotesLoading: (loading: boolean) => void
  syncNotesFromMessages: (messages: ChatMessage[]) => void
}

function notesToPreview(notes: DoctorNotes): string {
  if (typeof notes.info === 'string' && notes.info.trim()) return notes.info
  return JSON.stringify(notes, null, 2)
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  context: null,
  patient: null,
  notes: null,
  notesPreview: '',
  isLoadingNotes: false,
  error: null,

  openConsultation: (ctx, patient) => {
    set({
      context: ctx,
      patient,
      notes: null,
      notesPreview: '',
      isLoadingNotes: true,
      error: null,
    })
  },

  clearConsultation: () => {
    set({
      context: null,
      patient: null,
      notes: null,
      notesPreview: '',
      isLoadingNotes: false,
      error: null,
    })
  },

  setNotesLoading: (loading) => set({ isLoadingNotes: loading }),

  syncNotesFromMessages: (messages) => {
    let latest: DoctorNotes | null = null
    for (const msg of messages) {
      if (msg.role !== 'tool' || msg.name !== 'doctor_notes_get') continue
      const parsed = parseDoctorNotesGet(msg.content)
      if (parsed) latest = parsed as DoctorNotes
    }
    if (!latest) return
    set({
      notes: latest,
      notesPreview: notesToPreview(latest),
      isLoadingNotes: false,
      error: null,
    })
  },
}))
