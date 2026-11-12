import { useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { AuthIcon } from './AuthIcon'

type Errors = { email?: string; password?: string }

export function LoginForm({ recoveryLink }: { recoveryLink: ReactNode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [notice, setNotice] = useState('')
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  function validate(nextEmail: string, nextPassword: string): Errors {
    return {
      email: !nextEmail.trim() ? 'Ingresá tu correo electrónico.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail.trim()) ? 'Ingresá un correo válido, por ejemplo nombre@correo.com.' : undefined,
      password: !nextPassword.trim() ? 'Ingresá tu contraseña.' : undefined,
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(email, password)
    setErrors(nextErrors)
    setSubmitted(true)
    setNotice('')
    if (nextErrors.email) emailRef.current?.focus()
    else if (nextErrors.password) passwordRef.current?.focus()
    else setNotice('Demostración: formulario válido. Inicio de sesión pendiente de integración con la API; no se autenticó ningún usuario.')
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="email">Correo electrónico</label>
        <div className="input-control">
          <AuthIcon className="input-icon" name="mail" />
        <input ref={emailRef} id="email" name="email" type="email" autoComplete="username"
          placeholder="nombre@correo.com" required value={email}
          aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined}
          onChange={(event) => {
            setEmail(event.target.value)
            setNotice('')
            if (submitted) setErrors(validate(event.target.value, password))
          }} />
        </div>
        {errors.email && <p className="field-error" id="email-error">Error: {errors.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="password">Contraseña</label>
        <div className="input-control password-control">
          <AuthIcon className="input-icon" name="lock" />
          <input ref={passwordRef} id="password" name="password" type={showPassword ? 'text' : 'password'}
            autoComplete="current-password" placeholder="Ingresá tu contraseña" required value={password}
            aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined}
            onChange={(event) => {
              setPassword(event.target.value)
              setNotice('')
              if (submitted) setErrors(validate(email, event.target.value))
            }} />
          <button type="button" className="password-toggle" aria-controls="password"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}>
            <AuthIcon name={showPassword ? 'eye-off' : 'eye'} />
          </button>
        </div>
        {errors.password && <p className="field-error" id="password-error">Error: {errors.password}</p>}
      </div>
      {recoveryLink}
      <div className="sr-only" role="alert">{errors.email || errors.password ? 'Revisá los campos indicados para continuar.' : ''}</div>
      <button className="primary-button" type="submit">Iniciar sesión
        <AuthIcon name="arrow" />
      </button>
      <p className="demo-notice" role="status">{notice}</p>
    </form>
  )
}
