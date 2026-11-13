import { useEffect, useState } from 'react';
import type { DoctorProfile, Service } from '../types';
import { getDoctorProfileList, getServiceList } from '../api';
import HomeHero from '../components/HomeHero';
import HomeFeatured from '../components/HomeFeatured';
import HomeCategories from '../components/HomeCategories';
import HomeAbout from '../components/HomeAbout';
import HomeCta from '../components/HomeCta';

export default function HomePage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getDoctorProfileList();
        if (active) setDoctors(Array.isArray(data) && data.length > 0 ? data : [
          { id: 'sample-1', name: 'Dr. Sarah Chen', specialty: 'Family Medicine', imageUrl: '/img/brand/about.jpg' },
          { id: 'sample-2', name: 'Dr. James Patel', specialty: 'Pediatrics', imageUrl: '/img/brand/about.jpg' },
          { id: 'sample-3', name: 'Dr. Maria Gomez', specialty: 'Internal Medicine', imageUrl: '/img/brand/about.jpg' },
        ] as DoctorProfile[]);
      } catch {
        if (active) setDoctors([]);
      } finally {
        if (active) setLoadingDoctors(false);
      }
    })();

    (async () => {
      try {
        const data = await getServiceList();
        if (active) setServices(Array.isArray(data) ? data : []);
      } catch {
        if (active) setServices([]);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="ds-stack-lg">
      <HomeHero
        imageUrl="/img/brand/hero.jpg"
        primaryTo="/register"
        primaryLabel="Create patient account"
        secondaryTo="/login"
        secondaryLabel="Sign in"
      />
      <HomeFeatured doctors={doctors} loading={loadingDoctors} />
      <HomeCategories services={services} />
      <HomeAbout
        section={{
          eyebrow: 'About Riverbend',
          title: 'A family clinic that keeps your care connected',
          story:
            'Riverbend Family Clinic has served our community for over two decades, offering primary care, pediatrics, and preventive services. Our patient portal brings that same personal attention online — so scheduling, visit notes, prescriptions, and billing all live in one secure place for every patient and provider.',
          values: [
            { icon: 'heart', title: 'Easy scheduling', text: 'Book and manage appointments in a few clicks.' },
            { icon: 'shield', title: 'Secure records', text: 'Visit notes, prescriptions and documents stay private.' },
            { icon: 'users', title: 'Connected care', text: 'Doctors and front-desk staff coordinate in real time.' },
          ],
        }}
        page="HomePage"
      />
      <HomeCta page="HomePage" />
    </div>
  );
}
