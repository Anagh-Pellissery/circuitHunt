import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TeamProvider, useTeam } from './context/TeamContext';
import { MarketProvider } from './context/MarketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Finished from './pages/Finished';
import Market from './pages/Market';
import AdminQrCodes from './pages/AdminQrCodes';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RequireAdmin from './components/RequireAdmin';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireTeam({ children }) {
  const { team, loading } = useTeam();
  
  if (loading) return <div>Loading team data...</div>;
  if (!team) return <Navigate to="/register" replace />;
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <TeamProvider>
        <BrowserRouter>
          <MarketProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><RequireTeam><Home /></RequireTeam></ProtectedRoute>} />
              <Route path="/mission" element={<ProtectedRoute><RequireTeam><Mission /></RequireTeam></ProtectedRoute>} />
              <Route path="/market" element={<ProtectedRoute><RequireTeam><Market /></RequireTeam></ProtectedRoute>} />
              <Route path="/finished" element={<ProtectedRoute><RequireTeam><Finished /></RequireTeam></ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="/admin/qr" element={<RequireAdmin><AdminQrCodes /></RequireAdmin>} />
            </Routes>
          </MarketProvider>
        </BrowserRouter>
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;
