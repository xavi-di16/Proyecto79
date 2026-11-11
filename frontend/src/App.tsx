import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './features/auth/AuthContext'
import AuthPage from './features/auth/AuthPage'
import CatalogPage from './features/catalog/CatalogPage'
import './App.css'

const ChallengePage = lazy(() => import('./features/workspace/ChallengePage'))

function Pages() {
  const { session } = useAuth()
  return <Routes>
    <Route path="/login" element={session ? <Navigate to="/retos" replace /> : <AuthPage mode="login" />} />
    <Route path="/registro" element={session ? <Navigate to="/retos" replace /> : <AuthPage mode="register" />} />
    <Route path="/retos" element={session ? <CatalogPage /> : <Navigate to="/login" replace />} />
    <Route path="/retos/:id" element={session ? <Suspense fallback={<p className="page-container" role="status">Cargando editor…</p>}><ChallengePage /></Suspense> : <Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to={session ? '/retos' : '/login'} replace />} />
  </Routes>
}

export default function App() { return <AuthProvider><Pages /></AuthProvider> }
