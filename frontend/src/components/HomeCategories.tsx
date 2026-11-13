import { Section, Grid, Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { Service } from '../types';

interface HomeCategoriesProps {
  services: Service[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function HomeCategories({ services }: HomeCategoriesProps) {
  const items = Array.isArray(services) ? services.slice(0, 8) : [];

  return (
    <Section
      eyebrow="Our care"
      title="Browse by service"
      subtitle="Find the right type of care for your visit to Riverbend Family Clinic."
    >
      {items.length === 0 ? (
        <Grid size="sm" cols={3}>
          <Card>
            <CardBody>
              <Icon name="calendar" size={20} />
              <CardTitle>Book an appointment</CardTitle>
              <CardMeta>Choose a time that works for you and a doctor on our team.</CardMeta>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Icon name="user" size={20} />
              <CardTitle>Meet your doctor</CardTitle>
              <CardMeta>Get matched with a physician who knows your history.</CardMeta>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Icon name="check" size={20} />
              <CardTitle>Get care</CardTitle>
              <CardMeta>Receive notes, prescriptions and bills right in your portal.</CardMeta>
            </CardBody>
          </Card>
        </Grid>
      ) : (
        <Grid size="sm" cols={4}>
          {items.map((service) => (
            <Card key={service.id} to={`/?category=${slugify(service.name)}`}>
              <CardBody>
                <Icon name="tag" size={20} />
                <CardTitle>{service.name}</CardTitle>
                {service.description ? (
                  <CardMeta>{service.description}</CardMeta>
                ) : (
                  <CardMeta>Learn more about this service at Riverbend Family Clinic.</CardMeta>
                )}
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}