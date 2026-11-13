import { Icon } from '../components/icons';
import { Badge, Card, CardBody, CardMeta, CardTitle, EmptyState } from '../components/ui';
import { formatDate } from '../utils';
import type { Appointment } from '../types';

interface DoctorAppointmentListProps {
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

function patientLabel(appointment: Appointment): string {
  const anyAppt = appointment as unknown as Record<string, unknown>;
  const name = anyAppt.patient_name as string | undefined;
  if (name) return name;
  return `Patient #${appointment.patient}`;
}

export default function DoctorAppointmentList({ appointments }: DoctorAppointmentListProps) {
  const list = Array.isArray(appointments) ? appointments : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No appointments on your schedule"
        text="Appointments booked by patients at Riverbend Family Clinic will appear here."
      />
    );
  }

  const sorted = [...list].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  return (
    <div className="ds-stack" style={{ gap: 'var(--space-sm)' }}>
      {sorted.map((appointment) => (
        <Card key={appointment.id}>
          <CardBody>
            <div className="ds-between">
              <div>
                <CardTitle>{patientLabel(appointment)}</CardTitle>
                <CardMeta>
                  <Icon name="clock" size={14} /> {formatDate(appointment.scheduled_at)}
                </CardMeta>
              </div>
              <Badge tone={statusTone(appointment.status)}>
                {statusLabel(appointment.status)}
              </Badge>
            </div>
            {appointment.reason ? (
              <p className="ds-muted ds-small" style={{ marginTop: 'var(--space-sm)' }}>
                <Icon name="info" size={14} /> {appointment.reason}
              </p>
            ) : null}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}