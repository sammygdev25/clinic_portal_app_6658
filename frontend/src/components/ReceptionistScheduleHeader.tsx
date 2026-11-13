import React from 'react';
import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface ReceptionistScheduleHeaderProps {
  onNewAppointment?: () => void;
}

export default function ReceptionistScheduleHeader({ onNewAppointment }: ReceptionistScheduleHeaderProps) {
  return (
    <PageHeader
      eyebrow="Front Desk"
      title="Clinic Schedule"
      subtitle="View every doctor's calendar at Riverbend Family Clinic and book new appointments for patients."
      actions={
        onNewAppointment ? (
          <Button variant="primary" onClick={onNewAppointment}>
            <Icon name="plus" size={18} />
            New Appointment
          </Button>
        ) : undefined
      }
    />
  );
}