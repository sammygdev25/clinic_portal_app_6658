import type { Service } from '../types';
import { Card, CardBody, CardTitle, CardMeta, EmptyState, Grid } from '../components/ui';
import { Icon } from '../components/icons';

interface ServiceListProps {
  services: Service[];
}

export default function ServiceList({ services }: ServiceListProps) {
  if (!Array.isArray(services) || services.length === 0) {
    return (
      <EmptyState
        icon="info"
        title="No services listed yet"
        text="Riverbend Family Clinic hasn't published its service offerings yet. Please check back soon."
      />
    );
  }

  return (
    <Grid size="md" cols={3}>
      {services.map((service) => (
        <Card key={service.id}>
          <CardBody>
            <Icon name="award" size={20} />
            <CardTitle>{service.name}</CardTitle>
            {service.description && (
              <CardMeta>{service.description}</CardMeta>
            )}
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}