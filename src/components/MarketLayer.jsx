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
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  elements: { point: { radius: 0 }, line: { tension: 0.4, borderWidth: 2 } },
  animation: { duration: 1200 },
}

export default function MarketLayer({ market }) {
  const { bse_it_index, it_stocks, us_layoffs } = market

  const bseChartData = {
    labels: bse_it_index.history.map(h => h.date),
    datasets: [{
      data: bse_it_index.history.map(h => h.value),
      borderColor: '#f43f5e',
      backgroundColor: 'rgba(244,63,94,0.08)',
      fill: true,
    }]
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
          <div style={{ height: '72px', marginTop: '12px' }}>
            <Line data={bseChartData} options={chartOpts} />
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
