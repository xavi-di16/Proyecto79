import { useMemo, useRef, useState, type FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import CatalogPage from './catalog/CatalogPage'
import { createDemoApi } from './demoApi'
import ChallengePage from './workspace/ChallengePage'
import type { EvaluationStatus } from '../types/api'
import './preview.css'

type PreviewSession = { mode: 'demo' | 'live'; token: string; userId: string }

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
  const [outcome, setOutcome] = useState<EvaluationStatus>('APPROVED')
  const outcomeRef = useRef(outcome)
  const demoClient = useMemo(() => createDemoApi(() => outcomeRef.current), [])

  function useToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const token = tokenInput.trim().replace(/^Bearer\s+/i, '')
      setSession({ mode: 'live', token, userId: readUserId(token) })
      setTokenInput('')
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Token inválido.')
    }
  }

  function resetSession() { setSession(null) }
  function changeOutcome(value: EvaluationStatus) { outcomeRef.current = value; setOutcome(value) }

  if (!session) return <main className="a79-preview">
    <h1>Vista previa de catálogo y primer reto</h1>
    <p>Recorre el catálogo y el primer reto sin crear una cuenta. La evaluación de la demo es visual: no ejecuta el código.</p>
    <div className="a79-preview-demo"><button type="button" onClick={() => setSession({ mode: 'demo', token: '', userId: 'preview-demo' })}>Explorar demo sin cuenta</button></div>
    <p>¿Quieres probar la API real? Pega un JWT emitido por el backend o por el acceso desarrollado por tu compañero.</p>
    <form onSubmit={useToken}>
      <label htmlFor="preview-token">JWT de prueba</label>
      <input id="preview-token" type="password" autoComplete="off" value={tokenInput} onChange={event => setTokenInput(event.target.value)} required />
      {error && <p role="alert" className="a79-preview-error">{error}</p>}
      <button type="submit">Conectar con la API</button>
    </form>
  </main>

  return <HashRouter>
    <div className="a79-preview-bar">
      <span>{session.mode === 'demo' ? 'Modo demo · resultados simulados; no se ejecuta el código' : 'API real · sesión de prueba'}</span>
      {session.mode === 'demo' && <label>Resultado de ejemplo <select value={outcome} onChange={event => changeOutcome(event.target.value as EvaluationStatus)}>
        <option value="APPROVED">Aprobado</option>
        <option value="FAILED">Falló</option>
        <option value="SYNTAX_ERROR">Error de sintaxis</option>
        <option value="EVALUATION_UNAVAILABLE">No se pudo evaluar</option>
      </select></label>}
      <button type="button" onClick={resetSession}>{session.mode === 'demo' ? 'Salir de la demo' : 'Quitar token'}</button>
    </div>
    <Routes>
      <Route path="/retos" element={<CatalogPage token={session.token} onUnauthorized={resetSession} client={session.mode === 'demo' ? demoClient : undefined} />} />
      <Route path="/retos/:id" element={<ChallengePage token={session.token} userId={session.userId} onUnauthorized={resetSession} client={session.mode === 'demo' ? demoClient : undefined} />} />
      <Route path="*" element={<Navigate to="/retos" replace />} />
    </Routes>
  </HashRouter>
}

createRoot(document.getElementById('root')!).render(<Preview />)
