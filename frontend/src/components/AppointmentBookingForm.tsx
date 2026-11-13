import { useState, FormEvent } from 'react';
import { Button } from '../components/ui';
import type { User } from '../types';

interface AppointmentBookingFormProps {
  doctors: User[];
  onBook: (data: { doctor: number; scheduled_at: string; reason: string }) => void | Promise<void>;
}

function doctorLabel(doctor: User): string {
  const first = (doctor as any).first_name || '';
  const last = (doctor as any).last_name || '';
  const specialty = (doctor as any).doctor_profile?.specialty;
  const name = [first, last].filter(Boolean).join(' ') || `Doctor #${doctor.id}`;
  return specialty ? `Dr. ${name} — ${specialty}` : `Dr. ${name}`;
}

export default function AppointmentBookingForm({ doctors, onBook }: AppointmentBookingFormProps) {
  const [doctorId, setDoctorId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!doctorId) {
      setError('Please select a doctor.');
      return;
    }
    if (!date || !time) {
      setError('Please choose a date and time for your visit.');
      return;
    }

    const scheduledAt = new Date(`${date}T${time}:00`);
    if (Number.isNaN(scheduledAt.getTime())) {
      setError('That date and time is not valid.');
      return;
    }
    if (scheduledAt.getTime() < Date.now()) {
      setError('Please pick a date and time in the future.');
      return;
    }

    setSubmitting(true);
    try {
      await onBook({
        doctor: Number(doctorId),
        scheduled_at: scheduledAt.toISOString(),
        reason: reason.trim(),
      });
      setSuccess('Your appointment request has been sent to Riverbend Family Clinic.');
      setDoctorId('');
      setDate('');
      setTime('');
      setReason('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not book this appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <div className="ds-alert" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>{error}</div>}
      {success && <div className="ds-alert" style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>{success}</div>}

      <div className="ds-field">
        <label className="ds-label" htmlFor="booking-doctor">Doctor</label>
        <select
          id="booking-doctor"
          className="input"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        >
          <option value="">Select a doctor</option>
          {(Array.isArray(doctors) ? doctors : []).map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctorLabel(doctor)}
            </option>
          ))}
        </select>
        {doctors.length === 0 && (
          <p className="ds-help">No doctors are available to book right now.</p>
        )}
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="booking-date">Date</label>
          <input
            id="booking-date"
            type="date"
            className="input"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="booking-time">Time</label>
          <input
            id="booking-time"
            type="time"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="booking-reason">Reason for visit</label>
        <textarea
          id="booking-reason"
          className="input"
          rows={3}
          placeholder="e.g. Annual physical, follow-up on lab results, persistent cough..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Requesting...' : 'Request Appointment'}
        </Button>
      </div>
    </form>
  );
}
