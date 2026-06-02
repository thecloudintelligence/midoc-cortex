import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, CheckCircle2, AlertCircle, Wrench } from 'lucide-react'
import { cn, truncate } from '@/lib/utils'
import { parseToolError, parseDoctorNotesGet, parseChatGet } from '@/lib/parseTool'
import type { ChatMessage } from '@/types/chat'

interface ToolRunCardProps {
  message: ChatMessage
  isRunning?: boolean
}

const TOOL_LABELS: Record<string, string> = {
  patient_search: 'Patient search',
  patient_get: 'Patient profile',
  patient_appointment_history: 'Appointment history',
  chat_get: 'Chat thread',
  chat_send: 'Send chat',
  chat_update: 'Edit chat',
  chat_media_get: 'Chat media',
  doctor_notes_get: 'Doctor notes',
  doctor_notes_save: 'Save notes',
  doctor_general_notes_get: 'General notes',
  doctor_general_notes_save: 'Save general notes',
}

function summarizeToolContent(name: string, content: string): string | null {
  if (parseToolError(content)) return null

  if (name === 'doctor_notes_get') {
    const notes = parseDoctorNotesGet(content)
    if (notes?.info) return `Notes: ${String(notes.info).slice(0, 120)}…`
  }
  if (name === 'chat_get') {
    const chats = parseChatGet(content)
    if (chats.length) return `${chats.length} message(s) in thread`
  }
  if (name === 'chat_send' || name === 'doctor_notes_save') {
    return 'Write completed — main panels refreshed'
  }
  return null
}

export function ToolRunCard({ message, isRunning }: ToolRunCardProps) {
  const [expanded, setExpanded] = useState(false)
  const toolName = message.name ?? 'tool'
  const label = TOOL_LABELS[toolName] ?? toolName
  const error = parseToolError(message.content)
  const summary = summarizeToolContent(toolName, message.content)
  const status = isRunning ? 'running' : error ? 'error' : 'done'

  return (
    <div className="mx-3 my-1.5">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={cn(
          'flex w-full items-center gap-2 rounded-[var(--radius-card)] border px-3 py-2 text-left text-xs transition-colors',
          status === 'error'
            ? 'border-[var(--color-error)]/30 bg-red-50'
            : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-sidebar)]',
        )}
        aria-expanded={expanded}
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
        )}
        <Wrench className="h-3.5 w-3.5 shrink-0 text-[#0D6E6E]" aria-hidden />
        <div className="min-w-0 flex-1">
          <span className="font-medium text-[var(--color-foreground)]">{label}</span>
          {summary && !expanded && (
            <span className="ml-2 text-[var(--color-muted)]">· {summary}</span>
          )}
        </div>
        {status === 'running' && (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#0D6E6E]" aria-label="Running" />
        )}
        {status === 'done' && (
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-success)]" aria-label="Complete" />
        )}
        {status === 'error' && (
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[var(--color-error)]" aria-label="Error" />
        )}
      </button>
      {expanded && (
        <pre
          className={cn(
            'mt-1 max-h-40 overflow-auto rounded-[var(--radius-button)] border px-3 py-2 text-[10px]',
            status === 'error'
              ? 'border-[var(--color-error)]/30 bg-red-50 text-[var(--color-error)]'
              : 'border-[var(--color-border)] bg-white text-[var(--color-muted)]',
          )}
        >
          {error ?? truncate(message.content, 2000)}
        </pre>
      )}
    </div>
  )
}
