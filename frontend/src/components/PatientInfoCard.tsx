import React from 'react';
import type { PatientProfile } from '../types';
import { Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import { formatDate } from '../utils';

interface PatientInfoCardPatient extends Partial<PatientProfile> {
  patient_name?: string;
  patient_email?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface PatientInfoCardProps {
  patient: PatientInfoCardPatient;
}

export default function PatientInfoCard({ patient }: PatientInfoCardProps) {
  if (!patient) {
    return null;
  }

  const displayName =
    patient.patient_name ||
    [patient.first_name, patient.last_name].filter(Boolean).join(' ') ||
    patient.username ||
    'Unknown Patient';

  const email = patient.patient_email || patient.email || '';

  return (
    <Card>
      <CardBody>
        <CardTitle>
          <Icon name="user" size={18} /> {displayName}
        </CardTitle>
        <CardMeta>
          <span className="ds-cluster">
            <Icon name="mail" size={14} /> {email || 'No email on file'}
          </span>
        </CardMeta>

        <div className="ds-stack" style={{ marginTop: 'var(--space-md)' }}>
          {patient.date_of_birth && (
            <div className="ds-cluster">
              <Icon name="calendar" size={14} />
              <span className="ds-small">
                DOB: {formatDate(patient.date_of_birth as unknown as string)}
              </span>
            </div>
          )}

          {patient.phone && (
            <div className="ds-cluster">
              <Icon name="phone" size={14} />
              <span className="ds-small">{patient.phone}</span>
            </div>
          )}

          {patient.address && (
            <div className="ds-cluster">
              <Icon name="map-pin" size={14} />
              <span className="ds-small">{patient.address}</span>
            </div>
          )}

          {(patient.insurance_provider || patient.insurance_policy_number) && (
            <div className="ds-cluster">
              <Icon name="shield" size={14} />
              <span className="ds-small">
                {patient.insurance_provider || 'Insurance'}
                {patient.insurance_policy_number
                  ? ` — Policy #${patient.insurance_policy_number}`
                  : ''}
              </span>
            </div>
          )}

          {!patient.date_of_birth &&
            !patient.phone &&
            !patient.address &&
            !patient.insurance_provider && (
              <p className="ds-muted ds-small">
                No additional patient details on file yet.
              </p>
            )}
        </div>
      </CardBody>
    </Card>
  );
}