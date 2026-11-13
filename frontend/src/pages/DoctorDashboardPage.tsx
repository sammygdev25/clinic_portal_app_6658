import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAppointmentList } from '../api';
import type { Appointment } from '../types';
import DoctorDashboardHeader from '../components/DoctorDashboardHeader';
import DoctorDashboardStats from '../components/DoctorDashboardStats';
import DoctorDashboardRecent from '../components/DoctorDashboardRecent';
import DoctorDashboardActions from '../components/DoctorDashboardActions';
import { LoadingBlock } from '../components/ui';

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const all = await getAppointmentList();
        const list = Array.isArray(all) ? all : [];
        const mine = user
          ? list.filter((a) => String(a.doctor) === String(user.id))
          : list;
        if (active) setAppointments(mine);
      } catch {
        if (active) setAppointments([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [user]);

  const doctorName = user?.username || user?.email || 'Doctor';

  if (loading) {
    return <LoadingBlock label="Loading your dashboard..." />;
  }

  return (
    <div className="ds-stack-lg">
      <DoctorDashboardHeader
        doctorName={doctorName}
        onViewSchedule={() => navigate('/staff/doctor/schedule')}
      />
      <DoctorDashboardStats appointments={appointments} />
      <DoctorDashboardRecent appointments={appointments} />
      <DoctorDashboardActions section="Quick actions" page="DoctorDashboardPage" />
    </div>
  );
}