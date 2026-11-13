import { Section, Grid, Card, CardBody, CardTitle, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import ScheduleCalendar from './ScheduleCalendar';
import AppointmentForm from './AppointmentForm';
import DoctorFilterDropdown from './DoctorFilterDropdown';
import type { Appointment, User } from '../types';

interface AppointmentFormValues {
  patient: number;
  doctor: number;
  scheduled_at: string;
  reason: string;
}

interface ReceptionistScheduleContentProps {
  appointments: Appointment[];
  doctors: User[];
  patients: User[];
  selectedDoctor: string;
  onDoctorChange: (doctorId: string) => void;
  onSelectSlot: (isoDateTime: string) => void;
  onSubmit: (values: AppointmentFormValues) => void | Promise<void>;
  loading?: boolean;
}

export default function ReceptionistScheduleContent({
  appointments,
  doctors,
  patients,
  selectedDoctor,
  onDoctorChange,
  onSelectSlot,
  onSubmit,
  loading = false,
}: ReceptionistScheduleContentProps) {
  const filteredAppointments = selectedDoctor
    ? (Array.isArray(appointments) ? appointments : []).filter((a) => String((a as any).doctor) === String(selectedDoctor))
    : appointments;

  return (
    <Section
      eyebrow="Scheduling"
      title="Clinic Schedule"
      subtitle="Review the booking calendar, filter by provider, and add new appointments for Riverbend Family Clinic patients."
    >
      <div className="ds-field" style={{ maxWidth: '320px' }}>
        <DoctorFilterDropdown
          doctors={doctors}
          selectedDoctor={selectedDoctor}
          onChange={onDoctorChange}
        />
      </div>

      <Grid size="lg" cols={2}>
        <Card>
          <CardBody>
            <CardTitle>
              <Icon name="calendar" size={18} /> Appointment Calendar
            </CardTitle>
            {loading ? (
              <SkeletonCards count={3} />
            ) : filteredAppointments.length === 0 ? (
              <EmptyState
                icon="calendar"
                title="No appointments scheduled"
                text="There are no appointments on the calendar for this provider yet. Add one using the form."
              />
            ) : (
              <ScheduleCalendar
                appointments={filteredAppointments}
                onSelectSlot={onSelectSlot}
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CardTitle>
              <Icon name="plus" size={18} /> Book New Appointment
            </CardTitle>
            <AppointmentForm
              doctors={doctors}
              patients={patients}
              onSubmit={onSubmit}
            />
          </CardBody>
        </Card>
      </Grid>
    </Section>
  );
}
