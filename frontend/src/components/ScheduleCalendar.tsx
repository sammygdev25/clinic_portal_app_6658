import { useMemo, useState } from 'react';
import { Card, CardBody, Icon, Badge } from '../components/ui';
import type { Appointment } from '../types';

interface ScheduleCalendarProps {
  appointments: Appointment[];
  onSelectSlot: (isoDateTime: string) => void;
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function statusTone(status: string): 'primary' | 'success' | 'soft' | 'danger' | 'neutral' {
  switch (status) {
    case 'confirmed':
      return 'primary';
    case 'checked_in':
      return 'success';
    case 'completed':
      return 'soft';
    case 'cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

export default function ScheduleCalendar({ appointments, onSelectSlot }: ScheduleCalendarProps) {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));

  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [weekStart]);

  const list = Array.isArray(appointments) ? appointments : [];

  const findAppointment = (day: Date, hour: number): Appointment | undefined => {
    return list.find((appt) => {
      const apptDate = new Date(appt.scheduled_at);
      return (
        apptDate.getFullYear() === day.getFullYear() &&
        apptDate.getMonth() === day.getMonth() &&
        apptDate.getDate() === day.getDate() &&
        apptDate.getHours() === hour
      );
    });
  };

  const goToPrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const goToNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToToday = () => {
    setWeekStart(startOfWeek(new Date()));
  };

  const handleSlotClick = (day: Date, hour: number, existing: Appointment | undefined) => {
    if (existing) return;
    const slot = new Date(day);
    slot.setHours(hour, 0, 0, 0);
    onSelectSlot(slot.toISOString());
  };

  return (
    <Card>
      <CardBody>
        <div className="ds-between" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 className="ds-card-title">Clinic Schedule</h3>
          <div className="ds-cluster" style={{ gap: 'var(--space-xs)' }}>
            <button type="button" className="btn btn-secondary" onClick={goToPrevWeek} aria-label="Previous week">
              <Icon name="chevron-left" size={16} />
            </button>
            <button type="button" className="btn btn-secondary" onClick={goToToday}>
              Today
            </button>
            <button type="button" className="btn btn-secondary" onClick={goToNextWeek} aria-label="Next week">
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </div>

        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Time</th>
                {days.map((day) => (
                  <th key={day.toISOString()}>{formatDayLabel(day)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="ds-muted ds-small">
                    {hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? 'AM' : 'PM'}
                  </td>
                  {days.map((day) => {
                    const existing = findAppointment(day, hour);
                    return (
                      <td key={`${day.toISOString()}-${hour}`}>
                        <button
                          type="button"
                          onClick={() => handleSlotClick(day, hour, existing)}
                          disabled={!!existing}
                          className={existing ? 'ds-btn-ghost' : 'btn btn-secondary'}
                          style={{ width: '100%', minHeight: '44px', textAlign: 'left' }}
                        >
                          {existing ? (
                            <Badge tone={statusTone(existing.status)}>
                              {existing.reason ? existing.reason.slice(0, 18) : existing.status}
                            </Badge>
                          ) : (
                            <span className="ds-muted ds-small">
                              <Icon name="plus" size={14} /> Open
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}