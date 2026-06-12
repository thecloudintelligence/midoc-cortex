import { useState } from 'react'
import { Activity, UserCircle, ChevronDown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PatientContext } from '@/types/chat'
import type { ConnectionStatus } from '@/lib/api'
import { PatientPickerModal } from '@/components/modals/PatientPickerModal'
import { useAuthStore } from '@/store/authStore'
import { MidocLogo } from '@/components/brand/MidocLogo'

interface TopBarProps {
  patient: PatientContext | null
  connectionStatus: ConnectionStatus
  onEndSession: () => void
}

export function TopBar({ patient, connectionStatus, onEndSession }: TopBarProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const { doctorName, logout } = useAuthStore()

  const patientLabel = patient
    ? `${patient.name} · ${patient.mrn ?? patient.id}`
    : 'Select patient'

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--color-border)] bg-white px-4">
        <div className="flex min-w-[120px] items-center gap-2">
          <MidocLogo variant="icon" />
          <span className="hidden font-semibold text-[var(--color-foreground)] sm:inline">
            Doctor notes
          </span>
        </div>

        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className={cn(
              'inline-flex max-w-lg items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              patient
                ? 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 text-[var(--color-accent)]'
                : 'border-dashed border-[var(--color-muted)]/50 text-[var(--color-muted)] hover:border-[var(--color-accent)]/40',
            )}
          >
            <UserCircle className="h-4 w-4 shrink-0" />
            <span className="truncate">{patientLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {connectionStatus === 'unavailable' && (
            <span className="hidden items-center gap-1 text-xs text-[var(--color-error)] lg:inline-flex">
              <Activity className="h-3.5 w-3.5" />
              Offline
            </span>
          )}
          {patient && (
            <Button variant="secondary" size="sm" className="hidden md:inline-flex" onClick={onEndSession}>
              Clear session
            </Button>
          )}
          {doctorName && (
            <span className="hidden max-w-[140px] truncate text-xs text-[var(--color-muted)] lg:inline">
              {doctorName}
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <PatientPickerModal open={pickerOpen} onOpenChange={setPickerOpen} />
    </>
  )
}
