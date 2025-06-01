import React from 'react';
// Next.js page for managing contacts
// Uses components/ContactsManager.tsx

// Import Navbar component
import Navbar from '../components/Navbar';
import ContactsManager from '../components/ContactsManager';

export default function ContactsPage() {
  return (
    <>
      {/* Navbar at the top */}
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-2xl font-bold mb-8">Contacts</h1>
        <ContactsManager />
      </div>
    </>
  );
}
