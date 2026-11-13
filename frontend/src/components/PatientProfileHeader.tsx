import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';
import type { AuthUser } from '../contexts/AuthContext.tsx';

interface PatientProfileHeaderProps {
  user: AuthUser | null;
}

export default function PatientProfileHeader({ user }: PatientProfileHeaderProps) {
  const displayName = user?.username || user?.email || 'Patient';

  return (
    <PageHeader
      eyebrow="Riverbend Family Clinic"
      title={`Welcome back, ${displayName}`}
      subtitle="Manage your personal details, insurance information and contact preferences."
      actions={
        <span className="ds-cluster">
          <Icon name="user" size={18} title="Patient account" />
        </span>
      }
    />
  );
}