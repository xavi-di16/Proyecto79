import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import { api, ApiError } from '../../services/api'
import type { Challenge } from '../../types/api'
import { useAuth } from '../auth/AuthContext'

export default function CatalogPage() {
  const { session, expire } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<Challenge[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  useEffect(() => {
    if (!session) return
    let active = true
    setError(''); setLoading(true)
    api.challenges(session.token).then(data => { if (active) setItems(data) })
      .catch(cause => { if (!active) return; if (cause instanceof ApiError && cause.status === 401) { expire(); navigate('/login', { replace: true }) } else setError(cause instanceof Error ? cause.message : 'No se pudo cargar el catálogo.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [session, expire, navigate, reloadKey])
  return <><AppHeader /><main className="page-container">
    <h1>Elegí un desafío</h1><p className="subtle">Practicá con retos originales inspirados en empresas.</p>
    {loading && <p role="status">Cargando retos…</p>}
    {error && <div className="load-error"><p className="notice error" role="alert">{error}</p><button type="button" className="button primary" onClick={() => setReloadKey(value => value + 1)}>Reintentar</button></div>}
    {!loading && !error && <div className="catalog-grid">{items.map(item => <article className="challenge-card" key={item.id}>
      <div className="card-mark" aria-hidden="true" />
      <h2>{item.empresa}</h2><p>{item.titulo}</p><small>TypeScript · Práctica junior</small>
      <Link className="button primary" to={`/retos/${encodeURIComponent(item.id)}`}>Abrir reto</Link>
    </article>)}</div>}
    {!loading && !error && !items.length && <p>No hay retos disponibles todavía.</p>}
  </main></>
}
