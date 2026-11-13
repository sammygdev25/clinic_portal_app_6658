import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getAppointmentList,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getUserList,
  getPatientProfileList,
} from '../api';
import type { Appointment, User, PatientProfile } from '../types';
import PatientAppointmentsHeader from '../components/PatientAppointmentsHeader';
import PatientAppointmentsContent from '../components/PatientAppointmentsContent';
import PatientAppointmentsDetails from '../components/PatientAppointmentsDetails';
import AppointmentBookingForm from '../components/AppointmentBookingForm';
import RescheduleModal from '../components/RescheduleModal';
import { Section, Alert, LoadingBlock } from '../components/ui';

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [bookMessage, setBookMessage] = useState<string>('');
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [appts, docs, profiles] = await Promise.all([
        getAppointmentList(),
        getUserList({ role: 'doctor' }),
        getPatientProfileList(),
      ]);
      const apptArr = Array.isArray(appts) ? appts : [];
      const myAppts = user
        ? apptArr.filter((a: Appointment) => a.patient === user.id)
        : apptArr;
      setAppointments(myAppts);
      setDoctors(Array.isArray(docs) ? docs : []);
      const profileArr = Array.isArray(profiles) ? profiles : [];
      const mine = user
        ? profileArr.find((p: PatientProfile) => p.user === user.id)
        : null;
      setPatientProfile(mine || null);
    } catch (err) {
      setError('Unable to load your appointments right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBook = async (data: { doctor: number; scheduled_at: string; reason: string }) => {
    setBookMessage('');
    try {
      await createAppointment({
        doctor: data.doctor,
        scheduled_at: data.scheduled_at,
        reason: data.reason,
        status: 'requested',
      });
      setBookMessage('Appointment requested');
      await loadData();
      setTimeout(() => setBookMessage(''), 2000);
    } catch (err) {
      setError('Could not book this appointment. Please check the details and try again.');
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleTarget(appointment);
  };

  const handleConfirmReschedule = async (appointmentId: number, newScheduledAt: string) => {
    try {
      await updateAppointment(appointmentId, { scheduled_at: newScheduledAt, status: 'requested' });
      setRescheduleTarget(null);
      await loadData();
    } catch (err) {
      setError('Could not reschedule this appointment. Please try again.');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await updateAppointment(id, { status: 'cancelled' });
      await loadData();
    } catch (err) {
      try {
        await deleteAppointment(id);
        await loadData();
      } catch (err2) {
        setError('Could not cancel this appointment. Please try again.');
      }
    }
  };

  const userName = user ? (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email) : '';

  return (
    <div className="ds-stack-lg">
      <PatientAppointmentsHeader userName={userName} />

      {error && (
        <Section tight narrow>
          <Alert tone="danger">{error}</Alert>
        </Section>
      )}

      {bookMessage && (
        <Section tight narrow>
          <Alert tone="success">{bookMessage}</Alert>
        </Section>
      )}

      <Section
        eyebrow="Book a visit"
        title="Request a new appointment"
        subtitle="Choose a doctor and a preferred time; our team will confirm shortly."
        narrow
      >
        <AppointmentBookingForm doctors={doctors} onBook={handleBook} />
      </Section>

      {loading ? (
        <LoadingBlock label="Loading your appointments..." />
      ) : (
        <PatientAppointmentsContent
          appointments={appointments}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
        />
      )}

      <PatientAppointmentsDetails
        patientName={userName}
        email={user?.email}
        phone={patientProfile?.phone}
        insuranceProvider={patientProfile?.insurance_provider}
        insurancePolicyNumber={patientProfile?.insurance_policy_number}
        dateOfBirth={patientProfile?.date_of_birth ?? undefined}
      />

      <RescheduleModal
        appointment={rescheduleTarget}
        isOpen={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  );
}
