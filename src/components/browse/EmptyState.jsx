import { useBrowse } from '../../hooks/useBrowse.js'
import styles from './EmptyState.module.scss'

function EmptyState({ searchQuery, category }) {
  const { updatePreferences } = useBrowse()
  const hasFilters = searchQuery || category !== 'all'
  
  const clearFilters = () => {
    updatePreferences({
      searchQuery: '',
      category: 'all',
      sortBy: 'newest'
    })
  }
  
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>📚</div>
      <h2 className={styles.title}>
        {hasFilters ? 'No books found' : 'No books available'}
      </h2>
      <p className={styles.message}>
        {hasFilters ? (
          <>
            {searchQuery && (
              <>No books match your search for "{searchQuery}"</>
            )}
            {searchQuery && category !== 'all' && <><br /></>}
            {category !== 'all' && (
              <>No books found in the {category} category</>
            )}
            <br /><br />
            Try adjusting your filters or search terms to find what you're looking for.
          </>
        ) : (
          'There are currently no books in the library.'
        )}
      </p>
      {hasFilters && (
        <button 
          className={styles.clearButton}
          onClick={clearFilters}
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

export default EmptyState