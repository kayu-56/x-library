import { useState, useMemo } from 'react'
import { useCodeCollab } from '../hooks/useCodeCollab'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Trophy, Target, TrendingUp, Award, Zap, Code, GitCommit, Users } from 'lucide-react'
import { format } from 'date-fns'

const SkillDevelopmentPage = () => {
  const { userSkills, achievements } = useCodeCollab()
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  const skillLevels = useMemo(() => {
    return Object.entries(userSkills.categories).map(([category, level]) => ({
      category,
      level,
      target: 100
    }))
  }, [userSkills])

  const languageProgress = useMemo(() => {
    return userSkills.languages.map(lang => ({
      ...lang,
      progress: (lang.level / 100) * 100
    }))
  }, [userSkills])

  const activityData = useMemo(() => {
    return userSkills.recentActivity.map(activity => ({
      date: format(new Date(activity.date), 'MMM dd'),
      commits: activity.commits,
      reviews: activity.reviews,
      linesChanged: activity.linesAdded + activity.linesRemoved
    }))
  }, [userSkills])

  const totalXP = useMemo(() => {
    return userSkills.languages.reduce((sum, lang) => sum + lang.commits * 10, 0)
  }, [userSkills])

  const currentLevel = Math.floor(totalXP / 1000) + 1
  const xpToNextLevel = ((currentLevel * 1000) - totalXP % 1000)

  const earnedAchievements = achievements.filter(a => a.earned)
  const unearnedAchievements = achievements.filter(a => !a.earned)

  return (
    <div className="skill-development-container">
      <div className="page-header">
        <div className="header-content">
          <Trophy size={32} />
          <div>
            <h1>Gamified Skill Development</h1>
            <p>Track your progress, earn achievements, and level up your coding skills</p>
          </div>
        </div>
      </div>

      <div className="profile-overview">
        <div className="level-card">
          <div className="level-badge">
            <Trophy size={48} color="#fbbf24" />
            <div className="level-info">
              <span className="level-label">Level</span>
              <span className="level-number">{currentLevel}</span>
            </div>
          </div>
          <div className="xp-progress">
            <div className="xp-info">
              <span>Total XP: {totalXP.toLocaleString()}</span>
              <span>{xpToNextLevel} XP to next level</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((totalXP % 1000) / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>
              <Code size={24} color="#3b82f6" />
            </div>
            <div>
              <p className="stat-value">
                {userSkills.languages.reduce((sum, lang) => sum + lang.linesOfCode, 0).toLocaleString()}
              </p>
              <p className="stat-label">Lines of Code</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <GitCommit size={24} color="#10b981" />
            </div>
            <div>
              <p className="stat-value">
                {userSkills.languages.reduce((sum, lang) => sum + lang.commits, 0)}
              </p>
              <p className="stat-label">Total Commits</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <Award size={24} color="#f59e0b" />
            </div>
            <div>
              <p className="stat-value">{earnedAchievements.length}/{achievements.length}</p>
              <p className="stat-label">Achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="skills-section">
          <div className="section-card large">
            <h2>
              <Target size={24} />
              Skill Matrix
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={skillLevels}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Your Level" dataKey="level" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="section-card">
            <h2>
              <TrendingUp size={24} />
              Activity Timeline
            </h2>
            <div className="timeframe-selector">
              <button 
                className={selectedTimeframe === 'week' ? 'active' : ''}
                onClick={() => setSelectedTimeframe('week')}
              >
                Week
              </button>
              <button 
                className={selectedTimeframe === 'month' ? 'active' : ''}
                onClick={() => setSelectedTimeframe('month')}
              >
                Month
              </button>
              <button 
                className={selectedTimeframe === 'year' ? 'active' : ''}
                onClick={() => setSelectedTimeframe('year')}
              >
                Year
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="commits" stroke="#667eea" strokeWidth={2} />
                <Line type="monotone" dataKey="reviews" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="languages-section">
          <div className="section-card">
            <h2>
              <Code size={24} />
              Programming Languages
            </h2>
            <div className="languages-list">
              {languageProgress.map((lang, index) => (
                <div key={index} className="language-item">
                  <div className="language-header">
                    <span className="language-name">{lang.name}</span>
                    <span className="language-level">Level {lang.level}</span>
                  </div>
                  <div className="language-progress">
                    <div 
                      className="language-fill"
                      style={{ width: `${lang.level}%` }}
                    />
                  </div>
                  <div className="language-stats">
                    <span>{lang.commits} commits</span>
                    <span>{lang.linesOfCode.toLocaleString()} lines</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h2>
              <Zap size={24} />
              Top Skills
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languageProgress.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="level" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>
          <Award size={24} />
          Achievements & Badges
        </h2>
        
        <div className="achievements-tabs">
          <div className="tab-header">
            <button className="active">Earned ({earnedAchievements.length})</button>
            <button>Locked ({unearnedAchievements.length})</button>
          </div>
        </div>

        <div className="achievements-grid">
          {earnedAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-card earned">
              <div className="achievement-icon">{achievement.icon}</div>
              <h3>{achievement.name}</h3>
              <p className="earned-date">
                Earned {format(achievement.earnedAt, 'MMM dd, yyyy')}
              </p>
            </div>
          ))}
          {unearnedAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-card locked">
              <div className="achievement-icon locked-icon">🔒</div>
              <h3>{achievement.name}</h3>
              <p className="locked-text">Keep coding to unlock!</p>
            </div>
          ))}
        </div>
      </div>

      <div className="recommendations-section">
        <div className="section-card">
          <h2>
            <Target size={24} />
            Personalized Development Suggestions
          </h2>
          <div className="recommendations-list">
            <div className="recommendation-item">
              <div className="recommendation-icon" style={{ background: '#dbeafe' }}>
                <TrendingUp size={24} color="#3b82f6" />
              </div>
              <div className="recommendation-content">
                <h4>Improve Test Coverage</h4>
                <p>Your test coverage is below team average. Consider writing more unit tests for recent features.</p>
                <button className="action-button">View Testing Resources</button>
              </div>
            </div>

            <div className="recommendation-item">
              <div className="recommendation-icon" style={{ background: '#dcfce7' }}>
                <Code size={24} color="#10b981" />
              </div>
              <div className="recommendation-content">
                <h4>Expand Language Skills</h4>
                <p>You're proficient in JavaScript. Try learning TypeScript to enhance your type safety skills.</p>
                <button className="action-button">Start TypeScript Path</button>
              </div>
            </div>

            <div className="recommendation-item">
              <div className="recommendation-icon" style={{ background: '#fef3c7' }}>
                <Users size={24} color="#f59e0b" />
              </div>
              <div className="recommendation-content">
                <h4>Increase Code Reviews</h4>
                <p>Reviewing others' code is a great way to learn. Try to review at least 2 PRs per week.</p>
                <button className="action-button">Find PRs to Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .skill-development-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

        .profile-overview {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .level-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
        }

        .level-badge {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .level-info {
          display: flex;
          flex-direction: column;
        }

        .level-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .level-number {
          font-size: 3rem;
          font-weight: 700;
          color: #1f2937;
        }

        .xp-progress {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .xp-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .progress-bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: center;
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

        .stat-value {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .skills-section,
        .languages-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section-card.large {
          min-height: 500px;
        }

        .section-card h2 {
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1f2937;
        }

        .timeframe-selector {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .timeframe-selector button {
          padding: 0.5rem 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .timeframe-selector button.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .languages-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .language-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .language-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .language-name {
          font-weight: 600;
          color: #1f2937;
        }

        .language-level {
          font-size: 0.875rem;
          color: #667eea;
          font-weight: 600;
        }

        .language-progress {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .language-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .language-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .achievements-section {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .achievements-section h2 {
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1f2937;
        }

        .achievements-tabs {
          margin-bottom: 1.5rem;
        }

        .tab-header {
          display: flex;
          gap: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab-header button {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          position: relative;
        }

        .tab-header button.active {
          color: #667eea;
        }

        .tab-header button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #667eea;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .achievement-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: transform 0.2s;
        }

        .achievement-card.earned {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #fbbf24;
        }

        .achievement-card.locked {
          background: #f9fafb;
          opacity: 0.6;
        }

        .achievement-card:hover {
          transform: translateY(-4px);
        }

        .achievement-icon {
          font-size: 3rem;
          margin-bottom: 0.75rem;
        }

        .locked-icon {
          filter: grayscale(100%);
        }

        .achievement-card h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .earned-date {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .locked-text {
          margin: 0;
          font-size: 0.875rem;
          color: #9ca3af;
          font-style: italic;
        }

        .recommendations-section {
          margin-bottom: 2rem;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .recommendation-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .recommendation-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .recommendation-content {
          flex: 1;
        }

        .recommendation-content h4 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.125rem;
        }

        .recommendation-content p {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 0.9375rem;
        }

        .action-button {
          padding: 0.625rem 1.25rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .action-button:hover {
          background: #5568d3;
        }

        @media (max-width: 1024px) {
          .profile-overview,
          .content-grid {
            grid-template-columns: 1fr;
          }

          .stats-cards {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .achievements-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default SkillDevelopmentPage
