import React from 'react';
import { Grid, Stat } from '../components/ui';
import type { Appointment, Prescription, Bill, Document } from '../types';

interface PatientDashboardStatsProps {
  appointments: Appointment[];
  prescriptions: Prescription[];
  bills: Bill[];
  documents: Document[];
}

export default function PatientDashboardStats({
  appointments,
  prescriptions,
  bills,
  documents,
}: PatientDashboardStatsProps) {
  const now = new Date();

  const upcomingCount = (Array.isArray(appointments) ? appointments : []).filter(
    (a) =>
      new Date(a.scheduled_at) >= now &&
      a.status !== 'cancelled' &&
      a.status !== 'completed'
  ).length;

  const activePrescriptionsCount = Array.isArray(prescriptions) ? prescriptions.length : 0;

  const unpaidBillsCount = (Array.isArray(bills) ? bills : []).filter(
    (b) => b.status !== 'paid'
  ).length;

  const documentsCount = Array.isArray(documents) ? documents.length : 0;

  return (
    <Grid size="sm">
      <Stat
        value={upcomingCount}
        label="Upcoming Visits"
        icon="calendar"
      />
      <Stat
        value={activePrescriptionsCount}
        label="Active Prescriptions"
        icon="package"
      />
      <Stat
        value={unpaidBillsCount}
        label="Unpaid Bills"
        icon="credit-card"
      />
      <Stat
        value={documentsCount}
        label="Documents on File"
        icon="book"
      />
    </Grid>
  );
}
