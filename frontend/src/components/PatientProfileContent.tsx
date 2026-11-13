import React from 'react';
import { Link } from 'react-router-dom';
import { Section, Card, CardBody, Badge, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface PatientProfileContentProps {
  appointments: Appointment[];
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'confirmed':
      return 'primary';
    default:
      return 'soft';
  }
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PatientProfileContent({ appointments }: PatientProfileContentProps) {
  const hasAppointments = Array.isArray(appointments) && appointments.length > 0;

  return (
    <Section
      eyebrow="Your care"
      title="Recent Appointments"
      subtitle="A quick look at your visits with Riverbend Family Clinic."
    >
      {!hasAppointments ? (
        <EmptyState
          icon="calendar"
          title="No appointments yet"
          text="Once you book a visit with one of our doctors, it will show up here."
          action={
            <Button variant="primary" to="/patient/appointments">
              Book an appointment
            </Button>
          }
        />
      ) : (
        <Card>
          <CardBody>
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Date &amp; Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>{formatDateTime(appt.scheduled_at)}</td>
                      <td>{appt.reason || 'General visit'}</td>
                      <td>
                        <Badge tone={statusTone(appt.status)}>{appt.status}</Badge>
                      </td>
                      <td>
                        <Link to="/patient/appointments" className="ds-cluster">
                          <Icon name="arrow-right" size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </Section>
  );
}