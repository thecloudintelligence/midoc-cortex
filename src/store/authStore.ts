import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { doctorSignIn } from '@/lib/agentAuth'
import { mockSignIn } from '@/lib/midocMock'
import type { DoctorBranch } from '@/types/chat'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

interface AuthState {
  token: string | null
  doctorId: string | null
  hospitalId: string | null
  branchId: string | null
  doctorName: string | null
  branches: DoctorBranch[]
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  selectBranch: (branch: DoctorBranch) => void
  logout: () => void
  isAuthenticated: () => boolean
  needsBranchSelection: () => boolean
}

function idsFromSignIn(result: {
  doctorid?: string
  hospitalid?: string
  branchid?: string
}) {
  return {
    doctorId: result.doctorid != null ? String(result.doctorid) : null,
    hospitalId: result.hospitalid != null ? String(result.hospitalid) : null,
    branchId: result.branchid != null ? String(result.branchid) : null,
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      doctorId: null,
      hospitalId: null,
      branchId: null,
      doctorName: null,
      branches: [],
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const result = USE_MOCK
            ? mockSignIn(email, password)
            : await doctorSignIn(email, password)

          const ids = idsFromSignIn(result)
          const branches = result.branches ?? []

          set({
            token: result.token ?? null,
            doctorId: ids.doctorId,
            hospitalId: ids.hospitalId,
            branchId: ids.branchId,
            doctorName: result.name ?? email.split('@')[0],
            branches,
            isLoading: false,
          })

          if (!get().token || !get().doctorId) {
            throw new Error('Sign-in did not return doctor id or token')
          }

          if (!get().hospitalId || !get().branchId) {
            if (branches.length === 1) {
              get().selectBranch(branches[0])
            } else if (branches.length === 0) {
              throw new Error(
                'Sign-in did not return clinic/branch. Contact support or try the main Midoc app login.',
              )
            }
          }
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Login failed'
          set({ isLoading: false, error: message })
          throw e
        }
      },

      selectBranch: (branch) => {
        set({
          hospitalId: String(branch.hospitalid),
          branchId: String(branch.branchid),
          error: null,
        })
      },

      logout: () => {
        set({
          token: null,
          doctorId: null,
          hospitalId: null,
          branchId: null,
          doctorName: null,
          branches: [],
          error: null,
        })
      },

      isAuthenticated: () => {
        const s = get()
        return Boolean(s.token && s.doctorId && s.hospitalId && s.branchId)
      },

      needsBranchSelection: () => {
        const s = get()
        return Boolean(
          s.token &&
            s.doctorId &&
            (!s.hospitalId || !s.branchId) &&
            s.branches.length > 1,
        )
      },
    }),
    {
      name: 'midoc-auth',
      partialize: (s) => ({
        token: s.token,
        doctorId: s.doctorId,
        hospitalId: s.hospitalId,
        branchId: s.branchId,
        doctorName: s.doctorName,
        branches: s.branches,
      }),
    },
  ),
)
