import { Section, Split, Media, Badge, Button, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface DoctorAppointmentDetailMediaProps {
  appointment: Appointment | null;
  patientName?: string;
  onStatusChange?: (status: string) => void;
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  requested: 'neutral',
  confirmed: 'primary',
  checked_in: 'soft',
  completed: 'success',
  cancelled: 'danger',
};

const NEXT_ACTION: Record<string, { label: string; next: string } | null> = {
  requested: { label: 'Confirm Appointment', next: 'confirmed' },
  confirmed: { label: 'Mark Checked In', next: 'checked_in' },
  checked_in: { label: 'Mark Completed', next: 'completed' },
  completed: null,
  cancelled: null,
};

export default function DoctorAppointmentDetailMedia({
  appointment,
  patientName,
  onStatusChange,
}: DoctorAppointmentDetailMediaProps) {
  if (!appointment) {
    return (
      <Section tight>
        <Split>
          <Media alt="Appointment" ratio="wide" />
          <div className="ds-stack">
            <span className="ds-eyebrow">Riverbend Family Clinic</span>
            <h1 className="ds-card-title">Loading appointment...</h1>
          </div>
        </Split>
      </Section>
    );
  }

  const scheduledDate = new Date(appointment.scheduled_at);
  const dateLabel = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const timeLabel = scheduledDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const action = NEXT_ACTION[appointment.status];

  return (
    <Section tight>
      <Split>
        <Media
          alt={`Appointment with ${patientName || 'patient'}`}
          ratio="wide"
          badge={appointment.status.replace('_', ' ')}
        />
        <div className="ds-stack">
          <span className="ds-eyebrow">Riverbend Family Clinic Visit</span>
          <h1 className="ds-card-title">{patientName || 'Patient'}</h1>
          <CardMeta>
            <Icon name="calendar" size={16} /> {dateLabel} at {timeLabel}
          </CardMeta>
          {appointment.reason && (
            <p className="ds-muted">
              <Icon name="info" size={14} /> {appointment.reason}
            </p>
          )}
          <Badge tone={STATUS_TONE[appointment.status] || 'neutral'}>
            {appointment.status.replace('_', ' ')}
          </Badge>
          {action && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => onStatusChange && onStatusChange(action.next)}
            >
              <Icon name="check" size={16} /> {action.label}
            </Button>
          )}
        </div>
      </Split>
    </Section>
  );
}