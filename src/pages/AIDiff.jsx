import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CodeDiffViewer from '../components/diff/CodeDiffViewer.jsx'
import { usePlatformData } from '../hooks/usePlatformData.js'
import { analyseDiffScenario } from '../utils/aiSuggestions.js'
import styles from './AIDiff.module.scss'

const confidenceLabel = (confidence) => {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.6) return 'medium'
  return 'exploratory'
}

function AIDiffPage() {
  const location = useLocation()
  const { diffScenarios } = usePlatformData()
  const [selectedDiffId, setSelectedDiffId] = useState(diffScenarios[0]?.id ?? null)

  useEffect(() => {
    const highlight = location.state?.highlight
    if (highlight && diffScenarios.some((scenario) => scenario.id === highlight)) {
      setSelectedDiffId(highlight)
    }
  }, [location.state, diffScenarios])

  const selectedScenario = useMemo(
    () => diffScenarios.find((scenario) => scenario.id === selectedDiffId) ?? diffScenarios[0],
    [selectedDiffId, diffScenarios],
  )

  const analysis = useMemo(() => analyseDiffScenario(selectedScenario), [selectedScenario])

  const language = selectedScenario?.language ?? 'typescript'

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div>
          <h1>AI-augmented diff intelligence</h1>
          <p>
            Inspect code changes with semantic diffing, risk heuristics, and actionable AI guidance.
          </p>
        </div>
        <div className={styles.selector}>
          <label htmlFor="diff-selector">Scenario</label>
          <select
            id="diff-selector"
            value={selectedScenario?.id}
            onChange={(event) => setSelectedDiffId(event.target.value)}
          >
            {diffScenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={styles.summarySection}>
        <div className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Change surface</span>
            <span className={styles.summaryValue}>{analysis.changeSurface} lines</span>
            <span className={styles.summaryDetail}>
              +{analysis.additions} / −{analysis.deletions} ({analysis.netChange >= 0 ? '+' : ''}
              {analysis.netChange})
            </span>
          </article>
          <article className={styles.summaryCard} data-variant={analysis.riskBucket}>
            <span className={styles.summaryLabel}>Risk profile</span>
            <span className={styles.summaryValue}>{analysis.riskBucket}</span>
            <span className={styles.summaryDetail}>AI score {analysis.riskScore}</span>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Focus areas</span>
            <div className={styles.tagGroup}>
              {analysis.impactedAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
            <span className={styles.summaryDetail}>{selectedScenario?.filePath}</span>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Recommended validation</span>
            <ul>
              {analysis.focusRecommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <p className={styles.summaryNarrative}>{analysis.summary}</p>
      </section>

      <section className={styles.diffSection}>
        <div className={styles.viewerWrapper}>
          <CodeDiffViewer
            oldCode={selectedScenario?.oldCode ?? ''}
            newCode={selectedScenario?.newCode ?? ''}
            language={language}
          />
        </div>
        <aside className={styles.aiPanel}>
          <header>
            <h2>AI recommendations</h2>
            <p>
              Suggestions generated from semantic heuristics. Confidence scored by historical acceptance
              rates.
            </p>
          </header>
          <ul className={styles.suggestionList}>
            {analysis.suggestions.length ? (
              analysis.suggestions.map((suggestion) => (
                <li key={suggestion.title} className={styles.suggestionItem}>
                  <div className={styles.suggestionHead}>
                    <span className={styles.suggestionTitle}>{suggestion.title}</span>
                    <span
                      className={styles.suggestionConfidence}
                      data-level={confidenceLabel(suggestion.confidence)}
                    >
                      {confidenceLabel(suggestion.confidence)}
                    </span>
                  </div>
                  <p>{suggestion.body}</p>
                  <span className={styles.suggestionCategory}>{suggestion.category}</span>
                </li>
              ))
            ) : (
              <li className={styles.suggestionEmpty}>
                AI review found no additional risk signals.
              </li>
            )}
          </ul>
        </aside>
      </section>
    </div>
  )
}

export default AIDiffPage
