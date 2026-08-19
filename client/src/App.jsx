import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from './pages/public/Home';
import Hospitals from './pages/public/Hospitals';
import HospitalDetail from './pages/public/HospitalDetail';
import DoctorsDirectory from './pages/public/DoctorsDirectory';
import RegisterHospital from './pages/public/RegisterHospital';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import ManageHospitals from './pages/super-admin/ManageHospitals';
import ManageUsers from './pages/super-admin/ManageUsers';
import PlatformAnalytics from './pages/super-admin/PlatformAnalytics';

// Hospital Admin Pages
import HospitalDashboard from './pages/hospital-admin/HospitalDashboard';
import ManageHospitalDoctors from './pages/hospital-admin/ManageHospitalDoctors';
import ManageDepartments from './pages/hospital-admin/ManageDepartments';
import HospitalAppointments from './pages/hospital-admin/HospitalAppointments';
import HospitalSettings from './pages/hospital-admin/HospitalSettings';
import HospitalReviews from './pages/hospital-admin/HospitalReviews';

// Doctor Pages
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import DoctorAppointments from './pages/dashboards/DoctorAppointments';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';

// Patient Pages
import PatientDashboard from './pages/dashboards/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientHistory from './pages/patient/PatientHistory';

// Route Guard
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        {/* Public Discovery Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:slug" element={<HospitalDetail />} />
        <Route path="/doctors" element={<DoctorsDirectory />} />
        <Route path="/register-hospital" element={<RegisterHospital />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Super Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['superAdmin']} />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/hospitals" element={<ManageHospitals />} />
          <Route path="/super-admin/users" element={<ManageUsers />} />
          <Route path="/super-admin/analytics" element={<PlatformAnalytics />} />
        </Route>

        {/* Hospital Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['hospitalAdmin']} />}>
          <Route path="/hospital-admin" element={<HospitalDashboard />} />
          <Route path="/hospital-admin/doctors" element={<ManageHospitalDoctors />} />
          <Route path="/hospital-admin/departments" element={<ManageDepartments />} />
          <Route path="/hospital-admin/appointments" element={<HospitalAppointments />} />
          <Route path="/hospital-admin/settings" element={<HospitalSettings />} />
          <Route path="/hospital-admin/reviews" element={<HospitalReviews />} />
        </Route>

        {/* Doctor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
        </Route>

        {/* Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/search" element={<DoctorsDirectory />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/history" element={<PatientHistory />} />
        </Route>

        {/* Legacy redirect */}
        <Route path="/admin/*" element={<Navigate to="/super-admin" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
