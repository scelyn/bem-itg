import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AspirasiModal } from '../common/AspirasiModal';
import { InfoModal } from '../common/InfoModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-white text-brand-navy flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-navy overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* Global Modals */}
      <AspirasiModal />
      <InfoModal />
    </div>
  );
};

