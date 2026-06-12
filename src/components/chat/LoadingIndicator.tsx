import { Loader2 } from 'lucide-react'
import { Sparkles } from 'lucide-react'

interface LoadingIndicatorProps {
  step?: string | null
}

export function LoadingIndicator({ step }: LoadingIndicatorProps) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-sidebar)] text-[var(--color-accent)]">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-[var(--radius-bubble)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-muted)] shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent)]" />
          {step ?? 'Copilot is thinking…'}
        </div>
        {step && step !== 'Copilot is thinking…' && (
          <p className="text-xs text-[var(--color-muted)]">Tool step: {step}</p>
        )}
      </div>
    </div>
  )
}
