import React from 'react';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, Button, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface ReceptionistCheckInContentProps {
  appointments: Appointment[];
  onCheckIn: (id: number) => void;
  loading?: boolean;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'confirmed':
      return 'primary';
    case 'checked_in':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'completed':
      return 'soft';
    default:
      return 'neutral';
  }
}

function formatTime(scheduledAt: string): string {
  const d = new Date(scheduledAt);
  return d.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
}

export default function ReceptionistCheckInContent({ appointments, onCheckIn, loading }: ReceptionistCheckInContentProps) {
  if (loading) {
    return (
      <Section eyebrow="Front Desk" title="Patient Check-In">
        <SkeletonCards count={4} />
      </Section>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Section eyebrow="Front Desk" title="Patient Check-In">
        <EmptyState
          icon="calendar"
          title="No arrivals to check in"
          text="Confirmed appointments at Riverbend Family Clinic will appear here as patients arrive for their visit."
        />
      </Section>
    );
  }

  const pending = (Array.isArray(appointments) ? appointments : []).filter((a) => a.status !== 'checked_in' && a.status !== 'completed' && a.status !== 'cancelled');

  return (
    <Section
      eyebrow="Front Desk"
      title="Patient Check-In"
      subtitle="Confirm each patient's arrival to notify the care team and update the waiting room queue."
    >
      {pending.length === 0 ? (
        <EmptyState
          icon="check"
          title="Everyone is checked in"
          text="All confirmed patients for today have been checked in. New arrivals will show up here automatically."
        />
      ) : (
        <Grid size="md" cols={3}>
          {(Array.isArray(pending) ? pending : []).map((appointment) => (
            <Card key={appointment.id}>
              <CardBody>
                <CardTitle>Appointment #{appointment.id}</CardTitle>
                <CardMeta>
                  <Icon name="clock" size={16} /> {formatTime(appointment.scheduled_at)}
                </CardMeta>
                <CardMeta>
                  <Icon name="user" size={16} /> Patient ID {appointment.patient}
                </CardMeta>
                {appointment.reason && (
                  <CardMeta>
                    <Icon name="info" size={16} /> {appointment.reason}
                  </CardMeta>
                )}
                <Badge tone={statusTone(appointment.status)}>{appointment.status.replace('_', ' ')}</Badge>
              </CardBody>
              <CardFooter>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onCheckIn(appointment.id)}
                  disabled={appointment.status === 'checked_in'}
                >
                  <Icon name="check" size={16} /> Check In
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}