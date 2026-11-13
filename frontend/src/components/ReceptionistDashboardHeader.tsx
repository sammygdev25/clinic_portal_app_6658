import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface ReceptionistDashboardHeaderProps {
  userName: string;
  onPrimaryAction?: () => void;
}

export default function ReceptionistDashboardHeader({ userName, onPrimaryAction }: ReceptionistDashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow="Front Desk"
      title="Receptionist Dashboard"
      subtitle={`Welcome back, ${userName}. Here is today's activity at Riverbend Family Clinic.`}
      actions={
        <Button variant="primary" size="lg" onClick={onPrimaryAction}>
          <Icon name="plus" size={18} />
          New Appointment
        </Button>
      }
    />
  );
}