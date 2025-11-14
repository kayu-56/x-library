import { useState, useMemo } from 'react'
import { useCodeCollab } from '../hooks/useCodeCollab'
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Target, FileCode } from 'lucide-react'

const CodeQualityPage = () => {
  const { codeQualityData, repositories } = useCodeCollab()
  const [selectedRepo, setSelectedRepo] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState('score')

  const repoData = useMemo(() => {
    if (selectedRepo === 'all') {
      return codeQualityData.overall
    }
    return codeQualityData.repositories[selectedRepo] || {}
  }, [selectedRepo, codeQualityData])

  const qualityMetrics = useMemo(() => {
    if (selectedRepo === 'all') {
      return [
        { category: 'Maintainability', value: codeQualityData.overall.metrics.maintainability },
        { category: 'Reliability', value: codeQualityData.overall.metrics.reliability },
        { category: 'Security', value: codeQualityData.overall.metrics.security },
        { category: 'Coverage', value: codeQualityData.overall.metrics.coverage }
      ]
    }
    const repo = codeQualityData.repositories[selectedRepo]
    return [
      { category: 'Quality Score', value: repo?.score || 0 },
      { category: 'Test Coverage', value: repo?.coverage || 0 },
      { category: 'Code Duplication', value: Math.max(0, 100 - (repo?.duplication || 0) * 10) }
    ]
  }, [selectedRepo, codeQualityData])

  const issuesByRepo = useMemo(() => {
    return Object.entries(codeQualityData.repositories).map(([name, data]) => ({
      name,
      critical: data.issues.critical,
      major: data.issues.major,
      minor: data.issues.minor
    }))
  }, [codeQualityData])

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getComplexityLabel = (complexity) => {
    const labels = {
      low: { text: 'Low', color: '#10b981' },
      medium: { text: 'Medium', color: '#f59e0b' },
      high: { text: 'High', color: '#ef4444' }
    }
    return labels[complexity] || labels.medium
  }

  return (
    <div className="code-quality-container">
      <div className="page-header">
        <div className="header-content">
          <Shield size={32} />
          <div>
            <h1>Code Quality Assessment</h1>
            <p>Comprehensive code health monitoring and quality metrics</p>
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
          <label>Primary Metric</label>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="filter-select"
          >
            <option value="score">Quality Score</option>
            <option value="issues">Issues</option>
            <option value="coverage">Test Coverage</option>
          </select>
        </div>
      </div>

      {selectedRepo === 'all' && (
        <div className="overview-section">
          <div className="quality-score-card">
            <div className="score-circle" style={{ borderColor: getScoreColor(codeQualityData.overall.score) }}>
              <span className="score-value" style={{ color: getScoreColor(codeQualityData.overall.score) }}>
                {codeQualityData.overall.score}
              </span>
              <span className="score-label">Overall Score</span>
            </div>
            <div className="score-details">
              <div className="metric-item">
                <Shield size={20} color="#10b981" />
                <div>
                  <p className="metric-label">Security</p>
                  <p className="metric-value">{codeQualityData.overall.metrics.security}/100</p>
                </div>
              </div>
              <div className="metric-item">
                <Target size={20} color="#3b82f6" />
                <div>
                  <p className="metric-label">Reliability</p>
                  <p className="metric-value">{codeQualityData.overall.metrics.reliability}/100</p>
                </div>
              </div>
              <div className="metric-item">
                <FileCode size={20} color="#8b5cf6" />
                <div>
                  <p className="metric-label">Maintainability</p>
                  <p className="metric-value">{codeQualityData.overall.metrics.maintainability}/100</p>
                </div>
              </div>
              <div className="metric-item">
                <CheckCircle size={20} color="#f59e0b" />
                <div>
                  <p className="metric-label">Coverage</p>
                  <p className="metric-value">{codeQualityData.overall.metrics.coverage}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRepo !== 'all' && repoData.score && (
        <div className="repo-stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: getScoreColor(repoData.score) + '20' }}>
              <Target size={24} style={{ color: getScoreColor(repoData.score) }} />
            </div>
            <div className="stat-content">
              <h3>Quality Score</h3>
              <p className="stat-value">{repoData.score}</p>
              <span className="stat-label">Out of 100</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <AlertTriangle size={24} color="#f59e0b" />
            </div>
            <div className="stat-content">
              <h3>Total Issues</h3>
              <p className="stat-value">
                {repoData.issues.critical + repoData.issues.major + repoData.issues.minor}
              </p>
              <span className="stat-label">
                {repoData.issues.critical} Critical, {repoData.issues.major} Major
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <CheckCircle size={24} color="#10b981" />
            </div>
            <div className="stat-content">
              <h3>Test Coverage</h3>
              <p className="stat-value">{repoData.coverage}%</p>
              <span className="stat-label">Code Coverage</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0e7ff' }}>
              <FileCode size={24} color="#6366f1" />
            </div>
            <div className="stat-content">
              <h3>Code Duplication</h3>
              <p className="stat-value">{repoData.duplication}%</p>
              <span className="stat-label">
                Complexity: 
                <span 
                  className="complexity-badge"
                  style={{ color: getComplexityLabel(repoData.complexity).color }}
                >
                  {getComplexityLabel(repoData.complexity).text}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="charts-section">
        <div className="chart-card large">
          <h3>
            <TrendingUp size={20} />
            Quality Trends (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={codeQualityData.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={2} name="Quality Score" />
              <Line type="monotone" dataKey="coverage" stroke="#10b981" strokeWidth={2} name="Test Coverage" />
              <Line type="monotone" dataKey="issues" stroke="#ef4444" strokeWidth={2} name="Issues" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Quality Metrics Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={qualityMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Quality" dataKey="value" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Issues by Repository</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issuesByRepo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
              <Bar dataKey="major" stackId="a" fill="#f59e0b" name="Major" />
              <Bar dataKey="minor" stackId="a" fill="#3b82f6" name="Minor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="issues-section">
        <div className="section-header">
          <h2>
            <AlertTriangle size={24} />
            Code Quality Issues
          </h2>
          <button className="export-button">Export Report</button>
        </div>

        <div className="issues-list">
          {[
            {
              severity: 'critical',
              type: 'Security Vulnerability',
              message: 'SQL Injection vulnerability detected in user input handling',
              file: 'src/api/users.js',
              line: 45,
              recommendation: 'Use parameterized queries or ORM to prevent SQL injection'
            },
            {
              severity: 'major',
              type: 'Performance',
              message: 'N+1 query problem detected in data fetching loop',
              file: 'src/services/data.py',
              line: 128,
              recommendation: 'Use batch loading or eager loading to optimize database queries'
            },
            {
              severity: 'major',
              type: 'Code Smell',
              message: 'Function complexity exceeds threshold (cyclomatic complexity: 25)',
              file: 'src/handlers/process.go',
              line: 89,
              recommendation: 'Refactor into smaller, more manageable functions'
            },
            {
              severity: 'minor',
              type: 'Style',
              message: 'Inconsistent naming convention detected',
              file: 'src/utils/helpers.js',
              line: 12,
              recommendation: 'Follow consistent camelCase naming convention'
            },
            {
              severity: 'minor',
              type: 'Documentation',
              message: 'Missing JSDoc comments for public function',
              file: 'src/components/Form.jsx',
              line: 34,
              recommendation: 'Add comprehensive JSDoc documentation'
            }
          ].map((issue, index) => (
            <div key={index} className={`issue-card severity-${issue.severity}`}>
              <div className="issue-header">
                <div className="issue-meta">
                  <span className={`severity-badge ${issue.severity}`}>
                    {issue.severity}
                  </span>
                  <span className="issue-type">{issue.type}</span>
                </div>
                <span className="issue-location">{issue.file}:{issue.line}</span>
              </div>
              <p className="issue-message">{issue.message}</p>
              <div className="issue-recommendation">
                <strong>Recommendation:</strong>
                <p>{issue.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .code-quality-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

        .overview-section {
          margin-bottom: 2rem;
        }

        .quality-score-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          gap: 3rem;
          align-items: center;
        }

        .score-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 12px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-value {
          font-size: 4rem;
          font-weight: 700;
        }

        .score-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .score-details {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .metric-item {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .metric-label {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .metric-value {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .repo-stats-grid {
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
          flex-shrink: 0;
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

        .complexity-badge {
          margin-left: 0.5rem;
          font-weight: 600;
        }

        .charts-section {
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .issues-section {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1f2937;
        }

        .export-button {
          padding: 0.625rem 1.25rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .export-button:hover {
          transform: translateY(-2px);
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .issue-card {
          border: 1px solid #e5e7eb;
          border-left-width: 4px;
          border-radius: 8px;
          padding: 1.5rem;
          background: #f9fafb;
        }

        .issue-card.severity-critical {
          border-left-color: #ef4444;
        }

        .issue-card.severity-major {
          border-left-color: #f59e0b;
        }

        .issue-card.severity-minor {
          border-left-color: #3b82f6;
        }

        .issue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .issue-meta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .severity-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .severity-badge.critical {
          background: #fee2e2;
          color: #991b1b;
        }

        .severity-badge.major {
          background: #fef3c7;
          color: #92400e;
        }

        .severity-badge.minor {
          background: #dbeafe;
          color: #1e40af;
        }

        .issue-type {
          padding: 0.25rem 0.625rem;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .issue-location {
          color: #6b7280;
          font-size: 0.875rem;
          font-family: monospace;
        }

        .issue-message {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 0.9375rem;
        }

        .issue-recommendation {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          border-left: 3px solid #10b981;
        }

        .issue-recommendation strong {
          color: #10b981;
          display: block;
          margin-bottom: 0.5rem;
        }

        .issue-recommendation p {
          margin: 0;
          font-size: 0.875rem;
          color: #374151;
        }

        @media (max-width: 768px) {
          .quality-score-card {
            flex-direction: column;
          }

          .score-details {
            grid-template-columns: 1fr;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .repo-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default CodeQualityPage
