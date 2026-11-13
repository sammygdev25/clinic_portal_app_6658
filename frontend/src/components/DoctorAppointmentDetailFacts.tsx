import React from 'react';
import { Section, Grid, Badge } from '../components/ui';
import Icon from '../components/icons';
import type { Appointment, DoctorProfile } from '../types';

interface DoctorAppointmentDetailFactsProps {
  appointment: Appointment | null;
  doctorProfile?: DoctorProfile | null;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'primary';
    case 'checked_in':
      return 'soft';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

export default function DoctorAppointmentDetailFacts({ appointment, doctorProfile }: DoctorAppointmentDetailFactsProps) {
  if (!appointment) {
    return null;
  }

  const scheduledLabel = appointment.scheduled_at
    ? new Date(appointment.scheduled_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Not scheduled';

  return (
    <Section eyebrow="Appointment" title="Visit details">
      <Grid cols={2}>
        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="calendar" size={18} />
            <span className="ds-label">Scheduled for</span>
          </div>
          <p>{scheduledLabel}</p>
        </div>
        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="info" size={18} />
            <span className="ds-label">Status</span>
          </div>
          <Badge tone={statusTone(appointment.status)}>{appointment.status.replace('_', ' ')}</Badge>
        </div>
        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="book" size={18} />
            <span className="ds-label">Reason for visit</span>
          </div>
          <p className="ds-muted">{appointment.reason || 'No reason provided by patient.'}</p>
        </div>
        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="award" size={18} />
            <span className="ds-label">Specialty</span>
          </div>
          <p>{doctorProfile?.specialty || 'General Practice'}</p>
        </div>
      </Grid>
      {doctorProfile?.bio && (
        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="quote" size={18} />
            <span className="ds-label">About the doctor</span>
          </div>
          <p className="ds-muted">{doctorProfile.bio}</p>
        </div>
      )}
    </Section>
  );
}