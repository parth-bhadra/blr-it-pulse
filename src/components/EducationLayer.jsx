import { Card, CardHeader, CardBody, IndRow, TwoColGrid, RiskTag } from './ui.jsx'

export default function EducationLayer({ education }) {
  const { placement_rates: pr, role_risk_matrix: rrm } = education

  return (
    <TwoColGrid>
      {/* Placement Rates */}
      <Card>
        <CardHeader title="College Placement Rates · BLR" source="Community / alumni reports" />
        <CardBody>
          <IndRow
            name="Top-tier non-IIT colleges"
            meta="RV · BMS · PESIT · MSRIT · NIE"
            value={`${pr.overall_placement_pct}%`}
            change={`▼ Down from ${pr.peak_pct_2022}% (${pr.season.split('-')[0] - 4})`}
            changeDir="bad"
          />
          <IndRow
            name="Avg. first offer package"
            meta="IT roles, BLR colleges"
            value={`₹${pr.avg_first_offer_lpa}L`}
            change="— Stagnant 3 years"
            changeDir="neutral"
          />
          <IndRow
            name="Offer-to-joining ratio"
            meta="Offers not rescinded or delayed"
            value={`${pr.offer_to_joining_ratio_pct}%`}
            change="▼ Many offers not converting"
            changeDir="bad"
          />
          <IndRow
            name="Non-IT placement share"
            meta="CS/IT grads taking non-tech jobs"
            value={`↑ ${pr.non_it_placement_pct}%`}
            change={`▼ Rising from ${pr.non_it_prev_year_pct}% — structural signal`}
            changeDir="bad"
          />

          {/* History mini-table */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              5-year placement trend
            </div>
            {pr.history.map(h => (
              <div key={h.season} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{h.season}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: h.placement_pct >= 85 ? 'var(--green)' : h.placement_pct >= 75 ? 'var(--yellow)' : 'var(--red)' }}>
                  {h.placement_pct}% · ₹{h.avg_lpa}L
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Role Risk Matrix */}
      <Card>
        <CardHeader title="Role Disruption Risk Matrix" source="Synthesized assessment" />
        <CardBody style={{ padding: '0' }}>
          <div style={{ overflowY: 'auto', maxHeight: '480px' }}>
            {rrm.map((role, i) => (
              <div key={role.role} style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '10px 16px',
                borderBottom: i < rrm.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>
                    {role.role}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', lineHeight: 1.5 }}>
                    {role.reason}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--blue)', marginTop: '4px' }}>
                    → {role.action}
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                  <RiskTag level={role.risk_level} />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </TwoColGrid>
  )
}
