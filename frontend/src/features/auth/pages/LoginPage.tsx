import { useState } from 'react'
import { LoginForm } from '../components/LoginForm'
import { AuthBrandPanel } from '../components/AuthBrandPanel'

export function LoginPage() {
  const [notice, setNotice] = useState('')
  return (
    <div className="auth-layout">
      <AuthBrandPanel />
      <section className="login login-card" aria-labelledby="login-title">
        <h1 id="login-title">Bienvenido de nuevo</h1>
        <p className="subtitle">Iniciá sesión para continuar practicando.</p>
        <LoginForm recoveryLink={
          <a className="recovery-link" href="#recuperar-contrasena" onClick={(event) => {
          event.preventDefault()
          setNotice('La recuperación de contraseña estará disponible en una próxima versión.')
          }}>¿Olvidaste tu contraseña?</a>
        } />
        <p className="registration">¿Todavía no tenés cuenta?{' '}
          <a href="#registro" onClick={(event) => {
            event.preventDefault()
            setNotice('El registro estará disponible en una próxima versión.')
          }}>Registrate</a>
        </p>
        <p className="future-notice" role="status">{notice}</p>
      </section>
    </div>
  )
}
