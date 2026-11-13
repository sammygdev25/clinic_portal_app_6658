import React from 'react';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { VisitNote } from '../types';

interface PatientVisitNotesContentProps {
  notes: VisitNote[];
  loading: boolean;
}

export default function PatientVisitNotesContent({ notes, loading }: PatientVisitNotesContentProps) {
  if (loading) {
    return (
      <Section title="Your visit notes" subtitle="Notes written by your treating doctor after each appointment">
        <SkeletonCards count={3} />
      </Section>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Section title="Your visit notes" subtitle="Notes written by your treating doctor after each appointment">
        <EmptyState
          icon="book"
          title="No visit notes yet"
          text="Once a doctor at Riverbend Family Clinic completes your appointment and writes up a note, it will appear here."
        />
      </Section>
    );
  }

  return (
    <Section title="Your visit notes" subtitle="Notes written by your treating doctor after each appointment">
      <Grid size="md" cols={2}>
        {(Array.isArray(notes) ? notes : []).map((note) => (
          <Card key={note.id}>
            <CardBody>
              <CardTitle>
                <Icon name="book" size={18} /> Visit note
              </CardTitle>
              <CardMeta>
                {new Date(note.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </CardMeta>
              <p className="ds-muted">{note.content}</p>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}