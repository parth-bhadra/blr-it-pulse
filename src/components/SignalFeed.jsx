import { useRef, useEffect } from 'react'

const CATEGORY_COLORS = {
  market: 'var(--red)',
  hiring: 'var(--yellow)',
  blr_ground: 'var(--blue)',
  education: 'var(--purple)',
}

export default function SignalFeed({ signals }) {
  const doubled = [...signals, ...signals] // seamless loop

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'livePulse 2s infinite', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Signal feed
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginLeft: 'auto' }}>
          hover to pause
        </span>
        <style>{`@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>

      <div style={{ overflow: 'hidden', padding: '10px 0' }}>
        <div style={{
          display: 'flex',
          gap: '40px',
          animation: 'ticker 60s linear infinite',
          whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
        >
          {doubled.map((s, i) => (
            <div key={`${s.id}-${i}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--muted)',
              flexShrink: 0,
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: CATEGORY_COLORS[s.category] || 'var(--accent)', flexShrink: 0 }} />
              {s.text}
              <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--border2)' }}>· {s.source}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
