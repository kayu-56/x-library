import Footer from './Footer.jsx'
import Header from './Header.jsx'
import styles from './AppLayout.module.scss'

function AppLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  )
}

export default AppLayout
