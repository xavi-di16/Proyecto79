import { useState, type FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import CatalogPage from './catalog/CatalogPage'
import ChallengePage from './workspace/ChallengePage'
import './preview.css'

type PreviewSession = { token: string; userId: string }

function readUserId(token: string): string {
  try {
    const payload: unknown = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload && typeof payload === 'object' && 'id' in payload && typeof payload.id === 'string' && payload.id) {
      return payload.id
    }
  } catch { /* El backend validará el token; aquí solo leemos el id del borrador. */ }
  throw new Error('Pega un JWT válido emitido por el backend de Anchor79.')
}

function Preview() {
  const [session, setSession] = useState<PreviewSession | null>(null)
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState('')

  function useToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const token = tokenInput.trim().replace(/^Bearer\s+/i, '')
      setSession({ token, userId: readUserId(token) })
      setTokenInput('')
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Token inválido.')
    }
  }

  function resetSession() { setSession(null) }

  if (!import.meta.env.DEV) return <main className="a79-preview"><p>Esta vista previa solo está disponible en desarrollo.</p></main>
  if (!session) return <main className="a79-preview">
    <h1>Vista previa de catálogo y primer reto</h1>
    <p>Para probar las pantallas, pega un JWT emitido por el backend o por el acceso desarrollado por tu compañero. Esta vista no registra usuarios ni inicia sesión.</p>
    <form onSubmit={useToken}>
      <label htmlFor="preview-token">JWT de prueba</label>
      <input id="preview-token" type="password" autoComplete="off" value={tokenInput} onChange={event => setTokenInput(event.target.value)} required />
      {error && <p role="alert" className="a79-preview-error">{error}</p>}
      <button type="submit">Ver catálogo</button>
    </form>
  </main>

  return <HashRouter>
    <div className="a79-preview-bar"><span>Vista previa local · sesión de prueba</span><button type="button" onClick={resetSession}>Quitar token</button></div>
    <Routes>
      <Route path="/retos" element={<CatalogPage token={session.token} onUnauthorized={resetSession} />} />
      <Route path="/retos/:id" element={<ChallengePage token={session.token} userId={session.userId} onUnauthorized={resetSession} />} />
      <Route path="*" element={<Navigate to="/retos" replace />} />
    </Routes>
  </HashRouter>
}

createRoot(document.getElementById('root')!).render(<Preview />)
