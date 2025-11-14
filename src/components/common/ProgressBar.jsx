import classNames from 'classnames'
import styles from './ProgressBar.module.scss'

function ProgressBar({ value = 0, label, tone = 'primary', threshold, hint }) {
  const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const safeThreshold =
    threshold === undefined ? undefined : Math.max(0, Math.min(100, threshold))

  return (
    <div className={classNames(styles.wrapper, styles[`tone${tone.charAt(0).toUpperCase() + tone.slice(1)}`])}>
      <div className={styles.header}>
        <span>{label}</span>
        <span>{Math.round(safeValue)}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${safeValue}%` }} />
        {safeThreshold !== undefined ? (
          <span className={styles.threshold} style={{ left: `${safeThreshold}%` }} aria-hidden="true" />
        ) : null}
      </div>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  )
}

export default ProgressBar
