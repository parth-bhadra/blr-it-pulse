import { Card, CardHeader, CardBody, IndRow, TwoColGrid } from './ui.jsx'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Filler, Tooltip
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip)

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false }, 
    tooltip: { 
      enabled: true,
      backgroundColor: '#1f2937',
      padding: 10,
      cornerRadius: 6,
      callbacks: {
        label: (ctx) => `₹${ctx.raw?.toLocaleString('en-IN') || ctx.raw}`
      }
    }
  },
  scales: { 
    x: { display: false }, 
    y: { display: false } 
  },
  elements: { point: { radius: 0 }, line: { tension: 0.4, borderWidth: 2 } },
  animation: { duration: 1200 },
}

const chartOptsWithLabels = {
  ...chartOpts,
  plugins: {
    ...chartOpts.plugins,
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        borderRadius: 2,
        useBorderRadius: true,
        padding: 12,
        font: { size: 10, weight: '500' },
        color: '#6b7280',
      }
    }
  },
}

export default function MarketLayer({ market }) {
  const { bse_it_index, nifty_50, it_stocks, us_layoffs } = market

  const bseChartData = {
    labels: bse_it_index.history.map(h => h.date),
    datasets: [{
      label: 'BSE IT Index',
      data: bse_it_index.history.map(h => h.value),
      borderColor: '#f43f5e',
      backgroundColor: 'rgba(244,63,94,0.08)',
      fill: true,
    }]
  }

  const niftyChartData = {
    labels: nifty_50.history.map(h => h.date),
    datasets: [{
      label: 'Nifty 50',
      data: nifty_50.history.map(h => h.value),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.08)',
      fill: true,
    }]
  }

  const combinedChartData = {
    labels: bse_it_index.history.map(h => h.date),
    datasets: [
      {
        label: 'BSE IT Index',
        data: bse_it_index.history.map(h => h.value),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244,63,94,0.08)',
        fill: true,
      },
      {
        label: 'Nifty 50',
        data: nifty_50.history.map(h => h.value),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.08)',
        fill: true,
      }
    ]
  }

  const layoffChartData = {
    labels: us_layoffs.history.map(h => h.period),
    datasets: [{
      data: us_layoffs.history.map(h => h.count),
      backgroundColor: ['rgba(251,191,36,0.4)', 'rgba(251,191,36,0.5)', 'rgba(244,63,94,0.5)', 'rgba(244,63,94,0.6)'],
      borderRadius: 3,
    }]
  }

  return (
    <TwoColGrid>
      {/* BSE IT Index */}
      <Card>
        <CardHeader title="BSE IT Index + IT Majors" source="NSE · manual update" />
        <CardBody>
          <IndRow
            name="BSE IT Index"
            meta="Trailing 6-month trend"
            value={`₹${bse_it_index.current.toLocaleString('en-IN')}`}
            change="▼ 24% since Jan 2026"
            changeDir="bad"
          />
          {it_stocks.map(stock => (
            <IndRow
              key={stock.ticker}
              name={stock.name}
              meta={`NSE: ${stock.ticker} · Util: ${stock.utilisation_pct}%`}
              value={`₹${stock.price_inr.toLocaleString('en-IN')}`}
              change={stock.hiring_guidance}
              changeDir={stock.signal === 'neutral' ? 'neutral' : 'bad'}
            />
          ))}
          
          {/* Combined comparison chart */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              BSE IT vs Nifty 50 (6-month)
            </div>
            <div style={{ height: '90px' }}>
              <Line data={combinedChartData} options={chartOptsWithLabels} />
            </div>
          </div>

          {/* Value labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f43f5e' }}></div>
              <span style={{ color: '#6b7280' }}>IT: ₹{bse_it_index.history[0].value.toLocaleString('en-IN')} → ₹{bse_it_index.current.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#22c55e' }}></div>
              <span style={{ color: '#6b7280' }}>Nifty: ₹{nifty_50.history[0].value.toLocaleString('en-IN')} → ₹{nifty_50.current.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(244,63,94,0.08)', borderRadius: '6px', fontSize: '11px', color: '#991b1b' }}>
            <strong>Insight:</strong> IT Index down 4.8x more than Nifty — sector-specific weakness, not broad market decline
          </div>
        </CardBody>
      </Card>

      {/* US Layoffs */}
      <Card>
        <CardHeader title="US Tech Layoffs" source="Layoffs.fyi · weekly" />
        <CardBody>
          <IndRow
            name="YTD 2026 Layoffs"
            meta="Global tech — leads BLR by ~2–3 qtrs"
            value={`${(us_layoffs.ytd_2026 / 1000).toFixed(0)}K+`}
            change={`▼ ${us_layoffs.ytd_2026_companies} companies`}
            changeDir="bad"
          />
          <IndRow
            name="Full Year 2025"
            meta="Historical comparison"
            value={`${(us_layoffs.full_year_2025 / 1000).toFixed(0)}K`}
            change="▼ YoY rate accelerating"
            changeDir="bad"
          />
          <IndRow
            name="AI-attributed cause"
            meta="% citing automation / restructure"
            value={`~${us_layoffs.ai_attributed_pct}%`}
            change="▼ Rising share"
            changeDir="bad"
          />
          <IndRow
            name="Lag effect estimate"
            meta="Time before BLR impact"
            value={`${us_layoffs.lag_effect_quarters} qtrs`}
            change="— Historical average"
            changeDir="neutral"
          />
          <div style={{ height: '72px', marginTop: '12px' }}>
            <Bar data={layoffChartData} options={chartOpts} />
          </div>
        </CardBody>
      </Card>
    </TwoColGrid>
  )
}
