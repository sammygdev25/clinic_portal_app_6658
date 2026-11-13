import { useEffect, useState } from 'react';
import { getVisitNoteList } from '../api';
import { useAuth } from '../contexts/AuthContext';
import PatientVisitNotesHeader from '../components/PatientVisitNotesHeader';
import PatientVisitNotesContent from '../components/PatientVisitNotesContent';
import type { VisitNote } from '../types';

export default function PatientVisitNotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<VisitNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadNotes() {
      setLoading(true);
      try {
        const data = await getVisitNoteList();
        const allNotes = Array.isArray(data) ? data : [];
        const patientNotes = user
          ? allNotes.filter((n: any) => n.patient === user.id || n.patient?.id === user.id)
          : allNotes;
        if (isMounted) setNotes(patientNotes);
      } catch (err) {
        if (isMounted) setNotes([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadNotes();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="ds-stack-lg">
      <PatientVisitNotesHeader noteCount={notes.length} />
      <PatientVisitNotesContent notes={notes} loading={loading} />
    </div>
  );
}