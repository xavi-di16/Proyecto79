import { useEffect, useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import { api, ApiError } from '../../services/api'
import type { Challenge, Evaluation } from '../../types/api'
import { useAuth } from '../auth/AuthContext'
import './monaco'

export default function ChallengePage() {
  const { id } = useParams()
  const { session, expire } = useAuth()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState('')
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const running = useRef(false)
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => { const media = matchMedia('(prefers-color-scheme: dark)'); const update = () => setDark(media.matches); media.addEventListener('change', update); return () => media.removeEventListener('change', update) }, [])
  useEffect(() => {
    if (!session || !id) return
    let active = true
    setChallenge(null); setEvaluation(null); setError(''); setLoading(true)
    api.challenge(id, session.token).then(data => { if (active) {
      setChallenge(data)
      setCode(sessionStorage.getItem(`anchor79.draft.${session.user.id}.${id}`) ?? data.codigoInicial ?? '')
    } })
      .catch(cause => { if (!active) return; if (cause instanceof ApiError && cause.status === 401) { expire(); navigate('/login', { replace: true }) } else setError(cause instanceof Error ? cause.message : 'No se pudo cargar el reto.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, session, expire, navigate, reloadKey])
  async function execute() {
    if (!id || !session || running.current) return
    if (!code.trim()) { setError('Escribí una solución antes de ejecutar.'); return }
    if (code.length > 20000) { setError('La solución supera el límite de 20.000 caracteres.'); return }
    running.current = true; setBusy(true); setError(''); setEvaluation(null)
    try { setEvaluation(await api.execute(id, code, session.token)) }
    catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) { expire(); navigate('/login', { replace: true }) }
      else setEvaluation({ status: 'EVALUATION_UNAVAILABLE', estadoVisible: 'No se pudo evaluar', passedCases: 0, totalCases: 0, sampleOutput: null, failedCase: null, errorDetail: cause instanceof Error ? cause.message : 'Intenta nuevamente.' })
    } finally { running.current = false; setBusy(false) }
  }
  const onEditorMount: OnMount = (_, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: true })
    monaco.editor.defineTheme('anchor79-light', {
      base: 'vs', inherit: false,
      rules: [{ token: '', foreground: '172B42' }, { token: 'comment', foreground: '64748B' }, { token: 'keyword', foreground: '245B80' }, { token: 'string', foreground: '22A879' }, { token: 'number', foreground: '245B80' }, { token: 'type.identifier', foreground: '245B80' }],
      colors: { 'editor.background': '#FFFFFF', 'editor.foreground': '#172B42', 'editorLineNumber.foreground': '#64748B', 'editorCursor.foreground': '#245B80', 'editor.selectionBackground': '#DCE4EC', 'editor.lineHighlightBackground': '#F5F7FA' },
    })
    monaco.editor.defineTheme('anchor79-dark', {
      base: 'vs-dark', inherit: false,
      rules: [{ token: '', foreground: 'F0F5FB' }, { token: 'comment', foreground: '9BAABD' }, { token: 'keyword', foreground: '78B8E8' }, { token: 'string', foreground: '22A879' }, { token: 'number', foreground: '78B8E8' }, { token: 'type.identifier', foreground: '78B8E8' }],
      colors: { 'editor.background': '#1B293B', 'editor.foreground': '#F0F5FB', 'editorLineNumber.foreground': '#9BAABD', 'editorCursor.foreground': '#78B8E8', 'editor.selectionBackground': '#27394F', 'editor.lineHighlightBackground': '#101827' },
    })
    monaco.editor.setTheme(dark ? 'anchor79-dark' : 'anchor79-light')
  }
  function changeCode(value: string | undefined) {
    const next = value ?? ''
    setCode(next)
    setEvaluation(null)
    if (session && id) sessionStorage.setItem(`anchor79.draft.${session.user.id}.${id}`, next)
  }
  return <><AppHeader /><main className="page-container workspace-page">
    <Link className="back-link" to="/retos">← Volver al catálogo</Link>
    {loading && <p role="status">Cargando reto…</p>}
    {error && !challenge && <div className="load-error"><p className="notice error" role="alert">{error}</p><button type="button" className="button primary" onClick={() => setReloadKey(value => value + 1)}>Reintentar</button></div>}
    {challenge && <>
      <h1>{challenge.titulo}</h1><p className="subtle">{challenge.notaPractica} · TypeScript</p>
      <div className="workspace-grid">
        <section className="statement-card" aria-labelledby="statement-title"><h2 id="statement-title">Consigna</h2><p>{challenge.descripcion}</p>
          <h3>Entrada</h3><p>{challenge.formatoEntrada}</p><pre>{challenge.ejemplo.entrada}</pre>
          <h3>Salida esperada</h3><p>{challenge.formatoSalida}</p><pre>{challenge.ejemplo.salida}</pre>
        </section>
        <section className="editor-column" aria-label="Solución"><div className="editor-header">solucion.ts · TypeScript</div>
          <Editor height="380px" language="typescript" theme={dark ? 'anchor79-dark' : 'anchor79-light'} value={code} onMount={onEditorMount} onChange={changeCode} options={{ minimap: { enabled: false }, automaticLayout: true, fontSize: 14, scrollBeyondLastLine: false, padding: { top: 18 }, tabSize: 2 }} />
          <div className="execute-row"><button className="button primary" onClick={execute} disabled={busy} type="button">{busy ? 'Evaluando…' : 'Ejecutar solución'}</button></div>
          <section className="result-card" aria-live="polite" aria-atomic="true"><h2>Resultado de evaluación</h2>
            {busy && <p role="status">Evaluando tu solución…</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            {evaluation && <div className={`result ${evaluation.status.toLowerCase()}`}>
              <strong>{evaluation.estadoVisible}</strong>
              {evaluation.totalCases > 0 && <p>{evaluation.passedCases} de {evaluation.totalCases} casos superados.</p>}
              {evaluation.errorDetail && <p>{evaluation.errorDetail}</p>}
              {evaluation.failedCase && <p>Caso #{evaluation.failedCase.caseNumber}: salida obtenida <code>{evaluation.failedCase.actualOutput}</code>{evaluation.failedCase.expectedOutput !== 'Oculto' && <>; esperada <code>{evaluation.failedCase.expectedOutput}</code></>}.</p>}
              {evaluation.sampleOutput && evaluation.status === 'APPROVED' && <p>Salida del ejemplo: <code>{evaluation.sampleOutput}</code></p>}
              {evaluation.status === 'EVALUATION_UNAVAILABLE' && <button type="button" className="button primary" onClick={execute}>Reintentar</button>}
            </div>}
          </section>
        </section>
      </div>
    </>}
  </main></>
}
