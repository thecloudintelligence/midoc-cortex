/** Per-request doctor JWT + clinic scope for midoc-agents API calls. */

export interface DoctorScope {
  token: string | null
  doctorId: string | null
  hospitalId: string | null
  branchId: string | null
}

export function buildAuthHeaders(scope: DoctorScope): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (scope.token) {
    headers.Authorization = `Bearer ${scope.token}`
  }
  if (scope.doctorId) {
    headers['X-Midoc-Doctor-Id'] = scope.doctorId
  }
  if (scope.hospitalId) {
    headers['X-Midoc-Hospital-Id'] = scope.hospitalId
  }
  if (scope.branchId) {
    headers['X-Midoc-Branch-Id'] = scope.branchId
  }
  return headers
}

export function scopeFromAuth(
  auth: Pick<DoctorScope, 'token' | 'doctorId' | 'hospitalId' | 'branchId'>,
): DoctorScope {
  return {
    token: auth.token,
    doctorId: auth.doctorId,
    hospitalId: auth.hospitalId,
    branchId: auth.branchId,
  }
}

export function hasCompleteScope(scope: DoctorScope): boolean {
  return Boolean(
    scope.token && scope.doctorId && scope.hospitalId && scope.branchId,
  )
}
