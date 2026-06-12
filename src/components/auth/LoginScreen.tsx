import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import type { DoctorBranch } from '@/types/chat'
import { MidocLogo } from '@/components/brand/MidocLogo'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedBranchKey, setSelectedBranchKey] = useState<string | null>(null)

  const {
    login,
    selectBranch,
    isLoading,
    error,
    needsBranchSelection,
    branches,
    doctorName,
  } = useAuthStore()

  const showBranchStep = needsBranchSelection()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch {
      // error in store
    }
  }

  const handleBranchConfirm = () => {
    const branch = branches.find(
      (b) => `${b.hospitalid}-${b.branchid}` === selectedBranchKey,
    )
    if (branch) selectBranch(branch)
  }

  const branchLabel = (b: DoctorBranch) => {
    const parts = [b.hospitalname, b.branchname].filter(Boolean)
    if (parts.length > 0) return parts.join(' — ')
    return `Hospital ${b.hospitalid}, Branch ${b.branchid}`
  }

  const inputClassName =
    'w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm focus:border-[var(--color-muted-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-muted-dark)]/20'

  if (showBranchStep) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--color-background)] px-4">
        <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-[var(--color-foreground)]">Select clinic</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {doctorName ? `Signed in as ${doctorName}. ` : ''}
            Choose which clinic/branch to use for this session.
          </p>

          <div className="mt-4 space-y-2">
            {branches.map((b) => {
              const key = `${b.hospitalid}-${b.branchid}`
              return (
                <label
                  key={key}
                  className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-button)] border px-3 py-2 text-sm ${
                    selectedBranchKey === key
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="branch"
                    value={key}
                    checked={selectedBranchKey === key}
                    onChange={() => setSelectedBranchKey(key)}
                    className="mt-1"
                  />
                  <span>{branchLabel(b)}</span>
                </label>
              )
            })}
          </div>

          {error && (
            <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">
              {error}
            </p>
          )}

          <Button
            className="mt-6 w-full"
            disabled={!selectedBranchKey}
            onClick={handleBranchConfirm}
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <MidocLogo className="h-10" />
          <h1 className="text-xl font-semibold text-[var(--color-foreground)]">Login</h1>
          <p className="text-center text-sm text-[var(--color-muted)]">
            Sign in with your Midoc doctor account, then pick a patient.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClassName}
              placeholder="doctor@clinic.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClassName}
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
              'Continue'
            )}
          </Button>
        </form>

        {import.meta.env.VITE_USE_MOCK === 'true' && (
          <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
            Mock mode: any email/password works.
          </p>
        )}
      </div>
    </div>
  )
}
