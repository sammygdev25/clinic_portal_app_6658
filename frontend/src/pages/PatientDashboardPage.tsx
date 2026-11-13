import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PatientDashboardHeader from '../components/PatientDashboardHeader';
import PatientDashboardStats from '../components/PatientDashboardStats';
import PatientDashboardRecent from '../components/PatientDashboardRecent';
import PatientDashboardActions from '../components/PatientDashboardActions';
import { LoadingBlock } from '../components/ui';
import {
  getAppointmentList,
  getPrescriptionList,
  getBillList,
  getDocumentList,
} from '../api';
import type { Appointment, Prescription, Bill, Document } from '../types';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      try {
        const [appts, rx, billList, docs] = await Promise.all([
          getAppointmentList(),
          getPrescriptionList(),
          getBillList(),
          getDocumentList(),
        ]);
        if (!active) return;
        setAppointments(Array.isArray(appts) ? appts : []);
        setPrescriptions(Array.isArray(rx) ? rx : []);
        setBills(Array.isArray(billList) ? billList : []);
        setDocuments(Array.isArray(docs) ? docs : []);
      } catch (err) {
        if (active) {
          setAppointments([]);
          setPrescriptions([]);
          setBills([]);
          setDocuments([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const firstName = typeof user?.first_name === 'string' ? user.first_name : undefined;
  const username = typeof user?.username === 'string' ? user.username : undefined;
  const patientName = firstName || username || 'Patient';

  if (loading) {
    return <LoadingBlock label="Loading your dashboard..." />;
  }

  return (
    <div className="ds-stack-lg">
      <PatientDashboardHeader
        patientName={patientName}
        onBookAppointment={() => navigate('/patient/appointments')}
      />
      <PatientDashboardStats
        appointments={appointments}
        prescriptions={prescriptions}
        bills={bills}
        documents={documents}
      />
      <PatientDashboardRecent appointments={appointments} />
      <PatientDashboardActions />
    </div>
  );
}
