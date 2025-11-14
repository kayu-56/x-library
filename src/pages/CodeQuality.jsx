import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ProgressBar from '../components/common/ProgressBar.jsx'
import { usePlatformData } from '../hooks/usePlatformData.js'
import styles from './CodeQuality.module.scss'

function CodeQualityPage() {
  const { qualitySnapshots, moduleQuality, computed } = usePlatformData()

  const qualityOverview = computed.qualityOverview
  const latestSnapshot = qualityOverview.latest ?? {}
  const alerts = computed.alertsRanked
  const alertImpact = computed.alertImpact

  return (
    <div className={styles.page}>
      <section className={styles.summarySection}>
        <header className={styles.sectionHeader}>
          <h1>Code quality insights</h1>
          <p>
            Monitor quality gates, hotspots, and automated guardrails in real time to keep the codebase
            healthy.
          </p>
        </header>
        <div className={styles.summaryGrid}>
          <ProgressBar
            label="Coverage"
            value={latestSnapshot.coverage ?? 0}
            threshold={90}
            hint={`Trend ${qualityOverview.coverageTrend >= 0 ? '+' : ''}${qualityOverview.coverageTrend} pts`}
          />
          <ProgressBar
            label="Maintainability"
            value={latestSnapshot.maintainability ?? 0}
            threshold={88}
            hint={`Δ ${qualityOverview.maintainabilityTrend >= 0 ? '+' : ''}${qualityOverview.maintainabilityTrend}`}
            tone="emerald"
          />
          <ProgressBar
            label="Reliability"
            value={latestSnapshot.reliability ?? 0}
            threshold={95}
            tone="cyan"
            hint={`Blockers ${latestSnapshot.blockers ?? 0}`}
          />
          <ProgressBar
            label="Automation coverage"
            value={latestSnapshot.automationCoverage ?? 0}
            threshold={90}
            tone="amber"
            hint={`Trend ${qualityOverview.automationTrend >= 0 ? '+' : ''}${qualityOverview.automationTrend}`}
          />
        </div>
        <div className={styles.healthScore}>
          <span className={styles.healthLabel}>Composite health score</span>
          <span className={styles.healthValue}>{qualityOverview.healthScore}</span>
          <span className={styles.healthDetail}>
            Tech debt index {latestSnapshot.techDebtIndex ?? 0} · Code smells {latestSnapshot.codeSmells ?? 0}
          </span>
        </div>
      </section>

      <section className={styles.trendSection}>
        <header>
          <h2>Quality trend lines</h2>
          <p>Sprint-by-sprint guardrail tracking across key quality indicators.</p>
        </header>
        <div className={styles.trendChart}>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={qualitySnapshots}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
              <XAxis dataKey="sprint" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" domain={[60, 100]} tickLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="coverage" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="maintainability" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="reliability" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="security" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={styles.alertSection}>
        <header>
          <h2>Active alerts & impact</h2>
          <p>Prioritised quality guardrails organised by severity and impacted metrics.</p>
        </header>
        <div className={styles.alertLayout}>
          <div className={styles.alertList}>
            {alerts.map((alert) => (
              <article key={alert.id} className={styles.alertCard} data-severity={alert.severity}>
                <header>
                  <span className={styles.alertSeverity}>{alert.severity}</span>
                  <span className={styles.alertOwner}>{alert.owner}</span>
                </header>
                <h3>{alert.title}</h3>
                <p>{alert.description}</p>
                <footer>
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
          <aside className={styles.impactPane}>
            <h3>Impact heatmap</h3>
            <ul>
              {alertImpact.map((impact) => (
                <li key={impact.metric}>
                  <span>{impact.metric}</span>
                  <span>{impact.score}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.moduleSection}>
        <header>
          <h2>Module scorecard</h2>
          <p>High-signal snapshot of component health, risk, and remediation pathways.</p>
        </header>
        <div className={styles.moduleGrid}>
          {moduleQuality.map((module) => (
            <article key={module.module} className={styles.moduleCard}>
              <header>
                <span className={styles.moduleName}>{module.module}</span>
                <span className={styles.moduleOwner}>{module.owner}</span>
              </header>
              <div className={styles.moduleMetrics}>
                <div>
                  <span className={styles.moduleMetricLabel}>Coverage</span>
                  <span className={styles.moduleMetricValue}>{module.coverage}%</span>
                </div>
                <div>
                  <span className={styles.moduleMetricLabel}>Maintainability</span>
                  <span className={styles.moduleMetricValue}>{module.maintainability}</span>
                </div>
                <div>
                  <span className={styles.moduleMetricLabel}>Complexity</span>
                  <span className={styles.moduleMetricValue}>{module.complexity}</span>
                </div>
              </div>
              <div className={styles.moduleRisk} data-trend={module.stabilityTrend}>
                <span>Risk score {Math.round(module.risk * 100)}</span>
                <span>{module.stabilityTrend}</span>
              </div>
              <ul className={styles.moduleTasks}>
                {module.remediationTasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CodeQualityPage
