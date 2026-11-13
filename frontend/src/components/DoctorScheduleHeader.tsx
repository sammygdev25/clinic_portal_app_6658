import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface DoctorScheduleHeaderProps {
  doctorName?: string;
}

export default function DoctorScheduleHeader({ doctorName }: DoctorScheduleHeaderProps) {
  return (
    <PageHeader
      eyebrow="Riverbend Family Clinic"
      title="My Schedule"
      subtitle={
        doctorName
          ? `Review and manage ${doctorName}'s upcoming appointments across the clinic calendar.`
          : 'Review and manage your upcoming appointments across the clinic calendar.'
      }
      actions={<Icon name="calendar" size={28} title="Schedule" />}
    />
  );
}