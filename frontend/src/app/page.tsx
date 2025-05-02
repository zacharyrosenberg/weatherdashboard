'use client';

import { useState } from 'react';
import CurrentWeather from '@/components/weather/CurrentWeather';
import WeatherForecast from '@/components/weather/WeatherForecast';
import { useCurrentWeather, useForecast } from '@/lib/hooks/useWeather';

// Define types for forecast data
interface ForecastItem {
  date?: string;
  temperature?: {
    min?: number;
    max?: number;
  };
  minTemp?: number;
  maxTemp?: number;
  temp?: {
    min?: number;
    max?: number;
  };
  main?: {
    temp_min?: number;
    temp_max?: number;
    humidity?: number;
  };
  weather?: {
    description?: string;
    icon?: string;
  } | Array<{
    description?: string;
    icon?: string;
  }>;
  precipitation?: number | { probability?: number };
  pop?: number;
  humidity?: number;
  wind?: {
    avg?: number;
    speed?: number;
    max?: number;
  };
  windSpeed?: number;
}

export default function Home() {
  const [location, setLocation] = useState('London'); // Default location
  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useCurrentWeather(location);
  const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useForecast(location);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchLocation = formData.get('location') as string;
    if (searchLocation) {
      setLocation(searchLocation);
    }
  };

  // Function to process forecast data for our component
  const processForecastData = () => {
    try {
      if (!forecastData) return [];
      
      // First convert to unknown, then to Record<string, unknown> to avoid type errors
      const anyData = (forecastData as unknown) as Record<string, unknown>;
      let forecastItems: ForecastItem[] = [];
      
      // Try to get the forecast array
      if (Array.isArray(anyData.forecast)) {
        forecastItems = anyData.forecast as ForecastItem[];
      } else if (anyData.forecast && typeof anyData.forecast === 'object') {
        // If forecast is an object but not an array, it might be wrapped in another object
        const forecastObj = anyData.forecast as Record<string, unknown>;
        if (Array.isArray(forecastObj.list)) {
          forecastItems = forecastObj.list as ForecastItem[];
        }
      }
      
      // Try other common structures if we still don't have items
      if (forecastItems.length === 0) {
        if (Array.isArray(anyData.list)) {
          forecastItems = anyData.list as ForecastItem[];
        } else if (anyData.daily && Array.isArray(anyData.daily)) {
          forecastItems = anyData.daily as ForecastItem[];
        }
      }
      
      // Map the items to our expected format
      return forecastItems.map((item: ForecastItem, index: number) => {
        // Extract date
        const dateValue = item.date || new Date(Date.now() + index * 86400000).toISOString().split('T')[0];
        
        // Extract temperatures based on the specific structure
        let minTemp = 0;
        let maxTemp = 0;
        
        if (item.temperature) {
          // Handle the specific structure from your API
          minTemp = item.temperature.min || 0;
          maxTemp = item.temperature.max || 0;
        } else {
          // Fallbacks for other formats
          minTemp = item.minTemp || (item.temp?.min) || (item.main?.temp_min) || 0;
          maxTemp = item.maxTemp || (item.temp?.max) || (item.main?.temp_max) || 0;
        }
        
        // Extract weather description and icon based on your specific structure
        let weatherDescription = 'Weather data unavailable';
        let weatherIcon = '01d';
        
        if (item.weather) {
          if (typeof item.weather === 'object' && !Array.isArray(item.weather)) {
            // Handle your API's structure where weather is a single object
            weatherDescription = item.weather.description || 'Weather data unavailable';
            weatherIcon = item.weather.icon || '01d';
          } else if (Array.isArray(item.weather) && item.weather[0]) {
            // Handle common structure where weather is an array
            weatherDescription = item.weather[0].description || 'Weather data unavailable';
            weatherIcon = item.weather[0].icon || '01d';
          }
        }
        
        // Extract precipitation based on your specific structure
        let precipitation = 0;
        if (item.precipitation) {
          // Handle your API's structure
          precipitation = typeof item.precipitation === 'number' 
            ? item.precipitation
            : (item.precipitation.probability !== undefined 
                ? item.precipitation.probability * 100 
                : 0);
        } else if (typeof item.pop === 'number') {
          // OpenWeatherMap format
          precipitation = item.pop * 100;
        }
        
        // Extract humidity
        let humidity = item.humidity || 0;
        if (typeof humidity !== 'number' && item.main && typeof item.main.humidity === 'number') {
          humidity = item.main.humidity;
        }
        
        // Extract wind speed based on your specific structure
        let windSpeed = 0;
        if (item.wind) {
          // Handle your API's structure where wind might have avg or speed
          windSpeed = item.wind.avg || item.wind.speed || item.wind.max || 0;
        } else if (typeof item.windSpeed === 'number') {
          windSpeed = item.windSpeed;
        }
        
        const result = {
          date: dateValue,
          minTemp,
          maxTemp,
          description: weatherDescription,
          icon: weatherIcon,
          precipitation,
          humidity,
          windSpeed
        };
        
        return result;
      });
    } catch (err) {
      console.error('Error processing forecast data:', err);
      return [];
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            name="location"
            placeholder="Enter city name or coordinates"
            className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            defaultValue={location}
          />
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-r-md transition-colors duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Current Weather */}
      <div>
        {weatherLoading && <div className="text-center">Loading weather data...</div>}
        {weatherError && <div className="text-center text-red-500">Error: {weatherError.message}</div>}
        {weatherData && (
          <CurrentWeather
            location={weatherData.location.name}
            temperature={weatherData.current.temperature.actual}
            feelsLike={weatherData.current.temperature.feelsLike}
            description={weatherData.current.weather.description}
            humidity={weatherData.current.humidity}
            windSpeed={weatherData.current.wind.speed}
            windDirection={weatherData.current.wind.direction}
            icon={weatherData.current.weather.icon}
          />
        )}
      </div>

      {/* Forecast */}
      <div>
        {forecastLoading && <div className="text-center">Loading forecast data...</div>}
        {forecastError && <div className="text-center text-red-500">Error: {forecastError.message}</div>}
        {forecastData && (
          <WeatherForecast
            location={forecastData.location ? forecastData.location.name : location}
            forecast={processForecastData()}
          />
        )}
      </div>
    </div>
  );
}
