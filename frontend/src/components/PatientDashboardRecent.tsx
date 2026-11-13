import { Link } from 'react-router-dom';
import { Section, EmptyState, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface PatientDashboardRecentProps {
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

function formatWhen(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PatientDashboardRecent({ appointments }: PatientDashboardRecentProps) {
  const recent = [...(appointments || [])]
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 6);

  return (
    <Section eyebrow="Recent activity" title="Your recent visits" tight>
      {recent.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No visit history yet"
          text="Once you book an appointment at Riverbend Family Clinic, it will show up here."
          action={
            <Link to="/patient/appointments" className="btn btn-primary">
              Book an appointment
            </Link>
          }
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(recent) ? recent : []).map((appt) => (
                <tr key={appt.id}>
                  <td>{formatWhen(appt.scheduled_at)}</td>
                  <td>{appt.reason || 'General visit'}</td>
                  <td>
                    <Badge tone={statusTone(appt.status)}>{appt.status.replace('_', ' ')}</Badge>
                  </td>
                  <td>
                    <Link to="/patient/appointments" className="ds-cluster">
                      <Icon name="arrow-right" size={16} title="View appointment" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}