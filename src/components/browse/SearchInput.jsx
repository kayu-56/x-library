import { useState, useEffect, memo } from 'react'
import { useBrowse } from '../../hooks/useBrowse.js'
import styles from './SearchInput.module.scss'

function SearchInput() {
  const { preferences, updatePreferences } = useBrowse()
  const [localValue, setLocalValue] = useState(preferences.searchQuery)

  useEffect(() => {
    setLocalValue(preferences.searchQuery)
  }, [preferences.searchQuery])

  const handleChange = (e) => {
    const value = e.target.value
    setLocalValue(value)
    updatePreferences({ searchQuery: value })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setLocalValue('')
      updatePreferences({ searchQuery: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.searchContainer}>
        <label htmlFor="book-search" className={styles.visuallyHidden}>
          Search books by title, author, or subject
        </label>
        <input
          id="book-search"
          type="search"
          placeholder="Search by title, author, or subject..."
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
          aria-describedby="search-description"
          autoComplete="off"
        />
        <div className={styles.searchIcon} aria-hidden="true">
          🔍
        </div>
      </div>
      <div id="search-description" className={styles.searchDescription}>
        {preferences.searchQuery && (
          <span>
            Searching for "{preferences.searchQuery}"
          </span>
        )}
      </div>
    </form>
  )
}

export default memo(SearchInput)