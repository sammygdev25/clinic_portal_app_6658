import type { VisitNote } from '../types';
import { Card, CardBody, CardTitle, CardMeta, EmptyState, Stack, Badge } from '../components/ui';
import { formatDate } from '../utils';

interface PatientVisitHistoryListProps {
  visits: VisitNote[];
}

export default function PatientVisitHistoryList({ visits }: PatientVisitHistoryListProps) {
  const list = Array.isArray(visits) ? visits : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="book"
        title="No past visits on record"
        text="This patient has no documented visit notes yet at Riverbend Family Clinic."
      />
    );
  }

  return (
    <Stack gap="sm">
      {list.map((visit) => (
        <Card key={visit.appointment}>
          <CardBody>
            <Stack gap="xs">
              <div className="ds-between">
                <CardTitle>Visit Note</CardTitle>
                <Badge tone="soft">{formatDate(visit.created_at)}</Badge>
              </div>
              <CardMeta>{visit.content}</CardMeta>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}