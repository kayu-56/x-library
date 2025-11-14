const severityWeight = {
  high: 3,
  medium: 2,
  low: 1,
}

const orderBySeverity = (a, b) => severityWeight[b.severity] - severityWeight[a.severity]

const average = (values) => {
  if (!values.length) return 0
  return values.reduce((total, value) => total + value, 0) / values.length
}

const sum = (values) => values.reduce((total, value) => total + value, 0)

export function getPullRequestStats(pullRequests) {
  if (!pullRequests?.length) {
    return {
      total: 0,
      open: 0,
      merged: 0,
      closed: 0,
      draft: 0,
      mergeRate: 0,
      averageReviewTime: 0,
      averageCycleTime: 0,
      totalAdditions: 0,
      totalDeletions: 0,
      aiAdoptionRate: 0,
      aiSuggestionsAccepted: 0,
      aiSuggestionsOffered: 0,
    }
  }

  const totals = pullRequests.reduce(
    (acc, pr) => {
      acc.total += 1
      acc.additions += pr.additions ?? 0
      acc.deletions += pr.deletions ?? 0
      acc.reviewTimes.push(pr.reviewTimeHours ?? 0)
      acc.cycleTimes.push(pr.cycleTimeHours ?? 0)
      acc.aiAccepted += pr.aiSuggestionsAccepted ?? 0
      acc.aiOffered += pr.aiSuggestionsOffered ?? 0

      switch (pr.status) {
        case 'merged':
          acc.merged += 1
          break
        case 'open':
          acc.open += 1
          break
        case 'closed':
          acc.closed += 1
          break
        case 'draft':
          acc.draft += 1
          break
        default:
          break
      }

      return acc
    },
    {
      total: 0,
      open: 0,
      merged: 0,
      closed: 0,
      draft: 0,
      additions: 0,
      deletions: 0,
      reviewTimes: [],
      cycleTimes: [],
      aiAccepted: 0,
      aiOffered: 0,
    },
  )

  const mergeRateDenominator = Math.max(totals.total - totals.draft, 1)
  const mergeRate = (totals.merged / mergeRateDenominator) * 100
  const aiAdoptionRate = totals.aiOffered
    ? Math.round((totals.aiAccepted / totals.aiOffered) * 100)
    : 0

  return {
    total: totals.total,
    open: totals.open,
    merged: totals.merged,
    closed: totals.closed,
    draft: totals.draft,
    mergeRate: Math.round(mergeRate),
    averageReviewTime: Number(average(totals.reviewTimes).toFixed(1)),
    averageCycleTime: Number(average(totals.cycleTimes).toFixed(1)),
    totalAdditions: totals.additions,
    totalDeletions: totals.deletions,
    aiAdoptionRate,
    aiSuggestionsAccepted: totals.aiAccepted,
    aiSuggestionsOffered: totals.aiOffered,
  }
}

export function getCommitSummary(commitHistory, window = 4) {
  if (!commitHistory?.length) {
    return {
      latestVelocity: 0,
      averageCommits: 0,
      averageAdditions: 0,
      averageDeletions: 0,
      averageReviewTurnaround: 0,
      aiAcceptanceAverage: 0,
      trend: 0,
      series: [],
    }
  }

  const sorted = [...commitHistory]
  const recent = sorted.slice(-window)
  const latest = sorted[sorted.length - 1]
  const prior = sorted[sorted.length - 2]

  const averageCommits = average(recent.map((entry) => entry.commits))
  const averageAdditions = average(recent.map((entry) => entry.additions))
  const averageDeletions = average(recent.map((entry) => entry.deletions))
  const averageReviewTurnaround = average(
    recent.map((entry) => entry.reviewTurnaroundHours ?? 0),
  )
  const aiAcceptanceAverage = average(
    recent.map((entry) => entry.aiSuggestionsAccepted ?? 0),
  )

  const trend = prior
    ? Number((latest.commits - prior.commits).toFixed(1))
    : 0

  return {
    latestVelocity: latest.commits,
    averageCommits: Number(averageCommits.toFixed(1)),
    averageAdditions: Math.round(averageAdditions),
    averageDeletions: Math.round(averageDeletions),
    averageReviewTurnaround: Number(averageReviewTurnaround.toFixed(1)),
    aiAcceptanceAverage: Number(aiAcceptanceAverage.toFixed(1)),
    trend,
    series: sorted,
  }
}

