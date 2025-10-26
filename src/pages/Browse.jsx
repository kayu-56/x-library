import { BrowseProvider } from '../providers/BrowseProvider.jsx'
import { useBrowse } from '../hooks/useBrowse.js'
import { useEffect } from 'react'
import { useFilteredBooks } from '../hooks/useFilteredBooks.js'
import CategoryFilter from '../components/browse/CategoryFilter.jsx'
import SearchInput from '../components/browse/SearchInput.jsx'
import SortControls from '../components/browse/SortControls.jsx'
import BookGrid from '../components/browse/BookGrid.jsx'
import styles from './Browse.module.scss'

function BrowseContent() {
  const { preferences } = useBrowse()
  const filteredBooks = useFilteredBooks(preferences)

  useEffect(() => {
    // Reset page when filters change
    const event = new CustomEvent('resetPagination')
    window.dispatchEvent(event)
  }, [preferences.category, preferences.searchQuery, preferences.sortBy])

  return (
    <section>
      <header className={styles.header}>
        <h1>Browse the stacks</h1>
        <p>
          Explore our collection of books by category, search for specific titles or authors, 
          and sort by publication date or title to find exactly what you're looking for.
        </p>
      </header>

      <div className={styles.controls}>
        <CategoryFilter />
        <SearchInput />
        <SortControls />
      </div>

      <BookGrid 
        books={filteredBooks}
        searchQuery={preferences.searchQuery}
        category={preferences.category}
      />
    </section>
  )
}

function BrowsePage() {
  return (
    <BrowseProvider>
      <BrowseContent />
    </BrowseProvider>
  )
}

export default BrowsePage