import { useMemo } from 'react'
import { useFilteredBooks } from '../hooks/useFilteredBooks.js'

const PAGE_SIZE = 20

export function usePaginatedBooks(preferences, page = 1) {
  const filteredBooks = useFilteredBooks(preferences)
  
  const paginatedBooks = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return filteredBooks.slice(startIndex, endIndex)
  }, [filteredBooks, page])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBooks.length / PAGE_SIZE)
  }, [filteredBooks.length])

  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    books: paginatedBooks,
    totalCount: filteredBooks.length,
    currentPage: page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    pageSize: PAGE_SIZE
  }
}