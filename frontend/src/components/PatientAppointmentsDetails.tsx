import React from 'react';
import { Section, Stack, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientAppointmentsDetailsProps {
  patientName?: string;
  email?: string;
  phone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  dateOfBirth?: string;
}

export default function PatientAppointmentsDetails({
  patientName,
  email,
  phone,
  insuranceProvider,
  insurancePolicyNumber,
  dateOfBirth,
}: PatientAppointmentsDetailsProps) {
  return (
    <Section
      narrow
      eyebrow="Your account"
      title="Account details"
      subtitle="These details are used by Riverbend Family Clinic staff to confirm and check in your visits."
    >
      <div className="ds-form">
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">Patient</span>
            <div className="ds-input" aria-readonly="true">
              {patientName || 'Not provided'}
            </div>
          </div>
          <div className="ds-field">
            <span className="ds-label">Date of birth</span>
            <div className="ds-input" aria-readonly="true">
              {dateOfBirth || 'Not provided'}
            </div>
          </div>
        </div>
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">Email</span>
            <div className="ds-input" aria-readonly="true">
              {email || 'Not provided'}
            </div>
          </div>
          <div className="ds-field">
            <span className="ds-label">Phone</span>
            <div className="ds-input" aria-readonly="true">
              {phone || 'Not provided'}
            </div>
          </div>
        </div>
        <div className="ds-form-row">
          <div className="ds-field">
            <span className="ds-label">Insurance provider</span>
            <div className="ds-input" aria-readonly="true">
              {insuranceProvider || 'Not on file'}
            </div>
          </div>
          <div className="ds-field">
            <span className="ds-label">Policy number</span>
            <div className="ds-input" aria-readonly="true">
              {insurancePolicyNumber || 'Not on file'}
            </div>
          </div>
        </div>
        <Stack gap="sm" align="center">
          <Badge tone="soft">
            <Icon name="info" size={14} /> To update these details, visit your profile page.
          </Badge>
        </Stack>
      </div>
    </Section>
  );
}