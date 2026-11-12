export function AuthBrandPanel() {
  return (
    <div className="brand-panel">
      <a className="brand" href="#login" aria-label="anchor79 — inicio">
        <span className="brand-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16" /></svg>
        </span>
        anchor79
      </a>
      <div className="brand-copy">
        <p className="eyebrow">PLATAFORMA DE PRÁCTICA</p>
        <p className="brand-title">Entrená, practicá y preparate para tu próximo trabajo.</p>
        <ul className="brand-benefits">
          {['Desafíos reales.', 'Feedback inmediato.', 'Enfoque en el mundo laboral.'].map((benefit) => (
            <li key={benefit}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 11a8 8 0 1 1-5-7M8 10l4 4 8-9" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
