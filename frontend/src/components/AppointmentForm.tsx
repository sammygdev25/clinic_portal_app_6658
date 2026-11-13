import { useState, FormEvent } from 'react';
import { Button } from '../components/ui';
import type { User } from '../types';

export interface AppointmentFormValues {
  patient: number;
  doctor: number;
  scheduled_at: string;
  reason: string;
}

interface AppointmentFormProps {
  doctors: User[];
  patients: User[];
  onSubmit: (values: AppointmentFormValues) => void | Promise<void>;
}

export default function AppointmentForm({ doctors, patients, onSubmit }: AppointmentFormProps) {
  const [patientId, setPatientId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const doctorList = Array.isArray(doctors) ? doctors : [];
  const patientList = Array.isArray(patients) ? patients : [];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!patientId || !doctorId || !scheduledAt) {
      setError('Please select a patient, a doctor and a date/time.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        patient: Number(patientId),
        doctor: Number(doctorId),
        scheduled_at: new Date(scheduledAt).toISOString(),
        reason,
      });
      setPatientId('');
      setDoctorId('');
      setScheduledAt('');
      setReason('');
    } catch (err) {
      setError('Could not create the appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <div className="ds-alert ds-alert-danger">{error}</div>}

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="appointment-patient">Patient</label>
          <select
            id="appointment-patient"
            className="input"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">Select a patient</option>
            {patientList.map((p) => (
              <option key={p.id} value={p.id}>
                {`Patient #${p.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="appointment-doctor">Doctor</label>
          <select
            id="appointment-doctor"
            className="input"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">Select a doctor</option>
            {doctorList.map((d) => (
              <option key={d.id} value={d.id}>
                {`Dr. #${d.id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="appointment-time">Date &amp; time</label>
        <input
          id="appointment-time"
          type="datetime-local"
          className="input"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="appointment-reason">Reason for visit</label>
        <textarea
          id="appointment-reason"
          className="input"
          rows={3}
          placeholder="e.g. Annual physical, follow-up on lab results, persistent cough..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <span className="ds-help">Optional, but helps Riverbend staff prepare for the visit.</span>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Scheduling...' : 'Schedule appointment'}
        </Button>
      </div>
    </form>
  );
}
