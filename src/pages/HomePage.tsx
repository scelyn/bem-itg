import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { OrganizationPreview } from '../components/home/OrganizationPreview';
import { LatestNewsSection } from '../components/home/LatestNewsSection';
import { AspirationsSection } from '../components/home/AspirationsSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <OrganizationPreview />
      <LatestNewsSection />
      <AspirationsSection />
    </>
  );
};
