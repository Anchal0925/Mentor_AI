import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Session from './pages/Session';
import Progress from './pages/Progress';
import LearningPath from './pages/LearningPath';
import SessionFeedback from './pages/SessionFeedback';
import SessionReplay from './pages/SessionReplay';
import PathBrowser from './pages/PathBrowser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full Viewport Pages (No Navbar/Sidebar) */}
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/session/:id" element={<Session />} />
        <Route path="/session/new" element={<Session />} />
        <Route path="/session/:id/replay" element={<SessionReplay />} />

        {/* Dashboard Pages (With Global Shell) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/paths" element={<PathBrowser />} />
          <Route path="/paths/:id" element={<LearningPath />} />
          <Route path="/path" element={<Navigate to="/paths" replace />} />
          <Route path="/session/:id/feedback" element={<SessionFeedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
