import { FileText, Loader2, RefreshCw } from 'lucide-react'
import type { DoctorNotes } from '@/types/chat'
import { Button } from '@/components/ui/button'

interface NotesPanelProps {
  notes: DoctorNotes | null
  preview: string
  isLoading: boolean
  hasConsultation: boolean
  onRefresh: () => void
}

export function NotesPanel({
  notes,
  preview,
  isLoading,
  hasConsultation,
  onRefresh,
}: NotesPanelProps) {
  const meds = notes?.medicinedetail ?? []

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <FileText className="h-4 w-4 text-[#0D6E6E]" />
        <h2 className="text-sm font-semibold">Chart notes</h2>
        <span className="ml-auto text-xs text-[var(--color-muted)]">via agent</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {!hasConsultation && (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[var(--color-muted)]">
            <FileText className="mb-2 h-8 w-8 opacity-40" />
            <p>Select a patient to view their notes here.</p>
          </div>
        )}

        {hasConsultation && isLoading && !preview && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--color-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notes from chart…
          </div>
        )}

        {hasConsultation && preview && (
          <div className="space-y-4">
            <pre className="whitespace-pre-wrap rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-sidebar)] px-3 py-3 text-sm leading-relaxed">
              {preview}
            </pre>

            {meds.length > 0 && (
              <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
                <h3 className="text-xs font-semibold text-[var(--color-muted)]">Medications</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {meds.map((med, i) => (
                    <li key={i} className="text-[var(--color-foreground)]">
                      · {String(med.name ?? med.medicinename ?? 'Unknown')}{' '}
                      {med.dose ? String(med.dose) : ''}{' '}
                      {med.frequency ? String(med.frequency) : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {hasConsultation && !isLoading && !preview && (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">
            No notes loaded yet. Ask in chat or tap Refresh.
          </p>
        )}
      </div>

      {hasConsultation && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] p-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh from chart
          </Button>
          <p className="mt-2 text-center text-[10px] text-[var(--color-muted)]">
            Edits and saves go through the chat — agent writes to Midoc.
          </p>
        </div>
      )}
    </div>
  )
}
