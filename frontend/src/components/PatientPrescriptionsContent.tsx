import { Card, CardBody, CardTitle, CardMeta, Grid, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Prescription } from '../types';

interface PatientPrescriptionsContentProps {
  prescriptions: Prescription[];
  loading?: boolean;
}

export default function PatientPrescriptionsContent({ prescriptions, loading = false }: PatientPrescriptionsContentProps) {
  if (loading) {
    return <SkeletonCards count={4} />;
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No prescriptions yet"
        text="Medications prescribed by your doctor at Riverbend Family Clinic will appear here after your visit."
      />
    );
  }

  return (
    <Grid size="md" cols={2}>
      {(Array.isArray(prescriptions) ? prescriptions : []).map((prescription) => (
        <Card key={prescription.id}>
          <CardBody>
            <CardTitle>
              <Icon name="package" size={18} /> {prescription.medication}
            </CardTitle>
            <CardMeta>Dosage: {prescription.dosage}</CardMeta>
            {prescription.instructions && (
              <p className="ds-muted ds-small">{prescription.instructions}</p>
            )}
            <CardMeta>
              Prescribed {new Date(prescription.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </CardMeta>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}