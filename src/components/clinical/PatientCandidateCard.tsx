import { User } from 'lucide-react'
import type { PatientCandidate } from '@/types/chat'
import { Button } from '@/components/ui/button'

interface PatientCandidateCardProps {
  candidate: PatientCandidate
  onSelect: (candidate: PatientCandidate) => void
}

export function PatientCandidateCard({ candidate, onSelect }: PatientCandidateCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-sidebar)]">
        <User className="h-5 w-5 text-[var(--color-muted)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[var(--color-foreground)]">{candidate.name}</p>
        <dl className="mt-1 space-y-0.5 text-sm text-[var(--color-muted)]">
          {candidate.dob && (
            <div className="flex gap-2">
              <dt className="font-medium">DOB</dt>
              <dd className="tabular-nums">{candidate.dob}</dd>
            </div>
          )}
          {candidate.mrn && (
            <div className="flex gap-2">
              <dt className="font-medium">MRN</dt>
              <dd className="tabular-nums">{candidate.mrn}</dd>
            </div>
          )}
          {(candidate.age || candidate.sex) && (
            <div className="flex gap-2">
              <dt className="font-medium">Demographics</dt>
              <dd>
                {[candidate.age && `${candidate.age}y`, candidate.sex].filter(Boolean).join(' · ')}
              </dd>
            </div>
          )}
        </dl>
      </div>
      <Button size="sm" onClick={() => onSelect(candidate)}>
        Select
      </Button>
    </div>
  )
}
