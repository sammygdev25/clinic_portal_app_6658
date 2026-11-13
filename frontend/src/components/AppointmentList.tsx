import type { Appointment } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, EmptyState, Stack } from '../components/ui';
import { Icon } from '../components/icons';

interface AppointmentListProps {
  appointments: Appointment[];
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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

function getDoctorLabel(appointment: Appointment): string {
  const anyApt = appointment as any;
  if (anyApt.doctor_name) return anyApt.doctor_name;
  if (anyApt.doctor_detail) {
    const d = anyApt.doctor_detail;
    return d.first_name || d.last_name ? `Dr. ${d.first_name} ${d.last_name}`.trim() : d.username || 'Doctor';
  }
  if (typeof anyApt.doctor === 'object' && anyApt.doctor) {
    const d = anyApt.doctor;
    return d.first_name || d.last_name ? `Dr. ${d.first_name} ${d.last_name}`.trim() : d.username || 'Doctor';
  }
  return 'Your doctor';
}

export default function AppointmentList({ appointments, onReschedule, onCancel }: AppointmentListProps) {
  if (!Array.isArray(appointments) || appointments.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No appointments scheduled"
        text="Book a visit at Riverbend Family Clinic to see it listed here."
      />
    );
  }

  return (
    <Stack gap="sm">
      {appointments.map((appointment) => {
        const canModify = appointment.status === 'requested' || appointment.status === 'confirmed';
        return (
          <Card key={appointment.id}>
            <CardBody>
              <Stack gap="xs">
                <div className="ds-between">
                  <CardTitle>{getDoctorLabel(appointment)}</CardTitle>
                  <Badge tone={statusTone(appointment.status)}>{statusLabel(appointment.status)}</Badge>
                </div>
                <CardMeta>
                  <Icon name="clock" size={16} /> {formatDateTime(appointment.scheduled_at)}
                </CardMeta>
                {appointment.reason ? (
                  <p className="ds-muted ds-small">{appointment.reason}</p>
                ) : null}
              </Stack>
            </CardBody>
            {canModify ? (
              <CardFooter>
                <Button variant="secondary" onClick={() => onReschedule(appointment)}>
                  <Icon name="calendar" size={16} /> Reschedule
                </Button>
                <Button variant="danger" onClick={() => onCancel(appointment)}>
                  <Icon name="close" size={16} /> Cancel
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        );
      })}
    </Stack>
  );
}