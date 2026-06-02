import { useState } from 'react'
import { FileText } from 'lucide-react'
import { ChatThread } from '@/components/chat/ChatThread'
import { Composer } from '@/components/chat/Composer'
import { ConfirmActionCard } from '@/components/clinical/ConfirmActionCard'
import type { ChatMessage, PendingAction } from '@/types/chat'

interface NotesChatPanelProps {
  messages: ChatMessage[]
  isLoading: boolean
  loadingStep: string | null
  error: string | null
  pendingActions: PendingAction[]
  hasConsultation: boolean
  onSend: (text: string) => void
  onRegenerate: () => void
  onLoadDemo?: () => void
  onConfirmAction: (id: string) => void
  onDismissAction: (id: string) => void
}

const QUICK_ACTIONS = [
  'Summarize current doctor notes',
  'What medications are in the current note?',
  'Prepare note update for extending medication 5 days',
  'List key findings from the notes',
]

export function NotesChatPanel({
  messages,
  isLoading,
  loadingStep,
  error,
  pendingActions,
  hasConsultation,
  onSend,
  onRegenerate,
  onLoadDemo,
  onConfirmAction,
  onDismissAction,
}: NotesChatPanelProps) {
  const [lastSent, setLastSent] = useState('')
  const pending = pendingActions.filter((a) => a.status === 'pending')

  const handleSend = async (text: string) => {
    setLastSent(text)
    await onSend(text)
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-[var(--color-background)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-4 py-3">
        <FileText className="h-4 w-4 text-[#0D6E6E]" />
        <h2 className="text-sm font-semibold">Doctor notes chat</h2>
        <span className="ml-auto text-xs text-[var(--color-muted)]">Agent only</span>
      </div>

      {!hasConsultation && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-[var(--color-warning)]">
          Pick a patient and appointment from the top bar to load their notes.
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-2 border-b border-[var(--color-border)] bg-white px-4 py-3">
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

      <div className="flex flex-wrap gap-1.5 border-b border-[var(--color-border)] bg-white px-4 py-2">
        {QUICK_ACTIONS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleSend(label)}
            disabled={isLoading || !hasConsultation}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-sidebar)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-foreground)] transition-colors hover:border-[#0D6E6E]/40 hover:bg-[#0D6E6E]/5 disabled:opacity-50"
          >
            {label.length > 42 ? label.slice(0, 42) + '…' : label}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <ChatThread
          messages={messages}
          isLoading={isLoading}
          loadingStep={loadingStep}
          error={error}
          onSuggestion={handleSend}
          onRegenerate={onRegenerate}
          onRetry={() => lastSent && handleSend(lastSent)}
          onLoadDemo={onLoadDemo}
        />
        <Composer
          onSend={handleSend}
          isLoading={isLoading}
          disabled={!hasConsultation}
          placeholder={
            hasConsultation
              ? 'Ask about doctor notes — summarize, update medications, draft additions…'
              : 'Select a consultation to chat about notes…'
          }
        />
      </div>
    </div>
  )
}
