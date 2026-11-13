import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReceptionistScheduleHeader from '../components/ReceptionistScheduleHeader';
import ReceptionistScheduleContent from '../components/ReceptionistScheduleContent';
import { getAppointmentList, createAppointment, getUserList } from '../api';
import type { Appointment, User } from '../types';
import type { AppointmentFormValues } from '../components/AppointmentForm';

export default function ReceptionistSchedulePage() {
  useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [appts, users] = await Promise.all([
        getAppointmentList(),
        getUserList(),
      ]);
      setAppointments(Array.isArray(appts) ? appts : []);
      const allUsers = Array.isArray(users) ? users : [];
      setDoctors(allUsers.filter((u: User) => u.role === 'doctor'));
      setPatients(allUsers.filter((u: User) => u.role === 'patient'));
    } catch (err) {
      setAppointments([]);
      setDoctors([]);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectSlot = (isoDateTime: string) => {
    // Slot selection is handled by the AppointmentForm within the content component;
    // here we simply make sure the data is fresh for the chosen day.
    void isoDateTime;
  };

  const handleSubmit = async (data: AppointmentFormValues) => {
    try {
      const payload: Record<string, unknown> = { ...data };
      await createAppointment(payload);
      await loadData();
    } catch (err) {
      // errors are surfaced inside ReceptionistScheduleContent's form
      throw err;
    }
  };

  const filteredAppointments = selectedDoctor
    ? appointments.filter((a) => String(a.doctor) === selectedDoctor)
    : appointments;

  return (
    <div className="ds-stack-lg">
      <ReceptionistScheduleHeader onNewAppointment={() => handleSelectSlot(new Date().toISOString())} />
      <ReceptionistScheduleContent
        appointments={filteredAppointments}
        doctors={doctors}
        patients={patients}
        selectedDoctor={selectedDoctor}
        onDoctorChange={setSelectedDoctor}
        onSelectSlot={handleSelectSlot}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
