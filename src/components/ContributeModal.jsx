import { useState } from 'react'

const CATEGORIES = [
  'Hiring — Job posting volumes (Naukri / LinkedIn)',
  'Hiring — Campus placement data',
  'Market — BSE / NSE stock data',
  'Market — US tech layoffs',
  'BLR — Office real estate (JLL / CBRE)',
  'BLR — Consumer economy proxy',
  'BLR — Upskilling enrollment data',
  'Education — College placement rates',
  'Other — New signal suggestion',
]

export default function ContributeModal({ onClose }) {
  const [category, setCategory] = useState(CATEGORIES[0])
  const [indicator, setIndicator] = useState('')
  const [value, setValue] = useState('')
  const [source, setSource] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!indicator.trim() || !value.trim()) return
    // In production: POST to GitHub Issues API or a form backend
    // For now: open a pre-filled GitHub issue URL
    const title = encodeURIComponent(`[Data Point] ${category}: ${indicator}`)
    const body = encodeURIComponent(
      `## Data Point Submission\n\n` +
      `**Category:** ${category}\n` +
      `**Indicator:** ${indicator}\n` +
      `**Value observed:** ${value}\n` +
      `**Source / evidence:** ${source}\n` +
      `**Date of observation:** ${date}\n\n` +
      `---\n_Submitted via BLR IT Pulse dashboard_`
    )
    window.open(
      `https://github.com/parth-bhadra/blr-it-pulse/issues/new?title=${title}&body=${body}&labels=data-point`,
      '_blank'
    )
    setSubmitted(true)
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border2)',
        borderRadius: '10px',
        padding: '24px',
        width: '480px',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {submitted ? (
          <SuccessState onClose={onClose} />
        ) : (
          <>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                Submit a data point
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
                Submissions open a GitHub issue for maintainer review before publishing
              </div>
            </div>

            <FormRow label="Indicator category">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={inputStyle}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </FormRow>

            <FormRow label="Specific indicator">
              <input
                style={inputStyle}
                value={indicator}
                onChange={e => setIndicator(e.target.value)}
                placeholder="e.g. Manual QA posting count on Naukri BLR"
              />
            </FormRow>

            <FormRow label="Value observed">
              <input
                style={inputStyle}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="e.g. 1,240 postings (down from 1,720 last month)"
              />
            </FormRow>

            <FormRow label="Source / evidence">
              <input
                style={inputStyle}
                value={source}
                onChange={e => setSource(e.target.value)}
                placeholder="URL or description of source"
              />
            </FormRow>

            <FormRow label="Date of observation">
              <input
                type="date"
                style={inputStyle}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </FormRow>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button onClick={onClose} style={{ ...btnStyle, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border2)' }}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!indicator.trim() || !value.trim()}
                style={{ ...btnStyle, background: 'var(--accent)', color: '#0a0c0f', opacity: (!indicator.trim() || !value.trim()) ? 0.5 : 1 }}
              >
                Submit via GitHub ↗
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function FormRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{label}</label>
      {children}
    </div>
  )
}

function SuccessState({ onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '12px 0', textAlign: 'center' }}>
      <div style={{ fontSize: '32px' }}>✓</div>
      <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--green)' }}>GitHub issue opened!</div>
      <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
        A maintainer will review your submission and merge it into the data files. Thank you for contributing to the community.
      </div>
      <button onClick={onClose} style={{ ...btnStyle, background: 'var(--accent)', color: '#0a0c0f', marginTop: '8px' }}>
        Close
      </button>
    </div>
  )
}

const inputStyle = {
  background: 'var(--bg3)',
  border: '1px solid var(--border2)',
  borderRadius: '4px',
  padding: '8px 10px',
  color: 'var(--text)',
  fontFamily: 'var(--mono)',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
}

const btnStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '12px',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
}
