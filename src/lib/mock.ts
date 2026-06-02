import type { ChatResponse } from '@/types/chat'

export function mockChatResponse(userContent: string, threadId?: string): ChatResponse {
  const lower = userContent.toLowerCase()

  if (lower.includes('summarize') && lower.includes('note')) {
    return {
      thread_id: threadId ?? crypto.randomUUID(),
      messages: [
        { role: 'user', content: userContent },
        {
          role: 'assistant',
          content:
            '**Summary:** Follow-up for dizziness with orthostatic symptoms. BP controlled on Lisinopril 10mg. Patient on Metformin 500mg BID for diabetes.',
        },
        {
          role: 'tool',
          name: 'doctor_notes_get',
          content: JSON.stringify({
            info: 'Follow-up for dizziness. Patient reports orthostatic symptoms.',
            medicinedetail: [
              { name: 'Lisinopril', dose: '10mg', frequency: 'daily' },
              { name: 'Metformin', dose: '500mg', frequency: 'BID' },
            ],
          }),
          tool_call_id: 'tc-mock-notes',
        },
      ],
    }
  }

  if (lower.includes('extend') || lower.includes('prepare note')) {
    return {
      thread_id: threadId ?? crypto.randomUUID(),
      messages: [
        { role: 'user', content: userContent },
        {
          role: 'assistant',
          content:
            'Draft note update: extend **Lisinopril 10mg** by 5 days. Review and click **Save to chart** to apply via Midoc.',
        },
      ],
    }
  }

  if (lower.includes('medication') || lower.includes('medicine')) {
    return {
      thread_id: threadId ?? crypto.randomUUID(),
      messages: [
        { role: 'user', content: userContent },
        {
          role: 'assistant',
          content: 'Current medications in the note:\n\n1. **Lisinopril 10mg** — daily\n2. **Metformin 500mg** — BID',
        },
        {
          role: 'tool',
          name: 'doctor_notes_get',
          content: JSON.stringify({
            medicinedetail: [
              { name: 'Lisinopril', dose: '10mg', frequency: 'daily' },
              { name: 'Metformin', dose: '500mg', frequency: 'BID' },
            ],
          }),
          tool_call_id: 'tc-mock-meds',
        },
      ],
    }
  }

  if (lower.includes('tanish') || lower.includes('find patient') || lower.includes('search')) {
    return {
      thread_id: threadId ?? crypto.randomUUID(),
      messages: [
        { role: 'user', content: userContent },
        {
          role: 'assistant',
          content: 'I found matching patients. Use the patient picker in the top bar to open a consultation.',
        },
        {
          role: 'tool',
          name: 'patient_search',
          content: JSON.stringify({
            data: [
              { patient_id: 'p-101', full_name: 'Tanish Khandelwal', mrn: 'MRN-88421' },
              { patient_id: 'p-102', full_name: 'Tanish Kumar', mrn: 'MRN-44102' },
            ],
          }),
          tool_call_id: 'tc-mock-search',
        },
      ],
    }
  }

  return {
    thread_id: threadId ?? crypto.randomUUID(),
    messages: [
      { role: 'user', content: userContent },
      {
        role: 'assistant',
        content:
          'How can I help with doctor notes? I can summarize, list medications, or draft note updates.',
      },
    ],
  }
}

export const DEMO_MESSAGES: ChatResponse['messages'] = [
  { role: 'user', content: 'Summarize current doctor notes' },
  {
    role: 'assistant',
    content:
      '**Summary:** Follow-up for dizziness with orthostatic symptoms. BP controlled on current regimen.',
  },
  {
    role: 'tool',
    name: 'doctor_notes_get',
    content: JSON.stringify({
      info: 'Follow-up for dizziness. Patient reports orthostatic symptoms.',
    }),
    tool_call_id: 'tc-demo-1',
  },
]
