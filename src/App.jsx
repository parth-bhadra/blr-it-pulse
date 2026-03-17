import { useState } from 'react'
import Header from './components/Header.jsx'
import RiskMeter from './components/RiskMeter.jsx'
import MarketLayer from './components/MarketLayer.jsx'
import HiringLayer from './components/HiringLayer.jsx'
import BLRGroundLayer from './components/BLRGroundLayer.jsx'
import EducationLayer from './components/EducationLayer.jsx'
import SignalFeed from './components/SignalFeed.jsx'
import ContributeBar from './components/ContributeBar.jsx'
import Footer from './components/Footer.jsx'
import ContributeModal from './components/ContributeModal.jsx'

import scoresData from '../data/scores.json'
import marketData from '../data/market.json'
import hiringData from '../data/hiring.json'
import blrData from '../data/blr-ground.json'
import educationData from '../data/education.json'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header lastUpdated={scoresData.score} />

      <main style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>

        <RiskMeter score={scoresData.score} />

        <SectionLabel>Layer 1 — Market signals (auto-updated weekly)</SectionLabel>
        <MarketLayer market={marketData} />

        <SectionLabel>Layer 2 — Hiring signals (community tracked · monthly)</SectionLabel>
        <HiringLayer hiring={hiringData} />

        <SectionLabel>Layer 3 — Bangalore ground truth (community tracked · quarterly)</SectionLabel>
        <BLRGroundLayer blr={blrData} />

        <SectionLabel>Layer 4 — Education &amp; placement signals (bi-annual)</SectionLabel>
        <EducationLayer education={educationData} />

        <SignalFeed signals={scoresData.signal_feed} />

        <ContributeBar onContribute={() => setModalOpen(true)} />

      </main>

      <Footer />

      {modalOpen && <ContributeModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)',
      fontSize: '10px',
      fontWeight: 600,
      color: 'var(--muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      marginBottom: '-12px',
    }}>
      {children}
    </div>
  )
}
