import { Card, CardBody, CardTitle, CardMeta, Badge, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface TodayAppointmentsCardProps {
  appointments: Appointment[];
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'primary';
    case 'checked_in':
      return 'success';
    case 'completed':
      return 'soft';
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

export default function TodayAppointmentsCard({ appointments }: TodayAppointmentsCardProps) {
  const list = Array.isArray(appointments) ? appointments : [];
  const today = new Date();
  const todays = list.filter((appt) => {
    const d = new Date(appt.scheduled_at);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  return (
    <Card>
      <CardBody>
        <CardTitle>Today's Appointments</CardTitle>
        {todays.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No appointments today"
            text="Riverbend Family Clinic has no appointments scheduled for today yet."
          />
        ) : (
          <div className="ds-stack" style={{ marginTop: 'var(--space-md)' }}>
            {todays.map((appt) => (
              <div key={appt.id} className="ds-between" style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                <div className="ds-cluster" style={{ gap: 'var(--space-sm)' }}>
                  <Icon name="clock" size={18} />
                  <div>
                    <div>{formatTime(appt.scheduled_at)}</div>
                    <CardMeta>{appt.reason || 'General visit'}</CardMeta>
                  </div>
                </div>
                <Badge tone={statusTone(appt.status)}>{statusLabel(appt.status)}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}