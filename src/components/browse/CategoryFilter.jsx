import { useBrowse } from '../../hooks/useBrowse.js'
import { memo } from 'react'
import styles from './CategoryFilter.module.scss'

const categories = [
  { value: 'all', label: 'All Books' },
  { value: 'Fiction', label: 'Fiction' },
  { value: 'Programming', label: 'Programming' },
  { value: 'Humanities & Social Sciences', label: 'Humanities' }
]

function CategoryFilter() {
  const { preferences, updatePreferences } = useBrowse()

  const handleKeyDown = (e, categoryValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      updatePreferences({ category: categoryValue })
    }
  }

  return (
    <div className={styles.categoryFilter}>
      <div className={styles.tabs} role="tablist">
        {categories.map((category) => (
          <button
            key={category.value}
            className={styles.tab}
            role="tab"
            aria-selected={preferences.category === category.value}
            aria-controls="books-grid"
            onClick={() => updatePreferences({ category: category.value })}
            onKeyDown={(e) => handleKeyDown(e, category.value)}
            tabIndex={0}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(CategoryFilter)