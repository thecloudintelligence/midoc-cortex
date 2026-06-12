import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { ChatThread } from '@/components/chat/ChatThread'
import { Composer } from '@/components/chat/Composer'
import { ConfirmActionCard } from '@/components/clinical/ConfirmActionCard'
import type { ChatMessage, PendingAction } from '@/types/chat'

interface CopilotPanelProps {
  messages: ChatMessage[]
  isLoading: boolean
  loadingStep: string | null
  error: string | null
  pendingActions: PendingAction[]
  onSend: (text: string) => void
  onRegenerate: () => void
  onRetry: () => void
  onLoadDemo?: () => void
  onConfirmAction: (id: string) => void
  onDismissAction: (id: string) => void
}

const QUICK_ACTIONS = [
  'Summarize current doctor notes',
  'Draft a follow-up chat message for the patient',
  'What medications are in the current note?',
]

export function CopilotPanel({
  messages,
  isLoading,
  loadingStep,
  error,
  pendingActions,
  onSend,
  onRegenerate,
  onRetry,
  onLoadDemo,
  onConfirmAction,
  onDismissAction,
}: CopilotPanelProps) {
  const [lastSent, setLastSent] = useState('')
  const pending = pendingActions.filter((a) => a.status === 'pending')

  const handleSend = async (text: string) => {
    setLastSent(text)
    await onSend(text)
  }

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-[var(--color-border)] bg-[var(--color-sidebar)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-4 py-3">
        <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
        <h2 className="text-sm font-semibold">AI copilot</h2>
        <span className="ml-auto text-xs text-[var(--color-muted)]">Agent API</span>
      </div>

      {pending.length > 0 && (
        <div className="space-y-2 border-b border-[var(--color-border)] bg-white p-3">
          {pending.map((action) => (
            <ConfirmActionCard
              key={action.id}
              action={action}
              onConfirm={onConfirmAction}
              onDismiss={onDismissAction}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 border-b border-[var(--color-border)] bg-white px-3 py-2">
        {QUICK_ACTIONS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleSend(label)}
            disabled={isLoading}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-sidebar)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5 disabled:opacity-50"
          >
            {label.length > 35 ? label.slice(0, 35) + '…' : label}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[var(--color-background)]">
        <ChatThread
          messages={messages}
          isLoading={isLoading}
          loadingStep={loadingStep}
          error={error}
          onSuggestion={handleSend}
          onRegenerate={onRegenerate}
          onRetry={() => (lastSent ? handleSend(lastSent) : onRetry())}
          onLoadDemo={onLoadDemo}
        />
        <Composer onSend={handleSend} isLoading={isLoading} />
      </div>
    </aside>
  )
}
