import type { Appointment } from '../types';
import { Card, CardBody, CardTitle, Badge, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';

interface TodayScheduleCardProps {
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

export default function TodayScheduleCard({ appointments }: TodayScheduleCardProps) {
  const todayStr = new Date().toDateString();
  const todays = (Array.isArray(appointments) ? appointments : [])
    .filter((a) => new Date(a.scheduled_at).toDateString() === todayStr)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  return (
    <Card>
      <CardBody>
        <CardTitle>Today's Schedule</CardTitle>
        {todays.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No appointments today"
            text="You have a clear schedule for today at Riverbend Family Clinic."
          />
        ) : (
          <div className="ds-stack">
            {todays.map((appt) => (
              <div key={appt.id} className="ds-between" style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                <div className="ds-cluster" style={{ alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <Icon name="clock" size={18} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{formatTime(appt.scheduled_at)}</div>
                    {appt.reason && <div className="ds-small ds-muted">{appt.reason}</div>}
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