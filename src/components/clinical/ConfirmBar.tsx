import { AlertCircle } from 'lucide-react'

interface ConfirmBarProps {
  message: string
}

export function ConfirmBar({ message }: ConfirmBarProps) {
  return (
    <div
      className="sticky bottom-0 flex items-start gap-2 border-t border-[var(--color-warning)]/30 bg-amber-50 px-4 py-3 text-sm text-[var(--color-foreground)]"
      role="status"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" />
      <p>{message}</p>
    </div>
  )
}
