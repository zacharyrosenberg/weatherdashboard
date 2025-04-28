import { ReactNode } from 'react';

interface WeatherCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function WeatherCard({ title, children, className = '' }: WeatherCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
} 