import React from 'react';
import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientDashboardActionsProps {
  section?: string;
  page?: string;
}

export default function PatientDashboardActions(_props: PatientDashboardActionsProps) {
  return (
    <Section tight title="Quick Actions">
      <Cluster gap="sm" align="center">
        <Button variant="primary" to="/patient/appointments">
          <Icon name="calendar" size={16} />
          Book Appointment
        </Button>
        <Button variant="secondary" to="/patient/prescriptions">
          <Icon name="package" size={16} />
          View Prescriptions
        </Button>
        <Button variant="secondary" to="/patient/bills">
          <Icon name="credit-card" size={16} />
          Pay Bills
        </Button>
        <Button variant="secondary" to="/patient/documents">
          <Icon name="upload" size={16} />
          Upload Document
        </Button>
        <Button variant="ghost" to="/patient/profile">
          <Icon name="user" size={16} />
          Edit Profile
        </Button>
      </Cluster>
    </Section>
  );
}