import React from 'react';
import { Link } from 'react-router-dom';
import { Hero, Button, Media } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeHeroProps {
  eyebrow?: string;
  title?: string;
  text?: string;
  imageUrl?: string;
  primaryTo?: string;
  primaryLabel?: string;
  secondaryTo?: string;
  secondaryLabel?: string;
}

export default function HomeHero({
  eyebrow = 'Riverbend Family Clinic',
  title = 'Your health, your schedule, your records — all in one place',
  text = 'Book appointments with our doctors, review visit notes and prescriptions, and manage your bills and documents without ever picking up the phone.',
  imageUrl = '/img/brand/hero.jpg',
  primaryTo = '/register',
  primaryLabel = 'Create patient account',
  secondaryTo = '/login',
  secondaryLabel = 'Sign in',
}: HomeHeroProps) {
  return (
    <Hero
      eyebrow={eyebrow}
      title={title}
      text={text}
      actions={
        <>
          <Button to={primaryTo} variant="primary" size="lg">
            {primaryLabel}
            <Icon name="arrow-right" size={18} />
          </Button>
          <Button to={secondaryTo} variant="ghost" size="lg">
            {secondaryLabel}
          </Button>
        </>
      }
      media={imageUrl ? <Media src={imageUrl} alt="Riverbend Family Clinic" ratio="wide" /> : undefined}
    />
  );
}