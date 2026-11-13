import { Section, Card, CardBody, CardTitle, CardMeta, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface DoctorDashboardRecentProps {
  appointments: Appointment[];
}

export default function DoctorDashboardRecent({ appointments }: DoctorDashboardRecentProps) {
  const recent = [...(appointments || [])]
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 6);

  return (
    <Section eyebrow="Recent activity" title="Recent Appointments">
      {recent.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No recent appointments"
          text="Appointments you've seen recently will appear here once patients start booking with you."
        />
      ) : (
        <div className="ds-stack">
          {(Array.isArray(recent) ? recent : []).map((appt) => (
            <Card key={appt.id} to={`/staff/doctor/appointments/${appt.id}`}>
              <CardBody>
                <div className="ds-between">
                  <CardTitle>
                    {new Date(appt.scheduled_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </CardTitle>
                  <span className="ds-badge">
                    <Icon name="clock" size={14} />
                    {appt.status}
                  </span>
                </div>
                <CardMeta>
                  {appt.reason ? appt.reason : 'No reason provided for this visit.'}
                </CardMeta>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}