export function getQualityOverview(qualitySnapshots) {
  if (!qualitySnapshots?.length) {
    return {
      latest: null,
      previous: null,
      healthScore: 0,
      coverageTrend: 0,
      maintainabilityTrend: 0,
      automationTrend: 0,
    }
  }

  const sorted = [...qualitySnapshots]
  const latest = sorted[sorted.length - 1]
  const previous = sorted[sorted.length - 2]

  const baseScore =
    (latest.coverage + latest.maintainability + latest.reliability + latest.security) / 4
  const techDebtPenalty = Math.min(latest.techDebtIndex * 2, 24)
  const healthScore = Math.max(0, Math.round(baseScore - techDebtPenalty))

  const coverageTrend = previous ? Number((latest.coverage - previous.coverage).toFixed(1)) : 0
  const maintainabilityTrend = previous
    ? Number((latest.maintainability - previous.maintainability).toFixed(1))
    : 0
  const automationTrend = previous
    ? Number((latest.automationCoverage - previous.automationCoverage).toFixed(1))
    : 0

  return {
    latest,
    previous: previous ?? null,
    healthScore,
    coverageTrend,
    maintainabilityTrend,
    automationTrend,
  }
}

export function rankQualityAlerts(qualityAlerts) {
  if (!qualityAlerts?.length) return []
  return [...qualityAlerts].sort(orderBySeverity)
}

export function getTeamPerformance(teamMembers) {
  if (!teamMembers?.length) {
    return {
      totalXP: 0,
      averageGrowthRate: 0,
      totalReviews: 0,
      totalIncidentsResolved: 0,
      totalLearningHours: 0,
      topContributor: null,
      aiLeaders: [],
    }
  }

  const totals = teamMembers.reduce(
    (acc, member) => {
      acc.totalXP += member.xp ?? 0
      acc.growthRates.push(member.growthRate ?? 0)
      acc.reviews += member.contributions?.reviewsCompleted ?? 0
      acc.incidents += member.contributions?.incidentsResolved ?? 0
      acc.learning += member.contributions?.learningHours ?? 0

      if (member.skillLevels?.aiEnablement !== undefined) {
        acc.aiRanks.push({
          name: member.name,
          value: member.skillLevels.aiEnablement,
        })
      }

      if (!acc.topContributor || (member.xp ?? 0) > (acc.topContributor.xp ?? 0)) {
        acc.topContributor = member
      }

      return acc
    },
    {
      totalXP: 0,
      growthRates: [],
      reviews: 0,
      incidents: 0,
      learning: 0,
      topContributor: null,
      aiRanks: [],
    },
  )

  const aiLeaders = totals.aiRanks
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)

  return {
    totalXP: totals.totalXP,
    averageGrowthRate: Number(average(totals.growthRates).toFixed(1)),
    totalReviews: totals.reviews,
    totalIncidentsResolved: totals.incidents,
    totalLearningHours: totals.learning,
    topContributor: totals.topContributor,
    aiLeaders,
  }
}

export function buildSkillMatrix(teamMembers) {
  if (!teamMembers?.length) {
    return {
      categories: [],
      memberSeries: {},
    }
  }

  const categoryTotals = new Map()
  const memberSeries = {}

  teamMembers.forEach((member) => {
    const skills = member.skillLevels ?? {}
    memberSeries[member.name] = Object.entries(skills).map(([category, value]) => ({
      category,
      value,
    }))

    Object.entries(skills).forEach(([category, value]) => {
      if (!categoryTotals.has(category)) {
        categoryTotals.set(category, {
          values: [],
          topContributor: { name: member.name, value },
        })
      }

      const entry = categoryTotals.get(category)
      entry.values.push(value)
      if (value > entry.topContributor.value) {
        entry.topContributor = { name: member.name, value }
      }
    })
  })

  const categories = Array.from(categoryTotals.entries()).map(([category, data]) => ({
    category,
    average: Number(average(data.values).toFixed(1)),
    topContributor: data.topContributor.name,
    topContributorValue: data.topContributor.value,
  }))

  return {
    categories,
    memberSeries,
  }
}

export function getLearningSummary(learningResources, learningContexts) {
  const resourceCount = learningResources?.length ?? 0
  const contextCount = learningContexts?.length ?? 0

  const tagUsage = new Map()

  learningResources?.forEach((resource) => {
    resource.tags?.forEach((tag) => {
      tagUsage.set(tag, (tagUsage.get(tag) ?? 0) + 1)
    })
  })

  const topTags = Array.from(tagUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  const averageDuration = learningResources?.length
    ? Number(
        (
          sum(learningResources.map((resource) => resource.estimatedTimeMinutes ?? 0)) /
          learningResources.length
        ).toFixed(1),
      )
    : 0

  return {
    resourceCount,
    contextCount,
    topTags,
    averageDuration,
  }
}

export function summariseAlertsByImpact(qualityAlerts) {
  if (!qualityAlerts?.length) return []

  const impactTotals = new Map()

  qualityAlerts.forEach((alert) => {
    alert.impactedMetrics?.forEach((metric) => {
      if (!impactTotals.has(metric)) {
        impactTotals.set(metric, 0)
      }
      impactTotals.set(metric, impactTotals.get(metric) + severityWeight[alert.severity])
    })
  })

  return Array.from(impactTotals.entries())
    .map(([metric, score]) => ({ metric, score }))
    .sort((a, b) => b.score - a.score)
}
