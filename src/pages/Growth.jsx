import { useMemo, useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { usePlatformData } from '../hooks/usePlatformData.js'
import styles from './Growth.module.scss'

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value)

function GrowthPage() {
  const { teamMembers, capabilityMatrix, achievements, computed } = usePlatformData()
  const [selectedMemberId, setSelectedMemberId] = useState(teamMembers[0]?.id ?? null)

  const selectedMember = useMemo(
    () => teamMembers.find((member) => member.id === selectedMemberId) ?? teamMembers[0],
    [selectedMemberId, teamMembers],
  )

  const skillSeries = useMemo(() => {
    if (!selectedMember) return []
    return Object.entries(selectedMember.skillLevels ?? {}).map(([category, value]) => ({
      category,
      value,
    }))
  }, [selectedMember])

  const teamPerformance = computed.teamPerformance
  const skillMatrix = computed.skillMatrix

  return (
    <div className={styles.page}>
      <section className={styles.summarySection}>
        <header>
          <h1>Skill growth & gamified development</h1>
          <p>Track competency momentum, celebrate achievements, and surface next-best coaching moves.</p>
        </header>
        <div className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total team XP</span>
            <span className={styles.summaryValue}>{formatNumber(teamPerformance.totalXP)}</span>
            <span className={styles.summaryDetail}>
              Avg growth velocity {teamPerformance.averageGrowthRate}% per sprint
            </span>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Reviews completed</span>
            <span className={styles.summaryValue}>{teamPerformance.totalReviews}</span>
            <span className={styles.summaryDetail}>
              Incidents resolved {teamPerformance.totalIncidentsResolved}
            </span>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Learning investment</span>
            <span className={styles.summaryValue}>{teamPerformance.totalLearningHours}h</span>
            <span className={styles.summaryDetail}>
              AI enablement leaders: {teamPerformance.aiLeaders.map((leader) => leader.name).join(', ')}
            </span>
          </article>
        </div>
      </section>

      <section className={styles.memberSection}>
        <div className={styles.memberSelector}>
          <h2>Contributor spotlight</h2>
          <ul>
            {teamMembers.map((member) => (
              <li key={member.id}>
                <button
                  type="button"
                  onClick={() => setSelectedMemberId(member.id)}
                  data-active={member.id === selectedMember?.id}
                >
                  <span className={styles.memberDot} style={{ backgroundColor: member.avatarColor }} />
                  <div>
                    <span className={styles.memberName}>{member.name}</span>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.memberDetail}>
          <div className={styles.memberStats}>
            <div>
              <span>Level</span>
              <strong>{selectedMember?.level}</strong>
            </div>
            <div>
              <span>XP</span>
              <strong>{formatNumber(selectedMember?.xp ?? 0)}</strong>
            </div>
            <div>
              <span>Growth rate</span>
              <strong>{selectedMember?.growthRate ?? 0}%</strong>
            </div>
          </div>
          <div className={styles.radarWrapper}>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={skillSeries} outerRadius={120}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.5)" />
                <PolarAngleAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                <Radar
                  dataKey="value"
                  stroke="#6366f1"
                  fill="rgba(99, 102, 241, 0.45)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.focusList}>
            <h3>Growth focus</h3>
            <ul>
              {selectedMember?.focusAreas?.map((focus) => (
                <li key={focus.area}>
                  <span>{focus.area}</span>
                  <span>{focus.recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.achievementList}>
            <h3>Achievements</h3>
            <ul>
              {selectedMember?.achievements?.map((achievement) => (
                <li key={achievement.id}>
                  <span className={styles.badge}>{achievement.title}</span>
                  <span>{achievement.description}</span>
                  <span className={styles.badgeMeta}>{achievement.earnedAt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.capabilitySection}>
        <header>
          <h2>Capability matrix</h2>
          <p>Team-wide averages benchmarked against industry peers, with top contributors per pillar.</p>
        </header>
        <div className={styles.capabilityTableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Team avg</th>
                <th>Benchmark</th>
                <th>Top contributor</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {capabilityMatrix.map((row) => (
                <tr key={row.capability}>
                  <td>{row.capability}</td>
                  <td>{row.teamAverage}</td>
                  <td>{row.industryBenchmark}</td>
                  <td>{row.topContributor}</td>
                  <td>
                    <span className={styles.trendBadge}>▲ {row.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.teamAchievements}>
        <header>
          <h2>Team achievements</h2>
          <p>Celebrate collective milestones unlocked via collaboration and AI co-pilot adoption.</p>
        </header>
        <div className={styles.achievementGrid}>
          {achievements.map((achievement) => (
            <article key={achievement.id}>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <span>{achievement.earnedAt}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.skillMatrixSection}>
        <header>
          <h2>Skill heatmap</h2>
          <p>Average competency with top contributor callouts for each domain.</p>
        </header>
        <div className={styles.skillMatrixGrid}>
          {skillMatrix.categories.map((category) => (
            <article key={category.category}>
              <h3>{category.category}</h3>
              <p>Average {category.average}</p>
              <span>Leader: {category.topContributor}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default GrowthPage
