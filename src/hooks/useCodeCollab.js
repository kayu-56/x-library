import { useContext } from 'react'
import { CodeCollabContext } from '../contexts/CodeCollabContext'

export const useCodeCollab = () => {
  const context = useContext(CodeCollabContext)
  if (!context) {
    throw new Error('useCodeCollab must be used within a CodeCollabProvider')
  }
  return context
}
