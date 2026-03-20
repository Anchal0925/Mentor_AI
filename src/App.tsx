import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Session from './pages/Session';
import Progress from './pages/Progress';
import LearningPath from './pages/LearningPath';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full Viewport Pages (No Navbar/Sidebar) */}
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/session/:id" element={<Session />} />
        <Route path="/session/new" element={<Session />} />

        {/* Dashboard Pages (With Global Shell) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/path" element={<LearningPath />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
