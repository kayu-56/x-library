export const analyzeCodeDiff = async (oldCode, newCode) => {
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  const suggestions = []
  
  if (newCode.includes('innerHTML')) {
    suggestions.push({
      line: newCode.split('\n').findIndex(line => line.includes('innerHTML')) + 1,
      type: 'security',
      severity: 'high',
      message: 'Using innerHTML can lead to XSS vulnerabilities',
      suggestion: 'Use textContent or a sanitization library like DOMPurify'
    })
  }
  
  if (oldCode.includes('for') && newCode.includes('reduce')) {
    suggestions.push({
      line: newCode.split('\n').findIndex(line => line.includes('reduce')) + 1,
      type: 'performance',
      severity: 'medium',
      message: 'Good refactoring! Array methods are more readable',
      suggestion: 'Consider adding comments for complex reduce operations'
    })
  }
  
  if (newCode.includes('var ')) {
    suggestions.push({
      line: newCode.split('\n').findIndex(line => line.includes('var ')) + 1,
      type: 'style',
      severity: 'low',
      message: 'Use const or let instead of var for better scoping',
      suggestion: 'Replace var with const for constants and let for variables'
    })
  }
  
  if (newCode.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]{200,}/)) {
    suggestions.push({
      line: Math.floor(Math.random() * newCode.split('\n').length) + 1,
      type: 'complexity',
      severity: 'medium',
      message: 'Function appears to be doing too much',
      suggestion: 'Consider breaking this into smaller, more focused functions'
    })
  }
  
  return suggestions
}

export const getCodeSuggestions = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
    {
      type: 'optimization',
      title: 'Memory Optimization',
      description: 'Consider using WeakMap for storing object metadata to prevent memory leaks',
      confidence: 85
    },
    {
      type: 'refactoring',
      title: 'Extract Method',
      description: 'Lines 45-67 could be extracted into a separate utility function',
      confidence: 92
    },
    {
      type: 'testing',
      title: 'Add Unit Tests',
      description: 'This function would benefit from edge case testing',
      confidence: 78
    }
  ]
}

export const analyzeCodeQuality = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    score: Math.floor(Math.random() * 20) + 80,
    issues: {
      critical: Math.floor(Math.random() * 3),
      major: Math.floor(Math.random() * 8) + 2,
      minor: Math.floor(Math.random() * 15) + 5
    },
    metrics: {
      maintainability: Math.floor(Math.random() * 15) + 85,
      reliability: Math.floor(Math.random() * 15) + 85,
      security: Math.floor(Math.random() * 15) + 85,
      coverage: Math.floor(Math.random() * 20) + 70
    },
    duplication: (Math.random() * 5 + 1).toFixed(1),
    complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
  }
}

export const generateLearningPath = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    path: 'Full Stack Development',
    estimatedDuration: '120 hours',
    modules: [
      {
        title: 'JavaScript Fundamentals',
        duration: '20 hours',
        status: 'completed'
      },
      {
        title: 'React Advanced Patterns',
        duration: '25 hours',
        status: 'in-progress'
      },
      {
        title: 'Node.js & Express',
        duration: '30 hours',
        status: 'locked'
      },
      {
        title: 'Database Design',
        duration: '25 hours',
        status: 'locked'
      },
      {
        title: 'DevOps & Deployment',
        duration: '20 hours',
        status: 'locked'
      }
    ]
  }
}
