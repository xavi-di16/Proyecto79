import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AuthIcon } from './AuthIcon'

type Values = { nombre: string; email: string; password: string; confirmPassword: string }
type Field = keyof Values
type Errors = Partial<Record<Field, string>>

const fields = [
  { key: 'nombre', label: 'Nombre completo', placeholder: 'Tu nombre y apellido', autoComplete: 'name' },
  { key: 'email', label: 'Correo electrónico', placeholder: 'nombre@correo.com', autoComplete: 'email' },
  { key: 'password', label: 'Contraseña', placeholder: 'Creá una contraseña', autoComplete: 'new-password' },
  { key: 'confirmPassword', label: 'Confirmar contraseña', placeholder: 'Repetí tu contraseña', autoComplete: 'new-password' },
] as const

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.nombre.trim()) errors.nombre = 'Ingresá tu nombre completo.'
  if (!values.email.trim()) errors.email = 'Ingresá tu correo electrónico.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Ingresá un correo válido, por ejemplo nombre@correo.com.'
  if (!values.password.trim()) errors.password = 'Ingresá una contraseña.'
  else if (values.password.length < 4) errors.password = 'La contraseña debe tener al menos 4 caracteres.'
  if (!values.confirmPassword) errors.confirmPassword = 'Confirmá tu contraseña.'
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Las contraseñas deben coincidir.'
  return errors
}

export function RegisterForm() {
  const [values, setValues] = useState<Values>({ nombre: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState({ password: false, confirmPassword: false })
  const [notice, setNotice] = useState('')
  const inputs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({})

  function change(field: Field, value: string) {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    setNotice('')
    if (submitted) setErrors(validate(nextValues))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitted(true)
    setNotice('')
    const firstInvalid = fields.find(({ key }) => nextErrors[key])
    if (firstInvalid) inputs.current[firstInvalid.key]?.focus()
    else setNotice('Demostración: formulario válido. La integración del registro con el backend está pendiente; no se creó ninguna cuenta.')
  }

  return (
    <form onSubmit={submit} noValidate>
      {fields.map(({ key, label, placeholder, autoComplete }) => {
        const isPassword = key === 'password' || key === 'confirmPassword'
        const shown = isPassword && visible[key]
        const id = `register-${key}`
        const describedBy = [key === 'password' ? 'register-password-hint' : '', errors[key] ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
        return (
          <div className="field" key={key}>
            <label htmlFor={id}>{label}</label>
            <div className={`input-control${isPassword ? ' password-control' : ''}`}>
              <AuthIcon className="input-icon" name={isPassword ? 'lock' : key === 'email' ? 'mail' : 'user'} />
              <input ref={(element) => { inputs.current[key] = element }} id={id} name={key}
                type={isPassword ? shown ? 'text' : 'password' : key === 'email' ? 'email' : 'text'}
                autoComplete={autoComplete} placeholder={placeholder} required value={values[key]}
                minLength={key === 'password' ? 4 : undefined}
                aria-invalid={Boolean(errors[key])} aria-describedby={describedBy}
                onChange={(event) => change(key, event.target.value)} />
              {isPassword && <button className="password-toggle" type="button" aria-controls={id}
                aria-label={`${shown ? 'Ocultar' : 'Mostrar'} ${key === 'password' ? 'contraseña' : 'confirmación de contraseña'}`}
                aria-pressed={shown} onClick={() => setVisible({ ...visible, [key]: !visible[key] })}>
                <AuthIcon name={shown ? 'eye-off' : 'eye'} />
              </button>}
            </div>
            {key === 'password' && <p className="field-hint" id="register-password-hint">Mínimo 4 caracteres.</p>}
            {errors[key] && <p className="field-error" id={`${id}-error`}>Error: {errors[key]}</p>}
          </div>
        )
      })}
      <div className="sr-only" role="alert">{Object.keys(errors).length > 0 ? 'Revisá los campos indicados para continuar.' : ''}</div>
      <button className="primary-button" type="submit">Crear cuenta <AuthIcon name="arrow" /></button>
      <p className="demo-notice" role="status">{notice}</p>
    </form>
  )
}
