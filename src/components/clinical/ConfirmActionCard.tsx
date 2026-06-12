import { MessageSquare, FileText, CheckCircle2 } from 'lucide-react'
import type { PendingAction } from '@/types/chat'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ICONS = {
  chat_draft: MessageSquare,
  note_draft: FileText,
  chart_note: FileText,
}

const CONFIRM_LABELS = {
  chat_draft: 'Send to patient',
  note_draft: 'Save to chart',
  chart_note: 'Apply to chart',
}

interface ConfirmActionCardProps {
  action: PendingAction
  onConfirm: (id: string) => void
  onDismiss: (id: string) => void
}

export function ConfirmActionCard({ action, onConfirm, onDismiss }: ConfirmActionCardProps) {
  const Icon = ICONS[action.type] ?? FileText
  const isResolved = action.status !== 'pending'
  const confirmLabel = CONFIRM_LABELS[action.type] ?? 'Confirm'

  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border p-3',
        isResolved
          ? 'border-[var(--color-success)]/30 bg-green-50/50 opacity-75'
          : 'border-[var(--color-border)] bg-white',
      )}
    >
      <div className="flex gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
          <Icon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--color-foreground)]">{action.summary}</p>
          {action.detail && (
            <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--color-muted)]">{action.detail}</p>
          )}
        </div>
        {action.status === 'confirmed' && (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
        )}
      </div>
      {action.status === 'pending' && (
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="h-7 text-xs" onClick={() => onConfirm(action.id)}>
            {confirmLabel}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onDismiss(action.id)}>
            Dismiss
          </Button>
        </div>
      )}
    </div>
  )
}
