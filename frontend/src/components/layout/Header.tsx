import Link from 'next/link';

export default function Header() {
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

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 dark:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation (hidden by default) */}
        <div className="hidden md:hidden mt-4">
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
          </div>
        </div>
      </nav>
    </header>
  );
} 