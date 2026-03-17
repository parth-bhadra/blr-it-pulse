import { Card, CardHeader, CardBody, IndRow, TwoColGrid, RiskTag } from './ui.jsx'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  animation: { duration: 1200 },
}

function signalToDir(signal) {
  if (['critical', 'bearish', 'declining'].includes(signal)) return 'bad'
  if (['growing', 'healthy'].includes(signal)) return 'good'
  return 'neutral'
}

export default function HiringLayer({ hiring }) {
  const { job_postings, jd_signals, campus_hiring } = hiring

  const campusData = {
    labels: ['FY22', 'FY23', 'FY24', 'FY25', 'FY26e'],
    datasets: [{
      data: [180000, 220000, 129000, 92000, 87000],
      backgroundColor: [
        'rgba(34,211,160,0.5)', 'rgba(34,211,160,0.5)',
        'rgba(251,191,36,0.5)', 'rgba(244,63,94,0.4)', 'rgba(244,63,94,0.6)'
      ],
      borderRadius: 3,
    }]
  }

  return (
    <TwoColGrid>
      {/* Job Postings */}
      <Card>
        <CardHeader title="Job Posting Volumes · BLR" source="Naukri / LinkedIn · manual" />
        <CardBody>
          {job_postings.map(jp => (
            <IndRow
              key={jp.id}
              name={jp.label}
              meta={jp.description}
              value={jp.yoy_change_pct > 0 ? `↑ ${jp.yoy_change_pct}%` : `↓ ${Math.abs(jp.yoy_change_pct)}%`}
              change={jp.yoy_change_pct > 0 ? '▲ YoY' : '▼ YoY'}
              changeDir={signalToDir(jp.signal)}
            />
          ))}
          <div style={{ marginTop: '12px', padding: '8px 10px', background: 'var(--bg3)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
              "AI tools required" in JDs
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', color: 'var(--yellow)', fontWeight: 600, marginTop: '2px' }}>
              {jd_signals.ai_tools_required_pct}% of all tech JDs
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
              Up from {jd_signals.ai_tools_required_prev_year_pct}% last year — ~4x increase
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Campus Hiring */}
      <Card>
        <CardHeader title="Campus Hiring · Big 4 IT" source="Company reports · quarterly" />
        <CardBody>
          {campus_hiring.companies.map(co => (
            <IndRow
              key={co.name}
              name={co.name}
              meta={co.note}
              value={`~${(co.fy26_target / 1000).toFixed(0)}K`}
              change={`FY24: ${(co.fy24_actual / 1000).toFixed(0)}K → FY26: ${(co.fy26_target / 1000).toFixed(0)}K`}
              changeDir="bad"
            />
          ))}
          <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg3)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>Big 4 combined FY26 vs FY24</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--red)', fontWeight: 600 }}>
                ↓ {campus_hiring.decline_pct.toFixed(1)}% fewer hires
              </div>
            </div>
            <RiskTag level="critical" />
          </div>
          <div style={{ height: '72px', marginTop: '12px' }}>
            <Bar data={campusData} options={chartOpts} />
          </div>
        </CardBody>
      </Card>
    </TwoColGrid>
  )
}
