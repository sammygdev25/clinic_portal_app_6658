import { Grid, Stat } from '../components/ui';
import type { Appointment } from '../types';

interface DoctorDashboardStatsProps {
  appointments: Appointment[];
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function DoctorDashboardStats({ appointments }: DoctorDashboardStatsProps) {
  const list = Array.isArray(appointments) ? appointments : [];

  const todaysCount = list.filter((a) => isToday(a.scheduled_at)).length;
  const checkedInCount = list.filter((a) => a.status === 'checked_in').length;
  const completedCount = list.filter((a) => a.status === 'completed').length;
  const uniquePatients = new Set(list.map((a) => a.patient)).size;

  return (
    <Grid size="sm" cols={4}>
      <Stat
        value={String(todaysCount)}
        label="Today's Appointments"
        icon="calendar"
      />
      <Stat
        value={String(checkedInCount)}
        label="Checked In"
        icon="check"
      />
      <Stat
        value={String(completedCount)}
        label="Completed Visits"
        icon="award"
      />
      <Stat
        value={String(uniquePatients)}
        label="Patients on Roster"
        icon="users"
      />
    </Grid>
  );
}
