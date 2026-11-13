import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface DoctorDashboardHeaderProps {
  doctorName: string;
  onViewSchedule?: () => void;
}

export default function DoctorDashboardHeader({ doctorName, onViewSchedule }: DoctorDashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow="Riverbend Family Clinic"
      title="Doctor Dashboard"
      subtitle={`Welcome back, Dr. ${doctorName}. Here is today's patient queue and schedule at a glance.`}
      actions={
        <Button variant="primary" onClick={onViewSchedule}>
          <Icon name="calendar" size={18} />
          View Full Schedule
        </Button>
      }
    />
  );
}