import { useRef, useEffect, useState, useCallback } from 'react'
import { Paperclip, Mic, ArrowUp, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
  isLoading?: boolean
  onStop?: () => void
  placeholder?: string
}

const MAX_LINES = 6
const LINE_HEIGHT = 24

export function Composer({
  onSend,
  disabled,
  isLoading,
  onStop,
  placeholder = 'Ask about this patient or describe symptoms…',
}: ComposerProps) {
  const [value, setValue] = useState('')
  const [recording, setRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const max = LINE_HEIGHT * MAX_LINES
    el.style.height = `${Math.min(el.scrollHeight, max)}px`
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0 && !disabled && !isLoading

  return (
    <div className="border-t border-[var(--color-border)] bg-white px-4 py-4">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            'rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm transition-shadow focus-within:border-[#0D6E6E]/50 focus-within:ring-2 focus-within:ring-[#0D6E6E]/20',
            recording && 'border-[#0D6E6E] ring-2 ring-[#0D6E6E]/20',
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none disabled:opacity-50"
            aria-label="Message input"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="text-[var(--color-muted)]" aria-label="Attach file">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={recording ? 'default' : 'ghost'}
                size="sm"
                className="gap-1.5"
                onClick={() => setRecording((r) => !r)}
                aria-label={recording ? 'Stop recording' : 'Hold to talk'}
                aria-pressed={recording}
              >
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">{recording ? 'Recording…' : 'Hold to talk'}</span>
              </Button>
              {recording && (
                <span className="ml-2 flex gap-0.5" aria-hidden>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="inline-block h-4 w-1 animate-pulse rounded-full bg-[#0D6E6E]"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
            {isLoading ? (
              <Button type="button" variant="secondary" size="sm" onClick={onStop} className="gap-1">
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                disabled={!canSend}
                onClick={handleSend}
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
