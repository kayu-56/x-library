import styles from './UserProfile.module.scss'

function UserProfilePage() {
  return (
    <section>
      <h1>Your reading profile</h1>
      <p>
        This space will help readers track their progress, saved titles, and
        annotations. It currently displays representative widgets so the layout
        can be validated while core features are under development.
      </p>
      <div className={styles.widgets}>
        <article className={styles.widgetCard}>
          <h2>Currently reading</h2>
          <p>
            You&apos;re midway through <strong>Atlas of Echoes</strong>. Pick up
            where you left off with synced highlights.
          </p>
        </article>
        <article className={styles.widgetCard}>
          <h2>Saved for later</h2>
          <ul>
            <li>Designing Voice Interfaces</li>
            <li>The Typography Reader</li>
            <li>Threads of Light</li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default UserProfilePage
