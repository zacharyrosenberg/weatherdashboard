// API base URL - use environment variable or default for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Types for API responses
export interface CurrentWeatherResponse {
  location: {
    name: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  current: {
    temperature: {
      actual: number;
      feelsLike: number;
      min: number;
      max: number;
    };
    humidity: number;
    wind: {
      speed: number;
      direction: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    clouds: number;
    timestamp: string;
  };
}

export interface ForecastDay {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  weather: string;
  description: string;
  icon: string;
  precipitation: number;
}

export interface ForecastResponse {
  location: {
    name: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  forecast: ForecastDay[];
  timestamp: string;
}

// Fetch current weather data
export async function fetchCurrentWeather(locationId: string): Promise<CurrentWeatherResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/weather?locationId=${encodeURIComponent(locationId)}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Fetch forecast data
export async function fetchForecast(locationId: string, days: number = 5): Promise<ForecastResponse> {
  try {
    const url = `${API_BASE_URL}/forecast?locationId=${encodeURIComponent(locationId)}&days=${days}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Additional validation to make sure we got a valid response
    if (!data) {
      throw new Error('Invalid forecast data format received from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
}

// Fetch saved locations (will be implemented when auth is added)
export async function fetchSavedLocations(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    
    if (!response.ok) {
      throw new Error(`Locations API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.locations || [];
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    throw error;
  }
} 