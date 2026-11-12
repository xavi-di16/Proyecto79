import type { Challenge, Evaluation } from '../types/api'

const base = (import.meta.env.VITE_API_URL || 'https://proyecto79-1.onrender.com/api').replace(/\/$/, '')
export class ApiError extends Error { constructor(message: string, public status: number) { super(message) } }

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${base}${path}`, { ...options, headers: {
      'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers,
    } })
  } catch { throw new ApiError('No pudimos conectar con el servidor. Intenta nuevamente.', 0) }
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'msg' in body && typeof body.msg === 'string'
      ? body.msg : 'La solicitud no pudo completarse.'
    throw new ApiError(message, response.status)
  }
  return body as T
}
export const api = {
  async challenges(token: string) { return (await request<{ data: Challenge[] }>('/retos', {}, token)).data },
  async challenge(id: string, token: string) {
    return (await request<{ data: Challenge }>(`/retos/detalle/${encodeURIComponent(id)}`, {}, token)).data
  },
  execute(challengeId: string, code: string, token: string) {
    return request<Evaluation>('/retos/ejecutar', {
      method: 'POST', body: JSON.stringify({ challengeId, code, language: 'typescript' }),
    }, token)
  },
}
