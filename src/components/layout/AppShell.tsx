import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { NotesChatPanel } from '@/components/consultation/NotesChatPanel'
import { useCopilotStore } from '@/store/copilotStore'
import { useConsultationStore } from '@/store/consultationStore'

export function AppShell() {
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

  const { context, patient } = useConsultationStore()

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

      <NotesChatPanel
        messages={messages}
        isLoading={isLoading}
        loadingStep={loadingStep}
        error={error}
        pendingActions={pendingActions}
        hasConsultation={hasConsultation}
        onSend={sendMessage}
        onRegenerate={regenerate}
        onLoadDemo={import.meta.env.VITE_USE_MOCK === 'true' ? loadDemo : undefined}
        onConfirmAction={confirmAction}
        onDismissAction={dismissAction}
      />
    </div>
  )
}
