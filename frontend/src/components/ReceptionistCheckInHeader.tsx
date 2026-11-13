import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface ReceptionistCheckInHeaderProps {
  checkedInCount?: number;
  waitingCount?: number;
}

export default function ReceptionistCheckInHeader({ checkedInCount = 0, waitingCount = 0 }: ReceptionistCheckInHeaderProps) {
  return (
    <PageHeader
      eyebrow="Riverbend Family Clinic"
      title="Patient Check-In"
      subtitle={`Welcome arriving patients and mark them checked-in for their appointment. ${waitingCount} waiting, ${checkedInCount} checked in today.`}
      actions={
        <div className="ds-cluster">
          <Icon name="users" size={20} title="Check-in queue" />
        </div>
      }
    />
  );
}