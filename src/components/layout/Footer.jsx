import styles from './Footer.module.scss'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {currentYear} Leafline Library. Curated for thoughtful readers.
        </p>
        <p className={styles.meta}>Crafted with React, Vite, and a love of books.</p>
      </div>
    </footer>
  )
}

export default Footer
