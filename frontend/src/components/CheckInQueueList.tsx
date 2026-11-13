import type { Appointment } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, EmptyState, Icon } from '../components/ui';

interface CheckInQueueListProps {
  appointments: Appointment[];
  onCheckIn: (id: number) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'requested':
      return 'soft';
    case 'confirmed':
      return 'primary';
    case 'checked_in':
      return 'success';
    case 'completed':
      return 'neutral';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function patientLabel(appointment: Appointment): string {
  const anyApt = appointment as any;
  if (anyApt.patient_name) return anyApt.patient_name;
  if (anyApt.patient_username) return anyApt.patient_username;
  if (typeof appointment.patient === 'object' && appointment.patient) {
    const p = appointment.patient as any;
    return p.username || p.name || `Patient #${p.id}`;
  }
  return `Patient #${appointment.patient}`;
}

function doctorLabel(appointment: Appointment): string {
  const anyApt = appointment as any;
  if (anyApt.doctor_name) return anyApt.doctor_name;
  if (anyApt.doctor_username) return anyApt.doctor_username;
  if (typeof appointment.doctor === 'object' && appointment.doctor) {
    const d = appointment.doctor as any;
    return d.username || d.name || `Dr. #${d.id}`;
  }
  return `Dr. #${appointment.doctor}`;
}

export default function CheckInQueueList({ appointments, onCheckIn }: CheckInQueueListProps) {
  const sorted = [...(Array.isArray(appointments) ? appointments : [])].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No patients in the check-in queue"
        text="Patients scheduled for today will appear here as they arrive at Riverbend Family Clinic."
      />
    );
  }

  return (
    <div className="ds-stack" data-gap="sm">
      {sorted.map((appointment) => {
        const canCheckIn = appointment.status === 'requested' || appointment.status === 'confirmed';
        return (
          <Card key={appointment.id}>
            <CardBody>
              <div className="ds-between">
                <div>
                  <CardTitle>{patientLabel(appointment)}</CardTitle>
                  <CardMeta>
                    <Icon name="clock" size={14} /> {formatTime(appointment.scheduled_at)} with {doctorLabel(appointment)}
                  </CardMeta>
                  {appointment.reason && (
                    <CardMeta>
                      <Icon name="info" size={14} /> {appointment.reason}
                    </CardMeta>
                  )}
                </div>
                <Badge tone={statusTone(appointment.status)}>
                  {appointment.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                variant={canCheckIn ? 'primary' : 'secondary'}
                size="md"
                disabled={!canCheckIn}
                onClick={() => canCheckIn && onCheckIn(appointment.id)}
              >
                <Icon name="check" size={16} />
                {appointment.status === 'checked_in'
                  ? 'Checked In'
                  : appointment.status === 'completed'
                  ? 'Completed'
                  : appointment.status === 'cancelled'
                  ? 'Cancelled'
                  : 'Check In'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}