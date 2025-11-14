import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlatformData } from '../hooks/usePlatformData.js'
import styles from './Overview.module.scss'

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value)

const formatTrend = (value) => {
  if (value === 0) return 'flat'
  return value > 0 ? `▲ ${value}` : `▼ ${Math.abs(value)}`
}

function OverviewPage() {
  const navigate = useNavigate()
  const { repository, computed, qualityAlerts, diffScenarios, pullRequests } = usePlatformData()

  const heroMetrics = useMemo(
    () => [
      {
        label: 'Deploys / month',
        value: repository?.metrics?.deploymentFrequency ?? 0,
        helper: 'Target 20',
      },
      {
        label: 'Lead time (hrs)',
        value: repository?.metrics?.meanLeadTimeHours ?? 0,
        helper: `Target ${repository?.targets?.prTurnaroundHours ?? 0}`,
      },
      {
        label: 'Change failure %',
        value: repository?.metrics?.changeFailureRate ?? 0,
        helper: 'Industry benchmark 15%',
      },
      {
        label: 'Availability',
        value: `${repository?.metrics?.availability ?? 0}%`,
        helper: 'SLO 99.0%',
      },
    ],
    [repository],
  )

  const prStats = computed.pullRequestStats
  const commitSummary = computed.commitSummary
  const qualityOverview = computed.qualityOverview
  const teamPerformance = computed.teamPerformance
  const learningSummary = computed.learningSummary

  const highlightMetrics = [
    {
      id: 'metric-active-prs',
      label: 'Active pull requests',
      value: prStats.open,
      detail: `${prStats.mergeRate}% merge rate`,
      accent: 'violet',
    },
    {
      id: 'metric-review-time',
      label: 'Avg review turnaround',
      value: `${prStats.averageReviewTime}h`,
      detail: `${commitSummary.averageReviewTurnaround}h team avg last 4 weeks`,
      accent: 'indigo',
    },
    {
      id: 'metric-quality-score',
      label: 'Quality health score',
      value: qualityOverview.healthScore,
      detail: `Coverage trend ${formatTrend(qualityOverview.coverageTrend)} pts`,
      accent: 'emerald',
    },
    {
      id: 'metric-ai-adoption',
      label: 'AI suggestion adoption',
      value: `${prStats.aiAdoptionRate}%`,
      detail: `${prStats.aiSuggestionsAccepted}/${prStats.aiSuggestionsOffered} suggestions`,
      accent: 'amber',
    },
  ]

  const focusStreams = diffScenarios.slice(0, 3)
  const activeAlerts = computed.alertsRanked.slice(0, 3)
  const recentPullRequests = pullRequests
    .filter((pr) => pr.status === 'merged')
    .slice(0, 3)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>Fusion Control Center</h1>
          <p>
            {repository?.description ??
              'AI-augmented workspace orchestrating code reviews, release health, and learning.'}
          </p>
          <div className={styles.heroMetrics}>
            {heroMetrics.map((metric) => (
              <div key={metric.label} className={styles.heroMetric}>
                <span className={styles.heroMetricValue}>{metric.value}</span>
                <span className={styles.heroMetricLabel}>{metric.label}</span>
                <span className={styles.heroMetricHelper}>{metric.helper}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className={styles.heroSummary}>
          <div>
            <span className={styles.heroSummaryTitle}>Latest sync</span>
            <p className={styles.heroSummaryBody}>
              {prStats.merged} PRs merged · {formatNumber(commitSummary.averageAdditions)} avg additions ·
              Quality score {qualityOverview.healthScore}
            </p>
          </div>
          <button className={styles.heroButton} type="button" onClick={() => navigate('/ai-diff')}>
            Review AI insights
          </button>
        </aside>
      </section>

      <section className={styles.metricsSection}>
        <header className={styles.sectionHeader}>
          <h2>Engineering pulse</h2>
          <p>Blended view of delivery velocity, review health, and AI-assisted quality.</p>
        </header>
        <div className={styles.metricGrid}>
          {highlightMetrics.map((metric) => (
            <article key={metric.id} className={styles.metricCard} data-accent={metric.accent}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricDetail}>{metric.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.focusSection}>
        <header className={styles.sectionHeader}>
          <h2>Active change streams</h2>
          <p>Select a stream to inspect AI-guided diffs and review recommendations.</p>
        </header>
        <div className={styles.focusGrid}>
          {focusStreams.map((stream) => (
            <article key={stream.id} className={styles.focusCard}>
              <div className={styles.focusMeta}>
                <span className={styles.focusBadge}>{stream.language.toUpperCase()}</span>
                <span className={styles.focusPath}>{stream.filePath}</span>
              </div>
              <h3>{stream.label}</h3>
              <p>{stream.description}</p>
              <div className={styles.focusTags}>
                {stream.impactedAreas?.map((tag) => (
                  <span key={tag} className={styles.focusTag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={styles.focusAction}
                onClick={() => navigate('/ai-diff', { state: { highlight: stream.id } })}
              >
                Inspect diff
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.alertSection}>
        <header className={styles.sectionHeader}>
          <h2>Risk monitor</h2>
          <p>Proactive guardrails surfaced from code quality gates and operational metrics.</p>
        </header>
        <div className={styles.alertList}>
          {activeAlerts.map((alert) => (
            <article key={alert.id} className={styles.alertCard} data-severity={alert.severity}>
              <div className={styles.alertHead}>
                <span className={styles.alertSeverity}>{alert.severity}</span>
                <span className={styles.alertOwner}>{alert.owner}</span>
              </div>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              <footer className={styles.alertFooter}>
                <span>{alert.recommendedAction}</span>
                <div className={styles.alertTags}>
                  {alert.impactedMetrics?.map((metric) => (
                    <span key={metric}>{metric}</span>
                  ))}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.teamSection}>
        <header className={styles.sectionHeader}>
          <h2>Team momentum</h2>
          <p>Highlights from contributor performance and AI collaboration adoption.</p>
        </header>
        <div className={styles.teamGrid}>
          <article className={styles.teamCard}>
            <h3>Top contributor</h3>
            <p className={styles.teamPrimary}>{teamPerformance.topContributor?.name}</p>
            <p className={styles.teamSecondary}>{teamPerformance.topContributor?.role}</p>
            <dl className={styles.teamStats}>
              <div>
                <dt>XP</dt>
                <dd>{formatNumber(teamPerformance.topContributor?.xp ?? 0)}</dd>
              </div>
              <div>
                <dt>Reviews</dt>
                <dd>{teamPerformance.topContributor?.contributions?.reviewsCompleted ?? 0}</dd>
              </div>
              <div>
                <dt>Learning hrs</dt>
                <dd>{teamPerformance.topContributor?.contributions?.learningHours ?? 0}</dd>
              </div>
            </dl>
          </article>
          <article className={styles.teamCard}>
            <h3>AI enablement leaders</h3>
            <ul className={styles.simpleList}>
              {teamPerformance.aiLeaders.map((leader) => (
                <li key={leader.name}>
                  <span>{leader.name}</span>
                  <span>{leader.value}</span>
                </li>
              ))}
            </ul>
            <p className={styles.teamDetail}>
              Avg growth rate {teamPerformance.averageGrowthRate}% · Total reviews {teamPerformance.totalReviews}
            </p>
          </article>
          <article className={styles.teamCard}>
            <h3>Recent merges</h3>
            <ul className={styles.simpleList}>
              {recentPullRequests.map((pr) => (
                <li key={pr.id}>
                  <span>{pr.id}</span>
                  <span>{pr.reviewTimeHours}h review · {pr.comments} comments</span>
                </li>
              ))}
            </ul>
            <p className={styles.teamDetail}>
              Team learning hours {teamPerformance.totalLearningHours} · Incidents resolved {teamPerformance.totalIncidentsResolved}
            </p>
          </article>
        </div>
      </section>

      <section className={styles.learningSection}>
        <header className={styles.sectionHeader}>
          <h2>Learning signals</h2>
          <p>AI-curated content queues aligned to active initiatives and growth goals.</p>
        </header>
        <div className={styles.learningGrid}>
          <article className={styles.learningCard}>
            <h3>Coverage</h3>
            <p className={styles.learningHighlight}>
              {learningSummary.resourceCount} resources · {learningSummary.contextCount} contexts
            </p>
            <p>Average learning burst: {learningSummary.averageDuration} minutes.</p>
          </article>
          <article className={styles.learningCard}>
            <h3>Top focus tags</h3>
            <div className={styles.tagCloud}>
              {learningSummary.topTags.map((tag) => (
                <span key={tag.tag}>{tag.tag}</span>
              ))}
            </div>
            <p className={styles.learningHint}>
              Surface personalised recommendations in the Learning Hub.
            </p>
          </article>
          <article className={styles.learningCard}>
            <h3>Next actions</h3>
            <ul className={styles.simpleList}>
              {qualityAlerts.slice(0, 2).map((alert) => (
                <li key={alert.id}>
                  <span>{alert.owner}</span>
                  <span>{alert.recommendedAction}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}

export default OverviewPage
