import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, RotateCcw, Sparkles, User } from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import type { ChatMessage } from '@/types/chat'
import { Button } from '@/components/ui/button'

interface MessageBubbleProps {
  message: ChatMessage
  onRegenerate?: () => void
  isStreaming?: boolean
}

export function MessageBubble({ message, onRegenerate, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const timestamp = formatTime(new Date())

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn('group flex gap-3 px-4 py-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--color-sidebar)] text-[var(--color-accent)]',
        )}
        aria-hidden
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      <div className={cn('flex max-w-[min(720px,85%)] flex-col gap-1', isUser && 'items-end')}>
        <div
          className={cn(
            'relative rounded-[var(--radius-bubble)] px-4 py-3 text-[15px]',
            isUser
              ? 'bg-[var(--color-primary)] text-white'
              : 'border border-[var(--color-border)] bg-white text-[var(--color-foreground)] shadow-sm',
          )}
        >
          {isUser ? (
            <p className="m-0 whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-body prose-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              {isStreaming && <span className="streaming-cursor ml-0.5 inline-block">▋</span>}
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100',
            isUser && 'flex-row-reverse',
          )}
        >
          <span className="text-xs text-[var(--color-muted)]">{timestamp}</span>
          {!isUser && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
                aria-label="Copy message"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onRegenerate}
                  aria-label="Regenerate response"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
