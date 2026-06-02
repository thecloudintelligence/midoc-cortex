import { useRef, useEffect } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import type { MidocChatMessage } from '@/types/chat'
import { cn, formatTime } from '@/lib/utils'

interface PatientChatPanelProps {
  messages: MidocChatMessage[]
  isLoading: boolean
  isSending: boolean
  error: string | null
  hasConsultation: boolean
  onSend: (message: string) => void
}

function getMessageText(msg: MidocChatMessage): string {
  return msg.chat ?? msg.message ?? ''
}

function isFromPatient(msg: MidocChatMessage): boolean {
  if (typeof msg.ispatient === 'boolean') return msg.ispatient
  return msg.ispatient === 1
}

export function PatientChatPanel({
  messages,
  isLoading,
  isSending,
  error,
  hasConsultation,
  onSend,
}: PatientChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputRef.current?.value.trim()
    if (!text) return
    onSend(text)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col border-r border-[var(--color-border)] bg-white">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <MessageCircle className="h-4 w-4 text-[#0D6E6E]" />
        <h2 className="text-sm font-semibold">Patient chat</h2>
        <span className="ml-auto text-xs text-[var(--color-muted)]">Midoc RPC</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {!hasConsultation && (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[var(--color-muted)]">
            <MessageCircle className="mb-2 h-8 w-8 opacity-40" />
            <p>Select a patient and appointment to load the chat thread.</p>
          </div>
        )}

        {hasConsultation && isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--color-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading chat…
          </div>
        )}

        {hasConsultation && !isLoading && messages.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">
            No messages yet. Send the first message below.
          </p>
        )}

        {messages.map((msg, i) => {
          const fromPatient = isFromPatient(msg)
          const text = getMessageText(msg)
          const time = msg.createddate ?? msg.createdat

          return (
            <div
              key={msg.chatid ?? `msg-${i}`}
              className={cn('mb-3 flex', fromPatient ? 'justify-start' : 'justify-end')}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-[var(--radius-bubble)] px-4 py-2.5 text-sm',
                  fromPatient
                    ? 'bg-[var(--color-sidebar)] text-[var(--color-foreground)]'
                    : 'bg-[#0D6E6E] text-white',
                )}
              >
                <p className="whitespace-pre-wrap">{text}</p>
                {time && (
                  <p
                    className={cn(
                      'mt-1 text-[10px] tabular-nums',
                      fromPatient ? 'text-[var(--color-muted)]' : 'text-white/70',
                    )}
                  >
                    {formatTime(new Date(time))}
                  </p>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mx-4 mb-2 rounded-[var(--radius-button)] border border-[var(--color-error)]/30 bg-red-50 px-3 py-2 text-xs text-[var(--color-error)]">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--color-border)] bg-[var(--color-background)] p-3"
      >
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            rows={2}
            disabled={!hasConsultation || isSending}
            placeholder={hasConsultation ? 'Message patient…' : 'Select a consultation first'}
            className="min-h-[44px] flex-1 resize-none rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus:border-[#0D6E6E]/50 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!hasConsultation || isSending}
            className="self-end rounded-[var(--radius-button)] bg-[#0D6E6E] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
