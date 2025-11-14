import { useContext } from 'react'
import { PlatformDataContext } from '../contexts/PlatformDataContext.js'

export function usePlatformData() {
  const context = useContext(PlatformDataContext)
  if (!context) {
    throw new Error('usePlatformData must be used within PlatformDataProvider')
  }
  return context
}
