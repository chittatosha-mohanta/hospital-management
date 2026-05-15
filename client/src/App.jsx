import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdminDoctors from './pages/dashboards/AdminDoctors';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import DoctorAppointments from './pages/dashboards/DoctorAppointments';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import SearchDoctors from './pages/dashboards/SearchDoctors';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/search" element={<SearchDoctors />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
