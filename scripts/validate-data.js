#!/usr/bin/env node
/**
 * validate-data.js
 * Validates all JSON data files in /data against expected schemas.
 * Run: node scripts/validate-data.js
 */

import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')

let errors = 0

function error(file, msg) {
  console.error(`  ✗ [${file}] ${msg}`)
  errors++
}

function check(file, obj, key, type) {
  if (!(key in obj)) {
    error(file, `Missing required key: "${key}"`)
    return false
  }
  if (typeof obj[key] !== type) {
    error(file, `"${key}" should be ${type}, got ${typeof obj[key]}`)
    return false
  }
  return true
}

// ── market.json ──────────────────────────────────────────────────────────────
function validateMarket(data, file) {
  console.log('  Checking market.json...')
  check(file, data, 'bse_it_index', 'object')
  check(file, data.bse_it_index, 'current', 'number')
  check(file, data.bse_it_index, 'signal', 'string')

  if (!Array.isArray(data.bse_it_index?.history)) error(file, 'bse_it_index.history must be an array')
  if (!Array.isArray(data.it_stocks)) error(file, 'it_stocks must be an array')
  if (!Array.isArray(data.us_layoffs?.history)) error(file, 'us_layoffs.history must be an array')

  const validSignals = ['bearish', 'bullish', 'neutral', 'warning']
  if (data.bse_it_index?.signal && !validSignals.includes(data.bse_it_index.signal)) {
    error(file, `bse_it_index.signal must be one of: ${validSignals.join(', ')}`)
  }
}

// ── hiring.json ──────────────────────────────────────────────────────────────
function validateHiring(data, file) {
  console.log('  Checking hiring.json...')
  if (!Array.isArray(data.job_postings)) { error(file, 'job_postings must be an array'); return }

  data.job_postings.forEach((jp, i) => {
    const ctx = `job_postings[${i}]`
    if (!jp.id) error(file, `${ctx} missing id`)
    if (!jp.label) error(file, `${ctx} missing label`)
    if (typeof jp.yoy_change_pct !== 'number') error(file, `${ctx}.yoy_change_pct must be number`)
  })

  const companies = data.campus_hiring?.companies
  if (!Array.isArray(companies)) { error(file, 'campus_hiring.companies must be an array'); return }

  companies.forEach((co, i) => {
    if (!co.name) error(file, `campus_hiring.companies[${i}] missing name`)
    if (typeof co.fy26_target !== 'number') error(file, `campus_hiring.companies[${i}].fy26_target must be number`)
  })
}

// ── blr-ground.json ───────────────────────────────────────────────────────────
function validateBLR(data, file) {
  console.log('  Checking blr-ground.json...')
  check(file, data, 'commercial_realestate', 'object')
  check(file, data, 'consumer_economy', 'object')

  const re = data.commercial_realestate
  if (re) {
    if (typeof re.vacancy_rate_pct !== 'number') error(file, 'commercial_realestate.vacancy_rate_pct must be number')
    if (!Array.isArray(re.corridors)) error(file, 'commercial_realestate.corridors must be an array')
    if (!Array.isArray(re.history)) error(file, 'commercial_realestate.history must be an array')
  }
}

// ── education.json ────────────────────────────────────────────────────────────
function validateEducation(data, file) {
  console.log('  Checking education.json...')
  check(file, data, 'placement_rates', 'object')
  if (!Array.isArray(data.role_risk_matrix)) error(file, 'role_risk_matrix must be an array')

  const pr = data.placement_rates
  if (pr) {
    if (typeof pr.overall_placement_pct !== 'number') error(file, 'placement_rates.overall_placement_pct must be number')
    if (pr.overall_placement_pct < 0 || pr.overall_placement_pct > 100) {
      error(file, 'placement_rates.overall_placement_pct must be 0–100')
    }
  }

  const validRisk = ['critical', 'high', 'moderate', 'low', 'very_low', 'growing']
  data.role_risk_matrix?.forEach((r, i) => {
    if (!r.role) error(file, `role_risk_matrix[${i}] missing role`)
    if (!validRisk.includes(r.risk_level)) {
      error(file, `role_risk_matrix[${i}].risk_level "${r.risk_level}" not in [${validRisk.join(', ')}]`)
    }
  })
}

// ── scores.json ───────────────────────────────────────────────────────────────
function validateScores(data, file) {
  console.log('  Checking scores.json...')
  check(file, data, 'score', 'object')
  if (typeof data.score?.composite !== 'number') error(file, 'score.composite must be number')
  if (data.score?.composite < 0 || data.score?.composite > 100) error(file, 'score.composite must be 0–100')
  if (!Array.isArray(data.signal_feed)) error(file, 'signal_feed must be an array')

  data.signal_feed?.forEach((s, i) => {
    if (!s.id) error(file, `signal_feed[${i}] missing id`)
    if (!s.text) error(file, `signal_feed[${i}] missing text`)
    if (!s.date) error(file, `signal_feed[${i}] missing date`)
    // Validate date format YYYY-MM-DD
    if (s.date && !/^\d{4}-\d{2}-\d{2}$/.test(s.date)) {
      error(file, `signal_feed[${i}].date "${s.date}" must be YYYY-MM-DD format`)
    }
  })
}

// ── meta check ────────────────────────────────────────────────────────────────
function validateMeta(data, file) {
  if (!data._meta) {
    console.warn(`  ⚠  [${file}] Missing _meta block (recommended)`)
    return
  }
  if (!data._meta.last_updated) console.warn(`  ⚠  [${file}] _meta.last_updated not set`)
}

// ── runner ────────────────────────────────────────────────────────────────────
const validators = {
  'market.json': validateMarket,
  'hiring.json': validateHiring,
  'blr-ground.json': validateBLR,
  'education.json': validateEducation,
  'scores.json': validateScores,
}

console.log('\n🔍 Validating data files...\n')

const files = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))

for (const file of files) {
  const path = join(DATA_DIR, file)
  let data
  try {
    data = JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    error(file, `Invalid JSON: ${e.message}`)
    continue
  }

  validateMeta(data, file)
  if (validators[file]) validators[file](data, file)
  else console.log(`  ℹ  [${file}] No specific validator — JSON parse OK`)
}

console.log()
if (errors === 0) {
  console.log('✅ All data files valid!\n')
  process.exit(0)
} else {
  console.error(`❌ ${errors} error(s) found. Fix before merging.\n`)
  process.exit(1)
}
