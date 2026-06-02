import { useState } from 'react'
import { Activity, UserCircle, Settings, Stethoscope, ChevronDown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { PatientContext } from '@/types/chat'
import type { ConnectionStatus } from '@/lib/api'
import { SettingsModal } from '@/components/modals/SettingsModal'
import { PatientPickerModal } from '@/components/modals/PatientPickerModal'
import { useAuthStore } from '@/store/authStore'

interface TopBarProps {
  patient: PatientContext | null
  connectionStatus: ConnectionStatus
  onEndSession: () => void
}

export function TopBar({ patient, connectionStatus, onEndSession }: TopBarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const { doctorName, logout } = useAuthStore()

  const patientLabel = patient
    ? `${patient.name} · ${patient.mrn ?? patient.id}`
    : 'Select patient'

  const initials = doctorName
    ? doctorName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'DR'

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--color-border)] bg-white px-4">
        <div className="flex min-w-[120px] items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D6E6E] text-white">
            <Stethoscope className="h-4 w-4" />
          </div>
          <span className="hidden font-semibold sm:inline">Notes</span>
        </div>

        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className={cn(
              'inline-flex max-w-lg items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              patient
                ? 'border-[#0D6E6E]/30 bg-[#0D6E6E]/5 text-[#0D6E6E]'
                : 'border-dashed border-[var(--color-muted)]/50 text-[var(--color-muted)] hover:border-[#0D6E6E]/40',
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
              Clear
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <PatientPickerModal open={pickerOpen} onOpenChange={setPickerOpen} />
    </>
  )
}
