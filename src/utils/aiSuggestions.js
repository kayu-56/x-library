import { diffLines } from 'diff'

const severityScale = {
  low: { label: 'low', threshold: 0.35 },
  medium: { label: 'medium', threshold: 0.65 },
  high: { label: 'high', threshold: 1 },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const toRiskBucket = (score) => {
  if (score <= severityScale.low.threshold) return 'low'
  if (score <= severityScale.medium.threshold) return 'medium'
  return 'high'
}

const normaliseCount = (count) => (Number.isFinite(count) ? count : 0)

const joinParts = (parts) => parts.filter(Boolean).join(' ')

const uniqueByTitle = (suggestions) => {
  const seen = new Set()
  return suggestions.filter((suggestion) => {
    if (seen.has(suggestion.title)) return false
    seen.add(suggestion.title)
    return true
  })
}

const collectRecommendations = (text) => {
  const recommendations = []

  if (/cache\.(set|put)/i.test(text)) {
    recommendations.push('Add cache eviction and stale data scenarios to integration tests.')
  }

  if (/breaker|circuit/i.test(text)) {
    recommendations.push('Simulate provider outage to validate circuit breaker behaviour.')
  }

  if (/flush\(/i.test(text) || /NewTimer/i.test(text)) {
    recommendations.push('Execute soak and burst load tests for telemetry batching logic.')
  }

  if (/AbortController|AbortSignal/i.test(text)) {
    recommendations.push('Add cancellation coverage to client-facing contract tests.')
  }

  if (/audit_log|compliance|governance/i.test(text)) {
    recommendations.push('Review audit trail for PII redaction and retention policies.')
  }

  return [...new Set(recommendations)]
}

const createSuggestion = (title, body, category, confidence = 0.7) => ({
  title,
  body,
  category,
  confidence,
})

const buildSummary = (scenario, additions, deletions) => {
  const impacted = scenario.impactedAreas?.length
    ? `Focus areas: ${scenario.impactedAreas.join(', ')}.`
    : ''
  return joinParts([
    scenario.description ?? 'No description provided.',
    `Change surface: ${additions + deletions} lines (${additions} additions / ${deletions} removals).`,
    impacted,
  ])
}

export function analyseDiffScenario(scenario) {
  if (!scenario) {
    return {
      additions: 0,
      deletions: 0,
      netChange: 0,
      changeSurface: 0,
      riskScore: 0,
      riskBucket: 'low',
      suggestions: [],
      focusRecommendations: [],
      summary: 'No diff selected.',
    }
  }

  const diff = diffLines(scenario.oldCode ?? '', scenario.newCode ?? '')

  let additions = 0
  let deletions = 0
  const addedParts = []
  const removedParts = []

  diff.forEach((part) => {
    const lines = normaliseCount(part.count ?? part.value.split('\n').length)

    if (part.added) {
      additions += lines
      addedParts.push(part.value)
    }

    if (part.removed) {
      deletions += lines
      removedParts.push(part.value)
    }
  })

  const addedText = addedParts.join('\n')
  const removedText = removedParts.join('\n')
  const aggregatedText = `${addedText}\n${removedText}`

  const changeSurface = additions + deletions
  const netChange = additions - deletions

  let riskScore = 0.3 + changeSurface / 600
  riskScore += (scenario.impactedAreas?.length ?? 0) * 0.08
  if (/TODO|FIXME/i.test(addedText)) {
    riskScore += 0.1
  }
  if (/experimental|temporary/i.test(addedText)) {
    riskScore += 0.1
  }
  riskScore = clamp(riskScore, 0.1, 1)

  const suggestions = []

  if (/cache\.set/i.test(addedText) && !/cache\.(invalidate|delete)/i.test(aggregatedText)) {
    suggestions.push(
      createSuggestion(
        'Verify cache invalidation strategy',
        'New caching layer introduced without matching invalidation path detected. Confirm eviction or TTL coverage to prevent stale search payloads.',
        'performance',
      ),
    )
  }

  if (/instrument\('/i.test(addedText)) {
    suggestions.push(
      createSuggestion(
        'Wire telemetry to dashboards',
        'New instrumentation hooks were added. Ensure dashboards or alerts consume the metrics to avoid silent signal drift.',
        'observability',
        0.8,
      ),
    )
  }

  if (/AbortController|AbortSignal\.any/i.test(addedText)) {
    suggestions.push(
      createSuggestion(
        'Exercise cancellation pathways',
        'Abortable requests now participate in search flows. Add end-to-end tests validating UI abort behaviour and downstream cleanup.',
        'resilience',
        0.75,
      ),
    )
  }

  if (/breaker|circuit/i.test(addedText) && !/fallback/i.test(addedText)) {
    suggestions.push(
      createSuggestion(
        'Document circuit-breaker fallbacks',
        'Circuit breaker logic was introduced. Confirm fallback journeys and alerting expectations are documented for on-call handoffs.',
        'reliability',
        0.65,
      ),
    )
  }

  if (/audit_log|compliance|governance/i.test(addedText)) {
    suggestions.push(
      createSuggestion(
        'Review compliance logging',
        'Audit logging touches compliance surfaces. Validate retention policies and access controls across environments.',
        'compliance',
        0.7,
      ),
    )
  }

  if (/NewTimer/i.test(addedText) && !/Stop\(/i.test(addedText)) {
    suggestions.push(
      createSuggestion(
        'Stop timers to prevent leaks',
        'Timer-based flush introduced without an explicit Stop call. Ensure timers are stopped when flushing early to avoid goroutine leaks.',
        'stability',
        0.85,
      ),
    )
  }

  if (/structuredClone|structured_clone/i.test(addedText)) {
    suggestions.push(
      createSuggestion(
        'Assess clone performance impact',
        'Deep clones guard against shared references but add latency. Benchmark large payload cloning to ensure p95 remains within targets.',
        'performance',
        0.6,
      ),
    )
  }

  if (/hash_percentage|rollout_percentage/i.test(addedText) && !/seed/i.test(addedText)) {
    suggestions.push(
      createSuggestion(
        'Validate rollout determinism',
        'Hash-based rollout logic is present. Confirm consistent seeding across services so users experience stable flag evaluations.',
        'compliance',
        0.65,
      ),
    )
  }

  if (changeSurface > 420) {
    suggestions.push(
      createSuggestion(
        'Consider incremental rollout plan',
        'Large change surface detected. Break into smaller deploy steps or feature flags to reduce blast radius.',
        'process',
        0.55,
      ),
    )
  }

  const focusRecommendations = collectRecommendations(aggregatedText)

  const summary = buildSummary(scenario, additions, deletions)
  const riskBucket = toRiskBucket(riskScore)

  return {
    additions,
    deletions,
    netChange,
    changeSurface,
    riskScore: Number(riskScore.toFixed(2)),
    riskBucket,
    suggestions: uniqueByTitle(suggestions),
    focusRecommendations,
    impactedAreas: scenario.impactedAreas ?? [],
    summary,
  }
}
