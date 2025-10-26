import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BookInteractionsProvider } from './contexts/BookInteractionsContext.jsx'
import { BrowseProvider } from './providers/BrowseProvider.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import BrowsePage from './pages/Browse.jsx'
import BookDetailPage from './pages/BookDetail.jsx'
import HomePage from './pages/Home.jsx'
import UserProfilePage from './pages/UserProfile.jsx'

function App() {
  return (
    <BrowserRouter>
      <BookInteractionsProvider>
        <BrowseProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/books/:bookId" element={<BookDetailPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowseProvider>
      </BookInteractionsProvider>
    </BrowserRouter>
  )
}

export default App
