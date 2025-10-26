import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BrowseContext } from '../contexts/BrowseContext.jsx'
import { STORAGE_KEY, defaultPreferences } from '../constants/browse.js'

export function BrowseProvider({ children }) {
  const [searchParams] = useSearchParams()
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const basePreferences = stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences
      
      // Override with URL parameters if present
      const urlSearch = searchParams.get('search')
      const urlCategory = searchParams.get('category')
      
      return {
        ...basePreferences,
        searchQuery: urlSearch || basePreferences.searchQuery,
        category: urlCategory || basePreferences.category
      }
    } catch {
      return defaultPreferences
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [preferences])

  const updatePreferences = (updates) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const value = {
    preferences,
    updatePreferences
  }

  return (
    <BrowseContext.Provider value={value}>
      {children}
    </BrowseContext.Provider>
  )
}