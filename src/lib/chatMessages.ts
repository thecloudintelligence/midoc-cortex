import type { ChatMessage } from '@/types/chat'

/** True when the message has displayable or API-sendable text. */
export function hasChatContent(message: ChatMessage): boolean {
  return typeof message.content === 'string' && message.content.trim().length > 0
}

/** Payload for POST /v1/chat — omits empty turns and system (agent injects context). */
export function messagesForApi(
  messages: ChatMessage[],
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .filter(hasChatContent)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content.trim(),
    }))
}

/** UI + notes sync — keep tool rows; drop blank user/assistant/system bubbles. */
export function messagesForUi(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((m) => m.role === 'tool' || hasChatContent(m))
}
