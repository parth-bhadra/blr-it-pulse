import { format } from 'date-fns'

export default function Header({ lastUpdated }) {
  const now = new Date()

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '20px 24px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          BLR · IT Risk Observatory
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Bangalore Tech Employment Monitor
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          Tracking AI disruption signals across Bangalore's IT ecosystem
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <LiveBadge />
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
          Updated: {format(now, 'd MMM yyyy')}
        </div>
        <a
          href="https://github.com/parth-bhadra/blr-it-pulse"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ★ Star on GitHub
        </a>
      </div>
    </header>
  )
}

function LiveBadge() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--mono)',
      fontSize: '11px',
      color: 'var(--green)',
      background: 'rgba(34,211,160,0.08)',
      border: '1px solid rgba(34,211,160,0.2)',
      padding: '4px 10px',
      borderRadius: '4px',
    }}>
      <span style={{
        width: '6px', height: '6px',
        borderRadius: '50%',
        background: 'var(--green)',
        animation: 'livePulse 2s infinite',
      }} />
      Live + Community
      <style>{`@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}
