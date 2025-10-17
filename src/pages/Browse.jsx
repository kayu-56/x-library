import styles from './Browse.module.scss'

const genres = [
  'Speculative Fiction',
  'Design Systems',
  'Creative Non-fiction',
  'Product Thinking',
  'Young Adult',
  'Maker Manuals',
]

function BrowsePage() {
  return (
    <section>
      <h1>Browse the stacks</h1>
      <p>
        Use the browse view to filter the full collection by genre, mood, or
        reading time. The final experience will support advanced filters and
        personalized recommendations—this placeholder confirms the routing
        structure is ready for those features.
      </p>
      <ul className={styles.genreGrid}>
        {genres.map((genre) => (
          <li key={genre} className={styles.genreTile}>
            {genre}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BrowsePage
