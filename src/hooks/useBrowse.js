import { useContext } from 'react'
import { BrowseContext } from '../contexts/BrowseContext.jsx'

export const useBrowse = () => {
  const context = useContext(BrowseContext)
  if (!context) {
    throw new Error('useBrowse must be used within a BrowseProvider')
  }
  return context
}