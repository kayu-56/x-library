import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import styles from './Header.module.scss'

const navigation = [
  { to: '/', label: 'Home', end: true },
  { to: '/code-diff', label: 'Code Diff' },
  { to: '/pr-dashboard', label: 'PR Analytics' },
  { to: '/code-quality', label: 'Quality' },
  { to: '/learning-center', label: 'Learning' },
  { to: '/skill-development', label: 'Skills' },
]

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.branding}>
          <span className={styles.logoMark} aria-hidden="true">
            💻
          </span>
          <div>
            <span className={styles.title}>Code Collab Platform</span>
            <p className={styles.subtitle}>AI-powered development tools</p>
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
