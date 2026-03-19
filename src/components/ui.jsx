/* Shared primitive components used across layers */

export function Card({ children, style = {} }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  )
}

export function CardHeader({ title, source }) {
  return (
    <div className="card-header">
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {title}
      </div>
      {source && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
          {source}
        </div>
      )}
    </div>
  )
}

export function CardBody({ children, style = {} }) {
  return (
    <div className="card-body" style={style}>
      {children}
    </div>
  )
}

export function IndRow({ name, meta, value, change, changeDir }) {
  const changeColor = changeDir === 'good' ? 'var(--green)' : changeDir === 'bad' ? 'var(--red)' : 'var(--yellow)'
  return (
    <div className="ind-row">
      <div className="ind-row-info">
        <div className="ind-row-name">{name}</div>
        {meta && <div className="ind-row-meta">{meta}</div>}
      </div>
      <div className="ind-row-value">
        <div className="ind-row-change-val" style={{ color: changeColor }}>{value}</div>
        {change && <div className="ind-row-change-text" style={{ color: changeColor }}>{change}</div>}
      </div>
    </div>
  )
}

export function RiskTag({ level }) {
  const configs = {
    critical: { bg: 'rgba(244,63,94,0.12)', color: 'var(--red)', border: 'rgba(244,63,94,0.2)', label: 'CRITICAL' },
    high:     { bg: 'rgba(251,191,36,0.1)',  color: 'var(--yellow)', border: 'rgba(251,191,36,0.2)', label: 'HIGH' },
    moderate: { bg: 'rgba(96,165,250,0.08)', color: 'var(--blue)', border: 'rgba(96,165,250,0.18)', label: 'MODERATE' },
    low:      { bg: 'rgba(34,211,160,0.08)', color: 'var(--green)', border: 'rgba(34,211,160,0.18)', label: 'LOW RISK' },
    very_low: { bg: 'rgba(34,211,160,0.08)', color: 'var(--green)', border: 'rgba(34,211,160,0.18)', label: 'SAFEST' },
    growing:  { bg: 'rgba(34,211,160,0.08)', color: 'var(--green)', border: 'rgba(34,211,160,0.18)', label: 'GROWING' },
  }
  const c = configs[level] || configs.moderate
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: 'var(--mono)',
      fontSize: '10px',
      fontWeight: 600,
      padding: '2px 7px',
      borderRadius: '3px',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

export function SignalDot({ signal }) {
  const colors = {
    bearish: 'var(--red)',
    warning: 'var(--yellow)',
    neutral: 'var(--muted)',
    healthy: 'var(--green)',
    growing: 'var(--green)',
    stable:  'var(--blue)',
    mixed:   'var(--yellow)',
    declining: 'var(--red)',
    critical: 'var(--red)',
  }
  return (
    <span style={{
      display: 'inline-block',
      width: '6px', height: '6px',
      borderRadius: '50%',
      background: colors[signal] || 'var(--muted)',
      flexShrink: 0,
    }} />
  )
}

export function TwoColGrid({ children }) {
  return (
    <div className="card-grid">
      {children}
    </div>
  )
}

export function MiniBar({ value, max = 100, color = 'var(--yellow)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '4px', background: 'var(--bg3)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}
