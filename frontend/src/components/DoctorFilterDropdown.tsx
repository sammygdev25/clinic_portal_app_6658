import React from 'react';

interface DoctorLike {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  doctor_profile?: {
    specialty?: string;
  };
}

interface DoctorFilterDropdownProps {
  doctors: DoctorLike[];
  selectedDoctor: string;
  onChange: (value: string) => void;
}

function doctorLabel(doctor: DoctorLike): string {
  const name = [doctor.first_name, doctor.last_name].filter(Boolean).join(' ').trim();
  const base = name || doctor.username || `Doctor #${doctor.id}`;
  const specialty = doctor.doctor_profile?.specialty;
  return specialty ? `Dr. ${base} - ${specialty}` : `Dr. ${base}`;
}

export default function DoctorFilterDropdown({ doctors, selectedDoctor, onChange }: DoctorFilterDropdownProps) {
  const list = Array.isArray(doctors) ? doctors : [];

  return (
    <div className="ds-field">
      <label className="ds-label" htmlFor="doctor-filter">
        Filter by doctor
      </label>
      <select
        id="doctor-filter"
        className="input"
        value={selectedDoctor}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      >
        <option value="">All doctors</option>
        {list.map((doctor) => (
          <option key={doctor.id} value={String(doctor.id)}>
            {doctorLabel(doctor)}
          </option>
        ))}
      </select>
    </div>
  );
}