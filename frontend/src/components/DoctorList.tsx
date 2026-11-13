import { Grid, Card, CardBody, CardTitle, CardMeta, Media, EmptyState, Badge } from '../components/ui';
import type { DoctorProfile } from '../types';

interface DoctorListProps {
  doctors: DoctorProfile[];
}

export default function DoctorList({ doctors }: DoctorListProps) {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No doctors listed yet"
        text="Our care team at Riverbend Family Clinic will appear here once added."
      />
    );
  }

  return (
    <Grid size="md" cols={3}>
      {doctors.map((doctor) => {
        const name =
          (doctor as any).user?.first_name && (doctor as any).user?.last_name
            ? `Dr. ${(doctor as any).user?.first_name} ${(doctor as any).user?.last_name}`
            : (doctor as any).user?.username
            ? `Dr. ${(doctor as any).user?.username}`
            : doctor.specialty;

        return (
          <Card key={doctor.id}>
            <Media
              src={doctor.photo || ''}
              alt={name}
              ratio="square"
              badge={<Badge tone="primary">{doctor.specialty}</Badge>}
            />
            <CardBody>
              <CardTitle>{name}</CardTitle>
              <CardMeta>{doctor.specialty}</CardMeta>
              {doctor.bio && <p className="ds-muted ds-small">{doctor.bio}</p>}
            </CardBody>
          </Card>
        );
      })}
    </Grid>
  );
}