import React from 'react';
import { Card, CardBody, CardTitle, CardMeta, Badge, EmptyState, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface PatientQueueListProps {
  appointments: Appointment[];
}

function getPatientLabel(appointment: Appointment): string {
  const patient = (appointment as any).patient;
  if (patient && typeof patient === 'object') {
    return patient.username || patient.first_name || patient.email || `Patient #${patient.id}`;
  }
  return `Patient #${patient}`;
}

function formatTime(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'checked_in':
      return 'primary';
    case 'confirmed':
      return 'soft';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'checked_in':
      return 'Checked In';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'requested':
      return 'Requested';
    default:
      return status;
  }
}

export default function PatientQueueList({ appointments }: PatientQueueListProps) {
  const list = Array.isArray(appointments) ? appointments : [];
  const queue = [...list]
    .filter((a) => a.status === 'checked_in' || a.status === 'confirmed')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  if (queue.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No patients in the queue"
        text="Patients will appear here once they are confirmed or checked in for today."
      />
    );
  }

  return (
    <Stack gap="sm">
      {queue.map((appointment, index) => (
        <Card key={appointment.id}>
          <CardBody>
            <Stack gap="xs" align="start" justify="between">
              <div className="ds-cluster">
                <Badge tone="neutral">{index + 1}</Badge>
                <CardTitle>{getPatientLabel(appointment)}</CardTitle>
              </div>
              <Badge tone={statusTone(appointment.status)}>{statusLabel(appointment.status)}</Badge>
            </Stack>
            <CardMeta>
              <Icon name="clock" size={14} /> {formatTime(appointment.scheduled_at)}
            </CardMeta>
            {appointment.reason && (
              <CardMeta>
                <Icon name="info" size={14} /> {appointment.reason}
              </CardMeta>
            )}
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}