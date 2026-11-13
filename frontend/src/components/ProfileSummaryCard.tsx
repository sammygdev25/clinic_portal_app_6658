import type { PatientProfile } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface ProfileSummaryCardProps {
  profile: PatientProfile | null;
}

export default function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  if (!profile) {
    return (
      <Card className="ds-card">
        <CardBody>
          <CardTitle>No profile on file</CardTitle>
          <CardMeta>Complete your profile below to help our staff at Riverbend Family Clinic serve you better.</CardMeta>
        </CardBody>
      </Card>
    );
  }

  const hasInsurance = Boolean(profile.insurance_provider || profile.insurance_policy_number);

  return (
    <Card className="ds-card">
      <CardBody>
        <Stack gap="sm">
          <Stack gap="xs" align="center" justify="between">
            <CardTitle>Patient Summary</CardTitle>
            <Badge tone={hasInsurance ? 'success' : 'neutral'}>
              {hasInsurance ? 'Insured' : 'No insurance on file'}
            </Badge>
          </Stack>

          <Cluster gap="sm" align="center">
            <Icon name="calendar" size={16} />
            <span>
              {profile.date_of_birth
                ? `Date of birth: ${profile.date_of_birth}`
                : 'Date of birth not provided'}
            </span>
          </Cluster>

          <Cluster gap="sm" align="center">
            <Icon name="phone" size={16} />
            <span>{profile.phone || 'No phone number on file'}</span>
          </Cluster>

          <Cluster gap="sm" align="center">
            <Icon name="map-pin" size={16} />
            <span>{profile.address || 'No address on file'}</span>
          </Cluster>

          <Cluster gap="sm" align="center">
            <Icon name="shield" size={16} />
            <span>
              {profile.insurance_provider
                ? `${profile.insurance_provider}${profile.insurance_policy_number ? ` · Policy #${profile.insurance_policy_number}` : ''}`
                : 'No insurance provider on file'}
            </span>
          </Cluster>
        </Stack>
      </CardBody>
    </Card>
  );
}

import { Stack, Cluster } from '../components/ui';