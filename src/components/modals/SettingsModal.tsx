import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getApiBaseUrl } from '@/lib/api'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <label className="font-medium text-[var(--color-foreground)]">Agent API</label>
            <p className="mt-1 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-sidebar)] px-3 py-2 font-mono text-xs text-[var(--color-muted)]">
              {getApiBaseUrl()}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              All notes access goes through midoc-agents (<code>VITE_AGENT_API_URL</code>).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
