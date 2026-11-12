import { useEffect, useState } from 'react'
import { AuthLayout } from './features/auth/components/AuthLayout'
import './styles/tokens.css'
import './styles/global.css'

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [screen, setScreen] = useState<{ mode: 'register' | 'login'; navigationId: number }>(() => ({
    mode: window.location.hash === '#registro' ? 'register' : 'login', navigationId: 0,
  }))

  useEffect(() => {
    const navigate = () => {
      const mode = window.location.hash === '#registro' ? 'register' : 'login'
      if (mode === screen.mode) return
      // Move focus before the outgoing panel becomes inert/aria-hidden.
      if (document.activeElement?.closest('.auth-layout')) {
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true })
      }
      setScreen((current) => ({ mode, navigationId: current.navigationId + 1 }))
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [screen.mode])

  useEffect(() => {
    document.title = `${screen.mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'} | Anchor79`
  }, [screen.mode])
  return (
    <div className="app" data-theme={theme}>
      <div className="decoration-layer" aria-hidden="true"><div className="brand-orbit" /></div>
      <header className="site-header">
        <button className="theme-toggle" type="button" aria-pressed={theme === 'light'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Modo claro <span aria-hidden="true">{theme === 'light' ? '☀' : '☾'}</span>
        </button>
      </header>
      <main id="login" tabIndex={-1}><AuthLayout mode={screen.mode} navigationId={screen.navigationId} /></main>
      <footer>anchor79 <span aria-hidden="true">·</span> Un reto a la vez.</footer>
    </div>
  )
}
