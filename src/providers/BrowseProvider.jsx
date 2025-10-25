import { useEffect, useState } from 'react'
import { BrowseContext } from '../contexts/BrowseContext.jsx'
import { STORAGE_KEY, defaultPreferences } from '../constants/browse.js'

export function BrowseProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences
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