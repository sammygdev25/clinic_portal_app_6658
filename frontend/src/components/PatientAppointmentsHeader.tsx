import { PageHeader } from '../components/ui';

interface PatientAppointmentsHeaderProps {
  userName?: string;
}

export default function PatientAppointmentsHeader({ userName }: PatientAppointmentsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Riverbend Family Clinic"
      title="Your Appointments"
      subtitle={
        userName
          ? `Signed in as ${userName} — book, reschedule or review your upcoming visits.`
          : 'Book, reschedule or review your upcoming visits.'
      }
    />
  );
}