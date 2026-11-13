import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAppointmentList } from '../api';
import type { Appointment } from '../types';
import ReceptionistDashboardHeader from '../components/ReceptionistDashboardHeader';
import ReceptionistDashboardStats from '../components/ReceptionistDashboardStats';
import ReceptionistDashboardRecent from '../components/ReceptionistDashboardRecent';
import ReceptionistDashboardActions from '../components/ReceptionistDashboardActions';
import { LoadingBlock } from '../components/ui';

export default function ReceptionistDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentList();
        if (active) setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setAppointments([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingBlock label="Loading dashboard..." />;
  }

  const userName =
    typeof user?.first_name === 'string'
      ? user.first_name
      : typeof user?.username === 'string'
        ? user.username
        : 'Receptionist';

  return (
    <div className="ds-stack-lg">
      <ReceptionistDashboardHeader
        userName={userName}
        onPrimaryAction={() => navigate('/staff/receptionist/checkin')}
      />
      <ReceptionistDashboardStats appointments={appointments} />
      <ReceptionistDashboardRecent appointments={appointments} />
      <ReceptionistDashboardActions />
    </div>
  );
}
