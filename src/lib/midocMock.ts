import type { DoctorNotes, DoctorSignInResult, MidocChatMessage, PatientContext } from '@/types/chat'

export function mockSignIn(email: string, password: string): DoctorSignInResult {
  void password
  return {
    token: 'mock-jwt-token',
    doctorid: 'doc-1',
    hospitalid: 'hosp-1',
    branchid: 'branch-1',
    name: email.split('@')[0] ?? 'Demo Doctor',
  }
}

export function mockGetChat(): MidocChatMessage[] {
  return [
    {
      chatid: 'c-1',
      chat: 'Good morning doctor, I have been feeling dizzy since yesterday.',
      ispatient: 1,
      createddate: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      chatid: 'c-2',
      chat: 'Thanks for reaching out. Can you describe when the dizziness started?',
      ispatient: 0,
      createddate: new Date(Date.now() - 3000000).toISOString(),
    },
    {
      chatid: 'c-3',
      chat: 'It started after I skipped breakfast and took my blood pressure medication.',
      ispatient: 1,
      createddate: new Date(Date.now() - 2400000).toISOString(),
    },
  ]
}

export function mockGetDoctorNotes(): DoctorNotes {
  return {
    info: 'Follow-up for dizziness. Patient reports orthostatic symptoms. BP well controlled on current regimen.',
    medicinedetail: [
      { name: 'Lisinopril', dose: '10mg', frequency: 'daily' },
      { name: 'Metformin', dose: '500mg', frequency: 'BID' },
    ],
    orders: {
      medication: [{ name: 'Lisinopril 10mg', duration: '30 days' }],
    },
  }
}

export function mockGetPatientDetails(patientId: string): PatientContext {
  return {
    id: patientId,
    name: 'Tanish Khandelwal',
    age: 33,
    sex: 'M',
    mrn: 'MRN-88421',
    allergies: ['Penicillin (rash)'],
    conditions: ['Hypertension', 'Type 2 diabetes'],
    activeMeds: ['Metformin 500mg BID', 'Lisinopril 10mg daily'],
    lastVisitSummary: 'Routine follow-up 3 weeks ago. BP controlled.',
  }
}
