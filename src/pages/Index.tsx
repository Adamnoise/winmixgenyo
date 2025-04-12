
import React from 'react';
import Header from '@/components/Header';
import { ContentProvider } from '@/context/ContentContext';
import { ContentDisplay } from '@/components/ContentCreator/ContentDisplay';
import { Drawer } from '@/components/ui/drawer';
import { ContentCreationDrawer } from '@/components/ContentCreator/ContentCreationDrawer';

const Index = () => {
  return (
    <ContentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300" >
        <Drawer>
          <Header />
          <div className="container mx-auto px-4">
            <div className="py-4">
              <h1 className="text-3xl font-bold text-center text-white mb-2">Winmix Portfólió</h1>
              <p className="text-center text-gray-400 mb-6">Szakmai Adattudományi Tapasztalat Egy Futballkörnyezetben</p>
            </div>
            <ContentDisplay />
          </div>
          <ContentCreationDrawer />
        </Drawer>
      </div>
    </ContentProvider>
  );
};

export default Index;
