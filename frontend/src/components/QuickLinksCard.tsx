import { Card, CardBody, CardTitle } from '../components/ui';
import { Icon } from '../components/icons';
import type { IconName } from '../components/icons';
import { Link } from 'react-router-dom';

interface QuickLink {
  label: string;
  to: string;
  icon?: IconName;
  description?: string;
}

interface QuickLinksCardProps {
  links: QuickLink[];
}

export default function QuickLinksCard({ links }: QuickLinksCardProps) {
  const items = Array.isArray(links) ? links : [];

  return (
    <Card>
      <CardBody>
        <CardTitle>Quick Links</CardTitle>
        {items.length === 0 ? (
          <p className="ds-muted">No quick links available right now.</p>
        ) : (
          <div className="ds-stack" style={{ gap: 'var(--space-sm)' }}>
            {items.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="ds-cluster"
                style={{
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                }}
              >
                <Icon name={link.icon || 'arrow-right'} size={18} />
                <span>
                  <strong>{link.label}</strong>
                  {link.description && (
                    <span className="ds-small ds-muted" style={{ display: 'block' }}>
                      {link.description}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}