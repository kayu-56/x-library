import { useMemo } from 'react'
import { books } from '../data/books.js'

export function useFilteredBooks(preferences) {
  const { category, searchQuery, sortBy } = preferences

  return useMemo(() => {
    // Filter by category
    let filtered = category === 'all' 
      ? books 
      : books.filter(book => book.category === category)

    // Filter by search query (title, author, subject)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.subject.toLowerCase().includes(query)
      )
    }

    // Sort books
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publicationDate) - new Date(a.publicationDate)
        case 'oldest':
          return new Date(a.publicationDate) - new Date(b.publicationDate)
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'alphabetical-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return sorted
  }, [category, searchQuery, sortBy])
}