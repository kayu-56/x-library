import { Link } from 'react-router-dom'
import styles from './Home.module.scss'

function HomePage() {
  return (
    <section>
      <h1>Welcome to Leafline Library</h1>
      <p>
        Discover a curated collection of contemporary fiction, practical guides,
        and creative references to inspire your next project. Browse our shelves,
        dive into detailed book overviews, and manage your personal reading
        profile—all within a single-page experience.
      </p>
      <div className={styles.actions}>
        <Link to="/browse" className={styles.primaryCta}>
          Start Exploring
        </Link>
        <Link to="/books/atlas-of-echoes" className={styles.secondaryCta}>
          View a Featured Book
        </Link>
      </div>
    </section>
  )
}

export default HomePage
