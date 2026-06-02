import { mockSignIn } from '@/lib/midocMock'
import type { DoctorSignInResult } from '@/types/chat'

const API_URL = import.meta.env.VITE_AGENT_API_URL ?? 'http://localhost:8080'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function doctorSignIn(
  email: string,
  password: string,
): Promise<DoctorSignInResult> {
  if (USE_MOCK) return mockSignIn(email, password)

  const res = await fetch(`${API_URL}/v1/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const text = await res.text()
  let data = {} as DoctorSignInResult & { detail?: string }
  try {
    data = JSON.parse(text) as typeof data
  } catch {
    /* non-JSON error body */
  }

  if (!res.ok) {
    throw new Error(
      (typeof data.detail === 'string' && data.detail) ||
        text ||
        `Sign-in failed (${res.status})`,
    )
  }

  if (!data.token) {
    throw new Error('Sign-in did not return a token')
  }
  return data
}
