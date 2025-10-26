import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useBookInteractions } from '../contexts/BookInteractionsContext.jsx'
import styles from './BookCard.module.scss'

function BookCard({ book, showActions = true }) {
  const { initializeBook, toggleLike, toggleSave, getBookState } = useBookInteractions()

  useEffect(() => {
    if (book) {
      initializeBook(book.id, { likes: book.likes || 0, saves: book.saves || 0 })
    }
  }, [book, initializeBook])

  const bookState = getBookState(book.id)

  const handleLike = (e) => {
    e.preventDefault()
    toggleLike(book.id)
  }

  const handleSave = (e) => {
    e.preventDefault()
    toggleSave(book.id)
  }

  const coverUrl = `https://picsum.photos/seed/${book.id}/200/300.jpg`

  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        <img 
          src={coverUrl} 
          alt={`Cover of ${book.title}`}
          className={styles.coverImage}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p className={styles.meta}>By {book.author}</p>
        <p className={styles.tag}>
          <span className={styles.badge}>{book.category}</span>
          <span className={styles.dot} aria-hidden="true">•</span>
          <span>{book.subject}</span>
        </p>
        {showActions && (
          <div className={styles.quickActions}>
            <button
              type="button"
              className={`${styles.actionBtn} ${bookState.userActions.liked ? styles.active : ''}`}
              onClick={handleLike}
              aria-pressed={bookState.userActions.liked}
            >
              <span className={styles.actionIcon}>👍</span>
              <span className={styles.count}>{bookState.counts.likes}</span>
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${bookState.userActions.saved ? styles.active : ''}`}
              onClick={handleSave}
              aria-pressed={bookState.userActions.saved}
            >
              <span className={styles.actionIcon}>🔖</span>
              <span className={styles.count}>{bookState.counts.saves}</span>
            </button>
          </div>
        )}
      </div>
      <div className={styles.action}>
        <Link to={`/books/${book.id}`} className={styles.viewLink}>
          View
        </Link>
      </div>
    </article>
  )
}

export default BookCard
