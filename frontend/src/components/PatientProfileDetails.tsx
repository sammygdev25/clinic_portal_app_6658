import { Section } from '../components/ui';
import { Icon } from '../components/icons';
import type { User, PatientProfile } from '../types';

interface PatientProfileDetailsProps {
  user: User | null;
  profile: PatientProfile | null;
}

export default function PatientProfileDetails({ user, profile }: PatientProfileDetailsProps) {
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <Section narrow eyebrow="Account" title="Account details" subtitle="Your Riverbend Family Clinic login information.">
      <div className="ds-form">
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="user" size={16} /> User ID
            </span>
            <p>{user?.id ?? '—'}</p>
          </div>
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="shield" size={16} /> Role
            </span>
            <p>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Patient'}</p>
          </div>
        </div>
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">
              <Icon name="calendar" size={16} /> Patient since
            </span>
            <p>{memberSince}</p>
          </div>
        </div>
        <p className="ds-help">
          To update your contact details, insurance information or address, use the profile form above. For
          changes to your username or email, please contact the front desk at Riverbend Family Clinic.
        </p>
      </div>
    </Section>
  );
}
