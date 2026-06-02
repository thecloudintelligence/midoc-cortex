import { useState } from 'react'
import { Stethoscope, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch {
      // error in store
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D6E6E] text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Doctor notes</h1>
          <p className="text-center text-sm text-[var(--color-muted)]">
            Sign in, pick a patient, then chat with their chart notes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[#0D6E6E]/50 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20"
              placeholder="doctor@clinic.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[#0D6E6E]/50 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-error)]" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {import.meta.env.VITE_USE_MOCK === 'true' && (
          <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
            Mock mode: any email/password works. Notes load via agent only.
          </p>
        )}
      </div>
    </div>
  )
}
