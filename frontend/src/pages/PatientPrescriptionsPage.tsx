import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPrescriptionList } from '../api';
import type { Prescription } from '../types';
import PatientPrescriptionsHeader from '../components/PatientPrescriptionsHeader';
import PatientPrescriptionsContent from '../components/PatientPrescriptionsContent';

export default function PatientPrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getPrescriptionList();
        const list = Array.isArray(data) ? data : [];
        const mine = user
          ? list.filter((p: any) => {
              const patientId = typeof p.patient === 'object' ? p.patient?.id : p.patient;
              return patientId === user.id;
            })
          : list;
        if (active) setPrescriptions(mine);
      } catch (err) {
        if (active) setPrescriptions([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div className="ds-stack-lg">
      <PatientPrescriptionsHeader />
      <PatientPrescriptionsContent prescriptions={prescriptions} loading={loading} />
    </div>
  );
}