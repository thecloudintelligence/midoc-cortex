import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { doctorSignIn } from '@/lib/agentAuth'
import { mockSignIn } from '@/lib/midocMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

interface AuthState {
  token: string | null
  doctorId: string | null
  hospitalId: string | null
  branchId: string | null
  doctorName: string | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}

function envIds() {
  return {
    doctorId: import.meta.env.VITE_MIDOC_DOCTOR_ID ?? null,
    hospitalId: import.meta.env.VITE_MIDOC_HOSPITAL_ID ?? null,
    branchId: import.meta.env.VITE_MIDOC_BRANCH_ID ?? null,
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      doctorId: envIds().doctorId,
      hospitalId: envIds().hospitalId,
      branchId: envIds().branchId,
      doctorName: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const result = USE_MOCK
            ? mockSignIn(email, password)
            : await doctorSignIn(email, password)

          const fallback = envIds()
          set({
            token: result.token ?? null,
            doctorId: result.doctorid ?? fallback.doctorId,
            hospitalId: result.hospitalid ?? fallback.hospitalId,
            branchId: result.branchid ?? fallback.branchId,
            doctorName: result.name ?? email.split('@')[0],
            isLoading: false,
          })

          if (!get().doctorId || !get().hospitalId || !get().branchId) {
            throw new Error(
              'Missing doctor scope. Set IDs in agent .env or ensure sign-in returns doctorid, hospitalid, branchid.',
            )
          }
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Login failed'
          set({ isLoading: false, error: message })
          throw e
        }
      },

      logout: () => {
        const fallback = envIds()
        set({
          token: null,
          doctorId: fallback.doctorId,
          hospitalId: fallback.hospitalId,
          branchId: fallback.branchId,
          doctorName: null,
          error: null,
        })
      },

      isAuthenticated: () =>
        Boolean(get().token && get().doctorId && get().hospitalId && get().branchId),
    }),
    {
      name: 'midoc-auth',
      partialize: (s) => ({
        token: s.token,
        doctorId: s.doctorId,
        hospitalId: s.hospitalId,
        branchId: s.branchId,
        doctorName: s.doctorName,
      }),
    },
  ),
)
