import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface ReceptionistDashboardActionsProps {
  className?: string;
}

export default function ReceptionistDashboardActions({ className }: ReceptionistDashboardActionsProps) {
  return (
    <Section tight className={className}>
      <Cluster gap="sm" justify="start">
        <Button variant="primary" to="/staff/receptionist/checkin">
          <Icon name="check" size={16} />
          Check-In Patients
        </Button>
        <Button variant="secondary" to="/staff/receptionist/schedule">
          <Icon name="calendar" size={16} />
          View Schedule
        </Button>
        <Button variant="secondary" to="/staff/receptionist/schedule">
          <Icon name="plus" size={16} />
          New Appointment
        </Button>
        <Button variant="ghost" to="/staff/receptionist/dashboard">
          <Icon name="refresh" size={16} />
          Refresh Dashboard
        </Button>
      </Cluster>
    </Section>
  );
}