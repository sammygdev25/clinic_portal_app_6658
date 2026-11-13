import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface DoctorDashboardActionsProps {
  section?: string;
  page?: string;
}

export default function DoctorDashboardActions(props: DoctorDashboardActionsProps) {
  return (
    <Section tight title="Quick actions">
      <Cluster gap="sm">
        <Button variant="primary" to="/staff/doctor/schedule">
          <Icon name="calendar" size={16} />
          View Schedule
        </Button>
        <Button variant="secondary" to="/staff/doctor/appointments">
          <Icon name="list" size={16} />
          All Appointments
        </Button>
        <Button variant="secondary" to="/staff/doctor/schedule">
          <Icon name="users" size={16} />
          Patient Queue
        </Button>
        <Button variant="ghost" to="/profile">
          <Icon name="user" size={16} />
          My Profile
        </Button>
        <Button variant="ghost" to="/staff/doctor/dashboard">
          <Icon name="refresh" size={16} />
          Refresh Dashboard
        </Button>
      </Cluster>
    </Section>
  );
}