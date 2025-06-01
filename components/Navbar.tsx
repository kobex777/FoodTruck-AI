// Navbar component for navigation between Home and Contacts
// Uses Next.js Link and Tailwind for styling

import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    // Navigation bar container
    <nav className="w-full bg-white shadow mb-8">
      <div className="max-w-xl mx-auto flex justify-center gap-8 py-4">
        {/* Home link */}
        <Link href="/" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">
          Home
        </Link>
        {/* Contacts link */}
        <Link href="/contacts" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">
          Contacts
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
