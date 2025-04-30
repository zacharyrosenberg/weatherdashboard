// Use ES modules imports
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';

// Initialize DynamoDB client
const client = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(client);
const CACHE_TABLE = 'WeatherDashboard-Cache';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY';

export const handler = async (event) => {
    try {
        // Parse the incoming request
        const locationId = event.queryStringParameters?.locationId || 
                          event.pathParameters?.locationId;
                          
        // If no location provided, return error
        if (!locationId) {
            return formatResponse(400, { message: 'Location ID is required' });
        }
        
        console.log('Fetching weather for location:', locationId);
        
        // Try to get cached data first
        const cachedData = await getWeatherFromCache(locationId);
        if (cachedData) {
            console.log('Returning cached data');
            return formatResponse(200, cachedData);
        }
        
        // If no cached data, fetch from API
        console.log('No cache found, fetching from API');
        const weatherData = await fetchWeatherFromAPI(locationId);
        
        // Cache the result
        await cacheWeatherData(locationId, weatherData);
        
        return formatResponse(200, weatherData);
    } catch (error) {
        console.error('Error:', error);
        return formatResponse(500, { message: 'Error fetching weather data', error: error.message });
    }
};

async function getWeatherFromCache(locationId) {
    const params = {
        TableName: CACHE_TABLE,
        Key: {
            LocationId: locationId,
            DataType: 'current'
        }
    };
    
    try {
        const result = await dynamoDB.send(new GetCommand(params));
        
        // Check if we have valid cached data that isn't expired
        if (result.Item && result.Item.Timestamp) {
            const timestamp = new Date(result.Item.Timestamp);
            const now = new Date();
            
            // If data is less than 30 minutes old, use it
            if ((now - timestamp) < 30 * 60 * 1000) {
                return result.Item.Data;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Cache retrieval error:', error);
        return null; // Proceed to fetch from API if cache retrieval fails
    }
}

async function fetchWeatherFromAPI(locationId) {
    try {
        // Check if locationId is coordinates or city name
        let url;
        if (locationId.includes(',')) {
            // Assume it's lat,lon
            const [lat, lon] = locationId.split(',');
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`;
            console.log(`Using coordinates: lat=${lat}, lon=${lon}`);
        } else {
            // Assume it's a city name or ID
            const encodedLocation = encodeURIComponent(locationId);
            console.log(`Encoded location query: ${encodedLocation}`);
            url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&appid=${WEATHER_API_KEY}&units=imperial`;
        }
        
        console.log('Fetching from URL:', url.replace(WEATHER_API_KEY, 'API_KEY_HIDDEN'));
        const response = await axios.get(url);
        console.log(`Weather API response status: ${response.status}`);
        
        // Format the response data
        return {
            location: {
                name: response.data.name,
                country: response.data.sys.country,
                coordinates: {
                    lat: response.data.coord.lat,
                    lon: response.data.coord.lon
                }
            },
            current: {
                temperature: {
                    actual: response.data.main.temp,
                    feelsLike: response.data.main.feels_like,
                    min: response.data.main.temp_min,
                    max: response.data.main.temp_max
                },
                humidity: response.data.main.humidity,
                wind: {
                    speed: response.data.wind.speed,
                    direction: response.data.wind.deg
                },
                weather: {
                    main: response.data.weather[0].main,
                    description: response.data.weather[0].description,
                    icon: response.data.weather[0].icon
                },
                clouds: response.data.clouds.all,
                timestamp: new Date(response.data.dt * 1000).toISOString()
            }
        };
    } catch (error) {
        console.error('API fetch error:', error);
        
        // Log more detailed error information
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`Error response status: ${error.response.status}`);
            console.error(`Error response data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from API');
        }
        
        throw new Error('Failed to fetch weather data from API: ' + error.message);
    }
}

async function cacheWeatherData(locationId, weatherData) {
    const params = {
        TableName: CACHE_TABLE,
        Item: {
            LocationId: locationId,
            DataType: 'current',
            Data: weatherData,
            Timestamp: new Date().toISOString(),
            TTL: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour TTL
        }
    };
    
    try {
        await dynamoDB.send(new PutCommand(params));
        console.log('Weather data cached successfully');
    } catch (error) {
        console.error('Cache storage error:', error);
        // We'll still return the data even if caching fails
    }
}

function formatResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Required for CORS
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(body)
    };
} 