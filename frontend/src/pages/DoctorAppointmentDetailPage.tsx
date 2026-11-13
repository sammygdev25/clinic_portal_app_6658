import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getAppointment,
  getPatientProfileList,
  getDoctorProfileList,
  getVisitNoteList,
  updateAppointment,
} from '../api';
import type { Appointment, PatientProfile, DoctorProfile, VisitNote } from '../types';
import { LoadingBlock, Alert } from '../components/ui';
import DoctorAppointmentDetailMedia from '../components/DoctorAppointmentDetailMedia';
import DoctorAppointmentDetailFacts from '../components/DoctorAppointmentDetailFacts';
import DoctorAppointmentDetailRelated from '../components/DoctorAppointmentDetailRelated';
import PatientInfoCard from '../components/PatientInfoCard';
import VisitNoteForm from '../components/VisitNoteForm';
import PrescriptionForm from '../components/PrescriptionForm';
import PatientVisitHistoryList from '../components/PatientVisitHistoryList';

export default function DoctorAppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  useAuth();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [relatedDoctors, setRelatedDoctors] = useState<DoctorProfile[]>([]);
  const [visitHistory, setVisitHistory] = useState<VisitNote[]>([]);
  const [existingNote, setExistingNote] = useState<VisitNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const appt = await getAppointment(Number(id));
      setAppointment(appt);

      const [patientProfiles, doctorProfiles, allDoctors] = await Promise.all([
        getPatientProfileList({ user: appt.patient }),
        getDoctorProfileList({ user: appt.doctor }),
        getDoctorProfileList(),
      ]);
      const patientList = Array.isArray(patientProfiles) ? patientProfiles : [];
      const doctorList = Array.isArray(doctorProfiles) ? doctorProfiles : [];
      const allDoctorList = Array.isArray(allDoctors) ? allDoctors : [];

      setPatientProfile(patientList[0] || null);
      setDoctorProfile(doctorList[0] || null);
      setRelatedDoctors(
        allDoctorList.filter((d) => d.id !== (doctorList[0] ? doctorList[0].id : null)).slice(0, 6)
      );

      const [history, notes] = await Promise.all([
        getVisitNoteList({ patient: appt.patient }),
        getVisitNoteList({ appointment: appt.id }),
      ]);
      const historyList = Array.isArray(history) ? history : [];
      const noteList = Array.isArray(notes) ? notes : [];

      setVisitHistory(historyList.filter((n) => n.appointment !== appt.id));
      setExistingNote(noteList[0] || null);
    } catch (err) {
      console.error(err);
      setError('Unable to load this appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleStatusChange = async (status: string) => {
    if (!appointment) return;
    try {
      const updated = await updateAppointment(appointment.id, { status });
      setAppointment(updated);
    } catch (err) {
      console.error(err);
      setError('Could not update the appointment status.');
    }
  };

  const handleNoteSaved = (note: VisitNote) => {
    setExistingNote(note);
  };

  const handlePrescriptionSaved = () => {
    // Prescription saved; list is shown elsewhere in the patient's own records.
  };

  if (loading) {
    return <LoadingBlock label="Loading appointment details..." />;
  }

  if (error) {
    return <Alert tone="danger">{error}</Alert>;
  }

  if (!appointment) {
    return <Alert tone="danger">Appointment not found.</Alert>;
  }

  const patientName = patientProfile?.phone
    ? `Patient #${appointment.patient}`
    : `Patient #${appointment.patient}`;

  return (
    <div className="ds-stack-lg">
      <DoctorAppointmentDetailMedia
        appointment={appointment}
        patientName={patientName}
        onStatusChange={handleStatusChange}
      />

      <DoctorAppointmentDetailFacts appointment={appointment} doctorProfile={doctorProfile} />

      {patientProfile && (
        <div className="ds-container">
          <PatientInfoCard patient={patientProfile} />
        </div>
      )}

      <div className="ds-container ds-grid ds-grid-2">
        <VisitNoteForm
          appointmentId={String(appointment.id)}
          existingNote={existingNote}
          onSave={handleNoteSaved}
        />
        <PrescriptionForm
          appointmentId={String(appointment.id)}
          onSave={handlePrescriptionSaved}
        />
      </div>

      <div className="ds-container">
        <PatientVisitHistoryList visits={visitHistory} />
      </div>

      <DoctorAppointmentDetailRelated doctors={relatedDoctors} />
    </div>
  );
}
