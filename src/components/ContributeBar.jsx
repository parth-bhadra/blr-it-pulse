export default function ContributeBar({ onContribute }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderTop: '1px solid rgba(249,115,22,0.3)',
      borderRadius: 'var(--radius)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '3px' }}>
          Help keep this dashboard accurate
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
          Open source · MIT licensed · Submit data points via GitHub PR or the form below
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <a
          href="https://github.com/parth-bhadra/blr-it-pulse"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            fontWeight: 500,
            padding: '7px 14px',
            borderRadius: '4px',
            background: 'transparent',
            color: 'var(--text)',
            border: '1px solid var(--border2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          ★ View on GitHub
        </a>

        <button
          onClick={onContribute}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            fontWeight: 500,
            padding: '7px 14px',
            borderRadius: '4px',
            background: 'transparent',
            color: 'var(--text)',
            border: '1px solid var(--border2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          + Submit data point
        </button>

        <a
          href="https://github.com/parth-bhadra/blr-it-pulse/issues/new?template=data_point.md"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '12px',
            fontWeight: 500,
            padding: '7px 14px',
            borderRadius: '4px',
            background: 'var(--accent)',
            color: '#0a0c0f',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Open GitHub Issue ↗
        </a>
      </div>
    </div>
  )
}
