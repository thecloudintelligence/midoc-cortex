import { AppShell } from '@/components/layout/AppShell'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { useAuthStore } from '@/store/authStore'

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <AppShell />
}

export default App
