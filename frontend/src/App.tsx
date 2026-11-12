import { useState } from 'react'
import { LoginPage } from './features/auth/pages/LoginPage'
import './styles/tokens.css'
import './styles/global.css'

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  return (
    <div className="app" data-theme={theme}>
      <div className="decoration-layer" aria-hidden="true"><div className="brand-orbit" /></div>
      <header className="site-header">
        <button className="theme-toggle" type="button" aria-pressed={theme === 'light'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Modo claro <span aria-hidden="true">{theme === 'light' ? '☀' : '☾'}</span>
        </button>
      </header>
      <main id="login"><LoginPage /></main>
      <footer>anchor79 <span aria-hidden="true">·</span> Un reto a la vez.</footer>
    </div>
  )
}
