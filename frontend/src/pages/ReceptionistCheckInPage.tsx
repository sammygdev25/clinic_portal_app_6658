import { useEffect, useState, useCallback } from 'react';
import { getAppointmentList, updateAppointment } from '../api';
import type { Appointment } from '../types';
import ReceptionistCheckInHeader from '../components/ReceptionistCheckInHeader';
import ReceptionistCheckInContent from '../components/ReceptionistCheckInContent';
import { Alert } from '../components/ui';

export default function ReceptionistCheckInPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAppointmentList();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load today\'s appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCheckIn = useCallback(async (id: number) => {
    try {
      await updateAppointment(id, { status: 'checked_in' });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: 'checked_in' } : appt))
      );
    } catch (err) {
      setError('Could not check in this patient. Please try again.');
    }
  }, []);

  const todayStr = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (appt) => new Date(appt.scheduled_at).toDateString() === todayStr
  );
  const checkedInCount = todaysAppointments.filter((a) => a.status === 'checked_in').length;
  const waitingCount = todaysAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'requested'
  ).length;

  return (
    <div className="ds-stack-lg">
      <ReceptionistCheckInHeader checkedInCount={checkedInCount} waitingCount={waitingCount} />
      {error && <Alert tone="danger">{error}</Alert>}
      <ReceptionistCheckInContent
        appointments={todaysAppointments}
        onCheckIn={handleCheckIn}
        loading={loading}
      />
    </div>
  );
}