import type { ClinicHour } from '../types';
import { Icon } from '../components/icons';

interface ClinicHoursTableProps {
  hours: ClinicHour[];
}

const DAY_ORDER: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

function formatTime(value: string): string {
  if (!value) return '';
  const parts = value.split(':');
  if (parts.length < 2) return value;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${suffix}`;
}

function ClinicHoursTable({ hours }: ClinicHoursTableProps) {
  const list = Array.isArray(hours) ? hours : [];

  if (list.length === 0) {
    return (
      <div className="ds-empty">
        <Icon name="clock" size={28} />
        <p>Clinic hours have not been published yet.</p>
      </div>
    );
  }

  const sorted = [...list].sort(
    (a, b) => (DAY_ORDER[a.day_of_week] ?? 99) - (DAY_ORDER[b.day_of_week] ?? 99)
  );

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Open</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((h) => (
            <tr key={h.id}>
              <td>{DAY_LABELS[h.day_of_week] || h.day_of_week}</td>
              <td>{formatTime(h.open_time)}</td>
              <td>{formatTime(h.close_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClinicHoursTable;