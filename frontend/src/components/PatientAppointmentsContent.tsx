import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface PatientAppointmentsContentProps {
  appointments: Appointment[];
  onReschedule: (appointment: Appointment) => void;
  onCancel: (id: number) => void;
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

export default function PatientAppointmentsContent({ appointments, onReschedule, onCancel }: PatientAppointmentsContentProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <Section title="Your appointments" subtitle="Visits you've booked with Riverbend Family Clinic providers">
        <EmptyState
          icon="calendar"
          title="No appointments yet"
          text="You haven't booked a visit with us yet. Schedule one below to get started."
          action={<Button variant="primary" to="/patient/appointments">Book an appointment</Button>}
        />
      </Section>
    );
  }

  return (
    <Section title="Your appointments" subtitle="Visits you've booked with Riverbend Family Clinic providers">
      <Grid size="md" cols={2}>
        {(Array.isArray(appointments) ? appointments : []).map((appt) => {
          const canModify = appt.status === 'requested' || appt.status === 'confirmed';
          const when = new Date(appt.scheduled_at);
          return (
            <Card key={appt.id}>
              <CardBody>
                <CardTitle>
                  {when.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
                  {when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </CardTitle>
                <CardMeta>
                  <Badge tone={statusTone(appt.status)}>{statusLabel(appt.status)}</Badge>
                </CardMeta>
                {appt.reason && <p className="ds-muted">{appt.reason}</p>}
                <CardFooter>
                  {canModify ? (
                    <>
                      <Button variant="secondary" onClick={() => onReschedule(appt)}>
                        <Icon name="calendar" size={16} /> Reschedule
                      </Button>
                      <Button variant="danger" onClick={() => onCancel(appt.id)}>
                        <Icon name="close" size={16} /> Cancel
                      </Button>
                    </>
                  ) : (
                    <span className="ds-small ds-muted">No further action needed</span>
                  )}
                </CardFooter>
              </CardBody>
            </Card>
          );
        })}
      </Grid>
    </Section>
  );
}