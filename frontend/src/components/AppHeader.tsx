import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

export default function AppHeader() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  return <header className="site-header app-header">
    <Link className="brand" to="/retos">a/79</Link><span>ANCHOR79 / PRÁCTICA TÉCNICA</span>
    <div className="header-actions"><span>{session?.user.nombre}</span><button type="button" onClick={() => { logout(); navigate('/login') }}>Salir</button></div>
  </header>
}
