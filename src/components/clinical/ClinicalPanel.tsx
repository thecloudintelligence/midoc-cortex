import { User, AlertTriangle, Heart, Pill } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatientCandidateCard } from './PatientCandidateCard'
import { ConfirmActionCard } from './ConfirmActionCard'
import { ConfirmBar } from './ConfirmBar'
import type {
  PatientCandidate,
  PatientContext,
  PendingAction,
  HistoryItem,
  ReportItem,
} from '@/types/chat'

interface ClinicalPanelProps {
  patient: PatientContext | null
  candidates: PatientCandidate[]
  pendingActions: PendingAction[]
  history: HistoryItem[]
  reports: ReportItem[]
  onSelectPatient: (c: PatientCandidate) => void
  onConfirmAction: (id: string) => void
  onDismissAction: (id: string) => void
}

export function ClinicalPanel({
  patient,
  candidates,
  pendingActions,
  history,
  reports,
  onSelectPatient,
  onConfirmAction,
  onDismissAction,
}: ClinicalPanelProps) {
  const pending = pendingActions.filter((a) => a.status === 'pending')
  const confirmBarMessage =
    candidates.length > 1
      ? `Multiple patients named "${candidates[0]?.name.split(' ')[0] ?? '—'}" — select one to continue.`
      : null

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-[var(--color-border)] bg-white">
      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col px-4 pt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="actions">
            Actions
            {pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-[var(--color-warning)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          <TabsContent value="overview" className="space-y-4">
            {!patient && candidates.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">
                Start by naming the patient or describing the visit.
              </p>
            )}

            {candidates.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Match candidates</h3>
                {candidates.map((c) => (
                  <PatientCandidateCard key={c.id} candidate={c} onSelect={onSelectPatient} />
                ))}
              </div>
            )}

            {patient && (
              <>
                <div className="flex gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-sidebar)] p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                    <User className="h-7 w-7 text-[var(--color-muted)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--color-foreground)]">{patient.name}</h2>
                    <p className="text-sm text-[var(--color-muted)] tabular-nums">
                      {[patient.age && `${patient.age} years`, patient.sex, patient.mrn && `MRN ${patient.mrn}`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </div>

                {patient.allergies && patient.allergies.length > 0 && (
                  <div
                    className="rounded-[var(--radius-card)] border border-[var(--color-error)]/30 bg-red-50 px-4 py-3"
                    role="alert"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-error)]">
                      <AlertTriangle className="h-4 w-4" />
                      Allergies
                    </div>
                    <ul className="mt-2 list-inside list-disc text-sm text-[var(--color-foreground)]">
                      {patient.allergies.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {patient.conditions && patient.conditions.length > 0 && (
                  <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Heart className="h-4 w-4 text-[var(--color-accent)]" />
                      Chronic conditions
                    </div>
                    <ul className="mt-2 text-sm text-[var(--color-muted)]">
                      {patient.conditions.map((c) => (
                        <li key={c}>· {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {patient.activeMeds && patient.activeMeds.length > 0 && (
                  <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Pill className="h-4 w-4 text-[var(--color-accent)]" />
                      Active medications
                    </div>
                    <ul className="mt-2 text-sm text-[var(--color-muted)]">
                      {patient.activeMeds.map((m) => (
                        <li key={m}>· {m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {patient.lastVisitSummary && (
                  <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3">
                    <h3 className="text-sm font-semibold">Last visit</h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{patient.lastVisitSummary}</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="history">
            {history.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                No data yet — ask the copilot to load history.
              </p>
            ) : (
              <ul className="space-y-3">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3"
                  >
                    <p className="text-xs font-medium text-[var(--color-muted)] tabular-nums">{item.date}</p>
                    <p className="mt-1 text-sm">{item.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="reports">
            {reports.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                No data yet — ask the copilot to load reports.
              </p>
            ) : (
              <ul className="space-y-3">
                {reports.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3"
                  >
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {item.type} · {item.date}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-3">
            {pendingActions.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">
                No pending actions. Proposed writes will appear here for confirmation.
              </p>
            ) : (
              pendingActions.map((action) => (
                <ConfirmActionCard
                  key={action.id}
                  action={action}
                  onConfirm={onConfirmAction}
                  onDismiss={onDismissAction}
                />
              ))
            )}
          </TabsContent>
        </div>
      </Tabs>

      {confirmBarMessage && <ConfirmBar message={confirmBarMessage} />}
    </aside>
  )
}
