import styles from './Pagination.module.scss'

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1)
    }
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination navigation">
      <button
        className={styles.pageButton}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        ← Previous
      </button>

      <div className={styles.pageNumbers}>
        {getVisiblePages().map((page, index) => (
          <span key={index}>
            {page === '...' ? (
              <span className={styles.ellipsis}>...</span>
            ) : (
              <button
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                onClick={() => handlePageClick(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </span>
        ))}
      </div>

      <button
        className={styles.pageButton}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next →
      </button>
    </nav>
  )
}

export default Pagination