import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useCopilotStore } from '@/store/copilotStore'
import { scopeFromAuth } from '@/lib/agentScope'
import { searchPatients } from '@/lib/agentPatients'
import type { ConsultationContext, PatientCandidate, PatientContext } from '@/types/chat'

interface PatientPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function rowKey(p: PatientCandidate): string {
  return `${p.id}-${p.appointmentId ?? 'none'}`
}

export function PatientPickerModal({ open, onOpenChange }: PatientPickerModalProps) {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<PatientCandidate[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const auth = useAuthStore()
  const { doctorId, hospitalId, branchId } = auth
  const startConsultation = useCopilotStore((s) => s.startConsultation)

  const selected = rows.find((r) => rowKey(r) === selectedKey)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery('')
      setRows([])
      setSelectedKey(null)
      setSearchError(null)
    }
    onOpenChange(nextOpen)
  }

  const runSearch = useCallback(
    async (q: string) => {
      setIsSearching(true)
      setSearchError(null)
      try {
        const results = await searchPatients(q, {
          scope: scopeFromAuth(auth),
        })
        setRows(results)
        if (results.length === 0) {
          setSearchError('No patients in your appointment queue for this clinic.')
        }
      } catch (e) {
        setSearchError(e instanceof Error ? e.message : 'Failed to load patients')
        setRows([])
      } finally {
        setIsSearching(false)
      }
    },
    [auth.token, auth.doctorId, auth.hospitalId, auth.branchId],
  )

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => runSearch(query), 350)
    return () => clearTimeout(timer)
  }, [open, query, runSearch])

  const handleConfirm = async () => {
    if (!selected || !doctorId || !hospitalId || !branchId) return
    if (!selected.appointmentId) {
      setSearchError('This row has no appointment id — pick another visit.')
      return
    }

    const ctx: ConsultationContext = {
      patientId: selected.id,
      appointmentId: selected.appointmentId,
      doctorId,
      hospitalId,
      branchId,
    }

    const patient: PatientContext = {
      id: selected.id,
      name: selected.name,
      mrn: selected.mrn,
    }

    setIsOpening(true)
    try {
      await startConsultation(ctx, patient)
      handleOpenChange(false)
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select visit</DialogTitle>
        </DialogHeader>

        <p className="text-xs text-[var(--color-muted)]">
          Loaded from <code className="text-[11px]">midoc_getpatientlistbyappointment</code>{' '}
          (doctor appointment queue).
        </p>

        <input
          type="search"
          placeholder="Filter by name, patient id, or MRN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
          autoFocus
        />

        {searchError && (
          <p className="text-sm text-[var(--color-error)]" role="alert">
            {searchError}
          </p>
        )}

        <div className="relative max-h-72 overflow-auto rounded-[var(--radius-card)] border border-[var(--color-border)]">
          {isSearching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
            </div>
          )}
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[var(--color-sidebar)] text-left text-xs font-medium text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">MRN / ID</th>
                <th className="px-4 py-2">Appointment</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {!isSearching && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[var(--color-muted)]">
                    No visits found.
                  </td>
                </tr>
              )}
              {rows.map((p) => {
                const key = rowKey(p)
                const apptLabel = [p.appointmentDate, p.appointmentTime].filter(Boolean).join(' ')
                return (
                  <tr
                    key={key}
                    className={`border-t border-[var(--color-border)] hover:bg-[var(--color-sidebar)] ${
                      selectedKey === key ? 'bg-[var(--color-accent)]/5' : ''
                    }`}
                  >
                    <td className="px-4 py-2 font-medium">{p.name}</td>
                    <td className="px-4 py-2 tabular-nums text-[var(--color-muted)]">
                      {p.mrn ?? p.id}
                    </td>
                    <td className="px-4 py-2 tabular-nums text-[var(--color-muted)]">
                      {apptLabel || '—'}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Button
                        size="sm"
                        variant={selectedKey === key ? 'default' : 'outline'}
                        onClick={() => setSelectedKey(key)}
                      >
                        {selectedKey === key ? 'Selected' : 'Select'}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedKey || isOpening}>
            {isOpening ? 'Loading notes…' : 'Open & load notes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
