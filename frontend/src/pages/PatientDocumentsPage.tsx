import { useCallback, useEffect, useState } from 'react';
import PatientDocumentsHeader from '../components/PatientDocumentsHeader';
import PatientDocumentsContent from '../components/PatientDocumentsContent';
import DocumentUploadForm from '../components/DocumentUploadForm';
import { Alert } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { getDocumentList } from '../api';
import type { Document } from '../types';

export default function PatientDocumentsPage() {
  useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocumentList();
      setDocuments(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Unable to load your documents right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = useCallback(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="ds-stack-lg">
      <PatientDocumentsHeader documentCount={documents.length} />
      <DocumentUploadForm onUpload={handleUpload} />
      {error && <Alert tone="danger">{error}</Alert>}
      <PatientDocumentsContent documents={documents} loading={loading} />
    </div>
  );
}