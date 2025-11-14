import { useMemo } from 'react'
import { platformData } from '../data/platformData.js'
import {
  buildSkillMatrix,
  getCommitSummary,
  getLearningSummary,
  getPullRequestStats,
  getQualityOverview,
  getTeamPerformance,
  rankQualityAlerts,
  summariseAlertsByImpact,
} from '../utils/metrics.js'
import { PlatformDataContext } from './PlatformDataContext.js'

export function PlatformDataProvider({ children }) {
  const value = useMemo(() => {
    const pullRequestStats = getPullRequestStats(platformData.pullRequests)
    const commitSummary = getCommitSummary(platformData.commitHistory)
    const qualityOverview = getQualityOverview(platformData.qualitySnapshots)
    const teamPerformance = getTeamPerformance(platformData.teamMembers)
    const learningSummary = getLearningSummary(
      platformData.learningResources,
      platformData.learningContexts,
    )
    const alertsRanked = rankQualityAlerts(platformData.qualityAlerts)
    const skillMatrix = buildSkillMatrix(platformData.teamMembers)
    const alertImpact = summariseAlertsByImpact(platformData.qualityAlerts)

    return {
      ...platformData,
      computed: {
        pullRequestStats,
        commitSummary,
        qualityOverview,
        teamPerformance,
        learningSummary,
        alertsRanked,
        skillMatrix,
        alertImpact,
      },
    }
  }, [])

  return (
    <PlatformDataContext.Provider value={value}>{children}</PlatformDataContext.Provider>
  )
}
