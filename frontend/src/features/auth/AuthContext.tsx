import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '../../types/api'

const key = 'anchor79.session'
const expiredKey = 'anchor79.expired'
function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const value = JSON.parse(raw) as Session
    const encoded = value.token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(encoded)) as { exp?: number }
    if (!value.user?.id || !payload.exp || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(key); sessionStorage.setItem(expiredKey, '1'); return null
    }
    return value
  } catch { localStorage.removeItem(key); return null }
}
interface AuthValue { session: Session | null; save: (next: Session) => void; logout: () => void; expire: () => void }
const Context = createContext<AuthValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession)
  const save = useCallback((next: Session) => { localStorage.setItem(key, JSON.stringify(next)); sessionStorage.removeItem(expiredKey); setSession(next) }, [])
  const logout = useCallback(() => { localStorage.removeItem(key); setSession(null) }, [])
  const expire = useCallback(() => { sessionStorage.setItem(expiredKey, '1'); logout() }, [logout])
  const value = useMemo(() => ({ session, save, logout, expire }), [session, save, logout, expire])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useAuth() { const value = useContext(Context); if (!value) throw new Error('AuthProvider faltante'); return value }
export function hasExpiredNotice() { return sessionStorage.getItem(expiredKey) === '1' }
export function clearExpiredNotice() { sessionStorage.removeItem(expiredKey) }
