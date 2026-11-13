import { Grid, Stat } from '../components/ui';
import type { Appointment } from '../types';

interface ReceptionistDashboardStatsProps {
  appointments: Appointment[];
}

export default function ReceptionistDashboardStats({ appointments }: ReceptionistDashboardStatsProps) {
  const today = new Date().toDateString();
  const todaysAppointments = (Array.isArray(appointments) ? appointments : []).filter(
    (a) => new Date(a.scheduled_at).toDateString() === today
  );
  const checkedInCount = (Array.isArray(todaysAppointments) ? todaysAppointments : []).filter((a) => a.status === 'checked_in').length;
  const waitingCount = (Array.isArray(todaysAppointments) ? todaysAppointments : []).filter(
    (a) => a.status === 'requested' || a.status === 'confirmed'
  ).length;
  const completedCount = (Array.isArray(todaysAppointments) ? todaysAppointments : []).filter((a) => a.status === 'completed').length;

  return (
    <Grid size="sm">
      <Stat
        value={todaysAppointments.length}
        label="Appointments today"
        icon="calendar"
      />
      <Stat
        value={waitingCount}
        label="Waiting to check in"
        icon="clock"
      />
      <Stat
        value={checkedInCount}
        label="Checked in"
        icon="check"
      />
      <Stat
        value={completedCount}
        label="Completed today"
        icon="award"
      />
    </Grid>
  );
}
