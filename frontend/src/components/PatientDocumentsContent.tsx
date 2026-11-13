import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, SkeletonCards, EmptyState, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Document } from '../types';
import { Stack } from './ui/Grid';

interface PatientDocumentsContentProps {
  documents: Document[];
  loading: boolean;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  insurance_card: 'Insurance Card',
  lab_result: 'Lab Result',
  other: 'Other',
};

const DOC_TYPE_TONES: Record<string, 'primary' | 'soft' | 'success'> = {
  insurance_card: 'primary',
  lab_result: 'success',
  other: 'soft',
};

function fileName(path: string): string {
  if (!path) return 'document';
  const parts = path.split('/');
  return parts[parts.length - 1];
}

export default function PatientDocumentsContent({ documents, loading }: PatientDocumentsContentProps) {
  if (loading) {
    return (
      <Section eyebrow="Your Files" title="Uploaded Documents" tight>
        <SkeletonCards count={3} />
      </Section>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Section eyebrow="Your Files" title="Uploaded Documents" tight>
        <EmptyState
          icon="upload"
          title="No documents yet"
          text="Upload your insurance card or lab results so your Riverbend Family Clinic care team has what they need on file."
        />
      </Section>
    );
  }

  return (
    <Section eyebrow="Your Files" title="Uploaded Documents" subtitle="Insurance cards, lab results and other records on file with Riverbend Family Clinic." tight>
      <Grid size="md" cols={3}>
        {(Array.isArray(documents) ? documents : []).map((doc) => (
          <Card key={doc.id}>
            <CardBody>
              <Stack gap="sm">
                <Icon name="package" size={28} title={DOC_TYPE_LABELS[doc.doc_type] || 'Document'} />
                <CardTitle>{DOC_TYPE_LABELS[doc.doc_type] || 'Document'}</CardTitle>
                <CardMeta>{fileName(doc.file)}</CardMeta>
                <Badge tone={DOC_TYPE_TONES[doc.doc_type] || 'soft'}>
                  {DOC_TYPE_LABELS[doc.doc_type] || 'Other'}
                </Badge>
                <span className="ds-small ds-muted">
                  Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button variant="ghost" href={doc.file} rel="noreferrer">
                <Icon name="download" size={16} />
                View File
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}