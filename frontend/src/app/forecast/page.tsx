'use client';

import { useState } from 'react';
import { useForecast } from '@/lib/hooks/useWeather';
import WeatherForecast from '@/components/weather/WeatherForecast';

export default function ForecastPage() {
    const [location, setLocation] = useState('London');
    const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useForecast(location);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchLocation = formData.get('location') as string;
        if (searchLocation) {
            setLocation(searchLocation);
        }   
    };

    const processForecastData = () => {
        try {
          // Detect the structure of the forecast data
          const anyData = forecastData as any;
          let forecastItems: any[] = [];
          
          // Try to get the forecast array
          if (Array.isArray(anyData.forecast)) {
            forecastItems = anyData.forecast;
          } else if (anyData.forecast && typeof anyData.forecast === 'object') {
            // If forecast is an object but not an array, it might be wrapped in another object
            if (Array.isArray(anyData.forecast.list)) {
              forecastItems = anyData.forecast.list;
            }
          }
          
          // Try other common structures if we still don't have items
          if (forecastItems.length === 0) {
            if (Array.isArray(anyData.list)) {
              forecastItems = anyData.list;
            } else if (anyData.daily && Array.isArray(anyData.daily)) {
              forecastItems = anyData.daily;
            }
          }
          
          // Map the items to our expected format
          return forecastItems.map((item: any, index: number) => {
            // Extract date
            let dateValue = item.date || new Date(Date.now() + index * 86400000).toISOString().split('T')[0];
            
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
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Weather Forecast</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">View detailed 5-day weather forecasts for any location</p>
          </div>
          
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
