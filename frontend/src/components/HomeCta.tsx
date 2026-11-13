import React from 'react';
import { Section, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeCtaProps {
  section?: string;
  page?: string;
}

export default function HomeCta(props: HomeCtaProps) {
  return (
    <Section tight>
      <div className="ds-card ds-card-body ds-between">
        <p className="ds-lead">
          Ready to take charge of your health? Create your Riverbend Family Clinic account to book
          appointments, message our doctors and manage your records in one place.
        </p>
        <Button variant="primary" size="lg" to="/register">
          Sign Up Today
          <Icon name="arrow-right" size={18} />
        </Button>
      </div>
    </Section>
  );
}