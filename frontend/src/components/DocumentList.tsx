import { Card, CardBody, CardTitle, CardMeta, CardFooter, EmptyState, Badge, Icon } from '../components/ui';
import type { Document } from '../types';
import { formatDate } from '../utils';

interface DocumentListProps {
  documents: Document[];
}

const DOC_TYPE_LABELS: Record<string, string> = {
  insurance_card: 'Insurance Card',
  lab_result: 'Lab Result',
  other: 'Other',
};

const DOC_TYPE_TONES: Record<string, 'primary' | 'soft' | 'neutral'> = {
  insurance_card: 'primary',
  lab_result: 'soft',
  other: 'neutral',
};

function fileName(fileUrl: string): string {
  if (!fileUrl) return 'Document';
  const parts = fileUrl.split('/');
  return parts[parts.length - 1] || 'Document';
}

function DocumentList({ documents }: DocumentListProps) {
  const docs = Array.isArray(documents) ? documents : [];

  if (docs.length === 0) {
    return (
      <EmptyState
        icon="upload"
        title="No documents uploaded yet"
        text="Upload your insurance card, lab results or other paperwork so your care team has everything on file."
      />
    );
  }

  return (
    <div className="ds-grid ds-grid-sm">
      {docs.map((doc) => (
        <Card key={doc.id}>
          <CardBody>
            <Badge tone={DOC_TYPE_TONES[doc.doc_type] || 'neutral'}>
              {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
            </Badge>
            <CardTitle>{fileName(doc.file)}</CardTitle>
            <CardMeta>
              <Icon name="calendar" size={14} /> Uploaded {formatDate(doc.uploaded_at)}
            </CardMeta>
            <CardFooter>
              <a
                className="btn btn-secondary"
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Icon name="download" size={16} /> View
              </a>
            </CardFooter>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default DocumentList;