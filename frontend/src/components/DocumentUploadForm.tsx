import { useState, FormEvent } from 'react';
import { createDocument } from '../api';
import { Button, Alert } from './ui';
import { Icon } from './icons';
import type { Document } from '../types';

interface DocumentUploadFormProps {
  onUpload: (document: Document) => void;
}

const DOC_TYPE_OPTIONS: { value: Document['doc_type']; label: string }[] = [
  { value: 'insurance_card', label: 'Insurance Card' },
  { value: 'lab_result', label: 'Lab Result' },
  { value: 'other', label: 'Other' },
];

export default function DocumentUploadForm({ onUpload }: DocumentUploadFormProps) {
  const [docType, setDocType] = useState<Document['doc_type']>('other');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createDocument({
        doc_type: docType,
        file,
      } as unknown as Partial<Document>);
      onUpload(created as Document);
      setDocType('other');
      setFile(null);
      const fileInput = document.getElementById('document-file-input') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      setError('Upload failed. Please check the file and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="ds-field">
        <label className="ds-label" htmlFor="document-type-select">
          Document Type
        </label>
        <select
          id="document-type-select"
          className="input"
          value={docType}
          onChange={(e) => setDocType(e.target.value as Document['doc_type'])}
        >
          {DOC_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="document-file-input">
          File
        </label>
        <input
          id="document-file-input"
          className="input"
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        <p className="ds-help">Upload insurance cards, lab results, or other clinic documents.</p>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          <Icon name="upload" size={16} />
          {submitting ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
}
