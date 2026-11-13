import type { DoctorProfile } from '../types';
import { Section, Grid, Card, CardBody, Media, CardTitle, CardMeta, Badge, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeFeaturedProps {
  doctors: DoctorProfile[];
  loading?: boolean;
}

export default function HomeFeatured({ doctors, loading = false }: HomeFeaturedProps) {
  return (
    <Section
      eyebrow="Our Team"
      title="Meet Our Physicians"
      subtitle="Board-certified doctors dedicated to your family's health at Riverbend Family Clinic"
    >
      {loading ? (
        <SkeletonCards count={6} />
      ) : doctors.length === 0 ? (
        <EmptyState
          icon="users"
          title="No doctors listed yet"
          text="Check back soon to meet our growing team of physicians."
        />
      ) : (
        <Grid size="md" cols={4}>
          {doctors.slice(0, 8).map((doctor) => (
            <Card key={doctor.id}>
              <Media
                src={doctor.photo || ''}
                alt={'Dr. ' + doctor.specialty}
                ratio="portrait"
              />
              <CardBody>
                <CardTitle>{'Dr. ' + doctor.specialty}</CardTitle>
                <CardMeta>
                  <Icon name="award" size={14} /> {doctor.specialty}
                </CardMeta>
                {doctor.bio ? (
                  <p className="ds-small ds-muted">{doctor.bio.slice(0, 90)}{doctor.bio.length > 90 ? '…' : ''}</p>
                ) : (
                  <Badge tone="soft">Accepting new patients</Badge>
                )}
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Section>
  );
}
