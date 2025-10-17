import { Link, useParams } from 'react-router-dom'
import styles from './BookDetail.module.scss'

const featuredBooks = {
  'atlas-of-echoes': {
    title: 'Atlas of Echoes',
    author: 'Elena Rivers',
    summary:
      'A cartographer charts the emotional geography of a living city and uncovers the memories woven into its streets.',
    readingTime: '7 hours',
  },
  'luminary-threads': {
    title: 'Luminary Threads',
    author: 'Jai Patel',
    summary:
      'Siblings inherit a tailor shop that stitches light itself, blending magical realism with heartfelt drama.',
    readingTime: '5.5 hours',
  },
}

function BookDetailPage() {
  const { bookId } = useParams()
  const book = featuredBooks[bookId] ?? {
    title: 'Untitled Manuscript',
    author: 'Unknown Author',
    summary:
      'This view will eventually show a rich synopsis, reviews, and related editions based on the selected book.',
    readingTime: 'TBD',
  }

  return (
    <section className={styles.wrapper}>
      <h1>{book.title}</h1>
      <p className={styles.meta}>By {book.author}</p>
      <p className={styles.summary}>{book.summary}</p>
      <dl className={styles.dataList}>
        <div>
          <dt>Estimated reading time</dt>
          <dd>{book.readingTime}</dd>
        </div>
        <div>
          <dt>Library status</dt>
          <dd>Available digitally &amp; on the studio shelf</dd>
        </div>
      </dl>
      <Link to="/browse" className={styles.backLink}>
        ← Back to Browse
      </Link>
    </section>
  )
}

export default BookDetailPage
