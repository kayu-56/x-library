import { useState, useMemo } from 'react'
import { useCodeCollab } from '../hooks/useCodeCollab'
import { BookOpen, Video, FileText, Code, Star, Clock, TrendingUp, Search, Filter } from 'lucide-react'

const LearningCenterPage = () => {
  const { learningResources } = useCodeCollab()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')

  const filteredResources = useMemo(() => {
    let filtered = learningResources

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevance - a.relevance
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return Math.random() - 0.5
        default:
          return 0
      }
    })

    return filtered
  }, [learningResources, searchQuery, selectedType, selectedDifficulty, sortBy])

  const resourceStats = useMemo(() => {
    return {
      total: learningResources.length,
      articles: learningResources.filter(r => r.type === 'article').length,
      videos: learningResources.filter(r => r.type === 'video').length,
      courses: learningResources.filter(r => r.type === 'course').length,
      avgRating: (learningResources.reduce((sum, r) => sum + r.rating, 0) / learningResources.length).toFixed(1)
    }
  }, [learningResources])

  const recommendedPaths = [
    {
      title: 'Frontend Development Mastery',
      description: 'Complete path from basics to advanced React patterns',
      resources: 12,
      duration: '24 hours',
      level: 'Intermediate',
      color: '#3b82f6'
    },
    {
      title: 'Backend Engineering Excellence',
      description: 'Build scalable APIs and microservices',
      resources: 15,
      duration: '32 hours',
      level: 'Advanced',
      color: '#10b981'
    },
    {
      title: 'DevOps & Cloud Infrastructure',
      description: 'Master modern deployment and infrastructure',
      resources: 10,
      duration: '20 hours',
      level: 'Intermediate',
      color: '#f59e0b'
    }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <FileText size={20} />
      case 'video':
        return <Video size={20} />
      case 'course':
        return <BookOpen size={20} />
      case 'documentation':
        return <Code size={20} />
      default:
        return <FileText size={20} />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981'
      case 'intermediate':
        return '#f59e0b'
      case 'advanced':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="learning-center-container">
      <div className="page-header">
        <div className="header-content">
          <BookOpen size={32} />
          <div>
            <h1>Intelligent Learning Resource Center</h1>
            <p>Context-aware learning materials tailored to your development needs</p>
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-item">
          <BookOpen size={24} color="#667eea" />
          <div>
            <p className="stat-value">{resourceStats.total}</p>
            <p className="stat-label">Total Resources</p>
          </div>
        </div>
        <div className="stat-item">
          <FileText size={24} color="#3b82f6" />
          <div>
            <p className="stat-value">{resourceStats.articles}</p>
            <p className="stat-label">Articles</p>
          </div>
        </div>
        <div className="stat-item">
          <Video size={24} color="#10b981" />
          <div>
            <p className="stat-value">{resourceStats.videos}</p>
            <p className="stat-label">Videos</p>
          </div>
        </div>
        <div className="stat-item">
          <BookOpen size={24} color="#f59e0b" />
          <div>
            <p className="stat-value">{resourceStats.courses}</p>
            <p className="stat-label">Courses</p>
          </div>
        </div>
        <div className="stat-item">
          <Star size={24} color="#fbbf24" />
          <div>
            <p className="stat-value">{resourceStats.avgRating}</p>
            <p className="stat-label">Avg Rating</p>
          </div>
        </div>
      </div>

      <div className="learning-paths-section">
        <h2>
          <TrendingUp size={24} />
          Recommended Learning Paths
        </h2>
        <div className="paths-grid">
          {recommendedPaths.map((path, index) => (
            <div key={index} className="path-card" style={{ borderTopColor: path.color }}>
              <div className="path-header">
                <h3>{path.title}</h3>
                <span className="level-badge" style={{ backgroundColor: path.color + '20', color: path.color }}>
                  {path.level}
                </span>
              </div>
              <p className="path-description">{path.description}</p>
              <div className="path-meta">
                <span className="meta-item">
                  <BookOpen size={16} />
                  {path.resources} resources
                </span>
                <span className="meta-item">
                  <Clock size={16} />
                  {path.duration}
                </span>
              </div>
              <button className="start-path-button" style={{ backgroundColor: path.color }}>
                Start Learning Path
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="resources-section">
        <div className="section-header">
          <h2>
            <Filter size={24} />
            Browse Resources
          </h2>
        </div>

        <div className="filters-panel">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search resources by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="course">Courses</option>
              <option value="documentation">Documentation</option>
            </select>

            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Most Relevant</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="resources-grid">
          {filteredResources.length === 0 ? (
            <div className="empty-state">
              <Search size={48} color="#9ca3af" />
              <p>No resources found matching your criteria</p>
            </div>
          ) : (
            filteredResources.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <div className="resource-type" style={{ color: '#667eea' }}>
                    {getTypeIcon(resource.type)}
                    <span>{resource.type}</span>
                  </div>
                  <div className="resource-rating">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span>{resource.rating}</span>
                  </div>
                </div>

                <h3 className="resource-title">{resource.title}</h3>

                <div className="resource-meta">
                  <span 
                    className="difficulty-badge"
                    style={{ 
                      backgroundColor: getDifficultyColor(resource.difficulty) + '20',
                      color: getDifficultyColor(resource.difficulty)
                    }}
                  >
                    {resource.difficulty}
                  </span>
                  <span className="duration">
                    <Clock size={14} />
                    {resource.duration}
                  </span>
                </div>

                <div className="resource-tags">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="resource-footer">
                  <div className="relevance-bar">
                    <div className="relevance-label">
                      <TrendingUp size={14} />
                      <span>Relevance: {resource.relevance}%</span>
                    </div>
                    <div className="relevance-progress">
                      <div 
                        className="relevance-fill"
                        style={{ width: `${resource.relevance}%` }}
                      />
                    </div>
                  </div>
                  <button className="view-button">View Resource</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .learning-center-container {
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

        .stats-overview {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          flex-wrap: wrap;
          justify-content: space-around;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
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

        .learning-paths-section {
          margin-bottom: 3rem;
        }

        .learning-paths-section h2 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .paths-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .path-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-top-width: 4px;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.2s;
        }

        .path-card:hover {
          transform: translateY(-4px);
        }

        .path-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .path-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.125rem;
        }

        .level-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .path-description {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
          font-size: 0.9375rem;
        }

        .path-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .start-path-button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .start-path-button:hover {
          opacity: 0.9;
        }

        .resources-section {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
        }

        .section-header h2 {
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1f2937;
        }

        .filters-panel {
          margin-bottom: 2rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          margin-bottom: 1rem;
          background: #f9fafb;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1rem;
          outline: none;
        }

        .filter-controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-controls select {
          padding: 0.625rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: #9ca3af;
        }

        .empty-state p {
          margin: 1rem 0 0 0;
          font-size: 1.125rem;
        }

        .resource-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          background: #f9fafb;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .resource-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .resource-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .resource-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .resource-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        .resource-title {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 1.125rem;
          line-height: 1.4;
        }

        .resource-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .difficulty-badge {
          padding: 0.25rem 0.625rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .duration {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .resource-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.625rem;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .resource-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .relevance-bar {
          flex: 1;
        }

        .relevance-label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
        }

        .relevance-progress {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .relevance-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }

        .view-button {
          padding: 0.625rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .view-button:hover {
          background: #5568d3;
        }

        @media (max-width: 768px) {
          .stats-overview {
            flex-direction: column;
            align-items: flex-start;
          }

          .paths-grid,
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default LearningCenterPage
