import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import { getAllFeaturedBooks } from '../utils/featuredBooks.js'
import styles from './Home.module.scss'

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredBooks, setFeaturedBooks] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    setFeaturedBooks(getAllFeaturedBooks(4))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const categories = Object.keys(featuredBooks)

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroContent}>
          <h1 id="hero-heading" className={styles.heroTitle}>
            Welcome to Leafline Library
          </h1>
          <p className={styles.heroDescription}>
            Discover a curated collection of contemporary fiction, practical guides,
            and creative references to inspire your next project. Browse our shelves,
            dive into detailed book overviews, and manage your personal reading
            profile—all within a single-page experience.
          </p>
          
          {/* Quick Search */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <label htmlFor="quick-search" className="sr-only">
              Search books
            </label>
            <input
              id="quick-search"
              type="text"
              placeholder="Quick search for books, authors, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

          <div className={styles.actions}>
            <Link to="/browse" className={styles.primaryCta}>
              Start Exploring
            </Link>
            <Link to="/books/book-1" className={styles.secondaryCta}>
              View a Featured Book
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books Sections */}
      {categories.map((category) => (
        <section 
          key={category} 
          className={styles.featuredSection}
          aria-labelledby={`featured-${category.toLowerCase().replace(/\s+/g, '-')}-heading`}
        >
          <div className={styles.sectionHeader}>
            <h2 
              id={`featured-${category.toLowerCase().replace(/\s+/g, '-')}-heading`}
              className={styles.sectionTitle}
            >
              Featured {category}
            </h2>
            <Link 
              to={`/browse?category=${encodeURIComponent(category)}`}
              className={styles.viewAllLink}
            >
              View all →
            </Link>
          </div>
          
          <div className={styles.booksGrid}>
            {featuredBooks[category]?.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                showActions={true}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Additional CTA Section */}
      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <h2 id="cta-heading" className={styles.ctaTitle}>
          Ready to start your reading journey?
        </h2>
        <p className={styles.ctaDescription}>
          Join thousands of readers discovering their next favorite book.
          Save your favorites, leave reviews, and build your personal library.
        </p>
        <div className={styles.ctaActions}>
          <Link to="/browse" className={styles.ctaPrimary}>
            Browse All Books
          </Link>
          <Link to="/profile" className={styles.ctaSecondary}>
            Your Profile
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
