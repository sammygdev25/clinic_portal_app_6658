import React, { useState } from 'react';
import { createVisitNote, updateVisitNote } from '../api';
import type { VisitNote } from '../types';
import { Button } from './ui';

interface VisitNoteFormProps {
  appointmentId: string;
  existingNote?: VisitNote | null;
  onSave: (note: VisitNote) => void;
}

export default function VisitNoteForm({ appointmentId, existingNote, onSave }: VisitNoteFormProps) {
  const [content, setContent] = useState<string>(existingNote?.content || '');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter the visit note content before saving.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      let saved: VisitNote;
      if (existingNote && existingNote.id) {
        saved = await updateVisitNote(existingNote.id, { content });
      } else {
        saved = await createVisitNote({ appointment: Number(appointmentId), content } as Partial<VisitNote>);
      }
      onSave(saved);
    } catch (err) {
      console.error('Failed to save visit note:', err);
      setError('Could not save the visit note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      <div className="ds-field">
        <label className="ds-label" htmlFor="visit-note-content">
          Visit Note
        </label>
        <textarea
          id="visit-note-content"
          className="input"
          rows={6}
          placeholder="Document the patient's symptoms, examination findings, assessment and treatment plan..."
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        />
        <p className="ds-help">
          This note is visible only to the patient and the treating doctor at Riverbend Family Clinic.
        </p>
      </div>
      {error && <p className="ds-small" style={{ color: 'var(--color-danger)' }}>{error}</p>}
      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : existingNote ? 'Update Visit Note' : 'Save Visit Note'}
        </Button>
      </div>
    </form>
  );
}