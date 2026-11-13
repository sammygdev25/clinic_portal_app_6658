import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Media } from '../components/ui';
import { Icon } from '../components/icons';
import type { DoctorProfile } from '../types';

interface DoctorAppointmentDetailRelatedProps {
  doctors: DoctorProfile[];
}

export default function DoctorAppointmentDetailRelated({ doctors }: DoctorAppointmentDetailRelatedProps) {
  if (!doctors || doctors.length === 0) {
    return null;
  }

  const items = doctors.slice(0, 6);

  return (
    <Section
      eyebrow="Riverbend Family Clinic"
      title="Other Doctors at the Clinic"
      subtitle="Colleagues the patient may also see for follow-up or specialist care"
      tight
    >
      <Grid size="sm">
        {(Array.isArray(items) ? items : []).map((doctor) => (
          <Card key={doctor.id}>
            <Media
              src={doctor.photo || ''}
              alt={doctor.specialty}
              ratio="square"
            />
            <CardBody>
              <CardTitle>
                {doctor.specialty ? `Dr. ${doctor.specialty}` : 'Clinic Doctor'}
              </CardTitle>
              <CardMeta>
                <Icon name="award" size={14} /> {doctor.specialty}
              </CardMeta>
              {doctor.bio ? <p className="ds-muted ds-small">{doctor.bio}</p> : null}
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
