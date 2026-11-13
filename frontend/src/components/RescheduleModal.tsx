import React, { useState } from 'react';
import type { Appointment } from '../types';
import api from '../api';
import { Button } from './ui';
import { Icon } from './icons';

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: number, newScheduledAt: string) => void;
}

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function RescheduleModal({ appointment, isOpen, onClose, onConfirm }: RescheduleModalProps) {
  const [newDateTime, setNewDateTime] = useState<string>(
    appointment ? toLocalInputValue(appointment.scheduled_at) : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !appointment) {
    return null;
  }

  const handleOpenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDateTime(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateTime) {
      setError('Please choose a new date and time.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const isoValue = new Date(newDateTime).toISOString();
      await api.patch(`/appointments/${appointment.id}/`, { scheduled_at: isoValue });
      onConfirm(appointment.id, isoValue);
      onClose();
    } catch (err) {
      setError('Could not reschedule this appointment. Please try a different time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-modal-overlay" onClick={onClose}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ds-between" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 className="ds-card-title" style={{ margin: 0 }}>Reschedule appointment</h3>
          <button
            type="button"
            className="ds-btn-ghost"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <p className="ds-muted" style={{ marginBottom: 'var(--space-md)' }}>
          Currently scheduled for{' '}
          {new Date(appointment.scheduled_at).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}{' '}
          at Riverbend Family Clinic.
        </p>

        <form onSubmit={handleSubmit} className="ds-form">
          <div className="ds-field">
            <label className="ds-label" htmlFor="reschedule-datetime">
              New date &amp; time
            </label>
            <input
              id="reschedule-datetime"
              type="datetime-local"
              className="input"
              value={newDateTime}
              onChange={handleOpenChange}
              required
            />
            <span className="ds-help">
              Pick a time that works for you. Your doctor's office will confirm shortly after.
            </span>
          </div>

          {error && (
            <div className="ds-alert" style={{ color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <div className="ds-form-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Confirm new time'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}