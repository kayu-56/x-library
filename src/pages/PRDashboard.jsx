import { useState, useMemo } from 'react'
import { useCodeCollab } from '../hooks/useCodeCollab'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GitPullRequest, GitCommit, Users, Clock, TrendingUp, Activity } from 'lucide-react'
import { format } from 'date-fns'

const PRDashboardPage = () => {
  const { pullRequests, repositories } = useCodeCollab()
  const [selectedRepo, setSelectedRepo] = useState('all')
  const [timeRange, setTimeRange] = useState('30')

  const filteredPRs = useMemo(() => {
    let filtered = pullRequests
    if (selectedRepo !== 'all') {
      filtered = filtered.filter(pr => pr.repository === selectedRepo)
    }
    return filtered
  }, [pullRequests, selectedRepo])

  const prStats = useMemo(() => {
    const stats = {
      total: filteredPRs.length,
      open: filteredPRs.filter(pr => pr.status === 'open').length,
      merged: filteredPRs.filter(pr => pr.status === 'merged').length,
      closed: filteredPRs.filter(pr => pr.status === 'closed').length,
      totalAdditions: filteredPRs.reduce((sum, pr) => sum + pr.additions, 0),
      totalDeletions: filteredPRs.reduce((sum, pr) => sum + pr.deletions, 0),
      totalCommits: filteredPRs.reduce((sum, pr) => sum + pr.commits, 0),
      totalComments: filteredPRs.reduce((sum, pr) => sum + pr.comments, 0)
    }

    stats.avgReviewTime = stats.total > 0 ? (Math.random() * 24 + 12).toFixed(1) : 0
    stats.mergeRate = stats.total > 0 ? ((stats.merged / stats.total) * 100).toFixed(1) : 0

    return stats
  }, [filteredPRs])

  const statusDistribution = useMemo(() => {
    return [
      { name: 'Open', value: prStats.open, color: '#3b82f6' },
      { name: 'Merged', value: prStats.merged, color: '#10b981' },
      { name: 'Closed', value: prStats.closed, color: '#6b7280' }
    ]
  }, [prStats])

  const activityTimeline = useMemo(() => {
    const timeline = []
    for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      timeline.push({
        date: format(date, 'MMM dd'),
        prs: Math.floor(Math.random() * 8) + 2,
        commits: Math.floor(Math.random() * 30) + 10,
        reviews: Math.floor(Math.random() * 12) + 3
      })
    }
    return timeline
  }, [timeRange])

  const authorStats = useMemo(() => {
    const authors = {}
    filteredPRs.forEach(pr => {
      if (!authors[pr.author]) {
        authors[pr.author] = { name: pr.author, prs: 0, additions: 0, deletions: 0 }
      }
      authors[pr.author].prs++
      authors[pr.author].additions += pr.additions
      authors[pr.author].deletions += pr.deletions
    })
    return Object.values(authors).sort((a, b) => b.prs - a.prs)
  }, [filteredPRs])

  const reviewerStats = useMemo(() => {
    const reviewers = {}
    filteredPRs.forEach(pr => {
      pr.reviewers.forEach(reviewer => {
        if (!reviewers[reviewer]) {
          reviewers[reviewer] = { name: reviewer, reviews: 0 }
        }
        reviewers[reviewer].reviews++
      })
    })
    return Object.values(reviewers).sort((a, b) => b.reviews - a.reviews)
  }, [filteredPRs])

  return (
    <div className="pr-dashboard-container">
      <div className="page-header">
        <div className="header-content">
          <GitPullRequest size={32} />
          <div>
            <h1>Pull Request & Commit Analytics</h1>
            <p>Comprehensive analysis of team collaboration and code changes</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Repository</label>
          <select 
            value={selectedRepo} 
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Repositories</option>
            {repositories.map(repo => (
              <option key={repo.id} value={repo.name}>{repo.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Time Range</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="filter-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <GitPullRequest size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>Total PRs</h3>
            <p className="stat-value">{prStats.total}</p>
            <span className="stat-label">Pull Requests</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>
            <GitCommit size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <h3>Total Commits</h3>
            <p className="stat-value">{prStats.totalCommits}</p>
            <span className="stat-label">Commits</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Review Time</h3>
            <p className="stat-value">{prStats.avgReviewTime}h</p>
            <span className="stat-label">Hours</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <TrendingUp size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Merge Rate</h3>
            <p className="stat-value">{prStats.mergeRate}%</p>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card large">
          <h3>Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="prs" stroke="#3b82f6" strokeWidth={2} name="Pull Requests" />
              <Line type="monotone" dataKey="commits" stroke="#10b981" strokeWidth={2} name="Commits" />
              <Line type="monotone" dataKey="reviews" stroke="#f59e0b" strokeWidth={2} name="Reviews" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>PR Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Top Contributors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={authorStats.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="prs" fill="#667eea" name="Pull Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Code Changes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={authorStats.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="additions" fill="#10b981" name="Additions" />
              <Bar dataKey="deletions" fill="#ef4444" name="Deletions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tables-section">
        <div className="table-card">
          <h3>
            <Users size={20} />
            Team Collaboration Metrics
          </h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reviewer</th>
                  <th>Reviews</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                {reviewerStats.map((reviewer, index) => (
                  <tr key={index}>
                    <td>
                      <div className="reviewer-info">
                        <div className="avatar">{reviewer.name[0].toUpperCase()}</div>
                        <span>{reviewer.name}</span>
                      </div>
                    </td>
                    <td>{reviewer.reviews}</td>
                    <td>
                      <div className="activity-bar">
                        <div 
                          className="activity-fill"
                          style={{ width: `${(reviewer.reviews / reviewerStats[0]?.reviews * 100) || 0}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <h3>
            <Activity size={20} />
            Recent Pull Requests
          </h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PR</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Changes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPRs.slice(0, 5).map((pr) => (
                  <tr key={pr.id}>
                    <td><span className="pr-id">{pr.id}</span></td>
                    <td className="pr-title">{pr.title}</td>
                    <td>
                      <span className={`status-badge status-${pr.status}`}>
                        {pr.status}
                      </span>
                    </td>
                    <td>
                      <span className="changes">
                        <span className="additions">+{pr.additions}</span>
                        <span className="deletions">-{pr.deletions}</span>
                      </span>
                    </td>
                    <td>{format(pr.createdAt, 'MMM dd, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pr-dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
        }

        .header-content p {
          margin: 0;
          opacity: 0.9;
        }

        .filters-section {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
        }

        .filter-select {
          padding: 0.625rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .chart-card.large {
          grid-column: 1 / -1;
        }

        .chart-card h3 {
          margin: 0 0 1.5rem 0;
          color: #1f2937;
          font-size: 1.125rem;
        }

        .tables-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 1.5rem;
        }

        .table-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .table-card h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 0.75rem;
          background: #f9fafb;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 2px solid #e5e7eb;
        }

        td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.875rem;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .activity-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .activity-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }

        .pr-id {
          font-family: monospace;
          font-weight: 600;
          color: #667eea;
        }

        .pr-title {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-badge {
          padding: 0.25rem 0.625rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-open {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-merged {
          background: #dcfce7;
          color: #166534;
        }

        .status-closed {
          background: #f3f4f6;
          color: #4b5563;
        }

        .changes {
          display: flex;
          gap: 0.5rem;
          font-family: monospace;
          font-size: 0.8125rem;
        }

        .additions {
          color: #10b981;
        }

        .deletions {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .charts-grid,
          .tables-section {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default PRDashboardPage
