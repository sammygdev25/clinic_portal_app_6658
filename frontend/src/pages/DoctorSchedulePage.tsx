import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAppointmentList } from '../api';
import type { Appointment } from '../types';
import DoctorScheduleHeader from '../components/DoctorScheduleHeader';
import DoctorScheduleContent from '../components/DoctorScheduleContent';

export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentList();
        if (!mounted) return;
        const mine = user
          ? (Array.isArray(data) ? data : []).filter((a: Appointment) => String(a.doctor) === String(user.id))
          : data;
        setAppointments(mine);
      } catch (err) {
        console.error('Failed to load appointments', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="ds-stack-lg">
      <DoctorScheduleHeader doctorName={user?.username} />
      <DoctorScheduleContent appointments={appointments} loading={loading} />
    </div>
  );
}