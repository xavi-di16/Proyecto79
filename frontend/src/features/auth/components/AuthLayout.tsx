import { useEffect, useRef, useState } from 'react'
import { AuthBrandPanel } from './AuthBrandPanel'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

type AuthMode = 'login' | 'register'

export function AuthLayout({ mode, navigationId }: { mode: AuthMode; navigationId: number }) {
  const [settledId, setSettledId] = useState(navigationId)
  const transitioning = settledId !== navigationId
  const layout = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!transitioning) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 960px)')
    const finish = () => setSettledId(navigationId)
    // Fallback also covers resize, interrupted transitions and hidden tabs.
    const timeout = window.setTimeout(finish, reducedMotion.matches ? 0 : desktop.matches ? 550 : 250)
    const onMotionChange = () => { if (reducedMotion.matches) finish() }
    reducedMotion.addEventListener('change', onMotionChange)
    return () => {
      window.clearTimeout(timeout)
      reducedMotion.removeEventListener('change', onMotionChange)
    }
  }, [navigationId, transitioning])

  useEffect(() => {
    if (!transitioning) layout.current?.querySelector<HTMLHeadingElement>('[data-active="true"] h1')?.focus()
  }, [mode, transitioning])

  return (
    <div ref={layout} className="auth-layout sliding-auth" data-mode={mode} aria-busy={transitioning}>
      <AuthBrandPanel mode={mode} transitioning={transitioning} />
      <div className="auth-form-stack">
        <div className="auth-view" data-active={mode === 'login'} aria-hidden={mode !== 'login'} inert={mode !== 'login' || transitioning}>
          <LoginPage />
        </div>
        <div className="auth-view" data-active={mode === 'register'} aria-hidden={mode !== 'register'} inert={mode !== 'register' || transitioning}>
          <RegisterPage />
        </div>
      </div>
    </div>
  )
}
