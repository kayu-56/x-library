import { usePlatformData } from '../../hooks/usePlatformData.js'
import styles from './Footer.module.scss'

function Footer() {
  const currentYear = new Date().getFullYear()
  const { repository, automatedGuardrails } = usePlatformData()

  const primaryGuardrails = automatedGuardrails?.blockingChecks?.slice(0, 2) ?? []

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.copy}>
            © {currentYear} {repository?.name ?? 'AI Collaboration Hub'}. Secure collaboration, continuous learning.
          </p>
          <p className={styles.meta}>
            Guardrails: {primaryGuardrails.join(' · ')}
          </p>
        </div>
        <p className={styles.metaSoft}>
          Powered by AI insights · Privacy-first · Role-aware access
        </p>
      </div>
    </footer>
  )
}

export default Footer
