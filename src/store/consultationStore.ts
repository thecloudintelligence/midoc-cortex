import { create } from 'zustand'
import type { ConsultationContext, PatientContext } from '@/types/chat'

interface ConsultationState {
  context: ConsultationContext | null
  patient: PatientContext | null
  error: string | null

  openConsultation: (ctx: ConsultationContext, patient: PatientContext) => void
  clearConsultation: () => void
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  context: null,
  patient: null,
  error: null,

  openConsultation: (ctx, patient) => {
    set({
      context: ctx,
      patient,
      error: null,
    })
  },

  clearConsultation: () => {
    set({
      context: null,
      patient: null,
      error: null,
    })
  },
}))
