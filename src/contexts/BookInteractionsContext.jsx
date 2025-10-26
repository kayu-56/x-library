/* eslint-disable react-refresh/only-export-components */
import { useContext, useState } from 'react'
import { BookInteractionsContext } from './BookInteractionsContext.js'
import { 
  getCounts, 
  getUserActionsForBook, 
  toggleLike, 
  toggleSave,
  ensureCounts
} from '../utils/storage.js'

export function useBookInteractions() {
  const context = useContext(BookInteractionsContext)
  if (!context) {
    throw new Error('useBookInteractions must be used within a BookInteractionsProvider')
  }
  return context
}

export function BookInteractionsProvider({ children }) {
  const [bookStates, setBookStates] = useState({})

  // Initialize book state when needed
  const initializeBook = (bookId, defaultCounts = { likes: 0, saves: 0 }) => {
    if (!bookStates[bookId]) {
      ensureCounts(bookId, defaultCounts)
      const counts = getCounts(bookId)
      const userActions = getUserActionsForBook(bookId)
      
      setBookStates(prev => ({
        ...prev,
        [bookId]: {
          counts,
          userActions
        }
      }))
    }
    return bookStates[bookId]
  }

  const handleToggleLike = (bookId) => {
    const result = toggleLike(bookId)
    setBookStates(prev => ({
      ...prev,
      [bookId]: {
        counts: result.counts,
        userActions: {
          ...prev[bookId]?.userActions,
          liked: result.liked
        }
      }
    }))
    return result
  }

  const handleToggleSave = (bookId) => {
    const result = toggleSave(bookId)
    setBookStates(prev => ({
      ...prev,
      [bookId]: {
        counts: result.counts,
        userActions: {
          ...prev[bookId]?.userActions,
          saved: result.saved
        }
      }
    }))
    return result
  }

  const getBookState = (bookId) => {
    return bookStates[bookId] || { counts: { likes: 0, saves: 0 }, userActions: { liked: false, saved: false } }
  }

  const value = {
    initializeBook,
    toggleLike: handleToggleLike,
    toggleSave: handleToggleSave,
    getBookState
  }

  return (
    <BookInteractionsContext.Provider value={value}>
      {children}
    </BookInteractionsContext.Provider>
  )
}