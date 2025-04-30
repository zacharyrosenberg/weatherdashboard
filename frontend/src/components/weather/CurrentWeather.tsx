import WeatherCard from './WeatherCard';

interface CurrentWeatherProps {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  icon: string;
}

export default function CurrentWeather({
  location,
  temperature,
  feelsLike,
  description,
  humidity,
  windSpeed,
  windDirection,
  icon,
}: CurrentWeatherProps) {
  return (
    <WeatherCard title={`Current Weather in ${location}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature and Description */}
        <div className="flex items-center space-x-4">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-16 h-16"
          />
          <div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {Math.round(temperature)}°F
            </div>
            <div className="text-gray-600 dark:text-gray-300 capitalize">
              {description}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Feels like {Math.round(feelsLike)}°F
            </div>
          </div>
        </div>

        {/* Additional Weather Details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Humidity</span>
            <span className="text-gray-800 dark:text-white">{humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Wind Speed</span>
            <span className="text-gray-800 dark:text-white">{windSpeed} mph</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Wind Direction</span>
            <span className="text-gray-800 dark:text-white">{windDirection}°</span>
          </div>
        </div>
      </div>
    </WeatherCard>
  );
} 