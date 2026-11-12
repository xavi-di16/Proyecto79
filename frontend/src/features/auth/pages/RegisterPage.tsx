import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <section className="login login-card register-card" aria-labelledby="register-title">
      <h1 id="register-title" tabIndex={-1}>Creá tu cuenta</h1>
      <p className="subtitle">Prepará tu próximo paso como developer.</p>
      <RegisterForm />
      <p className="registration">¿Ya tenés una cuenta? <a href="#login">Iniciá sesión</a></p>
    </section>
  )
}
