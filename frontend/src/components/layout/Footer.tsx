import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} Weather Dashboard. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
              About
            </Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
              Terms
            </Link>
          </div>

          {/* Attribution */}
          <div className="text-gray-600 dark:text-gray-300 text-sm mt-4 md:mt-0">
            Weather data provided by OpenWeatherMap
          </div>
        </div>
      </div>
    </footer>
  );
} 