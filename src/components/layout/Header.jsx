import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import { usePlatformData } from '../../hooks/usePlatformData.js'
import styles from './Header.module.scss'

const navigation = [
  { to: '/', label: 'Overview', end: true },
  { to: '/ai-diff', label: 'AI Diff' },
  { to: '/insights', label: 'PR Analytics' },
  { to: '/quality', label: 'Code Quality' },
  { to: '/learning', label: 'Learning Hub' },
  { to: '/growth', label: 'Skill Growth' },
]

const computeRelativeTime = (timestamp) => {
  if (!timestamp) return 'unsynced'
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.max(Math.round(diffMs / 60000), 0)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

function Header() {
  const { repository, computed } = usePlatformData()
  const relativeSync = computeRelativeTime(repository?.lastSyncedAt)
  const mergeRate = computed?.pullRequestStats?.mergeRate ?? 0

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.branding}>
          <span className={styles.logoMark} aria-hidden="true">
            ⚡️
          </span>
          <div>
            <span className={styles.title}>{repository?.name ?? 'AI Collaboration Hub'}</span>
            <p className={styles.subtitle}>
              AI-guided review intelligence · Merge rate {mergeRate}%
            </p>
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
        <div className={styles.status}>
          <span className={styles.statusBadge}>Live sync</span>
          <span className={styles.statusMeta}>Updated {relativeSync}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
