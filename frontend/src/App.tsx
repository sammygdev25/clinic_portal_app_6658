import './App.css';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { Footer } from './components/ui';
import { STAFF_ROLES, homeFor } from './lib/roles';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import PatientVisitNotesPage from './pages/PatientVisitNotesPage';
import PatientPrescriptionsPage from './pages/PatientPrescriptionsPage';
import PatientBillsPage from './pages/PatientBillsPage';
import PatientDocumentsPage from './pages/PatientDocumentsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import DoctorAppointmentDetailPage from './pages/DoctorAppointmentDetailPage';
import ReceptionistDashboardPage from './pages/ReceptionistDashboardPage';
import ReceptionistSchedulePage from './pages/ReceptionistSchedulePage';
import ReceptionistCheckInPage from './pages/ReceptionistCheckInPage';
import ProfilePage from './pages/ProfilePage';

interface RequireAuthProps { children: ReactNode }

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean };
  if (auth && auth.loading) {
    return null;
  }
  const authed = auth && typeof auth.isAuthenticated === 'boolean' ? auth.isAuthenticated : Boolean(localStorage.getItem('token'));
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

interface RequireRoleProps { roles: readonly string[]; children: ReactNode }

function RequireRole({ roles, children }: RequireRoleProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean; user?: { role?: string } | null };
  if (auth && auth.loading) {
    return null;
  }
  if (auth == null || auth.isAuthenticated !== true) {
    return <Navigate to="/login" replace />;
  }
  const role = (auth.user && auth.user?.role) || '';
  if (roles.indexOf(role) < 0) {
    return <Navigate to={homeFor(role)} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="ds-page">
          <Navbar />
          <main className="ds-page-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/patient/dashboard" element={<RequireAuth><PatientDashboardPage /></RequireAuth>} />
              <Route path="/patient/appointments" element={<RequireAuth><PatientAppointmentsPage /></RequireAuth>} />
              <Route path="/patient/visit-notes" element={<RequireAuth><PatientVisitNotesPage /></RequireAuth>} />
              <Route path="/patient/prescriptions" element={<RequireAuth><PatientPrescriptionsPage /></RequireAuth>} />
              <Route path="/patient/bills" element={<RequireAuth><PatientBillsPage /></RequireAuth>} />
              <Route path="/patient/documents" element={<RequireAuth><PatientDocumentsPage /></RequireAuth>} />
              <Route path="/patient/profile" element={<RequireAuth><PatientProfilePage /></RequireAuth>} />
              <Route path="/staff/doctor/dashboard" element={<RequireRole roles={STAFF_ROLES}><DoctorDashboardPage /></RequireRole>} />
              <Route path="/staff/doctor/schedule" element={<RequireRole roles={STAFF_ROLES}><DoctorSchedulePage /></RequireRole>} />
              <Route path="/staff/doctor/appointments/:id" element={<RequireRole roles={STAFF_ROLES}><DoctorAppointmentDetailPage /></RequireRole>} />
              <Route path="/staff/receptionist/dashboard" element={<RequireRole roles={STAFF_ROLES}><ReceptionistDashboardPage /></RequireRole>} />
              <Route path="/staff/receptionist/schedule" element={<RequireRole roles={STAFF_ROLES}><ReceptionistSchedulePage /></RequireRole>} />
              <Route path="/staff/receptionist/checkin" element={<RequireRole roles={STAFF_ROLES}><ReceptionistCheckInPage /></RequireRole>} />
              <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer brand="Clinic Portal App 6658" columns={[{ title: 'Explore', links: [{ label: 'Home', to: '/' }] }]} />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
