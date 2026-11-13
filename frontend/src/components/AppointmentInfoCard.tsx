import { Card, CardBody, CardTitle, CardMeta, Badge, Icon } from '../components/ui';
import type { Appointment } from '../types';

interface AppointmentInfoCardProps {
  appointment: Appointment;
}

function formatScheduledAt(value: string): string {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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

function statusLabel(status: string): string {
  switch (status) {
    case 'requested':
      return 'Requested';
    case 'confirmed':
      return 'Confirmed';
    case 'checked_in':
      return 'Checked In';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

function personLabel(value: unknown): string {
  if (value == null) return 'Unassigned';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const first = typeof obj.first_name === 'string' ? obj.first_name : '';
    const last = typeof obj.last_name === 'string' ? obj.last_name : '';
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (typeof obj.username === 'string') return obj.username;
    if (typeof obj.email === 'string') return obj.email;
    return 'Unknown';
  }
  return String(value);
}

export default function AppointmentInfoCard({ appointment }: AppointmentInfoCardProps) {
  if (!appointment) {
    return null;
  }

  const doctorName = personLabel((appointment as unknown as Record<string, unknown>).doctor);
  const patientName = personLabel((appointment as unknown as Record<string, unknown>).patient);

  return (
    <Card className="ds-card">
      <CardBody>
        <div className="ds-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <CardTitle>{formatScheduledAt(appointment.scheduled_at)}</CardTitle>
            <CardMeta>Riverbend Family Clinic appointment</CardMeta>
          </div>
          <Badge tone={statusTone(appointment.status)}>{statusLabel(appointment.status)}</Badge>
        </div>

        <div className="ds-stack" style={{ marginTop: 'var(--space-md)', gap: 'var(--space-sm)' }}>
          <div className="ds-cluster" style={{ gap: 'var(--space-xs)' }}>
            <Icon name="users" size={16} />
            <span>Doctor: {doctorName}</span>
          </div>
          <div className="ds-cluster" style={{ gap: 'var(--space-xs)' }}>
            <Icon name="user" size={16} />
            <span>Patient: {patientName}</span>
          </div>
          {appointment.reason ? (
            <div className="ds-cluster" style={{ gap: 'var(--space-xs)', alignItems: 'flex-start' }}>
              <Icon name="info" size={16} />
              <span>{appointment.reason}</span>
            </div>
          ) : (
            <div className="ds-muted">No reason provided</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}