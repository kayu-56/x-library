import { useBrowse } from '../../hooks/useBrowse.js'
import { memo } from 'react'
import styles from './SortControls.module.scss'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alphabetical', label: 'Title A-Z' },
  { value: 'alphabetical-desc', label: 'Title Z-A' }
]

function SortControls() {
  const { preferences, updatePreferences } = useBrowse()

  return (
    <div className={styles.sortControls}>
      <label htmlFor="sort-select" className={styles.label}>
        Sort by:
      </label>
      <select
        id="sort-select"
        value={preferences.sortBy}
        onChange={(e) => updatePreferences({ sortBy: e.target.value })}
        className={styles.select}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default memo(SortControls)