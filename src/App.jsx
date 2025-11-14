import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BookInteractionsProvider } from './contexts/BookInteractionsContext.jsx'
import { BrowseProvider } from './providers/BrowseProvider.jsx'
import { CodeCollabProvider } from './contexts/CodeCollabContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import BrowsePage from './pages/Browse.jsx'
import BookDetailPage from './pages/BookDetail.jsx'
import HomePage from './pages/Home.jsx'
import UserProfilePage from './pages/UserProfile.jsx'
import CodeDiffViewerPage from './pages/CodeDiffViewer.jsx'
import PRDashboardPage from './pages/PRDashboard.jsx'
import CodeQualityPage from './pages/CodeQuality.jsx'
import LearningCenterPage from './pages/LearningCenter.jsx'
import SkillDevelopmentPage from './pages/SkillDevelopment.jsx'

function App() {
  return (
    <BrowserRouter>
      <CodeCollabProvider>
        <BookInteractionsProvider>
          <BrowseProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/books/:bookId" element={<BookDetailPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/code-diff" element={<CodeDiffViewerPage />} />
                <Route path="/pr-dashboard" element={<PRDashboardPage />} />
                <Route path="/code-quality" element={<CodeQualityPage />} />
                <Route path="/learning-center" element={<LearningCenterPage />} />
                <Route path="/skill-development" element={<SkillDevelopmentPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </BrowseProvider>
        </BookInteractionsProvider>
      </CodeCollabProvider>
    </BrowserRouter>
  )
}

export default App
