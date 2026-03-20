import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Session from './pages/Session';
import Progress from './pages/Progress';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full Viewport Pages (No Navbar/Sidebar) */}
        <Route path="/" element={<Landing />} />
        <Route path="/session/:id" element={<Session />} />
        <Route path="/session/new" element={<Session />} />

        {/* Dashboard Pages (With Navbar+Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
