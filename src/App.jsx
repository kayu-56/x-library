import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import OverviewPage from './pages/Overview.jsx'
import AIDiffPage from './pages/AIDiff.jsx'
import InsightsPage from './pages/Insights.jsx'
import CodeQualityPage from './pages/CodeQuality.jsx'
import LearningPage from './pages/Learning.jsx'
import GrowthPage from './pages/Growth.jsx'
import { PlatformDataProvider } from './contexts/PlatformDataProvider.jsx'

function App() {
  return (
    <BrowserRouter>
      <PlatformDataProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/ai-diff" element={<AIDiffPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/quality" element={<CodeQualityPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/growth" element={<GrowthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </PlatformDataProvider>
    </BrowserRouter>
  )
}

export default App
