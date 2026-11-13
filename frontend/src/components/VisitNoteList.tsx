import type { VisitNote } from '../types';
import { Card, CardBody, CardMeta, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';

interface VisitNoteListProps {
  notes: VisitNote[];
}

export default function VisitNoteList({ notes }: VisitNoteListProps) {
  const safeNotes = Array.isArray(notes) ? notes : [];

  if (safeNotes.length === 0) {
    return (
      <EmptyState
        icon="book"
        title="No visit notes yet"
        text="Your doctor's notes from past appointments will appear here once they are written up."
      />
    );
  }

  return (
    <div className="ds-stack">
      {safeNotes.map((note) => (
        <Card key={note.id}>
          <CardBody>
            <div className="ds-between">
              <CardMeta>
                <Icon name="calendar" size={16} />
                {' '}
                {note.created_at
                  ? new Date(note.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Undated'}
              </CardMeta>
            </div>
            <p className="ds-lead">{note.content}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}