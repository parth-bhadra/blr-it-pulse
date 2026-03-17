import { Card, CardHeader, CardBody, IndRow, TwoColGrid } from './ui.jsx'

function signalDir(signal) {
  if (['bearish', 'warning', 'declining'].includes(signal)) return 'bad'
  if (['healthy', 'growing', 'stable'].includes(signal)) return 'good'
  return 'neutral'
}

export default function BLRGroundLayer({ blr }) {
  const { commercial_realestate: re, consumer_economy: ce } = blr

  return (
    <TwoColGrid>
      {/* Real Estate */}
      <Card>
        <CardHeader title="Commercial Real Estate · BLR" source="JLL / CBRE · quarterly" />
        <CardBody>
          <IndRow
            name="Grade A absorption"
            meta="Total BLR office market"
            value={`${re.grade_a_absorption_msqft}M sq.ft`}
            change="— Flat YoY"
            changeDir="neutral"
          />
          <IndRow
            name="Overall vacancy rate"
            meta="All tech corridors"
            value={`${re.vacancy_rate_pct}%`}
            change={`▼ Up from ${re.vacancy_rate_prev_year_pct}% (prev year)`}
            changeDir="bad"
          />
          <IndRow
            name="Lease renewals vs new"
            meta="Signal: expansion vs consolidation"
            value={`${re.renewal_vs_new_pct}% renewals`}
            change="▼ Less new expansion"
            changeDir="bad"
          />
          <IndRow
            name="Co-working occupancy"
            meta="Brigade, WeWork-equiv, etc."
            value={`${re.coworking_occupancy_pct}%`}
            change="▲ Startups still active"
            changeDir="good"
          />
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Vacancy by corridor</div>
            {re.corridors.map(c => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text)' }}>{c.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: c.signal === 'warning' ? 'var(--yellow)' : 'var(--green)' }}>
                  {c.vacancy_pct}%
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Consumer Economy */}
      <Card>
        <CardHeader title="Consumer Economy Proxy · BLR" source="Multiple · community update" />
        <CardBody>
          <IndRow
            name="Residential demand"
            meta={`${ce.residential_demand.corridors.slice(0, 2).join(' · ')}`}
            value={`Prices ${ce.residential_demand.price_trend}, volumes ${ce.residential_demand.volume_trend}`}
            change="— Affordability squeeze"
            changeDir="neutral"
          />
          <IndRow
            name="New vehicle registrations"
            meta="BLR RTO · proxy for IT income confidence"
            value={`↓ ${Math.abs(ce.vehicle_registrations.yoy_change_pct)}%`}
            change="— Mild softening"
            changeDir="neutral"
          />
          <IndRow
            name="F&B revenue · Koramangala"
            meta="Restaurant cluster footfall index"
            value="Stable"
            change="▲ Weekend footfall ok"
            changeDir="good"
          />
          <IndRow
            name="Upskilling enrollment spike"
            meta="UpGrad · Simplilearn BLR cohorts"
            value={`↑ ${ce.upskilling_enrollments.yoy_change_pct}%`}
            change="▼ Anxiety signal (counter-intuitive)"
            changeDir="bad"
          />

          <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '6px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--yellow)', marginBottom: '4px', fontWeight: 600 }}>
              HOW TO READ: UPSKILLING SPIKE
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
              A sharp rise in upskilling enrollments is a leading anxiety indicator — it signals that workers feel threatened, not that the market is confident. Watch this as a 3–6 month leading indicator of broader displacement.
            </div>
          </div>
        </CardBody>
      </Card>
    </TwoColGrid>
  )
}
