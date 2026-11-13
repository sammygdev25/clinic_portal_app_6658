import { PageHeader } from '../components/ui';

interface PatientVisitNotesHeaderProps {
  noteCount?: number;
}

export default function PatientVisitNotesHeader({ noteCount }: PatientVisitNotesHeaderProps) {
  const subtitle =
    typeof noteCount === 'number'
      ? `${noteCount} visit note${noteCount === 1 ? '' : 's'} on file from your care team at Riverbend Family Clinic`
      : 'A record of what your doctor wrote after each visit, kept private between you and your treating physician';

  return (
    <PageHeader
      eyebrow="Patient Portal"
      title="Visit Notes"
      subtitle={subtitle}
    />
  );
}