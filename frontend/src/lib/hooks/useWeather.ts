import { useState, useEffect } from 'react';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  CurrentWeatherResponse, 
  ForecastResponse 
} from '../api/weatherApi';

// Hook for fetching current weather
export function useCurrentWeather(locationId: string) {
  const [data, setData] = useState<CurrentWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const weatherData = await fetchCurrentWeather(locationId);
        setData(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locationId]);

  return { data, isLoading, error };
}

// Hook for fetching forecast
export function useForecast(locationId: string, days: number = 5) {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const forecastData = await fetchForecast(locationId, days);
        setData(forecastData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locationId, days]);

  return { data, isLoading, error };
} 