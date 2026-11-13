import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getBillList } from '../api';
import type { Bill } from '../types';
import PatientBillsHeader from '../components/PatientBillsHeader';
import PatientBillsContent from '../components/PatientBillsContent';

export default function PatientBillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const loadBills = async () => {
      setLoading(true);
      try {
        const data = await getBillList();
        const mine = user
          ? (Array.isArray(data) ? data : []).filter((bill) => bill.patient === user.id)
          : data;
        if (active) {
          setBills(mine);
        }
      } catch (err) {
        if (active) {
          setBills([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadBills();
    return () => {
      active = false;
    };
  }, [user]);

  const unpaidCount = (Array.isArray(bills) ? bills : []).filter(
    (bill) => bill.status === 'pending' || bill.status === 'overdue'
  ).length;

  return (
    <div className="ds-stack-lg">
      <PatientBillsHeader unpaidCount={unpaidCount} />
      <PatientBillsContent bills={bills} loading={loading} />
    </div>
  );
}