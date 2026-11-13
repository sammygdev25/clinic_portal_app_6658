import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PatientProfileHeader from '../components/PatientProfileHeader';
import PatientProfileContent from '../components/PatientProfileContent';
import PatientProfileDetails from '../components/PatientProfileDetails';
import { getAppointmentList, getPatientProfileList } from '../api';
import type { Appointment, PatientProfile, User } from '../types';
import { LoadingBlock } from '../components/ui';

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const [appointmentData, profileData] = await Promise.all([
          getAppointmentList(),
          getPatientProfileList(),
        ]);
        if (!active) return;

        const appointmentList = Array.isArray(appointmentData) ? appointmentData : [];
        setAppointments(
          appointmentList.filter((appt: any) => appt.patient === user?.id || !appt.patient)
        );

        const profileList = Array.isArray(profileData) ? profileData : [];
        const mine = profileList.find((p: any) => p.user === user?.id) || null;
        setProfile(mine);
      } catch (err) {
        console.error('Failed to load patient profile data', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (user) {
      load();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return <LoadingBlock label="Loading your profile..." />;
  }

  return (
    <div className="ds-stack-lg">
      <PatientProfileHeader user={user} />
      <PatientProfileContent appointments={appointments} />
      <PatientProfileDetails user={user as unknown as User | null} profile={profile} />
    </div>
  );
}