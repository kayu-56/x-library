import { useMemo, useState } from 'react'
import { usePlatformData } from '../hooks/usePlatformData.js'
import styles from './Learning.module.scss'

const normalise = (value) => value.toLowerCase()

function LearningPage() {
  const { learningContexts, learningResources, learningPaths } = usePlatformData()
  const [selectedContextId, setSelectedContextId] = useState(learningContexts[0]?.id ?? null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTags, setActiveTags] = useState(() => new Set())

  const selectedContext = useMemo(
    () => learningContexts.find((context) => context.id === selectedContextId) ?? learningContexts[0],
    [selectedContextId, learningContexts],
  )

  const allTags = useMemo(() => {
    const tags = new Set()
    learningResources.forEach((resource) => {
      resource.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [learningResources])

  const filteredResources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return learningResources.filter((resource) => {
      if (selectedContext?.resourceIds && !selectedContext.resourceIds.includes(resource.id)) {
        return false
      }

      if (query) {
        const haystack = `${resource.title} ${resource.summary} ${resource.tags?.join(' ')}`.toLowerCase()
        if (!haystack.includes(query)) {
          return false
        }
      }

      if (activeTags.size > 0) {
        const tags = resource.tags ?? []
        const hasAll = Array.from(activeTags).every((tag) =>
          tags.map(normalise).includes(normalise(tag)),
        )
        if (!hasAll) {
          return false
        }
      }

      return true
    })
  }, [learningResources, selectedContext, searchTerm, activeTags])

  const featuredPath = useMemo(() => {
    if (!selectedContext) return learningPaths[0]
    return (
      learningPaths.find((path) =>
        path.steps.some((step) => selectedContext.resourceIds?.includes(step.resourceId ?? '')),
      ) ?? learningPaths[0]
    )
  }, [learningPaths, selectedContext])

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <h1>Context-aware learning hub</h1>
          <p>
            Curated knowledge paths anchored to ongoing initiatives. Blend documentation, workshops, and
            compliance guardrails into repeatable learning loops.
          </p>
        </div>
        <div className={styles.searchBox}>
          <label htmlFor="resource-search" className="sr-only">
            Search learning resources
          </label>
          <input
            id="resource-search"
            type="search"
            placeholder="Search by title, summary, or tag..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </section>

      <section className={styles.contextSection}>
        <header>
          <h2>Active learning contexts</h2>
          <p>Choose a focus area to surface tailored resources and guardrail outcomes.</p>
        </header>
        <div className={styles.contextGrid}>
          {learningContexts.map((context) => (
            <button
              key={context.id}
              type="button"
              className={styles.contextCard}
              data-active={context.id === selectedContext?.id}
              onClick={() => setSelectedContextId(context.id)}
            >
              <span className={styles.contextLabel}>{context.label}</span>
              <p>{context.description}</p>
              <div className={styles.contextTags}>
                {context.primaryTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <footer>
                <span>{context.outcomeGoals.join(' · ')}</span>
              </footer>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.resourceSection}>
        <header className={styles.resourceHeader}>
          <h2>Recommended resources</h2>
          <p>
            Filter by topic, align with guardrail outcomes, and schedule short learning bursts with your
            team.
          </p>
        </header>
        <div className={styles.tagToolbar}>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.tagChip}
              data-active={activeTags.has(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className={styles.resourceGrid}>
          {filteredResources.map((resource) => (
            <article key={resource.id} className={styles.resourceCard}>
              <div className={styles.resourceMeta}>
                <span className={styles.resourceFormat}>{resource.format}</span>
                <span>{resource.difficulty}</span>
                <span>{resource.estimatedTimeMinutes} mins</span>
              </div>
              <h3>{resource.title}</h3>
              <p>{resource.summary}</p>
              <div className={styles.resourceTags}>
                {resource.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <footer>
                <span>{resource.publisher}</span>
                <a href={resource.url} target="_blank" rel="noreferrer">
                  Open resource
                </a>
              </footer>
            </article>
          ))}
          {filteredResources.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No resources match the current filters. Reset tag filters to expand results.</p>
            </div>
          ) : null}
        </div>
      </section>

      {featuredPath ? (
        <section className={styles.pathSection}>
          <header>
            <h2>Personalised learning path</h2>
            <p>{featuredPath.description}</p>
          </header>
          <ol>
            {featuredPath.steps.map((step) => (
              <li key={step.id}>
                <div>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepDuration}>{step.durationDays} days</span>
                </div>
                {step.resourceId ? (
                  <span className={styles.stepResource}>
                    Linked resource:{' '}
                    {
                      learningResources.find((resource) => resource.id === step.resourceId)?.title ??
                      'Independent exercise'
                    }
                  </span>
                ) : (
                  <span className={styles.stepResource}>Independent exercise</span>
                )}
              </li>
            ))}
          </ol>
          <footer>
            <span>Outcomes: {featuredPath.targetOutcomes.join(' · ')}</span>
          </footer>
        </section>
      ) : null}
    </div>
  )
}

export default LearningPage
