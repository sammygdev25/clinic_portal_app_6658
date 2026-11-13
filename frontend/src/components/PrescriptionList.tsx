import type { Prescription } from '../types';
import { Card, CardBody, CardTitle, CardMeta, EmptyState } from './ui';
import { Icon } from './icons';

interface PrescriptionListProps {
  prescriptions: Prescription[];
}

export default function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  const list = Array.isArray(prescriptions) ? prescriptions : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No prescriptions yet"
        text="Prescriptions written by your doctor during a visit will appear here."
      />
    );
  }

  return (
    <div className="ds-stack">
      {list.map((prescription) => (
        <Card key={prescription.id}>
          <CardBody>
            <div className="ds-between">
              <CardTitle>{prescription.medication}</CardTitle>
              <span className="ds-small ds-muted">
                {new Date(prescription.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <CardMeta>
              <Icon name="info" size={14} /> Dosage: {prescription.dosage}
            </CardMeta>
            {prescription.instructions ? (
              <p className="ds-muted ds-small">{prescription.instructions}</p>
            ) : (
              <p className="ds-muted ds-small">No additional instructions provided.</p>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}