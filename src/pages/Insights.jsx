import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePlatformData } from '../hooks/usePlatformData.js'
import styles from './Insights.module.scss'

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value)

const tooltipFormatter = (value) => formatNumber(value)

function InsightsPage() {
  const { pullRequests, reviewAnalytics, computed } = usePlatformData()

  const prStats = computed.pullRequestStats
  const commitSummary = computed.commitSummary

  const statusBreakdown = useMemo(
    () => [
      { key: 'Open', value: prStats.open },
      { key: 'Draft', value: prStats.draft },
      { key: 'Merged', value: prStats.merged },
      { key: 'Closed', value: prStats.closed },
    ],
    [prStats],
  )

  const metrics = [
    {
      id: 'metric-total-prs',
      label: 'Total PRs (30d)',
      value: prStats.total,
      detail: `${prStats.mergeRate}% merge rate`,
    },
    {
      id: 'metric-review-time',
      label: 'Avg review time',
      value: `${prStats.averageReviewTime}h`,
      detail: `Cycle time ${prStats.averageCycleTime}h`,
    },
    {
      id: 'metric-lines',
      label: 'Lines changed',
      value: formatNumber(prStats.totalAdditions + prStats.totalDeletions),
      detail: `${formatNumber(prStats.totalAdditions)} added / ${formatNumber(prStats.totalDeletions)} removed`,
    },
    {
      id: 'metric-ai',
      label: 'AI suggestions',
      value: `${prStats.aiAdoptionRate}% adoption`,
      detail: `${prStats.aiSuggestionsAccepted} accepted`,
    },
  ]

  const recentPRs = pullRequests.slice(0, 6)
  const reviewerLoad = reviewAnalytics.reviewerLoad

  return (
    <div className={styles.page}>
      <section>
        <header className={styles.sectionHeader}>
          <h1>Pull request & commit analytics</h1>
          <p>Track throughput, review depth, and AI augmentation across the delivery pipeline.</p>
        </header>
        <div className={styles.metricGrid}>
          {metrics.map((metric) => (
            <article key={metric.id} className={styles.metricCard}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricDetail}>{metric.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.visualSection}>
        <div className={styles.chartCard}>
          <header>
            <h2>Velocity & change surface</h2>
            <p>Comparing commits shipped, merged PRs, and code churn over the last eight weeks.</p>
          </header>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={commitSummary.series}>
                <defs>
                  <linearGradient id="areaCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="areaAdditions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.4)" />
                <XAxis dataKey="week" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickFormatter={formatNumber} tickLine={false} width={60} />
                <Tooltip formatter={tooltipFormatter} />
                <Area type="monotone" dataKey="commits" stroke="#6366f1" fill="url(#areaCommits)" />
                <Area type="monotone" dataKey="additions" stroke="#22c55e" fill="url(#areaAdditions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <header>
            <h2>Reviewer load distribution</h2>
            <p>Ensure balanced review expectations and highlight where AI assistance is most valuable.</p>
          </header>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={reviewerLoad}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip />
                <Bar dataKey="reviews" stackId="a" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="avgTurnaroundHours" stackId="b" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <footer className={styles.chartFooter}>
            <span>Median review time {reviewAnalytics.medianReviewTimeHours}h</span>
            <span>Knowledge sharing index {reviewAnalytics.knowledgeSharingIndex}</span>
          </footer>
        </div>
      </section>

      <section className={styles.statusSection}>
        <div className={styles.statusCard}>
          <h2>PR status breakdown</h2>
          <ul>
            {statusBreakdown.map((item) => (
              <li key={item.key}>
                <span>{item.key}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.statusCard}>
          <h2>Collaboration signals</h2>
          <ul>
            {reviewAnalytics.teamEngagement.map((signal) => (
              <li key={signal.metric}>
                <span>{signal.metric}</span>
                <span>
                  {signal.value} <small className={styles.trend}>▲ {signal.trend}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.statusCard}>
          <h2>AI adoption tracker</h2>
          <p>
            {prStats.aiSuggestionsAccepted} accepted suggestions out of {prStats.aiSuggestionsOffered}
            .
          </p>
          <p>Adoption rate at {prStats.aiAdoptionRate}%. Target ≥ 70%.</p>
          <p>Focus on open PRs: {prStats.open} awaiting review.</p>
        </div>
      </section>

      <section className={styles.tableSection}>
        <header>
          <h2>Recent pull requests</h2>
          <p>Blend of throughput and review quality metrics for the latest activity.</p>
        </header>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Reviewer load</th>
                <th>AI adoption</th>
                <th>Cycle time</th>
              </tr>
            </thead>
            <tbody>
              {recentPRs.map((pr) => (
                <tr key={pr.id}>
                  <td>{pr.id}</td>
                  <td>{pr.title}</td>
                  <td>
                    <span className={styles.statusBadge} data-status={pr.status}>
                      {pr.status}
                    </span>
                  </td>
                  <td>
                    {pr.reviewers.join(', ')} · {pr.comments} comments · {pr.reviewTimeHours}h
                  </td>
                  <td>
                    {pr.aiSuggestionsAccepted}/{pr.aiSuggestionsOffered}
                  </td>
                  <td>{pr.cycleTimeHours ? `${pr.cycleTimeHours}h` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default InsightsPage
