'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';

export default function SavedLocationsPage() {
  return (
    <AuthGuard>
      <SavedLocationsContent />
    </AuthGuard>
  );
}

// Mock data for saved locations
const MOCK_LOCATIONS = [
  { id: '1', name: 'New York', country: 'United States' },
  { id: '2', name: 'London', country: 'United Kingdom' },
  { id: '3', name: 'Tokyo', country: 'Japan' },
];

function SavedLocationsContent() {
  const [locations, setLocations] = useState(MOCK_LOCATIONS);
  const [newLocation, setNewLocation] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setMessage('');
    
    if (!newLocation.trim()) {
      setMessage('Please enter a location name');
      setIsAdding(false);
      return;
    }
    
    // In a real app, this would make an API call to search for the location
    setTimeout(() => {
      const newId = `${Date.now()}`;
      
      // Add the new location
      setLocations([
        ...locations,
        { 
          id: newId, 
          name: newLocation, 
          country: 'Not specified' 
        }
      ]);
      
      // Reset form
      setNewLocation('');
      setMessage('Location added successfully!');
      setIsAdding(false);
    }, 1000);
  };
  
  const handleRemoveLocation = (id: string) => {
    setLocations(locations.filter(location => location.id !== id));
    setMessage('Location removed');
  };
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Saved Locations
        </h1>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {locations.length === 0 ? (
              <li className="px-6 py-4 text-gray-500 dark:text-gray-400">
                No saved locations. Add your first location below.
              </li>
            ) : (
              locations.map(location => (
                <li key={location.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {location.country}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRemoveLocation(location.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Add New Location
          </h2>
          
          <form onSubmit={handleAddLocation}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isAdding}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                         text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 