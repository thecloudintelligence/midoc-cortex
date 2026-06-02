import { useEffect, useState } from 'react'
import { PanelRight, X } from 'lucide-react'
import { TopBar } from './TopBar'
import { NotesChatPanel } from '@/components/consultation/NotesChatPanel'
import { NotesPanel } from '@/components/consultation/NotesPanel'
import { Button } from '@/components/ui/button'
import { useCopilotStore } from '@/store/copilotStore'
import { useConsultationStore } from '@/store/consultationStore'
import { cn } from '@/lib/utils'

const LOAD_NOTES_PROMPT =
  'Load the current doctor notes for this patient and appointment using doctor_notes_get. Give a brief one-line confirmation.'

export function AppShell() {
  const [notesOpen, setNotesOpen] = useState(false)

  const {
    messages,
    isLoading,
    loadingStep,
    error,
    connectionStatus,
    pendingActions,
    init,
    loadDemo,
    sendMessage,
    regenerate,
    confirmAction,
    dismissAction,
    clearChat,
  } = useCopilotStore()

  const { context, patient, notes, notesPreview, isLoadingNotes } = useConsultationStore()

  useEffect(() => {
    init()
  }, [init])

  const hasConsultation = Boolean(context)
  const showOfflineBanner = connectionStatus === 'unavailable'

  return (
    <div className="flex h-full flex-col">
      {showOfflineBanner && (
        <div
          className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-[var(--color-warning)]"
          role="alert"
        >
          Notes assistant unavailable — start midoc-agents at {import.meta.env.VITE_AGENT_API_URL}
        </div>
      )}

      <TopBar
        patient={patient}
        connectionStatus={connectionStatus}
        onEndSession={() => {
          if (window.confirm('End this session?')) clearChat()
        }}
      />

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-end border-b border-[var(--color-border)] bg-white px-3 py-2 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setNotesOpen(true)}
            >
              <PanelRight className="h-4 w-4" />
              Chart notes
            </Button>
          </div>

          <NotesChatPanel
            messages={messages}
            isLoading={isLoading}
            loadingStep={loadingStep}
            error={error}
            pendingActions={pendingActions}
            hasConsultation={hasConsultation}
            onSend={sendMessage}
            onRegenerate={regenerate}
            onLoadDemo={loadDemo}
            onConfirmAction={confirmAction}
            onDismissAction={dismissAction}
          />
        </main>

        <div className="hidden w-[380px] shrink-0 border-l border-[var(--color-border)] lg:block">
          <NotesPanel
            notes={notes}
            preview={notesPreview}
            isLoading={isLoadingNotes || isLoading}
            hasConsultation={hasConsultation}
            onRefresh={() => sendMessage(LOAD_NOTES_PROMPT, { hidden: true })}
          />
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          notesOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!notesOpen}
      >
        <button
          type="button"
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity',
            notesOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setNotesOpen(false)}
          aria-label="Close notes panel"
        />
        <div
          className={cn(
            'absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-200',
            notesOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="font-semibold">Chart notes</span>
            <Button variant="ghost" size="icon" onClick={() => setNotesOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <NotesPanel
              notes={notes}
              preview={notesPreview}
              isLoading={isLoadingNotes || isLoading}
              hasConsultation={hasConsultation}
              onRefresh={() => sendMessage(LOAD_NOTES_PROMPT, { hidden: true })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
