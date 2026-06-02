/// <reference types="vite/client" />

declare module '*.css' {}

interface ImportMetaEnv {
  readonly VITE_AGENT_API_URL: string
  readonly VITE_MIDOC_API_URL: string
  readonly VITE_USE_MOCK: string
  readonly VITE_MIDOC_DOCTOR_ID?: string
  readonly VITE_MIDOC_HOSPITAL_ID?: string
  readonly VITE_MIDOC_BRANCH_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
