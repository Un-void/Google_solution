import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RequestsPage from './pages/RequestsPage';
import SimulationPage from './pages/SimulationPage';
import ResourcesPage from './pages/ResourcesPage';
import VolunteersPage from './pages/VolunteersPage';
import AlertsPage from './pages/AlertsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-slate-100 font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
