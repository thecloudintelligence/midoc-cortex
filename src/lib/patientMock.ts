import type { PatientCandidate } from '@/types/chat'

export const MOCK_PATIENTS: PatientCandidate[] = [
  {
    id: '27829',
    name: 'Patient 1',
    mrn: '43385110',
    dob: '2014-05-20',
    appointmentId: '71744',
    appointmentDate: '2026-05-20',
    appointmentTime: '12:50',
  },
  {
    id: 'p-102',
    name: 'Tanish Kumar',
    mrn: 'MRN-44102',
    dob: '1988-11-02',
    appointmentId: 'apt-002',
    appointmentDate: '2026-05-28',
    appointmentTime: '14:30',
  },
]

export function mockSearchPatients(query: string): PatientCandidate[] {
  const q = query.toLowerCase().trim()
  if (!q) return MOCK_PATIENTS
  return MOCK_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.mrn?.toLowerCase().includes(q) ?? false) ||
      p.id.includes(q),
  )
}
