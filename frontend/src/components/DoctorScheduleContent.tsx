import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, EmptyState, SkeletonCards } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface DoctorScheduleContentProps {
  appointments: Appointment[];
  loading?: boolean;
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

function formatSlot(scheduledAt: string): string {
  const d = new Date(scheduledAt);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function DoctorScheduleContent({ appointments, loading }: DoctorScheduleContentProps) {
  if (loading) {
    return (
      <Section title="Upcoming schedule" subtitle="Your confirmed and requested visits at Riverbend Family Clinic">
        <SkeletonCards count={4} />
      </Section>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Section title="Upcoming schedule" subtitle="Your confirmed and requested visits at Riverbend Family Clinic">
        <EmptyState
          icon="calendar"
          title="No appointments on your calendar"
          text="Once patients book or a receptionist schedules a visit, it will show up here."
        />
      </Section>
    );
  }

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  return (
    <Section title="Upcoming schedule" subtitle="Your confirmed and requested visits at Riverbend Family Clinic">
      <Grid size="md" cols={3}>
        {(Array.isArray(sorted) ? sorted : []).map((appt) => (
          <Card key={appt.id}>
            <CardBody>
              <CardTitle>{formatSlot(appt.scheduled_at)}</CardTitle>
              <CardMeta>
                <Icon name="user" size={14} /> Patient #{appt.patient}
              </CardMeta>
              {appt.reason ? <CardMeta>{appt.reason}</CardMeta> : null}
              <Badge tone={statusTone(appt.status)}>{appt.status.replace('_', ' ')}</Badge>
            </CardBody>
            <CardFooter>
              <Button variant="ghost" size="md" to={`/staff/doctor/appointments/${appt.id}`}>
                <Icon name="arrow-right" size={14} /> View details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}