export default function Footer() {
  return (
    <footer style={{
      padding: '14px 24px',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      flexWrap: 'wrap',
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
        BLR IT Pulse · Open source · MIT licensed ·{' '}
        <a href="https://github.com/parth-bhadra/blr-it-pulse" target="_blank" rel="noopener noreferrer">
          github.com/parth-bhadra/blr-it-pulse
        </a>
        {' '}· Data lag varies by indicator
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
        Not financial advice · For informational purposes only
      </div>
    </footer>
  )
}
