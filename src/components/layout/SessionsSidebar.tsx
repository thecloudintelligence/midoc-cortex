import { useState } from 'react'
import { Plus, Search, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatTime } from '@/lib/utils'
import type { ConsultationSession } from '@/types/chat'

interface SessionsSidebarProps {
  sessions: ConsultationSession[]
  activeSessionId: string | null
  onNewConsultation: () => void
  onSelectSession: (id: string) => void
  collapsed?: boolean
}

export function SessionsSidebar({
  sessions,
  activeSessionId,
  onNewConsultation,
  onSelectSession,
  collapsed,
}: SessionsSidebarProps) {
  const [query, setQuery] = useState('')

  const filtered = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.patientName?.toLowerCase().includes(query.toLowerCase()),
  )

  if (collapsed) {
    return (
      <aside className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-[var(--color-border)] bg-[var(--color-sidebar)] py-4">
        <Button size="icon" onClick={onNewConsultation} aria-label="New consultation">
          <Plus className="h-4 w-4" />
        </Button>
      </aside>
    )
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)]">
      <div className="p-3">
        <Button className="w-full gap-2" onClick={onNewConsultation}>
          <Plus className="h-4 w-4" />
          New consultation
        </Button>
      </div>
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--color-muted)]" />
          <input
            type="search"
            placeholder="Search sessions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white py-2 pl-9 pr-3 text-sm focus:border-[var(--color-accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Past sessions">
        <ul className="space-y-0.5">
          {filtered.map((session) => (
            <li key={session.id}>
              <button
                type="button"
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  'group flex w-full flex-col rounded-[var(--radius-button)] px-3 py-2.5 text-left text-sm transition-colors',
                  activeSessionId === session.id
                    ? 'bg-white shadow-sm text-[var(--color-foreground)]'
                    : 'text-[var(--color-muted)] hover:bg-white/60 hover:text-[var(--color-foreground)]',
                )}
              >
                <span className="flex items-center gap-2 font-medium line-clamp-1">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  {session.title}
                </span>
                <span className="mt-0.5 text-xs opacity-0 transition-opacity group-hover:opacity-100 tabular-nums">
                  {formatTime(session.startedAt)} · {session.messageCount} messages
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
