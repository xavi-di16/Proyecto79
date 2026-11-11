import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, ApiError } from '../../services/api'
import { clearExpiredNotice, hasExpiredNotice, useAuth } from './AuthContext'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const { save } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [expired] = useState(() => mode === 'login' && hasExpiredNotice())
  useEffect(() => { if (mode === 'login') clearExpiredNotice() }, [mode])
  const isRegister = mode === 'register'
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setError('')
    if (isRegister && !nombre.trim()) { setError('Ingresa tu nombre.'); return }
    if (!email.trim() || !password) { setError('Completa el correo y la contraseña.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Ingresa un correo electrónico válido.'); return }
    if (password.length < 4) { setError('La contraseña debe tener al menos 4 caracteres.'); return }
    setBusy(true)
    try {
      const next = isRegister ? await api.register(nombre.trim(), email.trim(), password) : await api.login(email.trim(), password)
      save(next); navigate('/retos', { replace: true })
    } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'No pudimos completar el acceso.') }
    finally { setBusy(false) }
  }
  return <div className="auth-page">
    <header className="site-header"><Link className="brand" to="/login">a/79</Link><span>ANCHOR79 / PRÁCTICA TÉCNICA</span></header>
    <main className="auth-layout">
      <aside className="auth-aside"><div><h1>Entrená para<br />el mundo real.</h1><p>Desafíos de programación inspirados en contextos profesionales.</p></div><small>TypeScript · Práctica junior</small></aside>
      <section className="auth-panel" aria-labelledby="auth-title"><div className="auth-form-wrap">
        <h2 id="auth-title">{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        <p className="subtle">{isRegister ? 'Registrate para acceder a los desafíos.' : 'Ingresá para continuar practicando.'}</p>
        {expired && <p className="notice error" role="alert">Tu sesión venció. Volvé a ingresar.</p>}
        <form onSubmit={submit} noValidate>
          {isRegister && <label>Nombre<input autoComplete="name" value={nombre} onChange={e => setNombre(e.target.value)} disabled={busy} required /></label>}
          <label>Correo electrónico<input type="email" placeholder="tu@correo.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} disabled={busy} required /></label>
          <label>Contraseña<input type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} disabled={busy} required minLength={4} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button primary full" type="submit" disabled={busy}>{busy ? 'Enviando…' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</button>
        </form>
        <p className="auth-switch">{isRegister ? <>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></> : <>¿No tenés cuenta? <Link to="/registro">Registrate</Link></>}</p>
      </div></section>
    </main>
  </div>
}
