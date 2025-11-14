export const fetchRepositories = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
    {
      id: 1,
      name: 'react-dashboard',
      description: 'Modern analytics dashboard built with React',
      language: 'JavaScript',
      stars: 342,
      forks: 67,
      openIssues: 12,
      lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'python-ml-toolkit',
      description: 'Machine learning utilities and helpers',
      language: 'Python',
      stars: 189,
      forks: 34,
      openIssues: 5,
      lastUpdate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: 'go-microservices',
      description: 'Microservices architecture example',
      language: 'Go',
      stars: 156,
      forks: 28,
      openIssues: 8,
      lastUpdate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]
}

export const fetchPullRequests = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return [
    {
      id: 'PR-101',
      title: 'Implement user authentication with JWT',
      number: 101,
      state: 'open',
      author: 'alice_dev',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      additions: 456,
      deletions: 123,
      commits: 8,
      comments: 15,
      reviewers: ['bob_reviewer', 'charlie_lead'],
      labels: ['enhancement', 'security']
    },
    {
      id: 'PR-102',
      title: 'Fix memory leak in data processing',
      number: 102,
      state: 'merged',
      author: 'bob_reviewer',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      mergedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      additions: 89,
      deletions: 234,
      commits: 3,
      comments: 8,
      reviewers: ['alice_dev'],
      labels: ['bug', 'performance']
    }
  ]
}

export const fetchCommits = async (repository, limit = 50) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const commits = []
  for (let i = 0; i < limit; i++) {
    commits.push({
      sha: Math.random().toString(36).substring(7),
      message: [
        'Fix bug in authentication flow',
        'Add unit tests for user service',
        'Refactor database queries',
        'Update dependencies',
        'Improve error handling',
        'Add API documentation'
      ][Math.floor(Math.random() * 6)],
      author: ['alice_dev', 'bob_reviewer', 'charlie_lead'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      additions: Math.floor(Math.random() * 200) + 10,
      deletions: Math.floor(Math.random() * 150) + 5
    })
  }
  
  return commits
}

export const fetchCodeReviews = async () => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  return [
    {
      id: 'rev-1',
      reviewer: 'bob_reviewer',
      state: 'approved',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      comments: 5
    },
    {
      id: 'rev-2',
      reviewer: 'charlie_lead',
      state: 'changes_requested',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      comments: 8
    }
  ]
}

export const analyzeRepositoryActivity = async (repository, days = 30) => {
  await new Promise(resolve => setTimeout(resolve, 700))
  
  const activity = []
  for (let i = days - 1; i >= 0; i--) {
    activity.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      commits: Math.floor(Math.random() * 15) + 1,
      prs: Math.floor(Math.random() * 5),
      issues: Math.floor(Math.random() * 8),
      reviews: Math.floor(Math.random() * 10)
    })
  }
  
  return activity
}
