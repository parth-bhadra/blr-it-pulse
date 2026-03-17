import { MiniBar } from './ui.jsx'

const CIRCUMFERENCE = 2 * Math.PI * 48 // r=48

function scoreColor(score) {
  if (score < 40) return 'var(--green)'
  if (score < 55) return 'var(--blue)'
  if (score < 70) return 'var(--yellow)'
  if (score < 85) return 'var(--accent)'
  return 'var(--red)'
}

function layerColor(score) {
  if (score >= 70) return 'var(--red)'
  if (score >= 55) return 'var(--yellow)'
  return 'var(--green)'
}

export default function RiskMeter({ score }) {
  const { composite, label, description, layers } = score
  const color = scoreColor(composite)
  const dashoffset = CIRCUMFERENCE * (1 - composite / 100)

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '28px',
      alignItems: 'center',
    }}>
      {/* Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="48"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1.5s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 600, color, lineHeight: 1 }}>
              {composite}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              / 100
            </div>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color, fontWeight: 600 }}>
          {label}
        </div>
      </div>

      {/* Detail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>
            Composite Disruption Risk Score
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            {description}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(layers).map(([key, layer]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', width: '110px', flexShrink: 0, textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </div>
              <div style={{ flex: 1 }}>
                <MiniBar value={layer.score} max={100} color={layerColor(layer.score)} />
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: layerColor(layer.score), width: '30px', textAlign: 'right' }}>
                {layer.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
