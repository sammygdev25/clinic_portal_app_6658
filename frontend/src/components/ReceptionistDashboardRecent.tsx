import { Section, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Appointment } from '../types';

interface ReceptionistDashboardRecentProps {
  appointments: Appointment[];
}

export default function ReceptionistDashboardRecent({ appointments }: ReceptionistDashboardRecentProps) {
  const recent = Array.isArray(appointments) ? appointments.slice(0, 8) : [];

  return (
    <Section eyebrow="Front Desk" title="Recent Activity" subtitle="Latest appointments logged at Riverbend Family Clinic">
      {recent.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No recent appointments"
          text="Appointments booked or checked in today will show up here."
        />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((appt) => {
                const patientName = (appt as any).patient_name || (appt as any).patient_username || `Patient #${appt.patient}`;
                const doctorName = (appt as any).doctor_name || (appt as any).doctor_username || `Dr. #${appt.doctor}`;
                const scheduled = appt.scheduled_at ? new Date(appt.scheduled_at).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                }) : '--';
                return (
                  <tr key={appt.id}>
                    <td>{patientName}</td>
                    <td>{doctorName}</td>
                    <td>{scheduled}</td>
                    <td>
                      <span className="badge">{appt.status.replace('_', ' ')}</span>
                    </td>
                    <td>
                      <a href={`/staff/receptionist/checkin`} className="ds-btn-ghost">
                        <Icon name="arrow-right" size={16} title="View" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}