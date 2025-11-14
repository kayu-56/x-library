export const platformData = {
  repository: {
    name: 'HelixCode Collaboration Cloud',
    codeName: 'Project Helix',
    description:
      'AI-augmented workspace that combines code reviews, delivery intelligence, and continuous learning for engineering teams.',
    timezone: 'UTC',
    lastSyncedAt: '2024-11-14T09:45:00Z',
    metrics: {
      deploymentFrequency: 18,
      meanLeadTimeHours: 25,
      changeFailureRate: 7,
      availability: 99.4,
    },
    targets: {
      codeCoverage: 90,
      prTurnaroundHours: 16,
      stabilityIndex: 95,
    },
    guardrails: ['SOC2 aligned logging', 'PII redaction policies enforced', 'Role-based merge gates'],
  },
  pullRequests: [
    {
      id: 'PR-482',
      title: 'Introduce streaming diff renderer for large files',
      status: 'merged',
      author: 'Priya Patel',
      mergedAt: '2024-11-11T10:14:00Z',
      additions: 428,
      deletions: 188,
      filesChanged: 14,
      comments: 32,
      reviewTimeHours: 9,
      cycleTimeHours: 28,
      reviewers: ['Mira Chen', 'Diego Santos'],
      impactAreas: ['performance', 'stability'],
      aiSuggestionsOffered: 5,
      aiSuggestionsAccepted: 3,
      tags: ['diff-engine', 'observability', 'caching'],
    },
    {
      id: 'PR-489',
      title: 'Extend AI insight embeddings for Kotlin support',
      status: 'open',
      author: 'Lina Kovács',
      openedAt: '2024-11-12T16:20:00Z',
      additions: 162,
      deletions: 48,
      filesChanged: 6,
      comments: 11,
      reviewTimeHours: 5,
      reviewers: ['Diego Santos'],
      impactAreas: ['ai', 'developer-experience'],
      aiSuggestionsOffered: 3,
      aiSuggestionsAccepted: 1,
      tags: ['ml', 'nlp'],
    },
    {
      id: 'PR-476',
      title: 'Harden feature flag evaluation pipeline',
      status: 'merged',
      author: 'Mira Chen',
      mergedAt: '2024-11-07T08:32:00Z',
      additions: 204,
      deletions: 156,
      filesChanged: 9,
      comments: 21,
      reviewTimeHours: 12,
      cycleTimeHours: 35,
      reviewers: ['Priya Patel', 'Noah Ibrahim'],
      impactAreas: ['resilience', 'compliance'],
      aiSuggestionsOffered: 4,
      aiSuggestionsAccepted: 3,
      tags: ['feature-flags', 'security'],
    },
    {
      id: 'PR-471',
      title: 'Observability upgrades for review service',
      status: 'merged',
      author: 'Noah Ibrahim',
      mergedAt: '2024-11-02T15:54:00Z',
      additions: 310,
      deletions: 205,
      filesChanged: 12,
      comments: 27,
      reviewTimeHours: 16,
      cycleTimeHours: 44,
      reviewers: ['Mira Chen', 'Priya Patel'],
      impactAreas: ['observability', 'performance'],
      aiSuggestionsOffered: 6,
      aiSuggestionsAccepted: 4,
      tags: ['telemetry', 'metrics'],
    },
    {
      id: 'PR-490',
      title: 'Gamified learning badges data pipeline',
      status: 'draft',
      author: 'Diego Santos',
      openedAt: '2024-11-13T13:05:00Z',
      additions: 118,
      deletions: 36,
      filesChanged: 5,
      comments: 4,
      reviewTimeHours: 2,
      reviewers: ['Priya Patel'],
      impactAreas: ['engagement', 'analytics'],
      aiSuggestionsOffered: 2,
      aiSuggestionsAccepted: 1,
      tags: ['gamification', 'data-modeling'],
    },
    {
      id: 'PR-468',
      title: 'Deprecate legacy diff endpoint',
      status: 'closed',
      author: 'Aisha Khan',
      closedAt: '2024-10-29T09:20:00Z',
      additions: 48,
      deletions: 180,
      filesChanged: 7,
      comments: 12,
      reviewTimeHours: 7,
      cycleTimeHours: 22,
      reviewers: ['Lina Kovács'],
      impactAreas: ['api', 'cleanup'],
      aiSuggestionsOffered: 1,
      aiSuggestionsAccepted: 0,
      tags: ['deprecation'],
    },
  ],
  commitHistory: [
    {
      week: '2024-09-30',
      commits: 24,
      additions: 1260,
      deletions: 640,
      prsMerged: 6,
      aiSuggestionsAccepted: 8,
      reviewTurnaroundHours: 18,
    },
    {
      week: '2024-10-07',
      commits: 27,
      additions: 1480,
      deletions: 720,
      prsMerged: 8,
      aiSuggestionsAccepted: 11,
      reviewTurnaroundHours: 16,
    },
    {
      week: '2024-10-14',
      commits: 22,
      additions: 1110,
      deletions: 580,
      prsMerged: 7,
      aiSuggestionsAccepted: 9,
      reviewTurnaroundHours: 15,
    },
    {
      week: '2024-10-21',
      commits: 29,
      additions: 1525,
      deletions: 770,
      prsMerged: 9,
      aiSuggestionsAccepted: 13,
      reviewTurnaroundHours: 14,
    },
    {
      week: '2024-10-28',
      commits: 31,
      additions: 1680,
      deletions: 810,
      prsMerged: 10,
      aiSuggestionsAccepted: 15,
      reviewTurnaroundHours: 13,
    },
    {
      week: '2024-11-04',
      commits: 33,
      additions: 1740,
      deletions: 920,
      prsMerged: 11,
      aiSuggestionsAccepted: 17,
      reviewTurnaroundHours: 12,
    },
    {
      week: '2024-11-11',
      commits: 28,
      additions: 1390,
      deletions: 640,
      prsMerged: 8,
      aiSuggestionsAccepted: 14,
      reviewTurnaroundHours: 11,
    },
    {
      week: '2024-11-18',
      commits: 25,
      additions: 1220,
      deletions: 610,
      prsMerged: 7,
      aiSuggestionsAccepted: 12,
      reviewTurnaroundHours: 10,
    },
  ],
  reviewAnalytics: {
    medianReviewTimeHours: 11.4,
    meanReviewComments: 15,
    reworkRate: 0.18,
    reviewerCoverage: 92,
    knowledgeSharingIndex: 88,
    reviewerLoad: [
      { name: 'Mira Chen', reviews: 18, avgTurnaroundHours: 6.4 },
      { name: 'Priya Patel', reviews: 15, avgTurnaroundHours: 7.3 },
      { name: 'Diego Santos', reviews: 12, avgTurnaroundHours: 9.1 },
      { name: 'Lina Kovács', reviews: 10, avgTurnaroundHours: 8.2 },
    ],
    teamEngagement: [
      { metric: 'Pairing Sessions', value: 11, trend: 2 },
      { metric: 'Async Walkthroughs', value: 17, trend: 3 },
      { metric: 'Learning Hours', value: 46, trend: 5 },
    ],
  },
  diffScenarios: [
    {
      id: 'diff-helix-search',
      label: 'Search service streaming enhancements',
      language: 'typescript',
      filePath: 'services/search/searchService.ts',
      description:
        'Refactors the search service to support streaming responses, cancellation, and adaptive caching for high-latency queries.',
      oldCode: `export async function executeSearch(query: string, signal?: AbortSignal) {
  const response = await fetch('/api/search?q=' + encodeURIComponent(query), {
    method: 'GET',
    signal,
  })

  if (!response.ok) {
    throw new Error('Search failed')
  }

  const payload = await response.json()
  track('search.executed', { queryLength: query.length })

  return payload.results
}
`,
      newCode: `import { instrument } from '../observability/instrumentation'
import { SearchCache } from '../cache/SearchCache'

type SearchOptions = {
  signal?: AbortSignal
  intent?: 'instant' | 'deep'
  traceId?: string
}

const cache = new SearchCache({ windowMs: 180000 })

export async function executeSearch(query: string, options: SearchOptions = {}) {
  const startTime = performance.now()
  const controller = new AbortController()
  const mergedSignal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal

  const cachedResult = cache.get(query)
  if (cachedResult && options.intent !== 'deep') {
    instrument('search.cache.hit', { queryLength: query.length })
    return structuredClone(cachedResult)
  }

  const request = fetch('/api/search?q=' + encodeURIComponent(query), {
    method: 'GET',
    signal: mergedSignal,
    headers: {
      'x-trace-id': options.traceId ?? crypto.randomUUID(),
      'x-search-intent': options.intent ?? 'instant',
    },
  })

  const timeout = setTimeout(() => controller.abort('search-timeout'), 8000)

  try {
    const response = await request
    if (!response.ok) {
      instrument('search.error', { status: response.status })
      throw new Error('Search failed')
    }

    const payload = await response.json()
    cache.set(query, payload.results, { intent: options.intent ?? 'instant' })
    instrument('search.latency', {
      duration: performance.now() - startTime,
      intent: options.intent ?? 'instant',
    })
    return payload.results
  } catch (error) {
    instrument('search.failure', {
      message: error instanceof Error ? error.message : 'unknown',
    })
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
`,
      impactedAreas: ['latency', 'observability', 'resilience'],
    },
    {
      id: 'diff-feature-flags',
      label: 'Feature flag evaluation hardening',
      language: 'python',
      filePath: 'platform/flags/evaluator.py',
      description:
        'Improves type safety and introduces circuit breaking for degraded providers in the flag evaluation pipeline.',
      oldCode: `class FlagProvider:
    def __init__(self, client):
        self._client = client

    def get(self, key, default=None):
        value = self._client.fetch(key)
        return value if value is not None else default


def evaluate_flag(user, flag_key, default=False):
    provider = FlagProvider(client=get_client())
    flag = provider.get(flag_key)

    if flag is None:
        return default

    if flag.targeting is None:
        return flag.enabled

    if user.id in flag.targeting.get('denies', []):
        return False

    return user.id in flag.targeting.get('allows', []) or flag.enabled
`,
      newCode: `from dataclasses import dataclass
from typing import Optional, Protocol
import time

class ProviderUnavailable(RuntimeError):
    pass

class Provider(Protocol):
    def fetch(self, key: str, *, timeout: float = 1.2) -> Optional[dict]:
        ...

@dataclass(frozen=True)
class EvaluationContext:
    user_id: str
    attributes: dict[str, str]

class FlagProvider:
    def __init__(self, client: Provider, *, circuit_breaker):
        self._client = client
        self._breaker = circuit_breaker

    def get(self, key: str) -> Optional[dict]:
        if self._breaker.is_open(key):
            raise ProviderUnavailable(f'provider circuit open for {key}')

        started = time.perf_counter()
        try:
            value = self._client.fetch(key, timeout=1.5)
        except TimeoutError as exc:
            self._breaker.record_failure(key)
            raise ProviderUnavailable('flag provider timeout') from exc

        latency = time.perf_counter() - started
        self._breaker.record_latency(key, latency)
        return value


def evaluate_flag(context: EvaluationContext, flag_key: str, *, default: bool = False) -> bool:
    provider = FlagProvider(client=get_client(), circuit_breaker=breaker())

    try:
        flag = provider.get(flag_key)
    except ProviderUnavailable:
        audit_log('flag_provider_unavailable', key=flag_key, user=context.user_id)
        return default

    if flag is None:
        return default

    targeting = flag.get('targeting') or {}
    denies = set(targeting.get('denies', ()))
    allows = set(targeting.get('allows', ()))

    if context.user_id in denies:
        return False

    rollout = targeting.get('rollout_percentage')
    if rollout is not None and hash_percentage(context.user_id) > rollout:
        return False

    return context.user_id in allows or bool(flag.get('enabled', default))
`,
      impactedAreas: ['reliability', 'compliance', 'latency'],
    },
    {
      id: 'diff-telemetry',
      label: 'Telemetry pipeline batching',
      language: 'go',
      filePath: 'cmd/telemetry/reporter.go',
      description:
        'Introduces adaptive batching and backpressure-aware flushing for the telemetry reporter.',
      oldCode: `package telemetry

import (
    "context"
    "time"
)

type Reporter struct {
    sink Sink
}

func (r *Reporter) Emit(ctx context.Context, event Event) error {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    return r.sink.Send(ctx, []Event{event})
}
`,
      newCode: `package telemetry

import (
    "context"
    "time"
)

type Reporter struct {
    sink       Sink
    buffer     []Event
    maxBatch   int
    flushAfter time.Duration
}

func NewReporter(sink Sink) *Reporter {
    return &Reporter{
        sink:       sink,
        buffer:     make([]Event, 0, 128),
        maxBatch:   64,
        flushAfter: 750 * time.Millisecond,
    }
}

func (r *Reporter) Emit(ctx context.Context, event Event) error {
    r.buffer = append(r.buffer, event)
    if len(r.buffer) >= r.maxBatch {
        return r.flush(ctx)
    }

    timer := time.NewTimer(r.flushAfter)
    go func() {
        <-timer.C
        _ = r.flush(context.Background())
    }()

    return nil
}

func (r *Reporter) flush(ctx context.Context) error {
    if len(r.buffer) == 0 {
        return nil
    }

    batch := make([]Event, len(r.buffer))
    copy(batch, r.buffer)
    r.buffer = r.buffer[:0]

    ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
    defer cancel()

    return r.sink.Send(ctx, batch)
}
`,
      impactedAreas: ['throughput', 'stability'],
    },
  ],
  qualitySnapshots: [
    {
      sprint: 'Sprint 40',
      coverage: 84,
      maintainability: 86,
      reliability: 92,
      security: 95,
      techDebtIndex: 14,
      codeSmells: 52,
      blockers: 2,
      automationCoverage: 74,
      hotspotModules: ['services/search', 'cmd/telemetry'],
    },
    {
      sprint: 'Sprint 41',
      coverage: 86,
      maintainability: 88,
      reliability: 93,
      security: 96,
      techDebtIndex: 12,
      codeSmells: 49,
      blockers: 1,
      automationCoverage: 77,
      hotspotModules: ['platform/flags', 'services/search'],
    },
    {
      sprint: 'Sprint 42',
      coverage: 87,
      maintainability: 90,
      reliability: 95,
      security: 97,
      techDebtIndex: 10,
      codeSmells: 43,
      blockers: 1,
      automationCoverage: 80,
      hotspotModules: ['platform/flags'],
    },
    {
      sprint: 'Sprint 43',
      coverage: 89,
      maintainability: 92,
      reliability: 96,
      security: 98,
      techDebtIndex: 9,
      codeSmells: 38,
      blockers: 0,
      automationCoverage: 83,
      hotspotModules: ['cmd/telemetry'],
    },
  ],
  moduleQuality: [
    {
      module: 'services/search',
      owner: 'Discovery Team',
      coverage: 86,
      maintainability: 78,
      complexity: 23,
      risk: 0.58,
      stabilityTrend: 'improving',
      remediationTasks: ['Add streaming integration tests', 'Profile cache eviction'],
    },
    {
      module: 'platform/flags',
      owner: 'Platform Core',
      coverage: 81,
      maintainability: 82,
      complexity: 19,
      risk: 0.47,
      stabilityTrend: 'steady',
      remediationTasks: ['Expand circuit breaker metrics', 'Document rollout guardrails'],
    },
    {
      module: 'cmd/telemetry',
      owner: 'Observability',
      coverage: 78,
      maintainability: 75,
      complexity: 26,
      risk: 0.66,
      stabilityTrend: 'rising',
      remediationTasks: ['Tune batching thresholds', 'Add soak test coverage'],
    },
    {
      module: 'ui/review-dashboard',
      owner: 'Experience',
      coverage: 92,
      maintainability: 87,
      complexity: 14,
      risk: 0.34,
      stabilityTrend: 'improving',
      remediationTasks: ['Refresh accessibility audit', 'Refine empty state messaging'],
    },
  ],
  qualityAlerts: [
    {
      id: 'alert-telemetry-backpressure',
      title: 'Telemetry pipeline nearing throughput limits',
      severity: 'high',
      description:
        'Batch flush frequency increased by 35% over baseline. Risk of event loss during peak deploy windows.',
      owner: 'Observability',
      recommendedAction: 'Deploy adaptive backpressure guard and enable on-call alerting.',
      impactedMetrics: ['stability', 'data-freshness'],
    },
    {
      id: 'alert-search-cache',
      title: 'Streaming cache misses trending upward',
      severity: 'medium',
      description:
        'Cache hit rate dropped below 72% for instant searches; monitor eviction policy and champion dataset tuning.',
      owner: 'Discovery Team',
      recommendedAction: 'Expand profiling in staging and add synthetic monitoring case.',
      impactedMetrics: ['latency', 'experience'],
    },
    {
      id: 'alert-flag-rollouts',
      title: 'Flag rollout guardrail coverage at 81%',
      severity: 'low',
      description:
        'Not all mission-critical flags have rollout contracts defined. Potential compliance audit gap.',
      owner: 'Platform Core',
      recommendedAction: 'Audit remaining flags and assign owners for guardrail authoring.',
      impactedMetrics: ['compliance'],
    },
  ],
  automatedGuardrails: {
    blockingChecks: ['Coverage gate ≥ 85%', 'Static analysis critical issues = 0', 'Secrets scanning'],
    softChecks: ['AI suggestion adoption ≥ 60%', 'Telemetry heartbeat < 5m'],
  },
  learningContexts: [
    {
      id: 'context-streaming-search',
      label: 'Streaming search performance uplifts',
      description:
        'Improve end-to-end latency for high volume discovery queries and reduce cache miss penalties.',
      primaryTags: ['performance', 'search', 'observability'],
      resourceIds: ['res-streaming-1', 'res-cache-1', 'res-observability-1'],
      skillFocus: ['Architecture', 'Observability'],
      outcomeGoals: ['Latency p95 < 950ms', 'Cache hit rate > 88%'],
    },
    {
      id: 'context-flag-resilience',
      label: 'Feature flag resilience program',
      description:
        'Ensure fallbacks and governance exist for high-risk rollout workflows.',
      primaryTags: ['resilience', 'compliance'],
      resourceIds: ['res-flags-1', 'res-governance-1', 'res-python-1'],
      skillFocus: ['Reliability', 'Compliance'],
      outcomeGoals: ['Circuit breaker coverage 100%', 'Audit readiness achieved'],
    },
    {
      id: 'context-telemetry-throughput',
      label: 'Telemetry throughput optimization',
      description:
        'Adopt adaptive batching and backpressure signals to prevent data loss during surges.',
      primaryTags: ['observability', 'performance'],
      resourceIds: ['res-telemetry-1', 'res-go-1', 'res-distributed-1'],
      skillFocus: ['Observability', 'Systems'],
      outcomeGoals: ['Delivery success > 99.5%', 'Batch size tuning playbook'],
    },
    {
      id: 'context-ai-review',
      label: 'AI-assisted review excellence',
      description:
        'Leverage AI guidance to reduce review latency while keeping quality guardrails tight.',
      primaryTags: ['ai', 'code-review'],
      resourceIds: ['res-ai-review-1', 'res-ml-ethics-1'],
      skillFocus: ['AI Enablement', 'Team Enablement'],
      outcomeGoals: ['AI adoption ≥ 70%', 'Reviewer satisfaction score > 4.5/5'],
    },
  ],
  learningResources: [
    {
      id: 'res-streaming-1',
      title: 'Designing resilient streaming diff engines',
      format: 'article',
      difficulty: 'advanced',
      estimatedTimeMinutes: 18,
      tags: ['diff-engine', 'performance', 'observability'],
      summary:
        'Covers algorithms and memory strategies for streaming diffs with sub-second rendering requirements.',
      url: 'https://example.com/streaming-diff-engines',
      publisher: 'Increment Magazine',
      released: '2024-04-10',
      focusArea: 'Architecture',
    },
    {
      id: 'res-cache-1',
      title: 'Adaptive caching with intent-aware policies',
      format: 'whitepaper',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 25,
      tags: ['caching', 'performance'],
      summary: 'Explores cache segmentation strategies for multi-intent search workloads.',
      url: 'https://example.com/adaptive-cache',
      publisher: 'Helix Labs',
      released: '2024-03-18',
      focusArea: 'Performance',
    },
    {
      id: 'res-observability-1',
      title: 'Observability patterns for streaming APIs',
      format: 'video',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 32,
      tags: ['observability', 'telemetry'],
      summary: 'Instrumentation and tracing practices for high-cardinality data streams.',
      url: 'https://example.com/observability-patterns',
      publisher: 'o11y.tv',
      released: '2024-05-02',
      focusArea: 'Observability',
    },
    {
      id: 'res-flags-1',
      title: 'Circuit breakers for feature flag providers',
      format: 'guide',
      difficulty: 'advanced',
      estimatedTimeMinutes: 28,
      tags: ['feature-flags', 'resilience'],
      summary: 'Patterns for preventing cascading failures in distributed flag systems.',
      url: 'https://example.com/flag-circuit-breakers',
      publisher: 'Platform Practice',
      released: '2024-01-19',
      focusArea: 'Resilience',
    },
    {
      id: 'res-governance-1',
      title: 'Governance checklists for rollout safety',
      format: 'checklist',
      difficulty: 'beginner',
      estimatedTimeMinutes: 12,
      tags: ['governance', 'compliance'],
      summary: 'Step-by-step process to document rollout guardrails and approvals.',
      url: 'https://example.com/governance-checklist',
      publisher: 'Compliance Craft',
      released: '2023-12-05',
      focusArea: 'Compliance',
    },
    {
      id: 'res-python-1',
      title: 'Type-safe Python feature flag patterns',
      format: 'article',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 16,
      tags: ['python', 'typing'],
      summary: 'Enhancing Python feature systems with dataclasses and typing protocols.',
      url: 'https://example.com/python-flag-patterns',
      publisher: 'PyCraft',
      released: '2024-06-11',
      focusArea: 'Code Quality',
    },
    {
      id: 'res-telemetry-1',
      title: 'Backpressure techniques for telemetry pipelines',
      format: 'article',
      difficulty: 'advanced',
      estimatedTimeMinutes: 22,
      tags: ['telemetry', 'backpressure', 'go'],
      summary: 'Discusses adaptive batching and flow control in telemetry systems.',
      url: 'https://example.com/backpressure-techniques',
      publisher: 'Observability Weekly',
      released: '2024-02-27',
      focusArea: 'Observability',
    },
    {
      id: 'res-go-1',
      title: 'Idiomatic Go concurrency for data pipelines',
      format: 'course',
      difficulty: 'advanced',
      estimatedTimeMinutes: 45,
      tags: ['go', 'concurrency'],
      summary: 'Hands-on course covering Go concurrency primitives for streaming workloads.',
      url: 'https://example.com/go-concurrency',
      publisher: 'Gopher Academy',
      released: '2024-07-20',
      focusArea: 'Systems',
    },
    {
      id: 'res-distributed-1',
      title: 'Distributed tracing playbook',
      format: 'guide',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 30,
      tags: ['tracing', 'observability'],
      summary: 'Defines steps for instrumenting services with consistent trace semantics.',
      url: 'https://example.com/tracing-playbook',
      publisher: 'TraceLab',
      released: '2024-04-30',
      focusArea: 'Observability',
    },
    {
      id: 'res-ai-review-1',
      title: 'AI-assisted review guidelines',
      format: 'handbook',
      difficulty: 'beginner',
      estimatedTimeMinutes: 20,
      tags: ['ai', 'code-review'],
      summary: 'Codifies best practices for blending AI suggestions with human judgment.',
      url: 'https://example.com/ai-review-handbook',
      publisher: 'Ethical AI Consortium',
      released: '2024-08-14',
      focusArea: 'AI Enablement',
    },
    {
      id: 'res-ml-ethics-1',
      title: 'Responsible ML for developer tooling',
      format: 'webinar',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 35,
      tags: ['ai', 'ethics'],
      summary: 'Discusses bias mitigation and privacy guardrails for AI-assisted tooling.',
      url: 'https://example.com/responsible-ml',
      publisher: 'ML Trust Alliance',
      released: '2024-09-06',
      focusArea: 'Governance',
    },
  ],
  learningPaths: [
    {
      id: 'path-observability-pro',
      name: 'Observability Proficiency Sprint',
      description: 'Four-step path to uplift telemetry reliability and insight depth.',
      steps: [
        {
          id: 'step-o1',
          title: 'Audit current instrumentation coverage',
          resourceId: 'res-observability-1',
          durationDays: 2,
        },
        {
          id: 'step-o2',
          title: 'Implement adaptive batching blueprint',
          resourceId: 'res-telemetry-1',
          durationDays: 3,
        },
        {
          id: 'step-o3',
          title: 'Establish distributed trace contracts',
          resourceId: 'res-distributed-1',
          durationDays: 4,
        },
        {
          id: 'step-o4',
          title: 'Run load validation playbook',
          resourceId: 'res-go-1',
          durationDays: 2,
        },
      ],
      targetOutcomes: ['Reduce telemetry drop rate < 0.5%', 'Improve trace completeness to 95%'],
    },
    {
      id: 'path-ai-review',
      name: 'AI Reviewer Mastery',
      description: 'Develop practices for safe, efficient AI-assisted reviews.',
      steps: [
        {
          id: 'step-a1',
          title: 'Review AI suggestion adoption playbook',
          resourceId: 'res-ai-review-1',
          durationDays: 2,
        },
        {
          id: 'step-a2',
          title: 'Shadow cross-team review sessions',
          resourceId: null,
          durationDays: 3,
        },
        {
          id: 'step-a3',
          title: 'Define guardrail checklist for AI merges',
          resourceId: 'res-ml-ethics-1',
          durationDays: 2,
        },
      ],
      targetOutcomes: ['AI adoption ≥ 70%', 'Reviewer satisfaction ≥ 4.5'],
    },
  ],
  teamMembers: [
    {
      id: 'member-mira',
      name: 'Mira Chen',
      role: 'Staff Engineer, Platform Core',
      avatarColor: '#5B8DEF',
      level: 7,
      xp: 1860,
      growthRate: 12,
      skillLevels: {
        architecture: 92,
        codeQuality: 90,
        aiEnablement: 78,
        observability: 88,
        delivery: 85,
        mentorship: 94,
      },
      contributions: {
        prsMerged: 18,
        reviewsCompleted: 34,
        incidentsResolved: 4,
        learningHours: 14,
      },
      achievements: [
        {
          id: 'ach-quality-guardian',
          title: 'Quality Guardian',
          description: 'Maintained zero critical bugs for three sprints.',
          earnedAt: '2024-10-18',
        },
        {
          id: 'ach-ai-adopter',
          title: 'AI Co-Pilot Champion',
          description: 'Adopted 75% of validated AI review suggestions.',
          earnedAt: '2024-09-02',
        },
      ],
      focusAreas: [
        {
          area: 'AI-assisted review',
          recommendation: 'Pair with data science team to tune embeddings for backend services.',
        },
        {
          area: 'Platform advocacy',
          recommendation: 'Host monthly knowledge share on rollout guardrails.',
        },
      ],
    },
    {
      id: 'member-priya',
      name: 'Priya Patel',
      role: 'Senior Engineer, Discovery',
      avatarColor: '#F97393',
      level: 6,
      xp: 1640,
      growthRate: 10,
      skillLevels: {
        architecture: 86,
        codeQuality: 88,
        aiEnablement: 72,
        observability: 82,
        delivery: 90,
        mentorship: 80,
      },
      contributions: {
        prsMerged: 16,
        reviewsCompleted: 29,
        incidentsResolved: 3,
        learningHours: 12,
      },
      achievements: [
        {
          id: 'ach-latency',
          title: 'Latency Buster',
          description: 'Reduced search p95 latency by 22% sprint-over-sprint.',
          earnedAt: '2024-08-29',
        },
      ],
      focusAreas: [
        {
          area: 'Observability storytelling',
          recommendation: 'Document diff streaming telemetry wins for broader org.',
        },
      ],
    },
    {
      id: 'member-diego',
      name: 'Diego Santos',
      role: 'Staff Engineer, Experience',
      avatarColor: '#34D399',
      level: 6,
      xp: 1580,
      growthRate: 9,
      skillLevels: {
        architecture: 80,
        codeQuality: 84,
        aiEnablement: 88,
        observability: 76,
        delivery: 87,
        mentorship: 82,
      },
      contributions: {
        prsMerged: 14,
        reviewsCompleted: 26,
        incidentsResolved: 2,
        learningHours: 16,
      },
      achievements: [
        {
          id: 'ach-ux',
          title: 'Experience Curator',
          description: 'Delivered AI insight visualizations with 96% satisfaction score.',
          earnedAt: '2024-09-20',
        },
      ],
      focusAreas: [
        {
          area: 'Systems depth',
          recommendation: 'Pair with observability squad on telemetry optimizations.',
        },
      ],
    },
    {
      id: 'member-lina',
      name: 'Lina Kovács',
      role: 'Senior Engineer, ML Enablement',
      avatarColor: '#F59E0B',
      level: 5,
      xp: 1390,
      growthRate: 11,
      skillLevels: {
        architecture: 78,
        codeQuality: 82,
        aiEnablement: 91,
        observability: 74,
        delivery: 80,
        mentorship: 76,
      },
      contributions: {
        prsMerged: 12,
        reviewsCompleted: 21,
        incidentsResolved: 1,
        learningHours: 18,
      },
      achievements: [
        {
          id: 'ach-embeddings',
          title: 'Signal Crafter',
          description: 'Shipped multi-language embedding support for AI insights.',
          earnedAt: '2024-10-03',
        },
      ],
      focusAreas: [
        {
          area: 'Cross-team storytelling',
          recommendation: 'Lead workshop on responsible AI guardrails for reviewer tooling.',
        },
      ],
    },
  ],
  capabilityMatrix: [
    {
      capability: 'Architecture & Systems Thinking',
      teamAverage: 84,
      industryBenchmark: 80,
      topContributor: 'Mira Chen',
      trend: 2,
    },
    {
      capability: 'Code Quality & Testing',
      teamAverage: 88,
      industryBenchmark: 82,
      topContributor: 'Priya Patel',
      trend: 3,
    },
    {
      capability: 'AI Enablement',
      teamAverage: 82,
      industryBenchmark: 76,
      topContributor: 'Diego Santos',
      trend: 4,
    },
    {
      capability: 'Observability & Reliability',
      teamAverage: 85,
      industryBenchmark: 79,
      topContributor: 'Priya Patel',
      trend: 3,
    },
    {
      capability: 'Mentorship & Collaboration',
      teamAverage: 83,
      industryBenchmark: 77,
      topContributor: 'Mira Chen',
      trend: 2,
    },
  ],
  achievements: [
    {
      id: 'team-ai-adoption',
      title: 'AI Adoption Pioneers',
      description: 'Maintained 64%+ AI suggestion adoption for five consecutive sprints.',
      earnedAt: '2024-11-01',
    },
    {
      id: 'team-latency',
      title: 'Latency Vanguard',
      description: 'Reduced diff rendering latency below 650ms p95 across browsers.',
      earnedAt: '2024-10-10',
    },
  ],
}
