import React, { useState } from 'react';
import type { PatientProfile } from '../types';
import { Button } from './ui';

interface ProfileFormProps {
  profile: Partial<PatientProfile> | null;
  onSave: (data: Partial<PatientProfile>) => void | Promise<void>;
}

export default function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState<string>(profile?.date_of_birth || '');
  const [phone, setPhone] = useState<string>(profile?.phone || '');
  const [address, setAddress] = useState<string>(profile?.address || '');
  const [insuranceProvider, setInsuranceProvider] = useState<string>(profile?.insurance_provider || '');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState<string>(
    profile?.insurance_policy_number || ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave({
        date_of_birth: dateOfBirth || undefined,
        phone,
        address,
        insurance_provider: insuranceProvider,
        insurance_policy_number: insurancePolicyNumber,
      });
    } catch (err) {
      setError('Unable to save your profile. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <div className="ds-alert">{error}</div>}

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="date_of_birth">Date of birth</label>
          <input
            id="date_of_birth"
            type="date"
            className="input"
            value={dateOfBirth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            className="input"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="address">Home address</label>
        <textarea
          id="address"
          className="input"
          rows={3}
          placeholder="123 Riverbend Ave, Springfield"
          value={address}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)}
        />
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="insurance_provider">Insurance provider</label>
          <input
            id="insurance_provider"
            type="text"
            className="input"
            placeholder="e.g. Riverbend Health Insurance"
            value={insuranceProvider}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInsuranceProvider(e.target.value)}
          />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="insurance_policy_number">Policy number</label>
          <input
            id="insurance_policy_number"
            type="text"
            className="input"
            placeholder="Policy #"
            value={insurancePolicyNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInsurancePolicyNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </Button>
      </div>
    </form>
  );
}