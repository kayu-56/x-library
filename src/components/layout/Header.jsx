import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import styles from './Header.module.scss'

const navigation = [
  { to: '/', label: 'Home', end: true },
  { to: '/browse', label: 'Browse' },
  { to: '/books/atlas-of-echoes', label: 'Book Detail' },
  { to: '/profile', label: 'Profile' },
]

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.branding}>
          <span className={styles.logoMark} aria-hidden="true">
            📚
          </span>
          <div>
            <span className={styles.title}>Leafline Library</span>
            <p className={styles.subtitle}>Stories, guides, and inspiration</p>
          </div>
        </div>
        <nav className={styles.nav} aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                classNames(styles.navLink, { [styles.navLinkActive]: isActive })
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
