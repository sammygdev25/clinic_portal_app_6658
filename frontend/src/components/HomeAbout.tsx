import { Section, Split, Card, CardBody, Stack } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeAboutValue {
  icon: 'shield' | 'users' | 'heart';
  title: string;
  text: string;
}

interface HomeAboutProps {
  section?: {
    eyebrow?: string;
    title?: string;
    story?: string;
    values?: HomeAboutValue[];
  };
  page?: string;
}

const defaultValues: HomeAboutValue[] = [
  {
    icon: 'shield',
    title: 'Trusted care, close to home',
    text: 'Our physicians and staff have served the Riverbend community for years, building lasting relationships with every family we treat.',
  },
  {
    icon: 'users',
    title: 'A team that knows your family',
    text: 'From routine checkups to ongoing treatment, our doctors and receptionists coordinate closely so your care never feels disjointed.',
  },
  {
    icon: 'heart',
    title: 'Patient-first scheduling',
    text: 'Book appointments, view visit notes, and manage prescriptions and bills online, whenever it fits your life.',
  },
];

export default function HomeAbout({ section }: HomeAboutProps) {
  const eyebrow = section?.eyebrow ?? 'About Our Clinic';
  const title = section?.title ?? 'Riverbend Family Clinic';
  const story =
    section?.story ??
    'Riverbend Family Clinic has long been a cornerstone of care in our community. Our patient portal brings together ' +
      'appointments, visit notes, prescriptions, bills, and documents in one secure place, so patients can focus on ' +
      'getting better and our doctors and receptionists can focus on delivering attentive, coordinated care.';
  const values = section?.values ?? defaultValues;

  return (
    <Section eyebrow={eyebrow} title={title}>
      <Split>
        <Stack gap="md">
          <p className="ds-lead">{story}</p>
          <p className="ds-muted">
            Whether you are scheduling a visit, reviewing a prescription, or checking on a bill, our portal keeps
            everything connected between you and your care team.
          </p>
        </Stack>
        <Stack gap="md">
          {(Array.isArray(values) ? values : []).map((value, idx) => (
            <Card key={idx}>
              <CardBody>
                <Stack gap="sm" align="center">
                  <Icon name={value.icon} size={24} />
                  <div>
                    <h3 className="ds-card-title">{value.title}</h3>
                    <p className="ds-small ds-muted">{value.text}</p>
                  </div>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      </Split>
    </Section>
  );
}