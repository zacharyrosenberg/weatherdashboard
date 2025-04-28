import WeatherCard from './WeatherCard';

interface ForecastDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

interface WeatherForecastProps {
  location: string;
  forecast: ForecastDay[];
}

export default function WeatherForecast({ location, forecast }: WeatherForecastProps) {
  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return dateString;
    }
  };

  // If no forecast data, show placeholder
  if (!forecast || forecast.length === 0) {
    return (
      <WeatherCard title={`Forecast for ${location}`}>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No forecast data available
        </div>
      </WeatherCard>
    );
  }

  // Group by date in case we get multiple entries per day
  const groupedByDate = forecast.reduce((acc: {[key: string]: ForecastDay}, day) => {
    // Get just the date part if there's a time component
    const dateKey = day.date.split(' ')[0].split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = {...day, date: dateKey};
    }
    
    return acc;
  }, {});
  
  // Convert back to array and take only the first 5 days
  const dailyForecast = Object.values(groupedByDate).slice(0, 5);

  return (
    <WeatherCard title={`${dailyForecast.length}-Day Forecast for ${location}`}>
      <div className="space-y-6">
        {dailyForecast.map((day, index) => (
          <div 
            key={day.date} 
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 items-center ${
              index < dailyForecast.length - 1 ? 'pb-6 border-b border-gray-200 dark:border-gray-700' : ''
            }`}
          >
            {/* Date and Weather Icon */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                className="w-10 h-10"
              />
              <div className="text-center md:text-left">
                <div className="font-medium text-gray-800 dark:text-white">
                  {formatDate(day.date)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {day.description}
                </div>
              </div>
            </div>

            {/* Temperature */}
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">Temp</div>
              <div className="text-xl font-medium text-gray-800 dark:text-white">
                {Math.round(day.minTemp)}° / {Math.round(day.maxTemp)}°
              </div>
            </div>

            {/* Precipitation */}
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">Precipitation</div>
              <div className="text-xl font-medium text-gray-800 dark:text-white">
                {Math.round(day.precipitation)}%
              </div>
            </div>

            {/* Wind */}
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">Wind</div>
              <div className="text-xl font-medium text-gray-800 dark:text-white">
                {Math.round(day.windSpeed)} m/s
              </div>
            </div>
          </div>
        ))}
      </div>
    </WeatherCard>
  );
} 