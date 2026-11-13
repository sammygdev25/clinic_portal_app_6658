import { Link } from 'react-router-dom';
import type { Appointment } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';

interface UpcomingAppointmentsListProps {
  appointments: Appointment[];
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

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function UpcomingAppointmentsList({ appointments }: UpcomingAppointmentsListProps) {
  const list = Array.isArray(appointments) ? appointments : [];
  const upcoming = list
    .filter((a) => a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No upcoming appointments"
        text="Book a visit with one of our doctors at Riverbend Family Clinic to see it listed here."
        action={
          <Link to="/patient/appointments" className="btn btn-primary">
            Book an appointment
          </Link>
        }
      />
    );
  }

  return (
    <div className="ds-stack" style={{ gap: 'var(--space-sm)' }}>
      {upcoming.map((appt) => {
        const doctorLabel =
          (appt as any).doctor_name ||
          (appt as any).doctor_full_name ||
          (typeof appt.doctor === 'object' && appt.doctor
            ? `Dr. ${(appt.doctor as any).first_name || ''} ${(appt.doctor as any).last_name || ''}`.trim()
            : `Doctor #${appt.doctor}`);

        return (
          <Card key={appt.id}>
            <CardBody>
              <div className="ds-between">
                <div>
                  <CardTitle>{doctorLabel}</CardTitle>
                  <CardMeta>
                    <Icon name="calendar" size={14} /> {formatDateTime(appt.scheduled_at)}
                  </CardMeta>
                  {appt.reason && <CardMeta>{appt.reason}</CardMeta>}
                </div>
                <Badge tone={statusTone(appt.status)}>{appt.status.replace('_', ' ')}</Badge>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}