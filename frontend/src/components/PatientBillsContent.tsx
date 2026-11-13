import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Bill } from '../types';

interface PatientBillsContentProps {
  bills: Bill[];
  loading: boolean;
  onPay?: (bill: Bill) => void;
}

function statusTone(status: string): 'success' | 'danger' | 'soft' {
  if (status === 'paid') return 'success';
  if (status === 'overdue') return 'danger';
  return 'soft';
}

export default function PatientBillsContent({ bills, loading, onPay }: PatientBillsContentProps) {
  if (loading) {
    return (
      <Section title="Your Bills" subtitle="Charges generated from your visits at Riverbend Family Clinic">
        <SkeletonCards count={4} />
      </Section>
    );
  }

  if (!bills || bills.length === 0) {
    return (
      <Section title="Your Bills" subtitle="Charges generated from your visits at Riverbend Family Clinic">
        <EmptyState
          icon="dollar"
          title="No bills yet"
          text="Once you complete an appointment, any charges from Riverbend Family Clinic will appear here."
        />
      </Section>
    );
  }

  return (
    <Section title="Your Bills" subtitle="Charges generated from your visits at Riverbend Family Clinic">
      <Grid size="md" cols={3}>
        {(Array.isArray(bills) ? bills : []).map((bill) => (
          <Card key={bill.id}>
            <CardBody>
              <CardTitle>${Number(bill.amount).toFixed(2)}</CardTitle>
              <CardMeta>
                <Icon name="calendar" size={14} /> Due {bill.due_date ? new Date(bill.due_date).toLocaleDateString('en-US') : 'N/A'}
              </CardMeta>
              <Badge tone={statusTone(bill.status)}>{bill.status}</Badge>
            </CardBody>
            <CardFooter>
              {bill.status !== 'paid' && onPay ? (
                <button className="btn btn-primary" onClick={() => onPay(bill)}>
                  <Icon name="credit-card" size={16} /> Pay now
                </button>
              ) : (
                <span className="ds-small ds-muted">
                  <Icon name="check" size={14} /> Settled
                </span>
              )}
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}