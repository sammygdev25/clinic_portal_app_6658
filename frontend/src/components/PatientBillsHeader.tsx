import { PageHeader } from '../components/ui';

interface PatientBillsHeaderProps {
  unpaidCount?: number;
}

export default function PatientBillsHeader({ unpaidCount = 0 }: PatientBillsHeaderProps) {
  const subtitle =
    unpaidCount > 0
      ? `You have ${unpaidCount} unpaid ${unpaidCount === 1 ? 'bill' : 'bills'} from your visits to Riverbend Family Clinic.`
      : 'Review charges generated from your appointments at Riverbend Family Clinic.';

  return (
    <PageHeader
      eyebrow="Billing"
      title="Your Bills"
      subtitle={subtitle}
    />
  );
}