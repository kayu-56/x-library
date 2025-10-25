import { useState, useEffect, memo } from 'react'
import BookCard from '../BookCard.jsx'
import EmptyState from './EmptyState.jsx'
import Pagination from './Pagination.jsx'
import styles from './BookGrid.module.scss'

const MemoizedBookCard = memo(BookCard)

function BookGrid({ books, searchQuery, category }) {
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const handleResetPagination = () => {
      setCurrentPage(1)
    }

    window.addEventListener('resetPagination', handleResetPagination)
    return () => {
      window.removeEventListener('resetPagination', handleResetPagination)
    }
  }, [])

  const PAGE_SIZE = 20
  const totalPages = Math.ceil(books.length / PAGE_SIZE)
  
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const currentBooks = books.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (books.length === 0) {
    return <EmptyState searchQuery={searchQuery} category={category} />
  }

  return (
    <div className={styles.bookGrid}>
      <div className={styles.resultsHeader}>
        <p className={styles.resultsCount}>
          Found {books.length} book{books.length !== 1 ? 's' : ''}
          {totalPages > 1 && (
            <span className={styles.pageInfo}>
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </p>
      </div>
      
      <div className={styles.grid} id="books-grid" role="grid" aria-label="Books">
        {currentBooks.map((book) => (
          <div key={book.id} className={styles.gridItem} role="gridcell">
            <MemoizedBookCard book={book} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default BookGrid