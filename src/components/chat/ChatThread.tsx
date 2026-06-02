import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/types/chat'
import { MessageBubble } from './MessageBubble'
import { ToolRunCard } from './ToolRunCard'
import { ChatEmptyState } from './ChatEmptyState'
import { LoadingIndicator } from './LoadingIndicator'

interface ChatThreadProps {
  messages: ChatMessage[]
  isLoading: boolean
  loadingStep: string | null
  error: string | null
  onSuggestion: (text: string) => void
  onRegenerate: () => void
  onRetry: () => void
  onLoadDemo?: () => void
}

function renderThreadItem(
  message: ChatMessage,
  index: number,
  messages: ChatMessage[],
  onRegenerate: () => void,
) {
  if (message.role === 'system') return null

  if (message.role === 'tool') {
    return <ToolRunCard key={`tool-${index}`} message={message} />
  }

  if (message.role === 'user' || message.role === 'assistant') {
    const isLastAssistant =
      message.role === 'assistant' &&
      !messages.slice(index + 1).some((m) => m.role === 'assistant')
    return (
      <MessageBubble
        key={`msg-${index}`}
        message={message}
        onRegenerate={message.role === 'assistant' && isLastAssistant ? onRegenerate : undefined}
      />
    )
  }

  return null
}

export function ChatThread({
  messages,
  isLoading,
  loadingStep,
  error,
  onSuggestion,
  onRegenerate,
  onRetry,
  onLoadDemo,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const visibleMessages = messages.filter((m) => m.role !== 'system')
  const isEmpty = visibleMessages.length === 0 && !isLoading

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        {isEmpty && <ChatEmptyState onSuggestion={onSuggestion} onLoadDemo={onLoadDemo} />}
        {messages.map((msg, i) => renderThreadItem(msg, i, messages, onRegenerate))}
        {isLoading && <LoadingIndicator step={loadingStep} />}
        {error && (
          <div className="mx-4 my-3 rounded-[var(--radius-card)] border border-[var(--color-error)]/30 bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
