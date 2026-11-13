import { useState } from 'react';
import { createPrescription } from '../api';
import { Button } from '../components/ui';

interface PrescriptionFormProps {
  appointmentId: string;
  onSave: () => void;
}

export default function PrescriptionForm({ appointmentId, onSave }: PrescriptionFormProps) {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication.trim() || !dosage.trim()) {
      setError('Medication and dosage are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createPrescription({
        appointment: Number(appointmentId),
        medication: medication.trim(),
        dosage: dosage.trim(),
        instructions: instructions.trim(),
      });
      setMedication('');
      setDosage('');
      setInstructions('');
      onSave();
    } catch (err) {
      setError('Could not save the prescription. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      <div className="ds-field">
        <label className="ds-label" htmlFor="medication">Medication</label>
        <input
          id="medication"
          className="input"
          type="text"
          value={medication}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMedication(e.target.value)}
          placeholder="e.g. Amoxicillin 500mg"
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="dosage">Dosage</label>
        <input
          id="dosage"
          className="input"
          type="text"
          value={dosage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDosage(e.target.value)}
          placeholder="e.g. 1 capsule twice daily"
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          className="input"
          rows={4}
          value={instructions}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
          placeholder="Take with food, avoid alcohol, complete full course..."
        />
        <p className="ds-help">Optional guidance for the patient on how to take this medication.</p>
      </div>

      {error && <p className="ds-small" style={{ color: 'var(--color-danger)' }}>{error}</p>}

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving prescription...' : 'Add Prescription'}
        </Button>
      </div>
    </form>
  );
}