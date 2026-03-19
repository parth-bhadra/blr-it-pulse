export default function ContributeBar({ onContribute }) {
  return (
    <div className="contribute-bar">
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '3px' }}>
          Help keep this dashboard accurate
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
          Open source · MIT licensed · Submit data points via GitHub PR or the form below
        </div>
      </div>

      <div className="contribute-bar-buttons">
        <a
          href="https://github.com/parth-bhadra/blr-it-pulse"
          target="_blank"
          rel="noopener noreferrer"
          className="contribute-bar-btn"
        >
          ★ View on GitHub
        </a>

        <button
          onClick={onContribute}
          className="contribute-bar-btn"
        >
          + Submit data point
        </button>

        <a
          href="https://github.com/parth-bhadra/blr-it-pulse/issues/new?template=data_point.md"
          target="_blank"
          rel="noopener noreferrer"
          className="contribute-bar-btn contribute-bar-btn-primary"
        >
          Open GitHub Issue ↗
        </a>
      </div>
    </div>
  )
}
