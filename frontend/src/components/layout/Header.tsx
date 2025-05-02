'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import UserProfile from '../auth/UserProfile';

export default function Header() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
            Weather Dashboard
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link href="/forecast" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Forecast
            </Link>
            <Link href="/locations" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Locations
            </Link>
            <Link href="/preferences" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Preferences
            </Link>
          </div>

          {/* User Profile or Login/Register */}
          <div className="hidden md:block">
            {user ? (
              <UserProfile />
            ) : (
              <Link 
                href="/auth" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                          text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                          focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 dark:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden mt-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link href="/forecast" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Forecast
            </Link>
            <Link href="/locations" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Locations
            </Link>
            <Link href="/preferences" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Preferences
            </Link>
            
            {/* Mobile Auth Button */}
            {user ? (
              <Link 
                href="/profile" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                My Profile
              </Link>
            ) : (
              <Link 
                href="/auth" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 