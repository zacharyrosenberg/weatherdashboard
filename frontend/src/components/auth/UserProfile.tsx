'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/auth');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium hidden md:block">
          {user.name || user.email}
        </span>
      </button>

      <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none rounded-md">
        <div className="py-2 px-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        
        <div className="py-1">
          <button
            onClick={() => router.push('/profile')}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Settings
          </button>
          
          <button
            onClick={() => router.push('/saved-locations')}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Saved Locations
          </button>
        </div>
        
        <div className="py-1">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isLoading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  );
} 