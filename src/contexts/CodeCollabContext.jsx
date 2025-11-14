/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'

export const CodeCollabContext = createContext()

export function CodeCollabProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [repositories, setRepositories] = useState([])
  const [pullRequests, setPullRequests] = useState([])
  const [codeQualityData, setCodeQualityData] = useState({})
  const [learningResources, setLearningResources] = useState([])
  const [userSkills, setUserSkills] = useState({})
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem('codeCollab_user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    
    const mockRepos = [
      { id: 1, name: 'react-app', language: 'JavaScript', stars: 245, commits: 1234 },
      { id: 2, name: 'python-ml', language: 'Python', stars: 189, commits: 567 },
      { id: 3, name: 'golang-api', language: 'Go', stars: 98, commits: 432 },
    ]
    setRepositories(mockRepos)
    
    const mockPRs = generateMockPullRequests()
    setPullRequests(mockPRs)
    
    const mockQuality = generateMockQualityData()
    setCodeQualityData(mockQuality)
    
    const mockResources = generateMockLearningResources()
    setLearningResources(mockResources)
    
    const mockSkills = generateMockSkillData()
    setUserSkills(mockSkills)
    
    const mockAchievements = generateMockAchievements()
    setAchievements(mockAchievements)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateMockPullRequests = () => {
    return [
      {
        id: 'PR-001',
        title: 'Add user authentication system',
        author: 'alice_dev',
        status: 'open',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        additions: 342,
        deletions: 89,
        commits: 7,
        comments: 12,
        reviewers: ['bob_reviewer', 'charlie_lead'],
        repository: 'react-app',
        branch: 'feature/auth',
        labels: ['enhancement', 'security']
      },
      {
        id: 'PR-002',
        title: 'Refactor database queries for performance',
        author: 'bob_reviewer',
        status: 'merged',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        mergedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        additions: 156,
        deletions: 234,
        commits: 4,
        comments: 8,
        reviewers: ['alice_dev'],
        repository: 'python-ml',
        branch: 'refactor/db-queries',
        labels: ['performance', 'refactor']
      },
      {
        id: 'PR-003',
        title: 'Fix memory leak in websocket handler',
        author: 'charlie_lead',
        status: 'closed',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        closedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        additions: 45,
        deletions: 67,
        commits: 2,
        comments: 5,
        reviewers: ['alice_dev', 'bob_reviewer'],
        repository: 'golang-api',
        branch: 'bugfix/memory-leak',
        labels: ['bug', 'critical']
      }
    ]
  }

  const generateMockQualityData = () => {
    return {
      overall: {
        score: 87,
        trend: 'up',
        metrics: {
          maintainability: 85,
          reliability: 89,
          security: 92,
          coverage: 78
        }
      },
      repositories: {
        'react-app': {
          score: 88,
          issues: { critical: 0, major: 3, minor: 12 },
          coverage: 82,
          duplication: 3.2,
          complexity: 'medium'
        },
        'python-ml': {
          score: 85,
          issues: { critical: 1, major: 5, minor: 18 },
          coverage: 75,
          duplication: 5.1,
          complexity: 'high'
        },
        'golang-api': {
          score: 90,
          issues: { critical: 0, major: 2, minor: 8 },
          coverage: 88,
          duplication: 2.1,
          complexity: 'low'
        }
      },
      timeline: generateQualityTimeline()
    }
  }

  const generateQualityTimeline = () => {
    const timeline = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      timeline.push({
        date: date.toISOString().split('T')[0],
        score: Math.floor(80 + Math.random() * 15),
        issues: Math.floor(15 + Math.random() * 20),
        coverage: Math.floor(70 + Math.random() * 20)
      })
    }
    return timeline
  }

  const generateMockLearningResources = () => {
    return [
      {
        id: 'res-001',
        title: 'React Hooks Best Practices',
        type: 'article',
        difficulty: 'intermediate',
        tags: ['react', 'hooks', 'javascript'],
        rating: 4.8,
        duration: '15 min',
        relevance: 95,
        url: '#'
      },
      {
        id: 'res-002',
        title: 'Advanced Python Performance Optimization',
        type: 'video',
        difficulty: 'advanced',
        tags: ['python', 'performance', 'optimization'],
        rating: 4.9,
        duration: '45 min',
        relevance: 88,
        url: '#'
      },
      {
        id: 'res-003',
        title: 'Go Concurrency Patterns',
        type: 'course',
        difficulty: 'intermediate',
        tags: ['golang', 'concurrency', 'patterns'],
        rating: 4.7,
        duration: '3 hours',
        relevance: 92,
        url: '#'
      },
      {
        id: 'res-004',
        title: 'Code Review Guidelines',
        type: 'documentation',
        difficulty: 'beginner',
        tags: ['best-practices', 'team', 'collaboration'],
        rating: 4.6,
        duration: '20 min',
        relevance: 85,
        url: '#'
      }
    ]
  }

  const generateMockSkillData = () => {
    return {
      languages: [
        { name: 'JavaScript', level: 85, commits: 1245, linesOfCode: 45678 },
        { name: 'Python', level: 72, commits: 567, linesOfCode: 23456 },
        { name: 'TypeScript', level: 68, commits: 432, linesOfCode: 18765 },
        { name: 'Go', level: 55, commits: 234, linesOfCode: 12345 },
        { name: 'SQL', level: 60, commits: 156, linesOfCode: 8901 }
      ],
      categories: {
        'Frontend Development': 82,
        'Backend Development': 75,
        'Database Design': 68,
        'Testing': 70,
        'DevOps': 55,
        'Security': 62
      },
      recentActivity: [
        { date: '2024-11-14', commits: 5, reviews: 2, linesAdded: 234, linesRemoved: 123 },
        { date: '2024-11-13', commits: 3, reviews: 1, linesAdded: 156, linesRemoved: 89 },
        { date: '2024-11-12', commits: 7, reviews: 3, linesAdded: 456, linesRemoved: 234 }
      ]
    }
  }

  const generateMockAchievements = () => {
    return [
      { id: 'ach-001', name: 'First PR', icon: '🎯', earned: true, earnedAt: new Date('2024-01-15') },
      { id: 'ach-002', name: 'Code Reviewer', icon: '👀', earned: true, earnedAt: new Date('2024-03-20') },
      { id: 'ach-003', name: '100 Commits', icon: '💯', earned: true, earnedAt: new Date('2024-06-10') },
      { id: 'ach-004', name: 'Bug Hunter', icon: '🐛', earned: true, earnedAt: new Date('2024-08-05') },
      { id: 'ach-005', name: 'Team Player', icon: '🤝', earned: false },
      { id: 'ach-006', name: 'Quality Champion', icon: '⭐', earned: false }
    ]
  }

  const analyzeDiff = async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const suggestions = [
      {
        line: 5,
        type: 'performance',
        severity: 'medium',
        message: 'Consider memoizing this computation to avoid recalculation',
        suggestion: 'Use useMemo or React.memo for optimization'
      },
      {
        line: 12,
        type: 'security',
        severity: 'high',
        message: 'Potential XSS vulnerability detected',
        suggestion: 'Sanitize user input before rendering'
      },
      {
        line: 23,
        type: 'style',
        severity: 'low',
        message: 'Variable naming convention inconsistency',
        suggestion: 'Use camelCase for variable names'
      }
    ]
    
    return suggestions
  }

  const updateUserSkills = (newSkillData) => {
    setUserSkills(prev => ({ ...prev, ...newSkillData }))
  }

  const addAchievement = (achievementId) => {
    setAchievements(prev => 
      prev.map(ach => 
        ach.id === achievementId 
          ? { ...ach, earned: true, earnedAt: new Date() }
          : ach
      )
    )
  }

  const value = {
    currentUser,
    setCurrentUser,
    repositories,
    pullRequests,
    codeQualityData,
    learningResources,
    userSkills,
    achievements,
    analyzeDiff,
    updateUserSkills,
    addAchievement
  }

  return (
    <CodeCollabContext.Provider value={value}>
      {children}
    </CodeCollabContext.Provider>
  )
}
