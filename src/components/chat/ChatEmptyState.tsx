import { FileText, Pill, Search, Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  { label: 'Summarize current doctor notes', icon: FileText },
  { label: 'What medications are in the note?', icon: Pill },
  { label: 'Prepare note update for extending medication 5 days', icon: Search },
]

interface ChatEmptyStateProps {
  onSuggestion: (text: string) => void
  onLoadDemo?: () => void
}

export function ChatEmptyState({ onSuggestion, onLoadDemo }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
        <Sparkles className="h-6 w-6 text-[var(--color-accent)]" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
        Chat with doctor notes
      </h2>
      <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">
        Ask questions, get summaries, or draft note updates. Saves go to the chart after you confirm.
      </p>
      {onLoadDemo && (
        <button
          type="button"
          onClick={onLoadDemo}
          className="mt-6 text-sm font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
        >
          Load demo conversation
        </button>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onSuggestion(label)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5"
          >
            <Icon className="h-4 w-4 text-[var(--color-accent)]" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
