import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientPrescriptionsHeaderProps {
  section?: string;
  page?: string;
}

export default function PatientPrescriptionsHeader(props: PatientPrescriptionsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Riverbend Family Clinic"
      title="Your Prescriptions"
      subtitle="Review the medications your Riverbend doctors have prescribed, including dosage and instructions from each visit."
      actions={<Icon name="package" size={28} title="Prescriptions" />}
    />
  );
}