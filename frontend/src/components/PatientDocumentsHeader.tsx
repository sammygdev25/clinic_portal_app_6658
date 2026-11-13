import { PageHeader } from '../components/ui';

interface PatientDocumentsHeaderProps {
  documentCount?: number;
}

export default function PatientDocumentsHeader({ documentCount }: PatientDocumentsHeaderProps) {
  const subtitle =
    typeof documentCount === 'number'
      ? `${documentCount} file${documentCount === 1 ? '' : 's'} on record, including insurance cards and lab results`
      : 'Upload and manage your insurance cards, lab results and other clinic paperwork';

  return (
    <PageHeader
      eyebrow="Riverbend Family Clinic"
      title="My Documents"
      subtitle={subtitle}
    />
  );
}