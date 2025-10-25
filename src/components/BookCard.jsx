import { Link } from 'react-router-dom'
import styles from './BookCard.module.scss'

function BookCard({ book }) {
  return (
    <article className={styles.card}>
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
