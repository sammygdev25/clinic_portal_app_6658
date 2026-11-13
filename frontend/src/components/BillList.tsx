import type { Bill } from '../types';
import { Card, CardBody, CardTitle, CardMeta, CardFooter, Badge, EmptyState, Price } from '../components/ui';
import { formatDate } from '../utils';

interface BillListProps {
  bills: Bill[];
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'paid':
      return 'success';
    case 'overdue':
      return 'danger';
    case 'pending':
    default:
      return 'soft';
  }
}

function BillList({ bills }: BillListProps) {
  const list = Array.isArray(bills) ? bills : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="dollar"
        title="No bills yet"
        text="Bills generated from your appointments will show up here once your visit has been processed."
      />
    );
  }

  return (
    <div className="ds-grid ds-grid-sm">
      {list.map((bill) => (
        <Card key={bill.id}>
          <CardBody>
            <div className="ds-between">
              <CardTitle>Bill #{bill.id}</CardTitle>
              <Badge tone={statusTone(bill.status)}>
                {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
              </Badge>
            </div>
            <CardMeta>
              Appointment #{bill.appointment}
              {bill.due_date ? ` · Due ${formatDate(bill.due_date)}` : ''}
            </CardMeta>
            <Price value={Number(bill.amount)} />
            <CardFooter>
              <span className="ds-small ds-muted">
                Created {formatDate(bill.created_at)}
              </span>
            </CardFooter>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default BillList;