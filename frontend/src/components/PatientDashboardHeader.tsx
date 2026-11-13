import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientDashboardHeaderProps {
  patientName: string;
  onBookAppointment: () => void;
}

export default function PatientDashboardHeader({ patientName, onBookAppointment }: PatientDashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow="Patient Portal"
      title={`Welcome back, ${patientName}`}
      subtitle="Here's an overview of your upcoming care at Riverbend Family Clinic."
      actions={
        <Button variant="primary" size="lg" onClick={onBookAppointment}>
          <Icon name="plus" size={18} />
          Book Appointment
        </Button>
      }
    />
  );
}